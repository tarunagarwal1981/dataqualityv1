import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  QUALITY_GRADES,
  QUALITY_THRESHOLDS,
  ALERT_TYPES,
} from '../utils/constants.js';
import { validateKPIValue, checkKPIAlarm } from '../data/kpiDefinitions.js';

/**
 * Custom hook for data quality monitoring and assessment
 * Provides quality metrics, alerts, and validation functions
 */
export const useDataQuality = (data = [], filters = {}) => {
  const [qualitySettings, setQualitySettings] = useState({
    enableRealTimeChecks: true,
    alertThreshold: QUALITY_THRESHOLDS.COMPLETENESS.ACCEPTABLE,
    autoRefresh: true,
    showMinorIssues: false,
  });

  const [alerts, setAlerts] = useState([]);
  const [qualityHistory, setQualityHistory] = useState([]);

  // Calculate overall quality metrics
  const qualityMetrics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        overall: {
          completeness: 0,
          correctness: 0,
          grade: QUALITY_GRADES.POOR,
          score: 0,
        },
        byDataType: {
          lf: { completeness: 0, correctness: 0, grade: QUALITY_GRADES.POOR },
          hf: { completeness: 0, correctness: 0, grade: QUALITY_GRADES.POOR },
        },
        byVessel: {},
        byKPI: {},
        trends: { improving: 0, stable: 0, degrading: 0 },
        issueTypes: {},
        lastAssessment: null,
      };
    }

    const totalRecords = data.length;
    const metrics = {
      overall: {
        completeness: 0,
        correctness: 0,
        grade: QUALITY_GRADES.POOR,
        score: 0,
      },
      byDataType: {
        lf: { completeness: 0, correctness: 0, grade: QUALITY_GRADES.POOR },
        hf: { completeness: 0, correctness: 0, grade: QUALITY_GRADES.POOR },
      },
      byVessel: {},
      byKPI: {},
      trends: { improving: 0, stable: 0, degrading: 0 },
      issueTypes: {},
      lastAssessment: new Date().toISOString(),
    };

    // Calculate by data type
    ['lf', 'hf'].forEach((dataType) => {
      const completenessSum = data.reduce(
        (sum, record) => sum + (record.quality?.completeness[dataType] || 0),
        0
      );
      const correctnessSum = data.reduce(
        (sum, record) => sum + (record.quality?.correctness[dataType] || 0),
        0
      );

      metrics.byDataType[dataType].completeness =
        completenessSum / totalRecords;
      metrics.byDataType[dataType].correctness = correctnessSum / totalRecords;
      metrics.byDataType[dataType].grade = calculateQualityGrade(
        metrics.byDataType[dataType].completeness,
        metrics.byDataType[dataType].correctness
      );
    });

    // Calculate overall metrics
    metrics.overall.completeness =
      (metrics.byDataType.lf.completeness +
        metrics.byDataType.hf.completeness) /
      2;
    metrics.overall.correctness =
      (metrics.byDataType.lf.correctness + metrics.byDataType.hf.correctness) /
      2;
    metrics.overall.grade = calculateQualityGrade(
      metrics.overall.completeness,
      metrics.overall.correctness
    );
    metrics.overall.score =
      (metrics.overall.completeness + metrics.overall.correctness) / 2;

    // Calculate by vessel
    const vesselGroups = data.reduce((acc, record) => {
      if (!acc[record.vesselId]) {
        acc[record.vesselId] = {
          name: record.vesselName,
          records: [],
        };
      }
      acc[record.vesselId].records.push(record);
      return acc;
    }, {});

    Object.entries(vesselGroups).forEach(([vesselId, vesselData]) => {
      const vesselRecords = vesselData.records;
      const vesselMetrics = {
        name: vesselData.name,
        recordCount: vesselRecords.length,
        lf: { completeness: 0, correctness: 0 },
        hf: { completeness: 0, correctness: 0 },
        issues: 0,
        alerts: 0,
        grade: QUALITY_GRADES.POOR,
      };

      ['lf', 'hf'].forEach((dataType) => {
        const completeness =
          vesselRecords.reduce(
            (sum, record) =>
              sum + (record.quality?.completeness[dataType] || 0),
            0
          ) / vesselRecords.length;
        const correctness =
          vesselRecords.reduce(
            (sum, record) => sum + (record.quality?.correctness[dataType] || 0),
            0
          ) / vesselRecords.length;

        vesselMetrics[dataType] = { completeness, correctness };
      });

      // Count issues and alerts for vessel
      vesselMetrics.issues = vesselRecords.reduce(
        (sum, record) => sum + (record.quality?.issues?.length || 0),
        0
      );
      vesselMetrics.alerts = vesselRecords.reduce(
        (sum, record) => sum + (record.quality?.alerts?.length || 0),
        0
      );

      // Overall vessel grade
      const avgCompleteness =
        (vesselMetrics.lf.completeness + vesselMetrics.hf.completeness) / 2;
      const avgCorrectness =
        (vesselMetrics.lf.correctness + vesselMetrics.hf.correctness) / 2;
      vesselMetrics.grade = calculateQualityGrade(
        avgCompleteness,
        avgCorrectness
      );

      metrics.byVessel[vesselId] = vesselMetrics;
    });

    // Count issue types
    data.forEach((record) => {
      if (record.quality?.issues) {
        record.quality.issues.forEach((issue) => {
          if (issue.includes('Missing')) {
            metrics.issueTypes.missing = (metrics.issueTypes.missing || 0) + 1;
          } else if (issue.includes('out of range')) {
            metrics.issueTypes.outOfRange =
              (metrics.issueTypes.outOfRange || 0) + 1;
          } else if (issue.includes('cross-validation')) {
            metrics.issueTypes.crossValidation =
              (metrics.issueTypes.crossValidation || 0) + 1;
          } else {
            metrics.issueTypes.other = (metrics.issueTypes.other || 0) + 1;
          }
        });
      }
    });

    return metrics;
  }, [data]);

  // Generate quality alerts based on current data
  const generateQualityAlerts = useCallback(() => {
    if (!data || data.length === 0) return [];

    const newAlerts = [];
    const now = new Date().toISOString();

    // Check overall quality degradation
    if (qualityMetrics.overall.completeness < qualitySettings.alertThreshold) {
      newAlerts.push({
        id: `quality_${Date.now()}_1`,
        type: ALERT_TYPES.QUALITY_DEGRADATION,
        severity:
          qualityMetrics.overall.completeness < 70 ? 'critical' : 'warning',
        title: 'Data Completeness Below Threshold',
        message: `Overall data completeness is ${qualityMetrics.overall.completeness.toFixed(
          1
        )}%`,
        timestamp: now,
        affectedVessels: Object.keys(qualityMetrics.byVessel),
        actionRequired: true,
      });
    }

    // Check individual vessel quality issues
    Object.entries(qualityMetrics.byVessel).forEach(
      ([vesselId, vesselMetrics]) => {
        const avgCompleteness =
          (vesselMetrics.lf.completeness + vesselMetrics.hf.completeness) / 2;

        if (avgCompleteness < qualitySettings.alertThreshold) {
          newAlerts.push({
            id: `vessel_quality_${vesselId}_${Date.now()}`,
            type: ALERT_TYPES.QUALITY_DEGRADATION,
            severity: avgCompleteness < 70 ? 'critical' : 'warning',
            title: `${vesselMetrics.name} Quality Issue`,
            message: `Data completeness: ${avgCompleteness.toFixed(1)}%`,
            timestamp: now,
            affectedVessels: [vesselId],
            actionRequired: true,
          });
        }
      }
    );

    // Check for missing data patterns
    const recentMissingData = data
      .filter((record) => {
        const recordDate = new Date(record.date);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return recordDate >= threeDaysAgo;
      })
      .filter(
        (record) =>
          (record.quality?.completeness?.lf || 0) < 50 ||
          (record.quality?.completeness?.hf || 0) < 50
      );

    if (recentMissingData.length > 0) {
      const affectedVessels = [
        ...new Set(recentMissingData.map((r) => r.vesselId)),
      ];

      newAlerts.push({
        id: `missing_data_${Date.now()}`,
        type: ALERT_TYPES.MISSING_DATA,
        severity: 'warning',
        title: 'Recent Missing Data Detected',
        message: `${recentMissingData.length} records with significant missing data in last 3 days`,
        timestamp: now,
        affectedVessels,
        actionRequired: false,
      });
    }

    return newAlerts;
  }, [data, qualityMetrics, qualitySettings]);

  // Update quality history for trend analysis
  const updateQualityHistory = useCallback(() => {
    if (!qualityMetrics.overall.score) return;

    setQualityHistory((prev) => {
      const newEntry = {
        timestamp: new Date().toISOString(),
        completeness: qualityMetrics.overall.completeness,
        correctness: qualityMetrics.overall.correctness,
        score: qualityMetrics.overall.score,
        grade: qualityMetrics.overall.grade,
        issueCount: Object.values(qualityMetrics.issueTypes).reduce(
          (sum, count) => sum + count,
          0
        ),
      };

      // Keep only last 30 entries
      const updated = [...prev, newEntry].slice(-30);
      return updated;
    });
  }, [qualityMetrics]);

  // Calculate quality trends
  const qualityTrends = useMemo(() => {
    if (qualityHistory.length < 5) {
      return {
        completeness: 'stable',
        correctness: 'stable',
        overall: 'stable',
        direction: 0,
      };
    }

    const recent = qualityHistory.slice(-5);
    const older = qualityHistory.slice(-10, -5);

    const recentAvg = {
      completeness:
        recent.reduce((sum, entry) => sum + entry.completeness, 0) /
        recent.length,
      correctness:
        recent.reduce((sum, entry) => sum + entry.correctness, 0) /
        recent.length,
      score:
        recent.reduce((sum, entry) => sum + entry.score, 0) / recent.length,
    };

    const olderAvg = {
      completeness:
        older.reduce((sum, entry) => sum + entry.completeness, 0) /
        older.length,
      correctness:
        older.reduce((sum, entry) => sum + entry.correctness, 0) / older.length,
      score: older.reduce((sum, entry) => sum + entry.score, 0) / older.length,
    };

    const calculateTrend = (recent, older) => {
      const change = ((recent - older) / older) * 100;
      if (Math.abs(change) < 2) return 'stable';
      return change > 0 ? 'improving' : 'degrading';
    };

    return {
      completeness: calculateTrend(
        recentAvg.completeness,
        olderAvg.completeness
      ),
      correctness: calculateTrend(recentAvg.correctness, olderAvg.correctness),
      overall: calculateTrend(recentAvg.score, olderAvg.score),
      direction: recentAvg.score - olderAvg.score,
    };
  }, [qualityHistory]);

  // Perform quality assessment
  const performQualityAssessment = useCallback(
    (assessmentData = data) => {
      const assessment = {
        timestamp: new Date().toISOString(),
        recordsAnalyzed: assessmentData.length,
        issues: [],
        recommendations: [],
        summary: {},
      };

      // Analyze data patterns
      const dataTypeCompletion = { lf: [], hf: [] };

      assessmentData.forEach((record) => {
        ['lf', 'hf'].forEach((dataType) => {
          const completion = record.quality?.completeness[dataType] || 0;
          dataTypeCompletion[dataType].push(completion);
        });
      });

      // Identify systematic issues
      ['lf', 'hf'].forEach((dataType) => {
        const completions = dataTypeCompletion[dataType];
        const avgCompletion =
          completions.reduce((sum, val) => sum + val, 0) / completions.length;

        if (avgCompletion < 80) {
          assessment.issues.push({
            type: 'systematic_incompleteness',
            dataType,
            severity: avgCompletion < 60 ? 'critical' : 'warning',
            description: `${dataType.toUpperCase()} data showing systematic incompleteness (${avgCompletion.toFixed(
              1
            )}%)`,
          });

          assessment.recommendations.push({
            priority: 'high',
            action: `Review ${dataType.toUpperCase()} data collection processes`,
            impact: 'Will improve overall data quality and reliability',
          });
        }
      });

      // Check for vessel-specific issues
      Object.entries(qualityMetrics.byVessel).forEach(([vesselId, metrics]) => {
        if (metrics.issues > metrics.recordCount * 0.3) {
          assessment.issues.push({
            type: 'vessel_quality_issue',
            vesselId,
            vesselName: metrics.name,
            severity: 'warning',
            description: `${metrics.name} has high issue rate (${metrics.issues} issues in ${metrics.recordCount} records)`,
          });
        }
      });

      assessment.summary = {
        overallGrade: qualityMetrics.overall.grade,
        criticalIssues: assessment.issues.filter(
          (issue) => issue.severity === 'critical'
        ).length,
        warningIssues: assessment.issues.filter(
          (issue) => issue.severity === 'warning'
        ).length,
        recommendationCount: assessment.recommendations.length,
      };

      return assessment;
    },
    [data, qualityMetrics]
  );

  // Validate a single data record
  const validateRecord = useCallback((record, kpis) => {
    const validation = {
      isValid: true,
      errors: [],
      warnings: [],
      score: 100,
    };

    ['lf', 'hf'].forEach((dataType) => {
      const dataKPIs = kpis[dataType] || [];
      const recordData = record[dataType] || {};

      dataKPIs.forEach((kpi) => {
        const value = recordData[kpi.id];

        if (value === null || value === undefined) {
          validation.warnings.push(
            `Missing ${kpi.name} (${dataType.toUpperCase()})`
          );
          validation.score -= 5;
        } else {
          const kpiValidation = validateKPIValue(value, kpi.id, dataType);
          if (!kpiValidation.isValid) {
            validation.errors.push(`${kpi.name}: ${kpiValidation.reason}`);
            validation.isValid = false;
            validation.score -= 10;
          }

          // Check HF alarms
          if (dataType === 'hf') {
            const alarmCheck = checkKPIAlarm(value, kpi.id);
            if (alarmCheck.hasAlarm) {
              validation.warnings.push(alarmCheck.message);
              validation.score -= 3;
            }
          }
        }
      });
    });

    validation.score = Math.max(0, validation.score);
    return validation;
  }, []);

  // Effect to update alerts when quality changes
  useEffect(() => {
    if (qualitySettings.enableRealTimeChecks && data.length > 0) {
      const newAlerts = generateQualityAlerts();
      setAlerts((prev) => {
        // Merge new alerts, avoiding duplicates
        const existing = prev.map((alert) => alert.id);
        const unique = newAlerts.filter(
          (alert) => !existing.includes(alert.id)
        );
        return [...prev, ...unique].slice(-50); // Keep last 50 alerts
      });
    }
  }, [
    qualityMetrics,
    generateQualityAlerts,
    qualitySettings.enableRealTimeChecks,
    data.length,
  ]);

  // Effect to update quality history
  useEffect(() => {
    if (qualitySettings.autoRefresh && qualityMetrics.overall.score > 0) {
      updateQualityHistory();
    }
  }, [
    qualityMetrics.lastAssessment,
    updateQualityHistory,
    qualitySettings.autoRefresh,
  ]);

  // Dismiss an alert
  const dismissAlert = useCallback((alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  }, []);

  // Clear all alerts
  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Update quality settings
  const updateQualitySettings = useCallback((newSettings) => {
    setQualitySettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    // Quality metrics
    qualityMetrics,
    qualityTrends,
    qualityHistory,

    // Alerts
    alerts,
    alertCount: alerts.length,
    criticalAlerts: alerts.filter((alert) => alert.severity === 'critical'),

    // Settings
    qualitySettings,
    updateQualitySettings,

    // Operations
    performQualityAssessment,
    validateRecord,
    generateQualityAlerts,
    dismissAlert,
    clearAllAlerts,

    // State checks
    hasQualityIssues: qualityMetrics.overall.grade !== QUALITY_GRADES.GOOD,
    hasCriticalIssues: alerts.some((alert) => alert.severity === 'critical'),
    isQualityImproving: qualityTrends.overall === 'improving',
    qualityScore: qualityMetrics.overall.score,
  };
};

// Helper function to calculate quality grade
const calculateQualityGrade = (completeness, correctness) => {
  if (
    completeness >= QUALITY_THRESHOLDS.COMPLETENESS.GOOD &&
    correctness >= QUALITY_THRESHOLDS.CORRECTNESS.GOOD
  ) {
    return QUALITY_GRADES.GOOD;
  } else if (
    completeness >= QUALITY_THRESHOLDS.COMPLETENESS.ACCEPTABLE &&
    correctness >= QUALITY_THRESHOLDS.CORRECTNESS.ACCEPTABLE
  ) {
    return QUALITY_GRADES.ACCEPTABLE;
  } else {
    return QUALITY_GRADES.POOR;
  }
};

export default useDataQuality;

import { VESSELS, getVesselPerformanceProfile } from './vesselData.js';
import {
  LF_KPIS,
  HF_KPIS,
  validateKPIValue,
  checkKPIAlarm,
} from './kpiDefinitions.js';
import { QUALITY_GRADES, VESSEL_STATUS } from '../utils/constants.js';

// Generate realistic maritime operational data
export const generateMaritimeData = () => {
  const data = [];
  const now = new Date();

  // Generate data for last 30 days
  for (let day = 29; day >= 0; day--) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);

    VESSELS.forEach((vessel) => {
      const dayData = {
        id: `${vessel.id}-${date.toISOString().split('T')[0]}`,
        vesselId: vessel.id,
        vesselName: vessel.name,
        vesselType: vessel.type,
        vesselFlag: vessel.flag,
        vesselIMO: vessel.imo,
        vesselStatus: vessel.status,
        date: date.toISOString().split('T')[0],
        timestamp: date.toISOString(),
        lf: {},
        hf: {},
        quality: {
          completeness: { lf: 0, hf: 0 },
          correctness: { lf: 0, hf: 0 },
          grade: { lf: QUALITY_GRADES.GOOD, hf: QUALITY_GRADES.GOOD },
          issues: [],
          alerts: [],
          lastUpdated: new Date(
            date.getTime() + Math.random() * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
        location: {
          latitude:
            vessel.currentLocation.latitude + (Math.random() - 0.5) * 10,
          longitude:
            vessel.currentLocation.longitude + (Math.random() - 0.5) * 10,
          course: Math.random() * 360,
          heading: Math.random() * 360,
        },
      };

      // Get vessel performance profile for realistic data generation
      const performanceProfile = getVesselPerformanceProfile(vessel.type);

      // Generate LF (Low Frequency) data with realistic patterns
      LF_KPIS.forEach((kpi) => {
        let value = generateRealisticValue(
          kpi,
          vessel,
          performanceProfile,
          day
        );

        // Apply vessel status effects
        value = applyVesselStatusEffects(value, kpi, vessel.status);

        // Introduce quality issues occasionally
        const qualityIssue = introduceQualityIssues(value, kpi, 0.02); // 2% chance
        if (qualityIssue.hasIssue) {
          value = qualityIssue.value;
          dayData.quality.issues.push(qualityIssue.message);
        }

        dayData.lf[kpi.id] = value;
      });

      // Generate HF (High Frequency) data
      HF_KPIS.forEach((kpi) => {
        let value = generateRealisticValue(
          kpi,
          vessel,
          performanceProfile,
          day
        );

        // Apply vessel status effects
        value = applyVesselStatusEffects(value, kpi, vessel.status);

        // Introduce quality issues
        const qualityIssue = introduceQualityIssues(value, kpi, 0.015); // 1.5% chance
        if (qualityIssue.hasIssue) {
          value = qualityIssue.value;
          dayData.quality.issues.push(qualityIssue.message);
        }

        // Check for alarms (HF data only)
        const alarmCheck = checkKPIAlarm(value, kpi.id);
        if (alarmCheck.hasAlarm) {
          dayData.quality.alerts.push({
            type: alarmCheck.type,
            kpi: kpi.id,
            message: alarmCheck.message,
            value: value,
            timestamp: dayData.timestamp,
          });
        }

        dayData.hf[kpi.id] = value;
      });

      // Perform cross-validation between LF and HF data
      performCrossValidation(dayData);

      // Calculate quality scores
      calculateQualityScores(dayData);

      data.push(dayData);
    });
  }

  return { vessels: VESSELS, kpis: { lf: LF_KPIS, hf: HF_KPIS }, data };
};

// Generate realistic values based on KPI type and vessel characteristics
const generateRealisticValue = (kpi, vessel, performanceProfile, dayOffset) => {
  const { range } = kpi;
  let baseValue;

  // Seasonal and daily variations
  const seasonalFactor = 1 + 0.1 * Math.sin((dayOffset / 365) * 2 * Math.PI);
  const dailyVariation = 1 + (Math.random() - 0.5) * 0.2;

  switch (kpi.id) {
    case 'fuel_consumption':
      baseValue = performanceProfile.fuelConsumption.eco * seasonalFactor;
      if (vessel.type === 'Oil Tanker') baseValue *= 1.3;
      if (vessel.type === 'LNG Carrier') baseValue *= 0.9;
      break;

    case 'distance':
      baseValue =
        range.min + (range.max - range.min) * (0.6 + Math.random() * 0.3);
      break;

    case 'avg_speed':
      baseValue =
        performanceProfile.avgSpeed.optimal * (0.8 + Math.random() * 0.4);
      break;

    case 'cargo_weight':
      const utilization = 0.7 + Math.random() * 0.25; // 70-95% utilization
      baseValue = vessel.dwt * utilization;
      break;

    case 'crew_count':
      baseValue = vessel.crew.current || vessel.crew.capacity * 0.9;
      break;

    case 'port_calls':
      baseValue = Math.floor(Math.random() * 3);
      break;

    case 'voyage_time':
      baseValue = 18 + Math.random() * 6; // 18-24 hours
      break;

    case 'weather_force':
      baseValue = 2 + Math.random() * 4; // Beaufort 2-6
      break;

    case 'co2_emissions':
      const fuelConsumption = performanceProfile.fuelConsumption.eco || 50;
      baseValue = fuelConsumption * 3.2; // Approximate CO2 factor
      break;

    case 'efficiency_ratio':
      const distance = 400 + Math.random() * 200;
      const fuel = performanceProfile.fuelConsumption.eco || 50;
      baseValue = (fuel * 1000) / distance; // g/NM
      break;

    case 'engine_rpm':
      const speedFactor = Math.random() * 0.8 + 0.2; // 20-100% speed
      baseValue = vessel.engines.main.rpm * speedFactor;
      break;

    case 'fuel_rate':
      // Correlated with engine load
      const loadFactor = 0.4 + Math.random() * 0.5;
      baseValue = range.min + (range.max - range.min) * loadFactor;
      break;

    case 'engine_temp':
      // Higher temp with higher load
      const tempBase = 75; // Base temperature
      const loadTemp = 20 * (Math.random() * 0.5 + 0.3); // Load-dependent increase
      baseValue = tempBase + loadTemp;
      break;

    case 'oil_pressure':
      baseValue = 4.5 + Math.random() * 1.5; // 4.5-6 bar typical
      break;

    case 'wind_speed':
      // Realistic weather patterns
      baseValue = 5 + Math.random() * 15 + 5 * Math.sin(dayOffset * 0.1);
      break;

    case 'sea_state':
      // Correlated with wind speed - using a reasonable default
      const estimatedWindSpeed = 10 + Math.random() * 10;
      baseValue = Math.min(9, estimatedWindSpeed / 5);
      break;

    case 'shaft_power':
      const rpmFactor = 0.6 + Math.random() * 0.3;
      baseValue = vessel.engines.main.power * rpmFactor;
      break;

    case 'exhaust_temp':
      baseValue = 350 + Math.random() * 100; // 350-450°C typical
      break;

    case 'turbo_rpm':
      baseValue = 15000 + Math.random() * 5000; // 15k-20k rpm typical
      break;

    case 'cylinder_pressure':
      baseValue = 120 + Math.random() * 40; // 120-160 bar typical
      break;

    default:
      // Default random generation within range
      baseValue =
        range.min + (range.max - range.min) * (0.3 + Math.random() * 0.4);
  }

  // Apply daily variation
  baseValue *= dailyVariation;

  // Ensure value stays within valid range
  return Math.max(range.min, Math.min(range.max, baseValue));
};

// Apply effects based on vessel operational status
const applyVesselStatusEffects = (value, kpi, status) => {
  if (value === null || value === undefined) return value;

  switch (status) {
    case VESSEL_STATUS.IN_PORT:
      if (kpi.id === 'avg_speed') return 0; // No speed in port
      if (kpi.id === 'distance') return 0; // No distance in port
      if (kpi.id === 'engine_rpm') return kpi.range.min * 0.1; // Minimal RPM
      if (kpi.id === 'fuel_consumption') return value * 0.2; // Reduced fuel consumption
      if (kpi.id === 'port_calls') return Math.min(2, value + 1); // More port calls
      break;

    case VESSEL_STATUS.MAINTENANCE:
      if (kpi.category === 'Engine') return kpi.range.min; // Minimal engine values
      if (kpi.id === 'fuel_consumption') return value * 0.05; // Very low fuel consumption
      if (kpi.id === 'avg_speed') return 0;
      if (kpi.id === 'distance') return 0;
      break;

    case VESSEL_STATUS.ACTIVE:
      // Normal operations - no modification
      break;
  }

  return value;
};

// Introduce quality issues (missing data, out of range values)
const introduceQualityIssues = (value, kpi, probability) => {
  const rand = Math.random();

  if (rand < probability * 0.6) {
    // 60% of issues are missing data
    return {
      hasIssue: true,
      value: null,
      message: `Missing ${kpi.name} data`,
    };
  }

  if (rand < probability) {
    // Remaining 40% are out of range values
    const outOfRangeValue =
      Math.random() > 0.5
        ? kpi.range.min - Math.random() * (kpi.range.max - kpi.range.min) * 0.1
        : kpi.range.max + Math.random() * (kpi.range.max - kpi.range.min) * 0.1;

    return {
      hasIssue: true,
      value: outOfRangeValue,
      message: `${kpi.name} out of range: ${outOfRangeValue.toFixed(2)} ${
        kpi.unit
      }`,
    };
  }

  return { hasIssue: false, value };
};

// Perform cross-validation between LF and HF data
const performCrossValidation = (dayData) => {
  // Validate fuel consumption consistency between LF and HF data
  if (dayData.lf.fuel_consumption && dayData.hf.fuel_rate) {
    const lfDaily = dayData.lf.fuel_consumption; // MT per day
    const hfDaily = (dayData.hf.fuel_rate * 24) / 1000; // Convert L/h to MT/day (approx)

    const deviation = (Math.abs(lfDaily - hfDaily) / lfDaily) * 100;

    if (deviation > 15) {
      // 15% threshold for cross-validation
      dayData.quality.issues.push(
        `Fuel consumption cross-validation failed: LF ${lfDaily.toFixed(
          1
        )}MT vs HF ${hfDaily.toFixed(1)}MT (${deviation.toFixed(1)}% deviation)`
      );
    }
  }

  // Validate speed and RPM correlation
  if (dayData.lf.avg_speed && dayData.hf.engine_rpm) {
    const expectedRPMRange = dayData.lf.avg_speed * 30; // Rough correlation
    const actualRPM = dayData.hf.engine_rpm;

    if (
      dayData.lf.avg_speed > 5 &&
      (actualRPM < expectedRPMRange * 0.5 || actualRPM > expectedRPMRange * 2)
    ) {
      dayData.quality.issues.push(
        `Speed-RPM correlation inconsistent: ${dayData.lf.avg_speed.toFixed(
          1
        )} kn vs ${actualRPM.toFixed(0)} RPM`
      );
    }
  }
};

// Calculate completeness and correctness scores
const calculateQualityScores = (dayData) => {
  ['lf', 'hf'].forEach((dataType) => {
    const kpisList = dataType === 'lf' ? LF_KPIS : HF_KPIS;
    const values = Object.values(dayData[dataType]);

    // Calculate completeness
    const totalExpected = kpisList.length;
    const received = values.filter((v) => v !== null && v !== undefined).length;
    dayData.quality.completeness[dataType] =
      totalExpected > 0 ? (received / totalExpected) * 100 : 0;

    // Calculate correctness
    const validValues = values.filter((value, index) => {
      if (value === null || value === undefined) return false;
      const kpi = kpisList[index];
      return value >= kpi.range.min && value <= kpi.range.max;
    }).length;

    dayData.quality.correctness[dataType] =
      received > 0 ? (validValues / received) * 100 : 100;

    // Determine quality grade
    const completeness = dayData.quality.completeness[dataType];
    const correctness = dayData.quality.correctness[dataType];

    if (completeness >= 95 && correctness >= 98) {
      dayData.quality.grade[dataType] = QUALITY_GRADES.GOOD;
    } else if (completeness >= 85 && correctness >= 90) {
      dayData.quality.grade[dataType] = QUALITY_GRADES.ACCEPTABLE;
    } else {
      dayData.quality.grade[dataType] = QUALITY_GRADES.POOR;
    }
  });

  // Clean up issues if quality is good
  if (
    dayData.quality.grade.lf === QUALITY_GRADES.GOOD &&
    dayData.quality.grade.hf === QUALITY_GRADES.GOOD
  ) {
    dayData.quality.issues = dayData.quality.issues.filter(
      (issue) =>
        issue.includes('out of range') || issue.includes('cross-validation')
    );
  }
};

// Generate aggregated data for different time periods
export const generateAggregatedData = (rawData, aggregationLevel = '24hr') => {
  // Implementation for different aggregation levels
  // This would be used for HF data aggregation
  return rawData; // Placeholder - implement aggregation logic
};

// Generate historical trend data
export const generateTrendData = (kpiId, vesselIds, days = 30) => {
  const trendData = [];
  const now = new Date();

  for (let day = days - 1; day >= 0; day--) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);

    vesselIds.forEach((vesselId) => {
      const vessel = VESSELS.find((v) => v.id === vesselId);
      if (vessel) {
        const kpi = [...LF_KPIS, ...HF_KPIS].find((k) => k.id === kpiId);
        if (kpi) {
          const performanceProfile = getVesselPerformanceProfile(vessel.type);
          const value = generateRealisticValue(
            kpi,
            vessel,
            performanceProfile,
            day
          );

          trendData.push({
            date: date.toISOString().split('T')[0],
            vesselId,
            vesselName: vessel.name,
            [kpiId]: value,
            timestamp: date.toISOString(),
          });
        }
      }
    });
  }

  return trendData;
};

// Generate quality statistics
export const generateQualityStatistics = (data) => {
  if (!data || data.length === 0) {
    return {
      overall: { completeness: 0, correctness: 0, grade: QUALITY_GRADES.POOR },
      byVessel: {},
      byDataType: {
        lf: { completeness: 0, correctness: 0 },
        hf: { completeness: 0, correctness: 0 },
      },
      totalIssues: 0,
      totalAlerts: 0,
    };
  }

  const totalRecords = data.length;
  let totalIssues = 0;
  let totalAlerts = 0;

  const overallCompleteness = {
    lf:
      data.reduce((sum, record) => sum + record.quality.completeness.lf, 0) /
      totalRecords,
    hf:
      data.reduce((sum, record) => sum + record.quality.completeness.hf, 0) /
      totalRecords,
  };

  const overallCorrectness = {
    lf:
      data.reduce((sum, record) => sum + record.quality.correctness.lf, 0) /
      totalRecords,
    hf:
      data.reduce((sum, record) => sum + record.quality.correctness.hf, 0) /
      totalRecords,
  };

  // Count issues and alerts
  data.forEach((record) => {
    totalIssues += record.quality.issues.length;
    totalAlerts += record.quality.alerts ? record.quality.alerts.length : 0;
  });

  // Calculate by vessel statistics
  const byVessel = {};
  VESSELS.forEach((vessel) => {
    const vesselData = data.filter((record) => record.vesselId === vessel.id);
    if (vesselData.length > 0) {
      byVessel[vessel.id] = {
        name: vessel.name,
        completeness: {
          lf:
            vesselData.reduce(
              (sum, record) => sum + record.quality.completeness.lf,
              0
            ) / vesselData.length,
          hf:
            vesselData.reduce(
              (sum, record) => sum + record.quality.completeness.hf,
              0
            ) / vesselData.length,
        },
        correctness: {
          lf:
            vesselData.reduce(
              (sum, record) => sum + record.quality.correctness.lf,
              0
            ) / vesselData.length,
          hf:
            vesselData.reduce(
              (sum, record) => sum + record.quality.correctness.hf,
              0
            ) / vesselData.length,
        },
        issues: vesselData.reduce(
          (sum, record) => sum + record.quality.issues.length,
          0
        ),
        alerts: vesselData.reduce(
          (sum, record) =>
            sum + (record.quality.alerts ? record.quality.alerts.length : 0),
          0
        ),
      };
    }
  });

  // Overall grade calculation
  const avgCompleteness = (overallCompleteness.lf + overallCompleteness.hf) / 2;
  const avgCorrectness = (overallCorrectness.lf + overallCorrectness.hf) / 2;

  let overallGrade = QUALITY_GRADES.POOR;
  if (avgCompleteness >= 95 && avgCorrectness >= 98) {
    overallGrade = QUALITY_GRADES.GOOD;
  } else if (avgCompleteness >= 85 && avgCorrectness >= 90) {
    overallGrade = QUALITY_GRADES.ACCEPTABLE;
  }

  return {
    overall: {
      completeness: avgCompleteness,
      correctness: avgCorrectness,
      grade: overallGrade,
    },
    byVessel,
    byDataType: {
      lf: overallCompleteness.lf,
      hf: overallCompleteness.hf,
    },
    totalIssues,
    totalAlerts,
  };
};

export default {
  generateMaritimeData,
  generateAggregatedData,
  generateTrendData,
  generateQualityStatistics,
};

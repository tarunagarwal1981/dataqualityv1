// Constants and utilities for Fuel Anomaly Detection System
// This file contains all the configuration, thresholds, and utility functions

// Analysis Thresholds
export const ANOMALY_THRESHOLDS = {
    // Fuel consumption variance thresholds
    FUEL_VARIANCE: {
      LOW: 0.1,      // 10% variance triggers low alert
      MEDIUM: 0.2,   // 20% variance triggers medium alert  
      HIGH: 0.4      // 40% variance triggers high alert
    },
    
    // RPM reporting accuracy thresholds
    RPM_VARIANCE: {
      LOW: 0.05,     // 5% RPM inflation
      MEDIUM: 0.1,   // 10% RPM inflation
      HIGH: 0.2      // 20% RPM inflation
    },
    
    // Weather reporting accuracy
    WEATHER_VARIANCE: {
      ACCEPTABLE: 1,  // 1 Beaufort scale difference acceptable
      CONCERNING: 2,  // 2+ Beaufort scale difference concerning
      CRITICAL: 4     // 4+ Beaufort scale difference critical
    },
    
    // Sister vessel performance deviation
    SISTER_VESSEL_VARIANCE: {
      NORMAL: 0.1,    // 10% deviation is normal
      CONCERNING: 0.15, // 15% deviation is concerning
      CRITICAL: 0.3   // 30% deviation is critical
    },
    
    // Correlation thresholds
    CORRELATION: {
      FUEL_POWER_MIN: 0.7,    // Minimum expected fuel-power correlation
      RPM_ACCURACY_MIN: 0.9,  // Minimum expected RPM accuracy
      WEATHER_ACCURACY_MIN: 0.8 // Minimum expected weather accuracy
    }
  };
  
  // Risk scoring weights for different anomaly types
  export const RISK_WEIGHTS = {
    EXCESS_CONSUMPTION: 0.35,     // 35% weight - most critical
    STATIC_CONSUMPTION: 0.25,     // 25% weight - indicates manipulation
    RPM_INFLATION: 0.15,          // 15% weight - common manipulation
    WEATHER_MISREPORT: 0.10,      // 10% weight - supporting evidence
    POWER_MISMATCH: 0.10,         // 10% weight - efficiency concerns
    CORRELATION_BREAK: 0.05       // 5% weight - technical indicator
  };
  
  // Investigation priority matrix
  export const INVESTIGATION_MATRIX = {
    IMMEDIATE: {
      riskScore: 8.5,
      confidence: 0.9,
      excessFuel: 200,
      description: 'Immediate investigation required - high probability fraud'
    },
    URGENT: {
      riskScore: 7.0,
      confidence: 0.8,
      excessFuel: 100,
      description: 'Urgent investigation - likely anomalies detected'
    },
    SCHEDULED: {
      riskScore: 5.0,
      confidence: 0.6,
      excessFuel: 50,
      description: 'Schedule investigation - patterns warrant review'
    },
    MONITOR: {
      riskScore: 3.0,
      confidence: 0.4,
      excessFuel: 25,
      description: 'Continue monitoring - minor concerns identified'
    },
    NORMAL: {
      riskScore: 1.0,
      confidence: 0.2,
      excessFuel: 10,
      description: 'Normal operations - no significant anomalies'
    }
  };
  
  // Vessel similarity scoring factors for sister vessel selection
  export const SIMILARITY_FACTORS = {
    VESSEL_CLASS: 0.3,        // 30% weight for vessel class match
    DRY_DOCK_PERIOD: 0.25,    // 25% weight for similar maintenance schedule
    OPERATIONAL_ROUTE: 0.2,   // 20% weight for similar routes
    VESSEL_AGE: 0.15,         // 15% weight for similar age
    ENGINE_TYPE: 0.1          // 10% weight for engine type
  };
  
  // Anomaly pattern templates based on real cases
  export const FRAUD_PATTERNS = {
    EMPEROR_PAMPERO: {
      name: 'Static Consumption with Parameter Inflation',
      description: 'Fuel consumption remains artificially flat while RPM, weather, and power are over-reported',
      phases: [
        {
          phase: 1,
          duration: '2 months',
          description: 'Normal operations - baseline establishment',
          indicators: []
        },
        {
          phase: 2,
          duration: '1 month',
          description: 'Early manipulation - slight over-reporting begins',
          indicators: ['minor_rpm_inflation', 'weather_exaggeration']
        },
        {
          phase: 3,
          duration: '2 months',
          description: 'Clear manipulation - static consumption pattern emerges',
          indicators: ['static_fuel', 'rpm_inflation', 'weather_misreport']
        },
        {
          phase: 4,
          duration: '1+ months',
          description: 'Severe manipulation - multiple schemes active',
          indicators: ['static_fuel', 'high_rpm_inflation', 'systematic_misreport', 'physical_concealment']
        }
      ],
      totalExcess: 500, // MT
      detectionConfidence: 0.94
    },
    
    GRADUAL_SKIMMING: {
      name: 'Gradual Fuel Skimming',
      description: 'Small but consistent over-reporting without obvious pattern breaks',
      phases: [
        {
          phase: 1,
          duration: '1 month',
          description: 'Baseline establishment',
          indicators: []
        },
        {
          phase: 2,
          duration: '5+ months',
          description: 'Consistent small over-reporting',
          indicators: ['minor_excess', 'gradual_increase']
        }
      ],
      totalExcess: 150, // MT over 6 months
      detectionConfidence: 0.75
    }
  };
  
  // Export report templates
  export const REPORT_TEMPLATES = {
    EXECUTIVE_SUMMARY: {
      sections: [
        'risk_overview',
        'key_findings',
        'financial_impact',
        'recommendations'
      ],
      format: 'concise',
      audience: 'management'
    },
    
    TECHNICAL_ANALYSIS: {
      sections: [
        'methodology',
        'data_sources',
        'detailed_findings',
        'correlation_analysis',
        'timeline_reconstruction',
        'evidence_summary'
      ],
      format: 'detailed',
      audience: 'investigators'
    },
    
    OPERATIONAL_ALERT: {
      sections: [
        'immediate_concerns',
        'affected_vessels',
        'action_required',
        'monitoring_plan'
      ],
      format: 'actionable',
      audience: 'fleet_managers'
    }
  };
  
  // Utility Functions
  
  /**
   * Calculate overall risk score based on multiple factors
   */
  export const calculateRiskScore = (anomalies, vesselHistory, fleetBaseline) => {
    let score = 0;
    let weightSum = 0;
    
    anomalies.forEach(anomaly => {
      const weight = RISK_WEIGHTS[anomaly.type] || 0.1;
      const severityMultiplier = {
        'low': 1,
        'medium': 2,
        'high': 3
      }[anomaly.severity] || 1;
      
      score += (anomaly.value / 100) * weight * severityMultiplier;
      weightSum += weight;
    });
    
    // Normalize to 0-10 scale
    const baseScore = weightSum > 0 ? (score / weightSum) * 10 : 0;
    
    // Apply historical and fleet context adjustments
    const historyAdjustment = calculateHistoryAdjustment(vesselHistory);
    const fleetAdjustment = calculateFleetAdjustment(fleetBaseline);
    
    return Math.min(10, Math.max(0, baseScore * historyAdjustment * fleetAdjustment));
  };
  
  /**
   * Determine investigation priority based on risk factors
   */
  export const getInvestigationPriority = (riskScore, confidence, excessFuel) => {
    const priorities = Object.entries(INVESTIGATION_MATRIX).sort((a, b) => 
      b[1].riskScore - a[1].riskScore
    );
    
    for (const [priority, criteria] of priorities) {
      if (riskScore >= criteria.riskScore && 
          confidence >= criteria.confidence && 
          excessFuel >= criteria.excessFuel) {
        return {
          level: priority,
          ...criteria
        };
      }
    }
    
    return {
      level: 'NORMAL',
      ...INVESTIGATION_MATRIX.NORMAL
    };
  };
  
  /**
   * Calculate vessel similarity score for sister vessel suggestions
   */
  export const calculateVesselSimilarity = (vessel1, vessel2) => {
    let similarityScore = 0;
    
    // Vessel class similarity
    if (vessel1.class === vessel2.class) {
      similarityScore += SIMILARITY_FACTORS.VESSEL_CLASS;
    }
    
    // Dry dock period similarity (within 6 months)
    const dryDockDiff = Math.abs(
      new Date(vessel1.lastDryDock) - new Date(vessel2.lastDryDock)
    ) / (1000 * 60 * 60 * 24 * 30); // Convert to months
    
    if (dryDockDiff <= 6) {
      similarityScore += SIMILARITY_FACTORS.DRY_DOCK_PERIOD * (1 - dryDockDiff / 6);
    }
    
    // Route similarity
    const routeOverlap = calculateRouteOverlap(vessel1.routes, vessel2.routes);
    similarityScore += SIMILARITY_FACTORS.OPERATIONAL_ROUTE * routeOverlap;
    
    // Age similarity (within 5 years)
    const ageDiff = Math.abs(vessel1.age - vessel2.age);
    if (ageDiff <= 5) {
      similarityScore += SIMILARITY_FACTORS.VESSEL_AGE * (1 - ageDiff / 5);
    }
    
    // Engine type similarity
    if (vessel1.engineType === vessel2.engineType) {
      similarityScore += SIMILARITY_FACTORS.ENGINE_TYPE;
    }
    
    return Math.min(1, similarityScore);
  };
  
  /**
   * Generate anomaly confidence score
   */
  export const calculateAnomalyConfidence = (anomalies, dataQuality, timespan) => {
    if (anomalies.length === 0) return 0.1;
    
    // Base confidence from number and severity of anomalies
    let confidence = Math.min(0.6, anomalies.length * 0.1);
    
    // Boost confidence for high-severity anomalies
    const highSeverityCount = anomalies.filter(a => a.severity === 'high').length;
    confidence += highSeverityCount * 0.15;
    
    // Boost confidence for pattern consistency
    if (anomalies.length > 5) {
      confidence += 0.2; // Consistent pattern
    }
    
    // Adjust for data quality
    confidence *= (dataQuality.completeness / 100) * (dataQuality.accuracy / 100);
    
    // Adjust for timespan (longer periods = higher confidence)
    const timespanBonus = Math.min(0.2, timespan / 180); // Up to 20% bonus for 6+ months
    confidence += timespanBonus;
    
    return Math.min(0.99, Math.max(0.1, confidence));
  };
  
  /**
   * Format currency for financial impact reporting
   */
  export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  /**
   * Calculate financial impact of excess fuel
   */
  export const calculateFinancialImpact = (excessFuelMT, fuelPricePerMT = 600) => {
    const directCost = excessFuelMT * fuelPricePerMT;
    const investigationCost = 50000; // Estimated investigation cost
    const reputationalRisk = directCost * 0.5; // 50% of direct cost
    
    return {
      directCost,
      investigationCost,
      reputationalRisk,
      totalImpact: directCost + investigationCost + reputationalRisk
    };
  };
  
  // Helper functions (simplified implementations)
  const calculateHistoryAdjustment = (vesselHistory) => {
    // Vessels with prior issues get higher risk multiplier
    if (vesselHistory?.priorIssues > 0) {
      return 1 + (vesselHistory.priorIssues * 0.1);
    }
    return 1.0;
  };
  
  const calculateFleetAdjustment = (fleetBaseline) => {
    // Vessels performing significantly worse than fleet average
    if (fleetBaseline?.performanceRatio < 0.8) {
      return 1.2; // 20% increase in risk
    }
    return 1.0;
  };
  
  const calculateRouteOverlap = (routes1, routes2) => {
    if (!routes1 || !routes2) return 0;
    
    const overlap = routes1.filter(route => routes2.includes(route)).length;
    const total = new Set([...routes1, ...routes2]).size;
    
    return total > 0 ? overlap / total : 0;
  };
  
  // Export all utilities as a single object for easy importing
  export const FuelAnomalyUtils = {
    calculateRiskScore,
    getInvestigationPriority,
    calculateVesselSimilarity,
    calculateAnomalyConfidence,
    formatCurrency,
    calculateFinancialImpact
  };
// Enhanced data generation for Fuel Anomaly Analysis
// This extends your existing mock data generation to include fuel anomaly patterns

// Fuel Anomaly Detection Levels
export const ANOMALY_LEVELS = {
    LF_VS_HF: 'lf_vs_hf',        // Low Frequency vs High Frequency data sync
    PHYSICS_CHECK: 'physics',     // Physics-based validation (LF vs Calculated)
    FLEET_BENCHMARK: 'benchmark'  // Fleet/Sister vessel benchmarking
  };
  
  // Anomaly Types
  export const ANOMALY_TYPES = {
    STATIC_CONSUMPTION: 'static_consumption',
    RPM_INFLATION: 'rpm_inflation', 
    WEATHER_MISREPORT: 'weather_misreport',
    CORRELATION_BREAK: 'correlation_break',
    EXCESS_CONSUMPTION: 'excess_consumption',
    POWER_MISMATCH: 'power_mismatch'
  };
  
  // Risk Levels
  export const RISK_LEVELS = {
    LOW: { level: 'low', score: 2, color: '#10b981', label: 'Normal' },
    MEDIUM: { level: 'medium', score: 5, color: '#f59e0b', label: 'Monitor' },
    HIGH: { level: 'high', score: 8, color: '#ef4444', label: 'Investigate' },
    CRITICAL: { level: 'critical', score: 9.5, color: '#dc2626', label: 'Critical' }
  };
  
  // Sister Vessel Suggestions based on vessel similarity
  export const SISTER_VESSEL_MAP = {
    'vessel_1': { // MV Atlantic Pioneer
      suggestions: [
        { 
          id: 'vessel_2', 
          name: 'MV Pacific Navigator',
          similarity: 0.92,
          reason: 'Similar dry dock schedule (Q4 2022), vessel class, operational profile'
        },
        { 
          id: 'vessel_3', 
          name: 'MV Ocean Explorer',
          similarity: 0.87,
          reason: 'Same vessel class, similar routes'
        }
      ]
    },
    'vessel_2': {
      suggestions: [
        { 
          id: 'vessel_1', 
          name: 'MV Atlantic Pioneer',
          similarity: 0.92,
          reason: 'Similar operational profile and maintenance schedule'
        }
      ]
    }
    // Add more vessel mappings as needed
  };
  
  // Generate fuel anomaly pattern for a specific vessel over 6 months
  export const generateFuelAnomalyData = (
    vesselId = 'vessel_1',
    sisterVesselId = 'vessel_2',
    monthsBack = 6
  ) => {
    const data = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - monthsBack);
    
    const currentDate = new Date(startDate);
    let anomalyPhase = 1; // 1: Normal, 2: Early signs, 3: Clear anomalies, 4: Severe
    let cumulativeExcess = 0;
    
    // Baseline parameters for the vessel
    const vesselBaseline = {
      normalFuelConsumption: 28.5, // MT/day baseline
      normalRPM: 95,
      normalSFOC: 185, // g/kWh
      normalSpeed: 12.8 // knots
    };
    
    // Sister vessel baseline (slightly better performance)
    const sisterBaseline = {
      normalFuelConsumption: 26.2, // MT/day
      normalRPM: 92,
      normalSpeed: 13.1
    };
    
    while (currentDate <= endDate) {
      const daysDiff = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
      const monthProgress = daysDiff / (monthsBack * 30);
      
      // Determine anomaly phase based on timeline
      if (monthProgress < 0.33) {
        anomalyPhase = 1; // Normal operations
      } else if (monthProgress < 0.5) {
        anomalyPhase = 2; // Early anomaly signs
      } else if (monthProgress < 0.83) {
        anomalyPhase = 3; // Clear anomalies
      } else {
        anomalyPhase = 4; // Severe anomalies
      }
      
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Generate weather conditions
      const actualWeather = Math.floor(Math.random() * 8) + 1; // Beaufort 1-8
      const reportedWeather = generateReportedWeather(actualWeather, anomalyPhase);
      
      // Generate engine power (HF sensor data)
      const enginePower = 3800 + (Math.random() * 2400) + (Math.sin(daysDiff * 0.1) * 600);
      
      // Calculate theoretical fuel consumption based on engine power
      const theoreticalFuel = calculateTheoreticalFuel(enginePower, vesselBaseline.normalSFOC);
      
      // Generate actual RPM (HF sensor data)
      const actualRPM = vesselBaseline.normalRPM + (Math.random() * 15) - 7.5;
      
      // Generate reported RPM (LF data with potential inflation)
      const reportedRPM = generateReportedRPM(actualRPM, anomalyPhase);
      
      // Generate reported fuel consumption (LF data with potential manipulation)
      const reportedFuel = generateReportedFuel(theoreticalFuel, anomalyPhase, vesselBaseline);
      
      // Generate sister vessel data for comparison
      const sisterData = generateSisterVesselData(
        theoreticalFuel, 
        actualWeather, 
        sisterBaseline,
        currentDate
      );
      
      // Calculate daily excess
      const dailyExcess = Math.max(0, reportedFuel - theoreticalFuel);
      cumulativeExcess += dailyExcess;
      
      // Detect anomalies
      const anomalies = detectAnomalies({
        reportedFuel,
        theoreticalFuel,
        reportedRPM,
        actualRPM,
        reportedWeather,
        actualWeather,
        enginePower,
        sisterFuel: sisterData.fuel,
        phase: anomalyPhase
      });
      
      // Calculate risk score for this day
      const dailyRiskScore = calculateDailyRiskScore(anomalies, anomalyPhase);
      
      const dataPoint = {
        date: dateString,
        
        // Low Frequency (Reported) Data
        lf: {
          fuel_consumption: Math.round(reportedFuel * 10) / 10,
          rpm: Math.round(reportedRPM),
          weather_bf: reportedWeather,
          speed_obs: vesselBaseline.normalSpeed + (Math.random() * 2) - 1,
          distance: 295 + (Math.random() * 20) - 10
        },
        
        // High Frequency (Sensor) Data  
        hf: {
          engine_power: Math.round(enginePower),
          rpm_actual: Math.round(actualRPM * 10) / 10,
          weather_actual: actualWeather,
          fuel_flow_rate: Math.round((theoreticalFuel / 24) * 100) / 100 // MT/hour
        },
        
        // Calculated/Theoretical Data
        calculated: {
          theoretical_fuel: Math.round(theoreticalFuel * 10) / 10,
          sfoc_actual: Math.round((theoreticalFuel * 1000) / (enginePower * 24) * 100) / 100,
          fuel_variance_pct: Math.round(((reportedFuel - theoreticalFuel) / theoreticalFuel * 100) * 10) / 10
        },
        
        // Sister Vessel Benchmark Data
        sister: {
          vessel_id: sisterVesselId,
          fuel_consumption: Math.round(sisterData.fuel * 10) / 10,
          speed: Math.round(sisterData.speed * 10) / 10,
          weather_normalized_fuel: Math.round(sisterData.weatherNormalizedFuel * 10) / 10
        },
        
        // Anomaly Detection Results
        anomalies: {
          detected: anomalies,
          risk_score: dailyRiskScore,
          risk_level: getRiskLevel(dailyRiskScore),
          daily_excess: Math.round(dailyExcess * 10) / 10,
          cumulative_excess: Math.round(cumulativeExcess * 10) / 10,
          confidence: calculateConfidence(anomalies, anomalyPhase)
        },
        
        // Correlation Metrics
        correlations: {
          fuel_vs_power: calculateCorrelation(reportedFuel, enginePower, 'fuel_power'),
          reported_vs_actual_rpm: calculateCorrelation(reportedRPM, actualRPM, 'rpm'),
          weather_accuracy: actualWeather === reportedWeather ? 1.0 : 0.0
        }
      };
      
      data.push(dataPoint);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return data;
  };
  
  // Helper function to generate reported weather with potential misreporting
  const generateReportedWeather = (actualWeather, anomalyPhase) => {
    if (anomalyPhase <= 1) return actualWeather; // Normal phase, accurate reporting
    
    // In anomaly phases, crew tends to over-report bad weather to justify higher consumption
    if (actualWeather <= 4) { // Good weather
      const misreportChance = anomalyPhase * 0.2; // Higher phases = more misreporting
      if (Math.random() < misreportChance) {
        return Math.min(8, actualWeather + Math.floor(Math.random() * 3) + 1);
      }
    }
    return actualWeather;
  };
  
  // Helper function to generate reported RPM with potential inflation
  const generateReportedRPM = (actualRPM, anomalyPhase) => {
    if (anomalyPhase <= 1) return actualRPM;
    
    // RPM inflation increases with anomaly phase
    const inflationFactor = (anomalyPhase - 1) * 0.05; // 0% to 15% inflation
    return actualRPM * (1 + inflationFactor);
  };
  
  // Helper function to generate reported fuel with potential manipulation
  const generateReportedFuel = (theoreticalFuel, anomalyPhase, baseline) => {
    if (anomalyPhase <= 1) {
      // Normal phase: small natural variance around theoretical
      return theoreticalFuel + (Math.random() * 4) - 2;
    }
    
    if (anomalyPhase === 2) {
      // Early anomaly: slight over-reporting begins
      return theoreticalFuel + Math.random() * 3 + 1;
    }
    
    if (anomalyPhase === 3) {
      // Clear anomaly: static consumption pattern emerges
      return baseline.normalFuelConsumption + (Math.random() * 4) - 2; // Static around 28.5 MT
    }
    
    // Severe anomaly: higher static consumption
    return 32 + (Math.random() * 3) - 1.5; // Static around 32 MT
  };
  
  // Calculate theoretical fuel consumption based on engine power and SFOC
  const calculateTheoreticalFuel = (enginePower, baseSFOC) => {
    // Assume 5% SFOC degradation from shop test conditions
    const actualSFOC = baseSFOC * 1.05;
    // Fuel = Power(kW) * Hours(24) * SFOC(g/kWh) / 1,000,000 (to get MT)
    return (enginePower * 24 * actualSFOC) / 1000000;
  };
  
  // Generate sister vessel comparison data
  const generateSisterVesselData = (baselineFuel, weather, sisterBaseline, date) => {
    // Sister vessel performs slightly better
    const efficiencyFactor = 0.92; // 8% better efficiency
    const sisterFuel = baselineFuel * efficiencyFactor + (Math.random() * 2) - 1;
    
    // Weather normalization
    const weatherPenalty = Math.max(0, (weather - 4) * 0.5); // Penalty for weather > BF 4
    const weatherNormalizedFuel = sisterFuel + weatherPenalty;
    
    return {
      fuel: sisterFuel,
      speed: sisterBaseline.normalSpeed + (Math.random() * 1.5) - 0.75,
      weatherNormalizedFuel
    };
  };
  
  // Detect various types of anomalies
  const detectAnomalies = ({
    reportedFuel, theoreticalFuel, reportedRPM, actualRPM,
    reportedWeather, actualWeather, enginePower, sisterFuel, phase
  }) => {
    const anomalies = [];
    
    // 1. Excess fuel consumption (>20% over theoretical)
    const fuelVariance = (reportedFuel - theoreticalFuel) / theoreticalFuel;
    if (fuelVariance > 0.2) {
      anomalies.push({
        type: ANOMALY_TYPES.EXCESS_CONSUMPTION,
        severity: fuelVariance > 0.4 ? 'high' : 'medium',
        value: Math.round(fuelVariance * 100),
        description: `${Math.round(fuelVariance * 100)}% excess fuel consumption`
      });
    }
    
    // 2. RPM inflation (>10% over actual)
    const rpmVariance = (reportedRPM - actualRPM) / actualRPM;
    if (rpmVariance > 0.1) {
      anomalies.push({
        type: ANOMALY_TYPES.RPM_INFLATION,
        severity: rpmVariance > 0.2 ? 'high' : 'medium',
        value: Math.round(rpmVariance * 100),
        description: `${Math.round(rpmVariance * 100)}% RPM over-reporting`
      });
    }
    
    // 3. Weather misreporting
    if (Math.abs(reportedWeather - actualWeather) > 2) {
      anomalies.push({
        type: ANOMALY_TYPES.WEATHER_MISREPORT,
        severity: Math.abs(reportedWeather - actualWeather) > 4 ? 'high' : 'medium',
        value: Math.abs(reportedWeather - actualWeather),
        description: `Weather misreported by ${Math.abs(reportedWeather - actualWeather)} BF scales`
      });
    }
    
    // 4. Static consumption pattern (in phase 3+)
    if (phase >= 3 && Math.abs(reportedFuel - 32) < 2) {
      anomalies.push({
        type: ANOMALY_TYPES.STATIC_CONSUMPTION,
        severity: 'high',
        value: reportedFuel,
        description: 'Fuel consumption artificially static despite varying engine load'
      });
    }
    
    // 5. Sister vessel performance deviation (>15% higher consumption)
    const sisterVariance = (reportedFuel - sisterFuel) / sisterFuel;
    if (sisterVariance > 0.15) {
      anomalies.push({
        type: ANOMALY_TYPES.POWER_MISMATCH,
        severity: sisterVariance > 0.3 ? 'high' : 'medium',
        value: Math.round(sisterVariance * 100),
        description: `${Math.round(sisterVariance * 100)}% higher consumption than sister vessel`
      });
    }
    
    return anomalies;
  };
  
  // Calculate daily risk score based on detected anomalies
  const calculateDailyRiskScore = (anomalies, phase) => {
    if (anomalies.length === 0) return Math.max(1, phase * 0.5);
    
    let score = 0;
    anomalies.forEach(anomaly => {
      switch (anomaly.severity) {
        case 'high': score += 3; break;
        case 'medium': score += 2; break;
        case 'low': score += 1; break;
      }
    });
    
    // Phase multiplier
    score *= (1 + (phase - 1) * 0.2);
    
    return Math.min(10, Math.max(1, score));
  };
  
  // Get risk level based on score
  const getRiskLevel = (score) => {
    if (score <= 3) return RISK_LEVELS.LOW;
    if (score <= 6) return RISK_LEVELS.MEDIUM;
    if (score <= 8.5) return RISK_LEVELS.HIGH;
    return RISK_LEVELS.CRITICAL;
  };
  
  // Calculate confidence in anomaly detection
  const calculateConfidence = (anomalies, phase) => {
    if (anomalies.length === 0) return 0.1;
    
    let confidence = 0.3; // Base confidence
    
    // More anomalies = higher confidence
    confidence += Math.min(0.4, anomalies.length * 0.1);
    
    // Severity affects confidence
    const highSeverityCount = anomalies.filter(a => a.severity === 'high').length;
    confidence += highSeverityCount * 0.15;
    
    // Phase affects confidence (later phases = higher confidence)
    confidence += (phase - 1) * 0.1;
    
    return Math.min(0.99, Math.max(0.1, confidence));
  };
  
  // Simple correlation calculation
  const calculateCorrelation = (reported, actual, type) => {
    // Simplified correlation for demo purposes
    if (type === 'fuel_power') {
      // Fuel should correlate with power
      const variance = Math.abs(reported - actual) / actual;
      return Math.max(0, 1 - variance);
    }
    
    if (type === 'rpm') {
      const variance = Math.abs(reported - actual) / actual;
      return Math.max(0, 1 - (variance * 2)); // RPM correlation is more sensitive
    }
    
    return 0.85; // Default correlation
  };
  
  // Generate summary statistics for the analysis period
  export const generateAnomalySummary = (anomalyData) => {
    const totalDays = anomalyData.length;
    const anomalousDays = anomalyData.filter(d => d.anomalies.detected.length > 0).length;
    const totalExcess = anomalyData[anomalyData.length - 1]?.anomalies.cumulative_excess || 0;
    
    // Calculate average risk score
    const avgRiskScore = anomalyData.reduce((sum, d) => sum + d.anomalies.risk_score, 0) / totalDays;
    
    // Calculate confidence (higher if consistent pattern)
    const overallConfidence = anomalousDays / totalDays;
    
    // Categorize anomaly types
    const anomalyTypeCount = {};
    anomalyData.forEach(d => {
      d.anomalies.detected.forEach(anomaly => {
        anomalyTypeCount[anomaly.type] = (anomalyTypeCount[anomaly.type] || 0) + 1;
      });
    });
    
    return {
      totalDays,
      anomalousDays,
      anomalyRate: Math.round((anomalousDays / totalDays) * 100),
      totalExcessFuel: Math.round(totalExcess * 10) / 10,
      avgRiskScore: Math.round(avgRiskScore * 10) / 10,
      overallRiskLevel: getRiskLevel(avgRiskScore),
      confidence: Math.round(overallConfidence * 100),
      anomalyTypes: anomalyTypeCount,
      investigationPriority: avgRiskScore > 7 ? 'HIGH' : avgRiskScore > 5 ? 'MEDIUM' : 'LOW'
    };
  };
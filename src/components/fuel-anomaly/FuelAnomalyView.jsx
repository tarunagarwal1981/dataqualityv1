import React, { useState, useMemo, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ReferenceLine,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  Fuel,
  Activity,
  Target,
  Zap,
  Radio,
  Gauge,
  Calendar,
  Ship,
  BarChart3,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  Settings,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Clock,
  FileText,
  ExternalLink,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Radar,
  GitCompare,
  Brain,
  Layers,
  TrendingDown,
  Play,
  Pause
} from 'lucide-react';

// Import our fuel anomaly data generation
import { 
  generateFuelAnomalyData, 
  generateAnomalySummary, 
  ANOMALY_LEVELS,
  ANOMALY_TYPES,
  RISK_LEVELS,
  SISTER_VESSEL_MAP
} from '../../hooks/FuelAnomalyData';

// Sample vessels for selection
const sampleVessels = [
  { id: 'vessel_1', name: 'MV Atlantic Pioneer' },
  { id: 'vessel_2', name: 'MV Pacific Navigator' },
  { id: 'vessel_3', name: 'MV Ocean Explorer' },
  { id: 'vessel_4', name: 'MV Global Trader' },
  { id: 'vessel_5', name: 'MV Northern Star' }
];

// Enhanced confidence calculation with new methodology
const calculateEnhancedConfidence = (anomalyData) => {
  const totalDays = anomalyData.length;
  
  // 1. HF vs LF Data Comparison (50% weight)
  let hfLfAccuracy = 0;
  const parameters = ['rpm', 'me_consumption', 'total_consumption', 'power', 'wind_force', 'obs_speed'];
  
  parameters.forEach(param => {
    let paramAccuracy = 0;
    let validDays = 0;
    
    anomalyData.forEach(day => {
      const reported = day.lf[param === 'power' ? 'me_power' : param === 'wind_force' ? 'weather_bf' : param === 'obs_speed' ? 'speed_obs' : param];
      const actual = day.hf[param === 'power' ? 'engine_power' : param === 'wind_force' ? 'weather_actual' : param === 'obs_speed' ? 'speed_obs' : param === 'rpm' ? 'rpm_actual' : param];
      
      if (reported && actual && reported > 0 && actual > 0) {
        const accuracy = 1 - Math.abs(reported - actual) / actual;
        paramAccuracy += Math.max(0, accuracy);
        validDays++;
      }
    });
    
    if (validDays > 0) {
      hfLfAccuracy += (paramAccuracy / validDays) / parameters.length;
    }
  });
  
  // 2. Predictive Analytics (35% weight)
  let predictiveAccuracy = 0;
  let validPredictions = 0;
  
  anomalyData.forEach(day => {
    const predicted = day.calculated.theoretical_fuel;
    const reported = day.lf.fuel_consumption;
    
    if (predicted && reported && predicted > 0) {
      const accuracy = 1 - Math.abs(predicted - reported) / predicted;
      predictiveAccuracy += Math.max(0, accuracy);
      validPredictions++;
    }
  });
  
  if (validPredictions > 0) {
    predictiveAccuracy = predictiveAccuracy / validPredictions;
  }
  
  // 3. Sister Vessel Analysis (15% weight)
  let sisterVesselScore = 0;
  let ladenDays = 0, ballastDays = 0;
  let vesselLadenAvg = 0, vesselBallastAvg = 0;
  let sisterLadenAvg = 0, sisterBallastAvg = 0;
  
  anomalyData.forEach(day => {
    const isLaden = Math.random() > 0.5; // Simplified condition detection
    
    if (isLaden) {
      vesselLadenAvg += day.lf.fuel_consumption;
      sisterLadenAvg += day.sister.fuel_consumption;
      ladenDays++;
    } else {
      vesselBallastAvg += day.lf.fuel_consumption;
      sisterBallastAvg += day.sister.fuel_consumption;
      ballastDays++;
    }
  });
  
  if (ladenDays > 0 && ballastDays > 0) {
    vesselLadenAvg /= ladenDays;
    vesselBallastAvg /= ballastDays;
    sisterLadenAvg /= ladenDays;
    sisterBallastAvg /= ballastDays;
    
    const ladenEfficiency = Math.min(1, sisterLadenAvg / vesselLadenAvg);
    const ballastEfficiency = Math.min(1, sisterBallastAvg / vesselBallastAvg);
    sisterVesselScore = (ladenEfficiency + ballastEfficiency) / 2;
  }
  
  // Calculate overall confidence
  const overallConfidence = (hfLfAccuracy * 0.5) + (predictiveAccuracy * 0.35) + (sisterVesselScore * 0.15);
  
  return {
    overall: Math.round(overallConfidence * 100),
    hfLfScore: Math.round(hfLfAccuracy * 100),
    predictiveScore: Math.round(predictiveAccuracy * 100),
    sisterScore: Math.round(sisterVesselScore * 100),
    breakdown: {
      hfLfWeight: 50,
      predictiveWeight: 35,
      sisterWeight: 15
    }
  };
};

// Sleek Header Component
const SleekHeader = ({ selectedVessel, sisterVessel, confidence, onVesselChange, onSisterVesselChange, onExport }) => {
  // Calculate default date range (6 months)
  const getDefaultDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 6);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  const getStatusColor = (score) => {
    if (score >= 80) return '#ef4444';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#06b6d4';
    return '#10b981';
  };

  const getStatusText = (score) => {
    if (score >= 80) return 'HIGH RISK';
    if (score >= 60) return 'MODERATE';
    if (score >= 40) return 'LOW RISK';
    return 'NORMAL';
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-white/10 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Title & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Fuel className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Fuel Anomaly Detection</h1>
              <p className="text-xs text-slate-400">Advanced fraud detection system</p>
            </div>
          </div>
          
          {/* Compact Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/40 rounded-lg border border-white/10">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: getStatusColor(confidence.overall) }}
            />
            <span className="text-xs font-medium text-white">{getStatusText(confidence.overall)}</span>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <div className="text-center">
              <div className="text-sm font-bold text-white">{confidence.overall}%</div>
              <div className="text-[10px] text-slate-400">Confidence</div>
            </div>
          </div>
        </div>

        {/* Right: Vessel Selection, Date Picker & Controls */}
        <div className="flex items-center gap-3">
          {/* Vessel Selection */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Primary:</span>
            <select 
              value={selectedVessel}
              onChange={(e) => onVesselChange(e.target.value)}
              className="bg-slate-700/60 border border-white/20 rounded-md px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50"
            >
              {sampleVessels.map(vessel => (
                <option key={vessel.id} value={vessel.id}>{vessel.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">vs</span>
            <select 
              value={sisterVessel}
              onChange={(e) => onSisterVesselChange(e.target.value)}
              className="bg-slate-700/60 border border-white/20 rounded-md px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50"
            >
              {sampleVessels.filter(v => v.id !== selectedVessel).map(vessel => (
                <option key={vessel.id} value={vessel.id}>{vessel.name}</option>
              ))}
            </select>
          </div>

          <div className="w-px h-6 bg-white/20" />

          {/* Date Picker */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/40 rounded-lg border border-white/10">
            <Calendar className="w-3 h-3 text-slate-400" />
            <div className="flex items-center gap-1 text-xs">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="bg-transparent border-none text-white text-xs focus:outline-none w-24"
              />
              <span className="text-slate-500">–</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="bg-transparent border-none text-white text-xs focus:outline-none w-24"
              />
            </div>
          </div>

          <div className="w-px h-6 bg-white/20" />
          
          {/* Export Button */}
          <button
            onClick={onExport}
            className="px-3 py-1.5 bg-slate-700/60 hover:bg-slate-600/60 text-white rounded-md transition-all duration-200 flex items-center gap-1.5 text-xs font-medium"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

// Compact Confidence Breakdown
const ConfidenceBreakdown = ({ confidence }) => {
  const components = [
    { name: 'HF vs LF', score: confidence.hfLfScore, weight: 50, color: '#4CC9F0', icon: Radio },
    { name: 'Predictive', score: confidence.predictiveScore, weight: 35, color: '#FFC300', icon: Brain },
    { name: 'Sister Vessel', score: confidence.sisterScore, weight: 15, color: '#F07167', icon: Ship }
  ];

  return (
    <div className="bg-slate-800/40 rounded-xl p-4 border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
        <Target className="w-4 h-4 text-cyan-400" />
        Confidence Breakdown
      </h3>
      
      <div className="space-y-3">
        {components.map((comp, idx) => {
          const IconComponent = comp.icon;
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${comp.color}20`, border: `1px solid ${comp.color}40` }}
                >
                  <IconComponent className="w-3 h-3" style={{ color: comp.color }} />
                </div>
                <span className="text-sm text-slate-300">{comp.name}</span>
                <span className="text-xs text-slate-500">({comp.weight}%)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${comp.score}%`,
                      backgroundColor: comp.color
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-white w-10 text-right">{comp.score}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Sleek Card Component
const SleekCard = ({ title, children, icon: Icon, accent = '#4CC9F0', compact = false }) => {
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
      <div 
        className="px-4 py-3 border-b border-white/10"
        style={{ background: `linear-gradient(135deg, ${accent}15, ${accent}05)` }}
      >
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" style={{ color: accent }} />}
          {title}
        </h3>
      </div>
      <div className={compact ? "p-3" : "p-4"}>
        {children}
      </div>
    </div>
  );
};

// Compact HF vs LF Analysis
const HFLFAnalysis = ({ anomalyData, confidence }) => {
  const parameters = [
    { key: 'rpm', name: 'RPM', unit: 'rpm', icon: Gauge },
    { key: 'power', name: 'Power', unit: 'kW', icon: Zap },
    { key: 'consumption', name: 'Consumption', unit: 'MT', icon: Fuel },
    { key: 'wind', name: 'Wind', unit: 'BF', icon: Activity },
    { key: 'speed', name: 'Speed', unit: 'kts', icon: TrendingUp }
  ];

  // Calculate static accuracy for each parameter (not changing continuously)
  const parameterAccuracies = {
    rpm: 87.5,
    power: 92.3, 
    consumption: 89.1,
    wind: 91.7,
    speed: 94.2
  };

  return (
    <SleekCard title="HF vs LF Data Sync" icon={Radio} accent="#4CC9F0" compact>
      {/* Explanation */}
      <div className="mb-3 p-2 bg-slate-700/20 rounded-lg">
        <p className="text-xs text-slate-300">
          <strong className="text-cyan-400">Accuracy %:</strong> How closely crew-reported data (LF) matches sensor data (HF)
        </p>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {parameters.map(param => {
          const IconComponent = param.icon;
          const accuracy = parameterAccuracies[param.key];
          const isGood = accuracy >= 90;
          
          return (
            <div key={param.key} className="text-center">
              <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2 ${
                isGood ? 'bg-green-500/20 border-green-500/30' : 'bg-yellow-500/20 border-yellow-500/30'
              } border`}>
                <IconComponent className={`w-4 h-4 ${isGood ? 'text-green-400' : 'text-yellow-400'}`} />
              </div>
              <div className={`text-xs font-semibold ${isGood ? 'text-green-400' : 'text-yellow-400'}`}>
                {accuracy.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500">{param.name}</div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">Overall Sync Rate</span>
          <span className="text-white font-semibold">{confidence.hfLfScore}%</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Higher % = More accurate reporting
        </div>
      </div>
    </SleekCard>
  );
};

// Compact Predictive Analysis
const PredictiveAnalysis = ({ anomalyData, confidence }) => {
  const predictionData = anomalyData.slice(-30).map(day => ({
    date: day.date,
    reported: day.lf.fuel_consumption,
    predicted: day.calculated.theoretical_fuel,
    variance: ((day.lf.fuel_consumption - day.calculated.theoretical_fuel) / day.calculated.theoretical_fuel * 100)
  }));

  const avgVariance = predictionData.reduce((sum, day) => sum + Math.abs(day.variance), 0) / predictionData.length;
  const accuracy = Math.max(0, 100 - avgVariance);

  return (
    <SleekCard title="Predictive vs Reported" icon={Brain} accent="#FFC300" compact>
      <div className="space-y-3">
        {/* Mini Chart */}
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictionData.slice(-15)}>
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false}
                strokeDasharray="3 3"
              />
              <Line 
                type="monotone" 
                dataKey="reported" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-white">{accuracy.toFixed(0)}%</div>
            <div className="text-xs text-slate-400">Accuracy</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-400">{avgVariance.toFixed(1)}%</div>
            <div className="text-xs text-slate-400">Avg Variance</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-400">
              {predictionData.filter(d => d.variance > 20).length}
            </div>
            <div className="text-xs text-slate-400">High Variance Days</div>
          </div>
        </div>
      </div>
    </SleekCard>
  );
};

// Compact Sister Vessel Analysis
const SisterVesselAnalysis = ({ anomalyData, sisterVesselName }) => {
  // Mock data for laden/ballast comparison
  const ladenExcess = 12.5;
  const ballastExcess = 8.3;
  const totalExcess = 127;

  return (
    <SleekCard title={`vs ${sisterVesselName}`} icon={Ship} accent="#F07167" compact>
      <div className="space-y-3">
        {/* Performance Comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-red-400">+{ladenExcess}%</div>
            <div className="text-xs text-slate-400">Laden Excess</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-orange-400">+{ballastExcess}%</div>
            <div className="text-xs text-slate-400">Ballast Excess</div>
          </div>
        </div>
        
        {/* Financial Impact */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Est. Excess Cost</span>
            <span className="text-sm font-semibold text-red-400">${(totalExcess * 600).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-slate-400">Total Excess Fuel</span>
            <span className="text-sm font-semibold text-white">{totalExcess} MT</span>
          </div>
        </div>
      </div>
    </SleekCard>
  );
};

// Main Timeline Chart - HF, LF, Predicted Comparison
const MainTimelineChart = ({ anomalyData }) => {
  const chartData = anomalyData.map(day => ({
    date: day.date,
    lfConsumption: day.lf.fuel_consumption,
    hfConsumption: day.hf.fuel_flow_rate * 24, // Convert hourly to daily
    predictedConsumption: day.calculated.theoretical_fuel,
    confidence: 100 - day.anomalies.risk_score * 10
  }));

  return (
    <SleekCard title="HF vs LF vs Predictive Analysis - Fuel Consumption Timeline" icon={TrendingUp} accent="#6366f1">
      <div className="mb-3 p-2 bg-slate-700/20 rounded-lg">
        <p className="text-xs text-slate-300">
          <strong className="text-indigo-400">Analysis Type:</strong> Comparing sensor data (HF), reported data (LF), and AI predictions over time
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            
            <YAxis 
              yAxisId="fuel"
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              label={{ value: 'Fuel (MT/day)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#cbd5e1' } }}
            />
            
            <YAxis 
              yAxisId="confidence"
              orientation="right"
              tick={{ fill: '#cbd5e1', fontSize: 11 }}
              label={{ value: 'Confidence %', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#cbd5e1' } }}
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            
            <Area
              yAxisId="confidence"
              type="monotone"
              dataKey="confidence"
              stroke="#6366f1"
              fill="url(#confidenceGradient)"
              strokeWidth={1}
              name="Data Confidence"
            />
            
            <Line
              yAxisId="fuel"
              type="monotone"
              dataKey="lfConsumption"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 2, fill: '#f59e0b' }}
              name="LF Reported"
            />
            
            <Line
              yAxisId="fuel"
              type="monotone"
              dataKey="hfConsumption"
              stroke="#06b6d4"
              strokeWidth={3}
              dot={{ r: 2, fill: '#06b6d4' }}
              name="HF Sensor"
            />
            
            <Line
              yAxisId="fuel"
              type="monotone"
              dataKey="predictedConsumption"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 2, fill: '#10b981' }}
              name="AI Predicted"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {/* Chart Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-orange-500"></div>
          <span className="text-slate-300">LF Reported (Crew Data)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-cyan-500"></div>
          <span className="text-slate-300">HF Sensor (Actual)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-green-500 border-dashed border-b-2 border-green-500"></div>
          <span className="text-slate-300">AI Predicted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-2 bg-indigo-500 opacity-30"></div>
          <span className="text-slate-300">Data Confidence</span>
        </div>
      </div>
    </SleekCard>
  );
};

// Main Fuel Anomaly View Component
const FuelAnomalyView = ({ className = '' }) => {
  const [selectedVessel, setSelectedVessel] = useState('vessel_1');
  const [sisterVessel, setSisterVessel] = useState('vessel_2');
  
  // Generate anomaly data
  const anomalyData = useMemo(() => {
    return generateFuelAnomalyData(selectedVessel, sisterVessel, 6);
  }, [selectedVessel, sisterVessel]);
  
  const confidence = useMemo(() => {
    return calculateEnhancedConfidence(anomalyData);
  }, [anomalyData]);
  
  const handleExport = () => {
    console.log('Exporting fuel anomaly report...');
  };

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen ${className}`}>
      {/* Sleek Header */}
      <SleekHeader 
        selectedVessel={selectedVessel}
        sisterVessel={sisterVessel}
        confidence={confidence}
        onVesselChange={setSelectedVessel}
        onSisterVesselChange={setSisterVessel}
        onExport={handleExport}
      />
      
      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Top Row: Confidence + Analysis Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <ConfidenceBreakdown confidence={confidence} />
          <HFLFAnalysis anomalyData={anomalyData} confidence={confidence} />
          <PredictiveAnalysis anomalyData={anomalyData} confidence={confidence} />
          <SisterVesselAnalysis 
            anomalyData={anomalyData} 
            sisterVesselName={sampleVessels.find(v => v.id === sisterVessel)?.name}
          />
        </div>
        
        {/* Main Timeline Chart */}
        <MainTimelineChart anomalyData={anomalyData} />
        
        {/* Bottom Row: Sister Vessel Speed vs Consumption Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Speed vs Consumption Scatter Plot */}
          <SleekCard title="Sister Vessel Analysis - Speed vs Consumption Comparison" icon={Ship} accent="#8b5cf6">
            <div className="mb-3 p-2 bg-slate-700/20 rounded-lg">
              <p className="text-xs text-slate-300">
                <strong className="text-purple-400">Analysis Type:</strong> Comparing vessel performance against similar sister vessel in laden and ballast conditions
              </p>
            </div>
            
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    type="number"
                    dataKey="speed"
                    domain={[10, 16]}
                    tick={{ fill: '#cbd5e1', fontSize: 11 }}
                    label={{ value: 'Speed (knots)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#cbd5e1' } }}
                  />
                  <YAxis 
                    type="number"
                    dataKey="consumption"
                    domain={[25, 40]}
                    tick={{ fill: '#cbd5e1', fontSize: 11 }}
                    label={{ value: 'Consumption (MT/day)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#cbd5e1' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.2)', 
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  
                  {/* Primary Vessel - Laden */}
                  <Scatter 
                    data={[
                      {speed: 11.2, consumption: 33.5, condition: 'Laden'},
                      {speed: 11.8, consumption: 35.2, condition: 'Laden'},
                      {speed: 10.9, consumption: 32.8, condition: 'Laden'},
                      {speed: 11.5, consumption: 34.1, condition: 'Laden'},
                      {speed: 11.0, consumption: 33.2, condition: 'Laden'}
                    ]}
                    fill="#f59e0b" 
                    name="Primary Vessel (Laden)"
                  />
                  
                  {/* Primary Vessel - Ballast */}
                  <Scatter 
                    data={[
                      {speed: 12.8, consumption: 31.2, condition: 'Ballast'},
                      {speed: 13.1, consumption: 32.1, condition: 'Ballast'},
                      {speed: 12.5, consumption: 30.8, condition: 'Ballast'},
                      {speed: 12.9, consumption: 31.5, condition: 'Ballast'},
                      {speed: 13.0, consumption: 31.8, condition: 'Ballast'}
                    ]}
                    fill="#06b6d4" 
                    name="Primary Vessel (Ballast)"
                  />
                  
                  {/* Sister Vessel - Laden */}
                  <Scatter 
                    data={[
                      {speed: 11.7, consumption: 30.8, condition: 'Laden'},
                      {speed: 12.1, consumption: 31.9, condition: 'Laden'},
                      {speed: 11.4, consumption: 30.2, condition: 'Laden'},
                      {speed: 11.9, consumption: 31.2, condition: 'Laden'},
                      {speed: 11.6, consumption: 30.9, condition: 'Laden'}
                    ]}
                    fill="#10b981" 
                    name="Sister Vessel (Laden)"
                  />
                  
                  {/* Sister Vessel - Ballast */}
                  <Scatter 
                    data={[
                      {speed: 13.4, consumption: 28.5, condition: 'Ballast'},
                      {speed: 13.6, consumption: 29.1, condition: 'Ballast'},
                      {speed: 13.2, consumption: 28.2, condition: 'Ballast'},
                      {speed: 13.5, consumption: 28.8, condition: 'Ballast'},
                      {speed: 13.3, consumption: 28.6, condition: 'Ballast'}
                    ]}
                    fill="#8b5cf6" 
                    name="Sister Vessel (Ballast)"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            {/* Chart Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-slate-300">Primary (Laden)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span className="text-slate-300">Primary (Ballast)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-slate-300">Sister (Laden)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-slate-300">Sister (Ballast)</span>
              </div>
            </div>
          </SleekCard>
          
          {/* Performance Comparison Summary */}
          <SleekCard title="Performance Comparison Summary" icon={BarChart3} accent="#ef4444">
            <div className="space-y-4">
              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 text-slate-300 font-medium">Condition</th>
                      <th className="text-center py-2 text-slate-300 font-medium">Primary</th>
                      <th className="text-center py-2 text-slate-300 font-medium">Sister</th>
                      <th className="text-center py-2 text-slate-300 font-medium">Excess</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-2 text-white font-medium">Laden</td>
                      <td className="py-2 text-center text-slate-300">33.8 MT</td>
                      <td className="py-2 text-center text-slate-300">31.0 MT</td>
                      <td className="py-2 text-center">
                        <span className="text-red-400 font-semibold">+9.0%</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-white font-medium">Ballast</td>
                      <td className="py-2 text-center text-slate-300">31.5 MT</td>
                      <td className="py-2 text-center text-slate-300">28.6 MT</td>
                      <td className="py-2 text-center">
                        <span className="text-orange-400 font-semibold">+10.1%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial Impact */}
              <div className="bg-slate-700/30 rounded-lg p-3">
                <h4 className="text-sm font-medium text-white mb-3">Financial Impact Analysis</h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-red-400">$76,200</div>
                    <div className="text-xs text-slate-400">Estimated Excess Cost</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-400">127 MT</div>
                    <div className="text-xs text-slate-400">Total Excess Fuel</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Avg Performance Gap</span>
                    <span className="text-yellow-400 font-semibold">+9.6%</span>
                  </div>
                </div>
              </div>
            </div>
          </SleekCard>
        </div>
      </div>
    </div>
  );
};

export default FuelAnomalyView;
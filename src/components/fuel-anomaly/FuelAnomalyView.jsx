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
  Minimize2
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

// Anomaly Risk Cards Component (similar to DataQualityCards)
const AnomalyRiskCards = ({ summary, anomalyData, selectedVessel, sisterVessel }) => {
  const cards = [
    {
      id: 'risk_score',
      title: 'Risk Score',
      value: summary.avgRiskScore,
      max: 10,
      unit: '/10',
      icon: Shield,
      color: summary.overallRiskLevel.color,
      description: summary.overallRiskLevel.label,
      trend: summary.avgRiskScore > 7 ? 'warning' : summary.avgRiskScore > 5 ? 'caution' : 'good'
    },
    {
      id: 'excess_fuel',
      title: 'Excess Fuel',
      value: summary.totalExcessFuel,
      unit: 'MT',
      icon: Fuel,
      color: summary.totalExcessFuel > 100 ? '#ef4444' : summary.totalExcessFuel > 50 ? '#f59e0b' : '#10b981',
      description: `Over ${summary.totalDays} days`,
      trend: summary.totalExcessFuel > 100 ? 'warning' : 'caution'
    },
    {
      id: 'confidence',
      title: 'Confidence',
      value: summary.confidence,
      max: 100,
      unit: '%',
      icon: Target,
      color: summary.confidence > 80 ? '#ef4444' : summary.confidence > 60 ? '#f59e0b' : '#10b981',
      description: `${summary.anomalousDays} anomalous days`,
      trend: summary.confidence > 80 ? 'warning' : 'good'
    },
    {
      id: 'investigation',
      title: 'Priority',
      value: summary.investigationPriority,
      icon: AlertTriangle,
      color: summary.investigationPriority === 'HIGH' ? '#ef4444' : 
             summary.investigationPriority === 'MEDIUM' ? '#f59e0b' : '#10b981',
      description: `${summary.anomalyRate}% anomaly rate`,
      trend: summary.investigationPriority === 'HIGH' ? 'warning' : 'good'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        
        return (
          <div
            key={card.id}
            className="relative group"
            style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="p-2 rounded-lg border"
                  style={{
                    backgroundColor: `${card.color}20`,
                    borderColor: `${card.color}40`
                  }}
                >
                  <IconComponent className="w-5 h-5" style={{ color: card.color }} />
                </div>
                {card.trend === 'warning' && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-300">{card.title}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white">
                    {typeof card.value === 'number' ? 
                      (card.value % 1 === 0 ? card.value : card.value.toFixed(1)) : 
                      card.value
                    }
                  </span>
                  <span className="text-sm text-slate-400">{card.unit}</span>
                </div>
                
                {card.max && (
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (card.value / card.max) * 100)}%`,
                        backgroundColor: card.color
                      }}
                    />
                  </div>
                )}
                
                <p className="text-xs text-slate-400">{card.description}</p>
              </div>
            </div>
            
            {/* Hover glow effect */}
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle at center, ${card.color}40 0%, transparent 70%)`
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

// Three Level Analysis Component
const ThreeLevelAnalysis = ({ anomalyData, summary }) => {
  const levels = [
    {
      id: ANOMALY_LEVELS.LF_VS_HF,
      title: 'LF vs HF Data',
      subtitle: 'Sensor Sync Check',
      icon: Radio,
      color: '#4CC9F0',
      metrics: calculateLevelMetrics(anomalyData, 'lf_hf')
    },
    {
      id: ANOMALY_LEVELS.PHYSICS_CHECK,
      title: 'Physics Check',
      subtitle: 'Theoretical Validation',
      icon: Zap,
      color: '#FFC300',
      metrics: calculateLevelMetrics(anomalyData, 'physics')
    },
    {
      id: ANOMALY_LEVELS.FLEET_BENCHMARK,
      title: 'Fleet Benchmark',
      subtitle: 'Sister Vessel Compare',
      icon: Ship,
      color: '#F07167',
      metrics: calculateLevelMetrics(anomalyData, 'benchmark')
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {levels.map((level) => {
        const IconComponent = level.icon;
        const riskLevel = level.metrics.riskScore > 7 ? 'high' : level.metrics.riskScore > 5 ? 'medium' : 'low';
        
        return (
          <div
            key={level.id}
            className="relative"
            style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
              borderRadius: '12px',
              border: `1px solid ${level.color}40`,
              boxShadow: `0 8px 25px rgba(0, 0, 0, 0.3), 0 0 20px ${level.color}20`
            }}
          >
            <div className="p-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg border"
                    style={{
                      backgroundColor: `${level.color}25`,
                      borderColor: `${level.color}50`
                    }}
                  >
                    <IconComponent className="w-5 h-5" style={{ color: level.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{level.title}</h3>
                    <p className="text-xs text-slate-400">{level.subtitle}</p>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  riskLevel === 'high' ? 'bg-red-500/20 text-red-300' :
                  riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {riskLevel === 'high' ? '🔴 HIGH' : riskLevel === 'medium' ? '🟡 MED' : '🟢 LOW'}
                </div>
              </div>
              
              {/* Metrics */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Issues Detected</span>
                  <span className="text-sm font-semibold text-white">{level.metrics.issueCount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Risk Score</span>
                  <span className="text-sm font-semibold" style={{ color: level.color }}>
                    {level.metrics.riskScore.toFixed(1)}/10
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Affected Days</span>
                  <span className="text-sm font-semibold text-white">
                    {level.metrics.affectedDays}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (level.metrics.riskScore / 10) * 100)}%`,
                      backgroundColor: level.color
                    }}
                  />
                </div>
                
                {/* Top Issues */}
                <div className="mt-3 space-y-1">
                  <p className="text-xs font-medium text-slate-300">Top Issues:</p>
                  {level.metrics.topIssues.slice(0, 2).map((issue, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-1 h-1 rounded-full bg-orange-400"></div>
                      {issue}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Enhanced Controls Bar for Fuel Anomaly
const FuelAnomalyControlsBar = ({ 
  selectedVessel,
  sisterVessel,
  analysisConfig,
  onVesselChange,
  onSisterVesselChange,
  onConfigChange,
  onRunAnalysis,
  onExport,
  isAnalyzing = false
}) => {
  const [showConfig, setShowConfig] = useState(false);
  
  return (
    <div 
      className="border-b backdrop-blur-md p-3"
      style={{
        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Title and Vessel Selection */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
              <Fuel className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Fuel Anomaly Analysis</h2>
              <p className="text-xs text-slate-400">Fraud Detection & Performance Monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Primary Vessel</label>
              <select 
                value={selectedVessel}
                onChange={(e) => onVesselChange(e.target.value)}
                className="bg-slate-700 border border-white/20 rounded-md px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {sampleVessels.map(vessel => (
                  <option key={vessel.id} value={vessel.id}>{vessel.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Sister Vessel</label>
              <select 
                value={sisterVessel}
                onChange={(e) => onSisterVesselChange(e.target.value)}
                className="bg-slate-700 border border-white/20 rounded-md px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {sampleVessels.filter(v => v.id !== selectedVessel).map(vessel => (
                  <option key={vessel.id} value={vessel.id}>{vessel.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Right Section - Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="w-8 h-8 flex items-center justify-center bg-slate-700/50 border border-white/10 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Analysis Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                Run Analysis
              </>
            )}
          </button>
          
          <button
            onClick={onExport}
            className="w-8 h-8 flex items-center justify-center bg-slate-700/50 border border-white/10 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Export Report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Configuration Panel */}
      {showConfig && (
        <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-2 block">Analysis Period</label>
              <select 
                value={analysisConfig.period}
                onChange={(e) => onConfigChange('period', e.target.value)}
                className="w-full bg-slate-700 border border-white/20 rounded-md px-3 py-2 text-sm text-white"
              >
                <option value="last_6_months">Last 6 Months</option>
                <option value="last_3_months">Last 3 Months</option>
                <option value="last_1_month">Last 1 Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-slate-300 mb-2 block">Sensitivity Level</label>
              <select 
                value={analysisConfig.sensitivity}
                onChange={(e) => onConfigChange('sensitivity', e.target.value)}
                className="w-full bg-slate-700 border border-white/20 rounded-md px-3 py-2 text-sm text-white"
              >
                <option value="low">Low - Major anomalies only</option>
                <option value="medium">Medium - Balanced detection</option>
                <option value="high">High - Sensitive detection</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-slate-300 mb-2 block">Analysis Levels</label>
              <div className="space-y-1">
                {Object.values(ANOMALY_LEVELS).map(level => (
                  <label key={level} className="flex items-center gap-2 text-xs">
                    <input 
                      type="checkbox" 
                      checked={analysisConfig.enabledLevels.includes(level)}
                      onChange={(e) => {
                        const newLevels = e.target.checked 
                          ? [...analysisConfig.enabledLevels, level]
                          : analysisConfig.enabledLevels.filter(l => l !== level);
                        onConfigChange('enabledLevels', newLevels);
                      }}
                      className="rounded"
                    />
                    <span className="text-slate-300 capitalize">{level.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Tooltip for Fuel Charts
const FuelAnomalyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-slate-800/95 border border-white/20 rounded-lg p-3 shadow-xl backdrop-blur-md max-w-sm">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">
            {new Date(label).toLocaleDateString()}
          </span>
        </div>
        
        <div className="space-y-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-slate-300">{entry.name}</span>
              </div>
              <span className="text-xs font-semibold text-white">
                {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              </span>
            </div>
          ))}
        </div>
        
        {data.anomalies?.detected?.length > 0 && (
          <div className="mt-3 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3 h-3 text-orange-400" />
              <span className="text-xs font-medium text-orange-400">Anomalies Detected</span>
            </div>
            <div className="space-y-1">
              {data.anomalies.detected.slice(0, 2).map((anomaly, i) => (
                <div key={i} className="text-xs text-slate-300">
                  • {anomaly.description}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Main Fuel Anomaly View Component
const FuelAnomalyView = ({ className = '' }) => {
  const [selectedVessel, setSelectedVessel] = useState('vessel_1');
  const [sisterVessel, setSisterVessel] = useState('vessel_2');
  const [analysisConfig, setAnalysisConfig] = useState({
    period: 'last_6_months',
    sensitivity: 'medium',
    enabledLevels: Object.values(ANOMALY_LEVELS)
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Generate anomaly data
  const anomalyData = useMemo(() => {
    return generateFuelAnomalyData(selectedVessel, sisterVessel, 6);
  }, [selectedVessel, sisterVessel]);
  
  const summary = useMemo(() => {
    return generateAnomalySummary(anomalyData);
  }, [anomalyData]);
  
  const handleConfigChange = (key, value) => {
    setAnalysisConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };
  
  const handleExport = () => {
    console.log('Exporting fuel anomaly report...');
  };
  
  // Prepare chart data
  const timelineData = anomalyData.map(d => ({
    date: d.date,
    'Reported Fuel': d.lf.fuel_consumption,
    'Theoretical Fuel': d.calculated.theoretical_fuel,
    'Sister Vessel': d.sister.fuel_consumption,
    'Risk Score': d.anomalies.risk_score,
    'Cumulative Excess': d.anomalies.cumulative_excess,
    anomalies: d.anomalies
  }));
  
  const correlationData = anomalyData.map(d => ({
    date: d.date,
    'Engine Power': d.hf.engine_power / 1000, // Convert to MW for readability
    'Fuel Consumption': d.lf.fuel_consumption,
    'Risk Score': d.anomalies.risk_score,
    anomalies: d.anomalies
  }));

  return (
    <div className={`bg-slate-900 text-white min-h-screen flex flex-col ${className}`}>
      <FuelAnomalyControlsBar
        selectedVessel={selectedVessel}
        sisterVessel={sisterVessel}
        analysisConfig={analysisConfig}
        onVesselChange={setSelectedVessel}
        onSisterVesselChange={setSisterVessel}
        onConfigChange={handleConfigChange}
        onRunAnalysis={handleRunAnalysis}
        onExport={handleExport}
        isAnalyzing={isAnalyzing}
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Risk Overview Cards */}
        <AnomalyRiskCards 
          summary={summary}
          anomalyData={anomalyData}
          selectedVessel={selectedVessel}
          sisterVessel={sisterVessel}
        />
        
        {/* Three Level Analysis */}
        <ThreeLevelAnalysis 
          anomalyData={anomalyData}
          summary={summary}
        />
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fuel Consumption Timeline */}
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Fuel Consumption Timeline
              </h3>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={timelineData}>
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
                  yAxisId="risk"
                  orientation="right"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                  label={{ value: 'Risk Score', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#cbd5e1' } }}
                />
                <Tooltip content={<FuelAnomalyTooltip />} />
                
                <Area
                  yAxisId="risk"
                  type="monotone"
                  dataKey="Risk Score"
                  stroke="#ef4444"
                  fill="#ef444420"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="fuel"
                  type="monotone"
                  dataKey="Reported Fuel"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f59e0b' }}
                />
                <Line
                  yAxisId="fuel"
                  type="monotone"
                  dataKey="Theoretical Fuel"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: '#10b981' }}
                />
                <Line
                  yAxisId="fuel"
                  type="monotone"
                  dataKey="Sister Vessel"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#6366f1' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          {/* Power vs Fuel Correlation */}
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-400" />
                Power vs Fuel Correlation
              </h3>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="Engine Power"
                  type="number"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                  label={{ value: 'Engine Power (MW)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#cbd5e1' } }}
                />
                <YAxis 
                  dataKey="Fuel Consumption"
                  type="number"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                  label={{ value: 'Fuel (MT/day)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#cbd5e1' } }}
                />
                <Tooltip content={<FuelAnomalyTooltip />} />
                
                <Scatter
                  dataKey="Fuel Consumption"
                  fill={(entry) => {
                    const risk = entry?.anomalies?.risk_score || 0;
                    return risk > 7 ? '#ef4444' : risk > 5 ? '#f59e0b' : '#10b981';
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          
          {/* Cumulative Excess Chart */}
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-red-400" />
                Cumulative Excess Fuel
              </h3>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date"
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                  tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  tick={{ fill: '#cbd5e1', fontSize: 11 }}
                  label={{ value: 'Excess Fuel (MT)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#cbd5e1' } }}
                />
                <Tooltip content={<FuelAnomalyTooltip />} />
                
                <Area
                  type="monotone"
                  dataKey="Cumulative Excess"
                  stroke="#ef4444"
                  fill="url(#excessGradient)"
                  strokeWidth={3}
                />
                
                <defs>
                  <linearGradient id="excessGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Anomaly Breakdown */}
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Anomaly Breakdown
              </h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(summary.anomalyTypes).map(([type, count]) => {
                const percentage = (count / summary.totalDays) * 100;
                const typeInfo = getAnomalyTypeInfo(type);
                
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <typeInfo.icon className="w-4 h-4" style={{ color: typeInfo.color }} />
                        <span className="text-sm text-slate-300">{typeInfo.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{count}</span>
                        <span className="text-xs text-slate-400">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, percentage)}%`,
                          backgroundColor: typeInfo.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Detailed Analysis Table */}
        <div className="mt-6 bg-slate-800/50 border border-white/10 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Investigation Timeline
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Risk Level</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Reported Fuel</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Theoretical</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Variance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Key Anomalies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {anomalyData
                  .filter(d => d.anomalies.detected.length > 0)
                  .slice(0, 10) // Show only top 10 anomalous days
                  .map((day, index) => {
                    const variance = ((day.lf.fuel_consumption - day.calculated.theoretical_fuel) / day.calculated.theoretical_fuel) * 100;
                    const riskLevel = day.anomalies.risk_level;
                    
                    return (
                      <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-white">
                          {new Date(day.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            riskLevel.level === 'critical' ? 'bg-red-500/20 text-red-300' :
                            riskLevel.level === 'high' ? 'bg-orange-500/20 text-orange-300' :
                            riskLevel.level === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {riskLevel.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-white">
                          {day.lf.fuel_consumption.toFixed(1)} MT
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {day.calculated.theoretical_fuel.toFixed(1)} MT
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${
                            variance > 20 ? 'text-red-400' : variance > 10 ? 'text-orange-400' : 'text-yellow-400'
                          }`}>
                            +{variance.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            {day.anomalies.detected.slice(0, 2).map((anomaly, i) => (
                              <div key={i} className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  anomaly.severity === 'high' ? 'bg-red-400' :
                                  anomaly.severity === 'medium' ? 'bg-orange-400' : 'bg-yellow-400'
                                }`} />
                                <span className="text-xs text-slate-400 truncate">
                                  {anomaly.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate metrics for each analysis level
function calculateLevelMetrics(anomalyData, level) {
  let issueCount = 0;
  let totalRiskScore = 0;
  let affectedDays = 0;
  const topIssues = [];
  
  anomalyData.forEach(day => {
    const levelAnomalies = day.anomalies.detected.filter(anomaly => {
      if (level === 'lf_hf') {
        return [ANOMALY_TYPES.RPM_INFLATION, ANOMALY_TYPES.WEATHER_MISREPORT].includes(anomaly.type);
      } else if (level === 'physics') {
        return [ANOMALY_TYPES.EXCESS_CONSUMPTION, ANOMALY_TYPES.STATIC_CONSUMPTION, ANOMALY_TYPES.CORRELATION_BREAK].includes(anomaly.type);
      } else if (level === 'benchmark') {
        return [ANOMALY_TYPES.POWER_MISMATCH].includes(anomaly.type);
      }
      return false;
    });
    
    if (levelAnomalies.length > 0) {
      affectedDays++;
      issueCount += levelAnomalies.length;
      totalRiskScore += day.anomalies.risk_score;
      
      levelAnomalies.forEach(anomaly => {
        if (!topIssues.includes(anomaly.description)) {
          topIssues.push(anomaly.description);
        }
      });
    }
  });
  
  return {
    issueCount,
    riskScore: affectedDays > 0 ? totalRiskScore / affectedDays : 0,
    affectedDays,
    topIssues: topIssues.slice(0, 3)
  };
}

// Helper function to get anomaly type information
function getAnomalyTypeInfo(type) {
  const typeMap = {
    [ANOMALY_TYPES.STATIC_CONSUMPTION]: {
      name: 'Static Consumption',
      icon: TrendingUp,
      color: '#ef4444'
    },
    [ANOMALY_TYPES.RPM_INFLATION]: {
      name: 'RPM Inflation',
      icon: Gauge,
      color: '#f59e0b'
    },
    [ANOMALY_TYPES.WEATHER_MISREPORT]: {
      name: 'Weather Misreport',
      icon: Activity,
      color: '#8b5cf6'
    },
    [ANOMALY_TYPES.EXCESS_CONSUMPTION]: {
      name: 'Excess Consumption',
      icon: Fuel,
      color: '#ef4444'
    },
    [ANOMALY_TYPES.POWER_MISMATCH]: {
      name: 'Power Mismatch',
      icon: Zap,
      color: '#06b6d4'
    },
    [ANOMALY_TYPES.CORRELATION_BREAK]: {
      name: 'Correlation Break',
      icon: Target,
      color: '#f97316'
    }
  };
  
  return typeMap[type] || {
    name: 'Unknown',
    icon: AlertTriangle,
    color: '#6b7280'
  };
}

export default FuelAnomalyView;
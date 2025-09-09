// Complete FuelAnomalyView component with working polynomial best-fit curves

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

// --- MOCK DATA AND FUNCTIONS ---

// Sample vessels for selection
const sampleVessels = [
  { id: 'vessel_1', name: 'MV Atlantic Pioneer' },
  { id: 'vessel_2', name: 'MV Pacific Navigator' },
  { id: 'vessel_3', name: 'MV Ocean Explorer' },
  { id: 'vessel_4', name: 'MV Global Trader' },
  { id: 'vessel_5', name: 'MV Northern Star' }
];

const SISTER_VESSEL_MAP = {
  vessel_1: 'vessel_2',
  vessel_2: 'vessel_1',
  vessel_3: 'vessel_4',
  vessel_4: 'vessel_3',
  vessel_5: 'vessel_1',
};

// Generates mock data for the fuel anomaly dashboard
const generateFuelAnomalyData = (primaryVesselId, sisterVesselId, months) => {
  const data = [];
  const days = months * 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split('T')[0];

    const lfFuelConsumption = 30 + Math.random() * 5;
    const hfFuelFlowRate = (lfFuelConsumption / 24) * (1 + (Math.random() - 0.5) * 0.1);
    const theoreticalFuel = lfFuelConsumption * (1 - (Math.random() * 0.1));
    const sisterConsumption = lfFuelConsumption * (1 - (Math.random() * 0.1) - 0.05);

    data.push({
      date: dateString,
      lf: {
        fuel_consumption: lfFuelConsumption,
        me_consumption: lfFuelConsumption * 0.9,
        total_consumption: lfFuelConsumption,
        me_power: 6000 + Math.random() * 1000,
        weather_bf: 3 + Math.random() * 2,
        speed_obs: 12 + Math.random() * 2,
        rpm: 80 + Math.random() * 5
      },
      hf: {
        fuel_flow_rate: hfFuelFlowRate,
        engine_power: 6000 + Math.random() * 1000,
        weather_actual: 3 + Math.random() * 2,
        speed_obs: 12 + Math.random() * 2,
        rpm_actual: 80 + Math.random() * 5
      },
      calculated: {
        theoretical_fuel: theoreticalFuel
      },
      sister: {
        fuel_consumption: sisterConsumption
      },
      anomalies: {
        risk_score: Math.random() > 0.8 ? 5 : (Math.random() > 0.5 ? 2 : 1)
      }
    });
  }
  return data;
};

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
const SleekHeader = ({ selectedVessel, sisterVessel, confidence, onExport }) => {
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

  return (
    <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Title & Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Fuel className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Fuel Anomaly Detection</h1>
            </div>
          </div>
          
          {/* Compact Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/60 rounded-lg border border-gray-200">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: getStatusColor(confidence.overall) }}
            />
            <span className="text-xs font-medium text-gray-900">{getStatusText(confidence.overall)}</span>
            <div className="w-px h-4 bg-gray-400/50 mx-1" />
            <div className="text-center">
              <div className="text-sm font-bold text-gray-900">{confidence.overall}%</div>
              <div className="text-[10px] text-gray-600">Confidence</div>
            </div>
          </div>
        </div>

        {/* Right: Export Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExport}
            className="px-3 py-1.5 bg-gray-200/60 hover:bg-gray-300/60 text-gray-900 rounded-md transition-all duration-200 flex items-center gap-1.5 text-xs font-medium"
          >
            <Download className="w-3 h-3" />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

// Sleek Card Component
const SleekCard = ({ title, children, icon: Icon, accent = '#3b82f6', compact = false }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div 
        className="px-4 py-3 border-b border-gray-200"
        style={{ background: `linear-gradient(135deg, ${accent}08, ${accent}03)` }}
      >
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
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

// Main Timeline Chart - HF, LF, Predicted Comparison
const MainTimelineChart = ({ anomalyData }) => {
  const chartData = anomalyData.map(day => ({
    date: day.date,
    lfConsumption: day.lf.total_consumption,
    predictedConsumption: day.calculated.theoretical_fuel,
  }));

  return (
    <SleekCard title="Reported vs Predictive Analysis - Total Consumption Timeline" icon={TrendingUp} accent="#6366f1">
      <div className="mb-3 p-2 bg-gray-100/60 rounded-lg">
        <p className="text-xs text-gray-700">
          <strong className="text-indigo-400">Analysis Type:</strong> Comparing crew-reported data (LF) and AI predictions over time
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#4a5568', fontSize: 11 }}
              tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            
            <YAxis 
              yAxisId="fuel"
              tick={{ fill: '#4a5568', fontSize: 11 }}
              label={{ value: 'Total Consumption (MT/day)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#4a5568' } }}
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                border: '1px solid rgba(0,0,0,0.2)', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
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
              dataKey="predictedConsumption"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 2, fill: '#10b981' }}
              name="AI Predicted"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Chart Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-orange-500"></div>
          <span className="text-gray-700">LF Reported (Crew Data)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-green-500 border-dashed border-b-2 border-green-500"></div>
          <span className="text-gray-700">AI Predicted</span>
        </div>
      </div>
    </SleekCard>
  );
};

// FIXED: Helper function to calculate polynomial best-fit curve
const calculatePolynomialFit = (data, numPoints = 50) => {
  if (!data || data.length < 3) return null;
  
  const n = data.length;
  let sumX = 0, sumY = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0, sumXY = 0, sumX2Y = 0;
  
  // Convert speed/consumption to numerical values for calculation
  const points = data.map(p => ({
    x: p.speed,
    y: p.consumption
  }));

  for (let i = 0; i < n; i++) {
    const x = points[i].x;
    const y = points[i].y;
    sumX += x;
    sumY += y;
    sumX2 += x * x;
    sumX3 += x * x * x;
    sumX4 += x * x * x * x;
    sumXY += x * y;
    sumX2Y += x * x * y;
  }

  const m = [
    [n, sumX, sumX2],
    [sumX, sumX2, sumX3],
    [sumX2, sumX3, sumX4]
  ];
  const v = [sumY, sumXY, sumX2Y];

  // Solve for coefficients a, b, c using Cramer's rule for a 3x3 matrix
  const det = m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
              m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
              m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

  if (Math.abs(det) < 1e-10) return null; // Cannot solve (singular matrix)

  const detA = v[0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
               m[0][1] * (v[1] * m[2][2] - m[1][2] * v[2]) +
               m[0][2] * (v[1] * m[2][1] - m[1][1] * v[2]);

  const detB = m[0][0] * (v[1] * m[2][2] - m[1][2] * v[2]) -
               v[0] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
               m[0][2] * (m[1][0] * v[2] - v[1] * m[2][0]);

  const detC = m[0][0] * (m[1][1] * v[2] - v[1] * m[2][1]) -
               m[0][1] * (m[1][0] * v[2] - v[1] * m[2][0]) +
               v[0] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

  const c = detA / det; // constant term (a0)
  const b = detB / det; // linear term (a1)
  const a = detC / det; // quadratic term (a2)

  // Generate points for the curve
  const curvePoints = [];
  const minSpeed = Math.min(...points.map(p => p.x));
  const maxSpeed = Math.max(...points.map(p => p.x));
  const step = (maxSpeed - minSpeed) / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    const speed = minSpeed + (i * step);
    const consumption = a * speed * speed + b * speed + c;
    curvePoints.push({ 
      speed: parseFloat(speed.toFixed(2)), 
      consumption: parseFloat(consumption.toFixed(2)),
      name: `Polynomial Fit` // Required for Recharts Line component
    });
  }

  return curvePoints;
};

// Main Fuel Anomaly View Component
const FuelAnomalyView = ({ className = '' }) => {
  const [selectedVessel, setSelectedVessel] = useState('vessel_1');
  const [sisterVessel, setSisterVessel] = useState('vessel_2');

  const anomalyData = useMemo(() => {
    return generateFuelAnomalyData(selectedVessel, sisterVessel, 6);
  }, [selectedVessel, sisterVessel]);

  const confidence = useMemo(() => {
    return calculateEnhancedConfidence(anomalyData);
  }, [anomalyData]);

  const handleExport = () => {
    console.log('Exporting fuel anomaly report...');
  };

  // FIXED: Better sample data with more variation for better curve fitting
  const primaryVesselLadenData = [
    { speed: 11.2, consumption: 33.5, condition: 'Laden' },
    { speed: 11.8, consumption: 35.2, condition: 'Laden' },
    { speed: 10.9, consumption: 32.8, condition: 'Laden' },
    { speed: 11.5, consumption: 34.1, condition: 'Laden' },
    { speed: 11.0, consumption: 33.2, condition: 'Laden' },
    { speed: 12.1, consumption: 35.8, condition: 'Laden' },
    { speed: 10.7, consumption: 32.1, condition: 'Laden' },
    { speed: 12.3, consumption: 36.4, condition: 'Laden' }
  ];
  
  const primaryVesselBallastData = [
    { speed: 12.8, consumption: 31.2, condition: 'Ballast' },
    { speed: 13.1, consumption: 32.1, condition: 'Ballast' },
    { speed: 12.5, consumption: 30.8, condition: 'Ballast' },
    { speed: 12.9, consumption: 31.5, condition: 'Ballast' },
    { speed: 13.0, consumption: 31.8, condition: 'Ballast' },
    { speed: 13.4, consumption: 32.8, condition: 'Ballast' },
    { speed: 12.3, consumption: 30.2, condition: 'Ballast' },
    { speed: 13.6, consumption: 33.1, condition: 'Ballast' }
  ];
  
  const sisterVesselLadenData = [
    { speed: 11.7, consumption: 30.8, condition: 'Laden' },
    { speed: 12.1, consumption: 31.9, condition: 'Laden' },
    { speed: 11.4, consumption: 30.2, condition: 'Laden' },
    { speed: 11.9, consumption: 31.2, condition: 'Laden' },
    { speed: 11.6, consumption: 30.9, condition: 'Laden' },
    { speed: 12.3, consumption: 32.4, condition: 'Laden' },
    { speed: 11.2, consumption: 29.8, condition: 'Laden' },
    { speed: 12.5, consumption: 32.8, condition: 'Laden' }
  ];
  
  const sisterVesselBallastData = [
    { speed: 13.4, consumption: 28.5, condition: 'Ballast' },
    { speed: 13.6, consumption: 29.1, condition: 'Ballast' },
    { speed: 13.2, consumption: 28.2, condition: 'Ballast' },
    { speed: 13.5, consumption: 28.8, condition: 'Ballast' },
    { speed: 13.3, consumption: 28.6, condition: 'Ballast' },
    { speed: 13.8, consumption: 29.4, condition: 'Ballast' },
    { speed: 13.0, consumption: 27.9, condition: 'Ballast' },
    { speed: 14.0, consumption: 29.8, condition: 'Ballast' }
  ];

  // Calculate polynomial fits
  const primaryLadenFit = useMemo(() => calculatePolynomialFit(primaryVesselLadenData), []);
  const primaryBallastFit = useMemo(() => calculatePolynomialFit(primaryVesselBallastData), []);
  const sisterLadenFit = useMemo(() => calculatePolynomialFit(sisterVesselLadenData), []);
  const sisterBallastFit = useMemo(() => calculatePolynomialFit(sisterVesselBallastData), []);

  return (
    <div className={`bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 text-gray-900 min-h-screen ${className}`}>
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
        {/* Main Timeline Chart */}
        <MainTimelineChart anomalyData={anomalyData} />
        
        {/* Bottom Row: Sister Vessel Speed vs Consumption Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* FIXED: Speed vs Consumption Scatter Plot with Polynomial Curves */}
          <SleekCard title="Sister Vessel Analysis - Speed vs Consumption Comparison" icon={Ship} accent="#8b5cf6">
            {/* <div className="mb-3 p-2 bg-gray-100/60 rounded-lg">
              <p className="text-xs text-gray-700">
                <strong className="text-purple-400">Analysis Type:</strong> Comparing vessel performance against similar sister vessel in laden and ballast conditions with polynomial trend analysis
              </p>
            </div> */}
            
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis 
                    type="number"
                    dataKey="speed"
                    domain={[10, 15]}
                    tick={{ fill: '#4a5568', fontSize: 11 }}
                    label={{ 
                      value: 'Speed (knots)', 
                      position: 'insideBottom', 
                      offset: -10, 
                      style: { textAnchor: 'middle', fill: '#4a5568', fontSize: '12px' } 
                    }}
                  />
                  <YAxis 
                    type="number"
                    dataKey="consumption"
                    domain={[27, 38]}
                    tick={{ fill: '#4a5568', fontSize: 11 }}
                    label={{ 
                      value: 'Consumption (MT/day)', 
                      angle: -90, 
                      position: 'insideLeft', 
                      style: { textAnchor: 'middle', fill: '#4a5568', fontSize: '12px' } 
                    }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid rgba(0,0,0,0.2)', 
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value, name) => [
                      typeof value === 'number' ? value.toFixed(2) : value,
                      name
                    ]}
                    labelFormatter={(label) => `Speed: ${label} knots`}
                  />
                  
                  {/* Polynomial Fit Curves */}
                  {primaryLadenFit && (
                    <Line 
                      type="monotone"
                      dataKey="consumption" 
                      data={primaryLadenFit}
                      stroke="#f59e0b" 
                      strokeWidth={2} 
                      dot={false}
                      connectNulls={true}
                      name="Primary Laden Trend"
                    />
                  )}
                  
                  {primaryBallastFit && (
                    <Line 
                      type="monotone"
                      dataKey="consumption" 
                      data={primaryBallastFit}
                      stroke="#06b6d4" 
                      strokeWidth={2} 
                      dot={false}
                      connectNulls={true}
                      name="Primary Ballast Trend"
                    />
                  )}
                  
                  {sisterLadenFit && (
                    <Line 
                      type="monotone"
                      dataKey="consumption" 
                      data={sisterLadenFit}
                      stroke="#10b981" 
                      strokeWidth={2} 
                      dot={false}
                      connectNulls={true}
                      name="Sister Laden Trend"
                    />
                  )}
                  
                  {sisterBallastFit && (
                    <Line 
                      type="monotone"
                      dataKey="consumption" 
                      data={sisterBallastFit}
                      stroke="#8b5cf6" 
                      strokeWidth={2} 
                      dot={false}
                      connectNulls={true}
                      name="Sister Ballast Trend"
                    />
                  )}
                  
                  {/* Scatter Points */}
                  <Scatter 
                    data={primaryVesselLadenData}
                    fill="#f59e0b" 
                    shape="circle"
                    name="Primary Vessel (Laden)"
                  />
                  
                  <Scatter 
                    data={primaryVesselBallastData}
                    fill="#06b6d4" 
                    shape="circle"
                    name="Primary Vessel (Ballast)"
                  />
                  
                  <Scatter 
                    data={sisterVesselLadenData}
                    fill="#10b981" 
                    shape="diamond"
                    name="Sister Vessel (Laden)"
                  />
                  
                  <Scatter 
                    data={sisterVesselBallastData}
                    fill="#8b5cf6" 
                    shape="diamond"
                    name="Sister Vessel (Ballast)"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            {/* Enhanced Chart Legend */}
            <div className="mt-4 space-y-2">
              {/* Data Points Legend */}
              <div className="text-xs text-gray-600 mb-2">
                <span className="font-medium">Data Points:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-gray-700">Primary (Laden)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <span className="text-gray-700">Primary (Ballast)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 transform rotate-45"></div>
                  <span className="text-gray-700">Sister (Laden)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 transform rotate-45"></div>
                  <span className="text-gray-700">Sister (Ballast)</span>
                </div>
              </div>
              
              {/* Trend Lines Legend */}
              {/* <div className="text-xs text-gray-600 mb-2">
                <span className="font-medium">Polynomial Trend Lines:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-orange-500"></div>
                  <span className="text-gray-700">Primary Laden</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-cyan-500"></div>
                  <span className="text-gray-700">Primary Ballast</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-green-500"></div>
                  <span className="text-gray-700">Sister Laden</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-purple-500"></div>
                  <span className="text-gray-700">Sister Ballast</span>
                </div>
              </div> */}
              
              {/* Analysis Note */}
              <div className="mt-3 p-2 bg-purple-50 rounded-md border border-purple-200">
                <p className="text-xs text-purple-700">
                  <strong>Trend Analysis:</strong> Polynomial curves show fuel efficiency patterns. Sister vessel demonstrates consistently lower consumption across both laden and ballast conditions.
                </p>
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
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-700 font-medium">Condition</th>
                      <th className="text-center py-2 text-gray-700 font-medium">Primary</th>
                      <th className="text-center py-2 text-gray-700 font-medium">Sister</th>
                      <th className="text-center py-2 text-gray-700 font-medium">Excess</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2 text-gray-900 font-medium">Laden</td>
                      <td className="py-2 text-center text-gray-700">33.8 MT</td>
                      <td className="py-2 text-center text-gray-700">31.0 MT</td>
                      <td className="py-2 text-center">
                        <span className="text-red-400 font-semibold">+9.0%</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-900 font-medium">Ballast</td>
                      <td className="py-2 text-center text-gray-700">31.5 MT</td>
                      <td className="py-2 text-center text-gray-700">28.6 MT</td>
                      <td className="py-2 text-center">
                        <span className="text-orange-400 font-semibold">+10.1%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial Impact */}
              <div className="bg-gray-100/60 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Financial Impact Analysis</h4>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-red-400">$76,200</div>
                    <div className="text-xs text-gray-600">Estimated Excess Cost</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-400">127 MT</div>
                    <div className="text-xs text-gray-600">Total Excess Fuel</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Avg Performance Gap</span>
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
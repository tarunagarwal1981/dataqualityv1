import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  Ship,
  BarChart3,
  Database,
  Fuel,
  Navigation,
  Activity,
  Package,
  Users,
  Anchor,
  Clock,
  Info,
  ExternalLink,
  TrendingUp,
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  MapPin,
  Waves,
  Settings,
  X,
  Check,
  Zap,
  Radio,
  Layers,
  Target,
  Shield,
  Gauge,
  CheckSquare,
  RefreshCw,
  AlertCircle,
  Minus,
  HelpCircle,
  XCircle,
  WifiOff,
  SignalHigh,
  SignalLow,
  BarChart2,
  LineChart,
  PieChart,
} from 'lucide-react';

// Import the shared DataQualityCards component
import DataQualityCards, { staticQualityData } from './DataQualityCards';

// Data types and KPIs for table view
const DATA_TYPES = {
  COMBINED: 'combined',
  LF: 'lf',
  HF: 'hf',
};

const ALL_KPIS = {
  LF: [
    {
      id: 'obs_speed',
      name: 'Obs Speed',
      unit: 'knts',
      category: 'performance',
      source: 'LF',
    },
    {
      id: 'me_consumption',
      name: 'ME Consumption',
      unit: 'Mt',
      category: 'fuel',
      source: 'LF',
    },
    {
      id: 'total_consumption',
      name: 'Total Consumption',
      unit: 'Mt',
      category: 'fuel',
      source: 'LF',
    },
    {
      id: 'wind_force',
      name: 'Wind Force',
      unit: 'Beaufort',
      category: 'weather',
      source: 'LF',
    },
    {
      id: 'laden_condition',
      name: 'Loading Condition',
      unit: '',
      category: 'operation',
      source: 'LF',
    },
    {
      id: 'me_power',
      name: 'ME Power',
      unit: 'kW',
      category: 'performance',
      source: 'LF',
    },
    {
      id: 'me_sfoc',
      name: 'ME SFOC',
      unit: 'gm/kWhr',
      category: 'performance',
      source: 'LF',
    },
    {
      id: 'rpm',
      name: 'RPM',
      unit: 'rpm',
      category: 'performance',
      source: 'LF',
    },
  ],
  HF: [
    {
      id: 'obs_speed',
      name: 'Obs Speed',
      unit: 'knts',
      category: 'performance',
      source: 'HF',
    },
    {
      id: 'me_consumption',
      name: 'ME Consumption',
      unit: 'Mt',
      category: 'fuel',
      source: 'HF',
    },
    {
      id: 'total_consumption',
      name: 'Total Consumption',
      unit: 'Mt',
      category: 'fuel',
      source: 'HF',
    },
    {
      id: 'wind_force',
      name: 'Wind Force',
      unit: 'Beaufort',
      category: 'weather',
      source: 'HF',
    },
    {
      id: 'laden_condition',
      name: 'Loading Condition',
      unit: '',
      category: 'operation',
      source: 'HF',
    },
    {
      id: 'me_power',
      name: 'ME Power',
      unit: 'kW',
      category: 'performance',
      source: 'HF',
    },
    {
      id: 'me_sfoc',
      name: 'ME SFOC',
      unit: 'gm/kWhr',
      category: 'performance',
      source: 'HF',
    },
    {
      id: 'rpm',
      name: 'RPM',
      unit: 'rpm',
      category: 'performance',
      source: 'HF',
    },
  ],
};

// Enhanced Quality Badge Component
const EnhancedQualityIndicator = ({
  completeness,
  correctness,
  issues = [],
  size = 'sm',
  showDetails = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const overallScore = Math.round((completeness + correctness) / 2);

  const getQualityColor = (score) => {
    if (score >= 85)
      return {
        bg: 'bg-emerald-500',
        text: 'text-emerald-400',
        ring: 'ring-emerald-500/20',
      };
    if (score >= 70)
      return {
        bg: 'bg-yellow-500',
        text: 'text-yellow-400',
        ring: 'ring-yellow-500/20',
      };
    return { bg: 'bg-red-500', text: 'text-red-400', ring: 'ring-red-500/20' };
  };

  const colors = getQualityColor(overallScore);
  const radius = size === 'sm' ? 12 : 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`relative ${
          size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'
        } cursor-help`}
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r={radius}
            stroke="rgb(51 65 85)"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="16"
            cy="16"
            r={radius}
            stroke={colors.bg.replace('bg-', 'rgb(').replace('-500', ' 500)')}
            strokeWidth="2"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-bold ${
              size === 'sm' ? 'text-xs' : 'text-sm'
            } text-white`}
          >
            {overallScore}
          </span>
        </div>

        {issues.length > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {issues.length}
            </span>
          </div>
        )}
      </div>

      {/* Enhanced Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-slate-800 border border-white/20 rounded-lg shadow-xl z-50">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">
                Data Quality
              </span>
              <span className={`text-sm font-bold ${colors.text}`}>
                {overallScore}%
              </span>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Completeness</span>
                <span className="text-white font-medium">{completeness}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    completeness >= 85
                      ? 'bg-emerald-500'
                      : completeness >= 70
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${completeness}%` }}
                />
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Correctness</span>
                <span className="text-white font-medium">{correctness}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    correctness >= 85
                      ? 'bg-emerald-500'
                      : correctness >= 70
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${correctness}%` }}
                />
              </div>
            </div>

            {issues.length > 0 && (
              <div className="border-t border-white/10 pt-2">
                <span className="text-xs font-medium text-slate-300 block mb-1">
                  Active Issues:
                </span>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {issues.slice(0, 3).map((issue, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs">
                      {issue.type === 'completeness' ? (
                        <Minus className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-slate-300">{issue.message}</span>
                    </div>
                  ))}
                  {issues.length > 3 && (
                    <div className="text-xs text-slate-400">
                      +{issues.length - 3} more issues
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-800"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// NEW: Vessel-wise Performance Charts Component
const VesselPerformanceCharts = ({ data, selectedKPIs, selectedDataType }) => {
  // Calculate vessel performance metrics
  const vesselMetrics = useMemo(() => {
    if (!data || data.length === 0) return null;

    const dataKey = selectedDataType.toLowerCase();
  
    return data.map(vessel => {
      const speed = vessel[dataKey]?.obs_speed || 0;
      const consumption = vessel[dataKey]?.me_consumption || 0;
      const ladenCondition = vessel[dataKey]?.laden_condition;
    
      // Calculate efficiency (kg/nm) - simplified calculation
      const efficiency = speed > 0 ? (consumption * 1000) / speed : 0;
    
      return {
        vesselName: vessel.vesselName,
        shortName: vessel.vesselName.replace('MV ', '').substring(0, 8),
        speed: speed,
        consumption: consumption,
        efficiency: efficiency,
        ladenCondition: ladenCondition === 1 ? 'Laden' : 'Ballast',
        qualityScore: vessel.quality.overallScore,
        completeness: vessel.quality.completeness, // Add completeness
        correctness: vessel.quality.correctness,   // Add correctness
        vesselId: vessel.id
      };
    }).filter(v => v.speed > 0 || v.consumption > 0); // Filter out vessels with no data
  }, [data, selectedDataType]);

  if (!vesselMetrics || vesselMetrics.length === 0) return null;

  const maxSpeed = Math.max(...vesselMetrics.map(v => v.speed));
  const maxConsumption = Math.max(...vesselMetrics.map(v => v.consumption));
  const maxEfficiency = Math.max(...vesselMetrics.map(v => v.efficiency));

  // Card component matching quality cards style
  const Card = ({ children, gradient = 'default', className = '' }) => {
    const gradients = {
      default: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
      performance: 'linear-gradient(145deg, rgba(6, 182, 212, 0.1) 0%, rgba(30, 41, 59, 0.95) 100%)',
      efficiency: 'linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(30, 41, 59, 0.95) 100%)',
      quality: 'linear-gradient(145deg, rgba(139, 92, 246, 0.1) 0%, rgba(30, 41, 59, 0.95) 100%)',
    };

    return (
      <div
        className={`relative overflow-hidden rounded-xl border transition-all duration-300 ease-out ${className}`}
        style={{
          background: gradients[gradient],
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 4px 8px rgba(0, 0, 0, 0.2)
          `,
          transform: 'translateZ(0)',
        }}
      >
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      {/* Performance Overview - Parallel Bar Chart with Dual Y-Axis */}
      <Card gradient="performance" className="hover:transform hover:translateY(-2px) hover:scale-[1.01]">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1.5 rounded-md bg-cyan-500/20 border border-cyan-500/30">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-200 block">Speed & Consumption</span>
              <span className="text-[9px] text-slate-400">Parallel comparison</span>
            </div>
          </div>
        
          <div className="relative h-32 bg-slate-800/30 rounded-lg p-2">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-between text-[8px] text-cyan-400 py-2">
              <span>{maxSpeed.toFixed(0)}</span>
              <span>{(maxSpeed/2).toFixed(0)}</span>
              <span>0</span>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-6 flex flex-col justify-between text-[8px] text-orange-400 py-2 text-right">
              <span>{maxConsumption.toFixed(0)}</span>
              <span>{(maxConsumption/2).toFixed(0)}</span>
              <span>0</span>
            </div>
          
            <div className="absolute inset-0 mx-6 border-l border-b border-slate-600/50">
              {/* Grid lines */}
              <div className="absolute inset-0">
                {[25, 50, 75].map(percent => (
                  <div key={percent} 
                    className="absolute w-full border-t border-slate-600/20" 
                    style={{ bottom: `${percent}%` }} 
                  />
                ))}
              </div>
            
              <div className="flex items-end justify-between h-full gap-1 px-2">
                {vesselMetrics.slice(0, 6).map((vessel) => {
                  const speedHeight = (vessel.speed / maxSpeed) * 85;
                  const consumptionHeight = (vessel.consumption / maxConsumption) * 85;
                
                  return (
                    <div key={vessel.vesselId} className="flex items-end gap-1 group cursor-pointer" title={`${vessel.vesselName}: ${vessel.speed.toFixed(1)} kn, ${vessel.consumption.toFixed(1)} Mt`}>
                      {/* Speed bar (left) */}
                      <div 
                        className="w-2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all duration-300 group-hover:from-cyan-500 group-hover:to-cyan-300 group-hover:w-2.5"
                        style={{ height: `${speedHeight}px` }}
                      />
                      {/* Consumption bar (right) */}
                      <div 
                        className="w-2 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t transition-all duration-300 group-hover:from-orange-500 group-hover:to-orange-300 group-hover:w-2.5"
                        style={{ height: `${consumptionHeight}px` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          
            {/* X-axis vessel labels */}
            <div className="absolute bottom-0 left-6 right-6 flex justify-between">
              {vesselMetrics.slice(0, 6).map((vessel) => (
                <div key={vessel.vesselId} className="text-[7px] text-slate-400 text-center w-6 truncate">
                  {vessel.shortName}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-cyan-500/20">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-slate-300">Speed (kn)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-slate-300">Fuel (Mt)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Fuel Efficiency Bar Chart with Vessel Names */}
      <Card gradient="efficiency" className="hover:transform hover:translateY(-2px) hover:scale-[1.01]">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1.5 rounded-md bg-emerald-500/20 border border-emerald-500/30">
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-200 block">Fuel Efficiency</span>
              <span className="text-[9px] text-slate-400">kg/nm by vessel</span>
            </div>
          </div>

          <div className="relative h-32 bg-slate-800/30 rounded-lg p-2">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[8px] text-emerald-400 py-2">
              <span>{maxEfficiency.toFixed(0)}</span>
              <span>{(maxEfficiency*0.66).toFixed(0)}</span>
              <span>{(maxEfficiency*0.33).toFixed(0)}</span>
              <span>0</span>
            </div>
          
            <div className="absolute inset-0 ml-8 border-l border-b border-slate-600/50">
              {/* Grid lines */}
              <div className="absolute inset-0">
                {[25, 50, 75].map(percent => (
                  <div key={percent} 
                    className="absolute w-full border-t border-slate-600/20" 
                    style={{ bottom: `${percent}%` }} 
                  />
                ))}
              </div>
            
              <div className="flex items-end justify-between h-full gap-1 px-2">
                {vesselMetrics.slice(0, 7).map((vessel) => {
                  const barHeight = (vessel.efficiency / maxEfficiency) * 85;
                  const isLaden = vessel.ladenCondition === 'Laden';
                
                  return (
                    <div key={vessel.vesselId} className="flex flex-col items-center group cursor-pointer" title={`${vessel.vesselName}: ${vessel.efficiency.toFixed(1)} kg/nm (${vessel.ladenCondition})`}>
                      <div 
                        className={`w-3 rounded-t transition-all duration-300 group-hover:w-4 ${
                          isLaden 
                            ? 'bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300' 
                            : 'bg-gradient-to-t from-orange-600 to-orange-400 group-hover:from-orange-500 group-hover:to-orange-300'
                        }`}
                        style={{ height: `${barHeight}px` }}
                      />
                      {/* Loading condition indicator */}
                      <div className={`w-2 h-1 mt-0.5 rounded-full ${
                        isLaden ? 'bg-blue-400' : 'bg-orange-400'
                      }`} />
                    </div>
                  );
                })}
              </div>
            </div>
          
            {/* X-axis vessel labels */}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between pr-2">
              {vesselMetrics.slice(0, 7).map((vessel) => (
                <div key={vessel.vesselId} className="text-[7px] text-slate-400 text-center w-4 truncate transform -rotate-45 origin-top">
                  {vessel.shortName}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-emerald-500/20">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                <span className="text-slate-300">Laden</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
                <span className="text-slate-300">Ballast</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* NEW: Data Quality - Scatter Plot */}
      <Card gradient="quality" className="hover:transform hover:translateY(-2px) hover:scale-[1.01]">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1.5 rounded-md bg-purple-500/20 border border-purple-500/30">
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-200 block">Data Quality</span>
              <span className="text-[9px] text-slate-400">Completeness vs. Correctness</span>
            </div>
          </div>

          <div className="relative h-32 bg-slate-800/30 rounded-lg p-2">
            {/* Chart Area */}
            <div className="absolute inset-0 p-2">
              {/* Quadrant Lines */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-full h-px bg-slate-600/50" style={{ top: '50%' }}></div> {/* Horizontal line (Completeness 50%) */}
                <div className="absolute h-full w-px bg-slate-600/50" style={{ left: '50%' }}></div> {/* Vertical line (Correctness 50%) */}
              </div>

              {/* X-axis labels (Correctness) */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-slate-400 px-2 pb-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              {/* Y-axis labels (Completeness) */}
              <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-between text-[8px] text-slate-400 py-2 pl-1">
                <span>100%</span>
                <span>50%</span>
                <span>0%</span>
              </div>

              {/* Scatter Points */}
              {vesselMetrics.map((vessel) => {
                const xPos = (vessel.correctness / 100) * 90 + 5; // Scale to 0-100, add padding
                const yPos = 100 - ((vessel.completeness / 100) * 90 + 5); // Scale and invert for Y-axis, add padding

                let pointColor = 'bg-slate-400'; // Default
                if (vessel.completeness >= 85 && vessel.correctness >= 85) {
                  pointColor = 'bg-emerald-500'; // High quality
                } else if (vessel.completeness >= 70 && vessel.correctness >= 70) {
                  pointColor = 'bg-yellow-500'; // Medium quality
                } else if (vessel.completeness < 70 || vessel.correctness < 70) {
                  pointColor = 'bg-red-500'; // Low quality
                }

                return (
                  <div
                    key={vessel.vesselId}
                    className={`absolute w-2 h-2 rounded-full ${pointColor} cursor-pointer transition-all duration-100 group`}
                    style={{
                      left: `${xPos}%`,
                      top: `${yPos}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={`${vessel.vesselName}\nCompleteness: ${vessel.completeness}%\nCorrectness: ${vessel.correctness}%`}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-700 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap shadow-lg">
                      {vessel.vesselName}
                      <br />
                      Completeness: {vessel.completeness}%
                      <br />
                      Correctness: {vessel.correctness}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-purple-500/20">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-300">High Quality</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-slate-300">Medium Quality</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-slate-300">Low Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Controls Bar Component
const ControlsBar = ({
  onExport = () => {},
  isExporting = false,
  onKPIChange = () => {},
  selectedDataType,
  setSelectedDataType,
  selectedKPIs,
  setSelectedKPIs,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showKPIDropdown, setShowKPIDropdown] = useState(false);
  const kpiDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        kpiDropdownRef.current &&
        !kpiDropdownRef.current.contains(event.target)
      ) {
        setShowKPIDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDataTypeChange = (type) => {
    setSelectedDataType(type);
    if (type === DATA_TYPES.COMBINED) {
      // For combined, select all unique KPIs from both LF and HF
      const combinedKPIs = [
        ...new Set([...ALL_KPIS.LF, ...ALL_KPIS.HF].map((kpi) => kpi.id)),
      ];
      setSelectedKPIs(combinedKPIs);
    } else {
      setSelectedKPIs(ALL_KPIS[type.toUpperCase()].map((kpi) => kpi.id));
    }
  };

  const handleKPISelection = (kpiId) => {
    setSelectedKPIs((prev) => {
      const currentSelected = prev || [];
      if (currentSelected.includes(kpiId)) {
        return currentSelected.filter((id) => id !== kpiId);
      } else {
        return [...currentSelected, kpiId];
      }
    });
  };

  const handleApply = () => {
    onKPIChange({ dataType: selectedDataType, selectedKPIs });
    setShowKPIDropdown(false);
  };

  const getDataSourceIndicator = (source) => {
    const colors = {
      LF: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      HF: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    };
    return (
      <sup
        className={`ml-1 px-1 py-0.5 text-[8px] font-medium rounded-full border ${colors[source]}`}
      >
        {source}
      </sup>
    );
  };

  const availableKPIs = useMemo(() => {
    if (selectedDataType === DATA_TYPES.COMBINED) {
      // Combine and deduplicate KPIs from both LF and HF
      const combined = {};
      [...ALL_KPIS.LF, ...ALL_KPIS.HF].forEach((kpi) => {
        if (!combined[kpi.id]) {
          combined[kpi.id] = { ...kpi, source: 'COMBINED' };
        }
      });
      return Object.values(combined);
    }
    return ALL_KPIS[selectedDataType.toUpperCase()] || [];
  }, [selectedDataType]);

  return (
    <div className="bg-slate-800/50 border-b border-white/10 p-2">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Fleet Analytics
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={kpiDropdownRef}>
            <button
              onClick={() => setShowKPIDropdown(!showKPIDropdown)}
              className="w-8 h-8 flex items-center justify-center bg-slate-700/50 border border-white/10 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="Configure KPIs"
            >
              <Settings className="w-4 h-4" />
            </button>

            {showKPIDropdown && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-50">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h4 className="text-sm font-semibold text-white">
                    Configure KPIs
                  </h4>
                  <button onClick={() => setShowKPIDropdown(false)}>
                    <X className="w-4 h-4 text-slate-400 hover:text-white" />
                  </button>
                </div>

                <div className="p-2 border-b border-white/10">
                  <label className="text-xs font-medium text-slate-300 mb-2 block">
                    Data Source
                  </label>
                  <div className="flex gap-2">
                    {['LF', 'HF', 'COMBINED'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleDataTypeChange(type.toLowerCase())}
                        className={`flex-1 px-2 py-2 text-xs font-medium rounded-md transition-colors ${
                          selectedDataType === type.toLowerCase()
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-700/50 text-slate-300 border border-white/10 hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {type === 'LF' && <Radio className="w-3 h-3" />}
                          {type === 'HF' && <Zap className="w-3 h-3" />}
                          {type === 'COMBINED' && (
                            <Layers className="w-3 h-3" />
                          )}
                          {type}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 max-h-64 overflow-y-auto">
                  <label className="text-xs font-medium text-slate-300 mb-3 block">
                    Select KPIs ({selectedKPIs?.length || 0} selected)
                  </label>
                  <div className="space-y-2">
                    {availableKPIs.map((kpi) => (
                      <label
                        key={`${kpi.id}-${kpi.source}`}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-700/30 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedKPIs?.includes(kpi.id)}
                          onChange={() => handleKPISelection(kpi.id)}
                          className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white truncate">
                              {kpi.name}
                            </span>
                            {kpi.source !== 'COMBINED' &&
                              getDataSourceIndicator(kpi.source)}
                          </div>
                          {kpi.unit && (
                            <span className="text-xs text-slate-400">
                              ({kpi.unit})
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-white/10 flex justify-end gap-2">
                  <button
                    onClick={handleApply}
                    className="px-2 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setShowKPIDropdown(false)}
                    className="px-2 py-1.5 text-xs font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-8 h-8 flex items-center justify-center bg-slate-700/50 border border-white/10 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => onExport('csv')}
            disabled={isExporting}
            className="w-8 h-8 flex items-center justify-center bg-slate-700/50 border border-white/10 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50"
            title="Export Data"
          >
            {isExporting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Table View Component
const TableView = ({
  className = '',
  onVesselClick = () => {},
  qualityVisible = true, // NEW: Quality toggle prop
  onQualityToggle = () => {}, // NEW: Quality toggle handler
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  // State for data type and KPI selection
  const [selectedDataType, setSelectedDataType] = useState(DATA_TYPES.LF);
  const [selectedKPIs, setSelectedKPIs] = useState(
    ALL_KPIS.LF.map((kpi) => kpi.id)
  );

  // Helper to get KPI details by ID, considering both LF and HF
  const getKpiDetails = (kpiId, source) => {
    if (source) {
      return ALL_KPIS[source.toUpperCase()]?.find((kpi) => kpi.id === kpiId);
    }
    // If source not specified, try to find in LF first, then HF
    return (
      ALL_KPIS.LF.find((kpi) => kpi.id === kpiId) ||
      ALL_KPIS.HF.find((kpi) => kpi.id === kpiId)
    );
  };

  const currentKPIsToDisplay = useMemo(() => {
    if (selectedDataType === DATA_TYPES.COMBINED) {
      // For combined, show each selected KPI (no duplication in display)
      return selectedKPIs.map((kpiId) => {
        const lfKpi = getKpiDetails(kpiId, 'LF');
        return { ...lfKpi, id: kpiId, displaySource: 'COMBINED' };
      }).filter(Boolean);
    } else {
      // For LF or HF, show only selected KPIs from that source
      return (
        ALL_KPIS[selectedDataType.toUpperCase()]?.filter((kpi) =>
          selectedKPIs.includes(kpi.id)
        ) || []
      );
    }
  }, [selectedDataType, selectedKPIs]);

  // Generate sample data with quality issues that match the quality cards
  const sampleData = useMemo(() => {
    return staticQualityData.map((vessel, index) => {
      const data = {
        id: vessel.id,
        vesselName: vessel.name,
        date: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        vesselStatus: vessel.status,
        quality: vessel,
        lf: {},
        hf: {},
      };

      // Generate data for each KPI for both LF and HF
      ['LF', 'HF'].forEach((sourceType) => {
        ALL_KPIS[sourceType].forEach((kpi) => {
          const kpiId = kpi.id;
          const kpiKey = sourceType.toLowerCase();

          // Check if this KPI has any issues for this vessel
          const hasIssue = Object.values(vessel.kpiIssues).some(
            (issue) => issue.kpi === kpiId
          );
          const kpiIssueEntries = Object.values(vessel.kpiIssues).filter(
            (issue) => issue.kpi === kpiId
          );

          // Determine if missing or incorrect
          const hasMissingIssue = kpiIssueEntries.some(
            (issue) => issue.type === 'missing'
          );
          const hasIncorrectIssue = kpiIssueEntries.some(
            (issue) => issue.type === 'incorrect'
          );

          if (hasMissingIssue) {
            data[kpiKey][kpiId] = null;
          } else if (hasIncorrectIssue) {
            // Use specific incorrect values based on the issue
            const incorrectIssue = kpiIssueEntries.find(
              (issue) => issue.type === 'incorrect'
            );
            if (incorrectIssue && incorrectIssue.originalValue !== undefined) {
              data[kpiKey][kpiId] = incorrectIssue.originalValue;
            } else {
              // Generate problematic values
              switch (kpiId) {
                case 'obs_speed':
                  data[kpiKey][kpiId] = -2.5;
                  break;
                case 'me_consumption':
                  data[kpiKey][kpiId] = 45.8;
                  break;
                case 'rpm':
                  data[kpiKey][kpiId] = 250;
                  break;
                default:
                  data[kpiKey][kpiId] = 12.5 + Math.random() * 8;
              }
            }
          } else {
            // Generate normal values
            switch (kpiId) {
              case 'obs_speed':
                data[kpiKey][kpiId] = 12.5 + Math.random() * 8;
                break;
              case 'me_consumption':
                data[kpiKey][kpiId] = 8.2 + Math.random() * 4;
                break;
              case 'total_consumption':
                data[kpiKey][kpiId] = 10.5 + Math.random() * 5;
                break;
              case 'wind_force':
                data[kpiKey][kpiId] = Math.floor(Math.random() * 8) + 1;
                break;
              case 'laden_condition':
                data[kpiKey][kpiId] = Math.random() > 0.5 ? 1 : 0;
                break;
              case 'me_power':
                data[kpiKey][kpiId] = 4200 + Math.random() * 2000;
                break;
              case 'me_sfoc':
                data[kpiKey][kpiId] = 185 + Math.random() * 15;
                break;
              case 'rpm':
                data[kpiKey][kpiId] = 85 + Math.random() * 25;
                break;
              default:
                data[kpiKey][kpiId] = Math.random() * 100;
            }
          }
        });
      });

      return data;
    });
  }, []);

  // Enhanced value display with quality indicators that match the issues in quality cards
  const getValueDisplay = (item, kpiId, source) => {
    const dataKey = source.toLowerCase();
    const value = item[dataKey][kpiId];

    // NEW: If quality is not visible, show clean values without indicators
    if (!qualityVisible) {
      if (value === null || value === undefined) {
        return (
          <span className="text-xs text-slate-500 font-medium">
            --
          </span>
        );
      }

      const formatValue = (val) => {
        if (kpiId === 'laden_condition') return val === 1 ? 'Laden' : 'Ballast';
        if (kpiId === 'wind_force') return val.toString();
        if (kpiId === 'obs_speed') return val.toFixed(1);
        if (kpiId === 'me_consumption' || kpiId === 'total_consumption')
          return val.toFixed(1);
        if (kpiId === 'me_power') return Math.round(val).toLocaleString();
        if (kpiId === 'me_sfoc') return val.toFixed(1);
        if (kpiId === 'rpm') return Math.round(val).toString();
        return val.toString();
      };

      return (
        <span className="text-xs font-semibold text-white">
          {formatValue(value)}
        </span>
      );
    }

    // Original quality-aware display logic
    const hasIssue = Object.values(item.quality.kpiIssues).some(
      (issue) => issue.kpi === kpiId
    );
    const kpiIssueEntries = Object.values(item.quality.kpiIssues).filter(
      (issue) => issue.kpi === kpiId
    );
    const hasMissingIssue = kpiIssueEntries.some(
      (issue) => issue.type === 'missing'
    );
    const hasIncorrectIssue = kpiIssueEntries.some(
      (issue) => issue.type === 'incorrect'
    );

    if (value === null || value === undefined) {
      return (
        <div className="relative group">
          <span className="text-xs text-slate-500 font-medium bg-red-500/10 border border-red-500/20 rounded px-1.5 py-0.5">
            --
          </span>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-700 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap shadow-lg">
            Missing sensor data
          </div>
        </div>
      );
    }

    const formatValue = (val) => {
      if (kpiId === 'laden_condition') return val === 1 ? 'Laden' : 'Ballast';
      if (kpiId === 'wind_force') return val.toString();
      if (kpiId === 'obs_speed') return val.toFixed(1);
      if (kpiId === 'me_consumption' || kpiId === 'total_consumption')
        return val.toFixed(1);
      if (kpiId === 'me_power') return Math.round(val).toLocaleString();
      if (kpiId === 'me_sfoc') return val.toFixed(1);
      if (kpiId === 'rpm') return Math.round(val).toString();
      return val.toString();
    };

    const getQualityStyle = () => {
      if (!hasIncorrectIssue) return '';

      const incorrectIssue = kpiIssueEntries.find(
        (issue) => issue.type === 'incorrect'
      );
      if (incorrectIssue) {
        if (incorrectIssue.severity === 'high')
          return 'bg-red-500/15 border border-red-500/25 text-red-200';
        if (incorrectIssue.severity === 'medium')
          return 'bg-yellow-500/15 border border-yellow-500/25 text-yellow-200';
        return 'bg-orange-500/15 border border-orange-500/25 text-orange-200';
      }
      return '';
    };

    const getTooltipMessage = () => {
      if (!hasIncorrectIssue) return null;

      const incorrectIssue = kpiIssueEntries.find(
        (issue) => issue.type === 'incorrect'
      );
      if (incorrectIssue) {
        return incorrectIssue.message || 'Data quality issue detected';
      }
      return null;
    };

    return (
      <div className="relative group">
        <span
          className={`text-xs font-semibold rounded px-1 py-0.5 transition-all ${
            hasIncorrectIssue ? getQualityStyle() : ''
          }`}
        >
          {formatValue(value)}
          {hasIncorrectIssue && (
            <AlertTriangle className="inline w-2.5 h-2.5 ml-1 text-orange-400" />
          )}
        </span>
        {hasIncorrectIssue && getTooltipMessage() && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-700 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap shadow-lg">
            {getTooltipMessage()}
          </div>
        )}
      </div>
    );
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return (
        <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      );
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-emerald-400" />
    ) : (
      <ArrowDown className="w-3 h-3 text-emerald-400" />
    );
  };

  const handleExport = (format) => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  // Handle vessel click to navigate to chart view
  const handleVesselClick = (vessel) => {
    // Create a vessel ID that matches the format expected by chart view
    const vesselId = `vessel_${vessel.id}`;
    onVesselClick(vesselId);
  };

  const paginatedData = sampleData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(sampleData.length / pageSize);

  const getDataSourceBadge = (source) => {
    const colors = {
      LF: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      HF: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    };
    return (
      <span
        className={`text-[8px] font-medium px-1 py-0.5 rounded-full border ${colors[source]} flex items-center gap-0.5`}
      >
        {source === 'LF' && <Radio className="w-2 h-2" />}
        {source === 'HF' && <Zap className="w-2 h-2" />}
        {source}
      </span>
    );
  };

  return (
    <div
      className={`bg-slate-900 text-white min-h-screen flex flex-col ${className}`}
    >
      <ControlsBar
        onExport={handleExport}
        isExporting={isExporting}
        selectedDataType={selectedDataType}
        setSelectedDataType={setSelectedDataType}
        selectedKPIs={selectedKPIs}
        setSelectedKPIs={setSelectedKPIs}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* NEW: Conditional rendering based on quality toggle */}
          {qualityVisible ? (
            // Show Data Quality Cards when quality is visible
            <DataQualityCards
              data={sampleData}
              qualityVisible={qualityVisible}
              onToggleQuality={onQualityToggle}
              selectedVessels={sampleData.map((item) => `vessel_${item.id}`)}
              selectedKPIs={selectedKPIs}
              chartData={sampleData}
              annotationsVisible={false}
              qualityOverlayVisible={false}
              viewMode="table"
              compactMode={true}
            />
          ) : (
            // Show Vessel Performance Charts when quality is hidden
            <VesselPerformanceCharts
              data={sampleData}
              selectedKPIs={selectedKPIs}
              selectedDataType={selectedDataType}
            />
          )}

          {/* Table Container */}
          <div className="bg-slate-800/50 border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/70 border-b border-white/10">
                  <tr>
                    <th className="w-8 px-2 py-1 text-left">
                      <input
                        type="checkbox"
                        className="rounded bg-slate-700 border-slate-600"
                      />
                    </th>
                    <th className="w-40 px-2 py-1 text-left">
                      <button
                        onClick={() => handleSort('vesselName')}
                        className="flex items-center gap-2 text-left text-slate-300 hover:text-white transition-colors group"
                      >
                        <span>Vessel</span>
                        {getSortIcon('vesselName')}
                      </button>
                    </th>
                    <th className="w-28 px-2 py-1 text-left">
                      <button
                        onClick={() => handleSort('date')}
                        className="flex items-center gap-2 text-left text-slate-300 hover:text-white transition-colors group"
                      >
                        <span>Date & Time</span>
                        {getSortIcon('date')}
                      </button>
                    </th>
                    {/* NEW: Conditionally show quality column */}
                    {qualityVisible && (
                      <th className="w-20 px-2 py-1 text-center">
                        <button
                          onClick={() => handleSort('quality')}
                          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group mx-auto"
                        >
                          <span>Quality</span>
                          {getSortIcon('quality')}
                        </button>
                      </th>
                    )}
                    {currentKPIsToDisplay.map((kpi) => (
                      <th
                        key={`${kpi.id}-${kpi.displaySource || kpi.source}`}
                        className="w-24 px-2 py-1 text-center"
                      >
                        <button
                          onClick={() => handleSort(kpi.id)}
                          className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors group w-full"
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">
                              {kpi.name}
                            </span>
                            {getSortIcon(kpi.id)}
                          </div>
                          <div className="flex items-center gap-1">
                            {kpi.unit && (
                              <span className="text-xs font-normal text-slate-500">
                                ({kpi.unit})
                              </span>
                            )}
                            {selectedDataType !== DATA_TYPES.COMBINED && 
                             kpi.source && 
                             getDataSourceBadge(kpi.source)}
                          </div>
                        </button>
                      </th>
                    ))}
                    <th className="w-8 px-2 py-1 text-center">
                      <MoreHorizontal className="w-3 h-3 text-slate-400 mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-2 py-1">
                        <input
                          type="checkbox"
                          className="rounded bg-slate-700 border-slate-600"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <div className="flex-1 min-w-0">
                          <div
                            className="font-semibold text-white text-sm truncate cursor-pointer hover:text-cyan-400 transition-colors hover:underline"
                            onClick={() => handleVesselClick(item)}
                            title="Click to view charts for this vessel"
                          >
                            {item.vesselName}
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.vesselStatus === 'At Sea'
                                  ? 'bg-emerald-400'
                                  : item.vesselStatus === 'At Port'
                                  ? 'bg-blue-400'
                                  : 'bg-orange-400'
                              }`}
                            ></span>
                            {item.vesselStatus}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-1">
                        <div className="text-center">
                          <div className="text-sm text-white font-medium">
                            {new Date(item.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="text-xs text-slate-400">
                            {new Date(item.date).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                            })}
                          </div>
                        </div>
                      </td>
                      {/* NEW: Conditionally show quality column */}
                      {qualityVisible && (
                        <td className="px-2 py-1 text-center">
                          <EnhancedQualityIndicator
                            completeness={item.quality.completeness}
                            correctness={item.quality.correctness}
                            issues={item.quality.issues}
                            size="sm"
                          />
                        </td>
                      )}
                      {currentKPIsToDisplay.map((kpi) => (
                        <td
                          key={`${kpi.id}-${kpi.displaySource || kpi.source}`}
                          className="px-2 py-1 text-center"
                        >
                          {selectedDataType === DATA_TYPES.COMBINED ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-center gap-1">
                                {getValueDisplay(item, kpi.id, 'LF')}
                                {getDataSourceBadge('LF')}
                              </div>
                              <div className="flex items-center justify-center gap-1">
                                {getValueDisplay(item, kpi.id, 'HF')}
                                {getDataSourceBadge('HF')}
                              </div>
                            </div>
                          ) : (
                            getValueDisplay(item, kpi.id, selectedDataType)
                          )}
                        </td>
                      ))}
                      <td className="px-2 py-1 text-center">
                        <MoreHorizontal className="w-3 h-3 text-slate-400 mx-auto cursor-pointer hover:text-white transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-slate-400">
              Showing <span className="text-white font-semibold">1</span>-
              <span className="text-white font-semibold">
                {Math.min(pageSize, sampleData.length)}
              </span>{' '}
              of{' '}
              <span className="text-white font-semibold">
                {sampleData.length}
              </span>{' '}
              vessels
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }).map(
                    (_, i) => {
                      const pageNum =
                        Math.max(1, Math.min(totalPages - 2, currentPage - 1)) +
                        i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            currentPage === pageNum
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableView;
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
  REPORTED: 'reported', // Renamed from LF
};

const ALL_KPIS = {
  REPORTED: [ // Renamed from LF
    {
      id: 'obs_speed',
      name: 'Obs Speed',
      unit: 'knts',
      category: 'performance',
      source: 'Reported',
    },
    {
      id: 'me_consumption',
      name: 'ME Consumption',
      unit: 'Mt',
      category: 'fuel',
      source: 'Reported',
    },
    {
      id: 'total_consumption',
      name: 'Total Consumption',
      unit: 'Mt',
      category: 'fuel',
      source: 'Reported',
    },
    {
      id: 'wind_force',
      name: 'Wind Force',
      unit: 'Beaufort',
      category: 'weather',
      source: 'Reported',
    },
    {
      id: 'laden_condition',
      name: 'Loading Condition',
      unit: '',
      category: 'operation',
      source: 'Reported',
    },
    {
      id: 'me_power',
      name: 'ME Power',
      unit: 'kW',
      category: 'performance',
      source: 'Reported',
    },
    {
      id: 'me_sfoc',
      name: 'ME SFOC',
      unit: 'gm/kWhr',
      category: 'performance',
      source: 'Reported',
    },
    {
      id: 'rpm',
      name: 'RPM',
      unit: 'rpm',
      category: 'performance',
      source: 'Reported',
    },
  ],
};

// Updated Quality Indicator Component for Light Theme
const EnhancedQualityIndicator = ({ completeness, correctness, issues = [], size = 'sm', showDetails = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState('top');
  const overallScore = Math.round((completeness + correctness) / 2);

  const getQualityColor = (score) => {
    if (score >= 85) return { bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-500/20' };
    if (score >= 70) return { bg: 'bg-yellow-500', text: 'text-amber-600', ring: 'ring-yellow-500/20' };
    return { bg: 'bg-red-500', text: 'text-red-600', ring: 'ring-red-500/20' };
  };

  const colors = getQualityColor(overallScore);
  const radius = size === 'sm' ? 12 : 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;
    
    // If there's not enough space above, show tooltip below
    if (spaceAbove < 200 && spaceBelow > 200) {
      setTooltipPosition('bottom');
    } else {
      setTooltipPosition('top');
    }
    
    setShowTooltip(true);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className={`relative ${size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'} cursor-help`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r={radius}
            stroke="rgb(229 231 235)"
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
          <span className={`font-bold ${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-900`}>
            {overallScore}
          </span>
        </div>

        {issues.length > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">{issues.length}</span>
          </div>
        )}
      </div>

      {/* Enhanced Tooltip for Light Theme */}
      {showTooltip && (
        <div className={`absolute left-1/2 transform -translate-x-1/2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 ${
          tooltipPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
        }`}>
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-900">Data Quality Index</span>
              <span className={`text-sm font-bold ${colors.text}`}>{overallScore}%</span>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Data Coverage</span>
                <span className="text-gray-900 font-medium">{completeness}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
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
                <span className="text-gray-600">Data Accuracy</span>
                <span className="text-gray-900 font-medium">{correctness}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
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
              <div className="border-t border-gray-200 pt-2">
                <span className="text-xs font-medium text-gray-700 block mb-1">Active Issues:</span>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {issues.slice(0, 3).map((issue, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs">
                      {issue.type === 'completeness' ? (
                        <Minus className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-gray-700">{issue.message}</span>
                    </div>
                  ))}
                  {issues.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{issues.length - 3} more issues
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Tooltip arrow */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 ${
            tooltipPosition === 'top' ? 'top-full' : 'bottom-full'
          }`}>
            <div className={`w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent ${
              tooltipPosition === 'top' 
                ? 'border-t-4 border-t-white' 
                : 'border-b-4 border-b-white'
            }`}></div>
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

  // Card component matching quality cards style for Light Theme
  const Card = ({ children, gradient = 'default', className = '' }) => {
    return (
      <div
        className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 ease-out shadow-sm hover:shadow-lg ${className}`}
      >
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
            <div className="p-1.5 rounded-md bg-cyan-100 border border-cyan-200">
              <BarChart2 className="w-4 h-4 text-cyan-600" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-700 block">Speed & Consumption</span>
              <span className="text-[9px] text-gray-500">Parallel comparison</span>
            </div>
          </div>

          <div className="relative h-32 bg-gray-100 rounded-lg p-2">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-6 flex flex-col justify-between text-[8px] text-cyan-600 py-2">
              <span>{maxSpeed.toFixed(0)}</span>
              <span>{(maxSpeed / 2).toFixed(0)}</span>
              <span>0</span>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-6 flex flex-col justify-between text-[8px] text-orange-600 py-2 text-right">
              <span>{maxConsumption.toFixed(0)}</span>
              <span>{(maxConsumption / 2).toFixed(0)}</span>
              <span>0</span>
            </div>

            <div className="absolute inset-0 mx-6 border-l border-b border-gray-300/50">
              {/* Grid lines */}
              <div className="absolute inset-0">
                {[25, 50, 75].map(percent => (
                  <div key={percent}
                    className="absolute w-full border-t border-gray-300/50"
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
                <div key={vessel.vesselId} className="text-[7px] text-gray-500 text-left w-6 truncate">
                  {vessel.shortName}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span className="text-gray-600">Speed (kn)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-gray-600">Fuel (Mt)</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Fuel Efficiency Bar Chart with Vessel Names */}
      <Card gradient="efficiency" className="hover:transform hover:translateY(-2px) hover:scale-[1.01]">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1.5 rounded-md bg-emerald-100 border border-emerald-200">
              <Target className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-700 block">Fuel Efficiency</span>
              <span className="text-[9px] text-gray-500">kg/nm by vessel</span>
            </div>
          </div>

          <div className="relative h-32 bg-gray-100 rounded-lg p-2">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[8px] text-emerald-600 py-2">
              <span>{maxEfficiency.toFixed(0)}</span>
              <span>{(maxEfficiency * 0.66).toFixed(0)}</span>
              <span>{(maxEfficiency * 0.33).toFixed(0)}</span>
              <span>0</span>
            </div>

            <div className="absolute inset-0 ml-8 border-l border-b border-gray-300/50">
              {/* Grid lines */}
              <div className="absolute inset-0">
                {[25, 50, 75].map(percent => (
                  <div key={percent}
                    className="absolute w-full border-t border-gray-300/50"
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
                <div key={vessel.vesselId} className="text-[7px] text-gray-500 text-left w-4 truncate transform -rotate-45 origin-top">
                  {vessel.shortName}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                <span className="text-gray-600">Laden</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full"></div>
                <span className="text-gray-600">Ballast</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* NEW: Data Quality - Scatter Plot */}
      <Card gradient="quality" className="hover:transform hover:translateY(-2px) hover:scale-[1.01]">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-1.5 rounded-md bg-purple-100 border border-purple-200">
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-700 block">Data Quality</span>
              <span className="text-[9px] text-gray-500">Completeness vs. Correctness</span>
            </div>
          </div>

          <div className="relative h-32 bg-gray-100 rounded-lg p-2">
            {/* Chart Area */}
            <div className="absolute inset-0 p-2">
              {/* Quadrant Lines */}
              <div className="absolute inset-0 flex items-center justify-start">
                <div className="absolute w-full h-px bg-gray-300/50" style={{ top: '50%' }}></div> {/* Horizontal line (Completeness 50%) */}
                <div className="absolute h-full w-px bg-gray-300/50" style={{ left: '50%' }}></div> {/* Vertical line (Correctness 50%) */}
              </div>

              {/* X-axis labels (Correctness) */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-gray-500 px-2 pb-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              {/* Y-axis labels (Completeness) */}
              <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-between text-[8px] text-gray-500 py-2 pl-1">
                <span>100%</span>
                <span>50%</span>
                <span>0%</span>
              </div>

              {/* Scatter Points */}
              {vesselMetrics.map((vessel) => {
                const xPos = (vessel.correctness / 100) * 90 + 5; // Scale to 0-100, add padding
                const yPos = 100 - ((vessel.completeness / 100) * 90 + 5); // Scale and invert for Y-axis, add padding

                let pointColor = 'bg-gray-400'; // Default
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
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap shadow-lg">
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

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-600">High Quality</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-600">Medium Quality</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Low Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Controls Bar Component for Light Theme
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
    setSelectedKPIs(ALL_KPIS[type.toUpperCase()].map((kpi) => kpi.id));
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
      REPORTED: 'bg-blue-100 text-blue-700 border-blue-200',
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
    return ALL_KPIS[selectedDataType.toUpperCase()] || [];
  }, [selectedDataType]);

  return (
    <div className="bg-white border-b border-gray-200 p-1">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Fleet Analytics
            </h3>
          </div>
          
          {/* Vessel Selection */}
          <div className="relative" ref={vesselDropdownRef}>
            <button
              onClick={() => setShowVesselDropdown(!showVesselDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors text-sm"
              title="Select Vessels"
            >
              <Ship className="w-4 h-4" />
              <span>Vessels</span>
              {selectedVessels?.length > 0 && (
                <span className="bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {selectedVessels.length}
                </span>
              )}
            </button>

            {showVesselDropdown && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                <div className="flex items-center justify-between p-3 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Ship className="w-4 h-4" />
                    Select Vessels
                  </h4>
                  <button onClick={() => setShowVesselDropdown(false)}>
                    <X className="w-4 h-4 text-gray-500 hover:text-gray-900" />
                  </button>
                </div>

                <div className="p-3 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {sampleVessels.map((vessel) => (
                      <label
                        key={vessel.id}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedVessels?.includes(vessel.id)}
                          onChange={() => handleVesselSelection(vessel.id)}
                          className="w-4 h-4 text-emerald-600 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {vessel.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-3 border-t border-gray-200 flex justify-end gap-2">
                  <button
                    onClick={handleResetVessels}
                    className="px-2 py-1.5 text-xs font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleApplyVessels}
                    className="px-2 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Configuration Dropdown */}
          <div className="relative" ref={kpiDropdownRef}>
            <button
              onClick={() => setShowKPIDropdown(!showKPIDropdown)}
              className="w-8 h-8 flex items-center justify-start bg-gray-100 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
              title="Configure KPIs"
            >
              <Settings className="w-4 h-4" />
            </button>

            {showKPIDropdown && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Configure KPIs
                  </h4>
                  <button onClick={() => setShowKPIDropdown(false)}>
                    <X className="w-4 h-4 text-gray-500 hover:text-gray-900" />
                  </button>
                </div>

                <div className="p-2 border-b border-gray-200">
                  <label className="text-xs font-medium text-gray-600 mb-2 block">
                    Data Source
                  </label>
                  <div className="flex gap-2">
                    {['REPORTED'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleDataTypeChange(type.toLowerCase())}
                        className={`flex-1 px-2 py-2 text-xs font-medium rounded-md transition-colors ${
                          selectedDataType === type.toLowerCase()
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-start gap-1">
                          {type === 'REPORTED' && <Radio className="w-3 h-3" />}
                          {type}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 max-h-64 overflow-y-auto">
                  <label className="text-xs font-medium text-gray-600 mb-3 block">
                    Select KPIs ({selectedKPIs?.length || 0} selected)
                  </label>
                  <div className="space-y-2">
                    {availableKPIs.map((kpi) => (
                      <label
                        key={`${kpi.id}-${kpi.source}`}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedKPIs?.includes(kpi.id)}
                          onChange={() => handleKPISelection(kpi.id)}
                          className="w-4 h-4 text-emerald-600 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {kpi.name}
                            </span>
                          </div>
                          {kpi.unit && (
                            <span className="text-xs text-gray-500">
                              ({kpi.unit})
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                  <button
                    onClick={handleApply}
                    className="px-2 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setShowKPIDropdown(false)}
                    className="px-2 py-1.5 text-xs font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-8 h-8 flex items-center justify-start bg-gray-100 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
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
            className="w-8 h-8 flex items-center justify-start bg-gray-100 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors disabled:opacity-50"
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

// Chart Icon component for direct vessel chart navigation
const ChartIcon = ({ vessel, onVesselClick }) => {
  const handleChartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Chart clicked for vessel:', vessel);
    onVesselClick(vessel);
  };

  return (
      <button
      onClick={handleChartClick}
              className="w-full flex items-center justify-center p-1 rounded hover:bg-blue-50 transition-colors group"
      title="View Charts"
    >
      <BarChart3 className="w-3 h-3 text-gray-500 group-hover:text-blue-600 transition-colors" />
      </button>
  );
};

// Enhanced Table View Component for Light Theme
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
  const [selectedDataType, setSelectedDataType] = useState(DATA_TYPES.REPORTED); // Initial state is now 'reported'
  const [selectedKPIs, setSelectedKPIs] = useState(
    ALL_KPIS.REPORTED.map((kpi) => kpi.id) // Initial KPIs are for 'reported'
  );

  // State for vessel selection
  const [selectedVessels, setSelectedVessels] = useState([
    'vessel_1', 'vessel_2', 'vessel_3', 'vessel_4', 'vessel_5'
  ]);
  const [showVesselDropdown, setShowVesselDropdown] = useState(false);
  const vesselDropdownRef = useRef(null);

  // Sample vessels data
  const sampleVessels = [
    { id: 'vessel_1', name: 'MV Atlantic Pioneer' },
    { id: 'vessel_2', name: 'MV Pacific Navigator' },
    { id: 'vessel_3', name: 'MV Ocean Explorer' },
    { id: 'vessel_4', name: 'MV Global Trader' },
    { id: 'vessel_5', name: 'MV Northern Star' },
  ];

  // Vessel selection handlers
  const handleVesselSelection = (vesselId) => {
    setSelectedVessels(prev => {
      if (prev.includes(vesselId)) {
        return prev.filter(id => id !== vesselId);
      } else {
        return [...prev, vesselId];
      }
    });
  };

  const handleResetVessels = () => {
    setSelectedVessels(sampleVessels.map(v => v.id));
  };

  const handleApplyVessels = () => {
    setShowVesselDropdown(false);
    // Apply vessel selection logic here
  };

  // Helper to get KPI details by ID
  const getKpiDetails = (kpiId, source) => {
    return ALL_KPIS[source.toUpperCase()]?.find((kpi) => kpi.id === kpiId);
  };

  const currentKPIsToDisplay = useMemo(() => {
    return (
      ALL_KPIS[selectedDataType.toUpperCase()]?.filter((kpi) =>
        selectedKPIs.includes(kpi.id)
      ) || []
    );
  }, [selectedDataType, selectedKPIs]);
  
  // MODIFIED: Generate sample data for only the first 5 vessels
  const sampleData = useMemo(() => {
    const limitedQualityData = staticQualityData.slice(0, 5);

    return limitedQualityData.map((vessel, index) => {
      const data = {
        id: `vessel_${vessel.id}`, // FIX: Format as vessel_1, vessel_2, etc.
        vesselName: vessel.name,
        date: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        vesselStatus: vessel.status,
        quality: vessel,
        reported: {}, // Renamed from 'lf'
        // 'hf' and 'combined' are removed
      };

      // Generate data for each KPI for the single data source
      ALL_KPIS.REPORTED.forEach((kpi) => {
        const kpiId = kpi.id;
        const kpiKey = 'reported';

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

      return data;
    });
  }, []);

  // Enhanced value display with quality indicators that match the issues in quality cards
  const getValueDisplay = (item, kpiId, source) => {
    const dataKey = 'reported'; // Always use 'reported' now
    const value = item[dataKey][kpiId];

    // NEW: If quality is not visible, show clean values without indicators
    if (!qualityVisible) {
      if (value === null || value === undefined) {
        return (
          <div className="flex justify-center">
            <span className="text-xs text-gray-500 font-medium">
              --
            </span>
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

      return (
        <div className="flex justify-center">
          <span className="text-xs font-semibold text-gray-900">
            {formatValue(value)}
          </span>
        </div>
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

    if (value === null || value === undefined || hasMissingIssue) {
      return (
        <div className="relative group flex justify-center">
          <span className="text-xs text-gray-500 font-medium bg-red-100 border border-red-200 rounded px-1.5 py-0.5">
            --
          </span>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap shadow-lg">
            Missing noon report data
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
          return 'bg-red-100 border border-red-200 text-red-700';
        if (incorrectIssue.severity === 'medium')
          return 'bg-amber-100 border border-amber-200 text-amber-700';
        return 'bg-orange-100 border border-orange-200 text-orange-700';
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
      <div className="relative group flex justify-center">
        <span
          className={`text-xs font-semibold rounded px-1 py-0.5 transition-all ${
            hasIncorrectIssue ? getQualityStyle() : ''
          }`}
        >
          {formatValue(value)}
          {hasIncorrectIssue && (
            <AlertTriangle className="inline w-2.5 h-2.5 ml-1 text-orange-500" />
          )}
        </span>
        {hasIncorrectIssue && getTooltipMessage() && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap shadow-lg">
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
        <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      );
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-emerald-600" />
    ) : (
      <ArrowDown className="w-3 h-3 text-emerald-600" />
    );
  };

  const handleExport = (format) => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  // MODIFIED: Update the handleVesselClick function to pass the full vessel object
  const handleVesselClick = (vessel) => {
    onVesselClick(vessel);
  };

  // MODIFIED: Use limited sampleData for pagination
  const paginatedData = sampleData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(sampleData.length / pageSize);

  const getDataSourceBadge = (source) => {
    const colors = {
      REPORTED: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return (
      <span
        className={`text-[8px] font-medium px-1 py-0.5 rounded-full border ${colors[source]} flex items-center gap-0.5`}
      >
        {source === 'REPORTED' && <Radio className="w-2 h-2" />}
        {source}
      </span>
    );
  };

  return (
    <div
      className={`bg-gray-50 text-gray-900 min-h-screen flex flex-col ${className}`}
    >

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
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="w-40 px-2 py-1 text-left">
                      <button
                        onClick={() => handleSort('vesselName')}
                        className="flex items-center gap-2 text-left text-gray-600 hover:text-gray-900 transition-colors group "
                      >
                        <span>Vessel</span>
                        {getSortIcon('vesselName')}
                      </button>
                    </th>
                    <th className="w-28 px-2 py-1 text-left">
                      <button
                        onClick={() => handleSort('date')}
                        className="flex items-center gap-2 text-left text-gray-600 hover:text-gray-900 transition-colors group "
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
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group "
                        >
                          <span>Data Quality Index</span>
                          {getSortIcon('quality')}
                        </button>
                      </th>
                    )}
                    {currentKPIsToDisplay.map((kpi) => (
                      <th
                        key={`${kpi.id}-${kpi.source}`}
                        className="w-24 px-2 py-1 text-center"
                      >
                        <button
                          onClick={() => handleSort(kpi.id)}
                          className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors group w-full"
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">
                              {kpi.name}
                            </span>
                            {getSortIcon(kpi.id)}
                          </div>
                          <div className="flex items-center gap-1">
                            {kpi.unit && (
                              <span className="text-xs font-normal text-gray-500">
                                ({kpi.unit})
                              </span>
                            )}
                          </div>
                        </button>
                      </th>
                    ))}
                    <th className="w-8 px-2 py-1 text-center">
                      <BarChart3 className="w-3 h-3 text-gray-500 " />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 py-1 text-left">
                        <div className="flex-1 min-w-0">
                          <div
                            className="font-semibold text-gray-900 text-sm truncate cursor-pointer hover:text-blue-600 transition-colors hover:underline"
                            onClick={() => handleVesselClick(item)}
                            title="Click to view charts for this vessel"
                          >
                            {item.vesselName}
                          </div>
                          <div className="mt-1 flex items-center justify-start gap-1 text-xs text-gray-500">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.vesselStatus === 'At Sea'
                                  ? 'bg-emerald-500'
                                  : item.vesselStatus === 'At Port'
                                  ? 'bg-blue-500'
                                  : 'bg-orange-500'
                              }`}
                            ></span>
                            {item.vesselStatus}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-1 text-left">
                        <div className="text-left">
                          <div className="text-sm text-gray-900 font-medium">
                            {new Date(item.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
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
                            issues={Object.values(item.quality.kpiIssues)}
                            size="sm"
                          />
                        </td>
                      )}
                      {currentKPIsToDisplay.map((kpi) => (
                        <td
                          key={`${kpi.id}-${kpi.source}`}
                          className="px-2 py-1 text-center"
                        >
                          {getValueDisplay(item, kpi.id, selectedDataType)}
                        </td>
                      ))}
                      <td className="px-2 py-1 text-center">
                        <ChartIcon
                          vessel={item}
                          onVesselClick={handleVesselClick}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-500">
              Showing <span className="text-gray-900 font-semibold">1</span>-
              <span className="text-gray-900 font-semibold">
                {Math.min(pageSize, sampleData.length)}
              </span>{' '}
              of{' '}
              <span className="text-gray-900 font-semibold">
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
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
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
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
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
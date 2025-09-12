import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import {
  Download,
  RefreshCw,
  BarChart3,
  X,
  Settings,
  Radio,
  Zap,
  Layers,
  Shield,
  TrendingUp,
  AlertTriangle,
  Activity,
  Fuel,
  Navigation,
  Waves,
  Maximize2,
  Minimize2,
  MessageCircle,
  Anchor,
  CloudRain,
  Wrench,
  Flag,
  Edit3,
  Calendar,
  WifiOff,
  XCircle,
  AlertCircle,
  Clock,
  Info,
} from 'lucide-react';

// Import the shared DataQualityCards component
import DataQualityCards, { staticQualityData } from '../table/DataQualityCards';

// Constants and Data Types
const DATA_TYPES = {
  LF: 'lf',
};

// HF Data Intervals - These are no longer used in the UI, but kept for function logic compatibility
const HF_INTERVALS = {
  RAW: 'raw',
  HOURLY: '1hr',
  SIX_HOURLY: '6hr',
  TWELVE_HOURLY: '12hr',
  DAILY: 'daily',
};

const HF_INTERVAL_CONFIGS = {
  [HF_INTERVALS.RAW]: {
    label: 'Raw Data (3hr intervals)',
    maxDays: 3,
    dataPointInterval: 3, // hours
    description: 'Every 3 hours for max 3 days'
  },
  [HF_INTERVALS.HOURLY]: {
    label: '1 Hour Data',
    maxDays: 5,
    dataPointInterval: 1, // hours
    description: 'Every 1 hour for max 5 days'
  },
  [HF_INTERVALS.SIX_HOURLY]: {
    label: '6 Hour Data',
    maxDays: 15,
    dataPointInterval: 6, // hours
    description: 'Every 6 hours for max 15 days'
  },
  [HF_INTERVALS.TWELVE_HOURLY]: {
    label: '12 Hour Data',
    maxDays: null, // no limit
    dataPointInterval: 12, // hours
    description: 'Every 12 hours (no date limit)'
  },
  [HF_INTERVALS.DAILY]: {
    label: 'Daily Data',
    maxDays: null, // no limit
    dataPointInterval: 24, // hours
    description: 'Daily aggregation (no date limit)'
  },
};

const sampleVessels = [
  { id: 'vessel_1', name: 'MV Atlantic Pioneer' },
  { id: 'vessel_2', name: 'MV Pacific Navigator' },
  { id: 'vessel_3', name: 'MV Ocean Explorer' },
  { id: 'vessel_4', name: 'MV Global Trader' },
  { id: 'vessel_5', name: 'MV Northern Star' },
  { id: 'vessel_6', name: 'MV Southern Cross' },
  { id: 'vessel_7', name: 'MV Eastern Horizon' },
  { id: 'vessel_8', name: 'MV Western Seeker' },
  { id: 'vessel_9', name: 'MV Coastal Guardian' },
  { id: 'vessel_10', name: 'MV Deepwater Voyager' },
];

// Default selected vessels (first 5)
const defaultSelectedVessels = sampleVessels.slice(0, 5);

// KPI Definitions with Chart Properties
const ALL_KPIS = {
  LF: [
    {
      id: 'obs_speed',
      name: 'Obs Speed',
      unit: 'knts',
      category: 'performance',
      source: 'LF',
      color: '#4CC9F0',
      yAxisRange: [0, 25],
    },
    {
      id: 'me_consumption',
      name: 'ME Consumption',
      unit: 'Mt',
      category: 'fuel',
      source: 'LF',
      color: '#F07167',
      yAxisRange: [0, 50],
    },
    {
      id: 'total_consumption',
      name: 'Total Consumption',
      unit: 'Mt',
      category: 'fuel',
      source: 'LF',
      color: '#FFC300',
      yAxisRange: [0, 60],
    },
    {
      id: 'wind_force',
      name: 'Wind Force',
      unit: 'Beaufort',
      category: 'weather',
      source: 'LF',
      color: '#8D8DDA',
      yAxisRange: [0, 12],
    },
    {
      id: 'me_power',
      name: 'ME Power',
      unit: 'kW',
      category: 'performance',
      source: 'LF',
      color: '#2ECC71',
      yAxisRange: [0, 20000],
    },
    {
      id: 'me_sfoc',
      name: 'ME SFOC',
      unit: 'gm/kWhr',
      category: 'performance',
      source: 'LF',
      color: '#E74C3C',
      yAxisRange: [160, 220],
    },
    {
      id: 'rpm',
      name: 'RPM',
      unit: 'rpm',
      category: 'performance',
      source: 'LF',
      color: '#9B59B6',
      yAxisRange: [0, 150],
    },
  ],
  HF: [], // Empty HF array as it's no longer a selectable source
};

// Vessel Colors for Chart Lines
const VESSEL_COLORS = [
  '#3b82f6', // Primary blue
  '#10b981', // Emerald 
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#22d3ee', // Cyan
  '#a78bfa', // Violet
];

// LF and HF colors for combined mode - No longer relevant but kept for code stability
const LF_HF_COLORS = {
  LF: '#3b82f6',
  HF: '#ef4444',
};

// Helper Functions
const getKPIById = (kpiId, dataType) => {
  const kpisForType = ALL_KPIS[dataType.toUpperCase()] || [];
  return kpisForType.find((kpi) => kpi.id === kpiId);
};

const getVesselColor = (vesselId) => {
  const index = sampleVessels.findIndex((v) => v.id === vesselId);
  return VESSEL_COLORS[index % VESSEL_COLORS.length];
};

// Mock Data Generation Functions
const generateMockChartData = (
  selectedVesselIds,
  selectedKPIs,
  dataType,
  startDate,
  endDate,
  hfInterval = HF_INTERVALS.DAILY
) => {
  const data = [];
  const currentDate = new Date(startDate);
  const intervalHours = 24; // Always use daily interval for LF data

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString();
    const entry = { date: dateString };

    selectedVesselIds.forEach((vesselId, vesselIndex) => {
      selectedKPIs.forEach((kpiId) => {
        const kpiMeta = getKPIById(kpiId, dataType);
        if (!kpiMeta) return;

        const vesselQuality = staticQualityData[vesselIndex % staticQualityData.length];
        let value = generateKPIValue(kpiId, currentDate, dataType.toUpperCase());
           
        const { finalValue, qualityInfo } = applyQualityIssues(value, kpiId, vesselQuality);
           
        const dataKey = `${vesselId}_${kpiId}`;
        entry[dataKey] = finalValue;
        entry[`${dataKey}_quality`] = qualityInfo.qualityType;
        entry[`${dataKey}_hasIssue`] = qualityInfo.hasQualityIssue;
        entry[`${dataKey}_issueDetails`] = qualityInfo.issueDetails;
        entry[`${dataKey}_vesselQuality`] = vesselQuality;
      });
    });

    data.push(entry);
     
    currentDate.setHours(currentDate.getHours() + intervalHours);
  }
   
  return data;
};

const generateKPIValue = (kpiId, currentDate, sourceType) => {
  const timeComponent = currentDate.getTime() / (1000 * 60 * 60);
   
  switch (kpiId) {
    case 'obs_speed':
      return 10 + Math.random() * 5 + Math.sin(timeComponent / 24) * 2;
    case 'me_consumption':
      return 20 + Math.random() * 10 + Math.sin(timeComponent / 12) * 3;
    case 'total_consumption':
      return 25 + Math.random() * 15 + Math.sin(timeComponent / 8) * 4;
    case 'wind_force':
      return Math.floor(Math.random() * 8) + Math.sin(timeComponent / 6) * 2;
    case 'me_power':
      return 5000 + Math.random() * 2000 + Math.sin(timeComponent / 4) * 500;
    case 'me_sfoc':
      return 160 + Math.random() * 10 + Math.sin(timeComponent / 24) * 3;
    case 'rpm':
      return 80 + Math.random() * 20 + Math.sin(timeComponent / 6) * 5;
    default:
      return Math.random() * 100;
  }
};

const applyQualityIssues = (value, kpiId, vesselQuality) => {
  const hasKPIIssue = vesselQuality.issues.some(issue => issue.kpi === kpiId);
  const kpiIssues = vesselQuality.issues.filter(issue => issue.kpi === kpiId);

  let finalValue = value;
  let hasQualityIssue = false;
  let qualityType = 'normal';
  let issueDetails = null;

  if (hasKPIIssue) {
    const missingIssue = kpiIssues.find(issue => issue.type === 'completeness');
    const incorrectIssue = kpiIssues.find(issue => issue.type === 'correctness');

    if (missingIssue && Math.random() < 0.3) {
      finalValue = null;
      hasQualityIssue = true;
      qualityType = 'missing';
      issueDetails = missingIssue;
    } else if (incorrectIssue && Math.random() < 0.2) {
      switch (kpiId) {
        case 'obs_speed':
          finalValue = -2.5;
          break;
        case 'me_consumption':
          finalValue = 55;
          break;
        case 'rpm':
          finalValue = 250;
          break;
        default:
          finalValue = value * 1.5;
      }
      hasQualityIssue = true;
      qualityType = 'incorrect';
      issueDetails = incorrectIssue;
    }
  }

  return {
    finalValue: finalValue === null ? null : Math.max(0, parseFloat(finalValue.toFixed(2))),
    qualityInfo: {
      hasQualityIssue,
      qualityType,
      issueDetails
    }
  };
};

const NotificationPopup = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-600 border-yellow-500 text-yellow-100';
      case 'error':
        return 'bg-red-600 border-red-500 text-red-100';
      case 'success':
        return 'bg-green-600 border-green-500 text-green-100';
      default:
        return 'bg-blue-600 border-blue-500 text-blue-100';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className={`p-4 rounded-lg border shadow-lg backdrop-blur-md ${getTypeStyles()}`}>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ControlsBar = ({
  filters = {
    dataType: DATA_TYPES.LF,
    selectedKPIs: [],
    selectedVessels: [],
    dateRange: { startDate: null, endDate: null },
  },
  onFilterChange = () => {},
  vessels = sampleVessels,
  onApplyFilters = () => {},
  isApplyingFilters = false,
  onExport = () => {},
  isExporting = false,
  onShowNotification = () => {},
}) => {
  const getInitialDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    return { startDate, endDate };
  };

  const [localFilters, setLocalFilters] = useState(() => ({
    ...filters,
    selectedVessels:
      filters.selectedVessels.length > 0
        ? filters.selectedVessels
        : defaultSelectedVessels.map((v) => v.id),
    dateRange:
      filters.dateRange.startDate && filters.dateRange.endDate
        ? filters.dateRange
        : getInitialDateRange(),
    dataType: filters.dataType || DATA_TYPES.LF,
    selectedKPIs:
      filters.selectedKPIs.length > 0
        ? filters.selectedKPIs
        : ALL_KPIS.LF.map((kpi) => kpi.id),
  }));

  const [showKPIDropdown, setShowKPIDropdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
    setLocalFilters((prev) => ({
      ...prev,
      dataType: type,
      selectedKPIs: ALL_KPIS[type.toUpperCase()].map((kpi) => kpi.id),
    }));
  };

  const handleKPISelection = (kpiId) => {
    setLocalFilters((prev) => {
      const currentSelected = prev.selectedKPIs || [];
      if (currentSelected.includes(kpiId)) {
        return {
          ...prev,
          selectedKPIs: currentSelected.filter((id) => id !== kpiId),
        };
      } else {
        return { ...prev, selectedKPIs: [...currentSelected, kpiId] };
      }
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    setShowKPIDropdown(false);
  };

  const availableKPIs = useMemo(() => {
    return ALL_KPIS[localFilters.dataType.toUpperCase()] || [];
  }, [localFilters.dataType]);

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 relative">
      <div className="flex items-center justify-between w-full p-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/30 border border-blue-500/30 shadow-lg shadow-blue-500/10">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Fleet Analytics
              </h3>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Configuration Dropdown */}
          <div className="relative" ref={kpiDropdownRef}>
            <button
              onClick={() => setShowKPIDropdown(!showKPIDropdown)}
              className="w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              title="Configure KPIs"
            >
              <Settings className="w-4 h-4" />
            </button>

            {showKPIDropdown && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-xl z-50 animate-fade-in">
                <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Configure KPIs
                  </h4>
                  <button onClick={() => setShowKPIDropdown(false)}>
                    <X className="w-4 h-4 text-gray-500 hover:text-gray-900" />
                  </button>
                </div>

                <div className="p-2 border-b border-gray-200/50">
                  <label className="text-xs font-medium text-gray-600 mb-2 block">
                    Data Source
                  </label>
                  <div className="flex gap-2">
                    {['REPORTED'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setLocalFilters(prev => ({ ...prev, dataType: type.toLowerCase() }))}
                        className={`flex-1 px-2 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                          localFilters.dataType === type.toLowerCase()
                            ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-300 shadow-sm'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {type === 'REPORTED' && <Radio className="w-3 h-3" />}
                          {type}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 max-h-64 overflow-y-auto custom-scrollbar">
                  <label className="text-xs font-medium text-gray-600 mb-3 block">
                    Select KPIs ({localFilters.selectedKPIs?.length || 0} selected)
                  </label>
                  <div className="space-y-2">
                    {availableKPIs.map((kpi) => (
                      <label
                        key={`${kpi.id}-${kpi.source}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                      >
                        <input
                          type="checkbox"
                          checked={localFilters.selectedKPIs?.includes(kpi.id)}
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

                <div className="p-4 border-t border-gray-200/50 flex justify-end gap-2">
                  <button
                    onClick={handleApply}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setShowKPIDropdown(false)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Export Button */}
          <button
            onClick={() => onExport('csv')}
            disabled={isExporting}
            className="w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50"
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

const QualityDot = ({
  cx,
  cy,
  payload,
  dataKey,
  stroke,
  strokeWidth,
  qualityVisible,
}) => {
  const qualityKey = `${dataKey}_quality`;
  const issueKey = `${dataKey}_hasIssue`;
  const issueDetailsKey = `${dataKey}_issueDetails`;
  const qualityType = payload[qualityKey];
  const hasIssue = payload[issueKey];
  const issueDetails = payload[issueDetailsKey];
  const value = payload[dataKey];

  if (!qualityVisible) {
    if (value === null || value === undefined) {
      return null;
    }
     
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r="4"
          fill={stroke}
          stroke="#fff"
          strokeWidth="2"
          style={{
            filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))',
          }}
        />
      </g>
    );
  }

  if (value === null || value === undefined) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r="4"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="2,1"
          opacity={0.95}
        />
        <g stroke="#ef4444" strokeWidth="2" opacity={0.95}>
          <line x1={cx - 2} y1={cy - 2} x2={cx + 2} y2={cy + 2} />
          <line x1={cx - 2} y1={cy + 2} x2={cx + 2} y2={cy - 2} />
        </g>
      </g>
    );
  }

  if (hasIssue && qualityType === 'incorrect') {
    const severity = issueDetails?.severity || 'medium';
    const severityColors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#eab308',
    };
    const color = severityColors[severity];

    return (
      <g>
        <polygon
          points={`${cx},${cy - 5} ${cx - 4.5},${cy + 3.5} ${cx + 4.5},${cy + 3.5}`}
          fill={color}
          stroke="#fff"
          strokeWidth="1"
        />
        <g fill="#ffffff" fontSize="8" textAnchor="middle" fontWeight="bold">
          <text x={cx} y={cy} style={{ fontSize: '10px' }}>!</text>
        </g>
      </g>
    );
  }

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r="4"
        fill={stroke}
        stroke="#fff"
        strokeWidth="2"
        style={{
          filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.4))',
        }}
      />
    </g>
  );
};

const CustomTooltip = ({
  active,
  payload,
  label,
  dataType,
  qualityVisible,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/98 border border-gray-700/25 rounded-lg p-3 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-gray-700/15">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <p className="text-xs font-semibold text-gray-100">
            {new Date(label).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {payload.map((entry, index) => {
            const parts = entry.dataKey.split('_');
            let vesselId, kpiId, sourceType;
             
            [vesselId, kpiId] = parts;
            sourceType = dataType.toUpperCase();
             
            const vessel = sampleVessels.find((v) => v.id === vesselId);
            const qualityType = entry.payload[`${entry.dataKey}_quality`];
            const hasIssue = entry.payload[`${entry.dataKey}_hasIssue`];
            const issueDetails = entry.payload[`${entry.dataKey}_issueDetails`];

            if (!vessel) return null;

            return (
              <div key={`item-${index}`} className="group">
                <div className="flex items-center justify-between p-1.5 rounded-md bg-gray-700/40 hover:bg-gray-700/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      {!qualityVisible ? (
                        <div
                          className="w-3.5 h-3.5 rounded-full border-2 border-gray-100/30"
                          style={{
                            backgroundColor: entry.color,
                            boxShadow: `0 0 8px ${entry.color}40`,
                          }}
                        />
                      ) : (
                        entry.value === null ? (
                          <div className="w-3.5 h-3.5 border-2 border-red-600 border-dashed rounded-full bg-transparent flex items-center justify-center">
                            <WifiOff className="w-2 h-2 text-red-600" />
                          </div>
                        ) : hasIssue && qualityType === 'incorrect' ? (
                          <div className="relative">
                            <div
                              className="w-3.5 h-3.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-sm flex items-center justify-center"
                              style={{
                                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                              }}
                            ></div>
                            <AlertTriangle className="w-2.5 h-2.5 text-white absolute inset-0 m-auto" />
                          </div>
                        ) : (
                          <div className="relative">
                            <div
                              className="w-3.5 h-3.5 rounded-full border-2 border-gray-100/30"
                              style={{
                                backgroundColor: entry.color,
                                boxShadow: `0 0 8px ${entry.color}40`,
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-xs font-medium truncate"
                          style={{ color: entry.color }}
                        >
                          {vessel.name}
                        </span>
                      </div>

                      {qualityVisible && hasIssue && issueDetails && (
                        <div className="text-[10px] text-orange-600 flex items-center gap-0.5 mt-0.5">
                          <AlertCircle className="w-2.5 h-2.5" />
                          {issueDetails.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-100 font-semibold">
                      {entry.value === null ? (
                        qualityVisible ? (
                          <span className="text-red-600 flex items-center gap-0.5">
                            <X className="w-2.5 h-2.5" />
                            Missing
                          </span>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )
                      ) : (
                        entry.value
                      )}
                    </span>
                    {qualityVisible && entry.value !== null &&
                      hasIssue &&
                      qualityType === 'incorrect' && (
                        <div className="text-[10px] text-yellow-600 flex items-center gap-0.5 justify-end mt-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Flagged
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

const ChartView = ({
  initialVesselId = null,
  className = '',
  qualityVisible = true,
}) => {
  const getInitialFilters = (vesselId) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
      
    const selectedVessels = vesselId
      ? [vesselId]
      : defaultSelectedVessels.map((v) => v.id);

    return {
      dataType: DATA_TYPES.LF,
      selectedKPIs: ALL_KPIS.LF.map((kpi) => kpi.id),
      selectedVessels: selectedVessels,
      dateRange: { startDate, endDate },
    };
  };

  const [chartFilters, setChartFilters] = useState(() => getInitialFilters(initialVesselId));
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    if (initialVesselId && chartFilters.selectedVessels[0] !== initialVesselId) {
      setChartFilters(prev => ({
        ...prev,
        selectedVessels: [initialVesselId]
      }));
    } else if (!initialVesselId && chartFilters.selectedVessels.length === 1) {
      setChartFilters(prev => ({
        ...prev,
        selectedVessels: defaultSelectedVessels.map(v => v.id)
      }));
    }
  }, [initialVesselId, chartFilters.selectedVessels]);

  const handleApplyFilters = (newFilters) => {
    setIsApplyingFilters(true);
    setTimeout(() => {
      setChartFilters(newFilters);
      setIsApplyingFilters(false);
    }, 500);
  };

  const handleExport = (format) => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  const chartData = useMemo(() => {
    if (
      !chartFilters.dateRange.startDate ||
      !chartFilters.dateRange.endDate ||
      chartFilters.selectedKPIs.length === 0 ||
      chartFilters.selectedVessels.length === 0
    ) {
      return [];
    }
    return generateMockChartData(
      chartFilters.selectedVessels,
      chartFilters.selectedKPIs,
      chartFilters.dataType,
      chartFilters.dateRange.startDate,
      chartFilters.dateRange.endDate,
    );
  }, [chartFilters]);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      {notifications.map((notification) => (
        <NotificationPopup
          key={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <ControlsBar
        filters={chartFilters}
        onFilterChange={setChartFilters}
        vessels={sampleVessels}
        onApplyFilters={handleApplyFilters}
        isApplyingFilters={isApplyingFilters}
        onExport={handleExport}
        isExporting={isExporting}
        onShowNotification={showNotification}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-1">
          {qualityVisible && (
            <DataQualityCards
              data={chartData}
              qualityVisible={qualityVisible}
              selectedVessels={chartFilters.selectedVessels}
              selectedKPIs={chartFilters.selectedKPIs}
              chartData={chartData}
              annotationsVisible={false}
              qualityOverlayVisible={false}
              viewMode="charts"
              compactMode={true}
            />
          )}
        </div>

        <div className="px-1 pb-1">
          {chartFilters.selectedKPIs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <BarChart3 className="w-8 h-8 text-gray-500 mb-2" />
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                No KPIs Selected
              </h3>
              <p className="text-xs text-gray-600">
                Please select at least one KPI to display charts.
              </p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <TrendingUp className="w-8 h-8 text-gray-500 mb-2" />
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                No Data Available
              </h3>
              <p className="text-xs text-gray-600">
                No data available for the selected filters. Try adjusting your
                date range or vessel selection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {chartFilters.selectedKPIs.map((kpiId) => {
                const kpiMeta = getKPIById(kpiId, chartFilters.dataType);
                if (!kpiMeta) return null;

                return (
                  <div
                    className="relative group"
                    key={kpiId}
                    style={{
                      background:
                        'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.98) 100%)',
                      borderRadius: '10px',
                      boxShadow: `
                        0 12px 25px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.5),
                        0 5px 10px rgba(0, 0, 0, 0.1)
                      `,
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                    }}
                  >
                    <div className="relative p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className="p-1 rounded-md border"
                              style={{
                                backgroundColor: `${kpiMeta.color}25`,
                                borderColor: `${kpiMeta.color}50`,
                              }}
                            >
                              {kpiMeta.category === 'performance' && (
                                <TrendingUp
                                  className="w-3.5 h-3.5"
                                  style={{ color: kpiMeta.color }}
                                />
                              )}
                              {kpiMeta.category === 'fuel' && (
                                <Fuel
                                  className="w-3.5 h-3.5"
                                  style={{ color: kpiMeta.color }}
                                />
                              )}
                              {kpiMeta.category === 'weather' && (
                                <Waves
                                  className="w-3.5 h-3.5"
                                  style={{ color: kpiMeta.color }}
                                />
                              )}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                {kpiMeta.name}
                                <span className="text-xs text-gray-600 font-normal">
                                  ({kpiMeta.unit || 'N/A'})
                                </span>
                              </h3>

                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span
                                  className={`text-xs px-1 py-0.5 rounded-full border flex items-center gap-0.5 bg-blue-600/10 text-blue-700 border-blue-600/30`}
                                >
                                  <Radio className="w-2 h-2" />
                                  LF
                                </span>
                                <span className="text-xs text-gray-600 capitalize bg-gray-200/50 px-1 py-0.5 rounded-full">
                                  {kpiMeta.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart
                            data={chartData}
                            margin={{
                              top: 5,
                              right: 5,
                              left: 5,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 6"
                              stroke="#e5e7eb"
                              strokeWidth={0.6}
                            />

                            <XAxis
                              dataKey="date"
                              tickFormatter={(tick) => {
                                const date = new Date(tick);
                                return date.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                });
                              }}
                              tick={{
                                fill: '#6b7280',
                                fontSize: 10,
                                fontWeight: 500,
                              }}
                              axisLine={{
                                stroke: '#d1d5db',
                                strokeWidth: 1,
                              }}
                              tickLine={{
                                stroke: '#d1d5db',
                                strokeWidth: 1,
                              }}
                            />

                            <YAxis
                              domain={kpiMeta.yAxisRange || ['auto', 'auto']}
                              tick={{
                                fill: '#6b7280',
                                fontSize: 10,
                                fontWeight: 500,
                              }}
                              axisLine={{
                                stroke: '#d1d5db',
                                strokeWidth: 1,
                              }}
                              tickLine={{
                                stroke: '#d1d5db',
                                strokeWidth: 1,
                              }}
                            />

                            <Tooltip
                              content={
                                <CustomTooltip
                                  dataType={chartFilters.dataType}
                                  qualityVisible={qualityVisible}
                                />
                              }
                              cursor={{
                                stroke: kpiMeta.color,
                                strokeWidth: 2,
                                strokeDasharray: '4 4',
                                strokeOpacity: 0.8,
                              }}
                            />

                            {chartFilters.selectedVessels.map((vesselId) => {
                              const dataKey = `${vesselId}_${kpiId}`;
                              const color = getVesselColor(vesselId);
                               
                              return (
                                <Line
                                  key={dataKey}
                                  type="monotone"
                                  dataKey={dataKey}
                                  stroke={color}
                                  strokeWidth={3}
                                  dot={(props) => (
                                    <QualityDot
                                      {...props}
                                      dataKey={dataKey}
                                      stroke={color}
                                      qualityVisible={qualityVisible}
                                    />
                                  )}
                                  activeDot={{
                                    r: 8,
                                    strokeWidth: 3,
                                    fill: color,
                                    stroke: '#fff',
                                  }}
                                  connectNulls={!qualityVisible}
                                />
                              );
                            })}
                          </LineChart>
                        </ResponsiveContainer>

                        {qualityVisible && (
                          <div className="absolute top-0 left-0 right-0 flex items-center justify-end gap-3 text-[10px] p-1.5">
                            <div className="flex items-center gap-0.5">
                              <div className="w-2 h-2 rounded-full bg-emerald-600 border border-gray-400/30"></div>
                              <span className="text-gray-700">Normal</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <div
                                className="w-2 h-2 bg-yellow-600"
                                style={{
                                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                                }}
                              ></div>
                              <span className="text-gray-700">Incorrect</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <div className="w-2 h-2 border-2 border-red-600 border-dashed rounded-full bg-transparent relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-red-600 text-[9px] leading-none">×</span>
                                </div>
                              </div>
                              <span className="text-gray-700">Missing</span>
                            </div>
                          </div>
                        )}

                        <div className="mt-2 p-1.5">
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] justify-center">
                            {chartFilters.selectedVessels.map((vesselId) => {
                              const vessel = sampleVessels.find(v => v.id === vesselId);
                              const color = getVesselColor(vesselId);
                               
                              return (
                                <div key={vesselId} className="flex items-center gap-1">
                                  <div
                                    className="w-2 h-2 rounded-full border border-gray-400/30"
                                    style={{
                                      backgroundColor: color,
                                      boxShadow: `0 0 4px ${color}40`,
                                    }}
                                  />
                                  <span className="text-gray-700">
                                    {vessel?.name || vesselId}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartView;
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
  Target,
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
  Check,
} from 'lucide-react';

// Import the shared DataQualityCards component
import DataQualityCards, { staticQualityData } from '../table/DataQualityCards';

// Constants and Data Types
const DATA_TYPES = {
  COMBINED: 'combined',
  LF: 'lf',
  HF: 'hf',
};

// HF Data Intervals
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
  HF: [
    {
      id: 'obs_speed',
      name: 'Obs Speed',
      unit: 'knts',
      category: 'performance',
      source: 'HF',
      color: '#4CC9F0',
      yAxisRange: [0, 25],
    },
    {
      id: 'me_consumption',
      name: 'ME Consumption',
      unit: 'Mt',
      category: 'fuel',
      source: 'HF',
      color: '#F07167',
      yAxisRange: [0, 50],
    },
    {
      id: 'total_consumption',
      name: 'Total Consumption',
      unit: 'Mt',
      category: 'fuel',
      source: 'HF',
      color: '#FFC300',
      yAxisRange: [0, 60],
    },
    {
      id: 'wind_force',
      name: 'Wind Force',
      unit: 'Beaufort',
      category: 'weather',
      source: 'HF',
      color: '#8D8DDA',
      yAxisRange: [0, 12],
    },
    {
      id: 'me_power',
      name: 'ME Power',
      unit: 'kW',
      category: 'performance',
      source: 'HF',
      color: '#2ECC71',
      yAxisRange: [0, 20000],
    },
    {
      id: 'me_sfoc',
      name: 'ME SFOC',
      unit: 'gm/kWhr',
      category: 'performance',
      source: 'HF',
      color: '#E74C3C',
      yAxisRange: [160, 220],
    },
    {
      id: 'rpm',
      name: 'RPM',
      unit: 'rpm',
      category: 'performance',
      source: 'HF',
      color: '#9B59B6',
      yAxisRange: [0, 150],
    },
  ],
};

// Vessel Colors for Chart Lines
const VESSEL_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
  '#8dd1e1',
  '#83a6ed',
  '#8884d8',
  '#d084d0',
  '#ffb347',
  '#87ceeb',
];

// LF and HF colors for combined mode
const LF_HF_COLORS = {
  LF: '#4CC9F0',
  HF: '#F07167',
};

// Helper Functions
const getKPIById = (kpiId, dataType) => {
  const kpisForType = ALL_KPIS[dataType.toUpperCase()] || [];
  if (dataType === DATA_TYPES.COMBINED) {
    const combinedKpis = [...ALL_KPIS.LF, ...ALL_KPIS.HF];
    return combinedKpis.find((kpi) => kpi.id === kpiId);
  }
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
  const intervalConfig = HF_INTERVAL_CONFIGS[hfInterval];
  const intervalHours = intervalConfig.dataPointInterval;

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString();
    const entry = { date: dateString };

    selectedVesselIds.forEach((vesselId, vesselIndex) => {
      selectedKPIs.forEach((kpiId) => {
        if (dataType === DATA_TYPES.COMBINED) {
          // For combined mode, generate both LF and HF data
          ['LF', 'HF'].forEach((sourceType) => {
            const kpiMeta = ALL_KPIS[sourceType].find(kpi => kpi.id === kpiId);
            if (!kpiMeta) return;

            const vesselQuality = staticQualityData[vesselIndex % staticQualityData.length];
            let value = generateKPIValue(kpiId, currentDate, sourceType);
            
            // Apply quality issues
            const { finalValue, qualityInfo } = applyQualityIssues(value, kpiId, vesselQuality);
            
            const dataKey = `${vesselId}_${kpiId}_${sourceType}`;
            entry[dataKey] = finalValue;
            entry[`${dataKey}_quality`] = qualityInfo.qualityType;
            entry[`${dataKey}_hasIssue`] = qualityInfo.hasQualityIssue;
            entry[`${dataKey}_issueDetails`] = qualityInfo.issueDetails;
            entry[`${dataKey}_vesselQuality`] = vesselQuality;
          });
        } else {
          // For LF or HF mode
          const kpiMeta = getKPIById(kpiId, dataType);
          if (!kpiMeta) return;

          const vesselQuality = staticQualityData[vesselIndex % staticQualityData.length];
          let value = generateKPIValue(kpiId, currentDate, dataType.toUpperCase());
          
          // Apply quality issues
          const { finalValue, qualityInfo } = applyQualityIssues(value, kpiId, vesselQuality);
          
          const dataKey = `${vesselId}_${kpiId}`;
          entry[dataKey] = finalValue;
          entry[`${dataKey}_quality`] = qualityInfo.qualityType;
          entry[`${dataKey}_hasIssue`] = qualityInfo.hasQualityIssue;
          entry[`${dataKey}_issueDetails`] = qualityInfo.issueDetails;
          entry[`${dataKey}_vesselQuality`] = vesselQuality;
        }
      });
    });

    data.push(entry);
    
    // Increment by the specified interval
    currentDate.setHours(currentDate.getHours() + intervalHours);
  }
  
  return data;
};

const generateKPIValue = (kpiId, currentDate, sourceType) => {
  const timeComponent = currentDate.getTime() / (1000 * 60 * 60);
  const sourceMultiplier = sourceType === 'HF' ? 1.1 : 1.0; // HF slightly higher values
  
  switch (kpiId) {
    case 'obs_speed':
      return (10 + Math.random() * 5 + Math.sin(timeComponent / 24) * 2) * sourceMultiplier;
    case 'me_consumption':
      return (20 + Math.random() * 10 + Math.sin(timeComponent / 12) * 3) * sourceMultiplier;
    case 'total_consumption':
      return (25 + Math.random() * 15 + Math.sin(timeComponent / 8) * 4) * sourceMultiplier;
    case 'wind_force':
      return Math.floor(Math.random() * 8) + Math.sin(timeComponent / 6) * 2;
    case 'me_power':
      return (5000 + Math.random() * 2000 + Math.sin(timeComponent / 4) * 500) * sourceMultiplier;
    case 'me_sfoc':
      return (160 + Math.random() * 10 + Math.sin(timeComponent / 24) * 3) * sourceMultiplier;
    case 'rpm':
      return (80 + Math.random() * 20 + Math.sin(timeComponent / 6) * 5) * sourceMultiplier;
    default:
      return Math.random() * 100 * sourceMultiplier;
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
      // Apply incorrect values based on KPI type
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
          finalValue = value * 1.5; // 50% higher than normal
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

// Notification Component
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

// Controls Bar Component
const ControlsBar = ({
  filters = {
    dataType: DATA_TYPES.LF,
    selectedKPIs: [],
    selectedVessels: [],
    dateRange: { startDate: null, endDate: null },
    hfInterval: HF_INTERVALS.DAILY,
  },
  onFilterChange = () => {},
  vessels = sampleVessels,
  onApplyFilters = () => {},
  onResetFilters = () => {},
  isApplyingFilters = false,
  onExport = () => {},
  isExporting = false,
  currentView = 'charts',
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
    hfInterval: filters.hfInterval || HF_INTERVALS.DAILY,
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
    if (type === DATA_TYPES.COMBINED) {
      // For combined mode, limit to single vessel
      const singleVessel = localFilters.selectedVessels.slice(0, 1);
      setLocalFilters((prev) => ({
        ...prev,
        dataType: type,
        selectedVessels: singleVessel.length > 0 ? singleVessel : [defaultSelectedVessels[0].id],
        selectedKPIs: ALL_KPIS.LF.map((kpi) => kpi.id),
      }));
      
      onShowNotification(
        'Combined mode shows both LF and HF data for a single vessel per chart. Only one vessel has been selected.',
        'info'
      );
    } else if (type === DATA_TYPES.HF) {
      // For HF mode, limit to 3 vessels
      const limitedVessels = localFilters.selectedVessels.slice(0, 3);
      setLocalFilters((prev) => ({
        ...prev,
        dataType: type,
        selectedVessels: limitedVessels.length > 0 ? limitedVessels : defaultSelectedVessels.slice(0, 3).map((v) => v.id),
        selectedKPIs: ALL_KPIS.HF.map((kpi) => kpi.id),
        hfInterval: HF_INTERVALS.DAILY,
      }));
      
      if (localFilters.selectedVessels.length > 3) {
        onShowNotification(
          'HF mode supports maximum 3 vessels for optimal performance. Selection has been limited to first 3 vessels.',
          'warning'
        );
      }
    } else {
      // LF mode
      setLocalFilters((prev) => ({
        ...prev,
        dataType: type,
        selectedKPIs: ALL_KPIS.LF.map((kpi) => kpi.id),
      }));
    }
  };

  const handleHFIntervalChange = (interval) => {
    const config = HF_INTERVAL_CONFIGS[interval];
    
    if (config.maxDays) {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - config.maxDays);
      
      setLocalFilters((prev) => ({
        ...prev,
        hfInterval: interval,
        dateRange: { startDate, endDate },
      }));
      
      onShowNotification(
        `${config.label}: ${config.description}. Date range has been adjusted accordingly.`,
        'info'
      );
    } else {
      setLocalFilters((prev) => ({
        ...prev,
        hfInterval: interval,
      }));
    }
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
    if (localFilters.dataType === DATA_TYPES.COMBINED) {
      // For combined, show unique KPIs
      const uniqueKPIs = {};
      [...ALL_KPIS.LF, ...ALL_KPIS.HF].forEach((kpi) => {
        if (!uniqueKPIs[kpi.id]) {
          uniqueKPIs[kpi.id] = { ...kpi, source: 'COMBINED' };
        }
      });
      return Object.values(uniqueKPIs);
    }
    return ALL_KPIS[localFilters.dataType.toUpperCase()] || [];
  }, [localFilters.dataType]);

  return (
    <div className="bg-slate-800/50 border-b border-white/10 backdrop-blur-md relative">
      <div className="flex items-center justify-between w-full p-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-cyan-500/20 border border-cyan-500/30">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Fleet Analytics</h3>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Configuration Dropdown */}
          <div className="relative" ref={kpiDropdownRef}>
            <button
              onClick={() => setShowKPIDropdown(!showKPIDropdown)}
              className="w-8 h-8 flex items-center justify-center bg-slate-700/50 border border-white/10 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="Configure KPIs"
            >
              <Settings className="w-4 h-4" />
            </button>

            {showKPIDropdown && (
              <>
                {/* Backdrop overlay to prevent click-through */}
                <div 
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                  onClick={() => setShowKPIDropdown(false)}
                />
                
                {/* Dropdown positioned to be fully visible */}
                <div 
                  className="fixed right-4 top-16 w-80 max-h-[calc(100vh-80px)] rounded-lg shadow-2xl z-50 overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/20 bg-slate-800/30">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Settings className="w-4 h-4 text-cyan-400" />
                      Configure KPIs
                    </h4>
                    <button 
                      onClick={() => setShowKPIDropdown(false)}
                      className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-400 hover:text-white" />
                    </button>
                  </div>

                  {/* Scrollable content */}
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Data Source Selection */}
                    <div className="p-4 border-b border-white/10">
                      <label className="text-xs font-medium text-slate-300 mb-3 block flex items-center gap-2">
                        <Radio className="w-3 h-3 text-cyan-400" />
                        Data Source
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'LF', label: 'LF', icon: Radio, color: 'blue' },
                          { key: 'HF', label: 'HF', icon: Zap, color: 'orange' },
                          { key: 'COMBINED', label: 'Combined', icon: Layers, color: 'purple' }
                        ].map((type) => {
                          const isSelected = localFilters.dataType === type.key.toLowerCase();
                          return (
                            <button
                              key={type.key}
                              onClick={() => handleDataTypeChange(type.key.toLowerCase())}
                              className={`px-3 py-3 text-xs font-medium rounded-lg transition-all duration-200 border-2 ${
                                isSelected
                                  ? 'bg-emerald-500/30 text-emerald-100 border-emerald-400/70 shadow-lg transform scale-105'
                                  : 'bg-slate-700/40 text-slate-300 border-slate-600/50 hover:bg-slate-600/60 hover:border-slate-500/70 hover:scale-102'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-1.5">
                                <type.icon className={`w-4 h-4 ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`} />
                                <span className="text-[11px] font-semibold">{type.label}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Data type info */}
                      <div className="mt-3 p-2 bg-slate-700/30 rounded-md">
                        <p className="text-[10px] text-slate-400">
                          {localFilters.dataType === 'lf' && '📊 Low Frequency data - Multiple vessels supported'}
                          {localFilters.dataType === 'hf' && '⚡ High Frequency data - Max 3 vessels, configurable intervals'}
                          {localFilters.dataType === 'combined' && '🔄 Shows both LF & HF data - Single vessel only'}
                        </p>
                      </div>
                    </div>

                    {/* HF Interval Selection */}
                    {localFilters.dataType === DATA_TYPES.HF && (
                      <div className="p-4 border-b border-white/10">
                        <label className="text-xs font-medium text-slate-300 mb-3 block flex items-center gap-2">
                          <Clock className="w-3 h-3 text-orange-400" />
                          HF Data Interval
                        </label>
                        <div className="space-y-2">
                          {Object.entries(HF_INTERVALS).map(([key, value]) => {
                            const config = HF_INTERVAL_CONFIGS[value];
                            const isSelected = localFilters.hfInterval === value;
                            return (
                              <button
                                key={key}
                                onClick={() => handleHFIntervalChange(value)}
                                className={`w-full px-3 py-2 text-xs text-left rounded-lg transition-all duration-200 border ${
                                  isSelected
                                    ? 'bg-orange-500/25 text-orange-100 border-orange-400/50 shadow-md'
                                    : 'bg-slate-700/30 text-slate-300 border-slate-600/30 hover:bg-slate-600/50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{config.label}</span>
                                  <div className="flex items-center gap-1">
                                    {config.maxDays && (
                                      <span className="text-[9px] bg-slate-600/50 px-1 py-0.5 rounded">
                                        {config.maxDays}d max
                                      </span>
                                    )}
                                    <Clock className="w-3 h-3" />
                                  </div>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1">
                                  {config.description}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* KPI Selection */}
                    <div className="p-4">
                      <label className="text-xs font-medium text-slate-300 mb-3 block flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Target className="w-3 h-3 text-cyan-400" />
                          Select KPIs
                        </span>
                        <span className="text-emerald-400 font-semibold">
                          {localFilters.selectedKPIs?.length || 0} selected
                        </span>
                      </label>
                      
                      {/* Select All / None buttons */}
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => setLocalFilters(prev => ({ 
                            ...prev, 
                            selectedKPIs: availableKPIs.map(kpi => kpi.id) 
                          }))}
                          className="text-[10px] px-2 py-1 bg-emerald-600/20 text-emerald-300 rounded hover:bg-emerald-600/30 transition-colors"
                        >
                          Select All
                        </button>
                        <button
                          onClick={() => setLocalFilters(prev => ({ ...prev, selectedKPIs: [] }))}
                          className="text-[10px] px-2 py-1 bg-red-600/20 text-red-300 rounded hover:bg-red-600/30 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {availableKPIs.map((kpi) => {
                          const isSelected = localFilters.selectedKPIs?.includes(kpi.id);
                          return (
                            <label
                              key={`${kpi.id}-${kpi.source}`}
                              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                                isSelected
                                  ? 'bg-emerald-500/20 border-emerald-400/40 shadow-sm'
                                  : 'bg-slate-700/20 border-slate-600/30 hover:bg-slate-600/40 hover:border-slate-500/50'
                              }`}
                            >
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleKPISelection(kpi.id)}
                                  className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-500 rounded focus:ring-emerald-500 focus:ring-2 focus:ring-offset-0"
                                />
                                {isSelected && (
                                  <Check className="w-3 h-3 text-emerald-400 absolute top-0.5 left-0.5 pointer-events-none" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-white truncate">
                                    {kpi.name}
                                  </span>
                                  {kpi.source !== 'COMBINED' && (
                                    <span
                                      className={`text-[8px] px-1.5 py-0.5 rounded-full border font-semibold ${
                                        kpi.source === 'LF'
                                          ? 'bg-blue-500/25 text-blue-200 border-blue-400/50'
                                          : 'bg-orange-500/25 text-orange-200 border-orange-400/50'
                                      }`}
                                    >
                                      {kpi.source}
                                    </span>
                                  )}
                                </div>
                                {kpi.unit && (
                                  <span className="text-xs text-slate-400">
                                    Unit: {kpi.unit}
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-500 capitalize">
                                  {kpi.category} metric
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-white/10 bg-slate-800/30 flex justify-between items-center">
                    <div className="text-[10px] text-slate-400">
                      {localFilters.selectedKPIs?.length || 0} KPIs • {localFilters.dataType.toUpperCase()} mode
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowKPIDropdown(false)}
                        className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-700/50 border border-slate-600/50 rounded-md hover:bg-slate-600/70 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleApply}
                        className="px-3 py-2 text-xs font-medium text-white bg-emerald-600 border border-emerald-500 rounded-md hover:bg-emerald-700 transition-colors shadow-lg"
                      >
                        Apply Changes
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-8 h-8 flex items-center justify-center bg-slate-700/50 border border-white/10 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-300"
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
            className="w-8 h-8 flex items-center justify-center bg-slate-700/50 border border-white/10 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-300 disabled:opacity-50"
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

// Chart Components - Enhanced with Quality Toggle Support
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

  // NEW: If quality is not visible, show clean dots
  if (!qualityVisible) {
    if (value === null || value === undefined) {
      return null; // Don't render missing data dots when quality is off
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

  // Original quality-aware dot rendering
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
  qualityVisible, // NEW: Quality visibility prop
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/98 border border-white/25 rounded-lg p-3 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/15">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <p className="text-xs font-semibold text-white">
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
            
            if (dataType === DATA_TYPES.COMBINED) {
              [vesselId, kpiId, sourceType] = parts;
            } else {
              [vesselId, kpiId] = parts;
              sourceType = dataType.toUpperCase();
            }
            
            const vessel = sampleVessels.find((v) => v.id === vesselId);
            const qualityType = entry.payload[`${entry.dataKey}_quality`];
            const hasIssue = entry.payload[`${entry.dataKey}_hasIssue`];
            const issueDetails = entry.payload[`${entry.dataKey}_issueDetails`];

            if (!vessel) return null;

            return (
              <div key={`item-${index}`} className="group">
                <div className="flex items-center justify-between p-1.5 rounded-md bg-slate-700/40 hover:bg-slate-700/60 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      {/* NEW: Conditional quality indicator rendering */}
                      {!qualityVisible ? (
                        // Clean dot when quality is off
                        <div
                          className="w-3.5 h-3.5 rounded-full border-2 border-white/30"
                          style={{
                            backgroundColor: entry.color,
                            boxShadow: `0 0 8px ${entry.color}40`,
                          }}
                        />
                      ) : (
                        // Quality-aware indicators when quality is on
                        entry.value === null ? (
                          <div className="w-3.5 h-3.5 border-2 border-red-400 border-dashed rounded-full bg-transparent flex items-center justify-center">
                            <WifiOff className="w-2 h-2 text-red-400" />
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
                              className="w-3.5 h-3.5 rounded-full border-2 border-white/30"
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
                        {dataType === DATA_TYPES.COMBINED && (
                          <span
                            className={`text-[8px] px-1 py-0.5 rounded-full border ${
                              sourceType === 'LF'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                            }`}
                          >
                            {sourceType}
                          </span>
                        )}
                      </div>

                      {/* NEW: Only show quality issues when quality is visible */}
                      {qualityVisible && hasIssue && issueDetails && (
                        <div className="text-[10px] text-orange-300 flex items-center gap-0.5 mt-0.5">
                          <AlertCircle className="w-2.5 h-2.5" />
                          {issueDetails.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-white font-semibold">
                      {entry.value === null ? (
                        qualityVisible ? (
                          <span className="text-red-400 flex items-center gap-0.5">
                            <X className="w-2.5 h-2.5" />
                            Missing
                          </span>
                        ) : (
                          <span className="text-slate-400">--</span>
                        )
                      ) : (
                        entry.value
                      )}
                    </span>
                    {/* NEW: Only show quality flags when quality is visible */}
                    {qualityVisible && entry.value !== null &&
                      hasIssue &&
                      qualityType === 'incorrect' && (
                        <div className="text-[10px] text-yellow-400 flex items-center gap-0.5 justify-end mt-0.5">
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

// Main ChartView Component
const ChartView = ({ 
  initialVesselId = null,
  className = '',
  qualityVisible = true, // NEW: Quality toggle prop
  onQualityToggle = () => {}, // NEW: Quality toggle handler
}) => {
  const getInitialFilters = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    const selectedVessels = initialVesselId 
      ? [initialVesselId] 
      : defaultSelectedVessels.map((v) => v.id);

    return {
      dataType: DATA_TYPES.LF,
      selectedKPIs: ALL_KPIS.LF.map((kpi) => kpi.id),
      selectedVessels: selectedVessels,
      dateRange: { startDate, endDate },
      hfInterval: HF_INTERVALS.DAILY,
    };
  };

  const [chartFilters, setChartFilters] = useState(getInitialFilters());
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
    if (initialVesselId) {
      setChartFilters(prev => ({
        ...prev,
        selectedVessels: [initialVesselId]
      }));
    }
  }, [initialVesselId]);

  const handleApplyFilters = (newFilters) => {
    setIsApplyingFilters(true);
    setTimeout(() => {
      setChartFilters(newFilters);
      setIsApplyingFilters(false);
    }, 500);
  };

  const handleResetFilters = () => {
    const resetFilters = getInitialFilters();
    setChartFilters(resetFilters);
  };

  const handleExport = (format) => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  // Generate chart data based on current filters
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
      chartFilters.hfInterval
    );
  }, [chartFilters]);

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col">
      {/* Notifications */}
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
        onResetFilters={handleResetFilters}
        isApplyingFilters={isApplyingFilters}
        onExport={handleExport}
        isExporting={isExporting}
        currentView="charts"
        onShowNotification={showNotification}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-1">
          {/* NEW: Conditional rendering based on quality toggle */}
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
              <BarChart3 className="w-8 h-8 text-slate-500 mb-2" />
              <h3 className="text-sm font-semibold text-white mb-1">
                No KPIs Selected
              </h3>
              <p className="text-xs text-slate-400">
                Please select at least one KPI to display charts.
              </p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <TrendingUp className="w-8 h-8 text-slate-500 mb-2" />
              <h3 className="text-sm font-semibold text-white mb-1">
                No Data Available
              </h3>
              <p className="text-xs text-slate-400">
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
                        'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                      borderRadius: '10px',
                      boxShadow: `
                        0 12px 25px rgba(0, 0, 0, 0.35),
                        inset 0 1px 0 rgba(255, 255, 255, 0.12),
                        0 5px 10px rgba(0, 0, 0, 0.3)
                      `,
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <div className="relative p-3">
                      {/* Enhanced Header */}
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
                              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                                {kpiMeta.name}
                                <span className="text-xs text-slate-400 font-normal">
                                  ({kpiMeta.unit || 'N/A'})
                                </span>
                              </h3>

                              <div className="flex items-center gap-1.5 mt-0.5">
                                {chartFilters.dataType !== DATA_TYPES.COMBINED && (
                                  <span
                                    className={`text-xs px-1 py-0.5 rounded-full border flex items-center gap-0.5 ${
                                      kpiMeta.source === 'LF'
                                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                        : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                                    }`}
                                  >
                                    {kpiMeta.source === 'LF' && (
                                      <Radio className="w-2 h-2" />
                                    )}
                                    {kpiMeta.source === 'HF' && (
                                      <Zap className="w-2 h-2" />
                                    )}
                                    {kpiMeta.source}
                                  </span>
                                )}
                                {chartFilters.dataType === DATA_TYPES.HF && (
                                  <span className="text-xs text-slate-400 bg-slate-700/50 px-1 py-0.5 rounded-full">
                                    {HF_INTERVAL_CONFIGS[chartFilters.hfInterval].label}
                                  </span>
                                )}
                                <span className="text-xs text-slate-400 capitalize bg-slate-700/50 px-1 py-0.5 rounded-full">
                                  {kpiMeta.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Chart Container */}
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
                              stroke="rgba(255, 255, 255, 0.1)"
                              strokeWidth={0.6}
                            />

                            <XAxis
                              dataKey="date"
                              tickFormatter={(tick) => {
                                const date = new Date(tick);
                                if (chartFilters.hfInterval === HF_INTERVALS.RAW || 
                                    chartFilters.hfInterval === HF_INTERVALS.HOURLY) {
                                  return date.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  });
                                }
                                return date.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                });
                              }}
                              tick={{
                                fill: '#cbd5e1',
                                fontSize: 10,
                                fontWeight: 500,
                              }}
                              axisLine={{
                                stroke: 'rgba(255, 255, 255, 0.15)',
                                strokeWidth: 1,
                              }}
                              tickLine={{
                                stroke: 'rgba(255, 255, 255, 0.15)',
                                strokeWidth: 1,
                              }}
                            />

                            <YAxis
                              domain={kpiMeta.yAxisRange || ['auto', 'auto']}
                              tick={{
                                fill: '#cbd5e1',
                                fontSize: 10,
                                fontWeight: 500,
                              }}
                              axisLine={{
                                stroke: 'rgba(255, 255, 255, 0.15)',
                                strokeWidth: 1,
                              }}
                              tickLine={{
                                stroke: 'rgba(255, 255, 255, 0.15)',
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

                            {/* Enhanced Lines with Quality Indicators */}
                            {chartFilters.dataType === DATA_TYPES.COMBINED ? (
                              // Combined mode: Show LF and HF lines for single vessel
                              ['LF', 'HF'].map((sourceType) => {
                                const vesselId = chartFilters.selectedVessels[0];
                                const dataKey = `${vesselId}_${kpiId}_${sourceType}`;
                                const color = LF_HF_COLORS[sourceType];
                                
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
                              })
                            ) : (
                              // LF or HF mode: Show multiple vessels
                              chartFilters.selectedVessels.map((vesselId, index) => {
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
                              })
                            )}
                          </LineChart>
                        </ResponsiveContainer>

                        {/* Conditional Quality Legend */}
                        {qualityVisible && (
                          <div className="absolute top-0 left-0 right-0 flex items-center justify-end gap-3 text-[10px] p-1.5">
                            <div className="flex items-center gap-0.5">
                              <div className="w-2 h-2 rounded-full bg-emerald-400 border border-white/30"></div>
                              <span className="text-slate-300">Normal</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <div
                                className="w-2 h-2 bg-yellow-400"
                                style={{
                                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                                }}
                              ></div>
                              <span className="text-slate-300">Incorrect</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <div className="w-2 h-2 border-2 border-red-400 border-dashed rounded-full bg-transparent relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-red-400 text-[9px] leading-none">×</span>
                                </div>
                              </div>
                              <span className="text-slate-300">Missing</span>
                            </div>
                          </div>
                        )}

                        {/* Legend */}
                        <div className="mt-2 p-1.5">
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] justify-center">
                            {chartFilters.dataType === DATA_TYPES.COMBINED ? (
                              // Combined mode legend: Show LF/HF for single vessel
                              ['LF', 'HF'].map((sourceType) => {
                                const vessel = sampleVessels.find(v => v.id === chartFilters.selectedVessels[0]);
                                const color = LF_HF_COLORS[sourceType];
                                
                                return (
                                  <div key={sourceType} className="flex items-center gap-1">
                                    <div
                                      className="w-2 h-2 rounded-full border border-white/30"
                                      style={{
                                        backgroundColor: color,
                                        boxShadow: `0 0 4px ${color}40`,
                                      }}
                                    />
                                    <span className="text-slate-300">
                                      {vessel?.name} ({sourceType})
                                    </span>
                                  </div>
                                );
                              })
                            ) : (
                              // LF/HF mode legend: Show multiple vessels
                              chartFilters.selectedVessels.map((vesselId) => {
                                const vessel = sampleVessels.find(v => v.id === vesselId);
                                const color = getVesselColor(vesselId);
                                
                                return (
                                  <div key={vesselId} className="flex items-center gap-1">
                                    <div
                                      className="w-2 h-2 rounded-full border border-white/30"
                                      style={{
                                        backgroundColor: color,
                                        boxShadow: `0 0 4px ${color}40`,
                                      }}
                                    />
                                    <span className="text-slate-300">
                                      {vessel?.name || vesselId}
                                    </span>
                                  </div>
                                );
                              })
                            )}
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
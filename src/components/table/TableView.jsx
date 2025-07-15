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

// Controls Bar Component
const ControlsBar = ({
  onExport = () => {},
  isExporting = false,
  onKPIChange = () => {},
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showKPIDropdown, setShowKPIDropdown] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    dataType: DATA_TYPES.LF,
    selectedKPIs: ALL_KPIS.LF.map((kpi) => kpi.id),
  });
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
    onKPIChange(localFilters);
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
                        onClick={() => handleDataTypeChange(type)}
                        className={`flex-1 px-2 py-2 text-xs font-medium rounded-md transition-colors ${
                          localFilters.dataType === type
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
                    Select KPIs ({localFilters.selectedKPIs?.length || 0}{' '}
                    selected)
                  </label>
                  <div className="space-y-2">
                    {(localFilters.dataType === 'COMBINED'
                      ? [...ALL_KPIS.LF, ...ALL_KPIS.LF]
                      : ALL_KPIS[localFilters.dataType.toUpperCase()]
                    ).map((kpi) => (
                      <label
                        key={`${kpi.id}-${kpi.source}`}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-700/30 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={localFilters.selectedKPIs?.includes(kpi.id)}
                          onChange={() => handleKPISelection(kpi.id)}
                          className="w-4 h-4 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white truncate">
                              {kpi.name}
                            </span>
                            {getDataSourceIndicator(kpi.source)}
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
  onVesselClick = () => {} // New prop for handling vessel clicks
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedRows, setSelectedRows] = useState([]);
  const [qualityVisible, setQualityVisible] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const currentKPIs = [
    { id: 'obs_speed', name: 'Obs Speed', unit: 'knts', source: 'LF' },
    { id: 'me_consumption', name: 'ME Consumption', unit: 'Mt', source: 'LF' },
    {
      id: 'total_consumption',
      name: 'Total Consumption',
      unit: 'Mt',
      source: 'LF',
    },
    { id: 'wind_force', name: 'Wind Force', unit: '', source: 'LF' },
    {
      id: 'laden_condition',
      name: 'Loading Condition',
      unit: '',
      source: 'LF',
    },
    { id: 'me_power', name: 'ME Power', unit: 'kW', source: 'LF' },
    { id: 'me_sfoc', name: 'ME SFOC', unit: 'gm/kWhr', source: 'LF' },
    { id: 'rpm', name: 'RPM', unit: '', source: 'LF' },
  ];

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
      };

      // Generate data for each KPI based on the actual issues in vessel.kpiIssues
      currentKPIs.forEach((kpi) => {
        const kpiId = kpi.id;

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
          data.lf[kpiId] = null;
        } else if (hasIncorrectIssue) {
          // Use specific incorrect values based on the issue
          const incorrectIssue = kpiIssueEntries.find(
            (issue) => issue.type === 'incorrect'
          );
          if (incorrectIssue && incorrectIssue.originalValue !== undefined) {
            data.lf[kpiId] = incorrectIssue.originalValue;
          } else {
            // Generate problematic values
            switch (kpiId) {
              case 'obs_speed':
                data.lf[kpiId] = -2.5; // Negative speed
                break;
              case 'me_consumption':
                data.lf[kpiId] = 45.8; // High consumption
                break;
              case 'rpm':
                data.lf[kpiId] = 250; // High RPM
                break;
              default:
                data.lf[kpiId] = 12.5 + Math.random() * 8;
            }
          }
        } else {
          // Generate normal values
          switch (kpiId) {
            case 'obs_speed':
              data.lf[kpiId] = 12.5 + Math.random() * 8;
              break;
            case 'me_consumption':
              data.lf[kpiId] = 8.2 + Math.random() * 4;
              break;
            case 'total_consumption':
              data.lf[kpiId] = 10.5 + Math.random() * 5;
              break;
            case 'wind_force':
              data.lf[kpiId] = Math.floor(Math.random() * 8) + 1;
              break;
            case 'laden_condition':
              data.lf[kpiId] = Math.random() > 0.5 ? 1 : 0;
              break;
            case 'me_power':
              data.lf[kpiId] = 4200 + Math.random() * 2000;
              break;
            case 'me_sfoc':
              data.lf[kpiId] = 185 + Math.random() * 15;
              break;
            case 'rpm':
              data.lf[kpiId] = 85 + Math.random() * 25;
              break;
            default:
              data.lf[kpiId] = Math.random() * 100;
          }
        }
      });

      return data;
    });
  }, []);

  // Enhanced value display with quality indicators that match the issues in quality cards
  const getValueDisplay = (item, kpiId) => {
    const value = item.lf[kpiId];

    // Check if this KPI has issues for this vessel
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

  return (
    <div
      className={`bg-slate-900 text-white min-h-screen flex flex-col ${className}`}
    >
      <ControlsBar onExport={handleExport} isExporting={isExporting} />

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <DataQualityCards
            data={sampleData}
            qualityVisible={qualityVisible}
            onToggleQuality={() => setQualityVisible(!qualityVisible)}
            selectedVessels={sampleData.map((item) => `vessel_${item.id}`)}
            selectedKPIs={currentKPIs.map((kpi) => kpi.id)}
            chartData={sampleData}
            annotationsVisible={false}
            qualityOverlayVisible={false}
            viewMode="table"
            compactMode={true}
          />

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
                    {currentKPIs.map((kpi) => (
                      <th key={kpi.id} className="w-24 px-2 py-1 text-center">
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
                      {currentKPIs.map((kpi) => (
                        <td key={kpi.id} className="px-2 py-1 text-center">
                          {getValueDisplay(item, kpi.id)}
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
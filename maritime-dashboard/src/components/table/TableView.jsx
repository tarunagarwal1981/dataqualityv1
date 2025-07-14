import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';

// Enhanced static quality data with realistic issues
const staticQualityData = (() => {
  const vessels = [
    'Atlantic Pioneer',
    'Pacific Explorer',
    'Nordic Voyager',
    'Baltic Star',
    'Mediterranean Crown',
    'Arctic Wind',
    'Indian Ocean',
    'Caribbean Spirit',
    'Red Sea Navigator',
    'Bering Strait',
  ];

  return vessels.map((name, index) => {
    // Generate realistic quality issues
    const issues = [];
    const kpiIssues = {};

    // Completeness issues (missing data)
    if (Math.random() < 0.4) {
      const missingKPIs = ['wind_force', 'me_power', 'rpm'].filter(
        () => Math.random() < 0.3
      );
      missingKPIs.forEach((kpi) => {
        kpiIssues[kpi] = { type: 'missing', severity: 'medium' };
        issues.push({
          type: 'completeness',
          kpi,
          message: 'Sensor data unavailable',
        });
      });
    }

    // Correctness issues (wrong data)
    if (Math.random() < 0.3) {
      if (Math.random() < 0.5) {
        kpiIssues['obs_speed'] = {
          type: 'incorrect',
          severity: 'high',
          originalValue: -2.5,
        };
        issues.push({
          type: 'correctness',
          kpi: 'obs_speed',
          message: 'Negative speed detected',
        });
      }
      if (Math.random() < 0.4) {
        kpiIssues['me_consumption'] = {
          type: 'incorrect',
          severity: 'medium',
          originalValue: 45.8,
        };
        issues.push({
          type: 'correctness',
          kpi: 'me_consumption',
          message: 'Consumption spike detected',
        });
      }
      if (Math.random() < 0.3) {
        kpiIssues['rpm'] = {
          type: 'incorrect',
          severity: 'low',
          originalValue: 2500,
        };
        issues.push({
          type: 'correctness',
          kpi: 'rpm',
          message: 'RPM-speed correlation warning',
        });
      }
    }

    // Calculate quality scores based on actual issues
    const totalKPIs = 8;
    const issueCount = Object.keys(kpiIssues).length;
    const highSeverityIssues = Object.values(kpiIssues).filter(
      (issue) => issue.severity === 'high'
    ).length;
    const mediumSeverityIssues = Object.values(kpiIssues).filter(
      (issue) => issue.severity === 'medium'
    ).length;

    // Calculate completeness (missing data affects this)
    const missingCount = Object.values(kpiIssues).filter(
      (issue) => issue.type === 'missing'
    ).length;
    const completeness = Math.max(
      40,
      100 - (missingCount / totalKPIs) * 100 - Math.random() * 10
    );

    // Calculate correctness (wrong data affects this)
    const incorrectCount = Object.values(kpiIssues).filter(
      (issue) => issue.type === 'incorrect'
    ).length;
    const severityPenalty =
      highSeverityIssues * 30 + mediumSeverityIssues * 15 + issueCount * 5;
    const correctness = Math.max(
      30,
      100 - severityPenalty - Math.random() * 10
    );

    return {
      id: index + 1,
      name,
      completeness: Math.round(completeness),
      correctness: Math.round(correctness),
      overallScore: Math.round((completeness + correctness) / 2),
      issues: issues,
      kpiIssues: kpiIssues,
      issueCount: issues.length,
      criticalIssues: highSeverityIssues,
      lastUpdate: `${Math.floor(Math.random() * 30) + 1} mins ago`,
      status:
        index % 3 === 0 ? 'At Sea' : index % 3 === 1 ? 'At Port' : 'Anchored',
    };
  });
})();

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

// Enhanced Data Quality Cards Component
const DataQualityCards = ({
  data = [],
  onQualityFilter,
  qualityVisible = true,
  onToggleQuality,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const fleetMetrics = useMemo(() => {
    const totalVessels = staticQualityData.length;
    const avgCompleteness =
      staticQualityData.reduce((sum, v) => sum + v.completeness, 0) /
      totalVessels;
    const avgCorrectness =
      staticQualityData.reduce((sum, v) => sum + v.correctness, 0) /
      totalVessels;
    const totalIssues = staticQualityData.reduce(
      (sum, v) => sum + v.issueCount,
      0
    );
    const criticalIssues = staticQualityData.reduce(
      (sum, v) => sum + v.criticalIssues,
      0
    );
    const healthyVessels = staticQualityData.filter(
      (v) => v.overallScore >= 85
    ).length;
    const averageVessels = staticQualityData.filter(
      (v) => v.overallScore >= 70 && v.overallScore < 85
    ).length;
    const poorVessels = staticQualityData.filter(
      (v) => v.overallScore < 70
    ).length;

    return {
      totalVessels,
      avgCompleteness: Math.round(avgCompleteness),
      avgCorrectness: Math.round(avgCorrectness),
      overallHealth: Math.round((avgCompleteness + avgCorrectness) / 2),
      totalIssues,
      criticalIssues,
      healthyVessels,
      averageVessels,
      poorVessels,
    };
  }, []);

  return (
    <div className="space-y-4 mb-6">
      {/* Quality Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fleet Health Score Card */}
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 hover:bg-slate-800/70 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">
                Fleet Health
              </span>
            </div>
            <div className="text-2xl font-bold text-white">
              {fleetMetrics.overallHealth}%
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400">
              {fleetMetrics.healthyVessels} excellent,{' '}
              {fleetMetrics.averageVessels} good, {fleetMetrics.poorVessels}{' '}
              need attention
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full flex">
                <div
                  className="bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${
                      (fleetMetrics.healthyVessels /
                        fleetMetrics.totalVessels) *
                      100
                    }%`,
                  }}
                />
                <div
                  className="bg-yellow-500 transition-all duration-500"
                  style={{
                    width: `${
                      (fleetMetrics.averageVessels /
                        fleetMetrics.totalVessels) *
                      100
                    }%`,
                  }}
                />
                <div
                  className="bg-red-500 transition-all duration-500"
                  style={{
                    width: `${
                      (fleetMetrics.poorVessels / fleetMetrics.totalVessels) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Completeness Card */}
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 hover:bg-slate-800/70 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-slate-300">
                Completeness
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">
              {fleetMetrics.avgCompleteness}%
            </div>
            <div className="text-xs text-slate-400">Average data coverage</div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  fleetMetrics.avgCompleteness >= 85
                    ? 'bg-emerald-500'
                    : fleetMetrics.avgCompleteness >= 70
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${fleetMetrics.avgCompleteness}%` }}
              />
            </div>
          </div>
        </div>

        {/* Data Correctness Card */}
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 hover:bg-slate-800/70 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-slate-300">
                Correctness
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">
              {fleetMetrics.avgCorrectness}%
            </div>
            <div className="text-xs text-slate-400">Validation compliance</div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  fleetMetrics.avgCorrectness >= 85
                    ? 'bg-emerald-500'
                    : fleetMetrics.avgCorrectness >= 70
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${fleetMetrics.avgCorrectness}%` }}
              />
            </div>
          </div>
        </div>

        {/* Active Issues Card */}
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 hover:bg-slate-800/70 transition-all cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-slate-300">
                Active Issues
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-white">
                {fleetMetrics.totalIssues}
              </div>
              {fleetMetrics.criticalIssues > 0 && (
                <div className="text-sm font-medium text-red-400">
                  {fleetMetrics.criticalIssues} critical
                </div>
              )}
            </div>
            <div className="text-xs text-slate-400">
              Across {fleetMetrics.totalVessels} vessels
            </div>
          </div>
        </div>
      </div>

      {/* Quality Controls Bar */}
      <div className="flex items-center justify-between bg-slate-800/30 border border-white/10 rounded-lg p-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleQuality}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              qualityVisible
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-700/50 text-slate-400 border border-white/10 hover:bg-slate-700'
            }`}
          >
            {qualityVisible ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
            Quality Column
          </button>
          <div className="text-xs text-slate-400">Last updated: 2 mins ago</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQualityFilter && onQualityFilter('excellent')}
            className="px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded hover:bg-slate-700 transition-colors"
          >
            Filter High Quality
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const kpiDropdownRef = React.useRef(null);

  React.useEffect(() => {
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

                <div className="p-4 border-b border-white/10">
                  <label className="text-xs font-medium text-slate-300 mb-2 block">
                    Data Source
                  </label>
                  <div className="flex gap-2">
                    {['LF', 'HF', 'COMBINED'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleDataTypeChange(type)}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
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
                    className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setShowKPIDropdown(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors"
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
const TableView = ({ className = '' }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedRows, setSelectedRows] = useState([]);
  const [qualityVisible, setQualityVisible] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Generate sample data with quality issues
  const sampleData = useMemo(() => {
    return staticQualityData.map((vessel, index) => ({
      id: vessel.id,
      vesselName: vessel.name,
      date: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      vesselStatus: vessel.status,
      quality: vessel,
      lf: {
        obs_speed:
          vessel.kpiIssues.obs_speed?.type === 'missing'
            ? null
            : vessel.kpiIssues.obs_speed?.type === 'incorrect'
            ? vessel.kpiIssues.obs_speed.originalValue
            : 12.5 + Math.random() * 8,
        me_consumption:
          vessel.kpiIssues.me_consumption?.type === 'missing'
            ? null
            : vessel.kpiIssues.me_consumption?.type === 'incorrect'
            ? vessel.kpiIssues.me_consumption.originalValue
            : 8.2 + Math.random() * 4,
        total_consumption: 10.5 + Math.random() * 5,
        wind_force:
          vessel.kpiIssues.wind_force?.type === 'missing'
            ? null
            : Math.floor(Math.random() * 8) + 1,
        laden_condition: Math.random() > 0.5 ? 1 : 0,
        me_power:
          vessel.kpiIssues.me_power?.type === 'missing'
            ? null
            : 4200 + Math.random() * 2000,
        me_sfoc: 185 + Math.random() * 15,
        rpm:
          vessel.kpiIssues.rpm?.type === 'missing'
            ? null
            : vessel.kpiIssues.rpm?.type === 'incorrect'
            ? vessel.kpiIssues.rpm.originalValue
            : 85 + Math.random() * 25,
      },
    }));
  }, []);

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

  // Enhanced value display with quality indicators
  const getValueDisplay = (item, kpiId) => {
    const value = item.lf[kpiId];
    const qualityIssue = item.quality.kpiIssues[kpiId];

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
      if (!qualityIssue) return '';
      if (qualityIssue.severity === 'high')
        return 'bg-red-500/15 border border-red-500/25 text-red-200';
      if (qualityIssue.severity === 'medium')
        return 'bg-yellow-500/15 border border-yellow-500/25 text-yellow-200';
      return 'bg-orange-500/15 border border-orange-500/25 text-orange-200';
    };

    const getTooltipMessage = () => {
      if (!qualityIssue) return null;
      if (qualityIssue.type === 'incorrect') {
        if (kpiId === 'obs_speed' && value < 0)
          return 'Negative speed detected - sensor error';
        if (kpiId === 'me_consumption' && value > 30)
          return 'Unusually high consumption - verify reading';
        if (kpiId === 'rpm' && value > 150)
          return 'RPM-speed correlation warning';
      }
      return 'Data quality issue detected';
    };

    return (
      <div className="relative group">
        <span
          className={`text-xs font-semibold rounded px-1 py-0.5 transition-all ${
            qualityIssue ? getQualityStyle() : ''
          }`}
        >
          {formatValue(value)}
          {qualityIssue && (
            <AlertTriangle className="inline w-2.5 h-2.5 ml-1 text-orange-400" />
          )}
        </span>
        {qualityIssue && (
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
        <div className="p-8">
          <DataQualityCards
            data={sampleData}
            qualityVisible={qualityVisible}
            onToggleQuality={() => setQualityVisible(!qualityVisible)}
          />

          {/* Table Container */}
          <div className="bg-slate-800/50 border border-white/10 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/70 border-b border-white/10">
                  <tr>
                    <th className="w-8 px-3 py-3 text-left">
                      <input
                        type="checkbox"
                        className="rounded bg-slate-700 border-slate-600"
                      />
                    </th>
                    <th className="w-40 px-3 py-3 text-left">
                      <button
                        onClick={() => handleSort('vesselName')}
                        className="flex items-center gap-2 text-left text-slate-300 hover:text-white transition-colors group"
                      >
                        <span>Vessel</span>
                        {getSortIcon('vesselName')}
                      </button>
                    </th>
                    <th className="w-28 px-3 py-3 text-left">
                      <button
                        onClick={() => handleSort('date')}
                        className="flex items-center gap-2 text-left text-slate-300 hover:text-white transition-colors group"
                      >
                        <span>Date & Time</span>
                        {getSortIcon('date')}
                      </button>
                    </th>
                    {qualityVisible && (
                      <th className="w-20 px-3 py-3 text-center">
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
                      <th key={kpi.id} className="w-24 px-3 py-3 text-center">
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
                            <sup className="px-1 py-0.5 text-[8px] font-medium rounded-full border bg-blue-500/20 text-blue-300 border-blue-500/30">
                              {kpi.source}
                            </sup>
                            {kpi.unit && (
                              <span className="text-xs font-normal text-slate-500">
                                ({kpi.unit})
                              </span>
                            )}
                          </div>
                        </button>
                      </th>
                    ))}
                    <th className="w-8 px-3 py-3 text-center">
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
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          className="rounded bg-slate-700 border-slate-600"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white text-sm truncate">
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
                      <td className="px-3 py-3">
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
                        <td className="px-3 py-3 text-center">
                          <EnhancedQualityIndicator
                            completeness={item.quality.completeness}
                            correctness={item.quality.correctness}
                            issues={item.quality.issues}
                            size="sm"
                          />
                        </td>
                      )}
                      {currentKPIs.map((kpi) => (
                        <td key={kpi.id} className="px-3 py-3 text-center">
                          {getValueDisplay(item, kpi.id)}
                        </td>
                      ))}
                      <td className="px-3 py-3 text-center">
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

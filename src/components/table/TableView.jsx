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
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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

    // Create predictable issue patterns for demo
    const issuePatterns = [
      { missing: 2, incorrect: 3 }, // Atlantic Pioneer: 5 total
      { missing: 1, incorrect: 1 }, // Pacific Explorer: 2 total
      { missing: 3, incorrect: 2 }, // Nordic Voyager: 5 total
      { missing: 0, incorrect: 4 }, // Baltic Star: 4 total
      { missing: 1, incorrect: 2 }, // Mediterranean Crown: 3 total
      { missing: 2, incorrect: 1 }, // Arctic Wind: 3 total
      { missing: 1, incorrect: 3 }, // Indian Ocean: 4 total
      { missing: 0, incorrect: 2 }, // Caribbean Spirit: 2 total
      { missing: 2, incorrect: 2 }, // Red Sea Navigator: 4 total
      { missing: 1, incorrect: 1 }, // Bering Strait: 2 total
    ];

    const pattern = issuePatterns[index];

    // Add missing data issues
    const kpiList = [
      'wind_force',
      'me_power',
      'rpm',
      'me_consumption',
      'obs_speed',
    ];
    for (let i = 0; i < pattern.missing; i++) {
      const kpi = kpiList[i % kpiList.length];
      kpiIssues[`${kpi}_missing_${i}`] = {
        type: 'missing',
        severity: 'medium',
        kpi,
      };
      issues.push({
        type: 'completeness',
        kpi,
        message: 'Sensor data unavailable',
        severity: 'medium',
      });
    }

    // Add incorrect data issues
    for (let i = 0; i < pattern.incorrect; i++) {
      const kpi = kpiList[i % kpiList.length];
      const severity = i === 0 ? 'high' : i === 1 ? 'medium' : 'low';
      kpiIssues[`${kpi}_incorrect_${i}`] = {
        type: 'incorrect',
        severity,
        kpi,
        originalValue: i === 0 ? -2.5 : i === 1 ? 45.8 : 250,
      };
      issues.push({
        type: 'correctness',
        kpi,
        message:
          i === 0
            ? 'Negative speed detected'
            : i === 1
            ? 'Consumption spike detected'
            : 'RPM-speed correlation warning',
        severity,
      });
    }

    // Calculate quality scores
    const totalKPIs = 8;
    const issueCount = issues.length;
    const highSeverityIssues = issues.filter(
      (issue) => issue.severity === 'high'
    ).length;
    const mediumSeverityIssues = issues.filter(
      (issue) => issue.severity === 'medium'
    ).length;

    const completeness = Math.max(
      40,
      100 - (pattern.missing / totalKPIs) * 100 - Math.random() * 5
    );
    const severityPenalty =
      highSeverityIssues * 30 +
      mediumSeverityIssues * 15 +
      pattern.incorrect * 5;
    const correctness = Math.max(30, 100 - severityPenalty - Math.random() * 5);

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
      confidence: Math.round((completeness + correctness + 85) / 3),
      missingCount: pattern.missing,
      incorrectCount: pattern.incorrect,
      kpiHealth: {
        speed: Math.round(80 + index * 2),
        fuel: Math.round(70 + index * 3),
        engine: Math.round(75 + index * 2.5),
        weather: Math.round(85 + index * 1.5),
      },
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
  selectedVessels = [],
  selectedKPIs = [],
  chartData = [],
  annotationsVisible = true,
  onToggleAnnotations,
  qualityOverlayVisible = false,
  onToggleQualityOverlay,
  viewMode = 'table',
  compactMode = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Calculate fleet metrics
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
    const totalMissingIssues = staticQualityData.reduce(
      (sum, v) => sum + v.missingCount,
      0
    );
    const totalIncorrectIssues = staticQualityData.reduce(
      (sum, v) => sum + v.incorrectCount,
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

    const overallHealth = Math.round((avgCompleteness + avgCorrectness) / 2);
    const dataPoints = data.length * 8; // Assuming 8 KPIs per vessel
    const estimatedMissingPoints = Math.round(
      dataPoints * (1 - avgCompleteness / 100)
    );

    return {
      totalVessels,
      avgCompleteness: Math.round(avgCompleteness),
      avgCorrectness: Math.round(avgCorrectness),
      overallHealth,
      totalIssues,
      criticalIssues,
      totalMissingIssues,
      totalIncorrectIssues,
      healthyVessels,
      averageVessels,
      poorVessels,
      dataPoints,
      estimatedMissingPoints,
      chartReliability: Math.round((overallHealth + 85) / 2),
      timeSeriesHealth: Math.round(85 + Math.random() * 15),
    };
  }, [data]);

  const QualityMeter = ({ score, size = 'sm', type = 'overall' }) => {
    const radius = size === 'sm' ? 14 : size === 'md' ? 18 : 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getColor = () => {
      if (type === 'completeness')
        return score >= 85 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';
      if (type === 'correctness')
        return score >= 85 ? '#8b5cf6' : score >= 70 ? '#f59e0b' : '#ef4444';
      return score >= 85 ? '#06b6d4' : score >= 70 ? '#f59e0b' : '#ef4444';
    };

    return (
      <div
        className={`relative ${
          size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12'
        }`}
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
          <defs>
            <filter id={`glow-${type}-${size}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient
              id={`gradient-${type}-${size}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={getColor()} stopOpacity="1" />
              <stop offset="100%" stopColor={getColor()} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <circle
            cx="20"
            cy="20"
            r={radius}
            stroke="rgba(71, 85, 105, 0.5)"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            stroke={`url(#gradient-${type}-${size})`}
            strokeWidth="2"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            filter={`url(#glow-${type}-${size})`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-bold ${
              size === 'sm'
                ? 'text-xs'
                : size === 'md'
                ? 'text-sm'
                : 'text-base'
            } text-white drop-shadow-sm`}
          >
            {score}
          </span>
        </div>
      </div>
    );
  };

  const QualityDistributionChart = ({ data, type }) => {
    const COLORS = {
      excellent: '#10b981',
      good: '#f59e0b',
      poor: '#ef4444',
    };

    const chartData = [
      {
        name: 'Excellent',
        value: data.healthyVessels,
        color: COLORS.excellent,
      },
      { name: 'Good', value: data.averageVessels, color: COLORS.good },
      { name: 'Needs Attention', value: data.poorVessels, color: COLORS.poor },
    ];

    return (
      <div className="w-16 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={30}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const Card = ({
    children,
    className = '',
    onClick,
    onHover,
    style,
    gradient = 'default',
  }) => {
    const gradients = {
      default:
        'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
      health:
        'linear-gradient(145deg, rgba(6, 182, 212, 0.1) 0%, rgba(30, 41, 59, 0.95) 100%)',
      completeness:
        'linear-gradient(145deg, rgba(16, 185, 129, 0.1) 0%, rgba(30, 41, 59, 0.95) 100%)',
      correctness:
        'linear-gradient(145deg, rgba(139, 92, 246, 0.1) 0%, rgba(30, 41, 59, 0.95) 100%)',
      issues:
        'linear-gradient(145deg, rgba(251, 146, 60, 0.1) 0%, rgba(30, 41, 59, 0.95) 100%)',
    };

    return (
      <div
        className={`relative overflow-hidden rounded-xl border transition-all duration-300 ease-out cursor-pointer ${className}`}
        onClick={onClick}
        onMouseEnter={onHover}
        style={{
          background: gradients[gradient],
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 4px 8px rgba(0, 0, 0, 0.2)
          `,
          transform: 'translateZ(0)',
          ...style,
        }}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
          }}
        />

        {/* Animated glow effect on hover */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
            hoveredCard === gradient ? 'opacity-20' : 'opacity-0'
          }`}
          style={{
            background:
              'radial-gradient(circle at center, rgba(76, 201, 240, 0.3) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10">{children}</div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${compactMode ? 'mb-2' : 'mb-4'}`}>
      {/* Main Quality Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fleet Health Score Card */}
        <Card
          gradient="health"
          className="hover:transform hover:translateY(-2px) hover:scale-[1.01]"
          onHover={() => setHoveredCard('health')}
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-cyan-500/20 border border-cyan-500/30">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-200 block">
                    Fleet Health
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Overall Score
                  </span>
                </div>
              </div>
              <QualityMeter
                score={fleetMetrics.overallHealth}
                size="sm"
                type="overall"
              />
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {fleetMetrics.overallHealth}%
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[10px] text-slate-400">
                  {fleetMetrics.healthyVessels} excellent •{' '}
                  {fleetMetrics.averageVessels} good •{' '}
                  {fleetMetrics.poorVessels} attention needed
                </div>
                <QualityDistributionChart data={fleetMetrics} type="health" />
              </div>

              {/* <div className="text-[10px] text-slate-400">
                {fleetMetrics.healthyVessels} excellent •{' '}
                {fleetMetrics.averageVessels} good • {fleetMetrics.poorVessels}{' '}
                attention needed
              </div> */}

              <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full flex">
                  <div
                    className="bg-emerald-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${
                        (fleetMetrics.healthyVessels /
                          fleetMetrics.totalVessels) *
                        100
                      }%`,
                    }}
                  />
                  <div
                    className="bg-yellow-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${
                        (fleetMetrics.averageVessels /
                          fleetMetrics.totalVessels) *
                        100
                      }%`,
                    }}
                  />
                  <div
                    className="bg-red-500 transition-all duration-1000 ease-out"
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
        </Card>

        {/* Data Completeness Card */}
        <Card
          gradient="completeness"
          className="hover:transform hover:translateY(-2px) hover:scale-[1.01]"
          onHover={() => setHoveredCard('completeness')}
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-emerald-500/20 border border-emerald-500/30">
                  <Database className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-200 block">
                    Completeness
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Data Coverage
                  </span>
                </div>
              </div>
              <QualityMeter
                score={fleetMetrics.avgCompleteness}
                size="sm"
                type="completeness"
              />
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {fleetMetrics.avgCompleteness}%
              </div>

              <div className="flex items-center gap-1.5 text-[10px]">
                <WifiOff className="w-3 h-3 text-orange-400" />
                <span className="text-slate-400">
                  {fleetMetrics.totalMissingIssues} missing data points
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${
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
        </Card>

        {/* Data Correctness Card */}
        <Card
          gradient="correctness"
          className="hover:transform hover:translateY(-2px) hover:scale-[1.01]"
          onHover={() => setHoveredCard('correctness')}
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-purple-500/20 border border-purple-500/30">
                  <Target className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-200 block">
                    Correctness
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Data Accuracy
                  </span>
                </div>
              </div>
              <QualityMeter
                score={fleetMetrics.avgCorrectness}
                size="sm"
                type="correctness"
              />
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {fleetMetrics.avgCorrectness}%
              </div>

              <div className="flex items-center gap-1.5 text-[10px]">
                <XCircle className="w-3 h-3 text-red-400" />
                <span className="text-slate-400">
                  {fleetMetrics.totalIncorrectIssues} incorrect data points
                </span>
              </div>

              <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ease-out ${
                    fleetMetrics.avgCorrectness >= 85
                      ? 'bg-purple-500'
                      : fleetMetrics.avgCorrectness >= 70
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${fleetMetrics.avgCorrectness}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Active Issues Card */}
        <Card
          gradient="issues"
          className="hover:transform hover:translateY(-2px) hover:scale-[1.01]"
          onHover={() => setHoveredCard('issues')}
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-orange-500/20 border border-orange-500/30">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <span className="text-xs font-medium text-slate-200 block">
                    Active Issues
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Quality Alerts
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {fleetMetrics.criticalIssues > 0 && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500/20 border border-red-500/30 rounded-full">
                    <AlertCircle className="w-2.5 h-2.5 text-red-400" />
                    <span className="text-[10px] text-red-400 font-medium">
                      {fleetMetrics.criticalIssues}
                    </span>
                  </div>
                )}
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

              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span className="text-slate-400">
                    {fleetMetrics.totalMissingIssues} missing
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span className="text-slate-400">
                    {fleetMetrics.totalIncorrectIssues} incorrect
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400">
                Across {fleetMetrics.totalVessels} vessels
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced KPI Details Panel */}
      {showDetails && (
        <Card
          gradient="default"
          className="transition-all duration-500 ease-out"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-cyan-400" />
                KPI Reliability Analysis
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1.5 text-slate-400 hover:text-white transition-colors rounded-md hover:bg-slate-700/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  key: 'speed',
                  label: 'Speed Data',
                  icon: Navigation,
                  color: '#4dc3ff',
                  reliability: 85,
                  issues: 3,
                  status: 'good',
                },
                {
                  key: 'fuel',
                  label: 'Fuel Data',
                  icon: Fuel,
                  color: '#2ee086',
                  reliability: 78,
                  issues: 5,
                  status: 'average',
                },
                {
                  key: 'engine',
                  label: 'Engine Data',
                  icon: Activity,
                  color: '#ffd426',
                  reliability: 92,
                  issues: 1,
                  status: 'excellent',
                },
                {
                  key: 'weather',
                  label: 'Weather Data',
                  icon: Waves,
                  color: '#42a5f5',
                  reliability: 88,
                  issues: 2,
                  status: 'good',
                },
              ].map(
                ({
                  key,
                  label,
                  icon: Icon,
                  color,
                  reliability,
                  issues,
                  status,
                }) => (
                  <div
                    key={key}
                    className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-3 transition-all duration-300 hover:border-white/20 hover:scale-[1.02]"
                    style={{
                      boxShadow: '0 3px 12px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="p-1.5 rounded-md"
                        style={{
                          backgroundColor: `${color}20`,
                          border: `1px solid ${color}40`,
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white">
                          {label}
                        </div>
                        <div className="text-xs text-slate-400">
                          {reliability}% reliable
                        </div>
                      </div>
                      <QualityMeter score={reliability} size="sm" type={key} />
                    </div>

                    <div className="space-y-2">
                      <div className="w-full h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ease-out ${
                            reliability >= 85
                              ? 'bg-emerald-500'
                              : reliability >= 70
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${reliability}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          {issues} issues found
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full font-medium ${
                            status === 'excellent'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : status === 'good'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : status === 'average'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    </div>

                    {/* Subtle gradient overlay */}
                    <div
                      className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at top right, ${color}30, transparent 50%)`,
                      }}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Quality Controls Bar */}
      <div className="flex items-center justify-between bg-slate-800/30 border border-white/10 rounded-lg p-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleQuality}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
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
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors bg-slate-700/50 text-slate-400 border border-white/10 hover:bg-slate-700"
          >
            <BarChart2 className="w-3 h-3" />
            {showDetails ? 'Hide' : 'Show'} KPI Details
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
const TableView = ({ className = '' }) => {
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

import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Database,
  Target,
  Gauge,
  BarChart2,
  WifiOff,
  XCircle,
  AlertCircle,
  X,
  Navigation,
  Fuel,
  Activity,
  Waves,
  Minus,
  Eye,
  EyeOff,
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

// Data Quality Cards Component
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
  viewMode = 'charts', // 'charts' or 'table'
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
    const dataPoints =
      chartData.length * selectedVessels.length * selectedKPIs.length;
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
  }, [selectedVessels, selectedKPIs, chartData]);

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

  // Adjust padding and spacing based on mode
  const paddingClass = compactMode ? 'p-3' : 'p-4';
  const spacingClass = compactMode ? 'space-y-3' : 'space-y-4';
  const gapClass = compactMode ? 'gap-3' : 'gap-4';
  const textSizes = compactMode
    ? {
        header: 'text-xs',
        subheader: 'text-[9px]',
        value: compactMode && viewMode === 'table' ? 'text-xl' : 'text-2xl',
        small: 'text-[9px]',
        icon: 'w-3.5 h-3.5',
      }
    : {
        header: 'text-xs',
        subheader: 'text-[10px]',
        value: 'text-2xl',
        small: 'text-[10px]',
        icon: 'w-4 h-4',
      };

  return (
    <div className={`${spacingClass} ${compactMode ? 'mb-2' : 'mb-4'}`}>
      {/* Main Quality Cards Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${gapClass}`}>
        {/* Fleet Health Score Card */}
        <Card
          gradient="health"
          className="hover:transform hover:translateY(-2px) hover:scale-[1.01]"
          onHover={() => setHoveredCard('health')}
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className={paddingClass}>
            <div className={`flex items-center justify-between ${compactMode ? 'mb-2' : 'mb-3'}`}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-cyan-500/20 border border-cyan-500/30">
                  <Gauge className={textSizes.icon + ' text-cyan-400'} />
                </div>
                <div>
                  <span className={`${textSizes.header} font-medium text-slate-200 block`}>
                    Fleet Health
                  </span>
                  <span className={`${textSizes.subheader} text-slate-400`}>
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
              <div className={`${textSizes.value} font-bold text-white`}>
                {fleetMetrics.overallHealth}%
              </div>

              <div className="flex items-center justify-between">
                <div className={textSizes.small + ' text-slate-400'}>
                  {fleetMetrics.healthyVessels} excellent •{' '}
                  {fleetMetrics.averageVessels} good •{' '}
                  {fleetMetrics.poorVessels} attention needed
                </div>
                <QualityDistributionChart data={fleetMetrics} type="health" />
              </div>

              <div className={`w-full ${compactMode ? 'h-1' : 'h-1.5'} bg-slate-700/50 rounded-full overflow-hidden`}>
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
          <div className={paddingClass}>
            <div className={`flex items-center justify-between ${compactMode ? 'mb-2' : 'mb-3'}`}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-emerald-500/20 border border-emerald-500/30">
                  <Database className={textSizes.icon + ' text-emerald-400'} />
                </div>
                <div>
                  <span className={`${textSizes.header} font-medium text-slate-200 block`}>
                    Completeness
                  </span>
                  <span className={`${textSizes.subheader} text-slate-400`}>
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
              <div className={`${textSizes.value} font-bold text-white`}>
                {fleetMetrics.avgCompleteness}%
              </div>

              <div className={`flex items-center gap-1.5 ${textSizes.small}`}>
                <WifiOff className="w-3 h-3 text-orange-400" />
                <span className="text-slate-400">
                  {fleetMetrics.totalMissingIssues} missing data points
                </span>
              </div>

              <div className={`w-full ${compactMode ? 'h-1' : 'h-1.5'} bg-slate-700/50 rounded-full overflow-hidden`}>
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
          <div className={paddingClass}>
            <div className={`flex items-center justify-between ${compactMode ? 'mb-2' : 'mb-3'}`}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-purple-500/20 border border-purple-500/30">
                  <Target className={textSizes.icon + ' text-purple-400'} />
                </div>
                <div>
                  <span className={`${textSizes.header} font-medium text-slate-200 block`}>
                    Correctness
                  </span>
                  <span className={`${textSizes.subheader} text-slate-400`}>
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
              <div className={`${textSizes.value} font-bold text-white`}>
                {fleetMetrics.avgCorrectness}%
              </div>

              <div className={`flex items-center gap-1.5 ${textSizes.small}`}>
                <XCircle className="w-3 h-3 text-red-400" />
                <span className="text-slate-400">
                  {fleetMetrics.totalIncorrectIssues} incorrect data points
                </span>
              </div>

              <div className={`w-full ${compactMode ? 'h-1' : 'h-1.5'} bg-slate-700/50 rounded-full overflow-hidden`}>
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
          <div className={paddingClass}>
            <div className={`flex items-center justify-between ${compactMode ? 'mb-2' : 'mb-3'}`}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-orange-500/20 border border-orange-500/30">
                  <AlertTriangle className={textSizes.icon + ' text-orange-400'} />
                </div>
                <div>
                  <span className={`${textSizes.header} font-medium text-slate-200 block`}>
                    Active Issues
                  </span>
                  <span className={`${textSizes.subheader} text-slate-400`}>
                    Quality Alerts
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {fleetMetrics.criticalIssues > 0 && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-500/20 border border-red-500/30 rounded-full">
                    <AlertCircle className="w-2.5 h-2.5 text-red-400" />
                    <span className={`${textSizes.small} text-red-400 font-medium`}>
                      {fleetMetrics.criticalIssues}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <div className={`${textSizes.value} font-bold text-white`}>
                  {fleetMetrics.totalIssues}
                </div>
                {fleetMetrics.criticalIssues > 0 && (
                  <div className="text-sm font-medium text-red-400">
                    {fleetMetrics.criticalIssues} critical
                  </div>
                )}
              </div>

              <div className={`grid grid-cols-2 gap-1.5 ${textSizes.small}`}>
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

              <div className={`${textSizes.small} text-slate-400`}>
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
          <div className={paddingClass}>
            <div className={`flex items-center justify-between ${compactMode ? 'mb-3' : 'mb-4'}`}>
              <h3 className={`${compactMode ? 'text-base' : 'text-lg'} font-semibold text-white flex items-center gap-2`}>
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

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${compactMode ? 'gap-2' : 'gap-3'}`}>
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
                    className={`relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 ${compactMode ? 'p-2' : 'p-3'} transition-all duration-300 hover:border-white/20 hover:scale-[1.02]`}
                    style={{
                      boxShadow: '0 3px 12px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <div className={`flex items-center gap-2 ${compactMode ? 'mb-1.5' : 'mb-2'}`}>
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
                      <div className={`w-full ${compactMode ? 'h-1' : 'h-1.5'} bg-slate-700/50 rounded-full overflow-hidden`}>
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
      {viewMode === 'table' && (
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
      )}
    </div>
  );
};

// Export the static quality data as well for use in other components
export { staticQualityData };
export default DataQualityCards;
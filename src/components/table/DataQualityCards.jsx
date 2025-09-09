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

// UPDATED: Enhanced static quality data with only 5 vessels and fewer, focused issues
const staticQualityData = (() => {
  const vessels = [
    'Atlantic Pioneer',
    'Pacific Explorer',
    'Nordic Voyager',
    'Baltic Star',
    'Mediterranean Crown',
  ];

  return vessels.map((name, index) => {
    const issues = [];
    const kpiIssues = {};

    // Reduced issue patterns - fewer issues per vessel
    const issuePatterns = [
      { missing: 1, incorrect: 2 }, // Atlantic Pioneer: 1 missing, 2 incorrect
      { missing: 0, incorrect: 1 }, // Pacific Explorer: 0 missing, 1 incorrect
      { missing: 2, incorrect: 1 }, // Nordic Voyager: 2 missing, 1 incorrect  
      { missing: 1, incorrect: 1 }, // Baltic Star: 1 missing, 1 incorrect
      { missing: 0, incorrect: 2 }, // Mediterranean Crown: 0 missing, 2 incorrect
    ];

    const pattern = issuePatterns[index];

    const kpiList = [
      'wind_force',
      'me_power',
      'rpm',
      'me_consumption',
      'obs_speed',
    ];

    // Add missing issues
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

    // Add incorrect issues
    for (let i = 0; i < pattern.incorrect; i++) {
      const kpi = kpiList[(i + pattern.missing) % kpiList.length];
      const severity = i === 0 ? 'high' : 'medium';
      
      let originalValue;
      let message;
      
      // Specific incorrect values based on KPI and vessel
      if (kpi === 'obs_speed') {
        originalValue = -2.5;
        message = 'Negative speed detected';
      } else if (kpi === 'me_consumption') {
        originalValue = 45.8;
        message = 'Consumption spike detected';
      } else if (kpi === 'rpm') {
        originalValue = 250;
        message = 'RPM reading out of range';
      } else if (kpi === 'me_power') {
        originalValue = 12000;
        message = 'Power reading exceeds limits';
      } else {
        originalValue = 15.5;
        message = 'Sensor reading anomaly';
      }
      
      kpiIssues[`${kpi}_incorrect_${i}`] = {
        type: 'incorrect',
        severity,
        kpi,
        originalValue,
        message,
      };
      issues.push({
        type: 'correctness',
        kpi,
        message,
        severity,
      });
    }

    const totalKPIs = 8;
    const highSeverityIssues = issues.filter(issue => issue.severity === 'high').length;
    const mediumSeverityIssues = issues.filter(issue => issue.severity === 'medium').length;

    const completeness = Math.max(40, 100 - (pattern.missing / totalKPIs) * 100 - Math.random() * 5);
    const severityPenalty = highSeverityIssues * 30 + mediumSeverityIssues * 15 + pattern.incorrect * 5;
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
      status: index % 3 === 0 ? 'At Sea' : index % 3 === 1 ? 'At Port' : 'Anchored',
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
  viewMode = 'charts',
  compactMode = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const fleetMetrics = useMemo(() => {
    const totalVessels = staticQualityData.length;
    const avgCompleteness =
      staticQualityData.reduce((sum, v) => sum + v.completeness, 0) / totalVessels;
    const avgCorrectness =
      staticQualityData.reduce((sum, v) => sum + v.correctness, 0) / totalVessels;
    const totalIssues = staticQualityData.reduce((sum, v) => sum + v.issueCount, 0);
    const criticalIssues = staticQualityData.reduce((sum, v) => sum + v.criticalIssues, 0);
    const totalMissingIssues = staticQualityData.reduce((sum, v) => sum + v.missingCount, 0);
    const totalIncorrectIssues = staticQualityData.reduce((sum, v) => sum + v.incorrectCount, 0);
    const healthyVessels = staticQualityData.filter((v) => v.overallScore >= 85).length;
    const averageVessels = staticQualityData.filter(
      (v) => v.overallScore >= 70 && v.overallScore < 85
    ).length;
    const poorVessels = staticQualityData.filter((v) => v.overallScore < 70).length;

    const overallHealth = Math.round((avgCompleteness + avgCorrectness) / 2);
    const dataPoints = chartData.length * selectedVessels.length * selectedKPIs.length;
    const estimatedMissingPoints = Math.round(dataPoints * (1 - avgCompleteness / 100));

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
            stroke="rgba(229, 231, 235, 0.5)"
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
              size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
            } text-gray-900 drop-shadow-sm`}
          >
            {score}
          </span>
        </div>
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
        'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.98) 100%)',
      health:
        'linear-gradient(145deg, rgba(6, 182, 212, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)',
      completeness:
        'linear-gradient(145deg, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)',
      correctness:
        'linear-gradient(145deg, rgba(139, 92, 246, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)',
      issues:
        'linear-gradient(145deg, rgba(251, 146, 60, 0.05) 0%, rgba(255, 255, 255, 0.95) 100%)',
    };

    return (
      <div
        className={`relative overflow-hidden rounded-xl border transition-all duration-300 ease-out cursor-pointer ${className}`}
        onClick={onClick}
        onMouseEnter={onHover}
        style={{
          background: gradients[gradient],
          borderColor: 'rgba(0, 0, 0, 0.1)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8),
            0 4px 8px rgba(0, 0, 0, 0.05)
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
              'radial-gradient(circle at center, rgba(76, 201, 240, 0.1) 0%, transparent 70%)',
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
        {/* UPDATED: Data Quality Index Card - Now follows the same structure as Data Integrity */}
        <Card
          gradient="health"
          className="hover:transform hover:translate-y-[-4px] hover:scale-[1.01] hover:shadow-xl"
          onHover={() => setHoveredCard('health')}
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className={paddingClass}>
            <div className={`flex items-center justify-between ${compactMode ? 'mb-2' : 'mb-3'}`}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-cyan-100 border border-cyan-200">
                  <Gauge className={textSizes.icon + ' text-cyan-600'} />
                </div>
                <div>
                  <span className={`${textSizes.header} font-medium text-gray-800 block`}>
                    Data Quality Index
                  </span>
                  <span className={`${textSizes.subheader} text-gray-600`}>
                    Fleet Score
                  </span>
                </div>
              </div>
              <QualityMeter score={fleetMetrics.overallHealth} size="sm" type="overall" />
            </div>
            <div className="space-y-2">
              <div className={`${textSizes.value} font-bold text-gray-900`}>
                {fleetMetrics.overallHealth}%
              </div>
              <div className={`flex items-center gap-1.5 ${textSizes.small}`}>
                <Gauge className="w-3 h-3 text-cyan-500" />
                <span className="text-gray-600">
                  {fleetMetrics.healthyVessels} vessels with excellent quality
                </span>
              </div>
              <div className={`w-full ${compactMode ? 'h-1' : 'h-1.5'} bg-gray-100/50 rounded-full overflow-hidden`}>
                <div className="h-full flex">
                  <div
                    className="bg-emerald-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${(fleetMetrics.healthyVessels / fleetMetrics.totalVessels) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-yellow-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${(fleetMetrics.averageVessels / fleetMetrics.totalVessels) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-red-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${(fleetMetrics.poorVessels / fleetMetrics.totalVessels) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Integrity Card */}
        <Card
          gradient="completeness"
          className="hover:transform hover:translate-y-[-4px] hover:scale-[1.01] hover:shadow-xl"
          onHover={() => setHoveredCard('completeness')}
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className={paddingClass}>
            <div className={`flex items-center justify-between ${compactMode ? 'mb-2' : 'mb-3'}`}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-emerald-100 border border-emerald-200">
                  <Database className={textSizes.icon + ' text-emerald-600'} />
                </div>
                <div>
                  <span className={`${textSizes.header} font-medium text-gray-800 block`}>
                    Data Integrity
                  </span>
                  <span className={`${textSizes.subheader} text-gray-600`}>
                    Data Coverage
                  </span>
                </div>
              </div>
              <QualityMeter score={fleetMetrics.avgCompleteness} size="sm" type="completeness" />
            </div>
            <div className="space-y-2">
              <div className={`${textSizes.value} font-bold text-gray-900`}>
                {fleetMetrics.avgCompleteness}%
              </div>
              <div className={`flex items-center gap-1.5 ${textSizes.small}`}>
                <WifiOff className="w-3 h-3 text-orange-500" />
                <span className="text-gray-600">
                  {fleetMetrics.totalMissingIssues} missing data points
                </span>
              </div>
              <div className={`w-full ${compactMode ? 'h-1' : 'h-1.5'} bg-gray-100/50 rounded-full overflow-hidden`}>
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

        {/* Accuracy Card */}
        <Card
          gradient="correctness"
          className="hover:transform hover:translate-y-[-4px] hover:scale-[1.01] hover:shadow-xl"
          onHover={() => setHoveredCard('correctness')}
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className={paddingClass}>
            <div className={`flex items-center justify-between ${compactMode ? 'mb-2' : 'mb-3'}`}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-purple-100 border border-purple-200">
                  <Target className={textSizes.icon + ' text-purple-600'} />
                </div>
                <div>
                  <span className={`${textSizes.header} font-medium text-gray-800 block`}>
                    Data Accuracy
                  </span>
                  <span className={`${textSizes.subheader} text-gray-600`}>
                    Data Accuracy
                  </span>
                </div>
              </div>
              <QualityMeter score={fleetMetrics.avgCorrectness} size="sm" type="correctness" />
            </div>
            <div className="space-y-2">
              <div className={`${textSizes.value} font-bold text-gray-900`}>
                {fleetMetrics.avgCorrectness}%
              </div>
              <div className={`flex items-center gap-1.5 ${textSizes.small}`}>
                <XCircle className="w-3 h-3 text-red-600" />
                <span className="text-gray-600">
                  {fleetMetrics.totalIncorrectIssues} incorrect data points
                </span>
              </div>
              <div className={`w-full ${compactMode ? 'h-1' : 'h-1.5'} bg-gray-100/50 rounded-full overflow-hidden`}>
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

        {/* Operational Alerts Card */}
        <Card
          gradient="issues"
          className="hover:transform hover:translate-y-[-4px] hover:scale-[1.01] hover:shadow-xl"
          onHover={() => setHoveredCard('issues')}
          style={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className={paddingClass}>
            <div className={`flex items-center justify-between ${compactMode ? 'mb-2' : 'mb-3'}`}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-orange-100 border border-orange-200">
                  <AlertTriangle className={textSizes.icon + ' text-orange-600'} />
                </div>
                <div>
                  <span className={`${textSizes.header} font-medium text-gray-800 block`}>
                    Operational Alerts
                  </span>
                  <span className={`${textSizes.subheader} text-gray-600`}>
                    Quality Alerts
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {fleetMetrics.criticalIssues > 0 && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-red-100 border border-red-200 rounded-full">
                    <AlertCircle className="w-2.5 h-2.5 text-red-600" />
                    <span className={`${textSizes.small} text-red-600 font-medium`}>
                      {fleetMetrics.criticalIssues}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <div className={`${textSizes.value} font-bold text-gray-900`}>
                  {fleetMetrics.totalIssues}
                </div>
                {fleetMetrics.criticalIssues > 0 && (
                  <div className="text-sm font-medium text-red-600">
                    {fleetMetrics.criticalIssues} critical
                  </div>
                )}
              </div>
              <div className={`flex items-center gap-1.5 ${textSizes.small}`}>
                <AlertTriangle className="w-3 h-3 text-orange-500" />
                <span className="text-gray-600">
                  Across {fleetMetrics.totalVessels} vessels
                </span>
              </div>
              <div className={`w-full ${compactMode ? 'h-1' : 'h-1.5'} bg-gray-100/50 rounded-full overflow-hidden`}>
                <div className="h-full flex">
                  <div
                    className="bg-orange-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${(fleetMetrics.totalMissingIssues / fleetMetrics.totalIssues) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-red-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${(fleetMetrics.totalIncorrectIssues / fleetMetrics.totalIssues) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced KPI Details Panel */}
      {showDetails && (
        <Card gradient="default" className="transition-all duration-500 ease-out">
          <div className={paddingClass}>
            <div className={`flex items-center justify-between ${compactMode ? 'mb-3' : 'mb-4'}`}>
              <h3 className={`${compactMode ? 'text-base' : 'text-lg'} font-semibold text-gray-900 flex items-center gap-2`}>
                <BarChart2 className="w-5 h-5 text-cyan-600" />
                KPI Reliability Analysis
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100/50"
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
              ].map(({ key, label, icon: Icon, color, reliability, issues, status }) => (
                <div
                  key={key}
                  className={`relative overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-white/50 to-gray-50/50 ${
                    compactMode ? 'p-2' : 'p-3'
                  } transition-all duration-300 hover:border-gray-300 hover:scale-[1.02]`}
                  style={{
                    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.05)',
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
                      <div className="text-sm font-medium text-gray-900">{label}</div>
                      <div className="text-xs text-gray-600">{reliability}% reliable</div>
                    </div>
                    <QualityMeter score={reliability} size="sm" type={key} />
                  </div>
                  <div className="space-y-2">
                    <div className={`w-full ${compactMode ? 'h-1' : 'h-1.5'} bg-gray-100/50 rounded-full overflow-hidden`}>
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
                      <span className="text-gray-600">{issues} issues found</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full font-medium ${
                          status === 'excellent'
                            ? 'bg-emerald-100 text-emerald-600'
                            : status === 'good'
                            ? 'bg-cyan-100 text-cyan-600'
                            : status === 'average'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
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
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// Export the static quality data as well for use in other components
export { staticQualityData };
export default DataQualityCards;
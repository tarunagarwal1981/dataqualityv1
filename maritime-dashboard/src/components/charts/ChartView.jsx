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
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Cell,
  PieChart,
  Pie,
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
  EyeOff,
  Shield,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  Eye,
  Info,
  Fuel,
  Navigation,
  Waves,
  Maximize2,
  Minimize2,
  MessageCircle,
  Plus,
  Anchor,
  CloudRain,
  Wrench,
  Flag,
  Edit3,
  Save,
  Calendar,
  Clock,
  User,
  Zap as ZapIcon,
  Gauge,
  CheckSquare,
  Minus,
  WifiOff,
  XCircle,
  AlertCircle,
  Database,
  SignalHigh,
  SignalLow,
  BarChart2,
} from 'lucide-react';

// Mock data and constants
const DATA_TYPES = {
  COMBINED: 'combined',
  LF: 'lf',
  HF: 'hf',
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

// Use same 5 vessels consistently across all charts
const defaultSelectedVessels = sampleVessels.slice(0, 5);

// Annotation Categories
const ANNOTATION_CATEGORIES = {
  PORT: {
    id: 'port',
    name: 'Port Events',
    icon: Anchor,
    color: '#4CC9F0',
    bgColor: 'rgba(76, 201, 240, 0.1)',
    borderColor: 'rgba(76, 201, 240, 0.3)',
  },
  WEATHER: {
    id: 'weather',
    name: 'Weather Events',
    icon: CloudRain,
    color: '#8D8DDA',
    bgColor: 'rgba(141, 141, 218, 0.1)',
    borderColor: 'rgba(141, 141, 218, 0.3)',
  },
  MAINTENANCE: {
    id: 'maintenance',
    name: 'Maintenance',
    icon: Wrench,
    color: '#FFC300',
    bgColor: 'rgba(255, 195, 0, 0.1)',
    borderColor: 'rgba(255, 195, 0, 0.3)',
  },
  ALERT: {
    id: 'alert',
    name: 'Alerts',
    icon: AlertTriangle,
    color: '#F07167',
    bgColor: 'rgba(240, 113, 103, 0.1)',
    borderColor: 'rgba(240, 113, 103, 0.3)',
  },
  PERFORMANCE: {
    id: 'performance',
    name: 'Performance',
    icon: TrendingUp,
    color: '#2ECC71',
    bgColor: 'rgba(46, 204, 113, 0.1)',
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  CUSTOM: {
    id: 'custom',
    name: 'Custom',
    icon: Flag,
    color: '#9B59B6',
    bgColor: 'rgba(155, 89, 182, 0.1)',
    borderColor: 'rgba(155, 89, 182, 0.3)',
  },
};

// Enhanced static quality data with actual issue counts
const staticQualityData = (() => {
  const vessels = [
    'MV Atlantic Pioneer',
    'MV Pacific Navigator',
    'MV Ocean Explorer',
    'MV Global Trader',
    'MV Northern Star',
    'MV Southern Cross',
    'MV Eastern Horizon',
    'MV Western Seeker',
    'MV Coastal Guardian',
    'MV Deepwater Voyager',
  ];

  return vessels.map((name, index) => {
    // Generate specific number of quality issues
    const issues = [];
    const kpiIssues = {};

    // Create predictable issue patterns for demo
    const issuePatterns = [
      { missing: 2, incorrect: 3 }, // Atlantic Pioneer: 5 total
      { missing: 1, incorrect: 1 }, // Pacific Navigator: 2 total
      { missing: 3, incorrect: 2 }, // Ocean Explorer: 5 total
      { missing: 0, incorrect: 4 }, // Global Trader: 4 total
      { missing: 1, incorrect: 2 }, // Northern Star: 3 total
      { missing: 2, incorrect: 1 }, // Southern Cross: 3 total
      { missing: 1, incorrect: 3 }, // Eastern Horizon: 4 total
      { missing: 0, incorrect: 2 }, // Western Seeker: 2 total
      { missing: 2, incorrect: 2 }, // Coastal Guardian: 4 total
      { missing: 1, incorrect: 1 }, // Deepwater Voyager: 2 total
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

// Generate mock annotations data
const generateMockAnnotations = (chartData, selectedVessels, selectedKPIs) => {
  const annotations = [];
  const sampleEvents = [
    { type: 'port', text: 'Departed from Hamburg', vessel: 'vessel_1' },
    { type: 'weather', text: 'Heavy weather conditions', vessel: 'vessel_2' },
    {
      type: 'maintenance',
      text: 'Engine maintenance completed',
      vessel: 'vessel_3',
    },
    {
      type: 'alert',
      text: 'Fuel consumption spike detected',
      vessel: 'vessel_1',
    },
    { type: 'performance', text: 'Optimal speed achieved', vessel: 'vessel_4' },
    { type: 'port', text: 'Arrived at Rotterdam', vessel: 'vessel_2' },
    { type: 'weather', text: 'Fog conditions', vessel: 'vessel_5' },
    { type: 'custom', text: 'Crew change completed', vessel: 'vessel_3' },
  ];

  // Add point annotations
  chartData.forEach((dataPoint, index) => {
    if (index % 3 === 0 && annotations.length < 8) {
      const event = sampleEvents[annotations.length % sampleEvents.length];
      const vesselId =
        selectedVessels[Math.floor(Math.random() * selectedVessels.length)];
      const kpiId =
        selectedKPIs[Math.floor(Math.random() * selectedKPIs.length)];

      annotations.push({
        id: `annotation-${annotations.length}`,
        type: 'point',
        category: event.type,
        date: dataPoint.date,
        vesselId: vesselId,
        kpiId: kpiId,
        text: event.text,
        author: 'Fleet Operator',
        timestamp: new Date().toISOString(),
        x: dataPoint.date,
        y: dataPoint[`${vesselId}_${kpiId}`] || 0,
      });
    }
  });

  // Add range annotations
  if (chartData.length > 5) {
    annotations.push({
      id: 'range-1',
      type: 'range',
      category: 'weather',
      startDate: chartData[2].date,
      endDate: chartData[4].date,
      text: 'Storm period - reduced speed',
      author: 'Weather Team',
      timestamp: new Date().toISOString(),
    });

    annotations.push({
      id: 'range-2',
      type: 'range',
      category: 'maintenance',
      startDate: chartData[Math.floor(chartData.length * 0.6)].date,
      endDate: chartData[Math.floor(chartData.length * 0.8)].date,
      text: 'Scheduled maintenance window',
      author: 'Chief Engineer',
      timestamp: new Date().toISOString(),
    });
  }

  return annotations;
};

// Generate quality zones data
const generateQualityZones = (chartData) => {
  const zones = [];
  let currentZoneStart = 0;

  chartData.forEach((_, index) => {
    if (index > 0 && (index % 3 === 0 || index === chartData.length - 1)) {
      const confidence = 60 + Math.random() * 40;
      zones.push({
        id: `zone-${zones.length}`,
        startDate: chartData[currentZoneStart].date,
        endDate: chartData[index].date,
        confidence: Math.round(confidence),
        issues: confidence < 70 ? ['Data gaps', 'Sensor drift'] : [],
      });
      currentZoneStart = index;
    }
  });

  return zones;
};

// Reusable Data Quality Cards Component
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
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-white">
                  {fleetMetrics.overallHealth}%
                </div>
                <QualityDistributionChart data={fleetMetrics} type="health" />
              </div>

              <div className="text-[10px] text-slate-400">
                {fleetMetrics.healthyVessels} excellent •{' '}
                {fleetMetrics.averageVessels} good • {fleetMetrics.poorVessels}{' '}
                attention needed
              </div>

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
    </div>
  );
};

// Define KPIs with data source information and chart properties
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
  HF: [
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

// Vessel colors for consistency
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

// Helper to get KPI by ID
const getKPIById = (kpiId, dataType) => {
  const kpisForType = ALL_KPIS[dataType.toUpperCase()] || [];
  // Also check in the other data type if not found in the primary one for COMBINED
  if (dataType === DATA_TYPES.COMBINED) {
    const combinedKpis = [...ALL_KPIS.LF, ...ALL_KPIS.HF];
    return combinedKpis.find((kpi) => kpi.id === kpiId);
  }
  return kpisForType.find((kpi) => kpi.id === kpiId);
};

// Get vessel color
const getVesselColor = (vesselId) => {
  const index = sampleVessels.findIndex((v) => v.id === vesselId);
  return VESSEL_COLORS[index % VESSEL_COLORS.length];
};

// Generate mock chart data with quality issues aligned to quality cards
const generateMockChartData = (
  selectedVesselIds,
  selectedKPIs,
  dataType,
  startDate,
  endDate
) => {
  const data = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0];
    const entry = { date: dateString };

    selectedVesselIds.forEach((vesselId, vesselIndex) => {
      selectedKPIs.forEach((kpiId) => {
        const kpiMeta = getKPIById(kpiId, dataType);
        if (!kpiMeta) return;

        // Get vessel quality data to determine issues - this aligns with quality cards
        const vesselQuality =
          staticQualityData[vesselIndex % staticQualityData.length];

        // Check if this specific KPI has issues for this vessel
        const hasKPIIssue = vesselQuality.issues.some(
          (issue) => issue.kpi === kpiId
        );
        const kpiIssues = vesselQuality.issues.filter(
          (issue) => issue.kpi === kpiId
        );

        let value;
        let hasQualityIssue = false;
        let qualityType = 'normal';
        let issueDetails = null;

        // Generate missing data based on actual missing count from quality cards
        const missingDataChance =
          vesselQuality.missingCount > 0 &&
          hasKPIIssue &&
          kpiIssues.some((issue) => issue.type === 'completeness')
            ? 0.3
            : 0;

        if (Math.random() < missingDataChance) {
          value = null;
          hasQualityIssue = true;
          qualityType = 'missing';
          issueDetails = kpiIssues.find(
            (issue) => issue.type === 'completeness'
          );
        } else {
          // Generate base value
          switch (kpiId) {
            case 'obs_speed':
              value =
                10 +
                Math.random() * 5 +
                Math.sin(currentDate.getTime() / (1000 * 60 * 60 * 24)) * 2;
              break;
            case 'me_consumption':
              value =
                20 +
                Math.random() * 10 +
                Math.sin(currentDate.getTime() / (1000 * 60 * 60 * 12)) * 3;
              break;
            case 'total_consumption':
              value =
                25 +
                Math.random() * 15 +
                Math.sin(currentDate.getTime() / (1000 * 60 * 60 * 8)) * 4;
              break;
            case 'wind_force':
              value =
                Math.floor(Math.random() * 8) +
                Math.sin(currentDate.getTime() / (1000 * 60 * 60 * 6)) * 2;
              break;
            case 'me_power':
              value =
                5000 +
                Math.random() * 2000 +
                Math.sin(currentDate.getTime() / (1000 * 60 * 60 * 4)) * 500;
              break;
            case 'me_sfoc':
              value =
                160 +
                Math.random() * 10 +
                Math.sin(currentDate.getTime() / (1000 * 60 * 60 * 24)) * 3;
              break;
            case 'rpm':
              value =
                80 +
                Math.random() * 20 +
                Math.sin(currentDate.getTime() / (1000 * 60 * 60 * 6)) * 5;
              break;
            default:
              value = Math.random() * 100;
          }

          // Check for incorrect data based on actual incorrect count from quality cards
          const incorrectDataChance =
            vesselQuality.incorrectCount > 0 &&
            hasKPIIssue &&
            kpiIssues.some((issue) => issue.type === 'correctness')
              ? 0.2
              : 0;

          if (Math.random() < incorrectDataChance) {
            const incorrectIssue = kpiIssues.find(
              (issue) => issue.type === 'correctness'
            );
            if (incorrectIssue) {
              // Use the specific incorrect value from the issue
              if (
                kpiId === 'obs_speed' &&
                incorrectIssue.message.includes('Negative')
              ) {
                value = -2.5;
              } else if (
                kpiId === 'me_consumption' &&
                incorrectIssue.message.includes('spike')
              ) {
                value = 55;
              } else if (
                kpiId === 'rpm' &&
                incorrectIssue.message.includes('RPM')
              ) {
                value = 250;
              }
              hasQualityIssue = true;
              qualityType = 'incorrect';
              issueDetails = incorrectIssue;
            }
          }
        }

        // Store value and quality metadata
        entry[`${vesselId}_${kpiId}`] =
          value === null ? null : Math.max(0, parseFloat(value.toFixed(2)));
        entry[`${vesselId}_${kpiId}_quality`] = qualityType;
        entry[`${vesselId}_${kpiId}_hasIssue`] = hasQualityIssue;
        entry[`${vesselId}_${kpiId}_issueDetails`] = issueDetails;
        entry[`${vesselId}_${kpiId}_vesselQuality`] = vesselQuality;
      });
    });
    data.push(entry);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
};

// Enhanced Custom Dot Component with better visual indicators
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

  // Missing data indicator - enhanced visibility
  if (value === null || value === undefined) {
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r="5"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeDasharray="2,1.5"
          opacity={0.9}
          style={{
            filter: 'drop-shadow(0 1px 3px rgba(239, 68, 68, 0.3))',
          }}
        />
        <g stroke="#ef4444" strokeWidth="1.5" opacity={0.9}>
          <line x1={cx - 2.5} y1={cy - 2.5} x2={cx + 2.5} y2={cy + 2.5} />
          <line x1={cx - 2.5} y1={cy + 2.5} x2={cx + 2.5} y2={cy - 2.5} />
        </g>
        {/* Subtle pulsing animation */}
        <circle
          cx={cx}
          cy={cy}
          r="7"
          fill="none"
          stroke="#ef4444"
          strokeWidth="0.5"
          opacity={0.3}
        >
          <animate
            attributeName="r"
            values="5;9;5"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.1;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    );
  }

  // Incorrect data indicator - enhanced warning triangle
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
        {/* Warning triangle with gradient */}
        <defs>
          <linearGradient
            id={`warningGradient-${cx}-${cy}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
          <filter id={`glow-${cx}-${cy}`}>
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <polygon
          points={`${cx},${cy - 4} ${cx - 4},${cy + 3} ${cx + 4},${cy + 3}`}
          fill={`url(#warningGradient-${cx}-${cy})`}
          stroke="#fff"
          strokeWidth="0.5"
          style={{
            filter: `url(#glow-${cx}-${cy})`,
          }}
        />

        {/* Exclamation mark */}
        <g fill="#ffffff" fontSize="7" textAnchor="middle" fontWeight="bold">
          <text x={cx} y={cy - 0.5} style={{ fontSize: '9px' }}>
            !
          </text>
        </g>

        {/* Subtle pulsing for high severity */}
        {severity === 'high' && (
          <polygon
            points={`${cx},${cy - 5} ${cx - 5},${cy + 4} ${cx + 5},${cy + 4}`}
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            opacity={0.4}
          >
            <animate
              attributeName="stroke-width"
              values="0.8;2.5;0.8"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.4;0.1;0.4"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </polygon>
        )}
      </g>
    );
  }

  // Normal data dot with enhanced quality indication
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r="3.5"
        fill={stroke}
        stroke="#fff"
        strokeWidth="1.5"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }}
      />
      {/* Quality confidence ring */}
      <circle
        cx={cx}
        cy={cy}
        r="5.5"
        fill="none"
        stroke="#10b981"
        strokeWidth="0.8"
        opacity={0.5}
        strokeDasharray="1.5,1.5"
      />
    </g>
  );
};

// Enhanced Custom Line Component
const QualityLine = ({ points, stroke, strokeWidth, dataKey, data }) => {
  const segments = [];
  let currentSegment = [];

  points.forEach((point, index) => {
    const dataPoint = data[index];
    const value = dataPoint[dataKey];
    const qualityType = dataPoint[`${dataKey}_quality`];

    if (value !== null && value !== undefined) {
      currentSegment.push({ ...point, quality: qualityType });
    } else {
      // Missing data - end current segment
      if (currentSegment.length > 1) {
        segments.push({
          points: [...currentSegment],
          quality: 'normal',
        });
      }
      currentSegment = [];
    }
  });

  // Add final segment
  if (currentSegment.length > 1) {
    segments.push({
      points: currentSegment,
      quality: 'normal',
    });
  }

  return (
    <g>
      <defs>
        <linearGradient
          id={`lineGradient-${dataKey}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor={stroke} stopOpacity="0.8" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.4" />
        </linearGradient>
        <filter id={`lineShadow-${dataKey}`}>
          <feDropShadow
            dx="0"
            dy="1.5"
            stdDeviation="2"
            floodColor="rgba(0,0,0,0.2)"
          />
        </filter>
      </defs>

      {segments.map((segment, index) => {
        const pathData = segment.points.reduce((path, point, i) => {
          return (
            path +
            (i === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`)
          );
        }, '');

        return (
          <path
            key={index}
            d={pathData}
            fill="none"
            stroke={`url(#lineGradient-${dataKey})`}
            strokeWidth={strokeWidth + 0.25}
            style={{
              filter: `url(#lineShadow-${dataKey})`,
            }}
          />
        );
      })}
    </g>
  );
};

// Enhanced Custom Tooltip with quality information
const CustomTooltip = ({
  active,
  payload,
  label,
  annotations = [],
  annotationsVisible = true,
}) => {
  if (active && payload && payload.length) {
    const dateAnnotations = annotations.filter(
      (annotation) => annotation.type === 'point' && annotation.date === label
    );

    return (
      <div
        className="relative bg-slate-800/95 border border-white/20 rounded-lg p-3 shadow-xl backdrop-blur-sm"
        style={{
          background:
            'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
          boxShadow: `
            0 15px 30px rgba(0, 0, 0, 0.3),
            inset 0 0.5px 0 rgba(255, 255, 255, 0.08),
            0 0 15px rgba(76, 201, 240, 0.15)
          `,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/10">
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          <p className="text-xs font-semibold text-white">
            {new Date(label).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        {/* Data Points */}
        <div className="space-y-1.5 max-h-40 overflow-y-auto">
          {payload.map((entry, index) => {
            const [vesselId, kpiId] = entry.dataKey.split('_');
            const vessel = sampleVessels.find((v) => v.id === vesselId);
            const qualityType = entry.payload[`${entry.dataKey}_quality`];
            const hasIssue = entry.payload[`${entry.dataKey}_hasIssue`];
            const issueDetails = entry.payload[`${entry.dataKey}_issueDetails`];
            const vesselQuality =
              entry.payload[`${entry.dataKey}_vesselQuality`];

            if (!vessel) return null;

            return (
              <div key={`item-${index}`} className="group">
                <div className="flex items-center justify-between p-1.5 rounded-md bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-2">
                    {/* Enhanced Quality Indicator */}
                    <div className="relative">
                      {entry.value === null ? (
                        <div className="w-3.5 h-3.5 border border-red-400 border-dashed rounded-full bg-transparent flex items-center justify-center">
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
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{
                              backgroundColor: entry.color,
                              boxShadow: `0 0 6px ${entry.color}30`,
                            }}
                          />
                          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full border border-white/50"></div>
                        </div>
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
                        {vesselQuality && (
                          <div className="flex items-center gap-0.5">
                            <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                            <span className="text-[10px] text-slate-400">
                              Q{vesselQuality.overallScore}%
                            </span>
                          </div>
                        )}
                      </div>

                      {hasIssue && issueDetails && (
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
                        <span className="text-red-400 flex items-center gap-0.5">
                          <X className="w-2.5 h-2.5" />
                          Missing
                        </span>
                      ) : (
                        entry.value
                      )}
                    </span>
                    {entry.value !== null &&
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

        {/* Annotations */}
        {annotationsVisible && dateAnnotations.length > 0 && (
          <div className="border-t border-white/20 pt-2.5 mt-2.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs font-medium text-blue-400">Events</span>
            </div>
            <div className="space-y-1.5">
              {dateAnnotations.map((annotation, index) => {
                const category =
                  ANNOTATION_CATEGORIES[annotation.category.toUpperCase()];
                const Icon = category?.icon || Flag;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-1.5 p-1.5 rounded-md bg-slate-600/30"
                  >
                    <div
                      className="p-1 rounded"
                      style={{
                        backgroundColor: `${category?.color}20`,
                        border: `1px solid ${category?.color}40`,
                      }}
                    >
                      <Icon
                        className="w-2.5 h-2.5"
                        style={{ color: category?.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-300">
                        {annotation.text}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {annotation.author}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tooltip arrow */}
        <div
          className="absolute bottom-0 left-1/2 transform translate-y-full -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid rgba(30, 41, 59, 0.98)',
          }}
        />
      </div>
    );
  }
  return null;
};

// Enhanced Annotation Marker Component
const AnnotationMarker = ({ annotation, onEdit, onDelete }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const category = ANNOTATION_CATEGORIES[annotation.category.toUpperCase()];
  const Icon = category?.icon || Flag;

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-50 cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className="relative w-5 h-5 rounded-full border-1.5 flex items-center justify-center transition-all duration-300 hover:scale-125"
        style={{
          backgroundColor: category?.bgColor,
          borderColor: category?.borderColor,
          color: category?.color,
          boxShadow: `0 3px 10px ${category?.color}30, 0 0 15px ${category?.color}15`,
        }}
      >
        <Icon className="w-3.5 h-3.5" />

        {/* Pulse animation */}
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            backgroundColor: category?.color,
            opacity: 0.2,
          }}
        />
      </div>

      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 w-60 rounded-lg shadow-xl z-50 overflow-hidden"
          style={{
            background:
              'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2.5">
              <div
                className="p-1.5 rounded-md"
                style={{
                  backgroundColor: `${category?.color}20`,
                  border: `1px solid ${category?.color}40`,
                }}
              >
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: category?.color }}
                />
              </div>
              <div>
                <span className="text-sm font-medium text-white block">
                  {category?.name}
                </span>
                <span className="text-xs text-slate-400">
                  {annotation.author}
                </span>
              </div>
            </div>

            <div className="text-sm text-slate-300 mb-2.5 leading-relaxed">
              {annotation.text}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {new Date(annotation.timestamp).toLocaleTimeString()}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onEdit(annotation)}
                  className="p-1 bg-blue-500/20 text-blue-400 rounded-md text-xs hover:bg-blue-500/30 transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDelete(annotation.id)}
                  className="p-1 bg-red-500/20 text-red-400 rounded-md text-xs hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(30, 41, 59, 0.98)',
            }}
          />
        </div>
      )}
    </div>
  );
};

// Enhanced ControlsBar Component
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
  onResetFilters = () => {},
  isApplyingFilters = false,
  onExport = () => {},
  isExporting = false,
  currentView = 'charts',
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
      selectedKPIs: ALL_KPIS[type.toUpperCase()]
        ? ALL_KPIS[type.toUpperCase()].map((kpi) => kpi.id)
        : [], // Handle COMBINED case or empty
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

  const getDataSourceIndicator = (source) => {
    const colors = {
      LF: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      HF: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    };
    return (
      <sup
        className={`ml-1 px-1 py-0.5 text-[9px] font-medium rounded-full border ${colors[source]}`}
      >
        {source}
      </sup>
    );
  };

  return (
    <div
      className="border-b backdrop-blur-md"
      style={{
        background:
          'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div className="flex items-center justify-between w-full p-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-cyan-500/20 border border-cyan-500/30">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Fleet Analytics</h3>
              {/* <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-400">Live Data Stream</span>
              </div> */}
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
              <div
                className="absolute right-0 top-full mt-2 w-80 rounded-lg shadow-xl z-50 overflow-hidden"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%)', // Increased opacity
                  border: '1px solid rgba(255, 255, 255, 0.3)', // Increased border opacity
                  backdropFilter: 'blur(10px)', // Increased blur for better visibility
                }}
              >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <h4 className="text-base font-semibold text-white">
                    Configure KPIs
                  </h4>
                  <button onClick={() => setShowKPIDropdown(false)}>
                    <X className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
                  </button>
                </div>

                <div className="p-4 border-b border-white/10">
                  <label className="text-xs font-medium text-slate-300 mb-2 block">
                    Data Source
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['LF', 'HF', 'COMBINED'].map((type) => (
                      <button
                        key={type}
                        onClick={() => handleDataTypeChange(type)}
                        className={`flex flex-col items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-md transition-all duration-300 ${
                          localFilters.dataType === type
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 scale-105'
                            : 'bg-slate-700/50 text-slate-300 border border-white/10 hover:bg-slate-700 hover:scale-105'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          {type === 'LF' && <Radio className="w-4 h-4" />}
                          {type === 'HF' && <Zap className="w-4 h-4" />}
                          {type === 'COMBINED' && (
                            <Layers className="w-4 h-4" />
                          )}
                        </div>
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 max-h-64 overflow-y-auto">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-slate-300">
                      Select KPIs
                    </label>
                    <span className="text-[10px] text-slate-400 bg-slate-700/50 px-1.5 py-0.5 rounded">
                      {localFilters.selectedKPIs?.length || 0} selected
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(localFilters.dataType === 'COMBINED'
                      ? [...ALL_KPIS.LF, ...ALL_KPIS.HF]
                      : ALL_KPIS[localFilters.dataType.toUpperCase()]
                    ).map((kpi) => (
                      <label
                        key={`${kpi.id}-${kpi.source}`}
                        className="group flex items-center gap-3 p-2.5 rounded-md hover:bg-slate-700/30 cursor-pointer transition-all duration-300"
                      >
                        <input
                          type="checkbox"
                          checked={localFilters.selectedKPIs?.includes(kpi.id)}
                          onChange={() => handleKPISelection(kpi.id)}
                          className="w-3.5 h-3.5 text-emerald-500 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500 focus:ring-1"
                        />
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: kpi.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-white truncate">
                              {kpi.name}
                            </span>
                            {getDataSourceIndicator(kpi.source)}
                          </div>
                          {kpi.unit && (
                            <span className="text-xs text-slate-400">
                              Unit: {kpi.unit}
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-white/10 flex justify-end gap-2.5">
                  <button
                    onClick={() => setShowKPIDropdown(false)}
                    className="px-3.5 py-1.5 text-sm font-medium text-slate-300 bg-slate-700/50 rounded-md hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    className="px-3.5 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
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

// Main ChartView Component
const ChartView = () => {
  const [chartFilters, setChartFilters] = useState({
    dataType: DATA_TYPES.LF,
    selectedKPIs: ALL_KPIS.LF.map((kpi) => kpi.id),
    selectedVessels: defaultSelectedVessels.map((v) => v.id),
    dateRange: (() => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      return { startDate, endDate };
    })(),
  });

  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  // qualityVisible is now always true
  const qualityVisible = true;
  // annotationsVisible and qualityOverlayVisible are now always false
  const annotationsVisible = false;
  const qualityOverlayVisible = false;
  const [isExporting, setIsExporting] = useState(false);

  const handleApplyFilters = (newFilters) => {
    setIsApplyingFilters(true);
    setTimeout(() => {
      setChartFilters(newFilters);
      setIsApplyingFilters(false);
    }, 500);
  };

  const handleResetFilters = () => {
    const initialDateRange = (() => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      return { startDate, endDate };
    })();
    const resetFilters = {
      dataType: DATA_TYPES.LF,
      selectedKPIs: ALL_KPIS.LF.map((kpi) => kpi.id),
      selectedVessels: defaultSelectedVessels.map((v) => v.id),
      dateRange: initialDateRange,
    };
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
      chartFilters.dateRange.endDate
    );
  }, [chartFilters]);

  // Generate annotations and quality zones
  const annotations = useMemo(() => {
    return generateMockAnnotations(
      chartData,
      chartFilters.selectedVessels,
      chartFilters.selectedKPIs
    );
  }, [chartData, chartFilters.selectedVessels, chartFilters.selectedKPIs]);

  const qualityZones = useMemo(() => {
    return generateQualityZones(chartData);
  }, [chartData]);

  const handleAnnotationEdit = (annotation) => {
    console.log('Edit annotation:', annotation);
  };

  const handleAnnotationDelete = (annotationId) => {
    console.log('Delete annotation:', annotationId);
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col">
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
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {' '}
          {/* Reduced padding */}
          <DataQualityCards
            data={chartData}
            qualityVisible={qualityVisible}
            // Removed onToggleQuality prop as qualityVisible is always true
            selectedVessels={chartFilters.selectedVessels}
            selectedKPIs={chartFilters.selectedKPIs}
            chartData={chartData}
            annotationsVisible={annotationsVisible}
            // Removed onToggleAnnotations prop as annotationsVisible is always false
            qualityOverlayVisible={qualityOverlayVisible}
            // Removed onToggleQualityOverlay prop as qualityOverlayVisible is always false
            viewMode="charts"
            compactMode={true}
          />
        </div>

        <div className="px-6 pb-6">
          {chartFilters.selectedKPIs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-56 text-center">
              {' '}
              {/* Reduced height */}
              <BarChart3 className="w-10 h-10 text-slate-500 mb-3" />{' '}
              {/* Reduced icon size */}
              <h3 className="text-base font-semibold text-white mb-1.5">
                {' '}
                {/* Reduced font size */}
                No KPIs Selected
              </h3>
              <p className="text-sm text-slate-400">
                {' '}
                {/* Reduced font size */}
                Please select at least one KPI to display charts.
              </p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-56 text-center">
              {' '}
              {/* Reduced height */}
              <TrendingUp className="w-10 h-10 text-slate-500 mb-3" />{' '}
              {/* Reduced icon size */}
              <h3 className="text-base font-semibold text-white mb-1.5">
                {' '}
                {/* Reduced font size */}
                No Data Available
              </h3>
              <p className="text-sm text-slate-400">
                {' '}
                {/* Reduced font size */}
                No data available for the selected filters. Try adjusting your
                date range or vessel selection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {' '}
              {/* Reduced gap */}
              {chartFilters.selectedKPIs.map((kpiId) => {
                const kpiMeta = getKPIById(kpiId, chartFilters.dataType);
                if (!kpiMeta) return null;

                const kpiAnnotations = annotations.filter(
                  (ann) => ann.type === 'point' && ann.kpiId === kpiId
                );

                const rangeAnnotations = annotations.filter(
                  (ann) => ann.type === 'range'
                );

                // Count quality issues for this KPI across all selected vessels
                const qualityIssues = chartData.reduce((total, dataPoint) => {
                  return (
                    total +
                    chartFilters.selectedVessels.reduce(
                      (vesselTotal, vesselId) => {
                        const hasIssue =
                          dataPoint[`${vesselId}_${kpiId}_hasIssue`];
                        return vesselTotal + (hasIssue ? 1 : 0);
                      },
                      0
                    )
                  );
                }, 0);

                const missingIssues = chartData.reduce((total, dataPoint) => {
                  return (
                    total +
                    chartFilters.selectedVessels.reduce(
                      (vesselTotal, vesselId) => {
                        const value = dataPoint[`${vesselId}_${kpiId}`];
                        return vesselTotal + (value === null ? 1 : 0);
                      },
                      0
                    )
                  );
                }, 0);

                const incorrectIssues = chartData.reduce((total, dataPoint) => {
                  return (
                    total +
                    chartFilters.selectedVessels.reduce(
                      (vesselTotal, vesselId) => {
                        const qualityType =
                          dataPoint[`${vesselId}_${kpiId}_quality`];
                        const hasIssue =
                          dataPoint[`${vesselId}_${kpiId}_hasIssue`];
                        return (
                          vesselTotal +
                          (hasIssue && qualityType === 'incorrect' ? 1 : 0)
                        );
                      },
                      0
                    )
                  );
                }, 0);

                return (
                  <div
                    className="relative group"
                    key={kpiId}
                    style={{
                      background:
                        'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                      borderRadius: '12px' /* Reduced border radius */,
                      boxShadow: `
                        0 15px 30px rgba(0, 0, 0, 0.3),
                        inset 0 0.5px 0 rgba(255, 255, 255, 0.08),
                        0 6px 12px rgba(0, 0, 0, 0.25)
                      `,
                      border:
                        '1px solid rgba(255, 255, 255, 0.08)' /* Reduced border opacity */,
                      transform: 'translateZ(0)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(-3px) translateZ(0) scale(1.01)'; /* Reduced hover effect */
                      e.currentTarget.style.boxShadow = `
                        0 20px 40px rgba(0, 0, 0, 0.4),
                        inset 0 0.8px 0 rgba(255, 255, 255, 0.12),
                        0 10px 20px rgba(0, 0, 0, 0.35),
                        0 0 30px ${kpiMeta.color}15
                      `;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(0) translateZ(0) scale(1)';
                      e.currentTarget.style.boxShadow = `
                        0 15px 30px rgba(0, 0, 0, 0.3),
                        inset 0 0.5px 0 rgba(255, 255, 255, 0.08),
                        0 6px 12px rgba(0, 0, 0, 0.25)
                      `;
                    }}
                  >
                    {/* Subtle gradient overlay for 3D effect */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-50 pointer-events-none" /* Reduced opacity */
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)' /* Reduced opacity */,
                      }}
                    />

                    {/* Animated glow effect */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-15 transition-opacity duration-400 pointer-events-none" /* Reduced opacity and duration */
                      style={{
                        background: `radial-gradient(circle at center, ${kpiMeta.color}30 0%, transparent 70%)` /* Reduced opacity */,
                      }}
                    />

                    <div className="relative p-4">
                      {' '}
                      {/* Reduced padding */}
                      {/* Enhanced Header */}
                      <div className="flex items-center justify-between mb-4">
                        {' '}
                        {/* Reduced margin-bottom */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            {' '}
                            {/* Reduced gap and margin-bottom */}
                            <div
                              className="p-1.5 rounded-md border" /* Reduced padding and border radius */
                              style={{
                                backgroundColor: `${kpiMeta.color}20`,
                                borderColor: `${kpiMeta.color}40`,
                              }}
                            >
                              {kpiMeta.category === 'performance' && (
                                <TrendingUp
                                  className="w-4 h-4" /* Reduced icon size */
                                  style={{ color: kpiMeta.color }}
                                />
                              )}
                              {kpiMeta.category === 'fuel' && (
                                <Fuel
                                  className="w-4 h-4" /* Reduced icon size */
                                  style={{ color: kpiMeta.color }}
                                />
                              )}
                              {kpiMeta.category === 'weather' && (
                                <Waves
                                  className="w-4 h-4" /* Reduced icon size */
                                  style={{ color: kpiMeta.color }}
                                />
                              )}
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white flex items-center gap-2">
                                {' '}
                                {/* Reduced font size and gap */}
                                {kpiMeta.name}
                                <span className="text-sm text-slate-400 font-normal">
                                  ({kpiMeta.unit || 'N/A'})
                                </span>
                              </h3>

                              <div className="flex items-center gap-2 mt-0.5">
                                {' '}
                                {/* Reduced gap and margin-top */}
                                <span
                                  className={`text-xs px-1.5 py-0.5 rounded-full border flex items-center gap-1 ${
                                    /* Reduced padding and gap */
                                    kpiMeta.source === 'LF'
                                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                      : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                                  }`}
                                >
                                  {kpiMeta.source === 'LF' && (
                                    <Radio className="w-2.5 h-2.5" /> /* Reduced icon size */
                                  )}
                                  {kpiMeta.source === 'HF' && (
                                    <Zap className="w-2.5 h-2.5" /> /* Reduced icon size */
                                  )}
                                  {kpiMeta.source}
                                </span>
                                <span className="text-xs text-slate-400 capitalize bg-slate-700/50 px-1.5 py-0.5 rounded-full">
                                  {' '}
                                  {/* Reduced padding */}
                                  {kpiMeta.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Quality Indicators */}
                        <div className="flex items-center gap-1.5">
                          {' '}
                          {/* Reduced gap */}
                          {qualityVisible && (
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs border border-white/10">
                              {' '}
                              {/* Reduced padding and border radius */}
                              <Shield className="w-3.5 h-3.5 text-emerald-400" />{' '}
                              {/* Reduced icon size */}
                              <span className="text-emerald-400 font-medium">
                                Quality
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Quality Summary Bar */}
                      {qualityVisible && qualityIssues > 0 && (
                        <div className="mb-3 p-2.5 rounded-md bg-slate-700/30 border border-white/10">
                          {' '}
                          {/* Reduced padding and border radius */}
                          <div className="flex items-center justify-between mb-1.5">
                            {' '}
                            {/* Reduced margin-bottom */}
                            <span className="text-xs font-medium text-slate-300">
                              Data Quality Issues
                            </span>
                            <span className="text-xs text-slate-400">
                              {qualityIssues} total
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2.5 text-xs">
                            {' '}
                            {/* Reduced gap */}
                            <div className="flex items-center gap-1.5">
                              {' '}
                              {/* Reduced gap */}
                              <WifiOff className="w-2.5 h-2.5 text-orange-400" />{' '}
                              {/* Reduced icon size */}
                              <span className="text-slate-400">
                                {missingIssues} missing
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {' '}
                              {/* Reduced gap */}
                              <XCircle className="w-2.5 h-2.5 text-red-400" />{' '}
                              {/* Reduced icon size */}
                              <span className="text-slate-400">
                                {incorrectIssues} incorrect
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Enhanced Chart Container */}
                      <div className="relative">
                        <ResponsiveContainer width="100%" height={280}>
                          {' '}
                          {/* Reduced height */}
                          <LineChart
                            data={chartData}
                            margin={{
                              top: 10 /* Reduced margin */,
                              right: 10,
                              left: 10,
                              bottom: 10,
                            }}
                          >
                            <defs>
                              {/* Enhanced gradients */}
                              <linearGradient
                                id={`gradient-${kpiId}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor={kpiMeta.color}
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor={kpiMeta.color}
                                  stopOpacity={0.1}
                                />
                              </linearGradient>

                              {/* Glow filters */}
                              <filter
                                id={`glow-${kpiId}`}
                                x="-50%"
                                y="-50%"
                                width="200%"
                                height="200%"
                              >
                                <feGaussianBlur
                                  stdDeviation="2.5" /* Reduced stdDeviation */
                                  result="coloredBlur"
                                />
                                <feMerge>
                                  <feMergeNode in="coloredBlur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>

                              <filter
                                id={`shadow-${kpiId}`}
                                x="-50%"
                                y="-50%"
                                width="200%"
                                height="200%"
                              >
                                <feDropShadow
                                  dx="0"
                                  dy="2.5" /* Reduced dy */
                                  stdDeviation="5" /* Reduced stdDeviation */
                                  floodColor="rgba(0,0,0,0.35)" /* Adjusted floodColor */
                                />
                              </filter>

                              {/* Quality overlay patterns */}
                              {qualityOverlayVisible && (
                                <pattern
                                  id={`qualityPattern-${kpiId}`}
                                  patternUnits="userSpaceOnUse"
                                  width="15" /* Reduced width */
                                  height="15" /* Reduced height */
                                >
                                  <rect
                                    width="15"
                                    height="15"
                                    fill="rgba(76, 201, 240, 0.04)" /* Reduced opacity */
                                  />
                                  <circle
                                    cx="7.5" /* Adjusted cx */
                                    cy="7.5" /* Adjusted cy */
                                    r="0.8" /* Reduced radius */
                                    fill="rgba(76, 201, 240, 0.15)" /* Reduced opacity */
                                  />
                                </pattern>
                              )}
                            </defs>

                            {/* Quality overlay background */}
                            {qualityOverlayVisible && (
                              <rect
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                                fill={`url(#qualityPattern-${kpiId})`}
                                opacity="0.25" /* Reduced opacity */
                              />
                            )}

                            <CartesianGrid
                              strokeDasharray="2 5" /* Adjusted strokeDasharray */
                              stroke="rgba(255, 255, 255, 0.07)" /* Reduced opacity */
                              strokeWidth={0.4} /* Reduced strokeWidth */
                            />

                            {/* Range annotations */}
                            {annotationsVisible &&
                              rangeAnnotations.map((annotation, index) => {
                                const category =
                                  ANNOTATION_CATEGORIES[
                                    annotation.category.toUpperCase()
                                  ];
                                return (
                                  <ReferenceArea
                                    key={`range-annotation-${index}`}
                                    x1={annotation.startDate}
                                    x2={annotation.endDate}
                                    fill={category?.bgColor}
                                    stroke={category?.borderColor}
                                    strokeWidth={0.8} /* Reduced strokeWidth */
                                    strokeDasharray="5 3" /* Adjusted strokeDasharray */
                                    fillOpacity={0.25} /* Reduced fillOpacity */
                                  />
                                );
                              })}

                            {/* Point annotations */}
                            {annotationsVisible &&
                              kpiAnnotations.map((annotation, index) => {
                                const category =
                                  ANNOTATION_CATEGORIES[
                                    annotation.category.toUpperCase()
                                  ];
                                return (
                                  <ReferenceLine
                                    key={`point-annotation-${index}`}
                                    x={annotation.date}
                                    stroke={category?.color}
                                    strokeWidth={1.5} /* Reduced strokeWidth */
                                    strokeDasharray="7 3" /* Adjusted strokeDasharray */
                                    opacity={0.7} /* Reduced opacity */
                                  />
                                );
                              })}

                            <XAxis
                              dataKey="date"
                              tickFormatter={(tick) =>
                                new Date(tick).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              }
                              tick={{
                                fill: '#aab8c8' /* Brighter fill */,
                                fontSize: 10 /* Reduced font size */,
                                fontWeight: 500,
                              }}
                              axisLine={{
                                stroke:
                                  'rgba(255, 255, 255, 0.12)' /* Reduced opacity */,
                                strokeWidth: 0.8 /* Reduced strokeWidth */,
                              }}
                              tickLine={{
                                stroke:
                                  'rgba(255, 255, 255, 0.12)' /* Reduced opacity */,
                                strokeWidth: 0.8 /* Reduced strokeWidth */,
                              }}
                              height={25} /* Reduced height */
                            />

                            <YAxis
                              domain={kpiMeta.yAxisRange || ['auto', 'auto']}
                              tick={{
                                fill: '#aab8c8' /* Brighter fill */,
                                fontSize: 10 /* Reduced font size */,
                                fontWeight: 500,
                              }}
                              axisLine={{
                                stroke:
                                  'rgba(255, 255, 255, 0.12)' /* Reduced opacity */,
                                strokeWidth: 0.8 /* Reduced strokeWidth */,
                              }}
                              tickLine={{
                                stroke:
                                  'rgba(255, 255, 255, 0.12)' /* Reduced opacity */,
                                strokeWidth: 0.8 /* Reduced strokeWidth */,
                              }}
                              width={45} /* Reduced width */
                            />

                            <Tooltip
                              content={
                                <CustomTooltip
                                  annotations={annotations}
                                  annotationsVisible={annotationsVisible}
                                />
                              }
                              cursor={{
                                stroke: kpiMeta.color,
                                strokeWidth: 1.5 /* Reduced strokeWidth */,
                                strokeDasharray:
                                  '3 3' /* Adjusted strokeDasharray */,
                                strokeOpacity: 0.7 /* Reduced opacity */,
                              }}
                            />

                            {/* Enhanced Lines with Quality Indicators */}
                            {chartFilters.selectedVessels.map(
                              (vesselId, index) => {
                                const vesselQuality =
                                  staticQualityData[
                                    index % staticQualityData.length
                                  ];
                                const confidence = vesselQuality
                                  ? vesselQuality.confidence
                                  : 85;

                                return (
                                  <Line
                                    key={`${vesselId}_${kpiId}`}
                                    type="monotone"
                                    dataKey={`${vesselId}_${kpiId}`}
                                    stroke={getVesselColor(vesselId)}
                                    strokeWidth={2.5} /* Reduced strokeWidth */
                                    dot={(props) => (
                                      <QualityDot
                                        {...props}
                                        dataKey={`${vesselId}_${kpiId}`}
                                        stroke={getVesselColor(vesselId)}
                                        qualityVisible={qualityVisible}
                                      />
                                    )}
                                    activeDot={{
                                      r: 7 /* Reduced radius */,
                                      strokeWidth: 2.5 /* Reduced strokeWidth */,
                                      fill: getVesselColor(vesselId),
                                      stroke: '#fff',
                                      style: {
                                        filter: `url(#glow-${kpiId})`,
                                      },
                                    }}
                                    connectNulls={false}
                                    style={{
                                      filter: `url(#shadow-${kpiId})`,
                                    }}
                                  />
                                );
                              }
                            )}
                          </LineChart>
                        </ResponsiveContainer>

                        {/* Enhanced Legend */}
                        <div className="absolute bottom-2.5 left-2.5 bg-slate-800/90 backdrop-blur-sm border border-white/10 rounded-md p-2.5">
                          {' '}
                          {/* Reduced padding and border radius */}
                          <div className="text-xs font-medium text-white mb-1.5">
                            {' '}
                            {/* Reduced margin-bottom */}
                            Vessel Legend
                          </div>
                          <div className="grid grid-cols-1 gap-1 text-xs max-h-20 overflow-y-auto">
                            {' '}
                            {/* Reduced max-height */}
                            {chartFilters.selectedVessels.map(
                              (vesselId, index) => {
                                const vessel = sampleVessels.find(
                                  (v) => v.id === vesselId
                                );
                                const vesselQuality =
                                  staticQualityData[
                                    index % staticQualityData.length
                                  ];
                                return (
                                  <div
                                    key={vesselId}
                                    className="flex items-center gap-1.5" /* Reduced gap */
                                  >
                                    <div
                                      className="w-2.5 h-2.5 rounded-full border border-white/20" /* Reduced size and border */
                                      style={{
                                        backgroundColor:
                                          getVesselColor(vesselId),
                                      }}
                                    />
                                    <span className="text-slate-300 truncate flex-1">
                                      {vessel?.name || vesselId}
                                    </span>
                                    {qualityVisible && vesselQuality && (
                                      <span className="text-slate-400">
                                        Q{vesselQuality.overallScore}%
                                      </span>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>

                        {/* Quality Legend */}
                        {qualityVisible && (
                          <div className="absolute bottom-2.5 right-2.5 bg-slate-800/90 backdrop-blur-sm border border-white/10 rounded-md p-2.5">
                            {' '}
                            {/* Reduced padding and border radius */}
                            <div className="text-xs font-medium text-white mb-1.5">
                              {' '}
                              {/* Reduced margin-bottom */}
                              Data Quality
                            </div>
                            <div className="flex flex-col gap-1.5 text-xs">
                              {' '}
                              {/* Reduced gap */}
                              <div className="flex items-center gap-1.5">
                                {' '}
                                {/* Reduced gap */}
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white/20"></div>{' '}
                                {/* Reduced size and border */}
                                <span className="text-slate-300">Normal</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {' '}
                                {/* Reduced gap */}
                                <div
                                  className="w-2.5 h-2.5 bg-yellow-400" /* Reduced size */
                                  style={{
                                    clipPath:
                                      'polygon(50% 0%, 0% 100%, 100% 100%)',
                                  }}
                                ></div>
                                <span className="text-slate-300">
                                  Incorrect
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {' '}
                                {/* Reduced gap */}
                                <div className="w-2.5 h-2.5 border-1.5 border-red-400 border-dashed rounded-full bg-transparent relative">
                                  {' '}
                                  {/* Reduced size and border */}
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-red-400 text-xs leading-none">
                                      ×
                                    </span>
                                  </div>
                                </div>
                                <span className="text-slate-300">Missing</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Enhanced overlay info */}
                        {/* Removed the quality overlay and annotations overlay info */}
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

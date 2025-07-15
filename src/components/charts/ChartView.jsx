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
} from 'lucide-react';

// Import the shared DataQualityCards component
import DataQualityCards, { staticQualityData } from '../table/DataQualityCards';

// Constants and Data Types
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

// Default selected vessels (first 5)
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

        // Get vessel quality data to determine issues - aligned with quality cards
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

// Chart Components
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

  // Missing data indicator
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
          style={{
            filter: 'drop-shadow(0 1px 3px rgba(239, 68, 68, 0.4))',
          }}
        />
        <g stroke="#ef4444" strokeWidth="2" opacity={0.95}>
          <line x1={cx - 2} y1={cy - 2} x2={cx + 2} y2={cy + 2} />
          <line x1={cx - 2} y1={cy + 2} x2={cx + 2} y2={cy - 2} />
        </g>
        {/* Pulsing animation */}
        <circle
          cx={cx}
          cy={cy}
          r="6"
          fill="none"
          stroke="#ef4444"
          strokeWidth="0.8"
          opacity={0.4}
        >
          <animate
            attributeName="r"
            values="4;8;4"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.4;0.1;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    );
  }

  // Incorrect data indicator
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
        <defs>
          <linearGradient
            id={`warningGradient-${cx}-${cy}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>
          <filter id={`glow-${cx}-${cy}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <polygon
          points={`${cx},${cy - 5} ${cx - 4.5},${cy + 3.5} ${cx + 4.5},${
            cy + 3.5
          }`}
          fill={`url(#warningGradient-${cx}-${cy})`}
          stroke="#fff"
          strokeWidth="1"
          style={{
            filter: `url(#glow-${cx}-${cy})`,
          }}
        />

        {/* Exclamation mark */}
        <g fill="#ffffff" fontSize="8" textAnchor="middle" fontWeight="bold">
          <text x={cx} y={cy} style={{ fontSize: '10px' }}>
            !
          </text>
        </g>

        {/* Enhanced pulsing for high severity */}
        {severity === 'high' && (
          <polygon
            points={`${cx},${cy - 6} ${cx - 5.5},${cy + 4.5} ${cx + 5.5},${
              cy + 4.5
            }`}
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            opacity={0.5}
          >
            <animate
              attributeName="stroke-width"
              values="1.2;3;1.2"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.5;0.1;0.5"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </polygon>
        )}
      </g>
    );
  }

  // Normal data dot
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
      {/* Quality confidence ring */}
      <circle
        cx={cx}
        cy={cy}
        r="6"
        fill="none"
        stroke="#10b981"
        strokeWidth="1"
        opacity={0.6}
        strokeDasharray="2,2"
      >
        <animate
          attributeName="r"
          values="6;7;6"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0.3;0.6"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
};

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
          <stop offset="0%" stopColor={stroke} stopOpacity="1" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.6" />
        </linearGradient>
        <filter id={`lineShadow-${dataKey}`}>
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="rgba(0,0,0,0.3)"
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
            strokeWidth={strokeWidth + 0.5}
            style={{
              filter: `url(#lineShadow-${dataKey})`,
            }}
          />
        );
      })}
    </g>
  );
};

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
        className="relative bg-slate-800/98 border border-white/25 rounded-lg p-3 shadow-2xl backdrop-blur-md"
        style={{
          background:
            'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 20px rgba(76, 201, 240, 0.2)
          `,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-white/15">
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
                <div className="flex items-center justify-between p-1.5 rounded-md bg-slate-700/40 hover:bg-slate-700/60 transition-colors">
                  <div className="flex items-center gap-2">
                    {/* Quality Indicator */}
                    <div className="relative">
                      {entry.value === null ? (
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
                          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full border border-white/60"></div>
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
        className="relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-125"
        style={{
          backgroundColor: category?.bgColor,
          borderColor: category?.borderColor,
          color: category?.color,
          boxShadow: `0 4px 12px ${category?.color}40, 0 0 20px ${category?.color}20`,
        }}
      >
        <Icon className="w-3.5 h-3.5" />

        {/* Pulse animation */}
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            backgroundColor: category?.color,
            opacity: 0.3,
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

// Controls Bar Component
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
        : [],
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
      <div className="flex items-center justify-between w-full p-1">
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
const ChartView = ({ 
  initialVesselId = null, // New prop for initial vessel selection
  className = ''
}) => {
  const getInitialFilters = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    // If initialVesselId is provided, use only that vessel
    // Otherwise, use default selected vessels
    const selectedVessels = initialVesselId 
      ? [initialVesselId] 
      : defaultSelectedVessels.map((v) => v.id);

    return {
      dataType: DATA_TYPES.LF,
      selectedKPIs: ALL_KPIS.LF.map((kpi) => kpi.id),
      selectedVessels: selectedVessels,
      dateRange: { startDate, endDate },
    };
  };

  const [chartFilters, setChartFilters] = useState(getInitialFilters());
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const qualityVisible = true;
  const annotationsVisible = false;
  const qualityOverlayVisible = false;
  const [isExporting, setIsExporting] = useState(false);

  // Update filters when initialVesselId changes
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
        <div className="p-1">
          <DataQualityCards
            data={chartData}
            qualityVisible={qualityVisible}
            selectedVessels={chartFilters.selectedVessels}
            selectedKPIs={chartFilters.selectedKPIs}
            chartData={chartData}
            annotationsVisible={annotationsVisible}
            qualityOverlayVisible={qualityOverlayVisible}
            viewMode="charts"
            compactMode={true}
          />
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
                        'linear-gradient(145deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
                      borderRadius: '10px',
                      boxShadow: `
                        0 12px 25px rgba(0, 0, 0, 0.35),
                        inset 0 1px 0 rgba(255, 255, 255, 0.12),
                        0 5px 10px rgba(0, 0, 0, 0.3)
                      `,
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      transform: 'translateZ(0)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(-2px) translateZ(0) scale(1.005)';
                      e.currentTarget.style.boxShadow = `
                        0 18px 35px rgba(0, 0, 0, 0.45),
                        inset 0 1.5px 0 rgba(255, 255, 255, 0.15),
                        0 8px 16px rgba(0, 0, 0, 0.4),
                        0 0 25px ${kpiMeta.color}20
                      `;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(0) translateZ(0) scale(1)';
                      e.currentTarget.style.boxShadow = `
                        0 12px 25px rgba(0, 0, 0, 0.35),
                        inset 0 1px 0 rgba(255, 255, 255, 0.12),
                        0 5px 10px rgba(0, 0, 0, 0.3)
                      `;
                    }}
                  >
                    {/* Subtle gradient overlay for 3D effect */}
                    <div
                      className="absolute inset-0 rounded-lg opacity-60 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                      }}
                    />

                    {/* Animated glow effect */}
                    <div
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${kpiMeta.color}40 0%, transparent 70%)`,
                      }}
                    />

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
                                <span className="text-xs text-slate-400 capitalize bg-slate-700/50 px-1 py-0.5 rounded-full">
                                  {kpiMeta.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Quality Indicators */}
                        {qualityVisible && qualityIssues > 0 && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-700/40 border border-white/10 text-xs">
                            <Shield className="w-3 h-3 text-emerald-400" />
                            <span className="text-slate-300">
                              {qualityIssues} Issues:
                            </span>
                            <span className="flex items-center gap-0.5 text-orange-400">
                              <WifiOff className="w-2.5 h-2.5" />
                              {missingIssues}
                            </span>
                            <span className="flex items-center gap-0.5 text-red-400">
                              <XCircle className="w-2.5 h-2.5" />
                              {incorrectIssues}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Chart Container */}
                      <div className="relative">
                        <ResponsiveContainer width="100%" height={220}>
                          <LineChart
                            data={chartData}
                            margin={{
                              top: -5,
                              right: 5,
                              left: 5,
                              bottom: -5,
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
                                  stopOpacity={0.9}
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
                                  stdDeviation="3"
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
                                  dy="3"
                                  stdDeviation="6"
                                  floodColor="rgba(0,0,0,0.4)"
                                />
                              </filter>

                              {/* Quality overlay patterns */}
                              {qualityOverlayVisible && (
                                <pattern
                                  id={`qualityPattern-${kpiId}`}
                                  patternUnits="userSpaceOnUse"
                                  width="20"
                                  height="20"
                                >
                                  <rect
                                    width="20"
                                    height="20"
                                    fill="rgba(76, 201, 240, 0.05)"
                                  />
                                  <circle
                                    cx="10"
                                    cy="10"
                                    r="1"
                                    fill="rgba(76, 201, 240, 0.2)"
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
                                opacity="0.3"
                              />
                            )}

                            <CartesianGrid
                              strokeDasharray="3 6"
                              stroke="rgba(255, 255, 255, 0.1)"
                              strokeWidth={0.6}
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
                                    strokeWidth={1}
                                    strokeDasharray="6 4"
                                    fillOpacity={0.3}
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
                                    strokeWidth={2}
                                    strokeDasharray="8 4"
                                    opacity={0.8}
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
                                fill: '#cbd5e1',
                                fontSize: 11,
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
                              height={30}
                            />

                            <YAxis
                              domain={kpiMeta.yAxisRange || ['auto', 'auto']}
                              tick={{
                                fill: '#cbd5e1',
                                fontSize: 11,
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
                              width={50}
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
                                strokeWidth: 2,
                                strokeDasharray: '4 4',
                                strokeOpacity: 0.8,
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
                                    strokeWidth={3}
                                    dot={(props) => (
                                      <QualityDot
                                        {...props}
                                        dataKey={`${vesselId}_${kpiId}`}
                                        stroke={getVesselColor(vesselId)}
                                        qualityVisible={qualityVisible}
                                      />
                                    )}
                                    activeDot={{
                                      r: 8,
                                      strokeWidth: 3,
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

                        {/* Quality Legend */}
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
                                  clipPath:
                                    'polygon(50% 0%, 0% 100%, 100% 100%)',
                                }}
                              ></div>
                              <span className="text-slate-300">Incorrect</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <div className="w-2 h-2 border-2 border-red-400 border-dashed rounded-full bg-transparent relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-red-400 text-[9px] leading-none">
                                    ×
                                  </span>
                                </div>
                              </div>
                              <span className="text-slate-300">Missing</span>
                            </div>
                          </div>
                        )}

                        {/* Vessel Legend */}
                        <div className="mt-2 p-1.5">
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] justify-center">
                            {chartFilters.selectedVessels.map((vesselId) => {
                              const vessel = sampleVessels.find(
                                (v) => v.id === vesselId
                              );
                              return (
                                <div
                                  key={vesselId}
                                  className="flex items-center gap-1"
                                >
                                  <div
                                    className="w-2 h-2 rounded-full border border-white/30"
                                    style={{
                                      backgroundColor: getVesselColor(vesselId),
                                      boxShadow: `0 0 4px ${getVesselColor(
                                        vesselId
                                      )}40`,
                                    }}
                                  />
                                  <span className="text-slate-300">
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
import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Ship,
  Database,
  Shield,
  Activity,
  Eye,
  EyeOff,
  Info,
  RefreshCw,
  Target,
  AlertCircle,
  CheckSquare,
  X,
  Gauge,
  Navigation,
  Fuel,
  Waves,
} from 'lucide-react';

// Static quality data that won't change on re-renders
const STATIC_QUALITY_DATA = [
  {
    id: 1,
    name: 'Atlantic Pioneer',
    completeness: 95,
    correctness: 92,
    issues: 1,
  },
  {
    id: 2,
    name: 'Pacific Explorer',
    completeness: 91,
    correctness: 88,
    issues: 2,
  },
  {
    id: 3,
    name: 'Nordic Voyager',
    completeness: 88,
    correctness: 90,
    issues: 1,
  },
  { id: 4, name: 'Baltic Star', completeness: 82, correctness: 78, issues: 3 },
  {
    id: 5,
    name: 'Mediterranean Crown',
    completeness: 79,
    correctness: 81,
    issues: 2,
  },
  { id: 6, name: 'Arctic Wind', completeness: 76, correctness: 74, issues: 4 },
  { id: 7, name: 'Indian Ocean', completeness: 85, correctness: 83, issues: 2 },
  {
    id: 8,
    name: 'Caribbean Spirit',
    completeness: 77,
    correctness: 79,
    issues: 3,
  },
  {
    id: 9,
    name: 'Red Sea Navigator',
    completeness: 65,
    correctness: 58,
    issues: 6,
  },
  {
    id: 10,
    name: 'Bering Strait',
    completeness: 52,
    correctness: 61,
    issues: 7,
  },
];

const DataQualityCards = ({
  data = [],
  onQualityFilter,
  qualityVisible = true,
  onToggleQuality,
  className = '',
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [qualityFilter, setQualityFilter] = useState(null);

  // Calculate fleet metrics from static data
  const fleetMetrics = useMemo(() => {
    const totalVessels = STATIC_QUALITY_DATA.length;
    const avgCompleteness = Math.round(
      STATIC_QUALITY_DATA.reduce((sum, v) => sum + v.completeness, 0) /
        totalVessels
    );
    const avgCorrectness = Math.round(
      STATIC_QUALITY_DATA.reduce((sum, v) => sum + v.correctness, 0) /
        totalVessels
    );
    const totalIssues = STATIC_QUALITY_DATA.reduce(
      (sum, v) => sum + v.issues,
      0
    );
    const criticalIssues = Math.floor(totalIssues / 3);

    const healthyVessels = STATIC_QUALITY_DATA.filter(
      (v) => (v.completeness + v.correctness) / 2 >= 85
    ).length;
    const averageVessels = STATIC_QUALITY_DATA.filter((v) => {
      const score = (v.completeness + v.correctness) / 2;
      return score >= 70 && score < 85;
    }).length;
    const poorVessels = STATIC_QUALITY_DATA.filter(
      (v) => (v.completeness + v.correctness) / 2 < 70
    ).length;

    return {
      totalVessels,
      avgCompleteness,
      avgCorrectness,
      overallHealth: Math.round((avgCompleteness + avgCorrectness) / 2),
      totalIssues,
      criticalIssues,
      healthyVessels,
      averageVessels,
      poorVessels,
    };
  }, []);

  const getQualityColor = (score) => {
    if (score >= 85)
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 70)
      return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const handleQualityFilterClick = (filterType) => {
    const newFilter = qualityFilter === filterType ? null : filterType;
    setQualityFilter(newFilter);
    if (onQualityFilter) {
      onQualityFilter(newFilter);
    }
  };

  return (
    <div className={`space-y-4 mb-6 ${className}`}>
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
            <div className="flex items-center gap-1">
              <Minus className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">
              {fleetMetrics.overallHealth}%
            </div>
            <div className="text-xs text-slate-400">
              {fleetMetrics.healthyVessels} excellent,{' '}
              {fleetMetrics.averageVessels} good, {fleetMetrics.poorVessels}{' '}
              need attention
            </div>

            {/* Mini quality distribution bar */}
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
            <div className="flex items-center gap-1">
              <Minus className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">
              {fleetMetrics.avgCompleteness}%
            </div>
            <div className="text-xs text-slate-400">Average data coverage</div>

            {/* Progress bar */}
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
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">Rules</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">
              {fleetMetrics.avgCorrectness}%
            </div>
            <div className="text-xs text-slate-400">Validation compliance</div>

            {/* Progress bar */}
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
            <div className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">Live</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">
              {fleetMetrics.totalIssues}
            </div>
            {fleetMetrics.criticalIssues > 0 && (
              <div className="text-sm font-medium text-red-400">
                {fleetMetrics.criticalIssues} critical
              </div>
            )}
            <div className="text-xs text-slate-400">
              Across {fleetMetrics.totalVessels} vessels
            </div>

            {/* Issue distribution */}
            <div className="flex items-center gap-2 text-xs">
              {fleetMetrics.criticalIssues > 0 && (
                <span className="text-red-400">
                  {fleetMetrics.criticalIssues} critical
                </span>
              )}
              <span className="text-orange-400">
                {fleetMetrics.totalIssues - fleetMetrics.criticalIssues}{' '}
                warnings
              </span>
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
            onClick={() => handleQualityFilterClick('excellent')}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              qualityFilter === 'excellent'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Filter High Quality
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded hover:bg-slate-700 transition-colors"
          >
            <Info className="w-3 h-3" />
            {showDetails ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>

      {/* Expanded Details Panel */}
      {showDetails && (
        <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Quality Details by Vessel
            </h3>
            <button
              onClick={() => setShowDetails(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Vessel Quality Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {STATIC_QUALITY_DATA.map((vessel) => {
              const overallScore = Math.round(
                (vessel.completeness + vessel.correctness) / 2
              );
              return (
                <div
                  key={vessel.id}
                  className={`p-2 rounded-md border cursor-pointer transition-all hover:scale-105 ${getQualityColor(
                    overallScore
                  )}`}
                  title={`${vessel.name}: ${overallScore}% overall quality`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Ship className="w-3 h-3" />
                    <span className="text-xs font-medium truncate">
                      {vessel.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{overallScore}%</span>
                    {vessel.issues > 0 && (
                      <span className="text-xs text-orange-400">
                        {vessel.issues}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* KPI Health Summary */}
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-medium text-white mb-3">
              KPI Data Quality
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  key: 'speed',
                  label: 'Speed & Navigation',
                  icon: Navigation,
                  color: 'text-blue-400',
                  score: 87,
                },
                {
                  key: 'fuel',
                  label: 'Fuel Systems',
                  icon: Fuel,
                  color: 'text-green-400',
                  score: 82,
                },
                {
                  key: 'engine',
                  label: 'Engine Performance',
                  icon: Activity,
                  color: 'text-purple-400',
                  score: 79,
                },
                {
                  key: 'weather',
                  label: 'Weather Data',
                  icon: Waves,
                  color: 'text-cyan-400',
                  score: 91,
                },
              ].map(({ key, label, icon: Icon, color, score }) => (
                <div
                  key={key}
                  className="flex items-center gap-2 p-2 bg-slate-700/30 rounded"
                >
                  <Icon className={`w-3 h-3 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white truncate">
                      {label}
                    </div>
                    <div className="text-xs text-slate-400">
                      {score}% healthy
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataQualityCards;

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Shield,
  Database,
  Zap,
  Eye,
  EyeOff,
  Settings,
  RefreshCw,
  Bell,
  BellOff,
  Info,
  X,
  ChevronDown,
  ChevronUp,
  Gauge,
  Target,
  Award,
  Flag,
  Users,
  Circle,
  Dot,
  Ship,
  Anchor,
  Waves,
  MapPin,
  Navigation,
  Fuel,
  Package,
  Calendar,
} from 'lucide-react';

// Mock vessel data - matching your table structure
const VESSEL_DATA = [
  {
    id: 'vessel_1',
    name: 'MV Atlantic Pioneer',
    type: 'Container Ship',
    flag: 'Liberia',
  },
  {
    id: 'vessel_2',
    name: 'MV Pacific Navigator',
    type: 'Bulk Carrier',
    flag: 'Panama',
  },
  {
    id: 'vessel_3',
    name: 'MV Ocean Explorer',
    type: 'Tanker',
    flag: 'Marshall Islands',
  },
  {
    id: 'vessel_4',
    name: 'MV Global Trader',
    type: 'Container Ship',
    flag: 'Singapore',
  },
  {
    id: 'vessel_5',
    name: 'MV Arctic Wind',
    type: 'Bulk Carrier',
    flag: 'Norway',
  },
  {
    id: 'vessel_6',
    name: 'MV Mediterranean Star',
    type: 'Tanker',
    flag: 'Malta',
  },
  {
    id: 'vessel_7',
    name: 'MV Baltic Express',
    type: 'Container Ship',
    flag: 'Germany',
  },
  {
    id: 'vessel_8',
    name: 'MV Caribbean Pearl',
    type: 'Cruise Ship',
    flag: 'Bahamas',
  },
  {
    id: 'vessel_9',
    name: 'MV Indian Ocean',
    type: 'Bulk Carrier',
    flag: 'India',
  },
  { id: 'vessel_10', name: 'MV Red Sea Voyager', type: 'Tanker', flag: 'UAE' },
];

// Quality grades
const QUALITY_GRADES = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  ACCEPTABLE: 'acceptable',
  POOR: 'poor',
};

// Generate realistic quality data
const generateQualityData = () => {
  return VESSEL_DATA.map((vessel) => {
    const score = Math.random() * 100;
    const completeness = Math.max(60, Math.random() * 100);
    const correctness = Math.max(70, Math.random() * 100);
    const timeliness = Math.max(80, Math.random() * 100);

    let grade;
    if (score >= 95) grade = QUALITY_GRADES.EXCELLENT;
    else if (score >= 85) grade = QUALITY_GRADES.GOOD;
    else if (score >= 70) grade = QUALITY_GRADES.ACCEPTABLE;
    else grade = QUALITY_GRADES.POOR;

    return {
      ...vessel,
      score: Math.round(score),
      completeness: Math.round(completeness),
      correctness: Math.round(correctness),
      timeliness: Math.round(timeliness),
      grade,
      issues: Math.floor(Math.random() * 5),
      lastUpdate: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      trend: ['improving', 'stable', 'degrading'][
        Math.floor(Math.random() * 3)
      ],
    };
  });
};

const SmartDataQualityPanel = ({
  qualityMetrics = {},
  qualityTrends = {},
  alerts = [],
  qualitySettings = { enableRealTimeChecks: true, notifications: true },
  onUpdateSettings = () => {},
  onDismissAlert = () => {},
  onClearAllAlerts = () => {},
  dataType = 'lf',
  className = '',
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'vessels', 'trends'

  // Generate mock data
  const vesselQualityData = useMemo(() => generateQualityData(), []);

  // Calculate overall metrics
  const overallMetrics = useMemo(() => {
    const scores = vesselQualityData.map((v) => v.score);
    const completeness = vesselQualityData.map((v) => v.completeness);
    const correctness = vesselQualityData.map((v) => v.correctness);

    return {
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      avgCompleteness: Math.round(
        completeness.reduce((a, b) => a + b, 0) / completeness.length
      ),
      avgCorrectness: Math.round(
        correctness.reduce((a, b) => a + b, 0) / correctness.length
      ),
      totalIssues: vesselQualityData.reduce((sum, v) => sum + v.issues, 0),
    };
  }, [vesselQualityData]);

  // Calculate distribution
  const distribution = useMemo(() => {
    return vesselQualityData.reduce((acc, vessel) => {
      acc[vessel.grade] = (acc[vessel.grade] || 0) + 1;
      return acc;
    }, {});
  }, [vesselQualityData]);

  const getStatusColor = (score) => {
    if (score >= 95) return { color: 'success', class: 'badge-success' };
    if (score >= 85) return { color: 'info', class: 'badge-info' };
    if (score >= 70) return { color: 'warning', class: 'badge-warning' };
    return { color: 'danger', class: 'badge-danger' };
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-3 h-3 text-emerald-400" />;
      case 'degrading':
        return <TrendingDown className="w-3 h-3 text-red-400" />;
      default:
        return <Minus className="w-3 h-3 text-slate-400" />;
    }
  };

  const getVesselIcon = (type) => {
    switch (type) {
      case 'Container Ship':
        return Ship;
      case 'Bulk Carrier':
        return Package;
      case 'Tanker':
        return Fuel;
      case 'Cruise Ship':
        return Users;
      default:
        return Ship;
    }
  };

  return (
    <div className={`smart-quality-panel ${className}`}>
      {/* Compact Header */}
      <div className="quality-header">
        <div className="header-left">
          <div
            className={`quality-icon ${
              getStatusColor(overallMetrics.avgScore).class
            }`}
          >
            <Shield className="icon" />
            {overallMetrics.totalIssues > 0 && (
              <div className="issue-badge">
                <span className="issue-count">
                  {overallMetrics.totalIssues > 9
                    ? '9+'
                    : overallMetrics.totalIssues}
                </span>
              </div>
            )}
          </div>
          <div className="header-info">
            <h3 className="quality-title">Data Quality</h3>
            <p className="quality-subtitle">
              {dataType.toUpperCase()} • {VESSEL_DATA.length} Vessels
            </p>
          </div>
        </div>

        <div className="header-right">
          {/* Overall Score */}
          <div
            className={`score-badge ${
              getStatusColor(overallMetrics.avgScore).class
            }`}
          >
            <span className="score-text">{overallMetrics.avgScore}%</span>
          </div>

          {/* View Mode Toggle */}
          <div className="view-toggle">
            {['overview', 'vessels', 'trends'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`view-btn ${viewMode === mode ? 'active' : ''}`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          {/* Expand Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="expand-btn"
          >
            <ChevronDown
              className={`expand-icon ${showDetails ? 'rotated' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="quality-body">
        {viewMode === 'overview' && (
          <div className="overview-content">
            {/* Key Metrics Row */}
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-icons">
                  <Database className="w-3 h-3 text-blue-400" />
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="metric-value">
                  {overallMetrics.avgCompleteness}%
                </div>
                <div className="metric-label">Complete</div>
              </div>

              <div className="metric-item">
                <div className="metric-icons">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="metric-value">
                  {overallMetrics.avgCorrectness}%
                </div>
                <div className="metric-label">Accurate</div>
              </div>

              <div className="metric-item">
                <div className="metric-icons">
                  <Users className="w-3 h-3 text-purple-400" />
                  <Award className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="metric-value">
                  {(distribution.excellent || 0) + (distribution.good || 0)}
                </div>
                <div className="metric-label">Healthy</div>
              </div>

              <div className="metric-item">
                <div className="metric-icons">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  {overallMetrics.totalIssues > 0 ? (
                    <XCircle className="w-3 h-3 text-red-400" />
                  ) : (
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                  )}
                </div>
                <div className="metric-value">{overallMetrics.totalIssues}</div>
                <div className="metric-label">Issues</div>
              </div>
            </div>

            {/* Quality Distribution */}
            <div className="distribution-section">
              <div className="distribution-header">
                <span>Fleet Quality Distribution</span>
                <span>{VESSEL_DATA.length} vessels</span>
              </div>
              <div className="distribution-bar">
                <div
                  className="dist-excellent"
                  style={{
                    width: `${
                      ((distribution.excellent || 0) / VESSEL_DATA.length) * 100
                    }%`,
                  }}
                />
                <div
                  className="dist-good"
                  style={{
                    width: `${
                      ((distribution.good || 0) / VESSEL_DATA.length) * 100
                    }%`,
                  }}
                />
                <div
                  className="dist-acceptable"
                  style={{
                    width: `${
                      ((distribution.acceptable || 0) / VESSEL_DATA.length) *
                      100
                    }%`,
                  }}
                />
                <div
                  className="dist-poor"
                  style={{
                    width: `${
                      ((distribution.poor || 0) / VESSEL_DATA.length) * 100
                    }%`,
                  }}
                />
              </div>
              <div className="distribution-legend">
                <div className="legend-item">
                  <div className="legend-dot excellent"></div>
                  <span>Excellent ({distribution.excellent || 0})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot good"></div>
                  <span>Good ({distribution.good || 0})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot acceptable"></div>
                  <span>Fair ({distribution.acceptable || 0})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot poor"></div>
                  <span>Poor ({distribution.poor || 0})</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'vessels' && (
          <div className="vessels-content">
            {vesselQualityData.map((vessel) => {
              const Icon = getVesselIcon(vessel.type);
              const statusColor = getStatusColor(vessel.score);

              return (
                <div
                  key={vessel.id}
                  className="vessel-item"
                  onClick={() =>
                    setSelectedVessel(
                      selectedVessel === vessel.id ? null : vessel.id
                    )
                  }
                >
                  <div className="vessel-left">
                    <div className={`vessel-icon ${statusColor.class}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="vessel-info">
                      <div className="vessel-name">{vessel.name}</div>
                      <div className="vessel-type">{vessel.type}</div>
                    </div>
                  </div>
                  <div className="vessel-right">
                    {getTrendIcon(vessel.trend)}
                    <span className={`vessel-score ${statusColor.color}`}>
                      {vessel.score}%
                    </span>
                    {vessel.issues > 0 && (
                      <div className="vessel-issues">
                        <span>{vessel.issues}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'trends' && (
          <div className="trends-content">
            <div className="trends-grid">
              <div className="trend-section">
                <h4 className="trend-title improving">
                  <TrendingUp className="w-3 h-3" />
                  Improving (
                  {
                    vesselQualityData.filter((v) => v.trend === 'improving')
                      .length
                  }
                  )
                </h4>
                <div className="trend-list">
                  {vesselQualityData
                    .filter((v) => v.trend === 'improving')
                    .slice(0, 3)
                    .map((vessel) => (
                      <div key={vessel.id} className="trend-item">
                        <span className="trend-vessel-name">{vessel.name}</span>
                        <span className="trend-change positive">
                          +{Math.floor(Math.random() * 5) + 1}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="trend-section">
                <h4 className="trend-title degrading">
                  <TrendingDown className="w-3 h-3" />
                  Needs Attention (
                  {
                    vesselQualityData.filter((v) => v.trend === 'degrading')
                      .length
                  }
                  )
                </h4>
                <div className="trend-list">
                  {vesselQualityData
                    .filter((v) => v.trend === 'degrading')
                    .slice(0, 3)
                    .map((vessel) => (
                      <div key={vessel.id} className="trend-item">
                        <span className="trend-vessel-name">{vessel.name}</span>
                        <span className="trend-change negative">
                          -{Math.floor(Math.random() * 3) + 1}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="quality-details">
          <div className="details-content">
            {/* Critical Issues */}
            {overallMetrics.totalIssues > 0 && (
              <div className="issues-section">
                <div className="section-header">
                  <h4 className="section-title">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Critical Issues ({Math.min(3, overallMetrics.totalIssues)})
                  </h4>
                  <button onClick={onClearAllAlerts} className="resolve-btn">
                    Resolve All
                  </button>
                </div>
                <div className="issues-list">
                  {vesselQualityData
                    .filter((v) => v.issues > 0)
                    .slice(0, 3)
                    .map((vessel) => (
                      <div key={vessel.id} className="issue-item">
                        <div className="issue-left">
                          <XCircle className="w-3 h-3 text-red-400" />
                          <span className="issue-text">
                            {vessel.name}: Data validation failed
                          </span>
                        </div>
                        <div className="issue-right">
                          <span className="issue-count-text">
                            {vessel.issues} issues
                          </span>
                          <button className="dismiss-btn">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Settings */}
            <div className="settings-section">
              <h4 className="section-title">
                <Settings className="w-4 h-4 text-purple-400" />
                Quality Settings
              </h4>
              <div className="settings-grid">
                <div className="setting-item">
                  <span className="setting-label">Real-time Monitoring</span>
                  <button
                    onClick={() =>
                      onUpdateSettings({
                        enableRealTimeChecks:
                          !qualitySettings.enableRealTimeChecks,
                      })
                    }
                    className={`toggle-switch ${
                      qualitySettings.enableRealTimeChecks ? 'active' : ''
                    }`}
                  >
                    <span className="toggle-slider" />
                  </button>
                </div>
                <div className="setting-item">
                  <span className="setting-label">Alert Notifications</span>
                  <button
                    onClick={() =>
                      onUpdateSettings({
                        notifications: !qualitySettings.notifications,
                      })
                    }
                    className={`toggle-switch ${
                      qualitySettings.notifications ? 'active' : ''
                    }`}
                  >
                    <span className="toggle-slider" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .smart-quality-panel {
          background: var(--bg-gradient-1);
          border: 1px solid var(--border-subtle);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-md);
          transition: var(--transition-normal);
          overflow: hidden;
        }

        .smart-quality-panel:hover {
          box-shadow: var(--shadow-lg), 0 0 15px rgba(77, 195, 255, 0.1);
          border-color: var(--border-accent);
        }

        .quality-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-subtle);
          background: linear-gradient(180deg, var(--card-bg), var(--card-dark));
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .quality-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .quality-icon .icon {
          width: 16px;
          height: 16px;
          color: white;
        }

        .issue-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 12px;
          height: 12px;
          background: var(--danger-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .issue-count {
          font-size: 8px;
          font-weight: bold;
          color: white;
        }

        .header-info {
          display: flex;
          flex-direction: column;
        }

        .quality-title {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-light);
        }

        .quality-subtitle {
          margin: 0;
          font-size: 11px;
          color: var(--text-muted);
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .score-badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }

        .score-text {
          color: white;
        }

        .view-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          border: 1px solid var(--border-subtle);
          overflow: hidden;
        }

        .view-btn {
          padding: 4px 8px;
          font-size: 10px;
          font-weight: 500;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .view-btn.active {
          background: var(--primary-accent);
          color: white;
        }

        .view-btn:hover:not(.active) {
          color: var(--text-light);
        }

        .expand-btn {
          width: 24px;
          height: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .expand-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .expand-icon {
          width: 14px;
          height: 14px;
          color: var(--text-light);
          transition: transform 0.2s ease;
        }

        .expand-icon.rotated {
          transform: rotate(180deg);
        }

        .quality-body {
          padding: 16px;
        }

        .overview-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .metric-item {
          text-align: center;
        }

        .metric-icons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          margin-bottom: 4px;
        }

        .metric-value {
          font-size: 18px;
          font-weight: bold;
          color: var(--text-light);
        }

        .metric-label {
          font-size: 11px;
          color: var(--text-muted);
        }

        .distribution-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .distribution-header {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-muted);
        }

        .distribution-bar {
          display: flex;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          background: var(--card-dark);
        }

        .dist-excellent {
          background: var(--success-color);
          transition: width 0.3s ease;
        }

        .dist-good {
          background: var(--info-color);
          transition: width 0.3s ease;
        }

        .dist-acceptable {
          background: var(--warning-color);
          transition: width 0.3s ease;
        }

        .dist-poor {
          background: var(--danger-color);
          transition: width 0.3s ease;
        }

        .distribution-legend {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-dot.excellent {
          background: var(--success-color);
        }

        .legend-dot.good {
          background: var(--info-color);
        }

        .legend-dot.acceptable {
          background: var(--warning-color);
        }

        .legend-dot.poor {
          background: var(--danger-color);
        }

        .vessels-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 240px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--primary-accent-light) transparent;
        }

        .vessels-content::-webkit-scrollbar {
          width: 4px;
        }

        .vessels-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .vessels-content::-webkit-scrollbar-thumb {
          background: var(--primary-accent-light);
          border-radius: 2px;
        }

        .vessel-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          background: var(--card-dark);
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .vessel-item:hover {
          background: var(--card-bg);
        }

        .vessel-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 0;
        }

        .vessel-icon {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vessel-info {
          min-width: 0;
          flex: 1;
        }

        .vessel-name {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-light);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vessel-type {
          font-size: 10px;
          color: var(--text-muted);
        }

        .vessel-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .vessel-score {
          font-size: 11px;
          font-weight: 600;
        }

        .vessel-score.success {
          color: var(--success-color);
        }

        .vessel-score.info {
          color: var(--info-color);
        }

        .vessel-score.warning {
          color: var(--warning-color);
        }

        .vessel-score.danger {
          color: var(--danger-color);
        }

        .vessel-issues {
          width: 16px;
          height: 16px;
          background: var(--danger-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: bold;
          color: white;
        }

        .trends-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .trends-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .trend-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .trend-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 600;
          margin: 0;
        }

        .trend-title.improving {
          color: var(--success-color);
        }

        .trend-title.degrading {
          color: var(--danger-color);
        }

        .trend-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .trend-item {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: var(--text-light);
        }

        .trend-vessel-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .trend-change {
          font-weight: 600;
        }

        .trend-change.positive {
          color: var(--success-color);
        }

        .trend-change.negative {
          color: var(--danger-color);
        }

        .quality-details {
          border-top: 1px solid var(--border-subtle);
          background: var(--card-dark);
        }

        .details-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .issues-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-light);
          margin: 0;
        }

        .resolve-btn {
          font-size: 10px;
          color: var(--success-color);
          background: none;
          border: none;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .resolve-btn:hover {
          color: var(--text-light);
        }

        .issues-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 120px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--primary-accent-light) transparent;
        }

        .issues-list::-webkit-scrollbar {
          width: 3px;
        }

        .issues-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .issues-list::-webkit-scrollbar-thumb {
          background: var(--primary-accent-light);
          border-radius: 2px;
        }

        .issue-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px;
          background: var(--card-bg);
          border-radius: 4px;
        }

        .issue-left {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
          min-width: 0;
        }

        .issue-text {
          font-size: 10px;
          color: var(--text-light);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .issue-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .issue-count-text {
          font-size: 10px;
          color: var(--danger-color);
        }

        .dismiss-btn {
          width: 16px;
          height: 16px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: 2px;
          transition: var(--transition-fast);
        }

        .dismiss-btn:hover {
          background: var(--card-dark);
          color: var(--text-light);
        }

        .settings-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .setting-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px;
          background: var(--card-bg);
          border-radius: 4px;
        }

        .setting-label {
          font-size: 10px;
          color: var(--text-light);
        }

        .toggle-switch {
          position: relative;
          width: 32px;
          height: 16px;
          background: var(--border-subtle);
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .toggle-switch.active {
          background: var(--success-color);
        }

        .toggle-slider {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          transition: var(--transition-fast);
        }

        .toggle-switch.active .toggle-slider {
          transform: translateX(16px);
        }

        .badge-success {
          background: linear-gradient(to bottom, rgba(46, 224, 134, 0.15), rgba(46, 224, 134, 0.1));
          color: var(--success-color);
          border: 1px solid rgba(46, 224, 134, 0.3);
        }

        .badge-info {
          background: linear-gradient(to bottom, rgba(77, 195, 255, 0.15), rgba(77, 195, 255, 0.1));
          color: var(--primary-accent);
          border: 1px solid rgba(77, 195, 255, 0.3);
        }

        .badge-warning {
          background: linear-gradient(to bottom, rgba(255, 212, 38, 0.15), rgba(255, 212, 38, 0.1));
          color: var(--warning-color);
          border: 1px solid rgba(255, 212, 38, 0.3);
        }

        .badge-danger {
          background: linear-gradient(to bottom, rgba(255, 82, 82, 0.15), rgba(255, 82, 82, 0.1));
          color: var(--danger-color);
          border: 1px solid rgba(255, 82, 82, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }

          .trends-grid {
            grid-template-columns: 1fr;
          }

          .settings-grid {
            grid-template-columns: 1fr;
          }

          .view-toggle {
            display: none;
          }

          .distribution-legend {
            flex-direction: column;
            gap: 4px;
          }
        }

        @media (max-width: 480px) {
          .header-left {
            gap: 8px;
          }

          .quality-icon {
            width: 24px;
            height: 24px;
          }

          .quality-icon .icon {
            width: 12px;
            height: 12px;
          }

          .metrics-grid {
            grid-template-columns: 1fr 1fr;
          }

          .metric-value {
            font-size: 14px;
          }

          .metric-label {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default SmartDataQualityPanel;

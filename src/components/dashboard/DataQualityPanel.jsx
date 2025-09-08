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
        return <TrendingUp className="w-3 h-3 text-emerald-600" />;
      case 'degrading':
        return <TrendingDown className="w-3 h-3 text-red-600" />;
      default:
        return <Minus className="w-3 h-3 text-gray-600" />;
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
                  <Database className="w-3 h-3 text-blue-600" />
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                </div>
                <div className="metric-value">
                  {overallMetrics.avgCompleteness}%
                </div>
                <div className="metric-label">Complete</div>
              </div>

              <div className="metric-item">
                <div className="metric-icons">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                </div>
                <div className="metric-value">
                  {overallMetrics.avgCorrectness}%
                </div>
                <div className="metric-label">Accurate</div>
              </div>

              <div className="metric-item">
                <div className="metric-icons">
                  <Users className="w-3 h-3 text-purple-600" />
                  <Award className="w-3 h-3 text-emerald-600" />
                </div>
                <div className="metric-value">
                  {(distribution.excellent || 0) + (distribution.good || 0)}
                </div>
                <div className="metric-label">Healthy</div>
              </div>

              <div className="metric-item">
                <div className="metric-icons">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  {overallMetrics.totalIssues > 0 ? (
                    <XCircle className="w-3 h-3 text-red-600" />
                  ) : (
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
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
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
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
                          <XCircle className="w-3 h-3 text-red-600" />
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
                <Settings className="w-4 h-4 text-purple-600" />
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
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: var(--border-radius-md);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: 0.3s;
          overflow: hidden;
        }

        .smart-quality-panel:hover {
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1), 0 0 15px rgba(77, 195, 255, 0.1);
          border-color: rgba(0, 0, 0, 0.2);
        }

        .quality-header {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          background: linear-gradient(180deg, #f8fafc, #ffffff);
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
          color: white;
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
          background: #ff5252;
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
          color: #374151;
        }

        .quality-subtitle {
          margin: 0;
          font-size: 11px;
          color: #6b7280;
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
          color: inherit;
        }

        .view-toggle {
          display: flex;
          background: #f3f4f6;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .view-btn {
          padding: 4px 8px;
          font-size: 10px;
          font-weight: 500;
          background: transparent;
          border: none;
          color: #6b7280;
          cursor: pointer;
          transition: 0.15s;
        }

        .view-btn.active {
          background: #3b82f6;
          color: white;
        }

        .view-btn:hover:not(.active) {
          color: #374151;
        }

        .expand-btn {
          width: 24px;
          height: 24px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.15s;
        }

        .expand-btn:hover {
          background: #e5e7eb;
        }

        .expand-icon {
          width: 14px;
          height: 14px;
          color: #374151;
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
          color: #374151;
        }

        .metric-label {
          font-size: 11px;
          color: #6b7280;
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
          color: #6b7280;
        }

        .distribution-bar {
          display: flex;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          background: #f3f4f6;
        }

        .dist-excellent {
          background: #28a745;
          transition: width 0.3s ease;
        }

        .dist-good {
          background: #17a2b8;
          transition: width 0.3s ease;
        }

        .dist-acceptable {
          background: #ffc107;
          transition: width 0.3s ease;
        }

        .dist-poor {
          background: #dc3545;
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
          color: #6b7280;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-dot.excellent {
          background: #28a745;
        }

        .legend-dot.good {
          background: #17a2b8;
        }

        .legend-dot.acceptable {
          background: #ffc107;
        }

        .legend-dot.poor {
          background: #dc3545;
        }

        .vessels-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 240px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #88bbff transparent;
        }

        .vessels-content::-webkit-scrollbar {
          width: 4px;
        }

        .vessels-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .vessels-content::-webkit-scrollbar-thumb {
          background: #88bbff;
          border-radius: 2px;
        }

        .vessel-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          background: #f8fafc;
          border-radius: 6px;
          cursor: pointer;
          transition: 0.15s;
        }

        .vessel-item:hover {
          background: #e5e7eb;
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
          color: white;
        }

        .vessel-info {
          min-width: 0;
          flex: 1;
        }

        .vessel-name {
          font-size: 11px;
          font-weight: 500;
          color: #374151;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vessel-type {
          font-size: 10px;
          color: #6b7280;
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
          color: #28a745;
        }

        .vessel-score.info {
          color: #17a2b8;
        }

        .vessel-score.warning {
          color: #ffc107;
        }

        .vessel-score.danger {
          color: #dc3545;
        }

        .vessel-issues {
          width: 16px;
          height: 16px;
          background: #dc3545;
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
          color: #28a745;
        }

        .trend-title.degrading {
          color: #dc3545;
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
          color: #374151;
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
          color: #28a745;
        }

        .trend-change.negative {
          color: #dc3545;
        }

        .quality-details {
          border-top: 1px solid rgba(0, 0, 0, 0.1);
          background: #f8fafc;
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
          color: #374151;
          margin: 0;
        }

        .resolve-btn {
          font-size: 10px;
          color: #28a745;
          background: none;
          border: none;
          cursor: pointer;
          transition: 0.15s;
        }

        .resolve-btn:hover {
          color: #374151;
        }

        .issues-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 120px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #88bbff transparent;
        }

        .issues-list::-webkit-scrollbar {
          width: 3px;
        }

        .issues-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .issues-list::-webkit-scrollbar-thumb {
          background: #88bbff;
          border-radius: 2px;
        }

        .issue-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px;
          background: #ffffff;
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
          color: #374151;
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
          color: #dc3545;
        }

        .dismiss-btn {
          width: 16px;
          height: 16px;
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          border-radius: 2px;
          transition: 0.15s;
        }

        .dismiss-btn:hover {
          background: #e5e7eb;
          color: #374151;
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
          background: #ffffff;
          border-radius: 4px;
        }

        .setting-label {
          font-size: 10px;
          color: #374151;
        }

        .toggle-switch {
          position: relative;
          width: 32px;
          height: 16px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: 0.15s;
        }

        .toggle-switch.active {
          background: #28a745;
        }

        .toggle-slider {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          transition: 0.15s;
        }

        .toggle-switch.active .toggle-slider {
          transform: translateX(16px);
        }

        .badge-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .badge-info {
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }

        .badge-warning {
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeeba;
        }

        .badge-danger {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
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
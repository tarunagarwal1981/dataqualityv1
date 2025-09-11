import React, { useState } from 'react';
import {
  Bell,
  Settings,
  RefreshCw,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ship,
  Database,
  BarChart3,
} from 'lucide-react';
import { APP_CONFIG } from '../../utils/constants.js';

const Header = ({
  vessels = [],
  filteredData = [],
  selectedKPIs = [],
  isRefreshing = false,
  lastUpdated = null,
  onRefresh = () => {},
  qualityScore = 0,
  alertCount = 0,
  onDismissAlert = () => {},
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Calculate header statistics
  const stats = {
    totalVessels: vessels.length,
    activeRecords: filteredData.length,
    selectedKPIs: selectedKPIs.length,
    qualityStatus: getQualityStatus(qualityScore),
  };

  // Format last updated time
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return 'Never';

    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50 shadow-depth-1">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo and Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Enhanced Logo with 3D Effect */}
            <div className="relative group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-depth-3 hover:shadow-depth-4 transition-all duration-300 hover:scale-105">
                <span className="text-white font-bold text-xl tracking-tight">OE</span>
              </div>
              {/* Enhanced connection indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-3 border-white shadow-depth-1 animate-pulse"></div>
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
            </div>

            {/* Enhanced Brand Typography */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {APP_CONFIG.name}
              </h1>
              <p className="text-sm text-gray-600 font-medium tracking-wide">
                {APP_CONFIG.subtitle}
              </p>
            </div>
          </div>

          {/* Enhanced Statistics Overview */}
          <div className="hidden lg:flex items-center gap-8 pl-8 border-l border-gray-200/50">
            <StatCard
              icon={Ship}
              label="Vessels"
              value={stats.totalVessels}
              color="text-blue-600"
            />
            <StatCard
              icon={Database}
              label="Records"
              value={stats.activeRecords}
              color="text-emerald-600"
            />
            <StatCard
              icon={BarChart3}
              label="KPIs"
              value={stats.selectedKPIs}
              color="text-purple-600"
            />
            <QualityIndicator
              score={qualityScore}
              status={stats.qualityStatus}
            />
          </div>
        </div>

        {/* Right Section - Controls and Status */}
        <div className="flex items-center gap-3">
          {/* Last Updated */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-200">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-700 font-medium">
              {formatLastUpdated(lastUpdated)}
            </span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-3 rounded-xl transition-all duration-200 border ${
              isRefreshing
                ? 'bg-gray-100/50 border-gray-200/50 cursor-not-allowed'
                : 'hover:bg-gray-100/50 border-gray-200/50 hover:border-gray-300'
            }`}
            title="Refresh data"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-700 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 hover:bg-gray-100/50 rounded-xl transition-all duration-200 border border-gray-200/50 hover:border-gray-300"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {alertCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {alertCount > 9 ? '9+' : alertCount}
                  </span>
                </div>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-600">
                    {alertCount} active alerts
                  </p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {alertCount > 0 ? (
                    <div className="p-2">
                      {/* Sample notifications - would be populated from alerts */}
                      <NotificationItem
                        icon={AlertTriangle}
                        title="Data Quality Alert"
                        message="3 vessels showing incomplete data"
                        time="5m ago"
                        severity="warning"
                        onDismiss={() => {}}
                      />
                      <NotificationItem
                        icon={TrendingUp}
                        title="Performance Update"
                        message="Fuel efficiency improved by 2.3%"
                        time="1h ago"
                        severity="info"
                        onDismiss={() => {}}
                      />
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                      <p className="text-gray-900 font-medium">All clear!</p>
                      <p className="text-gray-500 text-sm">
                        No active notifications
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-3 hover:bg-gray-100/50 rounded-xl transition-all duration-200 border border-gray-200/50 hover:border-gray-300">
            <Settings className="w-5 h-5 text-gray-700" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100/50 rounded-xl transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-sm font-medium text-gray-900">
                AD
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900">Admin User</div>
                <div className="text-xs text-gray-600">Fleet Manager</div>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center text-lg font-bold text-gray-900">
                      AD
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Admin User</div>
                      <div className="text-sm text-gray-600">
                        admin@oceaneye.com
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 rounded-lg transition-colors">
                      Preferences
                    </button>
                    <hr className="border-gray-200" />
                    <button className="w-full text-left px-3 py-2 text-red-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Enhanced Stat Card Component with 3D Effects
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="text-center group cursor-pointer">
    <div className="flex items-center justify-center mb-2 p-3 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50 shadow-depth-1 hover:shadow-depth-2 transition-all duration-300 hover:scale-105">
      <Icon className={`w-5 h-5 ${color} mr-2 transition-transform duration-300 group-hover:scale-110`} />
      <div className={`text-2xl font-bold ${color} tracking-tight`}>{value}</div>
    </div>
    <div className="text-xs text-gray-600 font-semibold tracking-wide uppercase">{label}</div>
  </div>
);

// Quality Indicator Component
const QualityIndicator = ({ score, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-emerald-600';
      case 'good':
        return 'text-green-600';
      case 'fair':
        return 'text-amber-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-1">
        <Activity className={`w-4 h-4 ${getStatusColor(status)} mr-1`} />
        <div className={`text-xl font-bold ${getStatusColor(status)}`}>
          {score ? Math.round(score) : '--'}
        </div>
      </div>
      <div className="text-xs text-gray-600 font-medium">Quality</div>
    </div>
  );
};

// Notification Item Component
const NotificationItem = ({
  icon: Icon,
  title,
  message,
  time,
  severity,
  onDismiss,
}) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-amber-600 bg-amber-100';
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
      <div className={`p-2 rounded-lg ${getSeverityColor(severity)}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 text-sm">{title}</div>
        <div className="text-gray-600 text-sm truncate">{message}</div>
        <div className="text-gray-500 text-xs mt-1">{time}</div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-900"
      >
        ×
      </button>
    </div>
  );
};

// Helper function to determine quality status
const getQualityStatus = (score) => {
  if (score >= 95) return 'excellent';
  if (score >= 85) return 'good';
  if (score >= 70) return 'fair';
  return 'poor';
};

export default Header;
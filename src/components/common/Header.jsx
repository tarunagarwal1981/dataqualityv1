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
    <header className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 px-6 py-4 sticky top-0 z-50 shadow-xl">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo and Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <span className="text-white font-bold text-lg">OE</span>
              </div>
              {/* Always connected indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
            </div>

            {/* Brand and subtitle */}
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                {APP_CONFIG.name}
              </h1>
              <p className="text-sm text-slate-400 font-medium">
                {APP_CONFIG.subtitle}
              </p>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="hidden lg:flex items-center gap-6 pl-6 border-l border-slate-700/50">
            <StatCard
              icon={Ship}
              label="Vessels"
              value={stats.totalVessels}
              color="text-blue-400"
            />
            <StatCard
              icon={Database}
              label="Records"
              value={stats.activeRecords}
              color="text-emerald-400"
            />
            <StatCard
              icon={BarChart3}
              label="KPIs"
              value={stats.selectedKPIs}
              color="text-purple-400"
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
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-700/30 rounded-lg border border-slate-600/30">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-300 font-medium">
              {formatLastUpdated(lastUpdated)}
            </span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-3 rounded-xl transition-all duration-200 border ${
              isRefreshing
                ? 'bg-slate-700/50 border-slate-600/50 cursor-not-allowed'
                : 'hover:bg-slate-700/50 border-slate-600/50 hover:border-slate-600'
            }`}
            title="Refresh data"
          >
            <RefreshCw
              className={`w-5 h-5 text-slate-300 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-slate-600/50 hover:border-slate-600"
            >
              <Bell className="w-5 h-5 text-slate-300" />
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
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <p className="text-sm text-slate-400">
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
                      <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                      <p className="text-slate-300 font-medium">All clear!</p>
                      <p className="text-slate-500 text-sm">
                        No active notifications
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-slate-600/50 hover:border-slate-600">
            <Settings className="w-5 h-5 text-slate-300" />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center text-sm font-medium text-white">
                AD
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-white">Admin User</div>
                <div className="text-xs text-slate-400">Fleet Manager</div>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center text-lg font-bold text-white">
                      AD
                    </div>
                    <div>
                      <div className="font-medium text-white">Admin User</div>
                      <div className="text-sm text-slate-400">
                        admin@oceaneye.com
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                      Profile Settings
                    </button>
                    <button className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                      Preferences
                    </button>
                    <hr className="border-slate-700" />
                    <button className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
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

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="text-center">
    <div className="flex items-center justify-center mb-1">
      <Icon className={`w-4 h-4 ${color} mr-1`} />
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
    <div className="text-xs text-slate-400 font-medium">{label}</div>
  </div>
);

// Quality Indicator Component
const QualityIndicator = ({ score, status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-emerald-400';
      case 'good':
        return 'text-green-400';
      case 'fair':
        return 'text-amber-400';
      case 'poor':
        return 'text-red-400';
      default:
        return 'text-slate-400';
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
      <div className="text-xs text-slate-400 font-medium">Quality</div>
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
        return 'text-red-400 bg-red-500/10';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10';
      case 'info':
        return 'text-blue-400 bg-blue-500/10';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 hover:bg-slate-700/30 rounded-lg cursor-pointer">
      <div className={`p-2 rounded-lg ${getSeverityColor(severity)}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-white text-sm">{title}</div>
        <div className="text-slate-400 text-sm truncate">{message}</div>
        <div className="text-slate-500 text-xs mt-1">{time}</div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="p-1 hover:bg-slate-600/50 rounded text-slate-400 hover:text-white"
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

import React, { useState, useEffect, useRef } from 'react';
import {
  Ship,
  Calendar,
  BarChart3,
  Fuel,
  Navigation,
  Activity,
  Package,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Filter,
  Info,
  Settings,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  LayoutDashboard,
  ListFilter,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Waves,
  Anchor,
  TrendingUp,
  FileText,
  Database,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Mock data and constants for demonstration
const DATA_TYPES = {
  COMBINED: 'combined',
  LF: 'lf',
  HF: 'hf',
};

const getCategoryMetadata = (category) => {
  const metadata = {
    efficiency: { name: 'Efficiency', icon: TrendingUp },
    fuel: { name: 'Fuel Management', icon: Fuel },
    navigation: { name: 'Navigation', icon: Navigation },
    cargo: { name: 'Cargo Operations', icon: Package },
    crew: { name: 'Crew Management', icon: Users },
    maintenance: { name: 'Maintenance', icon: Settings },
    safety: { name: 'Safety & Compliance', icon: AlertTriangle },
    environmental: { name: 'Environmental', icon: Waves },
  };
  return metadata[category] || { name: category, icon: Activity };
};

// Sample data for demonstration
const sampleKPIs = [
  { id: 'fuel_efficiency', name: 'Fuel Efficiency', category: 'fuel' },
  {
    id: 'speed_optimization',
    name: 'Speed Optimization',
    category: 'efficiency',
  },
  { id: 'route_deviation', name: 'Route Deviation', category: 'navigation' },
  { id: 'cargo_utilization', name: 'Cargo Utilization', category: 'cargo' },
  { id: 'crew_performance', name: 'Crew Performance', category: 'crew' },
  { id: 'engine_health', name: 'Engine Health', category: 'maintenance' },
];

const sampleVessels = [
  { id: 'vessel_1', name: 'MV Atlantic Pioneer' },
  { id: 'vessel_2', name: 'MV Pacific Navigator' },
  { id: 'vessel_3', name: 'MV Ocean Explorer' },
  { id: 'vessel_4', name: 'MV Global Trader' },
];

const Sidebar = ({
  filters = {
    dataType: DATA_TYPES.COMBINED,
    dateRange: { startDate: null, endDate: null },
    selectedKPIs: [],
    selectedVessels: [],
  },
  onFilterChange = () => {},
  kpis = { fuel: sampleKPIs.filter((k) => k.category === 'fuel') },
  vessels = sampleVessels,
  sidebarCollapsed = false,
  onToggleSidebar = () => {},
  onApplyFilters = () => {},
  onResetFilters = () => {},
  isApplyingFilters = false,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTerm, setSearchTerm] = useState('');
  const [showKpiSearch, setShowKpiSearch] = useState(false);
  const [showVesselSearch, setShowVesselSearch] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    dataType: false,
    dateRange: false, // This will be removed, but keeping for initial state consistency
    kpis: false,
    vessels: false,
  });
  const kpiSearchRef = useRef(null);
  const vesselSearchRef = useRef(null);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleLocalFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleKpiSelection = (kpiId) => {
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

  const handleVesselSelection = (vesselId) => {
    setLocalFilters((prev) => {
      const currentSelected = prev.selectedVessels || [];
      if (currentSelected.includes(vesselId)) {
        return {
          ...prev,
          selectedVessels: currentSelected.filter((id) => id !== vesselId),
        };
      } else {
        return { ...prev, selectedVessels: [...currentSelected, vesselId] };
      }
    });
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    onResetFilters();
    setSearchTerm('');
    setShowKpiSearch(false);
    setShowVesselSearch(false);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const allKPIs = Object.values(kpis || {}).flat().length
    ? Object.values(kpis || {}).flat()
    : sampleKPIs;
  const filteredKPIs = allKPIs.filter(
    (kpi) =>
      kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      kpi.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVessels = vessels.filter((vessel) =>
    vessel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderKpiList = () => {
    const groupedKPIs = filteredKPIs.reduce((acc, kpi) => {
      (acc[kpi.category] = acc[kpi.category] || []).push(kpi);
      return acc;
    }, {});

    return (
      <div className="sidebar-filter-content">
        {Object.entries(groupedKPIs).map(([category, kpiList]) => {
          const categoryMeta = getCategoryMetadata(category);
          const Icon = categoryMeta.icon;
          return (
            <div key={category} className="sidebar-filter-category">
              <div className="sidebar-category-header">
                <Icon className="sidebar-category-icon" />
                <span className="sidebar-category-name">
                  {categoryMeta.name}
                </span>
                <span className="sidebar-category-count">
                  ({kpiList.length})
                </span>
              </div>
              <div className="sidebar-checkbox-group">
                {kpiList.map((kpi) => (
                  <label key={kpi.id} className="sidebar-checkbox-item">
                    <div className="sidebar-checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={localFilters.selectedKPIs?.includes(kpi.id)}
                        onChange={() => handleKpiSelection(kpi.id)}
                        className="sidebar-checkbox"
                      />
                      <div className="sidebar-checkbox-custom">
                        <Check className="sidebar-checkbox-icon" />
                      </div>
                    </div>
                    <span className="sidebar-checkbox-label">{kpi.name}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderVesselList = () => (
    <div className="sidebar-filter-content">
      <div className="sidebar-checkbox-group">
        {filteredVessels.map((vessel) => (
          <label key={vessel.id} className="sidebar-checkbox-item">
            <div className="sidebar-checkbox-wrapper">
              <input
                type="checkbox"
                checked={localFilters.selectedVessels?.includes(vessel.id)}
                onChange={() => handleVesselSelection(vessel.id)}
                className="sidebar-checkbox"
              />
              <div className="sidebar-checkbox-custom">
                <Check className="sidebar-checkbox-icon" />
              </div>
            </div>
            <span className="sidebar-checkbox-label">{vessel.name}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <aside className={`modern-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Sidebar Header */}
      <div className="modern-sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <LayoutDashboard className="sidebar-logo-icon" />
          </div>
          {!sidebarCollapsed && (
            <div className="sidebar-brand-text">
              <h3 className="sidebar-title">Fleet Dashboard</h3>
              <p className="sidebar-subtitle">Advanced Analytics</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggleSidebar}
          className="sidebar-toggle"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="sidebar-toggle-icon" />
          ) : (
            <ChevronLeft className="sidebar-toggle-icon" />
          )}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="modern-sidebar-content">
        {!sidebarCollapsed && (
          <>
            {/* Quick Stats */}
            <div className="sidebar-stats">
              <div className="sidebar-stat-item">
                <Ship className="sidebar-stat-icon" />
                <div className="sidebar-stat-content">
                  <span className="sidebar-stat-value">{vessels.length}</span>
                  <span className="sidebar-stat-label">Vessels</span>
                </div>
              </div>
              <div className="sidebar-stat-item">
                <BarChart3 className="sidebar-stat-icon" />
                <div className="sidebar-stat-content">
                  <span className="sidebar-stat-value">{allKPIs.length}</span>
                  <span className="sidebar-stat-label">KPIs</span>
                </div>
              </div>
            </div>

            {/* Data Type Filter */}
            <div className="sidebar-section">
              <div
                className="sidebar-section-header"
                onClick={() => toggleSection('dataType')}
              >
                <div className="sidebar-section-title">
                  <Database className="sidebar-section-icon" />
                  <span>Data Source</span>
                </div>
                <ChevronDown
                  className={`sidebar-section-chevron ${
                    expandedSections.dataType ? 'expanded' : ''
                  }`}
                />
              </div>
              {expandedSections.dataType && (
                <div className="sidebar-section-content">
                  <div className="sidebar-radio-group">
                    {[
                      {
                        value: DATA_TYPES.COMBINED,
                        label: 'Combined Data',
                        desc: 'All data sources',
                      },
                      {
                        value: DATA_TYPES.LF,
                        label: 'Low Frequency',
                        desc: 'Daily aggregates',
                      },
                      {
                        value: DATA_TYPES.HF,
                        label: 'High Frequency',
                        desc: 'Real-time data',
                      },
                    ].map((option) => (
                      <label key={option.value} className="sidebar-radio-item">
                        <div className="sidebar-radio-wrapper">
                          <input
                            type="radio"
                            name="dataType"
                            value={option.value}
                            checked={localFilters.dataType === option.value}
                            onChange={() =>
                              handleLocalFilterChange('dataType', option.value)
                            }
                            className="sidebar-radio"
                          />
                          <div className="sidebar-radio-custom">
                            <div className="sidebar-radio-dot"></div>
                          </div>
                        </div>
                        <div className="sidebar-radio-content">
                          <span className="sidebar-radio-label">
                            {option.label}
                          </span>
                          <span className="sidebar-radio-desc">
                            {option.desc}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Vessel Filter */}
            <div className="sidebar-section">
              <div
                className="sidebar-section-header"
                onClick={() => toggleSection('vessels')}
              >
                <div className="sidebar-section-title">
                  <Ship className="sidebar-section-icon" />
                  <span>Vessels</span>
                  {localFilters.selectedVessels?.length > 0 && (
                    <span className="sidebar-selection-badge">
                      {localFilters.selectedVessels.length}
                    </span>
                  )}
                </div>
                <div className="sidebar-section-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowVesselSearch(!showVesselSearch);
                    }}
                    className="sidebar-action-btn"
                    title="Search Vessels"
                  >
                    <Search className="sidebar-action-icon" />
                  </button>
                  <ChevronDown
                    className={`sidebar-section-chevron ${
                      expandedSections.vessels ? 'expanded' : ''
                    }`}
                  />
                </div>
              </div>
              {expandedSections.vessels && (
                <div className="sidebar-section-content">
                  {showVesselSearch && (
                    <div className="sidebar-search" ref={vesselSearchRef}>
                      <Search className="sidebar-search-icon" />
                      <input
                        type="text"
                        placeholder="Search vessels..."
                        className="sidebar-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="sidebar-search-clear"
                        >
                          <X className="sidebar-search-clear-icon" />
                        </button>
                      )}
                    </div>
                  )}
                  {renderVesselList()}
                </div>
              )}
            </div>

            {/* KPI Filter */}
            <div className="sidebar-section">
              <div
                className="sidebar-section-header"
                onClick={() => toggleSection('kpis')}
              >
                <div className="sidebar-section-title">
                  <BarChart3 className="sidebar-section-icon" />
                  <span>KPIs</span>
                  {localFilters.selectedKPIs?.length > 0 && (
                    <span className="sidebar-selection-badge">
                      {localFilters.selectedKPIs.length}
                    </span>
                  )}
                </div>
                <div className="sidebar-section-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowKpiSearch(!showKpiSearch);
                    }}
                    className="sidebar-action-btn"
                    title="Search KPIs"
                  >
                    <Search className="sidebar-action-icon" />
                  </button>
                  <ChevronDown
                    className={`sidebar-section-chevron ${
                      expandedSections.kpis ? 'expanded' : ''
                    }`}
                  />
                </div>
              </div>
              {expandedSections.kpis && (
                <div className="sidebar-section-content">
                  {showKpiSearch && (
                    <div className="sidebar-search" ref={kpiSearchRef}>
                      <Search className="sidebar-search-icon" />
                      <input
                        type="text"
                        placeholder="Search KPIs..."
                        className="sidebar-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="sidebar-search-clear"
                        >
                          <X className="sidebar-search-clear-icon" />
                        </button>
                      )}
                    </div>
                  )}
                  {renderKpiList()}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="modern-sidebar-footer">
        {!sidebarCollapsed && (
          <div className="sidebar-actions">
            <button
              onClick={handleReset}
              className="sidebar-btn sidebar-btn-secondary"
              disabled={isApplyingFilters}
              title="Reset all filters"
            >
              <RefreshCw className="sidebar-btn-icon" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleApply}
              className={`sidebar-btn sidebar-btn-primary ${
                isApplyingFilters ? 'loading' : ''
              }`}
              disabled={isApplyingFilters}
              title="Apply current filters"
            >
              {isApplyingFilters ? (
                <>
                  <RefreshCw className="sidebar-btn-icon spinning" />
                  <span>Applying...</span>
                </>
              ) : (
                <>
                  <Check className="sidebar-btn-icon" />
                  <span>Apply Filters</span>
                </>
              )}
            </button>
          </div>
        )}

        {sidebarCollapsed && (
          <div className="sidebar-collapsed-actions">
            <button
              onClick={handleReset}
              className="sidebar-icon-btn"
              title="Reset filters"
            >
              <RefreshCw className="sidebar-icon-btn-icon" />
            </button>
            <button
              onClick={handleApply}
              className="sidebar-icon-btn sidebar-icon-btn-primary"
              title="Apply filters"
            >
              <Check className="sidebar-icon-btn-icon" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .modern-sidebar {
          width: 280px;
          height: 100vh;
          background: linear-gradient(145deg, var(--primary-dark), var(--secondary-dark));
          border-right: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .modern-sidebar.collapsed {
          width: 60px;
        }

        .modern-sidebar-header {
          padding: 16px;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(180deg, var(--card-bg), var(--card-dark));
          position: relative;
        }

        .modern-sidebar-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--primary-accent-light), transparent);
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-logo {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, var(--primary-accent), var(--primary-accent-dark));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
        }

        .sidebar-logo-icon {
          width: 20px;
          height: 20px;
          color: white;
        }

        .sidebar-brand-text {
          display: flex;
          flex-direction: column;
        }

        .sidebar-title {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-light);
          line-height: 1.2;
        }

        .sidebar-subtitle {
          margin: 0;
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 400;
        }

        .sidebar-toggle {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .sidebar-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--primary-accent-light);
          transform: scale(1.05);
        }

        .sidebar-toggle-icon {
          width: 16px;
          height: 16px;
          color: var(--text-light);
        }

        .modern-sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          scrollbar-width: thin;
          scrollbar-color: var(--primary-accent-light) transparent;
        }

        .modern-sidebar-content::-webkit-scrollbar {
          width: 4px;
        }

        .modern-sidebar-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .modern-sidebar-content::-webkit-scrollbar-thumb {
          background: var(--primary-accent-light);
          border-radius: 2px;
        }

        .sidebar-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .sidebar-stat-item {
          background: linear-gradient(135deg, var(--card-bg), var(--card-dark));
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--border-subtle);
          transition: var(--transition-fast);
        }

        .sidebar-stat-item:hover {
          border-color: var(--primary-accent-light);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .sidebar-stat-icon {
          width: 16px;
          height: 16px;
          color: var(--primary-accent);
        }

        .sidebar-stat-content {
          display: flex;
          flex-direction: column;
        }

        .sidebar-stat-value {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-light);
          line-height: 1;
        }

        .sidebar-stat-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sidebar-section {
          margin-bottom: 16px;
          background: linear-gradient(135deg, var(--card-bg), var(--card-dark));
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          overflow: hidden;
          transition: var(--transition-fast);
        }

        .sidebar-section:hover {
          border-color: var(--primary-accent-light);
        }

        .sidebar-section-header {
          padding: 12px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
          transition: var(--transition-fast);
        }

        .sidebar-section-header:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
        }

        .sidebar-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-light);
        }

        .sidebar-section-icon {
          width: 16px;
          height: 16px;
          color: var(--primary-accent);
        }

        .sidebar-section-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .sidebar-action-btn {
          width: 24px;
          height: 24px;
          background: transparent;
          border: none;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .sidebar-action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .sidebar-action-icon {
          width: 12px;
          height: 12px;
          color: var(--text-muted);
        }

        .sidebar-section-chevron {
          width: 16px;
          height: 16px;
          color: var(--text-muted);
          transition: transform 0.2s ease;
        }

        .sidebar-section-chevron.expanded {
          transform: rotate(180deg);
        }

        .sidebar-selection-badge {
          background: var(--primary-accent);
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          margin-left: 8px;
        }

        .sidebar-section-content {
          padding: 16px;
          border-top: 1px solid var(--border-subtle);
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05));
        }

        .sidebar-radio-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-radio-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .sidebar-radio-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .sidebar-radio-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sidebar-radio {
          opacity: 0;
          position: absolute;
        }

        .sidebar-radio-custom {
          width: 16px;
          height: 16px;
          border: 2px solid var(--border-subtle);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }

        .sidebar-radio:checked + .sidebar-radio-custom {
          border-color: var(--primary-accent);
          background: var(--primary-accent-light);
        }

        .sidebar-radio-dot {
          width: 6px;
          height: 6px;
          background: var(--primary-accent);
          border-radius: 50%;
          opacity: 0;
          transition: var(--transition-fast);
        }

        .sidebar-radio:checked + .sidebar-radio-custom .sidebar-radio-dot {
          opacity: 1;
        }

        .sidebar-radio-content {
          display: flex;
          flex-direction: column;
        }

        .sidebar-radio-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--text-light);
          line-height: 1.2;
        }

        .sidebar-radio-desc {
          font-size: 11px;
          color: var(--text-muted);
        }

        .sidebar-date-picker {
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
        }

        .sidebar-date-input {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 8px 12px;
          color: var(--text-light);
          font-size: 12px;
          transition: var(--transition-fast);
        }

        .sidebar-date-input:focus {
          outline: none;
          border-color: var(--primary-accent);
          box-shadow: 0 0 0 2px var(--primary-accent-light);
        }

        .sidebar-date-icon {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 16px;
          height: 16px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .sidebar-search {
          position: relative;
          margin-bottom: 12px;
        }

        .sidebar-search-icon {
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 14px;
          height: 14px;
          color: var(--text-muted);
        }

        .sidebar-search-input {
          width: 100%;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 8px 32px 8px 28px;
          color: var(--text-light);
          font-size: 12px;
          transition: var(--transition-fast);
        }

        .sidebar-search-input:focus {
          outline: none;
          border-color: var(--primary-accent);
          box-shadow: 0 0 0 2px var(--primary-accent-light);
        }

        .sidebar-search-clear {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          border-radius: 3px;
          transition: var(--transition-fast);
        }

        .sidebar-search-clear:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .sidebar-search-clear-icon {
          width: 12px;
          height: 12px;
          color: var(--text-muted);
        }

        .sidebar-filter-content {
          max-height: 300px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--primary-accent-light) transparent;
        }

        .sidebar-filter-content::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-filter-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-filter-content::-webkit-scrollbar-thumb {
          background: var(--primary-accent-light);
          border-radius: 2px;
        }

        .sidebar-filter-category {
          margin-bottom: 16px;
        }

        .sidebar-category-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          padding: 6px 8px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }

        .sidebar-category-icon {
          width: 14px;
          height: 14px;
          color: var(--primary-accent);
        }

        .sidebar-category-name {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-light);
          flex: 1;
        }

        .sidebar-category-count {
          font-size: 10px;
          color: var(--text-muted);
        }

        .sidebar-checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .sidebar-checkbox-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .sidebar-checkbox-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .sidebar-checkbox {
          opacity: 0;
          position: absolute;
        }

        .sidebar-checkbox-custom {
          width: 14px;
          height: 14px;
          border: 1px solid var(--border-subtle);
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.2);
          transition: var(--transition-fast);
        }

        .sidebar-checkbox:checked + .sidebar-checkbox-custom {
          border-color: var(--primary-accent);
          background: var(--primary-accent);
        }

        .sidebar-checkbox-icon {
          width: 10px;
          height: 10px;
          color: white;
          opacity: 0;
          transition: var(--transition-fast);
        }

        .sidebar-checkbox:checked + .sidebar-checkbox-custom .sidebar-checkbox-icon {
          opacity: 1;
        }

        .sidebar-checkbox-label {
          font-size: 12px;
          color: var(--text-light);
          line-height: 1.3;
        }

        .modern-sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border-subtle);
          background: linear-gradient(180deg, var(--card-dark), var(--primary-dark));
        }

        .sidebar-actions {
          display: flex;
          gap: 8px;
        }

        .sidebar-btn {
          flex: 1;
          padding: 10px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: var(--transition-fast);
          border: 1px solid transparent;
        }

        .sidebar-btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-light);
          border-color: var(--border-subtle);
        }

        .sidebar-btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--border-accent);
          transform: translateY(-1px);
        }

        .sidebar-btn-primary {
          background: linear-gradient(135deg, var(--primary-accent), var(--primary-accent-dark));
          color: white;
          border-color: var(--primary-accent);
        }

        .sidebar-btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--primary-accent-dark), var(--primary-accent));
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .sidebar-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .sidebar-btn-icon {
          width: 14px;
          height: 14px;
        }

        .sidebar-btn-icon.spinning {
          animation: spin 1s linear infinite;
        }

        .sidebar-collapsed-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sidebar-icon-btn {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .sidebar-icon-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--border-accent);
          transform: scale(1.05);
        }

        .sidebar-icon-btn-primary {
          background: var(--primary-accent);
          border-color: var(--primary-accent);
        }

        .sidebar-icon-btn-primary:hover {
          background: var(--primary-accent-dark);
        }

        .sidebar-icon-btn-icon {
          width: 16px;
          height: 16px;
          color: var(--text-light);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .modern-sidebar {
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            transform: translateX(-100%);
          }

          .modern-sidebar:not(.collapsed) {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;

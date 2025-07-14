import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  RefreshCw,
  Ship,
  Calendar,
  BarChart3,
  Grid,
  Menu,
  Check,
  X,
} from 'lucide-react';

// Mock data and constants
const DATA_TYPES = {
  COMBINED: 'combined',
  LF: 'lf',
  HF: 'hf',
};

// Sample data
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

const ControlsBar = ({
  filters = {
    dataType: DATA_TYPES.COMBINED,
    selectedKPIs: [],
    selectedVessels: [],
    dateRange: { startDate: null, endDate: null },
    viewMode: 'table', // Default to table view
  },
  onFilterChange = () => {},
  kpis = {}, // KPIs are no longer directly selectable in this simplified bar
  vessels = sampleVessels,
  onApplyFilters = () => {},
  onResetFilters = () => {},
  isApplyingFilters = false,
  onExport = () => {},
  isExporting = false,
  onNavigateToCharts = () => {},
  onNavigateToTable = () => {},
  currentView = 'table', // Default to table view
}) => {
  const getInitialDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7); // Last 7 days
    return { startDate, endDate };
  };

  const [localFilters, setLocalFilters] = useState(() => ({
    ...filters,
    selectedVessels:
      filters.selectedVessels.length > 0
        ? filters.selectedVessels
        : sampleVessels.map((v) => v.id), // Pre-select all vessels
    dateRange:
      filters.dateRange.startDate && filters.dateRange.endDate
        ? filters.dateRange
        : getInitialDateRange(),
    viewMode: filters.viewMode || 'table', // Ensure viewMode is initialized, default to 'table'
  }));
  const [showVesselDropdown, setShowVesselDropdown] = useState(false);
  const vesselDropdownRef = useRef(null);

  useEffect(() => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedVessels:
        filters.selectedVessels.length > 0
          ? filters.selectedVessels
          : sampleVessels.map((v) => v.id),
      dateRange:
        filters.dateRange.startDate && filters.dateRange.endDate
          ? filters.dateRange
          : getInitialDateRange(),
      viewMode: filters.viewMode || 'table', // Update viewMode from props
    }));
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        vesselDropdownRef.current &&
        !vesselDropdownRef.current.contains(event.target)
      ) {
        setShowVesselDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDateChange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      dateRange: { ...prev.dateRange, [field]: value },
    }));
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
    onFilterChange('selectedVessels', localFilters.selectedVessels);
    onFilterChange('dateRange', localFilters.dateRange);
    setShowVesselDropdown(false);
  };

  const handleReset = () => {
    onResetFilters();
    setShowVesselDropdown(false);
    setLocalFilters((prev) => ({
      ...prev,
      selectedVessels: sampleVessels.map((v) => v.id), // Reset to all vessels selected
      dateRange: getInitialDateRange(), // Reset date range to last 7 days
      viewMode: 'table', // Reset view mode to table
    }));
    onFilterChange('viewMode', 'table'); // Ensure parent state is updated
  };

  const renderVesselList = () => (
    <div className="filter-content">
      <div className="checkbox-group">
        {vessels.map((vessel) => (
          <label key={vessel.id} className="checkbox-item">
            <input
              type="checkbox"
              checked={localFilters.selectedVessels?.includes(vessel.id)}
              onChange={() => handleVesselSelection(vessel.id)}
              className="checkbox-input"
            />
            <div className="checkbox-custom">
              <Check className="checkbox-icon" />
            </div>
            <span className="checkbox-label">{vessel.name}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="sleek-controls-bar">
      {/* Left Section - Vessel Selection */}
      <div className="controls-left">
        {/* Vessel Selection */}
        <div className="filter-container" ref={vesselDropdownRef}>
          <button
            onClick={() => setShowVesselDropdown(!showVesselDropdown)}
            className={`nav-btn ${showVesselDropdown ? 'active' : ''}`}
            title="Select Vessels"
          >
            <Menu className="nav-icon" />
            <span className="nav-label">Vessels</span>
            {localFilters.selectedVessels?.length > 0 && (
              <span className="filter-badge">
                {localFilters.selectedVessels.length}
              </span>
            )}
          </button>

          {showVesselDropdown && (
            <div className="filter-dropdown vessel-dropdown">
              <div className="filter-header">
                <div className="filter-title">
                  <Ship className="filter-title-icon" />
                  <span>Select Vessels</span>
                </div>
                <button
                  onClick={() => setShowVesselDropdown(false)}
                  className="filter-close"
                >
                  <X className="filter-close-icon" />
                </button>
              </div>
              <div className="filter-body">{renderVesselList()}</div>
              <div className="filter-footer">
                <button
                  onClick={handleReset}
                  className="reset-btn"
                  disabled={isApplyingFilters}
                >
                  <RefreshCw className="reset-icon" />
                  Reset
                </button>
                <button
                  onClick={handleApply}
                  className={`apply-btn ${isApplyingFilters ? 'loading' : ''}`}
                  disabled={isApplyingFilters}
                >
                  {isApplyingFilters ? (
                    <>
                      <RefreshCw className="apply-icon spinning" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Check className="apply-icon" />
                      Apply
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - View Toggle, Date Range & Actions */}
      <div className="controls-right">
        {/* Charts/Table View Toggle - Subtle and Modern */}
        <div className="view-toggle-group">
          <button
            onClick={onNavigateToTable}
            className={`view-toggle-btn ${
              currentView === 'table' ? 'active' : ''
            }`}
            title="Table View"
          >
            <Grid className="view-toggle-icon" />
          </button>
          <button
            onClick={onNavigateToCharts}
            className={`view-toggle-btn ${
              currentView === 'chart' ? 'active' : ''
            }`}
            title="Charts View"
          >
            <BarChart3 className="view-toggle-icon" />
          </button>
        </div>

        {/* Date Range Picker */}
        <div className="date-section">
          <Calendar className="date-icon" />
          <div className="date-inputs">
            <input
              type="date"
              value={
                localFilters.dateRange?.startDate
                  ? new Date(localFilters.dateRange.startDate)
                      .toISOString()
                      .split('T')[0]
                  : ''
              }
              onChange={(e) =>
                handleDateChange(
                  'startDate',
                  e.target.value ? new Date(e.target.value) : null
                )
              }
              className="date-input"
              placeholder="Start"
            />
            <span className="date-separator">–</span>
            <input
              type="date"
              value={
                localFilters.dateRange?.endDate
                  ? new Date(localFilters.dateRange.endDate)
                      .toISOString()
                      .split('T')[0]
                  : ''
              }
              onChange={(e) =>
                handleDateChange(
                  'endDate',
                  e.target.value ? new Date(e.target.value) : null
                )
              }
              className="date-input"
              placeholder="End"
            />
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={() => onExport('csv')}
          disabled={isExporting}
          className={`export-btn ${isExporting ? 'loading' : ''}`}
          title="Export Data"
        >
          {isExporting ? (
            <RefreshCw className="export-icon spinning" />
          ) : (
            <Download className="export-icon" />
          )}
        </button>
      </div>
      <style jsx>{`
        :root {
          --primary-accent: #66aaff; /* Softer blue */
          --primary-accent-light: #88bbff;
          --primary-accent-dark: #4488cc;
          --success-color: #28a745;
          --card-bg: #1a1a2e; /* Dark background for cards/elements */
          --card-dark: #0f0f1a;
          --bg-gradient-1: linear-gradient(135deg, #0a0a1a, #1a1a2e); /* Main background gradient */
          --text-light: #e0e0e0;
          --text-muted: #a0a0a0;
          --border-subtle: rgba(255, 255, 255, 0.1);
          --border-accent: rgba(102, 170, 255, 0.4); /* Adjusted to new primary-accent */
          --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.2);
          --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.3);
          --transition-fast: all 0.15s ease-out;
          --transition-medium: all 0.3s ease-out;
        }

        .sleek-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 8px;
          background: var(--bg-gradient-1);
          border-bottom: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-sm);
          position: relative;
          z-index: 20;
          gap: 8px;
          min-height: 40px;
          font-family: 'Nunito', sans-serif;
          /* Adding a subtle 3D effect to the bar itself */
          transform: perspective(1000px) rotateX(0deg);
          transition: transform var(--transition-medium);
        }

        .sleek-controls-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%);
          pointer-events: none;
          border-radius: 4px;
        }

        .sleek-controls-bar::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--primary-accent-light), transparent);
        }

        /* Left Section */
        .controls-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          background: linear-gradient(135deg, var(--primary-accent), var(--primary-accent-dark));
          border: none;
          border-radius: 4px;
          color: white;
          cursor: pointer;
          transition: var(--transition-fast);
          font-size: 12px;
          font-weight: 500;
          height: 32px;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transform: translateZ(0); /* For 3D effect */
        }

        .nav-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 100%);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .nav-btn:hover::before {
          opacity: 1;
        }

        .nav-btn:hover {
          background: linear-gradient(135deg, var(--primary-accent-dark), var(--primary-accent));
          transform: translateY(-1px) translateZ(2px); /* Lift and push forward */
          box-shadow: var(--shadow-md);
        }

        .nav-btn.active {
          background: var(--primary-accent-light);
          color: var(--primary-accent-dark);
          box-shadow: inset 0 0 0 1px var(--primary-accent-dark), var(--shadow-sm);
          transform: translateY(0) translateZ(0);
        }

        .nav-icon {
          width: 12px;
          height: 12px;
          filter: drop-shadow(0 0 1px rgba(0,0,0,0.3));
        }

        .nav-btn.active .nav-icon {
            color: var(--primary-accent-dark);
        }

        .nav-label {
          font-size: 12px;
        }

        .filter-container {
          position: relative;
        }

        .filter-badge {
          background: var(--primary-accent);
          color: white;
          font-size: 9px;
          font-weight: 600;
          padding: 0px 3px;
          border-radius: 6px;
          min-width: 14px;
          text-align: center;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .filter-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          z-index: 100;
          width: 380px;
          max-height: 450px;
          background: var(--bg-gradient-1);
          border-radius: 6px;
          box-shadow: var(--shadow-lg), 0 0 0 1px var(--border-accent);
          overflow: hidden;
          animation: fadeInDropdown 0.2s ease-out;
          backdrop-filter: blur(10px);
          transform: translateZ(10px); /* Give it a 3D pop */
        }

        .filter-dropdown.vessel-dropdown {
            width: 280px;
        }

        .filter-header {
          padding: 8px 12px;
          background: linear-gradient(135deg, var(--card-dark), var(--primary-dark));
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: inset 0 -1px 0 rgba(255,255,255,0.05);
        }

        .filter-title {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-light);
        }

        .filter-title-icon {
          width: 12px;
          height: 12px;
          color: var(--primary-accent);
        }

        .filter-close {
          width: 20px;
          height: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: none;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }

        .filter-close:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }

        .filter-close-icon {
          width: 10px;
          height: 10px;
          color: var(--text-light);
        }

        .filter-body {
          padding: 12px;
          max-height: 300px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--primary-accent-light) transparent;
        }

        .filter-body::-webkit-scrollbar {
          width: 3px;
        }

        .filter-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .filter-body::-webkit-scrollbar-thumb {
          background: var(--primary-accent-light);
          border-radius: 1px;
        }

        .filter-content {
          max-height: 120px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--primary-accent-light) transparent;
        }

        .filter-content::-webkit-scrollbar {
          width: 2px;
        }

        .filter-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .filter-content::-webkit-scrollbar-thumb {
          background: var(--primary-accent-light);
          border-radius: 1px;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 4px;
          border-radius: 2px;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .checkbox-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .checkbox-input {
          display: none;
        }

        .checkbox-custom {
          width: 10px;
          height: 10px;
          border: 1px solid var(--border-subtle);
          border-radius: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.2);
          transition: var(--transition-fast);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
        }

        .checkbox-input:checked + .checkbox-custom {
          border-color: var(--primary-accent);
          background: var(--primary-accent);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.3), 0 0 5px var(--primary-accent-light);
        }

        .checkbox-icon {
          width: 7px;
          height: 7px;
          color: white;
          opacity: 0;
          transition: var(--transition-fast);
        }

        .checkbox-input:checked + .checkbox-custom .checkbox-icon {
          opacity: 1;
        }

        .checkbox-label {
          font-size: 10px;
          color: var(--text-light);
          line-height: 1.2;
        }

        .filter-footer {
          padding: 8px 12px;
          background: linear-gradient(135deg, var(--card-dark), var(--primary-dark));
          border-top: 1px solid var(--border-subtle);
          display: flex;
          gap: 6px;
          justify-content: flex-end;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .reset-btn {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          border-radius: 3px;
          color: var(--text-light);
          cursor: pointer;
          transition: var(--transition-fast);
          font-size: 10px;
          font-weight: 500;
          box-shadow: var(--shadow-sm);
        }

        .reset-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .reset-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .reset-icon {
          width: 10px;
          height: 10px;
        }

        .apply-btn {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 4px 10px;
          background: linear-gradient(135deg, var(--primary-accent), var(--primary-accent-dark));
          border: 1px solid var(--primary-accent);
          border-radius: 3px;
          color: white;
          cursor: pointer;
          transition: var(--transition-fast);
          font-size: 10px;
          font-weight: 500;
          box-shadow: var(--shadow-sm);
        }

        .apply-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--primary-accent-dark), var(--primary-accent));
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .apply-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .apply-icon {
          width: 10px;
          height: 10px;
        }

        .apply-icon.spinning {
          animation: spin 1s linear infinite;
        }

        /* View Toggle Group */
        .view-toggle-group {
          display: flex;
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          overflow: hidden;
          background: linear-gradient(135deg, var(--card-bg), var(--card-dark));
          box-shadow: var(--shadow-sm);
        }

        .view-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center; /* Center the icon */
          padding: 6px 10px;
          background: transparent;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          transition: var(--transition-fast);
          font-size: 12px;
          font-weight: 500;
          height: 32px;
          width: 40px; /* Fixed width for subtle look */
          position: relative;
          overflow: hidden;
        }

        .view-toggle-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .view-toggle-btn:hover:not(.active)::before {
          opacity: 1;
        }

        .view-toggle-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-1px);
        }

        .view-toggle-btn.active {
          background: var(--primary-accent);
          color: white;
          box-shadow: inset 0 0 0 1px var(--primary-accent-dark);
          transform: translateY(0);
        }

        .view-toggle-icon {
          width: 12px;
          height: 12px;
          filter: drop-shadow(0 0 1px rgba(0,0,0,0.3));
        }

        .view-toggle-btn:not(.active) .view-toggle-icon {
            color: var(--primary-accent);
        }

        /* Right Section */
        .controls-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .date-section {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: linear-gradient(135deg, var(--card-bg), var(--card-dark));
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
          transition: var(--transition-fast);
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
        }

        .date-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%);
          pointer-events: none;
        }

        .date-section:hover {
          border-color: var(--primary-accent-light);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .date-icon {
          width: 12px;
          height: 12px;
          color: var(--primary-accent);
          flex-shrink: 0;
          filter: drop-shadow(0 0 1px rgba(0,0,0,0.3));
        }

        .date-inputs {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .date-input {
          width: 80px;
          background: transparent;
          border: none;
          color: var(--text-light);
          font-size: 10px;
          padding: 1px 3px;
          border-radius: 2px;
          transition: var(--transition-fast);
          text-shadow: 0 0 1px rgba(0,0,0,0.5);
        }

        .date-input:focus {
          outline: none;
          background: rgba(0, 0, 0, 0.2);
        }

        .date-input::-webkit-calendar-picker-indicator {
          filter: invert(0.7);
          cursor: pointer;
        }

        .date-separator {
          color: var(--text-muted);
          font-size: 11px;
          margin: 0 1px;
        }

        .export-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--success-color), #26a069);
          border: 1px solid var(--success-color);
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition-fast);
          color: white;
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
          transform: translateZ(0);
        }

        .export-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(45deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 100%);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .export-btn:hover::before {
          opacity: 1;
        }

        .export-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #26a069, var(--success-color));
          transform: translateY(-1px) translateZ(2px);
          box-shadow: var(--shadow-md);
        }

        .export-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .export-icon {
          width: 14px;
          height: 14px;
          filter: drop-shadow(0 0 1px rgba(0,0,0,0.3));
        }

        .export-icon.spinning {
          animation: spin 1s linear infinite;
        }

        /* Animations */
        @keyframes fadeInDropdown {
          from {
            opacity: 0;
            transform: translateY(-4px) translateZ(0);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateZ(10px);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .controls-center {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .sleek-controls-bar {
            flex-wrap: wrap;
            gap: 6px;
            padding: 6px 10px;
          }

          .controls-left {
            flex: 1;
            min-width: 100%;
            order: 1;
          }

          .controls-right {
            flex: 1;
            justify-content: flex-end;
            order: 2;
          }

          .nav-label,
          .view-toggle-label {
            display: none;
          }

          .date-inputs {
            flex-direction: column;
            gap: 1px;
          }

          .date-input {
            width: 60px;
          }

          .date-separator {
            display: none;
          }

          .filter-dropdown {
            width: calc(100vw - 20px);
            left: 50%;
            transform: translateX(-50%) translateZ(10px);
          }

          .filter-dropdown.vessel-dropdown {
            width: calc(100vw - 20px);
          }
        }

        @media (max-width: 480px) {
          .date-section {
            display: none;
          }

          .controls-right {
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default ControlsBar;

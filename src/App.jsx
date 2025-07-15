import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// Import custom hooks
import { useMaritimeData } from './hooks/useMaritimeData.js';
import { useFilters } from './hooks/useFilters.js';
import { useDataQuality } from './hooks/useDataQuality.js';

// Import components
import FleetHeader from './components/common/FleetHeader.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import ControlsBar from './components/dashboard/ControlsBar.jsx'; // This is your SleekControlsBar
import DataQualityPanel from './components/dashboard/DataQualityPanel.jsx';
import TableView from './components/table/TableView.jsx';
import ChartView from './components/charts/ChartView.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

// Import constants
import {
  VIEW_MODES,
  LOADING_STATES,
  ERROR_MESSAGES,
} from './utils/constants.js';

const App = () => {
  // State for UI controls
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  // State for vessel navigation
  const [selectedVesselForCharts, setSelectedVesselForCharts] = useState(null);

  // Initialize custom hooks
  const {
    vessels,
    kpis,
    loadingState,
    error,
    lastUpdated,
    getFilteredData,
    getChartData,
    getQualityStats,
    getVesselSummary,
    getKPIPerformanceSummary,
    getExportData,
    refreshData,
    isLoading,
    isRefreshing,
    hasError,
    hasData,
  } = useMaritimeData();

  const {
    filters,
    validationErrors,
    warnings,
    updateFilter,
    updateFilters,
    resetFilters,
    changeDataType,
    toggleVessel,
    toggleKPI,
    setDatePreset,
    filterSummary,
    isValidForCharts,
    hasPerformanceWarning,
    hasFilters,
  } = useFilters(vessels, kpis);

  const filteredData = hasData ? getFilteredData(filters) : [];

  const {
    qualityMetrics,
    qualityTrends,
    alerts,
    qualitySettings,
    updateQualitySettings,
    dismissAlert,
    clearAllAlerts,
    hasQualityIssues,
    hasCriticalIssues,
    isQualityImproving,
    qualityScore,
  } = useDataQuality(filteredData, filters);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'r':
            event.preventDefault();
            refreshData();
            break;
          case 'f':
            event.preventDefault();
            setSidebarVisible((prev) => !prev);
            break;
          case 'q':
            event.preventDefault();
            updateFilter('qualityVisible', !filters.qualityVisible);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [refreshData, updateFilter, filters.qualityVisible]);

  // Error boundary for component errors
  const [componentError, setComponentError] = useState(null);

  const handleComponentError = (error, errorInfo) => {
    console.error('Component error:', error, errorInfo);
    setComponentError(error);
  };

  // Reset component error
  const resetComponentError = () => {
    setComponentError(null);
  };

  // Handle filter changes with validation
  const handleFilterChange = (key, value) => {
    try {
      updateFilter(key, value);
    } catch (error) {
      console.error('Filter update error:', error);
    }
  };

  // Handle export operations
  const handleExport = async (format) => {
    try {
      const exportData = getExportData(filters, format);

      if (format === 'csv') {
        downloadCSV(exportData);
      } else if (format === 'json') {
        downloadJSON(exportData);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  // CSV download helper
  const downloadCSV = (exportData) => {
    // Implementation would convert data to CSV format
    console.log('CSV export:', exportData);
  };

  // JSON download helper
  const downloadJSON = (exportData) => {
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maritime-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to handle navigation to chart view
  const handleNavigateToCharts = () => {
    updateFilter('viewMode', VIEW_MODES.CHART);
    // Clear selected vessel when navigating to charts normally
    setSelectedVesselForCharts(null);
  };

  // Function to handle navigation to table view
  const handleNavigateToTable = () => {
    updateFilter('viewMode', VIEW_MODES.TABLE);
    // Clear selected vessel when going back to table
    setSelectedVesselForCharts(null);
  };

  // NEW: Handle vessel click from table view
  const handleVesselClick = (vesselId) => {
    console.log('Vessel clicked:', vesselId);
    // Set the selected vessel for charts
    setSelectedVesselForCharts(vesselId);
    // Navigate to chart view
    updateFilter('viewMode', VIEW_MODES.CHART);
  };

  // Render error state
  if (componentError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Application Error
          </h1>
          <p className="text-slate-400 mb-6">
            An unexpected error occurred. Please refresh the page or contact
            support.
          </p>
          <button onClick={resetComponentError} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render loading state
  if (loadingState === LOADING_STATES.LOADING) {
    return (
      <div className="min-h-screen bg-slate-900">
        <FleetHeader />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <LoadingSpinner size="large" message="Loading maritime data..." />
        </div>
      </div>
    );
  }

  // Render error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-slate-900">
        <FleetHeader />
        <div className="flex items-center justify-center h-[calc(100vh-80px)] p-6">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Failed to Load Data
            </h2>
            <p className="text-slate-400 mb-6">
              {error || ERROR_MESSAGES.DATA_LOAD_FAILED}
            </p>
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <FleetHeader />
      
      {/* Controls Bar */}
      <ControlsBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onFiltersUpdate={updateFilters}
        onDataTypeChange={changeDataType}
        onDatePresetChange={setDatePreset}
        onResetFilters={resetFilters}
        onExport={handleExport}
        onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
        validationErrors={validationErrors}
        warnings={warnings}
        isValidForCharts={isValidForCharts}
        hasPerformanceWarning={hasPerformanceWarning}
        onNavigateToCharts={handleNavigateToCharts}
        onNavigateToTable={handleNavigateToTable}
        currentView={filters.viewMode} // Pass the current view mode
      />
      
      <div className="flex">
        {/* Sidebar */}
        {/* {sidebarVisible && (
          <Sidebar
            vessels={vessels || []}
            kpis={kpis}
            filters={filters}
            onVesselToggle={toggleVessel}
            onKPIToggle={toggleKPI}
            onFilterChange={handleFilterChange}
            onSelectAllVessels={() =>
              updateFilter(
                'selectedVessels',
                vessels.map((v) => v.id)
              )
            }
            onClearVessels={() => updateFilter('selectedVessels', [])}
            filterSummary={filterSummary}
          />
        )} */}

        {/* Main Content */}
        <div className="flex-1 p-2 space-y-6">
          {/* Data Quality Panel */}
          {/* {filters.qualityVisible && (
            <DataQualityPanel
              qualityMetrics={qualityMetrics}
              qualityTrends={qualityTrends}
              alerts={alerts}
              qualitySettings={qualitySettings}
              onUpdateSettings={updateQualitySettings}
              onDismissAlert={dismissAlert}
              onClearAllAlerts={clearAllAlerts}
              dataType={filters.dataType}
              hasQualityIssues={hasQualityIssues}
              hasCriticalIssues={hasCriticalIssues}
              isQualityImproving={isQualityImproving}
            />
          )} */}

          {/* Main View */}
          {filters.viewMode === VIEW_MODES.TABLE ? (
            <TableView
              data={filteredData}
              vessels={vessels || []}
              kpis={kpis}
              filters={filters}
              onFilterChange={handleFilterChange}
              qualityVisible={filters.qualityVisible}
              onExport={handleExport}
              onVesselClick={handleVesselClick} // NEW: Pass vessel click handler
              performanceSummary={getKPIPerformanceSummary(
                filters,
                filters.selectedKPIs
              )}
            />
          ) : (
            <ChartView
              data={getChartData(filters, filters.selectedKPIs)}
              vessels={vessels || []}
              kpis={kpis}
              filters={filters}
              onFilterChange={handleFilterChange}
              isValidForCharts={isValidForCharts}
              initialVesselId={selectedVesselForCharts} // NEW: Pass selected vessel
              performanceSummary={getKPIPerformanceSummary(
                filters,
                filters.selectedKPIs
              )}
            />
          )}

          {/* No Data State */}
          {filteredData.length === 0 && hasData && (
            <div className="card text-center py-16">
              <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-medium text-slate-300 mb-2">
                No Data Found
              </h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                No data matches your current filter criteria. Try adjusting your
                vessel selection, date range, or search terms.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button onClick={resetFilters} className="btn-secondary">
                  Reset Filters
                </button>
                <button onClick={refreshData} className="btn-primary">
                  Refresh Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Global notifications for critical alerts */}
      {hasCriticalIssues && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-red-600 border border-red-500 rounded-xl p-4 shadow-xl max-w-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium">
                  Critical Quality Issues
                </h4>
                <p className="text-red-100 text-sm">
                  {alerts.filter((a) => a.severity === 'critical').length}{' '}
                  critical issues detected
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Error boundary wrapper
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-400 mb-6">
              The application encountered an unexpected error. Please refresh
              the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export wrapped with error boundary
export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}    
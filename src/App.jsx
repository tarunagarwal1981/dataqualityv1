import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// Import custom hooks
import { useMaritimeData } from './hooks/useMaritimeData.js';
import { useFilters } from './hooks/useFilters.js';
import { useDataQuality } from './hooks/useDataQuality.js';

// Import components
import FleetHeader from './components/common/FleetHeader.jsx';
import ControlsBar, { VIEW_MODES } from './components/dashboard/ControlsBar.jsx'; // Updated ControlsBar
import TableView from './components/table/TableView.jsx';
import ChartView from './components/charts/ChartView.jsx';
import FuelAnomalyView from './components/fuel-anomaly/FuelAnomalyView.jsx'; // NEW: Fuel Anomaly View
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

// Import constants
import {
  LOADING_STATES,
  ERROR_MESSAGES,
} from './utils/constants.js';

const App = () => {
  // State for vessel navigation
  const [selectedVesselForCharts, setSelectedVesselForCharts] = useState(null);

  // NEW: Fuel Anomaly specific state
  const [fuelAnomalyConfig, setFuelAnomalyConfig] = useState({
    selectedVessel: 'vessel_1', // Default to MV Atlantic Pioneer
    sisterVessel: 'vessel_2',   // Default to MV Pacific Navigator
    analysisConfig: {
      period: 'last_6_months',
      sensitivity: 'medium',
      enabledLevels: ['lf_vs_hf', 'physics', 'benchmark']
    }
  });

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
          case 'q':
            event.preventDefault();
            updateFilter('qualityVisible', !filters.qualityVisible);
            break;
          case 'a': // NEW: Shortcut for fuel anomaly
            event.preventDefault();
            updateFilter('viewMode', VIEW_MODES.FUEL_ANOMALY);
            break;
          case '1': // Shortcut for table view
            event.preventDefault();
            updateFilter('viewMode', VIEW_MODES.TABLE);
            break;
          case '2': // Shortcut for chart view
            event.preventDefault();
            updateFilter('viewMode', VIEW_MODES.CHART);
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

  // NEW: Handle fuel anomaly configuration changes
  const handleFuelAnomalyConfigChange = (key, value) => {
    setFuelAnomalyConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle export operations
  const handleExport = async (format) => {
    try {
      if (filters.viewMode === VIEW_MODES.FUEL_ANOMALY) {
        // Generate fuel anomaly specific export
        console.log('Exporting fuel anomaly report...', {
          vessel: fuelAnomalyConfig.selectedVessel,
          sisterVessel: fuelAnomalyConfig.sisterVessel,
          config: fuelAnomalyConfig.analysisConfig,
          format
        });
        
        // Create investigation report
        const reportData = {
          vesselName: vessels?.find(v => v.id === fuelAnomalyConfig.selectedVessel)?.name || 'Unknown',
          sisterVesselName: vessels?.find(v => v.id === fuelAnomalyConfig.sisterVessel)?.name || 'Unknown',
          analysisDate: new Date().toISOString(),
          config: fuelAnomalyConfig.analysisConfig,
          // Add more report data as needed
        };
        
        downloadJSON(reportData, 'fuel-anomaly-report');
        return;
      }

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
    // For now, just log - implement actual CSV generation as needed
  };

  // JSON download helper
  const downloadJSON = (exportData, filename = 'maritime-data') => {
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
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

  // NEW: Function to handle navigation to fuel anomaly view
  const handleNavigateToFuelAnomaly = () => {
    updateFilter('viewMode', VIEW_MODES.FUEL_ANOMALY);
    // Clear selected vessel for charts when switching to fuel anomaly
    setSelectedVesselForCharts(null);
  };

  // Handle vessel click from table view
  const handleVesselClick = (vesselId) => {
    console.log('Vessel clicked:', vesselId);
    // Set the selected vessel for charts
    setSelectedVesselForCharts(vesselId);
    // Navigate to chart view
    updateFilter('viewMode', VIEW_MODES.CHART);
  };

  // NEW: Handle vessel click from fuel anomaly view (if needed)
  const handleFuelAnomalyVesselClick = (vesselId) => {
    console.log('Fuel anomaly vessel clicked:', vesselId);
    // Update the primary vessel in fuel anomaly config
    setFuelAnomalyConfig(prev => ({
      ...prev,
      selectedVessel: vesselId
    }));
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
          <button 
            onClick={resetComponentError} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
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

  // Render main application
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <FleetHeader />
      
      {/* Enhanced Controls Bar with Fuel Anomaly Support */}
      <ControlsBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onFiltersUpdate={updateFilters}
        onDataTypeChange={changeDataType}
        onDatePresetChange={setDatePreset}
        onResetFilters={resetFilters}
        onExport={handleExport}
        validationErrors={validationErrors}
        warnings={warnings}
        isValidForCharts={isValidForCharts}
        hasPerformanceWarning={hasPerformanceWarning}
        onNavigateToCharts={handleNavigateToCharts}
        onNavigateToTable={handleNavigateToTable}
        onNavigateToFuelAnomaly={handleNavigateToFuelAnomaly} // NEW
        currentView={filters.viewMode}
        // NEW: Fuel anomaly specific props
        fuelAnomalyConfig={fuelAnomalyConfig}
        onFuelAnomalyConfigChange={handleFuelAnomalyConfigChange}
        vessels={vessels || []}
        isApplyingFilters={isLoading}
        isExporting={false}
      />
      
      {/* Main Content - Single container, no sidebar */}
      <div className="flex-1 p-2 space-y-6">
        {/* Main View Rendering */}
        {filters.viewMode === VIEW_MODES.TABLE ? (
          <TableView
            data={filteredData}
            vessels={vessels || []}
            kpis={kpis}
            filters={filters}
            onFilterChange={handleFilterChange}
            qualityVisible={filters.qualityVisible}
            onExport={handleExport}
            onVesselClick={handleVesselClick}
            performanceSummary={getKPIPerformanceSummary(
              filters,
              filters.selectedKPIs
            )}
          />
        ) : filters.viewMode === VIEW_MODES.CHART ? (
          <ChartView
            data={getChartData(filters, filters.selectedKPIs)}
            vessels={vessels || []}
            kpis={kpis}
            filters={filters}
            onFilterChange={handleFilterChange}
            isValidForCharts={isValidForCharts}
            initialVesselId={selectedVesselForCharts}
            performanceSummary={getKPIPerformanceSummary(
              filters,
              filters.selectedKPIs
            )}
          />
        ) : filters.viewMode === VIEW_MODES.FUEL_ANOMALY ? (
          // NEW: Fuel Anomaly View
          <FuelAnomalyView
            selectedVessel={fuelAnomalyConfig.selectedVessel}
            sisterVessel={fuelAnomalyConfig.sisterVessel}
            analysisConfig={fuelAnomalyConfig.analysisConfig}
            onVesselClick={handleFuelAnomalyVesselClick}
            onConfigChange={handleFuelAnomalyConfigChange}
            onExport={handleExport}
            vessels={vessels || []}
          />
        ) : (
          // Fallback to table view
          <TableView
            data={filteredData}
            vessels={vessels || []}
            kpis={kpis}
            filters={filters}
            onFilterChange={handleFilterChange}
            qualityVisible={filters.qualityVisible}
            onExport={handleExport}
            onVesselClick={handleVesselClick}
            performanceSummary={getKPIPerformanceSummary(
              filters,
              filters.selectedKPIs
            )}
          />
        )}

        {/* No Data State - Only for Table/Chart views */}
        {filteredData.length === 0 && hasData && filters.viewMode !== VIEW_MODES.FUEL_ANOMALY && (
          <div className="bg-slate-800/50 border border-white/10 rounded-lg p-16 text-center">
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
              <button 
                onClick={resetFilters} 
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors"
              >
                Reset Filters
              </button>
              <button 
                onClick={refreshData} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Global notifications for critical alerts - Enhanced for fuel anomaly */}
      {hasCriticalIssues && filters.viewMode !== VIEW_MODES.FUEL_ANOMALY && (
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

      {/* NEW: Fuel Anomaly Alert Notification */}
      {filters.viewMode === VIEW_MODES.FUEL_ANOMALY && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-orange-600 border border-orange-500 rounded-xl p-4 shadow-xl max-w-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium">
                  Fuel Anomaly Detection
                </h4>
                <p className="text-orange-100 text-sm">
                  Monitoring {vessels?.find(v => v.id === fuelAnomalyConfig.selectedVessel)?.name || 'vessel'} for suspicious patterns
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
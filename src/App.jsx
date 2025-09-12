import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// Import custom hooks
import { useMaritimeData } from './hooks/useMaritimeData.js';
import { useFilters } from './hooks/useFilters.js';
import { useDataQuality } from './hooks/useDataQuality.js';

// Import components
import FleetHeader from './components/common/FleetHeader.jsx';
import ControlsBar, { VIEW_MODES } from './components/dashboard/ControlsBar.jsx';
import TableView from './components/table/TableView.jsx';
import ChartView from './components/charts/ChartView.jsx';
import FuelAnomalyView from './components/fuel-anomaly/FuelAnomalyView.jsx';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

// Import constants
import {
  LOADING_STATES,
  ERROR_MESSAGES,
  DEFAULT_FILTERS
} from './utils/constants.js';

const App = () => {
  const [selectedVesselForCharts, setSelectedVesselForCharts] = useState(null);

  const [fuelAnomalyConfig, setFuelAnomalyConfig] = useState({
    selectedVessel: 'vessel_1',
    sisterVessel: 'vessel_2',
    analysisConfig: {
      period: 'last_6_months',
      sensitivity: 'medium',
      enabledLevels: ['lf_vs_hf', 'physics', 'benchmark']
    }
  });

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
            handleQualityToggle(!filters.qualityVisible);
            break;
          case 'a':
            event.preventDefault();
            updateFilter('viewMode', VIEW_MODES.FUEL_ANOMALY);
            break;
          case '1':
            event.preventDefault();
            updateFilter('viewMode', VIEW_MODES.TABLE);
            break;
          case '2':
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

  const [componentError, setComponentError] = useState(null);

  const handleComponentError = (error, errorInfo) => {
    console.error('Component error:', error, errorInfo);
    setComponentError(error);
  };

  const resetComponentError = () => {
    setComponentError(null);
  };

  const handleFilterChange = (key, value) => {
    try {
      updateFilter(key, value);
    } catch (error) {
      console.error('Filter update error:', error);
    }
  };

  const handleQualityToggle = (qualityVisible) => {
    console.log('Quality toggle changed:', qualityVisible);
    updateFilter('qualityVisible', qualityVisible);
  };

  const handleFuelAnomalyConfigChange = (key, value) => {
    setFuelAnomalyConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExport = async (format) => {
    try {
      if (filters.viewMode === VIEW_MODES.FUEL_ANOMALY) {
        console.log('Exporting fuel anomaly report...', {
          vessel: fuelAnomalyConfig.selectedVessel,
          sisterVessel: fuelAnomalyConfig.sisterVessel,
          config: fuelAnomalyConfig.analysisConfig,
          format
        });
        
        const reportData = {
          vesselName: vessels?.find(v => v.id === fuelAnomalyConfig.selectedVessel)?.name || 'Unknown',
          sisterVesselName: vessels?.find(v => v.id === fuelAnomalyConfig.sisterVessel)?.name || 'Unknown',
          analysisDate: new Date().toISOString(),
          config: fuelAnomalyConfig.analysisConfig,
          qualityEnabled: filters.qualityVisible,
        };
        
        downloadJSON(reportData, 'fuel-anomaly-report');
        return;
      }

      const exportData = {
        ...getExportData(filters, format),
        qualityEnabled: filters.qualityVisible,
        exportDate: new Date().toISOString(),
        viewMode: filters.viewMode
      };

      if (format === 'csv') {
        downloadCSV(exportData);
      } else if (format === 'json') {
        downloadJSON(exportData);
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const downloadCSV = (exportData) => {
    console.log('CSV export:', exportData);
  };

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

  const handleNavigateToCharts = () => {
    updateFilter('viewMode', VIEW_MODES.CHART);
    setSelectedVesselForCharts(null);
  };

  const handleNavigateToTable = () => {
    updateFilter('viewMode', VIEW_MODES.TABLE);
    setSelectedVesselForCharts(null);
  };

  const handleNavigateToFuelAnomaly = () => {
    updateFilter('viewMode', VIEW_MODES.FUEL_ANOMALY);
    setSelectedVesselForCharts(null);
  };

  const handleVesselClick = (vessel) => {
    console.log('Vessel clicked:', vessel);
    
    let vesselId;
    if (typeof vessel === 'string') {
      vesselId = vessel;
    } else if (vessel && vessel.id) {
      vesselId = vessel.id.startsWith('vessel_') ? vessel.id : `vessel_${vessel.id}`;
    } else {
      console.error('Invalid vessel format:', vessel);
      return;
    }
    
    console.log('Setting selected vessel for charts:', vesselId);
    
    setSelectedVesselForCharts(vesselId);
    updateFilter('viewMode', VIEW_MODES.CHART);
  };

  const handleFuelAnomalyVesselClick = (vesselId) => {
    console.log('Fuel anomaly vessel clicked:', vesselId);
    setFuelAnomalyConfig(prev => ({
      ...prev,
      selectedVessel: vesselId
    }));
  };

  if (componentError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Application Error
          </h1>
          <p className="text-gray-600 mb-6">
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

  if (loadingState === LOADING_STATES.LOADING) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FleetHeader />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <LoadingSpinner size="large" message="Loading maritime data..." />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FleetHeader />
        <div className="flex items-center justify-center h-[calc(100vh-80px)] p-6">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Failed to Load Data
            </h2>
            <p className="text-gray-600 mb-6">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <FleetHeader />
      
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
        onNavigateToFuelAnomaly={handleNavigateToFuelAnomaly}
        currentView={filters.viewMode}
        onQualityToggle={handleQualityToggle}
        fuelAnomalyConfig={fuelAnomalyConfig}
        onFuelAnomalyConfigChange={handleFuelAnomalyConfigChange}
        vessels={vessels || []}
        isApplyingFilters={isLoading}
        isExporting={false}
      />
      
      <div className="flex-1 p-3 space-y-4">
        {filters.viewMode === VIEW_MODES.TABLE ? (
          <div className="animate-fade-in">
            <TableView
              data={filteredData}
              vessels={vessels || []}
              kpis={kpis}
              filters={filters}
              onFilterChange={handleFilterChange}
              qualityVisible={filters.qualityVisible}
              onQualityToggle={handleQualityToggle}
              onExport={handleExport}
              onVesselClick={handleVesselClick}
              performanceSummary={getKPIPerformanceSummary(
                filters,
                filters.selectedKPIs
              )}
            />
          </div>
        ) : filters.viewMode === VIEW_MODES.CHART ? (
          <div className="animate-fade-in">
            <ChartView
              data={getChartData(filters, filters.selectedKPIs)}
              vessels={vessels || []}
              kpis={kpis}
              filters={filters}
              onFilterChange={handleFilterChange}
              isValidForCharts={isValidForCharts}
              initialVesselId={selectedVesselForCharts}
              qualityVisible={filters.qualityVisible}
              onQualityToggle={handleQualityToggle}
              performanceSummary={getKPIPerformanceSummary(
                filters,
                filters.selectedKPIs
              )}
            />
          </div>
        ) : filters.viewMode === VIEW_MODES.FUEL_ANOMALY ? (
          <div className="animate-fade-in">
            <FuelAnomalyView
              selectedVessel={fuelAnomalyConfig.selectedVessel}
              sisterVessel={fuelAnomalyConfig.sisterVessel}
              analysisConfig={fuelAnomalyConfig.analysisConfig}
              onVesselClick={handleFuelAnomalyVesselClick}
              onConfigChange={handleFuelAnomalyConfigChange}
              onExport={handleExport}
              vessels={vessels || []}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <TableView
              data={filteredData}
              vessels={vessels || []}
              kpis={kpis}
              filters={filters}
              onFilterChange={handleFilterChange}
              qualityVisible={filters.qualityVisible}
              onQualityToggle={handleQualityToggle}
              onExport={handleExport}
              onVesselClick={handleVesselClick}
              performanceSummary={getKPIPerformanceSummary(
                filters,
                filters.selectedKPIs
              )}
            />
          </div>
        )}

        {filteredData.length === 0 && hasData && filters.viewMode !== VIEW_MODES.FUEL_ANOMALY && (
          <div className="card-elevated p-16 text-center animate-bounce-in">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <AlertTriangle className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Data Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              No data matches your current filter criteria. Try adjusting your
              vessel selection, date range, or search terms.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={resetFilters} 
                className="btn-secondary hover-lift"
              >
                Reset Filters
              </button>
              <button 
                onClick={refreshData} 
                className="btn-primary hover-lift"
              >
                Refresh Data
              </button>
            </div>
          </div>
        )}
      </div>
      
      {hasCriticalIssues && 
       filters.viewMode !== VIEW_MODES.FUEL_ANOMALY && 
       filters.qualityVisible && (
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

      {!filters.qualityVisible && 
       filters.viewMode !== VIEW_MODES.FUEL_ANOMALY && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="bg-blue-600 border border-blue-500 rounded-xl p-4 shadow-xl max-w-sm">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-white flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium">
                  Quality Analysis Disabled
                </h4>
                <p className="text-blue-100 text-sm">
                  Data quality indicators are hidden. Toggle quality to see issues.
                </p>
              </div>
              <button
                onClick={() => handleQualityToggle(true)}
                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-400 transition-colors"
              >
                Enable
              </button>
            </div>
          </div>
        </div>
      )}

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

      <div className="fixed bottom-4 right-4 z-40 opacity-0 hover:opacity-100 transition-opacity">
        <div className="bg-gray-800/90 border border-gray-200/20 rounded-lg p-3 text-xs text-gray-700">
          <div className="font-semibold mb-1">Keyboard Shortcuts:</div>
          <div>Ctrl+Q: Toggle Quality • Ctrl+1: Table • Ctrl+2: Charts • Ctrl+A: Fuel Anomaly</div>
        </div>
      </div>
    </div>
  );
};

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
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

export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  generateMaritimeData,
  generateQualityStatistics,
} from '../data/mockData.js';
import { getDefaultKPIs } from '../data/kpiDefinitions.js';
import {
  DEFAULT_FILTERS,
  LOADING_STATES,
  DATA_TYPES,
} from '../utils/constants.js';

/**
 * Custom hook for managing maritime data state and operations
 * Provides data loading, filtering, quality assessment, and caching
 */
export const useMaritimeData = () => {
  // Core data state
  const [rawData, setRawData] = useState(null);
  const [loadingState, setLoadingState] = useState(LOADING_STATES.INITIAL);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Initialize data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Load maritime data (simulates API call)
  const loadData = useCallback(async () => {
    try {
      setLoadingState(LOADING_STATES.LOADING);
      setError(null);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const data = generateMaritimeData();
      setRawData(data);
      setLastUpdated(new Date().toISOString());
      setLoadingState(LOADING_STATES.SUCCESS);
    } catch (err) {
      setError(err.message || 'Failed to load maritime data');
      setLoadingState(LOADING_STATES.ERROR);
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(async () => {
    try {
      setLoadingState(LOADING_STATES.REFRESHING);
      setError(null);

      // Simulate refresh delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const data = generateMaritimeData();
      setRawData(data);
      setLastUpdated(new Date().toISOString());
      setLoadingState(LOADING_STATES.SUCCESS);
    } catch (err) {
      setError(err.message || 'Failed to refresh data');
      setLoadingState(LOADING_STATES.ERROR);
    }
  }, []);

  // Get filtered data based on current filters
  const getFilteredData = useCallback(
    (filters) => {
      if (!rawData) return [];

      return rawData.data.filter((item) => {
        // Vessel filter
        if (
          filters.selectedVessels.length > 0 &&
          !filters.selectedVessels.includes(item.vesselId)
        ) {
          return false;
        }

        // Date range filter
        if (filters.dateRange.start && item.date < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && item.date > filters.dateRange.end) {
          return false;
        }

        // Search term filter
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          if (
            !item.vesselName.toLowerCase().includes(searchLower) &&
            !item.vesselType.toLowerCase().includes(searchLower) &&
            !item.vesselFlag.toLowerCase().includes(searchLower)
          ) {
            return false;
          }
        }

        return true;
      });
    },
    [rawData]
  );

  // Get data for chart visualization
  const getChartData = useCallback(
    (filters, kpiIds) => {
      const filteredData = getFilteredData(filters);
      if (!filteredData.length || !kpiIds.length) return [];

      const chartData = [];
      const dataType =
        filters.dataType === DATA_TYPES.COMBINED ? 'lf' : filters.dataType;

      // Group data by date
      const dataByDate = filteredData.reduce((acc, item) => {
        if (!acc[item.date]) {
          acc[item.date] = {};
        }
        acc[item.date][item.vesselId] = item;
        return acc;
      }, {});

      // Transform to chart format
      Object.keys(dataByDate)
        .sort()
        .forEach((date) => {
          const dateData = { date };

          filters.selectedVessels.forEach((vesselId) => {
            const vesselData = dataByDate[date][vesselId];
            if (vesselData) {
              kpiIds.forEach((kpiId) => {
                const value = vesselData[dataType][kpiId];
                if (value !== null && value !== undefined) {
                  dateData[`${vesselId}_${kpiId}`] = value;
                }
              });
            }
          });

          chartData.push(dateData);
        });

      return chartData;
    },
    [getFilteredData]
  );

  // Get quality statistics for current filters
  const getQualityStats = useCallback(
    (filters) => {
      const filteredData = getFilteredData(filters);
      return generateQualityStatistics(filteredData);
    },
    [getFilteredData]
  );

  // Get vessel summary data
  const getVesselSummary = useCallback(() => {
    if (!rawData) return {};

    return rawData.vessels.reduce((acc, vessel) => {
      const vesselData = rawData.data.filter(
        (item) => item.vesselId === vessel.id
      );
      const latestData = vesselData[vesselData.length - 1];

      acc[vessel.id] = {
        ...vessel,
        dataPoints: vesselData.length,
        lastReport: latestData?.date,
        qualityGrade: latestData?.quality.grade.lf,
        currentStatus: latestData?.vesselStatus || vessel.status,
        location: latestData?.location || vessel.currentLocation,
      };

      return acc;
    }, {});
  }, [rawData]);

  // Get KPI performance summary
  const getKPIPerformanceSummary = useCallback(
    (filters, kpiIds) => {
      const filteredData = getFilteredData(filters);
      if (!filteredData.length || !kpiIds.length) return {};

      const dataType =
        filters.dataType === DATA_TYPES.COMBINED ? 'lf' : filters.dataType;
      const summary = {};

      kpiIds.forEach((kpiId) => {
        const values = filteredData
          .map((item) => item[dataType][kpiId])
          .filter((val) => val !== null && val !== undefined);

        if (values.length > 0) {
          summary[kpiId] = {
            count: values.length,
            min: Math.min(...values),
            max: Math.max(...values),
            avg: values.reduce((sum, val) => sum + val, 0) / values.length,
            trend: calculateTrend(values),
            completeness: (values.length / filteredData.length) * 100,
          };
        }
      });

      return summary;
    },
    [getFilteredData]
  );

  // Calculate trend direction for values array
  const calculateTrend = (values) => {
    if (values.length < 2) return 'stable';

    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (Math.abs(change) < 5) return 'stable';
    return change > 0 ? 'increasing' : 'decreasing';
  };

  // Get data export payload
  const getExportData = useCallback(
    (filters, format = 'csv') => {
      const filteredData = getFilteredData(filters);
      const dataType =
        filters.dataType === DATA_TYPES.COMBINED ? 'both' : filters.dataType;

      const exportPayload = {
        metadata: {
          exportDate: new Date().toISOString(),
          dataType: filters.dataType,
          dateRange: filters.dateRange,
          vesselCount: filters.selectedVessels.length,
          recordCount: filteredData.length,
          kpiCount: filters.selectedKPIs.length,
          format,
        },
        filters: {
          vessels: filters.selectedVessels,
          kpis: filters.selectedKPIs,
          dateRange: filters.dateRange,
          qualityVisible: filters.qualityVisible,
        },
        data: filteredData.map((item) => ({
          ...item,
          // Include only selected KPIs if specified
          lf:
            filters.selectedKPIs.length > 0
              ? Object.fromEntries(
                  filters.selectedKPIs.map((kpi) => [kpi, item.lf[kpi]])
                )
              : item.lf,
          hf:
            filters.selectedKPIs.length > 0
              ? Object.fromEntries(
                  filters.selectedKPIs.map((kpi) => [kpi, item.hf[kpi]])
                )
              : item.hf,
        })),
      };

      return exportPayload;
    },
    [getFilteredData]
  );

  // Get alert summary
  const getAlertSummary = useCallback(
    (filters) => {
      const filteredData = getFilteredData(filters);

      const alerts = {
        critical: 0,
        warning: 0,
        info: 0,
        total: 0,
        byVessel: {},
        recent: [],
      };

      filteredData.forEach((item) => {
        // Count quality issues
        alerts.total += item.quality.issues.length;
        alerts.warning += item.quality.issues.length;

        // Count HF alarms
        if (item.quality.alerts) {
          item.quality.alerts.forEach((alert) => {
            alerts.total++;
            if (alert.type === 'high' || alert.type === 'low') {
              alerts.critical++;
            }

            // Track recent alerts (last 7 days)
            const alertDate = new Date(item.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            if (alertDate >= weekAgo) {
              alerts.recent.push({
                ...alert,
                vesselName: item.vesselName,
                date: item.date,
              });
            }
          });
        }

        // Track by vessel
        if (!alerts.byVessel[item.vesselId]) {
          alerts.byVessel[item.vesselId] = {
            name: item.vesselName,
            count: 0,
          };
        }
        alerts.byVessel[item.vesselId].count +=
          item.quality.issues.length +
          (item.quality.alerts ? item.quality.alerts.length : 0);
      });

      // Sort recent alerts by date
      alerts.recent.sort((a, b) => new Date(b.date) - new Date(a.date));

      return alerts;
    },
    [getFilteredData]
  );

  // Performance metrics
  const getPerformanceMetrics = useCallback(() => {
    if (!rawData) return null;

    return {
      totalDataPoints: rawData.data.length,
      dataLoadTime:
        loadingState === LOADING_STATES.SUCCESS ? 'Under 1s' : 'Loading...',
      lastRefresh: lastUpdated,
      cacheStatus: 'Active',
      apiStatus: loadingState === LOADING_STATES.ERROR ? 'Error' : 'Connected',
    };
  }, [rawData, loadingState, lastUpdated]);

  // Memoized computed values
  const computedValues = useMemo(() => {
    if (!rawData) return null;

    return {
      vessels: rawData.vessels,
      kpis: rawData.kpis,
      totalRecords: rawData.data.length,
      dateRange: {
        earliest: rawData.data[0]?.date,
        latest: rawData.data[rawData.data.length - 1]?.date,
      },
      vesselsWithData: [...new Set(rawData.data.map((item) => item.vesselId))],
      qualityOverview: generateQualityStatistics(rawData.data),
    };
  }, [rawData]);

  return {
    // Data state
    rawData,
    loadingState,
    error,
    lastUpdated,

    // Computed values
    ...computedValues,

    // Data operations
    loadData,
    refreshData,
    getFilteredData,
    getChartData,
    getQualityStats,
    getVesselSummary,
    getKPIPerformanceSummary,
    getExportData,
    getAlertSummary,
    getPerformanceMetrics,

    // State checks
    isLoading: loadingState === LOADING_STATES.LOADING,
    isRefreshing: loadingState === LOADING_STATES.REFRESHING,
    hasError: loadingState === LOADING_STATES.ERROR,
    hasData: rawData !== null,
    isEmpty: rawData?.data.length === 0,
  };
};

export default useMaritimeData;

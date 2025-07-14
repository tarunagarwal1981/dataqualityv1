import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DEFAULT_FILTERS,
  DATA_TYPES,
  VIEW_MODES,
  PERFORMANCE_LIMITS,
} from '../utils/constants.js';
import { getDefaultKPIs } from '../data/kpiDefinitions.js';

/**
 * Custom hook for managing filter state and validation
 * Handles vessel selection, date ranges, KPI selection, and filter persistence
 */
export const useFilters = (vessels = [], kpis = {}) => {
  // Core filter state
  const [filters, setFilters] = useState(() => {
    // Try to load saved filters from localStorage
    const savedFilters = loadSavedFilters();
    return savedFilters || DEFAULT_FILTERS;
  });

  // Error and validation state
  const [validationErrors, setValidationErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);

  // Initialize default selections when vessels/kpis are available
  useEffect(() => {
    if (vessels.length > 0 && filters.selectedVessels.length === 0) {
      const defaultVessels = vessels.slice(0, 3).map((v) => v.id);
      updateFilter('selectedVessels', defaultVessels);
    }
  }, [vessels, filters.selectedVessels.length]);

  useEffect(() => {
    if (kpis[filters.dataType] && filters.selectedKPIs.length === 0) {
      const defaultKPIs = getDefaultKPIs(filters.dataType);
      updateFilter('selectedKPIs', defaultKPIs);
    }
  }, [kpis, filters.dataType, filters.selectedKPIs.length]);

  // Set default date range (last 7 days)
  useEffect(() => {
    if (!filters.dateRange.start || !filters.dateRange.end) {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);

      updateFilter('dateRange', {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      });
    }
  }, [filters.dateRange.start, filters.dateRange.end]);

  // Update a single filter with validation
  const updateFilter = useCallback(
    (key, value) => {
      setFilters((prev) => {
        const newFilters = { ...prev, [key]: value };

        // Validate the updated filters
        const { errors, warnings } = validateFilters(newFilters, vessels, kpis);
        setValidationErrors(errors);
        setWarnings(warnings);

        // Save to localStorage
        saveFilters(newFilters);

        return newFilters;
      });
    },
    [vessels, kpis]
  );

  // Batch update multiple filters
  const updateFilters = useCallback(
    (updates) => {
      setFilters((prev) => {
        const newFilters = { ...prev, ...updates };

        // Validate the updated filters
        const { errors, warnings } = validateFilters(newFilters, vessels, kpis);
        setValidationErrors(errors);
        setWarnings(warnings);

        // Save to localStorage
        saveFilters(newFilters);

        return newFilters;
      });
    },
    [vessels, kpis]
  );

  // Reset filters to defaults
  const resetFilters = useCallback(() => {
    const defaultFilters = {
      ...DEFAULT_FILTERS,
      selectedVessels: vessels.slice(0, 3).map((v) => v.id),
      selectedKPIs: getDefaultKPIs(DEFAULT_FILTERS.dataType),
      dateRange: {
        start: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        end: new Date().toISOString().split('T')[0],
      },
    };

    setFilters(defaultFilters);
    setValidationErrors([]);
    setWarnings([]);
    saveFilters(defaultFilters);
  }, [vessels]);

  // Handle data type change with KPI reset
  const changeDataType = useCallback(
    (newDataType) => {
      const newKPIs = getDefaultKPIs(newDataType);
      updateFilters({
        dataType: newDataType,
        selectedKPIs: newKPIs,
      });
    },
    [updateFilters]
  );

  // Handle vessel selection with limits
  const toggleVessel = useCallback(
    (vesselId) => {
      const isSelected = filters.selectedVessels.includes(vesselId);
      let newSelection;

      if (isSelected) {
        newSelection = filters.selectedVessels.filter((id) => id !== vesselId);
      } else {
        newSelection = [...filters.selectedVessels, vesselId];
      }

      updateFilter('selectedVessels', newSelection);
    },
    [filters.selectedVessels, updateFilter]
  );

  // Handle KPI selection
  const toggleKPI = useCallback(
    (kpiId) => {
      const isSelected = filters.selectedKPIs.includes(kpiId);
      let newSelection;

      if (isSelected) {
        newSelection = filters.selectedKPIs.filter((id) => id !== kpiId);
      } else {
        newSelection = [...filters.selectedKPIs, kpiId];
      }

      updateFilter('selectedKPIs', newSelection);
    },
    [filters.selectedKPIs, updateFilter]
  );

  // Bulk vessel selection
  const selectAllVessels = useCallback(() => {
    updateFilter(
      'selectedVessels',
      vessels.map((v) => v.id)
    );
  }, [vessels, updateFilter]);

  const clearVesselSelection = useCallback(() => {
    updateFilter('selectedVessels', []);
  }, [updateFilter]);

  // Bulk KPI selection by category
  const selectKPIsByCategory = useCallback(
    (category) => {
      const categoryKPIs = (kpis[filters.dataType] || [])
        .filter((kpi) => kpi.category === category)
        .map((kpi) => kpi.id);

      const newSelection = [
        ...new Set([...filters.selectedKPIs, ...categoryKPIs]),
      ];

      updateFilter('selectedKPIs', newSelection);
    },
    [kpis, filters.dataType, filters.selectedKPIs, updateFilter]
  );

  // Date range presets
  const setDatePreset = useCallback(
    (preset) => {
      const end = new Date();
      const start = new Date();

      switch (preset) {
        case 'today':
          start.setDate(end.getDate());
          break;
        case 'yesterday':
          start.setDate(end.getDate() - 1);
          end.setDate(end.getDate() - 1);
          break;
        case 'last_7_days':
          start.setDate(end.getDate() - 6);
          break;
        case 'last_30_days':
          start.setDate(end.getDate() - 29);
          break;
        case 'last_90_days':
          start.setDate(end.getDate() - 89);
          break;
        default:
          return;
      }

      updateFilter('dateRange', {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      });
    },
    [updateFilter]
  );

  // Computed filter summary
  const filterSummary = useMemo(() => {
    const dateRangeText =
      filters.dateRange.start && filters.dateRange.end
        ? `${filters.dateRange.start} to ${filters.dateRange.end}`
        : 'No date range';

    const dayCount =
      filters.dateRange.start && filters.dateRange.end
        ? Math.ceil(
            (new Date(filters.dateRange.end) -
              new Date(filters.dateRange.start)) /
              (1000 * 60 * 60 * 24)
          ) + 1
        : 0;

    return {
      vesselCount: filters.selectedVessels.length,
      kpiCount: filters.selectedKPIs.length,
      dateRange: dateRangeText,
      dayCount,
      dataType: filters.dataType,
      hasSearch: !!filters.searchTerm,
      totalFilters:
        filters.selectedVessels.length +
        filters.selectedKPIs.length +
        (filters.searchTerm ? 1 : 0) +
        (filters.dateRange.start ? 1 : 0),
    };
  }, [filters]);

  // Check if current selection is valid for charts
  const isValidForCharts = useMemo(() => {
    const maxVessels =
      filters.dataType === DATA_TYPES.LF
        ? PERFORMANCE_LIMITS.MAX_CHART_VESSELS_LF
        : PERFORMANCE_LIMITS.MAX_CHART_VESSELS_HF;

    return (
      filters.selectedVessels.length > 0 &&
      filters.selectedVessels.length <= maxVessels &&
      filters.selectedKPIs.length > 0
    );
  }, [
    filters.selectedVessels.length,
    filters.selectedKPIs.length,
    filters.dataType,
  ]);

  // Check if current selection might have performance issues
  const hasPerformanceWarning = useMemo(() => {
    const dayCount = filterSummary.dayCount;
    const vesselCount = filters.selectedVessels.length;

    return (
      (vesselCount > PERFORMANCE_LIMITS.MAX_VESSELS_MULTI_DATE &&
        dayCount > PERFORMANCE_LIMITS.MAX_DAYS_MULTI_VESSEL) ||
      vesselCount * dayCount * filters.selectedKPIs.length > 10000
    );
  }, [
    filterSummary.dayCount,
    filters.selectedVessels.length,
    filters.selectedKPIs.length,
  ]);

  return {
    // Current filter state
    filters,
    validationErrors,
    warnings,

    // Filter operations
    updateFilter,
    updateFilters,
    resetFilters,
    changeDataType,

    // Vessel operations
    toggleVessel,
    selectAllVessels,
    clearVesselSelection,

    // KPI operations
    toggleKPI,
    selectKPIsByCategory,

    // Date operations
    setDatePreset,

    // Computed values
    filterSummary,
    isValidForCharts,
    hasPerformanceWarning,

    // State checks
    hasFilters: filterSummary.totalFilters > 0,
    isEmpty:
      filters.selectedVessels.length === 0 && filters.selectedKPIs.length === 0,
    hasErrors: validationErrors.length > 0,
    hasWarnings: warnings.length > 0,
  };
};

// Validation function
const validateFilters = (filters, vessels, kpis) => {
  const errors = [];
  const warnings = [];

  // Validate vessel selection
  if (filters.selectedVessels.length === 0) {
    warnings.push('No vessels selected - data will be empty');
  }

  // Validate KPI selection
  if (filters.selectedKPIs.length === 0) {
    warnings.push('No KPIs selected - no data columns will be displayed');
  }

  // Validate date range
  if (filters.dateRange.start && filters.dateRange.end) {
    const start = new Date(filters.dateRange.start);
    const end = new Date(filters.dateRange.end);

    if (start > end) {
      errors.push('Start date must be before end date');
    }

    const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (dayDiff > 365) {
      warnings.push('Large date range may impact performance');
    }
  }

  // Validate performance limits
  const vesselCount = filters.selectedVessels.length;
  const dayCount =
    filters.dateRange.start && filters.dateRange.end
      ? Math.ceil(
          (new Date(filters.dateRange.end) -
            new Date(filters.dateRange.start)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  if (
    vesselCount > PERFORMANCE_LIMITS.MAX_VESSELS_MULTI_DATE &&
    dayCount > PERFORMANCE_LIMITS.MAX_DAYS_MULTI_VESSEL
  ) {
    warnings.push(
      `Performance warning: ${vesselCount} vessels over ${dayCount} days may be slow`
    );
  }

  // Validate chart mode limits
  if (filters.viewMode === VIEW_MODES.CHART) {
    const maxVessels =
      filters.dataType === DATA_TYPES.LF
        ? PERFORMANCE_LIMITS.MAX_CHART_VESSELS_LF
        : PERFORMANCE_LIMITS.MAX_CHART_VESSELS_HF;

    if (vesselCount > maxVessels) {
      warnings.push(
        `Chart mode limited to ${maxVessels} vessels for ${filters.dataType.toUpperCase()} data`
      );
    }
  }

  return { errors, warnings };
};

// Save filters to localStorage
const saveFilters = (filters) => {
  try {
    localStorage.setItem(
      'maritime_dashboard_filters',
      JSON.stringify({
        ...filters,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.warn('Failed to save filters to localStorage:', error);
  }
};

// Load filters from localStorage
const loadSavedFilters = () => {
  try {
    const saved = localStorage.getItem('maritime_dashboard_filters');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Check if saved filters are recent (less than 24 hours old)
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
        delete parsed.timestamp;
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load saved filters:', error);
  }
  return null;
};

export default useFilters;

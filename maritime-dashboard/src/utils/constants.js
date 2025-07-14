// Application constants and configuration

export const APP_CONFIG = {
  name: 'Ocean Eye',
  subtitle: 'Maritime Data Intelligence Platform',
  version: '1.0.0',
  author: 'Ocean Eye Maritime Solutions',
};

export const DATA_TYPES = {
  LF: 'lf',
  HF: 'hf',
  COMBINED: 'combined',
};

export const VIEW_MODES = {
  TABLE: 'table',
  CHART: 'chart',
};

export const QUALITY_GRADES = {
  GOOD: 'Good',
  ACCEPTABLE: 'Acceptable',
  POOR: 'Poor',
};

export const VESSEL_STATUS = {
  ACTIVE: 'Active',
  IN_PORT: 'In Port',
  MAINTENANCE: 'Maintenance',
  OFFLINE: 'Offline',
};

export const QUALITY_THRESHOLDS = {
  COMPLETENESS: {
    GOOD: 95,
    ACCEPTABLE: 85,
  },
  CORRECTNESS: {
    GOOD: 98,
    ACCEPTABLE: 90,
  },
};

export const PERFORMANCE_LIMITS = {
  MAX_VESSELS_MULTI_DATE: 20,
  MAX_DAYS_MULTI_VESSEL: 10,
  MAX_CHART_VESSELS_LF: 5,
  MAX_CHART_VESSELS_HF: 3,
  MAX_TABLE_ROWS: 1000,
  PAGINATION_SIZE: 50,
};

export const HF_AGGREGATION_LEVELS = {
  RAW: 'raw',
  HOUR_1: '1hr',
  HOUR_3: '3hr',
  HOUR_12: '12hr',
  HOUR_24: '24hr',
};

export const EXPORT_FORMATS = {
  CSV: 'csv',
  PDF: 'pdf',
  PNG: 'png',
  JSON: 'json',
};

export const DATE_PRESETS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days',
  CUSTOM: 'custom',
};

export const KPI_CATEGORIES = {
  FUEL_BUNKER: 'Fuel & Bunker',
  NAVIGATION: 'Navigation',
  ENGINE: 'Engine',
  WEATHER: 'Weather',
  CARGO: 'Cargo',
  OPERATIONS: 'Operations',
  SAFETY: 'Safety',
  ENVIRONMENTAL: 'Environmental',
};

export const DATA_UPDATE_INTERVALS = {
  LF: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
  HF: 5 * 60 * 1000, // 5 minutes in milliseconds
  QUALITY_CHECK: 15 * 60 * 1000, // 15 minutes in milliseconds
};

export const ALERT_TYPES = {
  QUALITY_DEGRADATION: 'quality_degradation',
  MISSING_DATA: 'missing_data',
  CONSISTENCY_ISSUE: 'consistency_issue',
  VALIDATION_ERROR: 'validation_error',
};

export const USER_ROLES = {
  FLEET_MANAGER: 'Fleet Manager',
  COMPLIANCE: 'Compliance',
  TECHNICAL: 'Technical',
  ADMIN: 'Admin',
};

export const API_ENDPOINTS = {
  VESSELS: '/api/vessels',
  DATA: '/api/data',
  QUALITY: '/api/quality',
  EXPORT: '/api/export',
  ALERTS: '/api/alerts',
};

export const CHART_COLORS = [
  '#0ea5e9', // Ocean blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#ec4899', // Pink
  '#6366f1', // Indigo
];

export const RESPONSIVE_BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

export const Z_INDEX_LAYERS = {
  DROPDOWN: 50,
  MODAL: 100,
  TOOLTIP: 200,
  NOTIFICATION: 300,
};

// Data validation ranges for different KPIs
export const VALIDATION_RANGES = {
  fuel_consumption: { min: 0, max: 200 },
  distance: { min: 0, max: 1000 },
  avg_speed: { min: 0, max: 30 },
  cargo_weight: { min: 0, max: 50000 },
  crew_count: { min: 10, max: 50 },
  port_calls: { min: 0, max: 5 },
  engine_rpm: { min: 0, max: 1200 },
  fuel_rate: { min: 0, max: 5000 },
  engine_temp: { min: 40, max: 120 },
  oil_pressure: { min: 0, max: 10 },
  wind_speed: { min: 0, max: 50 },
  sea_state: { min: 0, max: 9 },
};

// Default filter selections
export const DEFAULT_FILTERS = {
  dataType: DATA_TYPES.LF,
  viewMode: VIEW_MODES.TABLE,
  qualityVisible: true,
  showFilters: true,
  selectedVessels: [],
  selectedKPIs: [],
  dateRange: {
    start: '',
    end: '',
  },
  searchTerm: '',
  hfAggregation: HF_AGGREGATION_LEVELS.HOUR_24,
};

// Error messages
export const ERROR_MESSAGES = {
  DATA_LOAD_FAILED: 'Failed to load data. Please try again.',
  EXPORT_FAILED: 'Export failed. Please try again.',
  VALIDATION_FAILED: 'Data validation failed.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER_ERROR: 'Server error. Please contact support.',
  INVALID_DATE_RANGE: 'Invalid date range selected.',
  MAX_VESSELS_EXCEEDED: 'Maximum number of vessels exceeded.',
  NO_DATA_AVAILABLE: 'No data available for the selected criteria.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  DATA_EXPORTED: 'Data exported successfully.',
  FILTERS_SAVED: 'Filter preferences saved.',
  SETTINGS_UPDATED: 'Settings updated successfully.',
  ALERT_DISMISSED: 'Alert dismissed.',
  REPORT_GENERATED: 'Report generated successfully.',
};

// Loading states
export const LOADING_STATES = {
  INITIAL: 'initial',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  REFRESHING: 'refreshing',
};

export default {
  APP_CONFIG,
  DATA_TYPES,
  VIEW_MODES,
  QUALITY_GRADES,
  VESSEL_STATUS,
  QUALITY_THRESHOLDS,
  PERFORMANCE_LIMITS,
  HF_AGGREGATION_LEVELS,
  EXPORT_FORMATS,
  DATE_PRESETS,
  KPI_CATEGORIES,
  DATA_UPDATE_INTERVALS,
  ALERT_TYPES,
  USER_ROLES,
  API_ENDPOINTS,
  CHART_COLORS,
  RESPONSIVE_BREAKPOINTS,
  ANIMATION_DURATIONS,
  Z_INDEX_LAYERS,
  VALIDATION_RANGES,
  DEFAULT_FILTERS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_STATES,
};

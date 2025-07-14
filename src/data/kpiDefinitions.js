import {
  Fuel,
  MapPin,
  Navigation,
  Package,
  Users,
  Anchor,
  Gauge,
  Thermometer,
  Wind,
  Waves,
  Activity,
  Clock,
  Shield,
  Leaf,
  Zap,
  Droplets,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { KPI_CATEGORIES, VALIDATION_RANGES } from '../utils/constants.js';

// KPI definitions for Low Frequency (LF) data - Daily reporting
export const LF_KPIS = [
  {
    id: 'fuel_consumption',
    name: 'Daily Fuel Consumption',
    shortName: 'Fuel Cons.',
    unit: 'MT',
    category: KPI_CATEGORIES.FUEL_BUNKER,
    icon: Fuel,
    description: 'Total fuel consumed in 24-hour period',
    calculation: 'Sum of all fuel types consumed',
    range: VALIDATION_RANGES.fuel_consumption,
    aggregation: 'sum',
    priority: 'high',
    compliance: ['MRV', 'IMO DCS'],
    format: { decimals: 2, prefix: '', suffix: ' MT' },
  },
  {
    id: 'distance',
    name: 'Distance Covered',
    shortName: 'Distance',
    unit: 'NM',
    category: KPI_CATEGORIES.NAVIGATION,
    icon: MapPin,
    description: 'Total nautical miles covered in 24 hours',
    calculation: 'GPS track distance',
    range: VALIDATION_RANGES.distance,
    aggregation: 'sum',
    priority: 'high',
    compliance: ['SOLAS', 'MRV'],
    format: { decimals: 1, prefix: '', suffix: ' NM' },
  },
  {
    id: 'avg_speed',
    name: 'Average Speed',
    shortName: 'Avg Speed',
    unit: 'knots',
    category: KPI_CATEGORIES.NAVIGATION,
    icon: Navigation,
    description: 'Average speed over ground during voyage',
    calculation: 'Distance / Time (excluding port time)',
    range: VALIDATION_RANGES.avg_speed,
    aggregation: 'average',
    priority: 'high',
    compliance: ['SOLAS'],
    format: { decimals: 1, prefix: '', suffix: ' kn' },
  },
  {
    id: 'cargo_weight',
    name: 'Cargo on Board',
    shortName: 'Cargo',
    unit: 'MT',
    category: KPI_CATEGORIES.CARGO,
    icon: Package,
    description: 'Total cargo weight on board',
    calculation: 'Loaded cargo weight',
    range: VALIDATION_RANGES.cargo_weight,
    aggregation: 'average',
    priority: 'medium',
    compliance: ['Load Line', 'STCW'],
    format: { decimals: 0, prefix: '', suffix: ' MT' },
  },
  {
    id: 'crew_count',
    name: 'Crew on Board',
    shortName: 'Crew',
    unit: 'persons',
    category: KPI_CATEGORIES.OPERATIONS,
    icon: Users,
    description: 'Number of crew members on board',
    calculation: 'Head count',
    range: VALIDATION_RANGES.crew_count,
    aggregation: 'average',
    priority: 'medium',
    compliance: ['STCW', 'MLC'],
    format: { decimals: 0, prefix: '', suffix: ' pers' },
  },
  {
    id: 'port_calls',
    name: 'Port Calls',
    shortName: 'Ports',
    unit: 'calls',
    category: KPI_CATEGORIES.OPERATIONS,
    icon: Anchor,
    description: 'Number of port calls in reporting period',
    calculation: 'Count of port arrivals',
    range: VALIDATION_RANGES.port_calls,
    aggregation: 'sum',
    priority: 'low',
    compliance: ['Port State Control'],
    format: { decimals: 0, prefix: '', suffix: ' calls' },
  },
  {
    id: 'voyage_time',
    name: 'Voyage Time',
    shortName: 'Voyage Time',
    unit: 'hours',
    category: KPI_CATEGORIES.OPERATIONS,
    icon: Clock,
    description: 'Total time spent at sea',
    calculation: 'Time sailing excluding port time',
    range: { min: 0, max: 24 },
    aggregation: 'sum',
    priority: 'medium',
    compliance: ['STCW'],
    format: { decimals: 1, prefix: '', suffix: ' hrs' },
  },
  {
    id: 'weather_force',
    name: 'Average Weather Force',
    shortName: 'Weather',
    unit: 'beaufort',
    category: KPI_CATEGORIES.WEATHER,
    icon: Wind,
    description: 'Average Beaufort scale weather conditions',
    calculation: 'Daily average of weather observations',
    range: { min: 0, max: 12 },
    aggregation: 'average',
    priority: 'low',
    compliance: [],
    format: { decimals: 1, prefix: 'BF ', suffix: '' },
  },
  {
    id: 'co2_emissions',
    name: 'CO2 Emissions',
    shortName: 'CO2',
    unit: 'tonnes',
    category: KPI_CATEGORIES.ENVIRONMENTAL,
    icon: Leaf,
    description: 'Daily CO2 emissions calculated from fuel consumption',
    calculation: 'Fuel consumption × emission factor',
    range: { min: 0, max: 500 },
    aggregation: 'sum',
    priority: 'high',
    compliance: ['MRV', 'IMO DCS', 'EU ETS'],
    format: { decimals: 2, prefix: '', suffix: ' t CO2' },
  },
  {
    id: 'efficiency_ratio',
    name: 'Fuel Efficiency',
    shortName: 'Efficiency',
    unit: 'g/nm',
    category: KPI_CATEGORIES.FUEL_BUNKER,
    icon: TrendingUp,
    description: 'Fuel consumption per nautical mile',
    calculation: 'Fuel consumption / distance',
    range: { min: 0, max: 1000 },
    aggregation: 'average',
    priority: 'high',
    compliance: ['SEEMP', 'CII'],
    format: { decimals: 1, prefix: '', suffix: ' g/NM' },
  },
  // --- NEW KPIs ADDED HERE ---
  {
    id: 'obs_speed', // Renamed from 'average_speed' in TableView to avoid conflict with existing 'avg_speed'
    name: 'Observed Speed',
    shortName: 'Obs Speed',
    unit: 'knts',
    category: KPI_CATEGORIES.NAVIGATION,
    icon: Navigation,
    description: 'Observed speed of the vessel',
    calculation: 'Direct observation or GPS',
    range: { min: 0, max: 30 },
    aggregation: 'average',
    priority: 'high',
    format: { decimals: 1, prefix: '', suffix: ' knts' },
  },
  {
    id: 'me_consumption',
    name: 'ME Consumption',
    shortName: 'ME Cons.',
    unit: 'Mt',
    category: KPI_CATEGORIES.FUEL_BUNKER,
    icon: Fuel,
    description: 'Main Engine Fuel Consumption',
    calculation: 'Calculated from VLSFO and LSMGO breakdown',
    range: { min: 0, max: 100 },
    aggregation: 'sum',
    priority: 'high',
    format: { decimals: 2, prefix: '', suffix: ' Mt' },
  },
  {
    id: 'total_consumption',
    name: 'Total Consumption',
    shortName: 'Total Cons.',
    unit: 'Mt',
    category: KPI_CATEGORIES.FUEL_BUNKER,
    icon: Fuel,
    description: 'Total Fuel Consumption (ME + Aux)',
    calculation: 'Sum of ME consumption and other consumptions',
    range: { min: 0, max: 150 },
    aggregation: 'sum',
    priority: 'high',
    format: { decimals: 2, prefix: '', suffix: ' Mt' },
  },
  {
    id: 'wind_force',
    name: 'Wind Force',
    shortName: 'Wind Force',
    unit: 'beaufort',
    category: KPI_CATEGORIES.WEATHER,
    icon: Wind,
    description: 'Wind force on Beaufort scale',
    calculation: 'Observed wind force',
    range: { min: 0, max: 12 },
    aggregation: 'average',
    priority: 'medium',
    format: { decimals: 0, prefix: '', suffix: '' },
  },
  {
    id: 'laden_condition',
    name: 'Laden Condition',
    shortName: 'Laden',
    unit: '',
    category: KPI_CATEGORIES.OPERATIONS,
    icon: Package, // Using Package for cargo/laden related
    description: 'Vessel laden or ballast condition',
    calculation: 'Reported condition',
    range: { min: 0, max: 1 }, // Numerical range for internal validation if needed
    aggregation: 'last',
    priority: 'medium',
    format: { decimals: 0, prefix: '', suffix: '' }, // No specific format for string
  },
  {
    id: 'me_power',
    name: 'ME Power',
    shortName: 'ME Power',
    unit: 'kW',
    category: KPI_CATEGORIES.ENGINE,
    icon: Zap,
    description: 'Main Engine Power output',
    calculation: 'Calculated or observed power',
    range: { min: 0, max: 20000 },
    aggregation: 'average',
    priority: 'high',
    format: { decimals: 0, prefix: '', suffix: ' kW' },
  },
  {
    id: 'me_sfoc',
    name: 'ME SFOC',
    shortName: 'ME SFOC',
    unit: 'gm/kWhr',
    category: KPI_CATEGORIES.ENGINE,
    icon: Fuel, // Fuel icon as it relates to fuel efficiency
    description: 'Main Engine Specific Fuel Oil Consumption',
    calculation: 'Fuel consumption / Power',
    range: { min: 160, max: 220 },
    aggregation: 'average',
    priority: 'high',
    format: { decimals: 1, prefix: '', suffix: ' gm/kWhr' },
  },
  {
    id: 'rpm',
    name: 'RPM',
    shortName: 'RPM',
    unit: '',
    category: KPI_CATEGORIES.ENGINE,
    icon: Gauge,
    description: 'Main Engine Revolutions Per Minute',
    calculation: 'Observed RPM',
    range: { min: 0, max: 150 },
    aggregation: 'average',
    priority: 'high',
    format: { decimals: 0, prefix: '', suffix: ' rpm' },
  },
];

// KPI definitions for High Frequency (HF) data - Real-time/sensor data
export const HF_KPIS = [
  {
    id: 'engine_rpm',
    name: 'Main Engine RPM',
    shortName: 'Engine RPM',
    unit: 'rpm',
    category: KPI_CATEGORIES.ENGINE,
    icon: Gauge,
    description: 'Main engine revolutions per minute',
    calculation: 'Direct sensor reading',
    range: VALIDATION_RANGES.engine_rpm,
    aggregation: 'average',
    priority: 'high',
    compliance: ['SOLAS'],
    format: { decimals: 0, prefix: '', suffix: ' rpm' },
    alarmLimits: { low: 200, high: 900 },
  },
  {
    id: 'fuel_rate',
    name: 'Fuel Consumption Rate',
    shortName: 'Fuel Rate',
    unit: 'L/h',
    category: KPI_CATEGORIES.FUEL_BUNKER,
    icon: Fuel,
    description: 'Instantaneous fuel consumption rate',
    calculation: 'Fuel flow meter reading',
    range: VALIDATION_RANGES.fuel_rate,
    aggregation: 'average',
    priority: 'high',
    compliance: ['MRV'],
    format: { decimals: 1, prefix: '', suffix: ' L/h' },
    alarmLimits: { low: 500, high: 3000 },
  },
  {
    id: 'engine_temp',
    name: 'Engine Temperature',
    shortName: 'Engine Temp',
    unit: '°C',
    category: KPI_CATEGORIES.ENGINE,
    icon: Thermometer,
    description: 'Main engine coolant temperature',
    calculation: 'Temperature sensor reading',
    range: VALIDATION_RANGES.engine_temp,
    aggregation: 'average',
    priority: 'high',
    compliance: ['SOLAS'],
    format: { decimals: 1, prefix: '', suffix: '°C' },
    alarmLimits: { low: 60, high: 100 },
  },
  {
    id: 'oil_pressure',
    name: 'Lubricating Oil Pressure',
    shortName: 'Oil Press.',
    unit: 'bar',
    category: KPI_CATEGORIES.ENGINE,
    icon: Droplets,
    description: 'Main engine lubricating oil pressure',
    calculation: 'Pressure sensor reading',
    range: VALIDATION_RANGES.oil_pressure,
    aggregation: 'average',
    priority: 'high',
    compliance: ['SOLAS'],
    format: { decimals: 2, prefix: '', suffix: ' bar' },
    alarmLimits: { low: 2.0, high: 8.0 },
  },
  {
    id: 'wind_speed',
    name: 'Wind Speed',
    shortName: 'Wind',
    unit: 'knots',
    category: KPI_CATEGORIES.WEATHER,
    icon: Wind,
    description: 'True wind speed',
    calculation: 'Anemometer reading',
    range: VALIDATION_RANGES.wind_speed,
    aggregation: 'average',
    priority: 'medium',
    compliance: [],
    format: { decimals: 1, prefix: '', suffix: ' kn' },
    alarmLimits: { low: 0, high: 40 },
  },
  {
    id: 'sea_state',
    name: 'Sea State',
    shortName: 'Sea State',
    unit: 'scale',
    category: KPI_CATEGORIES.WEATHER,
    icon: Waves,
    description: 'Douglas sea state scale',
    calculation: 'Wave height measurement',
    range: VALIDATION_RANGES.sea_state,
    aggregation: 'average',
    priority: 'low',
    compliance: [],
    format: { decimals: 1, prefix: 'SS ', suffix: '' },
    alarmLimits: { low: 0, high: 8 },
  },
  {
    id: 'shaft_power',
    name: 'Shaft Power',
    shortName: 'Power',
    unit: 'kW',
    category: KPI_CATEGORIES.ENGINE,
    icon: Zap,
    description: 'Propeller shaft power output',
    calculation: 'Torque × RPM calculation',
    range: { min: 0, max: 80000 },
    aggregation: 'average',
    priority: 'high',
    compliance: ['MRV'],
    format: { decimals: 0, prefix: '', suffix: ' kW' },
    alarmLimits: { low: 1000, high: 75000 },
  },
  {
    id: 'exhaust_temp',
    name: 'Exhaust Gas Temperature',
    shortName: 'Exhaust T°',
    unit: '°C',
    category: KPI_CATEGORIES.ENGINE,
    icon: Thermometer,
    description: 'Main engine exhaust gas temperature',
    calculation: 'Exhaust thermocouple reading',
    range: { min: 200, max: 600 },
    aggregation: 'average',
    priority: 'medium',
    compliance: ['MARPOL'],
    format: { decimals: 0, prefix: '', suffix: '°C' },
    alarmLimits: { low: 250, high: 550 },
  },
  {
    id: 'turbo_rpm',
    name: 'Turbocharger RPM',
    shortName: 'Turbo RPM',
    unit: 'rpm',
    category: KPI_CATEGORIES.ENGINE,
    icon: Activity,
    description: 'Turbocharger rotor speed',
    calculation: 'Tachometer reading',
    range: { min: 5000, max: 25000 },
    aggregation: 'average',
    priority: 'medium',
    compliance: [],
    format: { decimals: 0, prefix: '', suffix: ' rpm' },
    alarmLimits: { low: 8000, high: 22000 },
  },
  {
    id: 'cylinder_pressure',
    name: 'Max Cylinder Pressure',
    shortName: 'Cyl. Press.',
    unit: 'bar',
    category: KPI_CATEGORIES.ENGINE,
    icon: Gauge,
    description: 'Maximum combustion pressure in cylinders',
    calculation: 'Peak pressure sensor reading',
    range: { min: 50, max: 200 },
    aggregation: 'average',
    priority: 'medium',
    compliance: ['SOLAS'],
    format: { decimals: 1, prefix: '', suffix: ' bar' },
    alarmLimits: { low: 80, high: 180 },
  },
  // --- NEW KPIs ADDED HERE (for HF as well, if applicable) ---
  {
    id: 'obs_speed',
    name: 'Observed Speed',
    shortName: 'Obs Speed',
    unit: 'knts',
    category: KPI_CATEGORIES.NAVIGATION,
    icon: Navigation,
    description: 'Observed speed of the vessel from high-frequency data',
    calculation: 'Direct sensor reading',
    range: { min: 0, max: 30 },
    aggregation: 'average',
    priority: 'high',
    format: { decimals: 1, prefix: '', suffix: ' knts' },
    alarmLimits: { low: 5, high: 25 },
  },
  {
    id: 'me_consumption',
    name: 'ME Consumption',
    shortName: 'ME Cons.',
    unit: 'Mt',
    category: KPI_CATEGORIES.FUEL_BUNKER,
    icon: Fuel,
    description: 'Main Engine Fuel Consumption from high-frequency data',
    calculation: 'Flow meter reading',
    range: { min: 0, max: 100 },
    aggregation: 'sum',
    priority: 'high',
    format: { decimals: 2, prefix: '', suffix: ' Mt' },
    alarmLimits: { low: 10, high: 90 },
  },
  {
    id: 'total_consumption',
    name: 'Total Consumption',
    shortName: 'Total Cons.',
    unit: 'Mt',
    category: KPI_CATEGORIES.FUEL_BUNKER,
    icon: Fuel,
    description: 'Total Fuel Consumption (ME + Aux) from high-frequency data',
    calculation: 'Sum of all fuel flow meters',
    range: { min: 0, max: 150 },
    aggregation: 'sum',
    priority: 'high',
    format: { decimals: 2, prefix: '', suffix: ' Mt' },
    alarmLimits: { low: 15, high: 140 },
  },
  {
    id: 'wind_force',
    name: 'Wind Force',
    shortName: 'Wind Force',
    unit: 'beaufort',
    category: KPI_CATEGORIES.WEATHER,
    icon: Wind,
    description: 'Wind force on Beaufort scale from sensor data',
    calculation: 'Anemometer reading',
    range: { min: 0, max: 12 },
    aggregation: 'average',
    priority: 'medium',
    format: { decimals: 0, prefix: '', suffix: '' },
    alarmLimits: { low: 0, high: 10 },
  },
  {
    id: 'laden_condition',
    name: 'Laden Condition',
    shortName: 'Laden',
    unit: '',
    category: KPI_CATEGORIES.OPERATIONS,
    icon: Package,
    description: 'Vessel laden or ballast condition from sensor/system data',
    calculation: 'Draft sensors / cargo system',
    range: { min: 0, max: 1 },
    aggregation: 'last',
    priority: 'medium',
    format: { decimals: 0, prefix: '', suffix: '' },
  },
  {
    id: 'me_power',
    name: 'ME Power',
    shortName: 'ME Power',
    unit: 'kW',
    category: KPI_CATEGORIES.ENGINE,
    icon: Zap,
    description: 'Main Engine Power output from high-frequency data',
    calculation: 'Shaft power sensor',
    range: { min: 0, max: 20000 },
    aggregation: 'average',
    priority: 'high',
    format: { decimals: 0, prefix: '', suffix: ' kW' },
    alarmLimits: { low: 1000, high: 19000 },
  },
  {
    id: 'me_sfoc',
    name: 'ME SFOC',
    shortName: 'ME SFOC',
    unit: 'gm/kWhr',
    category: KPI_CATEGORIES.ENGINE,
    icon: Fuel,
    description: 'Main Engine Specific Fuel Oil Consumption from HF data',
    calculation: 'Fuel flow / Power',
    range: { min: 160, max: 220 },
    aggregation: 'average',
    priority: 'high',
    format: { decimals: 1, prefix: '', suffix: ' gm/kWhr' },
    alarmLimits: { low: 165, high: 215 },
  },
  {
    id: 'rpm',
    name: 'RPM',
    shortName: 'RPM',
    unit: '',
    category: KPI_CATEGORIES.ENGINE,
    icon: Gauge,
    description: 'Main Engine Revolutions Per Minute from sensor data',
    calculation: 'Tachometer reading',
    range: { min: 0, max: 150 },
    aggregation: 'average',
    priority: 'high',
    format: { decimals: 0, prefix: '', suffix: ' rpm' },
    alarmLimits: { low: 75, high: 145 },
  },
];

// Get KPI definitions by data type
export const getKPIsByDataType = (dataType) => {
  switch (dataType) {
    case 'lf':
      return LF_KPIS;
    case 'hf':
      return HF_KPIS;
    case 'combined':
      // Ensure no duplicates if an ID exists in both LF and HF and you want a single definition
      const combinedMap = new Map();
      [...LF_KPIS, ...HF_KPIS].forEach((kpi) => {
        if (!combinedMap.has(kpi.id)) {
          // Prioritize the first one found (LF in this case)
          combinedMap.set(kpi.id, kpi);
        }
      });
      return Array.from(combinedMap.values());
    default:
      return LF_KPIS;
  }
};

// Get KPIs by category
export const getKPIsByCategory = (dataType = 'lf') => {
  const kpis = getKPIsByDataType(dataType);
  return kpis.reduce((acc, kpi) => {
    if (!acc[kpi.category]) {
      acc[kpi.category] = [];
    }
    acc[kpi.category].push(kpi);
    return acc;
  }, {});
};

// Get KPI by ID
export const getKPIById = (kpiId, dataType = 'lf') => {
  const kpis = getKPIsByDataType(dataType);
  return kpis.find((kpi) => kpi.id === kpiId);
};

// Get high priority KPIs
export const getHighPriorityKPIs = (dataType = 'lf') => {
  return getKPIsByDataType(dataType).filter((kpi) => kpi.priority === 'high');
};

// Get compliance-related KPIs
export const getComplianceKPIs = (dataType = 'lf') => {
  return getKPIsByDataType(dataType).filter(
    (kpi) => kpi.compliance && kpi.compliance.length > 0
  );
};

// Get KPIs with alarm limits (HF only)
export const getKPIsWithAlarms = () => {
  return HF_KPIS.filter((kpi) => kpi.alarmLimits);
};

// Format KPI value according to its definition
export const formatKPIValue = (
  value,
  kpiId,
  dataType = 'lf',
  includeUnit = true
) => {
  const kpi = getKPIById(kpiId, dataType);
  if (!kpi || value === null || value === undefined) {
    return 'N/A';
  }

  // Special handling for 'laden_condition' as it's a string
  if (kpiId === 'laden_condition') {
    return value === 1 ? 'Laden' : 'Ballast'; // Return 'Laden' for 1, 'Ballast' for 0 or other values
  }

  const { decimals, prefix, suffix } = kpi.format;
  const formattedNumber = Number(value).toFixed(decimals);
  return `${prefix}${formattedNumber}${includeUnit ? suffix : ''}`;
};

// Validate KPI value against its range
export const validateKPIValue = (value, kpiId, dataType = 'lf') => {
  const kpi = getKPIById(kpiId, dataType);
  if (!kpi || value === null || value === undefined) {
    return { isValid: false, reason: 'Missing value' };
  }

  // Skip range validation for string-based KPIs like 'laden_condition'
  if (kpiId === 'laden_condition') {
    // Assuming 'laden_condition' will be 0 or 1
    if (value === 0 || value === 1) {
      return { isValid: true };
    }
    return { isValid: false, reason: 'Invalid laden condition value' };
  }

  const { min, max } = kpi.range;
  if (value < min) {
    return { isValid: false, reason: `Below minimum (${min})` };
  }
  if (value > max) {
    return { isValid: false, reason: `Above maximum (${max})` };
  }

  return { isValid: true };
};

// Check if KPI value triggers an alarm (HF only)
export const checkKPIAlarm = (value, kpiId) => {
  const kpi = getKPIById(kpiId, 'hf');
  if (!kpi || !kpi.alarmLimits || value === null || value === undefined) {
    return { hasAlarm: false };
  }

  const { low, high } = kpi.alarmLimits;
  if (value < low) {
    return {
      hasAlarm: true,
      type: 'low',
      message: `${kpi.name} below alarm limit (${low})`,
    };
  }
  if (value > high) {
    return {
      hasAlarm: true,
      type: 'high',
      message: `${kpi.name} above alarm limit (${high})`,
    };
  }

  return { hasAlarm: false };
};

// Get default KPIs for initial display
export const getDefaultKPIs = (dataType = 'lf') => {
  const highPriorityKPIs = getHighPriorityKPIs(dataType);
  return highPriorityKPIs.slice(0, 4).map((kpi) => kpi.id);
};

// Get KPI aggregation methods
export const KPI_AGGREGATION_METHODS = {
  sum: (values) => values.reduce((sum, val) => sum + (val || 0), 0),
  average: (values) => {
    const validValues = values.filter(
      (val) => val !== null && val !== undefined
    );
    return validValues.length > 0
      ? validValues.reduce((sum, val) => sum + val, 0) / validValues.length
      : null;
  },
  max: (values) =>
    Math.max(...values.filter((val) => val !== null && val !== undefined)),
  min: (values) =>
    Math.min(...values.filter((val) => val !== null && val !== undefined)),
  last: (values) => values[values.length - 1] || null,
  first: (values) => values[0] || null,
};

// Aggregate KPI values based on its definition
export const aggregateKPIValues = (values, kpiId, dataType = 'lf') => {
  const kpi = getKPIById(kpiId, dataType);
  if (!kpi || !values || values.length === 0) {
    return null;
  }

  const aggregationMethod = KPI_AGGREGATION_METHODS[kpi.aggregation];
  return aggregationMethod ? aggregationMethod(values) : null;
};

// Category metadata with icons and colors
export const CATEGORY_METADATA = {
  [KPI_CATEGORIES.FUEL_BUNKER]: {
    icon: Fuel,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    description: 'Fuel consumption, efficiency, and bunker management',
  },
  [KPI_CATEGORIES.NAVIGATION]: {
    icon: Navigation,
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Speed, distance, course, and position tracking',
  },
  [KPI_CATEGORIES.ENGINE]: {
    icon: Activity,
    color: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    description: 'Engine performance, temperatures, and pressures',
  },
  [KPI_CATEGORIES.WEATHER]: {
    icon: Wind,
    color: 'from-slate-500 to-gray-600',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
    description: 'Weather conditions, wind, waves, and visibility',
  },
  [KPI_CATEGORIES.CARGO]: {
    icon: Package,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    description: 'Cargo weight, loading, and storage conditions',
  },
  [KPI_CATEGORIES.OPERATIONS]: {
    icon: Users,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    description: 'Crew, operations, and port activities',
  },
  [KPI_CATEGORIES.SAFETY]: {
    icon: Shield,
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    description: 'Safety systems, alarms, and emergency equipment',
  },
  [KPI_CATEGORIES.ENVIRONMENTAL]: {
    icon: Leaf,
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    description: 'Emissions, environmental compliance, and sustainability',
  },
};

// Get category metadata
export const getCategoryMetadata = (category) => {
  return (
    CATEGORY_METADATA[category] || {
      icon: Activity,
      color: 'from-slate-500 to-gray-600',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-500/30',
      description: 'General operational metrics',
    }
  );
};

// Get all categories for a data type
export const getCategories = (dataType = 'lf') => {
  const kpis = getKPIsByDataType(dataType);
  const categories = [...new Set(kpis.map((kpi) => kpi.category))];
  return categories.map((category) => ({
    name: category,
    ...getCategoryMetadata(category),
    kpiCount: kpis.filter((kpi) => kpi.category === category).length,
  }));
};

// Search KPIs by name or description
export const searchKPIs = (searchTerm, dataType = 'lf') => {
  if (!searchTerm) return getKPIsByDataType(dataType);

  const kpis = getKPIsByDataType(dataType);
  const lowerSearchTerm = searchTerm.toLowerCase();

  return kpis.filter(
    (kpi) =>
      kpi.name.toLowerCase().includes(lowerSearchTerm) ||
      kpi.shortName.toLowerCase().includes(lowerSearchTerm) ||
      kpi.description.toLowerCase().includes(lowerSearchTerm) ||
      kpi.category.toLowerCase().includes(lowerSearchTerm)
  );
};

// Get KPI units summary
export const getKPIUnits = (dataType = 'lf') => {
  const kpis = getKPIsByDataType(dataType);
  const units = [...new Set(kpis.map((kpi) => kpi.unit))];
  return units.sort();
};

// Calculate data quality score for a KPI
export const calculateKPIQualityScore = (data, kpiId, dataType = 'lf') => {
  if (!data || data.length === 0) {
    return { completeness: 0, correctness: 0, grade: 'Poor' };
  }

  const values = data.map((item) => item[dataType][kpiId]);
  const totalPoints = values.length;
  const receivedPoints = values.filter(
    (val) => val !== null && val !== undefined
  ).length;
  const completeness =
    totalPoints > 0 ? (receivedPoints / totalPoints) * 100 : 0;

  const validPoints = values.filter((val) => {
    if (val === null || val === undefined) return false;
    const validation = validateKPIValue(val, kpiId, dataType);
    return validation.isValid;
  }).length;

  const correctness =
    receivedPoints > 0 ? (validPoints / receivedPoints) * 100 : 0;

  let grade = 'Poor';
  if (completeness >= 95 && correctness >= 98) {
    grade = 'Good';
  } else if (completeness >= 85 && correctness >= 90) {
    grade = 'Acceptable';
  }

  return { completeness, correctness, grade };
};

export default {
  LF_KPIS,
  HF_KPIS,
  getKPIsByDataType,
  getKPIsByCategory,
  getKPIById,
  getHighPriorityKPIs,
  getComplianceKPIs,
  getKPIsWithAlarms,
  formatKPIValue,
  validateKPIValue,
  checkKPIAlarm,
  getDefaultKPIs,
  KPI_AGGREGATION_METHODS,
  aggregateKPIValues,
  CATEGORY_METADATA,
  getCategoryMetadata,
  getCategories,
  searchKPIs,
  getKPIUnits,
  calculateKPIQualityScore,
};

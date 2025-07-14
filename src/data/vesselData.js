import { VESSEL_STATUS } from '../utils/constants.js';

export const VESSEL_TYPES = {
  CONTAINER: 'Container Ship',
  OIL_TANKER: 'Oil Tanker',
  BULK_CARRIER: 'Bulk Carrier',
  LNG_CARRIER: 'LNG Carrier',
  CHEMICAL_TANKER: 'Chemical Tanker',
  RO_RO: 'RoRo Vessel',
  GENERAL_CARGO: 'General Cargo',
};

export const FLAGS = {
  PANAMA: 'Panama',
  LIBERIA: 'Liberia',
  MARSHALL_ISLANDS: 'Marshall Islands',
  SINGAPORE: 'Singapore',
  MALTA: 'Malta',
  BAHAMAS: 'Bahamas',
  CYPRUS: 'Cyprus',
  NORWAY: 'Norway',
  HONG_KONG: 'Hong Kong',
  GREECE: 'Greece',
};

export const VESSELS = [
  {
    id: 'MV001',
    name: 'Oceanic Carrier',
    type: VESSEL_TYPES.CONTAINER,
    flag: FLAGS.PANAMA,
    imo: '9876543',
    callSign: 'H3RC',
    mmsi: '352123456',
    dwt: 185000,
    grt: 171000,
    length: 366,
    beam: 51,
    draft: 16.0,
    builtYear: 2018,
    classification: 'DNV GL',
    owner: 'Maritime Holdings Ltd',
    operator: 'Ocean Shipping Co',
    homePort: 'Hamburg',
    status: VESSEL_STATUS.ACTIVE,
    currentLocation: {
      latitude: 51.5074,
      longitude: -0.1278,
      port: 'London',
      country: 'United Kingdom',
    },
    engines: {
      main: {
        type: 'MAN B&W 12K98MC-C',
        power: 68640, // kW
        cylinders: 12,
        rpm: 94,
      },
      auxiliary: [
        { type: 'Wartsila 6L46F', power: 6300, count: 3 },
        { type: 'Wartsila 8L46F', power: 8400, count: 1 },
      ],
    },
    fuelCapacity: {
      hfo: 4200, // MT
      mdo: 850, // MT
      lfo: 650, // MT
    },
    crew: {
      capacity: 24,
      current: 22,
      nationality: ['Filipino', 'Ukrainian', 'Indian'],
    },
    certificates: {
      safetyManagement: '2024-08-15',
      safetyConstruction: '2025-02-20',
      loadLine: '2024-11-30',
    },
  },
  {
    id: 'MV002',
    name: 'Nordic Haven',
    type: VESSEL_TYPES.OIL_TANKER,
    flag: FLAGS.NORWAY,
    imo: '9876544',
    callSign: 'LMQR2',
    mmsi: '257891234',
    dwt: 298000,
    grt: 162000,
    length: 330,
    beam: 60,
    draft: 22.5,
    builtYear: 2020,
    classification: 'ABS',
    owner: 'Nordic Maritime AS',
    operator: 'Tanker Solutions Inc',
    homePort: 'Bergen',
    status: VESSEL_STATUS.ACTIVE,
    currentLocation: {
      latitude: 25.2048,
      longitude: 55.2708,
      port: 'Dubai',
      country: 'United Arab Emirates',
    },
    engines: {
      main: {
        type: 'Wartsila RT-flex96C',
        power: 75420,
        cylinders: 14,
        rpm: 102,
      },
      auxiliary: [{ type: 'Wartsila 9L46F', power: 10350, count: 3 }],
    },
    fuelCapacity: {
      hfo: 5800,
      mdo: 1200,
      lfo: 900,
    },
    crew: {
      capacity: 26,
      current: 25,
      nationality: ['Norwegian', 'Filipino', 'Russian'],
    },
    cargoCapacity: {
      total: 320000, // m³
      tanks: 16,
      heating: true,
      inertGas: true,
    },
  },
  {
    id: 'MV003',
    name: "Navigator's Legacy",
    type: VESSEL_TYPES.BULK_CARRIER,
    flag: FLAGS.MARSHALL_ISLANDS,
    imo: '9876545',
    callSign: 'V7AA3',
    mmsi: '538012345',
    dwt: 175000,
    grt: 95000,
    length: 290,
    beam: 45,
    draft: 18.2,
    builtYear: 2019,
    classification: "Lloyd's Register",
    owner: 'Bulk Transport Holdings',
    operator: 'Global Bulk Carriers',
    homePort: 'Majuro',
    status: VESSEL_STATUS.IN_PORT,
    currentLocation: {
      latitude: -33.8688,
      longitude: 151.2093,
      port: 'Sydney',
      country: 'Australia',
    },
    engines: {
      main: {
        type: 'MAN B&W 7S80ME-C9.5',
        power: 22080,
        cylinders: 7,
        rpm: 78,
      },
      auxiliary: [{ type: 'Yanmar 6EY26W', power: 1470, count: 3 }],
    },
    fuelCapacity: {
      hfo: 2800,
      mdo: 450,
      lfo: 350,
    },
    crew: {
      capacity: 22,
      current: 20,
      nationality: ['Marshall Islander', 'Filipino', 'Ukrainian'],
    },
    cargoCapacity: {
      holds: 7,
      grainCapacity: 201000, // m³
      baleCapacity: 195000, // m³
      cranes: 4,
    },
  },
  {
    id: 'MV004',
    name: "Seafarer's Pride",
    type: VESSEL_TYPES.CONTAINER,
    flag: FLAGS.LIBERIA,
    imo: '9876546',
    callSign: 'A8BC4',
    mmsi: '636123456',
    dwt: 220000,
    grt: 200000,
    length: 400,
    beam: 59,
    draft: 16.5,
    builtYear: 2021,
    classification: 'Bureau Veritas',
    owner: 'Container Lines International',
    operator: 'Seafarer Shipping',
    homePort: 'Monrovia',
    status: VESSEL_STATUS.ACTIVE,
    currentLocation: {
      latitude: 1.3521,
      longitude: 103.8198,
      port: 'Singapore',
      country: 'Singapore',
    },
    engines: {
      main: {
        type: 'Wartsila RT-flex96C-B',
        power: 78200,
        cylinders: 14,
        rpm: 102,
      },
      auxiliary: [{ type: 'Wartsila 8L46F', power: 8400, count: 4 }],
    },
    fuelCapacity: {
      hfo: 6200,
      mdo: 1100,
      lfo: 800,
    },
    crew: {
      capacity: 25,
      current: 24,
      nationality: ['Filipino', 'Indian', 'Romanian'],
    },
    cargoCapacity: {
      teu: 23500,
      reefer: 2000,
      holds: 24,
      tiers: 22,
    },
  },
  {
    id: 'MV005',
    name: 'Vent Horizon',
    type: VESSEL_TYPES.LNG_CARRIER,
    flag: FLAGS.SINGAPORE,
    imo: '9876547',
    callSign: '9V-XY5',
    mmsi: '563789012',
    dwt: 165000,
    grt: 135000,
    length: 345,
    beam: 53.8,
    draft: 12.0,
    builtYear: 2022,
    classification: 'NK (Nippon Kaiji)',
    owner: 'LNG Maritime Pte Ltd',
    operator: 'Asia Pacific Gas',
    homePort: 'Singapore',
    status: VESSEL_STATUS.MAINTENANCE,
    currentLocation: {
      latitude: 1.2966,
      longitude: 103.7764,
      port: 'Jurong',
      country: 'Singapore',
    },
    engines: {
      main: {
        type: 'Wartsila 50DF',
        power: 19500,
        cylinders: 12,
        rpm: 514,
        dualFuel: true,
      },
      auxiliary: [
        { type: 'Wartsila 34DF', power: 8500, count: 4, dualFuel: true },
      ],
    },
    fuelCapacity: {
      hfo: 1800,
      mdo: 400,
      lng: 2500, // For own consumption
    },
    crew: {
      capacity: 28,
      current: 26,
      nationality: ['Singaporean', 'Filipino', 'Korean'],
    },
    cargoCapacity: {
      lng: 174000, // m³
      tanks: 4,
      type: 'Membrane',
      boilOffRate: 0.12, // % per day
    },
    specialSystems: {
      reliquefaction: true,
      gasHandling: 'Moss',
      cryogenic: true,
    },
  },
];

// Vessel performance characteristics based on type
export const VESSEL_PERFORMANCE_PROFILES = {
  [VESSEL_TYPES.CONTAINER]: {
    avgSpeed: { min: 12, max: 24, optimal: 18 },
    fuelConsumption: { min: 25, max: 180, eco: 45 },
    operatingDraft: { min: 8, max: 16 },
    cargoUtilization: { min: 60, max: 95 },
  },
  [VESSEL_TYPES.OIL_TANKER]: {
    avgSpeed: { min: 10, max: 16, optimal: 14 },
    fuelConsumption: { min: 35, max: 220, eco: 65 },
    operatingDraft: { min: 15, max: 22 },
    cargoUtilization: { min: 85, max: 98 },
  },
  [VESSEL_TYPES.BULK_CARRIER]: {
    avgSpeed: { min: 10, max: 15, optimal: 13 },
    fuelConsumption: { min: 20, max: 150, eco: 40 },
    operatingDraft: { min: 12, max: 18 },
    cargoUtilization: { min: 80, max: 95 },
  },
  [VESSEL_TYPES.LNG_CARRIER]: {
    avgSpeed: { min: 12, max: 20, optimal: 16 },
    fuelConsumption: { min: 30, max: 160, eco: 55 },
    operatingDraft: { min: 8, max: 12 },
    cargoUtilization: { min: 90, max: 99 },
  },
};

// Operational routes and typical ports
export const COMMON_ROUTES = {
  ASIA_EUROPE: {
    name: 'Asia-Europe',
    ports: [
      'Singapore',
      'Port Klang',
      'Colombo',
      'Suez',
      'Rotterdam',
      'Hamburg',
      'Felixstowe',
    ],
    distance: 11000, // nautical miles
    transitTime: 28, // days
  },
  TRANSPACIFIC: {
    name: 'Transpacific',
    ports: [
      'Shanghai',
      'Busan',
      'Tokyo',
      'Los Angeles',
      'Long Beach',
      'Oakland',
    ],
    distance: 5500,
    transitTime: 14,
  },
  MIDDLE_EAST_ASIA: {
    name: 'Middle East-Asia',
    ports: ['Ras Tanura', 'Kuwait', 'Dubai', 'Mumbai', 'Singapore', 'Ulsan'],
    distance: 3200,
    transitTime: 12,
  },
  ATLANTIC: {
    name: 'Transatlantic',
    ports: [
      'Rotterdam',
      'Antwerp',
      'Le Havre',
      'New York',
      'Norfolk',
      'Savannah',
    ],
    distance: 3500,
    transitTime: 10,
  },
};

// Get vessel by ID
export const getVesselById = (vesselId) => {
  return VESSELS.find((vessel) => vessel.id === vesselId);
};

// Get vessels by type
export const getVesselsByType = (vesselType) => {
  return VESSELS.filter((vessel) => vessel.type === vesselType);
};

// Get vessels by status
export const getVesselsByStatus = (status) => {
  return VESSELS.filter((vessel) => vessel.status === status);
};

// Get vessels by flag
export const getVesselsByFlag = (flag) => {
  return VESSELS.filter((vessel) => vessel.flag === flag);
};

// Get active vessels
export const getActiveVessels = () => {
  return VESSELS.filter((vessel) => vessel.status === VESSEL_STATUS.ACTIVE);
};

// Get vessel performance profile
export const getVesselPerformanceProfile = (vesselType) => {
  return (
    VESSEL_PERFORMANCE_PROFILES[vesselType] ||
    VESSEL_PERFORMANCE_PROFILES[VESSEL_TYPES.CONTAINER]
  );
};

// Calculate vessel age
export const calculateVesselAge = (builtYear) => {
  return new Date().getFullYear() - builtYear;
};

// Get vessel summary statistics
export const getVesselStatistics = () => {
  const totalVessels = VESSELS.length;
  const activeVessels = getActiveVessels().length;
  const inPortVessels = getVesselsByStatus(VESSEL_STATUS.IN_PORT).length;
  const maintenanceVessels = getVesselsByStatus(
    VESSEL_STATUS.MAINTENANCE
  ).length;

  const typeDistribution = Object.values(VESSEL_TYPES).reduce((acc, type) => {
    acc[type] = getVesselsByType(type).length;
    return acc;
  }, {});

  const flagDistribution = Object.values(FLAGS).reduce((acc, flag) => {
    acc[flag] = getVesselsByFlag(flag).length;
    return acc;
  }, {});

  const totalDWT = VESSELS.reduce((sum, vessel) => sum + vessel.dwt, 0);
  const averageAge =
    VESSELS.reduce(
      (sum, vessel) => sum + calculateVesselAge(vessel.builtYear),
      0
    ) / totalVessels;

  return {
    totalVessels,
    activeVessels,
    inPortVessels,
    maintenanceVessels,
    typeDistribution,
    flagDistribution,
    totalDWT,
    averageAge: Math.round(averageAge * 10) / 10,
  };
};

export default {
  VESSEL_TYPES,
  FLAGS,
  VESSELS,
  VESSEL_PERFORMANCE_PROFILES,
  COMMON_ROUTES,
  getVesselById,
  getVesselsByType,
  getVesselsByStatus,
  getVesselsByFlag,
  getActiveVessels,
  getVesselPerformanceProfile,
  calculateVesselAge,
  getVesselStatistics,
};

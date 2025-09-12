import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import {
  Download,
  RefreshCw,
  BarChart3,
  X,
  Settings,
  Radio,
  Zap,
  Layers,
  Shield,
  TrendingUp,
  AlertTriangle,
  Activity,
  Fuel,
  Navigation,
  Waves,
  Maximize2,
  Minimize2,
  MessageCircle,
  Anchor,
  CloudRain,
  Wrench,
  Flag,
  Edit3,
  Calendar,
  WifiOff,
  XCircle,
  AlertCircle,
  Clock,
  Info,
  Ship,
} from 'lucide-react';

// Import the shared DataQualityCards component
import DataQualityCards, { staticQualityData } from '../table/DataQualityCards';

// Constants and Data Types
const DATA_TYPES = {
  LF: 'lf',
  HF: 'hf',
  COMBINED: 'combined',
};

const ALL_KPIS = {
  LF: [
    { id: 'fuel_consumption', name: 'Fuel Consumption', description: 'Daily fuel consumption rate' },
    { id: 'speed', name: 'Speed', description: 'Vessel speed over ground' },
    { id: 'distance', name: 'Distance', description: 'Distance traveled' },
    { id: 'engine_rpm', name: 'Engine RPM', description: 'Engine revolutions per minute' },
  ],
  HF: [
    { id: 'fuel_flow', name: 'Fuel Flow', description: 'High-frequency fuel flow data' },
    { id: 'engine_load', name: 'Engine Load', description: 'Engine load percentage' },
    { id: 'exhaust_temp', name: 'Exhaust Temperature', description: 'Exhaust gas temperature' },
    { id: 'coolant_temp', name: 'Coolant Temperature', description: 'Engine coolant temperature' },
  ],
  COMBINED: [
    { id: 'fuel_efficiency', name: 'Fuel Efficiency', description: 'Combined fuel efficiency metric' },
    { id: 'performance_index', name: 'Performance Index', description: 'Overall performance score' },
    { id: 'emissions', name: 'Emissions', description: 'CO2 emissions rate' },
    { id: 'operational_cost', name: 'Operational Cost', description: 'Cost per nautical mile' },
  ],
};

// Sample vessels data
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

const defaultSelectedVessels = sampleVessels.slice(0, 5);

// Mock chart data generator
const generateChartData = (vessels, kpis, days = 7) => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const dayData = {
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
    };

    vessels.forEach(vesselId => {
      kpis.forEach(kpi => {
        const baseValue = Math.random() * 100;
        const variation = (Math.random() - 0.5) * 20;
        const value = Math.max(0, baseValue + variation);
        
        dayData[`${vesselId}_${kpi.id}`] = Math.round(value * 100) / 100;
        
        // Add quality indicators
        const quality = Math.random() * 100;
        dayData[`${vesselId}_${kpi.id}_quality`] = Math.round(quality);
        dayData[`${vesselId}_${kpi.id}_hasIssue`] = quality < 70;
        dayData[`${vesselId}_${kpi.id}_issueDetails`] = quality < 70 ? 'Data quality issue detected' : null;
      });
    });

    data.push(dayData);
  }

  return data;
};

const ChartView = ({
  initialVesselId = null,
  className = '',
  qualityVisible = true,
}) => {
  const getInitialFilters = (vesselId) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
      
    const selectedVessels = vesselId
      ? [vesselId]
      : defaultSelectedVessels.map((v) => v.id);

    return {
      dataType: DATA_TYPES.LF,
      selectedKPIs: ALL_KPIS.LF.map((kpi) => kpi.id),
      selectedVessels: selectedVessels,
      dateRange: { startDate, endDate },
    };
  };

  const [chartFilters, setChartFilters] = useState(() => getInitialFilters(initialVesselId));
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  // State for vessel selection
  const [selectedVessels, setSelectedVessels] = useState([
    'vessel_1', 'vessel_2', 'vessel_3', 'vessel_4', 'vessel_5'
  ]);
  const [showVesselDropdown, setShowVesselDropdown] = useState(false);
  const vesselDropdownRef = useRef(null);

  // State for KPI selection
  const [showKPIDropdown, setShowKPIDropdown] = useState(false);
  const kpiDropdownRef = useRef(null);

  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    if (initialVesselId && chartFilters.selectedVessels[0] !== initialVesselId) {
      setChartFilters(prev => ({
        ...prev,
        selectedVessels: [initialVesselId]
      }));
    } else if (!initialVesselId && chartFilters.selectedVessels.length === 1) {
      setChartFilters(prev => ({
        ...prev,
        selectedVessels: defaultSelectedVessels.map(v => v.id)
      }));
    }
  }, [initialVesselId, chartFilters.selectedVessels]);

  const handleApplyFilters = (newFilters) => {
    setIsApplyingFilters(true);
    setTimeout(() => {
      setChartFilters(newFilters);
      setIsApplyingFilters(false);
    }, 500);
  };

  const handleExport = (format) => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  const chartData = useMemo(() => {
    if (
      !chartFilters.dateRange.startDate ||
      !chartFilters.dateRange.endDate ||
      chartFilters.selectedKPIs.length === 0 ||
      chartFilters.selectedVessels.length === 0
    ) {
      return [];
    }

    const days = Math.ceil(
      (chartFilters.dateRange.endDate - chartFilters.dateRange.startDate) / (1000 * 60 * 60 * 24)
    );

    return generateChartData(
      chartFilters.selectedVessels,
      ALL_KPIS[chartFilters.dataType].filter(kpi => 
        chartFilters.selectedKPIs.includes(kpi.id)
      ),
      days
    );
  }, [chartFilters]);

  const handleVesselSelection = (vesselId) => {
    setSelectedVessels(prev => {
      if (prev.includes(vesselId)) {
        return prev.filter(id => id !== vesselId);
      } else {
        return [...prev, vesselId];
      }
    });
  };

  const handleResetVessels = () => {
    setSelectedVessels(['vessel_1', 'vessel_2', 'vessel_3', 'vessel_4', 'vessel_5']);
  };

  const handleApplyVessels = () => {
    setChartFilters(prev => ({
      ...prev,
      selectedVessels: selectedVessels
    }));
    setShowVesselDropdown(false);
  };

  const handleKPISelection = (kpiId) => {
    setChartFilters(prev => {
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

  const handleApply = () => {
    setShowKPIDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        kpiDropdownRef.current &&
        !kpiDropdownRef.current.contains(event.target)
      ) {
        setShowKPIDropdown(false);
      }
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

  const getCurrentKPIs = () => {
    switch (chartFilters.dataType) {
      case DATA_TYPES.LF:
        return ALL_KPIS.LF;
      case DATA_TYPES.HF:
        return ALL_KPIS.HF;
      case DATA_TYPES.COMBINED:
        return ALL_KPIS.COMBINED;
      default:
        return ALL_KPIS.LF;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Notifications */}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-3 m-2 rounded-md ${
            notification.type === 'error'
              ? 'bg-red-100 border border-red-200 text-red-800'
              : notification.type === 'warning'
              ? 'bg-yellow-100 border border-yellow-200 text-yellow-800'
              : 'bg-blue-100 border border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {/* Header with Fleet Analytics and Vessel Selection */}
      <div className="bg-white border-b border-gray-200 p-1">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Fleet Analytics
              </h3>
            </div>
            
            {/* Vessel Selection */}
            <div className="relative" ref={vesselDropdownRef}>
              <button
                onClick={() => setShowVesselDropdown(!showVesselDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors text-sm"
                title="Select Vessels"
              >
                <Ship className="w-4 h-4" />
                <span>Vessels</span>
                {selectedVessels?.length > 0 && (
                  <span className="bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {selectedVessels.length}
                  </span>
                )}
              </button>

              {showVesselDropdown && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="flex items-center justify-between p-3 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Ship className="w-4 h-4" />
                      Select Vessels
                    </h4>
                    <button onClick={() => setShowVesselDropdown(false)}>
                      <X className="w-4 h-4 text-gray-500 hover:text-gray-900" />
                    </button>
                  </div>

                  <div className="p-3 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {sampleVessels.map((vessel) => (
                        <label
                          key={vessel.id}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedVessels?.includes(vessel.id)}
                            onChange={() => handleVesselSelection(vessel.id)}
                            className="w-4 h-4 text-emerald-600 bg-white border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {vessel.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 border-t border-gray-200 flex justify-end gap-2">
                    <button
                      onClick={handleResetVessels}
                      className="px-2 py-1.5 text-xs font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleApplyVessels}
                      className="px-2 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Date Range Picker */}
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-300 rounded-md">
              <Calendar className="w-3 h-3 text-gray-500" />
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  className="w-20 text-xs bg-transparent border-none text-gray-700 focus:outline-none"
                  placeholder="Start"
                />
                <span className="text-xs text-gray-500">–</span>
                <input
                  type="date"
                  className="w-20 text-xs bg-transparent border-none text-gray-700 focus:outline-none"
                  placeholder="End"
                />
              </div>
            </div>

            {/* Configuration Dropdown */}
            <div className="relative" ref={kpiDropdownRef}>
              <button
                onClick={() => setShowKPIDropdown(!showKPIDropdown)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                title="Configure KPIs"
              >
                <Settings className="w-4 h-4" />
              </button>

              {showKPIDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Configure KPIs
                    </h4>
                    <button onClick={() => setShowKPIDropdown(false)}>
                      <X className="w-4 h-4 text-gray-500 hover:text-gray-900" />
                    </button>
                  </div>

                  <div className="p-2 border-b border-gray-200">
                    <label className="text-xs font-medium text-gray-600 mb-2 block">
                      Data Source
                    </label>
                    <div className="flex gap-2">
                      {Object.values(DATA_TYPES).map((type) => (
                        <button
                          key={type}
                          onClick={() =>
                            setChartFilters((prev) => ({
                              ...prev,
                              dataType: type,
                              selectedKPIs: ALL_KPIS[type].map((kpi) => kpi.id),
                            }))
                          }
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            chartFilters.dataType === type
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {type.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-2 border-b border-gray-200">
                    <label className="text-xs font-medium text-gray-600 mb-2 block">
                      Select KPIs
                    </label>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {getCurrentKPIs().map((kpi) => (
                        <label
                          key={kpi.id}
                          className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={chartFilters.selectedKPIs?.includes(kpi.id)}
                            onChange={() => handleKPISelection(kpi.id)}
                            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <div className="flex-1">
                            <span className="text-xs font-medium text-gray-900">
                              {kpi.name}
                            </span>
                            {kpi.description && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {kpi.description}
                              </p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                    <button
                      onClick={handleApply}
                      className="px-2 py-1.5 text-xs font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => setShowKPIDropdown(false)}
                      className="px-2 py-1.5 text-xs font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <button
              className="w-8 h-8 flex items-center justify-center bg-gray-100/50 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Export Button */}
            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              className="w-8 h-8 flex items-center justify-center bg-gray-100/50 border border-gray-200 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 disabled:opacity-50"
              title="Export Data"
            >
              {isExporting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-1">
          {qualityVisible && (
            <DataQualityCards
              data={chartData}
              qualityVisible={qualityVisible}
              selectedVessels={chartFilters.selectedVessels}
              selectedKPIs={chartFilters.selectedKPIs}
              chartData={chartData}
              annotationsVisible={false}
              qualityOverlayVisible={false}
              viewMode="charts"
              compactMode={true}
            />
          )}
        </div>

        <div className="px-1 pb-1">
          {chartFilters.selectedKPIs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <BarChart3 className="w-8 h-8 text-gray-500 mb-2" />
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                No KPIs Selected
              </h3>
              <p className="text-xs text-gray-600">
                Please select at least one KPI to display charts.
              </p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <TrendingUp className="w-8 h-8 text-gray-500 mb-2" />
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                No Data Available
              </h3>
              <p className="text-xs text-gray-600">
                No data available for the selected filters. Try adjusting your
                date range or vessel selection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {chartFilters.selectedKPIs.map((kpiId) => {
                const kpi = getCurrentKPIs().find((k) => k.id === kpiId);
                if (!kpi) return null;

                return (
                  <div key={kpiId} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-md bg-blue-100 border border-blue-200">
                        <Activity className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {kpi.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {chartFilters.selectedVessels
                            .map((vesselId) => 
                              sampleVessels.find((v) => v.id === vesselId)?.name
                            )
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#666"
                            fontSize={12}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          />
                          <YAxis stroke="#666" fontSize={12} />
                          <Tooltip 
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-gray-900/98 border border-gray-700/25 rounded-lg p-3 shadow-2xl backdrop-blur-md">
                                    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-gray-700/15">
                                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                                      <p className="text-xs font-semibold text-gray-100">
                                        {new Date(label).toLocaleDateString('en-US', {
                                          weekday: 'short',
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}
                                      </p>
                                    </div>
                                    <div className="space-y-1">
                                      {payload.map((entry, index) => (
                                        <div key={index} className="flex items-center justify-between gap-3">
                                          <div className="flex items-center gap-2">
                                            <div 
                                              className="w-2 h-2 rounded-full" 
                                              style={{ backgroundColor: entry.color }}
                                            />
                                            <span className="text-xs text-gray-300">
                                              {entry.dataKey.split('_')[1] || entry.dataKey}
                                            </span>
                                          </div>
                                          <span className="text-xs font-semibold text-gray-100">
                                            {entry.value?.toFixed(2) || 'N/A'}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          {chartFilters.selectedVessels.map((vesselId, index) => {
                            const vessel = sampleVessels.find((v) => v.id === vesselId);
                            if (!vessel) return null;
                            
                            const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
                            const color = colors[index % colors.length];
                            
                            return (
                              <Line
                                key={`${vesselId}_${kpiId}`}
                                type="monotone"
                                dataKey={`${vesselId}_${kpiId}`}
                                stroke={color}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                                name={vessel.name}
                              />
                            );
                          })}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartView;

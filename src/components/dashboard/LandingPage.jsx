import React, { useState, useMemo } from 'react';
import {
  Ship,
  Activity,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  MapPin,
  Anchor,
  Navigation,
  Fuel,
  Clock,
  Eye,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  BarChart3,
  Radio,
  Zap,
  CheckCircle,
  XCircle,
  WifiOff,
  SignalHigh,
  SignalLow,
  Layers,
  Target,
  Gauge,
  LineChart, // Added for chart view icon
  Table // Added for tabular view icon
} from 'lucide-react';

// Import the shared DataQualityCards component from TableView
import DataQualityCards, { staticQualityData } from '../table/DataQualityCards.jsx';
import ControlsBar from '../dashboard/ControlsBar.jsx'; // Imported ControlsBar

// Mock data for demonstration - updated KPI names
const mockVessels = [
  {
    id: 1,
    name: 'MV Atlantic Pioneer',
    type: 'Container Ship',
    // status: 'At Sea', // Removed Status
    dataIntegrity: 96,
    dataAccuracy: 98,
    qualityIndex: 97, // Added Quality Index
    operationalAlerts: 0,
    lastUpdate: '2 mins ago'
  },
  {
    id: 2,
    name: 'MV Pacific Navigator',
    type: 'Bulk Carrier',
    // status: 'At Port', // Removed Status
    dataIntegrity: 89,
    dataAccuracy: 94,
    qualityIndex: 91, // Added Quality Index
    operationalAlerts: 1,
    lastUpdate: '5 mins ago'
  },
  {
    id: 3,
    name: 'MV Ocean Explorer',
    type: 'Tanker',
    // status: 'At Sea', // Removed Status
    dataIntegrity: 92,
    dataAccuracy: 96,
    qualityIndex: 94, // Added Quality Index
    operationalAlerts: 0,
    lastUpdate: '3 mins ago'
  },
  {
    id: 4,
    name: 'MV Global Trader',
    type: 'Container Ship',
    // status: 'Anchored', // Removed Status
    dataIntegrity: 87,
    dataAccuracy: 91,
    qualityIndex: 89, // Added Quality Index
    operationalAlerts: 2,
    lastUpdate: '8 mins ago'
  },
  {
    id: 5,
    name: 'MV Arctic Wind',
    type: 'Bulk Carrier',
    // status: 'At Sea', // Removed Status
    dataIntegrity: 95,
    dataAccuracy: 97,
    qualityIndex: 96, // Added Quality Index
    operationalAlerts: 0,
    lastUpdate: '1 min ago'
  }
];

// Simplified vessel table row component - using same styling as TableView
const VesselRow = ({ vessel, onVesselClick, onNavigateToCharts, onNavigateToTable }) => {
  const getQualityColor = (score) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDataSourceBadge = (source) => {
    const colors = {
      LF: 'bg-blue-100 text-blue-700 border-blue-200',
      HF: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return (
      <span
        className={`text-[8px] font-medium px-1 py-0.5 rounded-full border ${colors[source]} flex items-center gap-0.5`}
      >
        {source === 'LF' && <Radio className="w-2 h-2" />}
        {source === 'HF' && <Zap className="w-2 h-2" />}
        {source}
      </span>
    );
  };

  return (
    <tr
      className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 group"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Ship className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{vessel.name}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              {vessel.type}
              {getDataSourceBadge('LF')}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`font-medium ${getQualityColor(vessel.qualityIndex)}`}>
            {vessel.qualityIndex}%
          </div>
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${vessel.qualityIndex >= 90 ? 'bg-emerald-500' : vessel.qualityIndex >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${vessel.qualityIndex}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`font-medium ${getQualityColor(vessel.dataAccuracy)}`}>
            {vessel.dataAccuracy}%
          </div>
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${vessel.dataAccuracy >= 90 ? 'bg-emerald-500' : vessel.dataAccuracy >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${vessel.dataAccuracy}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`font-medium ${getQualityColor(vessel.dataIntegrity)}`}>
            {vessel.dataIntegrity}%
          </div>
          <div className="w-16 bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${vessel.dataIntegrity >= 90 ? 'bg-emerald-500' : vessel.dataIntegrity >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${vessel.dataIntegrity}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {vessel.operationalAlerts > 0 ? (
            <>
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-red-600 font-medium">{vessel.operationalAlerts}</span>
            </>
          ) : (
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              None
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-gray-600 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {vessel.lastUpdate}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToCharts(vessel.id)}
            className="p-1 hover:bg-gray-100 rounded transition-colors group-hover:bg-blue-100"
            title="View Charts"
          >
            <LineChart className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
          </button>
          <button
            onClick={() => onNavigateToTable(vessel.id)}
            className="p-1 hover:bg-gray-100 rounded transition-colors group-hover:bg-blue-100"
            title="View Table"
          >
            <Table className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const LandingPage = ({
  onVesselClick,
  className = '',
  vessels = [],
  qualityStats = {},
  filters = {},
  onFilterChange = () => {},
  qualityVisible = true,
  onQualityToggle = () => {},
  onExport = () => {},
  performanceSummary = {},
  onNavigateToLanding = () => {},
  onNavigateToCharts = () => {},
  onNavigateToTable = () => {},
  onNavigateToFuelAnomaly = () => {},
  isApplyingFilters = false,
  isExporting = false
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort vessels
  const filteredVessels = useMemo(() => {
    let filtered = mockVessels.filter(vessel =>
      vessel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vessel.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.direction === 'asc') {
          return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      });
    }

    return filtered;
  }, [searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    return sortConfig.direction === 'asc' ?
      <ArrowUp className="w-3 h-3 text-blue-600" /> :
      <ArrowDown className="w-3 h-3 text-blue-600" />;
  };

  return (
    <div className={`bg-gray-50 text-gray-900 min-h-screen flex flex-col ${className}`}>

      {/* Add ControlsBar directly to Landing Page */}
      {/* <ControlsBar
        filters={filters}
        onFilterChange={onFilterChange}
        onNavigateToLanding={onNavigateToLanding}
        onNavigateToCharts={onNavigateToCharts}
        onNavigateToTable={onNavigateToTable}
        onNavigateToFuelAnomaly={onNavigateToFuelAnomaly}
        currentView="landing" // Force landing view
        onQualityToggle={onQualityToggle}
        vessels={vessels}
        isApplyingFilters={isApplyingFilters}
        isExporting={isExporting}
      /> */}

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* Reuse DataQualityCards component - same as other views */}
          <DataQualityCards
            data={staticQualityData}
            onQualityFilter={() => {}}
            qualityVisible={qualityVisible}
            onToggleQuality={onQualityToggle}
            selectedVessels={[]}
            selectedKPIs={[]}
            chartData={[]}
            annotationsVisible={true}
            onToggleAnnotations={() => {}}
            qualityOverlayVisible={false}
            onToggleQualityOverlay={() => {}}
            viewMode="table"
            compactMode={false}
          />

          {/* Vessel Table - Same styling as TableView */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Ship className="w-5 h-5 text-blue-600" />
                  Fleet Overview
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search vessels..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {filteredVessels.length} vessels
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Vessel
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('qualityIndex')}
                    >
                      <div className="flex items-center gap-1">
                        Quality Index
                        {getSortIcon('qualityIndex')}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('dataAccuracy')}
                    >
                      <div className="flex items-center gap-1">
                        Data Accuracy
                        {getSortIcon('dataAccuracy')}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('dataIntegrity')}
                    >
                      <div className="flex items-center gap-1">
                        Data Integrity
                        {getSortIcon('dataIntegrity')}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('operationalAlerts')}
                    >
                      <div className="flex items-center gap-1">
                        Operational Alerts
                        {getSortIcon('operationalAlerts')}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Update
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredVessels.map((vessel) => (
                    <VesselRow
                      key={vessel.id}
                      vessel={vessel}
                      onVesselClick={onVesselClick}
                      onNavigateToCharts={onNavigateToCharts}
                      onNavigateToTable={onNavigateToTable}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {filteredVessels.length === 0 && (
              <div className="text-center py-12">
                <Ship className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No vessels found matching your search.</p>
              </div>
            )}

            {/* Table Footer - same as TableView */}
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <span>Showing {filteredVessels.length} vessels</span>
                  <div className="flex items-center gap-1">
                    <WifiOff className="w-4 h-4 text-gray-400" />
                    <span>Last sync: 2 mins ago</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">Data Sources:</span>
                  <div className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-blue-600" />
                    <span className="text-xs">LF</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-orange-600" />
                    <span className="text-xs">HF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
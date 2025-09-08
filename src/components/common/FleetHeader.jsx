// components/common/FleetHeader.jsx
import React, { useState } from 'react';
import { Bell, Menu, User, Fuel } from 'lucide-react';

// Placeholder for AlertsPanel - you'll need to provide the actual component
const AlertsPanel = ({ onClose }) => (
  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4">
    <h3 className="font-semibold text-gray-900 mb-2">Alerts</h3>
    <p className="text-sm text-gray-600">
      This is a placeholder for your alerts panel.
    </p>
    <button onClick={onClose} className="mt-4 btn-secondary">
      Close
    </button>
  </div>
);

export default function FleetHeader() {
  const [showAlerts, setShowAlerts] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const navItems = [
    { name: 'Dashboard', active: false },
    { name: 'Fleet', active: false },
    { name: 'Analytics', active: false },
    { name: 'Reports', active: false },
    { name: 'Data Quality', active: true },
  ];

  return (
    <div className="w-full font-inter">
      {/* Main Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">
          {/* Left section - Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* App Icon */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Fuel className="w-6 h-6 text-white" />
                </div>
                {/* Status indicator */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              {/* App Name and Tagline */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Fuel Sense
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Smart Fleet Fuel Management
                </p>
              </div>
            </div>
          </div>

          {/* Center Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  item.active 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right section - Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                onClick={() => setShowAlerts(!showAlerts)}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  4
                </span>
              </button>
              {showAlerts && <AlertsPanel onClose={() => setShowAlerts(false)} />}
            </div>

            {/* Menu Button (Mobile) */}
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setShowMenu(!showMenu)}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-gray-900">Admin User</div>
                <div className="text-xs text-gray-500">Fleet Manager</div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMenu && (
          <div className="lg:hidden border-t border-gray-200 bg-gray-50">
            <nav className="px-6 py-4 space-y-2">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Secondary Navigation Tabs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="flex items-center px-6 h-12 max-w-7xl mx-auto overflow-x-auto">
          <div className="flex space-x-6 min-w-max">
            <button className="text-xs text-gray-600 hover:text-gray-900 transition-colors py-3 px-2 border-b-2 border-transparent hover:border-gray-300">
              Operational Performance
            </button>
            <button className="text-xs text-gray-600 hover:text-gray-900 transition-colors py-3 px-2 border-b-2 border-transparent hover:border-gray-300">
              Engine Performance
            </button>
            <button className="text-xs text-gray-600 hover:text-gray-900 transition-colors py-3 px-2 border-b-2 border-transparent hover:border-gray-300">
              Auxiliary Systems
            </button>
            <button className="text-xs text-blue-600 font-medium py-3 px-2 border-b-2 border-blue-600">
              Data Quality Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
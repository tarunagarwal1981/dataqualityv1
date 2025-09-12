// components/common/FleetHeader.jsx
import React, { useState } from 'react';
import { Bell, Menu, User, Ship } from 'lucide-react'; // Changed Fuel to Ship

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
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between px-6 h-16 mx-auto">
          {/* Left section - Brand */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* App Icon */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Ship className="w-6 h-6 text-white" />
                </div>
                {/* Status indicator */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
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

          {/* Right section - Actions */}
          <div className="flex items-center gap-3">
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
              <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMenu && (
          <div className="lg:hidden border-t border-gray-200 bg-gray-50/50 backdrop-blur-sm">
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
    </div>
  );
}
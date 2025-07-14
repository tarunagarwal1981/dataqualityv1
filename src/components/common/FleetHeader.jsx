// components/common/FleetHeader.jsx
import React, { useState } from 'react';
import { Bell } from 'lucide-react';

// Placeholder for AlertsPanel - you'll need to provide the actual component
const AlertsPanel = ({ onClose }) => (
  <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 p-4">
    <h3 className="font-semibold text-white mb-2">Alerts</h3>
    <p className="text-sm text-slate-400">
      This is a placeholder for your alerts panel.
    </p>
    <button onClick={onClose} className="mt-4 btn-secondary">
      Close
    </button>
  </div>
);

export default function FleetHeader() {
  const [showAlerts, setShowAlerts] = useState(false);

  const navIcons = [
    { src: '/icons/1.svg', active: false },
    { src: '/icons/2.svg', active: false },
    { src: '/icons/3.svg', active: false },
    { src: '/icons/4.svg', active: false },
    { src: '/icons/5.svg', active: true },
  ];

  return (
    <div className="w-full font-nunito">
      {/* First Row - Main Navigation */}
      <div className="bg-[#132337] border-b border-[#1E3654]">
        <div className="flex items-center justify-between px-4 h-12 max-w-[1920px] mx-auto">
          {/* Left section with logo */}
          <div className="flex items-center gap-2">
            <img
              src="/icons/Ocean Eye.svg"
              alt="Ocean Eye Logo"
              width={96}
              height={96}
              className="w-15 h-15"
            />
          </div>

          {/* Center section with navigation icons */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-8">
            {navIcons.map((icon, index) => (
              <button
                key={index}
                className={`p-2 rounded-full transition-colors hover:bg-[#1E3654] ${
                  icon.active ? 'bg-[#1E3654]' : ''
                }`}
              >
                <img
                  src={icon.src}
                  alt={`Navigation Icon ${index + 1}`}
                  className={`w-6 h-6 ${icon.active ? 'brightness-125' : ''}`}
                />
              </button>
            ))}
          </div>

          {/* Right section with notifications and profile */}
          <div className="flex items-center gap-4">
            <button
              className="p-2 hover:bg-[#1E3654] rounded-full transition-colors relative"
              onClick={() => setShowAlerts(!showAlerts)}
            >
              <Bell className="w-5 h-5 text-[#f4f4f4]" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-[#f4f4f4] text-xs w-5 h-5 rounded-full flex items-center justify-center">
                4
              </span>
            </button>

            <button className="p-2 hover:bg-[#1E3654] rounded-full transition-colors">
              <img src="/icons/9dots.svg" alt="Menu" className="w-5 h-5" />
            </button>

            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-[#f4f4f4] text-sm">UA</span>
            </div>
          </div>

          {showAlerts && <AlertsPanel onClose={() => setShowAlerts(false)} />}
        </div>
      </div>

      {/* Second Row - Performance Tabs */}
      <div className="bg-[#132337] border-b border-[#1E3654]">
        <div className="flex items-center px-4 h-10 max-w-[1920px] mx-auto">
          <div className="flex space-x-4">
            <button className="text-[12px] text-gray-400 hover:text-gray-200 transition-colors py-2 px-3 rounded-md hover:bg-[#1E3654]">
              Operational Performance
            </button>
            <button className="text-[12px] text-gray-400 hover:text-gray-200 transition-colors py-2 px-3 rounded-md hover:bg-[#1E3654]">
              ME Performance
            </button>
            <button className="text-[12px] text-gray-400 hover:text-gray-200 transition-colors py-2 px-3 rounded-md hover:bg-[#1E3654]">
              Aux Systems Performance
            </button>
            <button className="text-[12px] text-blue-400 border-b-2 border-blue-400 pb-2">
              Data Quality Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

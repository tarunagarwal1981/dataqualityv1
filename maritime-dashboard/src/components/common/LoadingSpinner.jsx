import React from 'react';
import { Loader2, Waves, Activity, Database, RefreshCw } from 'lucide-react';

const LoadingSpinner = ({
  size = 'md',
  message = 'Loading...',
  type = 'default',
  showMessage = true,
  className = '',
  inline = false,
}) => {
  // Size configurations
  const sizeConfig = {
    xs: { spinner: 'w-4 h-4', text: 'text-xs', container: 'gap-2' },
    sm: { spinner: 'w-5 h-5', text: 'text-sm', container: 'gap-2' },
    md: { spinner: 'w-6 h-6', text: 'text-base', container: 'gap-3' },
    lg: { spinner: 'w-8 h-8', text: 'text-lg', container: 'gap-3' },
    xl: { spinner: 'w-12 h-12', text: 'text-xl', container: 'gap-4' },
    large: { spinner: 'w-16 h-16', text: 'text-2xl', container: 'gap-6' },
  };

  const config = sizeConfig[size];

  // Different spinner types
  const getSpinner = (type) => {
    const spinnerClass = `${config.spinner} animate-spin`;

    switch (type) {
      case 'waves':
        return <Waves className={`${spinnerClass} text-blue-500`} />;
      case 'activity':
        return <Activity className={`${spinnerClass} text-emerald-500`} />;
      case 'database':
        return <Database className={`${spinnerClass} text-blue-500`} />;
      case 'refresh':
        return <RefreshCw className={`${spinnerClass} text-purple-500`} />;
      case 'maritime':
        return <MaritimeSpinner size={config.spinner} />;
      case 'dots':
        return <DotsSpinner size={size} />;
      case 'pulse':
        return <PulseSpinner size={size} />;
      default:
        return <Loader2 className={`${spinnerClass} text-blue-500`} />;
    }
  };

  const containerClass = inline
    ? `inline-flex items-center ${config.container} ${className}`
    : `flex flex-col items-center justify-center ${config.container} ${className}`;

  return (
    <div className={containerClass}>
      {getSpinner(type)}
      {showMessage && message && (
        <div
          className={`font-medium text-slate-300 ${config.text} ${
            inline ? '' : 'text-center'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

// Custom maritime-themed spinner
const MaritimeSpinner = ({ size }) => (
  <div className={`relative ${size}`}>
    <div className="absolute inset-0 border-2 border-blue-500/30 rounded-full"></div>
    <div className="absolute inset-0 border-2 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
    <div
      className="absolute inset-2 border-2 border-transparent border-t-emerald-500 rounded-full animate-spin"
      style={{ animationDirection: 'reverse' }}
    ></div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
    </div>
  </div>
);

// Dots loading animation
const DotsSpinner = ({ size }) => {
  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
    xl: 'w-3 h-3',
    large: 'w-4 h-4',
  };

  const dotSize = dotSizes[size] || dotSizes.md;

  return (
    <div className="flex space-x-1">
      <div
        className={`${dotSize} bg-blue-500 rounded-full animate-pulse`}
        style={{ animationDelay: '0ms' }}
      ></div>
      <div
        className={`${dotSize} bg-blue-500 rounded-full animate-pulse`}
        style={{ animationDelay: '150ms' }}
      ></div>
      <div
        className={`${dotSize} bg-blue-500 rounded-full animate-pulse`}
        style={{ animationDelay: '300ms' }}
      ></div>
    </div>
  );
};

// Pulse loading animation
const PulseSpinner = ({ size }) => {
  const pulseSizes = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    large: 'w-24 h-24',
  };

  const pulseSize = pulseSizes[size] || pulseSizes.md;

  return (
    <div className={`relative ${pulseSize}`}>
      <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
      <div
        className="absolute inset-2 bg-blue-500/40 rounded-full animate-ping"
        style={{ animationDelay: '0.5s' }}
      ></div>
      <div className="absolute inset-4 bg-blue-500 rounded-full animate-pulse"></div>
    </div>
  );
};

// Specialized loading components for different contexts
export const TableLoadingSkeleton = ({ rows = 5, columns = 6 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex items-center space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={colIndex}
            className="h-4 bg-slate-700/50 rounded animate-pulse"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        ))}
      </div>
    ))}
  </div>
);

export const ChartLoadingSkeleton = () => (
  <div className="space-y-4">
    {/* Chart title skeleton */}
    <div className="h-6 bg-slate-700/50 rounded w-1/3 animate-pulse"></div>

    {/* Chart area skeleton */}
    <div className="relative h-64 bg-slate-800/30 rounded-xl border border-slate-700/30 overflow-hidden">
      <div className="absolute inset-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-3 bg-slate-700/50 rounded animate-pulse"
            ></div>
          ))}
        </div>

        {/* Chart bars/lines */}
        <div className="ml-16 h-full flex items-end space-x-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-blue-500/30 rounded-t animate-pulse"
              style={{
                height: `${Math.random() * 80 + 20}%`,
                width: '100%',
              }}
            />
          ))}
        </div>

        {/* X-axis labels */}
        <div className="absolute bottom-0 left-16 right-0 h-8 flex justify-between">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-3 w-16 bg-slate-700/50 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </div>

    {/* Legend skeleton */}
    <div className="flex items-center justify-center space-x-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-slate-700/50 rounded animate-pulse"></div>
          <div className="h-3 w-20 bg-slate-700/50 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

export const QualityPanelLoadingSkeleton = () => (
  <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-700/50 rounded-xl animate-pulse"></div>
        <div className="h-6 w-48 bg-slate-700/50 rounded animate-pulse"></div>
      </div>
      <div className="h-4 w-32 bg-slate-700/50 rounded animate-pulse"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30"
        >
          <div className="h-8 w-16 bg-slate-600/50 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-24 bg-slate-600/50 rounded animate-pulse mb-1"></div>
          <div className="h-3 w-32 bg-slate-600/50 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

export const SidebarLoadingSkeleton = () => (
  <div className="w-80 bg-slate-800/30 border-r border-slate-700/30 p-6 space-y-6">
    {/* Filter header */}
    <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
      <div className="w-8 h-8 bg-slate-700/50 rounded-xl animate-pulse"></div>
      <div className="h-5 w-32 bg-slate-700/50 rounded animate-pulse"></div>
    </div>

    {/* Search */}
    <div>
      <div className="h-4 w-24 bg-slate-700/50 rounded animate-pulse mb-3"></div>
      <div className="h-10 w-full bg-slate-700/50 rounded-xl animate-pulse"></div>
    </div>

    {/* Vessel selection */}
    <div>
      <div className="h-4 w-32 bg-slate-700/50 rounded animate-pulse mb-3"></div>
      <div className="space-y-3 max-h-48">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-4 h-4 bg-slate-700/50 rounded animate-pulse"></div>
            <div className="flex-1">
              <div className="h-3 w-3/4 bg-slate-700/50 rounded animate-pulse mb-1"></div>
              <div className="h-2 w-1/2 bg-slate-700/50 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* KPI selection */}
    <div>
      <div className="h-4 w-28 bg-slate-700/50 rounded animate-pulse mb-3"></div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-800/30 rounded-xl p-3 border border-slate-700/30"
          >
            <div className="h-4 w-24 bg-slate-700/50 rounded animate-pulse mb-2"></div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-700/50 rounded animate-pulse"></div>
                  <div className="h-3 w-2/3 bg-slate-700/50 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Loading overlay component
export const LoadingOverlay = ({
  isVisible,
  message = 'Loading...',
  type = 'default',
  backdrop = true,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={`
      fixed inset-0 z-50 flex items-center justify-center
      ${backdrop ? 'bg-black/50 backdrop-blur-sm' : ''}
    `}
    >
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl">
        <LoadingSpinner size="xl" message={message} type={type} />
      </div>
    </div>
  );
};

// Progress bar loading component
export const ProgressLoader = ({
  progress = 0,
  message = 'Loading...',
  showPercentage = true,
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-slate-300 font-medium">{message}</span>
      {showPercentage && (
        <span className="text-slate-400 font-mono text-sm">
          {Math.round(progress)}%
        </span>
      )}
    </div>
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  </div>
);

// Button loading state
export const LoadingButton = ({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  className = '',
  disabled = false,
  ...props
}) => (
  <button
    className={`relative inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all duration-300 shadow-lg border border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    disabled={isLoading || disabled}
    {...props}
  >
    {isLoading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="sm" type="default" showMessage={false} inline />
      </div>
    )}
    <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
      {isLoading ? loadingText : children}
    </span>
  </button>
);

export default LoadingSpinner;

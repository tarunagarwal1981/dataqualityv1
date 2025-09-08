// Light Theme QualityBadge.jsx
import React from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Activity,
} from 'lucide-react';
import { QUALITY_GRADES } from '../../utils/constants.js';

const QualityBadge = ({
  grade,
  size = 'sm',
  showIcon = true,
  showText = true,
  completeness = null,
  correctness = null,
  issueCount = 0,
  className = '',
  onClick = null,
  tooltip = null,
}) => {
  // Determine icon based on grade
  const getIcon = (grade) => {
    switch (grade) {
      case QUALITY_GRADES.GOOD:
        return CheckCircle;
      case QUALITY_GRADES.ACCEPTABLE:
        return AlertTriangle;
      case QUALITY_GRADES.POOR:
        return XCircle;
      default:
        return Info;
    }
  };

  // Light theme colors based on grade
  const getColors = (grade) => {
    switch (grade) {
      case QUALITY_GRADES.GOOD:
        return 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100';
      case QUALITY_GRADES.ACCEPTABLE:
        return 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100';
      case QUALITY_GRADES.POOR:
        return 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  // Size configurations
  const sizeConfig = {
    xs: {
      container: 'px-1.5 py-0.5 text-xs',
      icon: 'w-3 h-3',
      gap: 'gap-1',
    },
    sm: {
      container: 'px-2.5 py-1 text-xs',
      icon: 'w-3 h-3',
      gap: 'gap-1.5',
    },
    md: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-2',
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 'w-5 h-5',
      gap: 'gap-2',
    },
  };

  const Icon = getIcon(grade);
  const colors = getColors(grade);
  const config = sizeConfig[size];

  // Create detailed tooltip content
  const getTooltipContent = () => {
    if (tooltip) return tooltip;

    const details = [];
    if (completeness !== null) {
      details.push(`Completeness: ${completeness.toFixed(1)}%`);
    }
    if (correctness !== null) {
      details.push(`Correctness: ${correctness.toFixed(1)}%`);
    }
    if (issueCount > 0) {
      details.push(`Issues: ${issueCount}`);
    }

    return details.length > 0 ? details.join('\n') : `Data Quality: ${grade}`;
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <div className="relative group">
      <Component
        onClick={onClick}
        className={`
          inline-flex items-center font-medium rounded-lg border transition-all duration-200
          ${config.container} ${config.gap} ${colors}
          ${onClick ? 'cursor-pointer' : 'cursor-default'}
          ${className}
        `}
        title={getTooltipContent()}
      >
        {showIcon && <Icon className={config.icon} />}
        {showText && <span className="font-semibold">{grade}</span>}

        {/* Issue count indicator */}
        {issueCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 bg-current/20 rounded text-xs font-bold">
            {issueCount}
          </span>
        )}
      </Component>

      {/* Enhanced tooltip for light theme */}
      {(completeness !== null || correctness !== null || tooltip) && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl min-w-max">
            <div className="text-xs text-gray-100 whitespace-pre-line">
              {getTooltipContent()}
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Specialized quality badge variants for light theme
export const QualityScore = ({ score, size = 'md', showLabel = true }) => {
  const getGradeFromScore = (score) => {
    if (score >= 95) return QUALITY_GRADES.GOOD;
    if (score >= 85) return QUALITY_GRADES.ACCEPTABLE;
    return QUALITY_GRADES.POOR;
  };

  const grade = getGradeFromScore(score);

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <span className="text-gray-600 text-sm font-medium">Quality:</span>
      )}
      <QualityBadge
        grade={grade}
        size={size}
        tooltip={`Quality Score: ${score.toFixed(1)}%`}
      />
      <span className="text-gray-900 font-mono text-sm">
        {score.toFixed(1)}%
      </span>
    </div>
  );
};

export const CompactQualityIndicator = ({
  completeness,
  correctness,
  size = 'xs',
}) => {
  const avgScore = (completeness + correctness) / 2;
  const grade =
    avgScore >= 95
      ? QUALITY_GRADES.GOOD
      : avgScore >= 85
      ? QUALITY_GRADES.ACCEPTABLE
      : QUALITY_GRADES.POOR;

  return (
    <QualityBadge
      grade={grade}
      size={size}
      completeness={completeness}
      correctness={correctness}
    />
  );
};

export default QualityBadge;
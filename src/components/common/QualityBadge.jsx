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

  // Determine colors based on grade
  const getColors = (grade) => {
    switch (grade) {
      case QUALITY_GRADES.GOOD:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20';
      case QUALITY_GRADES.ACCEPTABLE:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20';
      case QUALITY_GRADES.POOR:
        return 'text-red-400 bg-red-500/10 border-red-500/30 hover:bg-red-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30 hover:bg-slate-500/20';
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

      {/* Enhanced tooltip */}
      {(completeness !== null || correctness !== null || tooltip) && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl min-w-max">
            <div className="text-xs text-slate-300 whitespace-pre-line">
              {getTooltipContent()}
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// Specialized quality badge variants
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
        <span className="text-slate-400 text-sm font-medium">Quality:</span>
      )}
      <QualityBadge
        grade={grade}
        size={size}
        tooltip={`Quality Score: ${score.toFixed(1)}%`}
      />
      <span className="text-slate-300 font-mono text-sm">
        {score.toFixed(1)}%
      </span>
    </div>
  );
};

export const CompacQualityIndicator = ({
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
      showText={false}
      completeness={completeness}
      correctness={correctness}
      tooltip={`C: ${completeness.toFixed(1)}% | R: ${correctness.toFixed(1)}%`}
    />
  );
};

export const DetailedQualityBadge = ({
  grade,
  completeness,
  correctness,
  issues = [],
  size = 'md',
}) => {
  const tooltipContent = [
    `Grade: ${grade}`,
    `Completeness: ${completeness?.toFixed(1) || 'N/A'}%`,
    `Correctness: ${correctness?.toFixed(1) || 'N/A'}%`,
    issues.length > 0 ? `Issues: ${issues.length}` : 'No issues',
  ].join('\n');

  return (
    <QualityBadge
      grade={grade}
      size={size}
      completeness={completeness}
      correctness={correctness}
      issueCount={issues.length}
      tooltip={tooltipContent}
    />
  );
};

export const TrendQualityBadge = ({
  grade,
  trend,
  size = 'sm',
  showTrend = true,
}) => {
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return '↗';
      case 'degrading':
        return '↘';
      default:
        return '→';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving':
        return 'text-emerald-400';
      case 'degrading':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <QualityBadge grade={grade} size={size} />
      {showTrend && (
        <span className={`text-sm font-mono ${getTrendColor(trend)}`}>
          {getTrendIcon(trend)}
        </span>
      )}
    </div>
  );
};

export const QualityProgress = ({
  completeness,
  correctness,
  target = 95,
  size = 'md',
}) => {
  const avgScore = (completeness + correctness) / 2;
  const progress = Math.min(100, (avgScore / target) * 100);

  const getProgressColor = (progress) => {
    if (progress >= 95) return 'bg-emerald-500';
    if (progress >= 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-3">
      <CompacQualityIndicator
        completeness={completeness}
        correctness={correctness}
        size={size}
      />
      <div className="flex-1 bg-slate-700 rounded-full h-2">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getProgressColor(
            progress
          )}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-slate-400 text-sm font-mono min-w-[3rem] text-right">
        {avgScore.toFixed(1)}%
      </span>
    </div>
  );
};

export default QualityBadge;

import React from 'react';

interface ScoreBarProps {
  score: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, label, showLabel = true, className = '' }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`flex flex-col ${className} shadow-xs`}>
      {showLabel && label && (
        <div className="mb-1 flex items-center">
          <span className="text-xs font-medium sm:text-sm">{label}</span>
          <span className="text-muted ml-2 text-xs font-medium sm:text-sm">({score}%)</span>
        </div>
      )}
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ScoreBar;

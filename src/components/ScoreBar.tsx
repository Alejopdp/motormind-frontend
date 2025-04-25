import React from 'react';

interface ScoreBarProps {
  score: number;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, label, showLabel = true, className = '' }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-400';
    if (score >= 60) return 'bg-yellow-400';
    if (score >= 40) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {showLabel && label && (
        <div className="mb-1 flex justify-between">
          <span className="text-xs font-medium text-gray-700">{label}</span>
          <span className="text-xs font-medium text-gray-500">{score}%</span>
        </div>
      )}
      <div className="h-1 w-full rounded-full bg-gray-200">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ScoreBar;

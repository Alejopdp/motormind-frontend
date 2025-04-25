import React from 'react';

interface ScoreBarProps {
  score: number;
  showLabel?: boolean;
  className?: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, showLabel = true, className = '' }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-400';
    if (score >= 60) return 'bg-yellow-400';
    if (score >= 40) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-1 w-36 rounded-full bg-gray-100">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      {showLabel && <span className="text-xs font-medium text-gray-500">{score}%</span>}
    </div>
  );
};

export default ScoreBar;

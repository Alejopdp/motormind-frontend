import React from 'react';

interface ScoreBarProps {
  score: number;
  showLabel?: boolean;
  className?: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, showLabel = true, className = '' }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-2.5 w-16 rounded-full bg-gray-200">
        <div
          className={`h-2.5 rounded-full ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      {showLabel && <span className="text-xs text-gray-600">{score}%</span>}
    </div>
  );
};

export default ScoreBar;

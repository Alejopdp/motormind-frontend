import React from 'react';

interface StageBadgeProps {
  stage: 'preliminary' | 'final';
  className?: string;
}

const StageBadge: React.FC<StageBadgeProps> = ({ stage, className = '' }) => {
  const getStageText = (stage: 'preliminary' | 'final') => {
    return stage === 'preliminary' ? 'Preliminar' : 'Final';
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs ${
        stage === 'preliminary' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
      } ${className}`}
    >
      {getStageText(stage)}
    </span>
  );
};

export default StageBadge;

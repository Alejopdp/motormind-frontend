import React from 'react';

interface StageBadgeProps {
  stage: 'RECEPTION' | 'PRELIMINARY_DIAGNOSIS' | 'FINAL_REPORT';
  className?: string;
}

const StageBadge: React.FC<StageBadgeProps> = ({ stage, className = '' }) => {
  const getStageText = (stage: 'RECEPTION' | 'PRELIMINARY_DIAGNOSIS' | 'FINAL_REPORT') => {
    return stage === 'RECEPTION'
      ? 'Recepción'
      : stage === 'PRELIMINARY_DIAGNOSIS'
        ? 'Diagnóstico Preliminar'
        : 'Diagnóstico Final';
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs ${
        stage === 'RECEPTION'
          ? 'bg-blue-100 text-blue-800'
          : stage === 'PRELIMINARY_DIAGNOSIS'
            ? 'bg-purple-100 text-purple-800'
            : 'bg-green-100 text-green-800'
      } ${className}`}
    >
      {getStageText(stage)}
    </span>
  );
};

export default StageBadge;

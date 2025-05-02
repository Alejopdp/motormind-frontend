import React, { useState, useRef, useEffect } from 'react';
import { getScoreColor } from '@/utils/scoreColors';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  description?: string;
  percentage?: boolean;
  tooltip?: string;
  isScore?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  description,
  percentage = false,
  tooltip,
  isScore = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (showTooltip && buttonRef.current && tooltipRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      const top = buttonRect.top - tooltipRect.height - 10;
      const left = buttonRect.right + 10;

      setTooltipPosition({ top, left });
    }
  }, [showTooltip]);

  const scoreColor = isScore ? getScoreColor(Number(value)) : '';

  return (
    <div className="group from-primary/5 to-primary/10 relative overflow-hidden rounded-lg bg-gradient-to-br p-6 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="from-primary/10 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-center justify-between">
        <h3 className="text-primary text-lg font-semibold">{title}</h3>
        {tooltip && (
          <div className="relative">
            <button
              ref={buttonRef}
              className="text-primary/70 hover:text-primary cursor-pointer focus:outline-none"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              aria-label="Información"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            {showTooltip && (
              <div
                ref={tooltipRef}
                className="fixed z-50 w-64 rounded-md bg-white p-3 text-sm text-gray-700 shadow-lg"
                style={{
                  top: `${tooltipPosition.top}px`,
                  left: `${tooltipPosition.left}px`,
                  opacity: 1,
                }}
              >
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>
      <p className={`text-primary/80 relative mt-2 text-4xl font-bold`}>
        {isScore ? (
          <>
            <span className={`text-4xl font-bold ${scoreColor}`}>{Math.round(Number(value))}</span>
            <span className="text-primary/80 text-4xl font-bold">/100</span>
          </>
        ) : percentage ? (
          <>
            {Math.round(Number(value))}
            <span>%</span>
          </>
        ) : (
          <>
            {value}
            {unit && <span className="text-primary/80 ml-2 text-sm">{unit}</span>}
          </>
        )}
      </p>
      {!percentage && !isScore && description && (
        <p className="text-primary/80 relative mt-2 text-sm">{description}</p>
      )}
    </div>
  );
};

export default MetricCard;

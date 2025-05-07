import React, { useState, useRef, useEffect } from 'react';
import { getScoreColor } from '@/utils/scoreColors';
import { Info } from 'lucide-react';

interface MetricItemProps {
  title: string;
  value: number | string;
  unit?: string;
  description?: string;
  percentage?: boolean;
  tooltip?: string;
  isScore?: boolean;
}

const MetricItem: React.FC<MetricItemProps> = ({
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
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm md:p-5">
      <div className="relative flex items-center justify-between">
        <h3 className="text-sm font-medium sm:text-lg">{title}</h3>
        {tooltip && (
          <div className="relative">
            <button
              ref={buttonRef}
              className="text-primary hover:text-primary/80 cursor-pointer focus:outline-none"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              aria-label="Información"
            >
              <Info className="mt-1.5 !h-5 !w-5" />
            </button>
            {showTooltip && (
              <div
                ref={tooltipRef}
                className="text-muted fixed z-50 w-64 rounded-md border border-gray-200 bg-white p-3 text-xs shadow-lg sm:text-sm"
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
      <p className={`relative text-4xl sm:mt-2`}>
        {isScore ? (
          <>
            <span className={`text-4xl font-bold ${scoreColor}`}>{Math.round(Number(value))}</span>
            <span className="text-muted text-4xl font-semibold">/100</span>
          </>
        ) : percentage ? (
          <span className="text-primary font-bold">
            {Math.round(Number(value))}
            <span>%</span>
          </span>
        ) : (
          <span className="text-primary">
            <span className="text-4xl font-bold">{value}</span>
            {unit && <span className="text-muted ml-2 text-sm sm:text-lg">{unit}</span>}
          </span>
        )}
      </p>
      {!percentage && !isScore && description && (
        <p className="text-muted sm:text-md relative mt-2 text-sm">{description}</p>
      )}
    </div>
  );
};

export default MetricItem;

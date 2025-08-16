import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

type ProgressCardProps = {
  title: string;
  description: string;
  progress?: number;
  className?: string;
};

export const ProgressCard = ({
  title,
  description,
  progress = 0,
  className,
}: ProgressCardProps) => {
  return (
    <div
      className={cn(
        'mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="mb-4 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <ArrowRight className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">{title}</h3>

      {/* Description */}
      <p className="mb-6 text-center text-sm text-gray-600">{description}</p>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Progress percentage */}
      <p className="text-center text-sm text-gray-500">{Math.round(progress)}% completado</p>
    </div>
  );
};

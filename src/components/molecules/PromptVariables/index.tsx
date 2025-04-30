import { Badge } from '@/components/atoms/Badge';
import { cn } from '@/utils/cn';

interface PromptVariablesProps {
  variables: string[];
  className?: string;
}

export const PromptVariables = ({ variables, className }: PromptVariablesProps) => {
  if (!variables.length) return null;

  return (
    <div
      className={cn(
        'space-y-2 rounded-lg border border-gray-300 bg-white p-4 shadow-sm sm:space-y-4 sm:p-6',
        className,
      )}
    >
      <h3 className="text-md font-medium sm:text-lg">Variables Input</h3>
      <div className="flex flex-wrap gap-2">
        {variables.map((variable, index) => (
          <Badge variant="outline" key={index} className="px-3 py-2">
            {variable}
          </Badge>
        ))}
      </div>
    </div>
  );
};

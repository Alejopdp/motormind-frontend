import { cn } from '@/utils/cn';

interface PromptVariablesProps {
  variables: string[];
  className?: string;
}

export const PromptVariables = ({ variables, className }: PromptVariablesProps) => {
  if (!variables.length) return null;

  return (
    <div className={cn('rounded-lg bg-white p-6 shadow-md', className)}>
      <h3 className="mb-4 text-lg font-medium text-gray-800">Variables Input</h3>
      <div className="flex flex-wrap gap-2">
        {variables.map((variable, index) => (
          <div
            key={index}
            className={cn(
              'rounded-md border px-3 py-1.5',
              'border-blue-200 bg-blue-50',
              'font-mono text-sm text-blue-700',
            )}
          >
            {variable}
          </div>
        ))}
      </div>
    </div>
  );
};

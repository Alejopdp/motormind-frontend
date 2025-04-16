import { ClipboardListIcon } from 'lucide-react';
import Spinner from '../Spinner';
import { Button } from '../Button';

interface QuestionsListProps {
  questions: string[];
  isLoading?: boolean;
  title?: string;
  error?: Error | null;
  onRetry?: () => void;
}

export const QuestionsList = ({
  questions,
  isLoading = false,
  title = 'Cuestionario de Diagnóstico',
  error = null,
  onRetry,
}: QuestionsListProps) => {
  if (error) {
    return (
      <div className="w-full rounded-lg border border-red-200 bg-red-50 p-5 shadow-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-destructive">
            Error: {error.message || 'Error al generar las preguntas'}
          </p>
          {onRetry && <Button onClick={onRetry}>Reintentar</Button>}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="pb-3">
        <div className="flex items-center gap-2">
          <ClipboardListIcon className="text-primary h-5 w-5" />
          <p className="text-lg font-medium">{title}</p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Spinner label="Generando preguntas..." />
          </div>
        ) : (
          <ul className="space-y-3 pl-1">
            {questions.map((question, index) => (
              <li key={`question-${index}`} className="flex gap-2 text-gray-800">
                <span className="text-primary min-w-[24px] font-medium">{index + 1}.</span>
                <span>{question}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

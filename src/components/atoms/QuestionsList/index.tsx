import { ClipboardListIcon } from 'lucide-react';
import Spinner from '../Spinner';

interface QuestionsListProps {
  questions: string[];
  isLoading?: boolean;
  title?: string;
}

export const QuestionsList = ({
  questions,
  isLoading = false,
  title = 'Cuestionario de Diagnóstico',
}: QuestionsListProps) => {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="pb-3">
        <div className="flex items-center gap-2">
          <ClipboardListIcon className="text-primary h-5 w-5" />
          <p className="text-md font-medium sm:text-lg">{title}</p>
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
              <li key={`question-${index}`} className="flex gap-2 text-sm sm:text-base">
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

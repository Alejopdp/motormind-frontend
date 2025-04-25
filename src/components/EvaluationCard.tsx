import { AiDiagnosisEvaluation } from '@/types/Diagnosis';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ScoreBar from '@/components/ScoreBar';
import StageBadge from '@/components/StageBadge';

interface EvaluationCardProps {
  evaluation: AiDiagnosisEvaluation;
  onView: (id: string) => void;
}

const EvaluationCard = ({ evaluation, onView }: EvaluationCardProps) => {
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  return (
    <div className="flex flex-col rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="font-mono text-sm text-gray-500">ID:</span>
          <span className="ml-2 font-mono text-sm font-medium text-gray-900">
            {typeof evaluation.diagnosisId === 'string'
              ? evaluation.diagnosisId
              : (evaluation.diagnosisId as { _id: string })?._id || 'N/A'}
          </span>
        </div>
        <StageBadge stage={evaluation.phase} />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">Precisión</p>
          <ScoreBar score={evaluation.scores.scoreAntiHallucinationPrecision} />
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">Claridad</p>
          <ScoreBar score={evaluation.scores.scoreClarityProfessionalism} />
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">Formato</p>
          <ScoreBar score={evaluation.scores.scoreStrictFormat} />
        </div>
        <div>
          <p className="mb-1 text-xs font-medium text-gray-500">Promedio</p>
          <ScoreBar score={evaluation.scores.scoreGlobalAverage} />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-xs text-gray-500">{formatDate(evaluation.createdAt)}</span>
        <button
          onClick={() => onView(evaluation._id)}
          className="inline-flex cursor-pointer items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        >
          <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Ver
        </button>
      </div>
    </div>
  );
};

export default EvaluationCard;

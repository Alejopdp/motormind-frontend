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

  // Función para determinar el color del score global
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 border-green-500';
    if (score >= 60) return 'text-yellow-500 border-yellow-500';
    if (score >= 40) return 'text-orange-500 border-orange-500';
    return 'text-red-500 border-red-500';
  };

  // Función para renderizar los scores específicos según la fase
  const renderSpecificScores = () => {
    switch (evaluation.phase) {
      case 'RECEPTION':
        return (
          <>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Relevancia de preguntas</p>
              <ScoreBar score={evaluation.scores.scoreQuestionRelevance || 0} />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Priorización</p>
              <ScoreBar score={evaluation.scores.scoreQuestionPrioritization || 0} />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Cantidad de preguntas</p>
              <ScoreBar score={evaluation.scores.scoreQuestionCount || 0} />
            </div>
          </>
        );
      case 'PRELIMINARY_DIAGNOSIS':
        return (
          <>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Precisión de hipótesis</p>
              <ScoreBar score={evaluation.scores.scoreHypothesisAccuracy || 0} />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Calidad de razonamiento</p>
              <ScoreBar score={evaluation.scores.scoreReasoningQuality || 0} />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Calidad de verificación</p>
              <ScoreBar score={evaluation.scores.scoreVerificationStepsQuality || 0} />
            </div>
          </>
        );
      case 'FINAL_REPORT':
        return (
          <>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Plan de reparación</p>
              <ScoreBar score={evaluation.scores.scoreRepairPlan || 0} />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Lista de piezas</p>
              <ScoreBar score={evaluation.scores.scorePartsList || 0} />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Presupuesto</p>
              <ScoreBar score={evaluation.scores.scoreBudget || 0} />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Otras averías</p>
              <ScoreBar score={evaluation.scores.scoreAlternativeFailuresConclusion || 0} />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md">
      <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-sm text-gray-500">ID:</span>
            <span className="font-mono text-sm font-medium text-gray-900">
              {typeof evaluation.diagnosisId === 'string'
                ? evaluation.diagnosisId
                : (evaluation.diagnosisId as { _id: string })?._id || 'N/A'}
            </span>
          </div>
          <StageBadge stage={evaluation.phase} />
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-medium text-gray-900">
              {evaluation.phase === 'RECEPTION' && 'Evaluación de Recepción'}
              {evaluation.phase === 'PRELIMINARY_DIAGNOSIS' &&
                'Evaluación de Diagnóstico Preliminar'}
              {evaluation.phase === 'FINAL_REPORT' && 'Evaluación de Informe Final'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Creada el {formatDate(evaluation.createdAt)}
            </p>
          </div>
          <div
            className={`flex h-28 w-28 items-center justify-center rounded-full border-2 ${getScoreColor(evaluation.scores.scoreGlobalAverage)}`}
          >
            <div className="text-center">
              <span className="text-3xl font-bold">{evaluation.scores.scoreGlobalAverage}</span>
              <span className="block text-xs">Puntos</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="mb-4 text-sm font-medium text-gray-700">Generales</h4>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500">Precisión</p>
              <ScoreBar score={evaluation.scores.scoreAntiHallucinationPrecision} />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500">Claridad</p>
              <ScoreBar score={evaluation.scores.scoreClarityProfessionalism} />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500">Formato</p>
              <ScoreBar score={evaluation.scores.scoreStrictFormat} />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="mb-4 text-sm font-medium text-gray-700">Específicos</h4>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">{renderSpecificScores()}</div>
        </div>

        <div className="mt-auto flex items-center justify-end border-t border-gray-100 pt-6">
          <button
            onClick={() => onView(evaluation._id)}
            className="inline-flex cursor-pointer items-center rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationCard;

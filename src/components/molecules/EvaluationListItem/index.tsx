import { AiDiagnosisEvaluation } from '@/types/AiDiagnosisEvaluation';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ScoreBar from '@/components/atoms/ScoreBar';
import { TestTubeDiagonal } from 'lucide-react';
import { Badge } from '@/components/atoms/Badge';
import { Link } from 'react-router-dom';

interface EvaluationListItemProps {
  evaluation: AiDiagnosisEvaluation;
}

const EvaluationListItem = ({ evaluation }: EvaluationListItemProps) => {
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  // Función para determinar el color del score global
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 border-green-600';
    if (score >= 60) return 'text-yellow-600 border-yellow-600';
    if (score >= 40) return 'text-orange-600 border-orange-600';
    return 'text-red-600 border-red-600';
  };

  // Función para renderizar los scores específicos según la fase
  const renderSpecificScores = () => {
    switch (evaluation.phase) {
      case 'RECEPTION':
        return (
          <>
            <ScoreBar
              label="Precisión de hipótesis"
              score={evaluation.scores.scoreHypothesisAccuracy || 0}
            />
            <ScoreBar
              label="Calidad de razonamiento"
              score={evaluation.scores.scoreReasoningQuality || 0}
            />
            <ScoreBar
              label="Calidad de verificación"
              score={evaluation.scores.scoreVerificationStepsQuality || 0}
            />
          </>
        );
      case 'PRELIMINARY_DIAGNOSIS':
        return (
          <>
            <ScoreBar
              label="Precisión de hipótesis"
              score={evaluation.scores.scoreHypothesisAccuracy || 0}
            />
            <ScoreBar
              label="Calidad de razonamiento"
              score={evaluation.scores.scoreReasoningQuality || 0}
            />
            <ScoreBar
              label="Calidad de verificación"
              score={evaluation.scores.scoreVerificationStepsQuality || 0}
            />
          </>
        );
      case 'FINAL_REPORT':
        return (
          <>
            <ScoreBar label="Plan de reparación" score={evaluation.scores.scoreRepairPlan || 0} />
            <ScoreBar label="Lista de piezas" score={evaluation.scores.scorePartsList || 0} />
            <ScoreBar label="Presupuesto" score={evaluation.scores.scoreBudget || 0} />
            <ScoreBar
              label="Otras averías"
              score={evaluation.scores.scoreAlternativeFailuresConclusion || 0}
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderPhase = () => {
    switch (evaluation.phase) {
      case 'RECEPTION':
        return 'Recepción';
      case 'PRELIMINARY_DIAGNOSIS':
        return 'Diagnóstico Preliminar';
      case 'FINAL_REPORT':
        return 'Informe Final';
      default:
        return null;
    }
  };

  const getPhaseVariant = (phase: string) => {
    switch (phase) {
      case 'RECEPTION':
        return 'secondary';
      case 'PRELIMINARY_DIAGNOSIS':
        return 'tertiary';
      case 'FINAL_REPORT':
        return 'selected';
      default:
        return 'outline';
    }
  };

  return (
    <Link to={`/audits/evaluations/${evaluation._id}`}>
      <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 transition-colors duration-200 hover:bg-[#EAF2FD]">
        <div className="flex flex-col items-center justify-between sm:flex-row sm:items-start">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100 sm:h-10 sm:w-10">
              <TestTubeDiagonal className="h-5 w-5 text-blue-600" />
            </div>
            <div className="max-w-[200px] sm:max-w-[300px]">
              <p className="truncate text-sm font-medium sm:text-base">
                {evaluation.phase === 'RECEPTION' && 'Evaluación de Recepción'}
                {evaluation.phase === 'PRELIMINARY_DIAGNOSIS' &&
                  'Evaluación de Diagnóstico Preliminar'}
                {evaluation.phase === 'FINAL_REPORT' && 'Evaluación de Informe Final'}
              </p>
              <p className="text-muted truncate text-xs sm:text-sm">
                ID:{' '}
                {typeof evaluation.diagnosisId === 'string'
                  ? evaluation.diagnosisId
                  : (evaluation.diagnosisId as { _id: string })?._id || 'N/A'}
              </p>
            </div>
          </div>

          <div className="my-2 flex flex-col items-center sm:my-0 sm:pr-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full border-2 sm:h-14 sm:w-14 ${getScoreColor(evaluation.scores.scoreGlobalAverage)}`}
            >
              <span className="text-xl font-bold sm:text-2xl">
                {evaluation.scores.scoreGlobalAverage.toFixed(0)}
              </span>
            </div>
            <span className="text-muted text-sm">Puntos</span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-muted sm:text-md mb-2 text-sm font-medium">Generales</h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ScoreBar label="Precisión" score={evaluation.scores.scoreAntiHallucinationPrecision} />
            <ScoreBar label="Claridad" score={evaluation.scores.scoreClarityProfessionalism} />
            <ScoreBar label="Formato" score={evaluation.scores.scoreStrictFormat} />
          </div>

          <h1 className="text-muted sm:text-md mb-2 text-sm font-medium">Específicos</h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{renderSpecificScores()}</div>

          <div className="flex flex-col border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted text-sm">Creada el {formatDate(evaluation.createdAt)}</p>
            <div className="mt-2 sm:mt-0">
              <Badge variant={getPhaseVariant(evaluation.phase)}>{renderPhase()}</Badge>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EvaluationListItem;

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { AlertCircle, ExternalLink, Copy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { useApi } from '@/hooks/useApi';
import { AiDiagnosisEvaluation } from '@/types/AiDiagnosisEvaluation';
import Spinner from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';
import ScoreBar from '@/components/atoms/ScoreBar';
import { Badge } from '@/components/atoms/Badge';
import HeaderPage from '@/components/molecules/HeaderPage';
import { diagnosisLink } from '@/utils';
import { Diagnosis } from '@/types/Diagnosis';
import { STALE_TIME } from '@/constants';

const AiEvaluationDetails: React.FC = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { execute: getEvaluation } = useApi<AiDiagnosisEvaluation>(
    'get',
    '/audits/evaluations/:evaluationId',
  );

  const {
    data: { data: evaluation } = { data: undefined },
    isLoading,
    isError,
  } = useQuery<{ data: AiDiagnosisEvaluation }>({
    queryKey: ['evaluation', evaluationId],
    queryFn: async () => {
      const response = await getEvaluation(undefined, undefined, {
        evaluationId: evaluationId as string,
      });
      return { data: response.data };
    },
    enabled: !!evaluationId,
    staleTime: STALE_TIME.ONE_MINUTE,
    retry: 0,
  });

  const copyDiagnosis = async (diagnosisId: string) => {
    try {
      await navigator.clipboard.writeText(diagnosisId);
      enqueueSnackbar('ID copiado al portapapeles', { variant: 'success' });
    } catch (err) {
      console.error('Error al copiar el ID:', err);
      enqueueSnackbar('Error al copiar el ID', { variant: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
        <Spinner />
      </div>
    );
  }

  if (isError || !evaluation) {
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
        <div className="text-destructive flex items-center gap-2 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5" />
          <span>Error al cargar los datos de la evaluación</span>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Volver atrás
        </Button>
      </div>
    );
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderPhaseSpecificScores = () => {
    switch (evaluation.phase) {
      case 'RECEPTION':
        return (
          <>
            <div className="col-span-1">
              <ScoreBar
                score={evaluation.scores.scoreQuestionRelevance || 0}
                label="Relevancia de Preguntas"
              />
            </div>
            <div className="col-span-1">
              <ScoreBar
                score={evaluation.scores.scoreQuestionPrioritization || 0}
                label="Priorización de Preguntas"
              />
            </div>
            <div className="col-span-1">
              <ScoreBar
                score={evaluation.scores.scoreQuestionCount || 0}
                label="Cantidad de Preguntas"
              />
            </div>
          </>
        );
      case 'PRELIMINARY_DIAGNOSIS':
        return (
          <>
            <div className="col-span-1">
              <ScoreBar
                score={evaluation.scores.scoreHypothesisAccuracy || 0}
                label="Precisión de Hipótesis"
              />
            </div>
            <div className="col-span-1">
              <ScoreBar
                score={evaluation.scores.scoreReasoningQuality || 0}
                label="Calidad del Razonamiento"
              />
            </div>
            <div className="col-span-1">
              <ScoreBar
                score={evaluation.scores.scoreVerificationStepsQuality || 0}
                label="Calidad de Pasos de Verificación"
              />
            </div>
          </>
        );
      case 'FINAL_REPORT':
        return (
          <>
            <div className="col-span-1">
              <ScoreBar score={evaluation.scores.scoreRepairPlan || 0} label="Plan de Reparación" />
            </div>
            <div className="col-span-1">
              <ScoreBar score={evaluation.scores.scorePartsList || 0} label="Lista de Partes" />
            </div>
            <div className="col-span-1">
              <ScoreBar score={evaluation.scores.scoreBudget || 0} label="Presupuesto" />
            </div>
            <div className="col-span-1">
              <ScoreBar
                score={evaluation.scores.scoreAlternativeFailuresConclusion || 0}
                label="Conclusiones de Fallos Alternativos"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Función para determinar el color del score global
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 border-green-500';
    if (score >= 60) return 'text-yellow-500 border-yellow-500';
    if (score >= 40) return 'text-orange-500 border-orange-500';
    return 'text-red-500 border-red-500';
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

  return (
    <div className="bg-background flex flex-grow flex-col">
      <HeaderPage
        data={{ title: 'Detalles de la Evaluación' }}
        onBack={() => navigate('/audits/evaluations')}
        headerActions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => copyDiagnosis(evaluation?.diagnosisId)}>
              <Copy className="h-4 w-4" />
              Copiar ID <span className="hidden sm:inline">diagnóstico</span>
            </Button>
            <Button
              onClick={() => navigate(diagnosisLink(evaluation?.diagnosis as Diagnosis, true))}
            >
              <ExternalLink className="h-4 w-4" />
              Ver <span className="hidden sm:inline">Diagnóstico</span>
            </Button>
          </div>
        }
      />

      <div className="container mx-auto px-4 py-2 sm:px-8 sm:py-6">
        <div className="mb-3 overflow-hidden rounded-lg bg-white p-4 shadow-md sm:mb-6 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl">Información General</h2>
          <div className="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted text-xs sm:text-sm">ID del Diagnóstico</p>
              <p className="text-sm font-medium sm:text-base">{evaluation.diagnosisId}</p>
            </div>
            <div>
              <p className="text-muted text-xs sm:text-sm">Fase</p>
              <Badge variant={getPhaseVariant(evaluation.phase)}>{renderPhase()}</Badge>
            </div>
            <div>
              <p className="text-muted text-xs sm:text-sm">Fecha de Creación</p>
              <p className="text-sm font-medium sm:text-base">{formatDate(evaluation.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted text-xs sm:text-sm">Modelo Evaluador</p>
              <p className="text-sm font-medium sm:text-base">{evaluation.evaluatorModel}</p>
            </div>
          </div>
        </div>

        <div className="mb-3 overflow-hidden rounded-lg bg-white p-4 shadow-sm sm:mb-6 sm:p-6">
          <div className="flex items-center justify-between sm:items-start">
            <h2 className="text-lg font-semibold sm:text-xl">Puntuaciones</h2>

            <div className="flex flex-col items-center sm:my-0 sm:pr-3">
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

          <div className="mb-4 sm:mb-8">
            <h1 className="text-muted sm:text-md mb-2 text-sm font-medium">Generales</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <ScoreBar
                label="Precisión"
                score={evaluation.scores.scoreAntiHallucinationPrecision}
              />
              <ScoreBar label="Claridad" score={evaluation.scores.scoreClarityProfessionalism} />
              <ScoreBar label="Formato" score={evaluation.scores.scoreStrictFormat} />
            </div>
          </div>

          <div className="mb-4 sm:mb-8">
            <h1 className="text-muted sm:text-md mb-2 text-sm font-medium">Específicos</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {renderPhaseSpecificScores()}
            </div>
          </div>
        </div>

        <div className="mb-3 overflow-hidden rounded-lg bg-white p-4 shadow-sm sm:sm:mb-6 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold sm:text-xl">Evaluación Detallada</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium sm:text-base">Fortalezas</h3>
              <ul className="text-muted list-inside list-disc space-y-1 text-sm sm:text-base">
                {evaluation.detailedEvaluation.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium sm:text-base">Debilidades</h3>
              <ul className="text-muted list-inside list-disc space-y-1 text-sm sm:text-base">
                {evaluation.detailedEvaluation.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="mb-2 text-sm font-medium sm:text-base">
                Justificación de Puntuaciones
              </h3>
              <p className="text-muted text-sm sm:text-base">
                {evaluation.detailedEvaluation.scoreJustification}
              </p>
            </div>
            <div className="md:col-span-2">
              <h3 className="mb-2 text-sm font-medium sm:text-base">Sugerencias de Mejora</h3>
              <ul className="text-muted list-inside list-disc space-y-1 text-sm sm:text-base">
                {evaluation.detailedEvaluation.improvementSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
            {evaluation.detailedEvaluation.criticalErrorsDetected.length > 0 && (
              <div className="md:col-span-2">
                <h3 className="mb-2 text-sm font-medium sm:text-base">
                  Errores Críticos Detectados
                </h3>
                <ul className="text-muted list-inside list-disc space-y-1 text-sm sm:text-base">
                  {evaluation.detailedEvaluation.criticalErrorsDetected.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {evaluation.comment && (
          <div className="overflow-hidden rounded-lg bg-white p-4 shadow-md sm:p-6">
            <h2 className="mb-4 text-lg font-semibold sm:text-xl">Comentario General</h2>
            <div className="rounded-md bg-gray-50 p-2 sm:p-4">
              <p className="text-muted whitespace-pre-line">{evaluation.comment}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiEvaluationDetails;

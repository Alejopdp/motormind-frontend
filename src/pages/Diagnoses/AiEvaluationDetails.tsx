import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AiDiagnosisEvaluation } from '@/types/Diagnosis';
import { useApi } from '@/hooks/useApi';
import Spinner from '@/components/atoms/Spinner';
import { AlertCircle, ExternalLink, Copy } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import ScoreBar from '@/components/ScoreBar';
import StageBadge from '@/components/StageBadge';
import { useSnackbar } from 'notistack';

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
    staleTime: 60000, // 1 minute
    retry: 0,
  });

  const copyDiagnosis = async () => {
    if (!evaluation) return;

    try {
      const diagnosisId = getDiagnosisId(evaluation);

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

  const getDiagnosisId = (evaluation: AiDiagnosisEvaluation) => {
    if (typeof evaluation.diagnosisId === 'string') {
      return evaluation.diagnosisId;
    }
    if (typeof evaluation.diagnosisId === 'object' && evaluation.diagnosisId !== null) {
      return evaluation.diagnosisId._id || 'N/A';
    }
    return 'N/A';
  };

  const getDiagnosisUrl = (evaluation: AiDiagnosisEvaluation) => {
    const diagnosisId = getDiagnosisId(evaluation);
    const carId = typeof evaluation.carId === 'string' ? evaluation.carId : evaluation.carId._id;

    if (!carId) {
      console.error('No se encontró el ID del vehículo');
      return '#';
    }

    return `/cars/${carId}/diagnosis/${diagnosisId}`;
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Detalles de la Evaluación</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={copyDiagnosis}
            className="inline-flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copiar ID diagnóstico
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(getDiagnosisUrl(evaluation))}
            className="inline-flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Ver Diagnóstico
          </Button>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-md">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Información General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600">ID del Diagnóstico</p>
              <p className="font-medium">{getDiagnosisId(evaluation)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fase</p>
              <div className="mt-1">
                <StageBadge stage={evaluation.phase} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de Creación</p>
              <p className="font-medium">{formatDate(evaluation.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Modelo Evaluador</p>
              <p className="font-medium">{evaluation.evaluatorModel}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-md">
        <div className="p-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Puntuaciones</h2>
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
            <h3 className="mb-4 text-sm font-medium text-gray-700">Generales</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="col-span-1">
                <ScoreBar score={evaluation.scores.scoreStrictFormat} label="Formato Estricto" />
              </div>
              <div className="col-span-1">
                <ScoreBar
                  score={evaluation.scores.scoreClarityProfessionalism}
                  label="Claridad y Profesionalismo"
                />
              </div>
              <div className="col-span-1">
                <ScoreBar
                  score={evaluation.scores.scoreAntiHallucinationPrecision}
                  label="Precisión Anti-Alucinación"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-4 text-sm font-medium text-gray-700">Específicos</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {renderPhaseSpecificScores()}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-md">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Evaluación Detallada</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium">Fortalezas</h3>
              <ul className="list-inside list-disc space-y-1 text-gray-700">
                {evaluation.detailedEvaluation.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Debilidades</h3>
              <ul className="list-inside list-disc space-y-1 text-gray-700">
                {evaluation.detailedEvaluation.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h3 className="mb-2 font-medium">Justificación de Puntuaciones</h3>
              <p className="text-gray-700">{evaluation.detailedEvaluation.scoreJustification}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="mb-2 font-medium">Sugerencias de Mejora</h3>
              <ul className="list-inside list-disc space-y-1 text-gray-700">
                {evaluation.detailedEvaluation.improvementSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
            {evaluation.detailedEvaluation.criticalErrorsDetected.length > 0 && (
              <div className="md:col-span-2">
                <h3 className="mb-2 font-medium">Errores Críticos Detectados</h3>
                <ul className="list-inside list-disc space-y-1 text-gray-700">
                  {evaluation.detailedEvaluation.criticalErrorsDetected.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {evaluation.comment && (
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="p-6">
            <h2 className="mb-4 text-xl font-semibold">Comentario General</h2>
            <div className="rounded-md bg-gray-50 p-4">
              <p className="whitespace-pre-line text-gray-700">{evaluation.comment}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiEvaluationDetails;

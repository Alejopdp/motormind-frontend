import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AiDiagnosisEvaluation } from '@/types/Diagnosis';
import { useApi } from '@/hooks/useApi';
import Spinner from '@/components/atoms/Spinner';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

const AiEvaluationDetails: React.FC = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const navigate = useNavigate();
  const { execute: getEvaluation } = useApi<AiDiagnosisEvaluation>(
    'get',
    '/audit/evaluations/:evaluationId',
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Detalles de la Evaluación</h1>
        <Button
          variant="outline"
          onClick={() => navigate(getDiagnosisUrl(evaluation))}
          className="inline-flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          Ver Diagnóstico
        </Button>
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
              <p className="text-sm text-gray-600">Etapa</p>
              <p className="font-medium">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    evaluation.stage === 'preliminary'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {evaluation.stage === 'preliminary' ? 'Preliminar' : 'Final'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fecha de Creación</p>
              <p className="font-medium">{formatDate(evaluation.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-md">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Puntuaciones</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600">Precisión</p>
              <div className="mt-1 flex items-center">
                <div className="h-2 flex-grow rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${evaluation.scores.accuracy}%` }}
                  ></div>
                </div>
                <span className="ml-2 font-medium">{evaluation.scores.accuracy}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Claridad</p>
              <div className="mt-1 flex items-center">
                <div className="h-2 flex-grow rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${evaluation.scores.clarity}%` }}
                  ></div>
                </div>
                <span className="ml-2 font-medium">{evaluation.scores.clarity}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Utilidad</p>
              <div className="mt-1 flex items-center">
                <div className="h-2 flex-grow rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${evaluation.scores.usefulness}%` }}
                  ></div>
                </div>
                <span className="ml-2 font-medium">{evaluation.scores.usefulness}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cobertura de Herramientas</p>
              <div className="mt-1 flex items-center">
                <div className="h-2 flex-grow rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${evaluation.scores.toolsCoverage}%` }}
                  ></div>
                </div>
                <span className="ml-2 font-medium">{evaluation.scores.toolsCoverage}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Coincidencia de Síntomas</p>
              <div className="mt-1 flex items-center">
                <div className="h-2 flex-grow rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${evaluation.scores.symptomMatch}%` }}
                  ></div>
                </div>
                <span className="ml-2 font-medium">{evaluation.scores.symptomMatch}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="p-6">
          <h2 className="mb-4 text-xl font-semibold">Comentario de la Evaluación</h2>
          <div className="rounded-md bg-gray-50 p-4">
            <p className="whitespace-pre-line text-gray-700">{evaluation.comment}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiEvaluationDetails;

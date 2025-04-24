import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '@/service/api.service';
import { AiDiagnosisEvaluation } from '@/types/Diagnosis';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AiEvaluationDetails = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const [evaluation, setEvaluation] = useState<AiDiagnosisEvaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvaluation = async () => {
      if (!evaluationId) return;

      try {
        setLoading(true);
        const data = await apiService.getDiagnosisEvaluationById(evaluationId);
        setEvaluation(data);
      } catch (err) {
        setError('Error al cargar la evaluación');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [evaluationId]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStageText = (stage: 'preliminary' | 'final') => {
    return stage === 'preliminary' ? 'Preliminar' : 'Final';
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  const calculateAverageScore = (scores: AiDiagnosisEvaluation['scores']) => {
    const { accuracy, clarity, usefulness, toolsCoverage, symptomMatch } = scores;
    return Math.round((accuracy + clarity + usefulness + toolsCoverage + symptomMatch) / 5);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div
        className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error || 'No se encontró la evaluación'}</span>
      </div>
    );
  }

  const averageScore = calculateAverageScore(evaluation.scores);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Detalles de la Evaluación</h1>
        <button
          onClick={() => navigate('/audit/evaluations')}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Volver
        </button>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-md">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-xl font-semibold">Información General</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600">ID de Diagnóstico:</p>
                  <p className="font-medium">
                    {typeof evaluation.diagnosisId === 'string'
                      ? evaluation.diagnosisId
                      : (evaluation.diagnosisId as { _id: string })?._id || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Etapa:</p>
                  <p className="font-medium">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        evaluation.stage === 'preliminary'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {getStageText(evaluation.stage)}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Fecha de Evaluación:</p>
                  <p className="font-medium">{formatDate(evaluation.createdAt)}</p>
                </div>
                {evaluation.diagnosis?.car && (
                  <div>
                    <p className="text-gray-600">Vehículo:</p>
                    <p className="font-medium">
                      {evaluation.diagnosis.car.brand} {evaluation.diagnosis.car.model} -{' '}
                      {evaluation.diagnosis.car.plate}
                    </p>
                  </div>
                )}
                {evaluation.diagnosis?.fault && (
                  <div>
                    <p className="text-gray-600">Síntoma Reportado:</p>
                    <p className="font-medium">{evaluation.diagnosis.fault}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-semibold">Puntuaciones</h2>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-gray-600">Precisión Técnica</span>
                    <span className="font-medium">{evaluation.scores.accuracy}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2.5 rounded-full ${getScoreColor(evaluation.scores.accuracy)}`}
                      style={{ width: `${evaluation.scores.accuracy}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-gray-600">Claridad</span>
                    <span className="font-medium">{evaluation.scores.clarity}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2.5 rounded-full ${getScoreColor(evaluation.scores.clarity)}`}
                      style={{ width: `${evaluation.scores.clarity}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-gray-600">Utilidad Práctica</span>
                    <span className="font-medium">{evaluation.scores.usefulness}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2.5 rounded-full ${getScoreColor(evaluation.scores.usefulness)}`}
                      style={{ width: `${evaluation.scores.usefulness}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-gray-600">Cobertura de Herramientas</span>
                    <span className="font-medium">{evaluation.scores.toolsCoverage}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2.5 rounded-full ${getScoreColor(evaluation.scores.toolsCoverage)}`}
                      style={{ width: `${evaluation.scores.toolsCoverage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between">
                    <span className="text-gray-600">Adecuación al Síntoma</span>
                    <span className="font-medium">{evaluation.scores.symptomMatch}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-2.5 rounded-full ${getScoreColor(evaluation.scores.symptomMatch)}`}
                      style={{ width: `${evaluation.scores.symptomMatch}%` }}
                    ></div>
                  </div>
                </div>
                <div className="border-t pt-2">
                  <div className="mb-1 flex justify-between">
                    <span className="font-semibold text-gray-600">Puntuación Promedio</span>
                    <span className="text-lg font-bold">{averageScore}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-200">
                    <div
                      className={`h-3 rounded-full ${getScoreColor(averageScore)}`}
                      style={{ width: `${averageScore}%` }}
                    ></div>
                  </div>
                </div>
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

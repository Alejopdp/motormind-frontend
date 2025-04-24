import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '@/service/api.service';
import { AiDiagnosisEvaluation } from '@/types/Diagnosis';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AiEvaluations = () => {
  const [evaluations, setEvaluations] = useState<AiDiagnosisEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /* Paginación - Comentada temporalmente
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  */
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDiagnosisEvaluations();
        setEvaluations(data.evaluations);
        /* Paginación - Comentada temporalmente
        setTotal(data.total);
        */
      } catch (err) {
        setError('Error al cargar las evaluaciones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  /* Paginación - Comentada temporalmente
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  */

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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Evaluaciones de Diagnósticos</h1>

      {evaluations.length === 0 ? (
        <div className="rounded-md bg-gray-100 p-4">
          <p className="text-gray-600">No hay evaluaciones disponibles.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full overflow-hidden rounded-lg bg-white shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">ID Diagnóstico</th>
                  <th className="px-4 py-3 text-left">Etapa</th>
                  <th className="px-4 py-3 text-left">Precisión</th>
                  <th className="px-4 py-3 text-left">Claridad</th>
                  <th className="px-4 py-3 text-left">Utilidad</th>
                  <th className="px-4 py-3 text-left">Herramientas</th>
                  <th className="px-4 py-3 text-left">Síntoma</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((evaluation) => (
                  <tr key={evaluation._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {typeof evaluation.diagnosisId === 'string'
                        ? evaluation.diagnosisId
                        : (evaluation.diagnosisId as { _id: string })?._id || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          evaluation.stage === 'preliminary'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {getStageText(evaluation.stage)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-2.5 w-16 rounded-full bg-gray-200">
                        <div
                          className={`h-2.5 rounded-full ${getScoreColor(evaluation.scores.accuracy)}`}
                          style={{ width: `${evaluation.scores.accuracy}%` }}
                        ></div>
                      </div>
                      <span className="ml-1 text-xs">{evaluation.scores.accuracy}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-2.5 w-16 rounded-full bg-gray-200">
                        <div
                          className={`h-2.5 rounded-full ${getScoreColor(evaluation.scores.clarity)}`}
                          style={{ width: `${evaluation.scores.clarity}%` }}
                        ></div>
                      </div>
                      <span className="ml-1 text-xs">{evaluation.scores.clarity}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-2.5 w-16 rounded-full bg-gray-200">
                        <div
                          className={`h-2.5 rounded-full ${getScoreColor(evaluation.scores.usefulness)}`}
                          style={{ width: `${evaluation.scores.usefulness}%` }}
                        ></div>
                      </div>
                      <span className="ml-1 text-xs">{evaluation.scores.usefulness}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-2.5 w-16 rounded-full bg-gray-200">
                        <div
                          className={`h-2.5 rounded-full ${getScoreColor(evaluation.scores.toolsCoverage)}`}
                          style={{ width: `${evaluation.scores.toolsCoverage}%` }}
                        ></div>
                      </div>
                      <span className="ml-1 text-xs">{evaluation.scores.toolsCoverage}%</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-2.5 w-16 rounded-full bg-gray-200">
                        <div
                          className={`h-2.5 rounded-full ${getScoreColor(evaluation.scores.symptomMatch)}`}
                          style={{ width: `${evaluation.scores.symptomMatch}%` }}
                        ></div>
                      </div>
                      <span className="ml-1 text-xs">{evaluation.scores.symptomMatch}%</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(evaluation.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/audit/evaluations/${evaluation._id}`)}
                        className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación - Comentada temporalmente
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando {evaluations.length} de {total} evaluaciones
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`rounded px-3 py-1 ${
                  page === 1
                    ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page * limit >= total}
                className={`rounded px-3 py-1 ${
                  page * limit >= total
                    ? 'cursor-not-allowed bg-gray-300 text-gray-500'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
          */}
        </>
      )}
    </div>
  );
};

export default AiEvaluations;

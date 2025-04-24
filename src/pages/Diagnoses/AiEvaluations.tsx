import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '@/service/api.service';
import { AiDiagnosisEvaluation } from '@/types/Diagnosis';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ScoreBar from '@/components/ScoreBar';
import StageBadge from '@/components/StageBadge';
import Spinner from '@/components/atoms/Spinner';

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

  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Evaluaciones de Diagnósticos</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">≥ 80%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-600">≥ 60%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
            <span className="text-sm text-gray-600">≥ 40%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">&lt; 40%</span>
          </div>
        </div>
      </div>

      {evaluations.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center shadow-sm">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-900">No hay evaluaciones disponibles</p>
          <p className="mt-2 text-sm text-gray-500">
            Las evaluaciones aparecerán aquí cuando estén disponibles.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    ID Diagnóstico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Etapa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Precisión
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Claridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Utilidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Herramientas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Síntoma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {evaluations.map((evaluation) => (
                  <tr key={evaluation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-900">
                        {typeof evaluation.diagnosisId === 'string'
                          ? evaluation.diagnosisId
                          : (evaluation.diagnosisId as { _id: string })?._id || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StageBadge stage={evaluation.stage} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ScoreBar score={evaluation.scores.accuracy} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ScoreBar score={evaluation.scores.clarity} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ScoreBar score={evaluation.scores.usefulness} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ScoreBar score={evaluation.scores.toolsCoverage} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ScoreBar score={evaluation.scores.symptomMatch} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {formatDate(evaluation.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/audit/evaluations/${evaluation._id}`)}
                        className="inline-flex cursor-pointer items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                      >
                        <svg
                          className="mr-1.5 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiEvaluations;

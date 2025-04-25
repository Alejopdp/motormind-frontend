import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '@/service/api.service';
import { AiDiagnosisEvaluation } from '@/types/Diagnosis';
import Spinner from '@/components/atoms/Spinner';
import EvaluationCard from '@/components/EvaluationCard';

const AiEvaluations = () => {
  const [evaluations, setEvaluations] = useState<AiDiagnosisEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDiagnosisEvaluations();
        setEvaluations(data.evaluations);
      } catch (err) {
        setError('Error al cargar las evaluaciones');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, []);

  const handleViewEvaluation = (id: string) => {
    navigate(`/audits/evaluations/${id}`);
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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-0">
          Evaluaciones de Diagnósticos
        </h1>
        <div className="flex flex-wrap items-center gap-4">
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
        <div className="grid grid-cols-1 gap-6">
          {evaluations.map((evaluation) => (
            <EvaluationCard
              key={evaluation._id}
              evaluation={evaluation}
              onView={handleViewEvaluation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AiEvaluations;

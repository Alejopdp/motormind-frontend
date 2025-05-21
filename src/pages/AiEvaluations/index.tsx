import { AlertCircle, FileChartPie } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/service/api.service';
import Spinner from '@/components/atoms/Spinner';
import EvaluationCard from '@/components/molecules/EvaluationListItem';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { STALE_TIME } from '@/constants';

const AiEvaluations = () => {
  const {
    data: evaluations = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['diagnosisEvaluations'],
    queryFn: async () => {
      const response = await apiService.getDiagnosisEvaluations();
      return response.evaluations;
    },
    staleTime: STALE_TIME.ONE_MINUTE,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner label="Cargando evaluaciones..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
        <div className="text-destructive flex items-center gap-2 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5" />
          <span>Error al cargar las evaluaciones</span>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-grow flex-col">
      <div className="sticky top-0 z-10 flex flex-col items-center justify-between bg-white px-6 py-2 shadow-xs sm:flex-row sm:px-8 sm:py-4 lg:flex-row">
        <div className="lg:w-1/3">
          <h1 className="py-0.5 text-xl font-semibold sm:py-0 lg:text-2xl">
            Evaluaciones <span className="hidden lg:inline"> de Diagnósticos</span>
          </h1>
        </div>
        <div className="sm: mt-0 mt-2 flex flex-wrap items-center gap-1 sm:gap-4">
          <Badge variant="default" className="bg-green-500 px-1.5 hover:bg-green-600 sm:px-3">
            ≥ 80%
          </Badge>
          <Badge variant="default" className="bg-yellow-500 px-1.5 hover:bg-yellow-600 sm:px-3">
            ≥ 60%
          </Badge>
          <Badge variant="default" className="bg-orange-500 px-1.5 hover:bg-orange-600 sm:px-3">
            ≥ 40%
          </Badge>
          <Badge variant="default" className="bg-red-500 px-1.5 hover:bg-red-600 sm:px-3">
            &lt; 40%
          </Badge>
        </div>
      </div>

      {!!evaluations.length && (
        <div className="px-4 py-4 sm:px-8">
          {evaluations.map((evaluation) => (
            <EvaluationCard key={evaluation._id} evaluation={evaluation} />
          ))}
        </div>
      )}

      {!evaluations.length && (
        <div className="absolute top-0 left-0 flex h-full w-full flex-col items-center justify-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4">
            <FileChartPie className="h-10 w-10 text-gray-500" />
          </div>
          <h3 className="text-muted mb-1 text-lg font-medium">No hay evaluaciones disponibles</h3>
        </div>
      )}
    </div>
  );
};

export default AiEvaluations;

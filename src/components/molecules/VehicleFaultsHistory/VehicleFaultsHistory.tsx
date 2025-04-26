import Spinner from '@/components/atoms/Spinner';
import { Diagnosis } from '@/types/Diagnosis';
import { useApi } from '@/hooks/useApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatToddmmyyyy } from '@/utils';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Link } from 'react-router-dom';

const VehicleFaultsHistory = ({ carId }: { carId: string }) => {
  const queryClient = useQueryClient();
  const { execute: getDiagnosesByCarId } = useApi<Diagnosis[]>('get', '/cars/:carId/diagnosis');

  const {
    data: { data: diagnoses = [] } = { data: [] },
    isLoading: isLoadingDiagnoses,
    isError: isErrorDiagnoses,
    error: diagnosesError,
  } = useQuery<{ data: Diagnosis[] }>({
    queryKey: ['getDiagnosesByCarId'],
    queryFn: async () => {
      const response = await getDiagnosesByCarId(undefined, undefined, {
        carId: carId as string,
      });
      return { data: response.data };
    },
    enabled: !!carId,
    staleTime: 60000,
  });

  useEffect(() => {
    if (isErrorDiagnoses) {
      console.log(diagnosesError);
      enqueueSnackbar('Error al buscar vehículos', { variant: 'error' });
    }
  }, [isErrorDiagnoses, diagnosesError]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['getDiagnosesByCarId'] });
    };
  }, [carId, queryClient]);

  return (
    <div className="mt-4 rounded-lg bg-white p-4 shadow-sm sm:p-6">
      <h3 className="mb-4 text-lg font-bold sm:text-xl">Historial de Averías Reciente</h3>

      {isLoadingDiagnoses ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col">
          {diagnoses.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-3">
                <AlertCircleIcon className="text-muted h-8 w-8" />
              </div>
              <p className="text-muted text-sm sm:text-base">
                Este vehículo no tiene historial de averías registrado.
              </p>
            </div>
          )}
          {diagnoses
            .sort((a, b) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .map((diagnosis: Diagnosis, index: number) => (
              <div className="overflow-hidden border border-gray-200 first:rounded-t-lg last:rounded-b-lg">
                <FaultsHistoryItem diagnosis={diagnosis} index={index} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default VehicleFaultsHistory;

const FaultsHistoryItem = ({ diagnosis, index }: { diagnosis: Diagnosis; index: number }) => {
  const getDiagnosisPath = () => {
    if (!diagnosis.preliminary) {
      return `/cars/${diagnosis.carId}/diagnosis/${diagnosis._id}/questions`;
    } else if (diagnosis.preliminary && !diagnosis.diagnosis) {
      return `/cars/${diagnosis.carId}/diagnosis/${diagnosis._id}`;
    } else if (diagnosis.diagnosis) {
      return `/cars/${diagnosis.carId}/diagnosis/${diagnosis._id}/final-report`;
    }
    return `/cars/${diagnosis.carId}/diagnosis/${diagnosis._id}`;
  };

  return (
    <div
      key={diagnosis._id}
      className={`border-b last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition-colors duration-200 hover:bg-[#EAF2FD]`}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <p className="text-muted text-xs sm:text-sm">
            Fecha:{' '}
            {diagnosis.createdAt ? formatToddmmyyyy(new Date(diagnosis.createdAt)) || '-' : '-'}
          </p>
          <Link to={getDiagnosisPath()}>
            <Button variant="link" size="sm" className="p-0">
              Ver Detalles
            </Button>
          </Link>
        </div>
        <p className="text-sm font-medium sm:text-base">{diagnosis.fault}</p>
      </div>
    </div>
  );
};

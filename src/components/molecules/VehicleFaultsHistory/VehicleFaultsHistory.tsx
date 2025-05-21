import Spinner from '@/components/atoms/Spinner';
import { Diagnosis } from '@/types/Diagnosis';
import { useApi } from '@/hooks/useApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { AlertCircleIcon } from 'lucide-react';
import { FaultsHistoryItem } from './FaultsHistoryItem';
import { STALE_TIME } from '@/constants';

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
    staleTime: STALE_TIME.ONE_MINUTE,
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
      <h3 className="text-md mb-3 font-medium sm:text-lg">Historial de Averías Reciente</h3>

      {isLoadingDiagnoses ? (
        <div className="mt-4 flex items-center justify-center">
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

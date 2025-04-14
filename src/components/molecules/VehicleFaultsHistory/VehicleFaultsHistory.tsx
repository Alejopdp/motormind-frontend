import { useNavigate } from 'react-router-dom';
import Spinner from '@/components/atoms/Spinner';
import { Diagnosis } from '@/types/Diagnosis';
import { useApi } from '@/hooks/useApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatToddmmyyyy } from '@/utils';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

const VehicleFaultsHistory = ({ carId }: { carId: string }) => {
  const navigate = useNavigate();
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

  const navigateToDiagnosis = (diagnosis: Diagnosis) => {
    const url = `/cars/${diagnosis.carId}/diagnosis/${diagnosis._id}`;

    navigate(url);
  };

  return (
    <div className="mt-4 rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-xl font-bold">Historial de Averías Reciente</h3>

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
              <p className="text-muted">Este vehículo no tiene historial de averías registrado.</p>
            </div>
          )}
          {diagnoses
            .sort((a, b) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .map((diagnosis: Diagnosis, index: number) => (
              <div className="overflow-hidden border border-gray-200 first:rounded-t-lg last:rounded-b-lg">
                <FaultsHistoryItem
                  breakdown={diagnosis}
                  index={index}
                  onViewDetails={navigateToDiagnosis}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default VehicleFaultsHistory;

const FaultsHistoryItem = ({
  breakdown,
  index,
  onViewDetails,
}: {
  breakdown: Diagnosis;
  index: number;
  onViewDetails: (diagnosis: Diagnosis) => void;
}) => {
  return (
    <div
      key={breakdown._id}
      className={`border-b last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} transition-colors duration-200 hover:bg-[#EAF2FD]`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-muted text-sm">
            Fecha: {formatToddmmyyyy(new Date(breakdown.createdAt))}
          </p>
          <Button
            variant="ghost"
            className="text-primary h-6 px-2"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(breakdown);
            }}
          >
            Ver detalles
          </Button>
        </div>
        <p className="font-medium">{breakdown.fault}</p>
      </div>
    </div>
  );
};

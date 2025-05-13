import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';

import { Car } from '@/types/Car';
import { useApi } from '@/hooks/useApi';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import VehicleFaultsHistory from '@/components/molecules/VehicleFaultsHistory/VehicleFaultsHistory';
import Spinner from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';
import HeaderPage from '@/components/molecules/HeaderPage';
import { PlusIcon } from 'lucide-react';
import { useCarPlateOrVin } from '@/hooks/useCarPlateOrVin';

const CarDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { execute: getCarById } = useApi<Car>('get', '/cars/:carId');

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['getCarById'] });
    };
  }, [params.carId, queryClient]);

  const {
    data: { data: car = {} as Car } = { data: {} as Car },
    isLoading: isLoadingCar,
    isError,
  } = useQuery<{ data: Car }>({
    queryKey: ['getCarById', params.carId],
    queryFn: async () => {
      const response = await getCarById(undefined, undefined, {
        carId: params.carId as string,
      });
      return { data: response.data };
    },
    staleTime: 60000, // 1 minute
    retry: 0,
  });

  const carDescription = useCarPlateOrVin(car);

  if (isLoadingCar)
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
        <Spinner />
      </div>
    );

  if (isError || !car) {
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
        <div className="text-destructive flex items-center gap-2 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5" />
          <span>Error al cargar los datos del vehículo</span>
        </div>
        <Button variant="outline" onClick={() => navigate('/cars')}>
          Volver atrás
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <HeaderPage
        onBack={() => navigate('/cars')}
        data={{
          title: 'Detalles del Vehículo',
          description: carDescription,
        }}
        headerActions={
          <Button onClick={() => navigate(`/cars/${params.carId}/new-diagnosis`)}>
            <PlusIcon className="!h-5 !w-5" />
            <span className="hidden sm:inline">Nuevo diagnóstico</span>
          </Button>
        }
      />
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-3 sm:space-y-6 sm:px-6 sm:py-6">
        <VehicleInformation car={car} editMode={true} minimized={false} />
        <VehicleFaultsHistory carId={params.carId as string} />
      </div>
    </div>
  );
};

export default CarDetails;

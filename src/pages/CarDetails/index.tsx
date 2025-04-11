import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { Car } from '@/types/Car';
import { useApi } from '@/hooks/useApi';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import VehicleFaultsHistory from '@/components/molecules/VehicleFaultsHistory/VehicleFaultsHistory';
import Spinner from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';
import HeaderPage from '@/components/molecules/HeaderPage/HeaderPage';

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
    error,
  } = useQuery<{ data: Car }>({
    queryKey: ['getCarById', params.carId],
    queryFn: async () => {
      const response = await getCarById(undefined, undefined, {
        carId: params.carId as string,
      });
      return { data: response.data };
    },
    enabled: true,
  });

  if (isLoadingCar)
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
        <Spinner />
      </div>
    );

  if (isError || !car) {
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
        Error: {error?.message || 'Failed to load car data'}
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <HeaderPage
        onBack={() => navigate('/vehicles')}
        data={{
          title: 'Detalles del Vehículo',
          description: `Matricula: ${car.plate || car.vinCode}`,
        }}
        headerActions={<Button onClick={() => {}}>+ Crear nuevo diagnóstico</Button>}
      />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
        <VehicleInformation car={car} />
        <VehicleFaultsHistory carId={params.carId as string} />
      </div>
    </div>
  );
};

export default CarDetails;

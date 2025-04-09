import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';

import { useCar } from '@/context/Car.context';
import { useApi } from '@/hooks/useApi';
import { Car } from '@/types/Car';
import Spinner from '@/components/atoms/Spinner';
import { VehicleListTable } from '@/components/molecules/VehiceList/VehicleListTable';
import { VehicleListHeader } from '@/components/molecules/VehiceList/VehicleListHeader';
import { Sidebar } from '@/components/organisms/Sidebar';

const Vehicles = () => {
  const { setCar } = useCar();
  const navigate = useNavigate();
  const [vinCode] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const { execute: getCarByVinRequest } = useApi<Car>('get', '/car/vin-or-plate/:vinCodeOrPlate');
  const { execute: getCarsRequest } = useApi<Car[]>('get', '/car');

  const { data: cars = [], isLoading: isLoadingCars } = useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const res = await getCarsRequest();
      if (res.status === 200) {
        return res.data;
      }
      throw new Error('Failed to fetch cars');
    },
  });

  const searchCarMutation = useMutation({
    mutationFn: async (vinCodeOrPlate: string) => {
      const res = await getCarByVinRequest(undefined, undefined, {
        vinCodeOrPlate,
      });
      if (res.status === 200) {
        return res.data;
      }
      throw new Error('Failed to fetch car');
    },
    onSuccess: (data) => {
      setCar(data);
      navigate(`/car/${data._id}`);
    },
    onError: () => {
      enqueueSnackbar(
        'Error al buscar el coche. Asegúrese que la matrícula o el VIN sean correctos.',
        { variant: 'error' },
      );
    },
  });

  const handleSearch = () => {
    if (vinCode) {
      searchCarMutation.mutate(vinCode);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-grow flex-col overflow-auto p-12">
        <VehicleListHeader onSearch={handleSearch} onAddVehicle={() => {}} />

        {isLoadingCars ? (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <VehicleListTable vehicles={cars} isLoading={isLoadingCars} />
        )}
      </div>
    </div>
  );
};

export default Vehicles;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useQuery, useMutation } from '@tanstack/react-query';
import Spinner from '@/components/atoms/Spinner';
import VehicleList from '@/components/molecules/VehiceList/VehicleList';
import { useCar } from '@/context/Car.context';
import { useApi } from '@/hooks/useApi';
import { Car } from '@/types/Car';

const Home = () => {
  const { setCar } = useCar();
  const navigate = useNavigate();
  const [vinCode, setVinCode] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const { execute: getCarByVinRequest } = useApi<Car>('get', '/car/vin-or-plate/:vinCodeOrPlate');
  const { execute: getCarsRequest } = useApi<Car[]>('get', '/car');

  const redirectToCarDetails = (id: string) => {
    navigate(`/car/${id}`);
  };

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
      redirectToCarDetails(data._id);
    },
    onError: () => {
      enqueueSnackbar(
        'Error al buscar el coche. Asegúrese que la matrícula o el VIN sean correctos.',
        {
          variant: 'error',
        },
      );
    },
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (vinCode) {
      searchCarMutation.mutate(vinCode);
    }
  };

  return (
    <div className="pb-12">
      <h3 className="mt-5">Búsqueda de diagnósticos</h3>
      <div className="rounded-lg border bg-white shadow">
        <div className="p-4">
          <form onSubmit={handleSearch}>
            <label htmlFor="vinCode" className="mb-1 block font-medium">
              Matrícula o Número de Bastidor (VIN)
            </label>
            <div className="mb-3 flex flex-col md:flex-row">
              <input
                id="vinCode"
                placeholder="Ingrese la matrícula o el VIN"
                aria-label="Ingrese la matrícula o el VIN"
                aria-describedby="button-addon2"
                value={vinCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVinCode(e.target.value)}
                className="w-full rounded-l-lg border p-2 md:rounded-r-none"
              />
              <button
                className="hidden min-w-[214px] rounded-r-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300 md:block"
                id="button-addon2"
                type="button"
                disabled={!vinCode || searchCarMutation.isPending}
                onClick={() => searchCarMutation.mutate(vinCode)}
              >
                {searchCarMutation.isPending ? <Spinner /> : 'Buscar diagnósticos'}
              </button>
            </div>
            <button
              className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-blue-300 md:hidden"
              type="button"
              disabled={!vinCode || searchCarMutation.isPending}
              onClick={() => searchCarMutation.mutate(vinCode)}
            >
              {searchCarMutation.isPending ? <Spinner /> : 'Buscar diagnósticos'}
            </button>
          </form>
        </div>
      </div>
      <div className="mt-5 mb-3 flex items-center gap-4">
        <h3 className="mb-0">Lista de vehículos</h3>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => navigate('/car/create')}
        >
          + Crear vehículo
        </button>
      </div>
      {isLoadingCars ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <VehicleList cars={cars} />
      )}
    </div>
  );
};

export default Home;

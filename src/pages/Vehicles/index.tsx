import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { useApi } from '@/hooks/useApi';
import { Car, CreateCar } from '@/types/Car';
import Spinner from '@/components/atoms/Spinner';
import { VehicleListTable } from '@/components/molecules/VehiceList/VehicleListTable';
import { CreateDiagnosticModal } from '@/components/organisms/CreateDiagnosticModal';

const LIMIT = 7;

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { execute: getCarsRequest } = useApi<{ data: Car[]; total: number }>('get', '/cars');
  const { execute: addVehicleRequest } = useApi<Car>('post', '/cars');
  const navigate = useNavigate();

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset page when search changes
    }, 800);

    handler();
    return () => {
      handler.cancel();
    };
  }, [searchTerm]);

  const {
    data: { data: cars = [], total = 0 } = { cars: [], total: 0 },
    isLoading: isLoadingCars,
    isError,
    error,
  } = useQuery<{ data: Car[]; total: number }>({
    queryKey: ['vehicles', debouncedSearchTerm, currentPage],
    queryFn: async () => {
      const response = await getCarsRequest(
        undefined,
        {
          ...(debouncedSearchTerm.trim() ? { search: debouncedSearchTerm } : {}),
          limit: LIMIT.toString(),
          page: currentPage.toString(),
        },
        undefined,
      );
      return response.data;
    },
    enabled: true,
    staleTime: 60000,
  });

  const addVehicleMutation = useMutation({
    mutationFn: (carData: CreateCar) => addVehicleRequest(carData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      enqueueSnackbar('Vehículo creado exitosamente', { variant: 'success' });
      setIsCreateModalOpen(false);
      navigate(`/cars/${response.data._id}`);
    },
    onError: () => {
      enqueueSnackbar('Error al crear el vehículo', { variant: 'error' });
    },
  });

  const handleCreateVehicle = (data: {
    licensePlate?: string;
    vin?: string;
    manualData?: {
      brand: string;
      model: string;
      year: string;
      licensePlate?: string;
      kilometers?: string;
    };
  }) => {
    if (data.manualData) {
      const carData: CreateCar = {
        vinCode: data.vin || '',
        brand: data.manualData.brand,
        model: data.manualData.model,
        year: parseInt(data.manualData.year),
        plate: data.manualData.licensePlate || '',
        data: { kilometers: data.manualData.kilometers || 0 },
      };
      addVehicleMutation.mutate(carData);
      return;
    }

    if (data.vin) {
      addVehicleMutation.mutate({ vinCode: data.vin });
      return;
    }

    if (data.licensePlate) {
      addVehicleMutation.mutate({ plate: data.licensePlate });
      return;
    }
  };

  useEffect(() => {
    if (isError && error) {
      enqueueSnackbar('Error al buscar vehículos', { variant: 'error' });
    }
  }, [isError, error, enqueueSnackbar]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex flex-grow flex-col overflow-auto p-12">
      <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-bold">Vehículos Registrados</h1>

        <div className="flex w-full flex-col space-y-2 sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="relative flex-grow sm:max-w-md">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              className="h-10 w-full min-w-[340px] rounded-md py-2 pr-4 pl-9"
              placeholder="Buscar por Matrícula, VIN, Marca, Modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-10"
            disabled={addVehicleMutation.isPending}
          >
            <PlusIcon className="h-4 w-4" />
            {addVehicleMutation.isPending ? 'Añadiendo...' : 'Añadir Vehículo'}
          </Button>

          <CreateDiagnosticModal
            onSubmit={handleCreateVehicle}
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            createOnly
            isLoading={addVehicleMutation.isPending}
          />
        </div>
      </div>

      {isLoadingCars ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <VehicleListTable
            vehicles={cars}
            isLoading={isLoadingCars}
            previousPage={handlePreviousPage}
            nextPage={handleNextPage}
            total={total}
            currentPage={currentPage}
            limit={LIMIT}
          />
        </>
      )}
    </div>
  );
};

export default Vehicles;

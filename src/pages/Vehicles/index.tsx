import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { debounce } from 'lodash';

import { useApi } from '@/hooks/useApi';
import { Car } from '@/types/Car';
import Spinner from '@/components/atoms/Spinner';
import { VehicleList } from '@/components/molecules/VehiceList';
import { CreateDiagnosticModal } from '@/components/organisms/CreateDiagnosticModal';

const LIMIT = 1000;

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const { execute: getCarsRequest } = useApi<{ data: Car[]; total: number }>('get', '/cars');

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
    <div className="flex flex-grow flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 flex flex-col items-center justify-between bg-white px-6 py-2 shadow-xs sm:flex-row sm:px-8 sm:py-4 lg:flex-row">
        <div className="lg:w-1/3">
          <h1 className="py-0.5 text-xl font-semibold sm:py-0 lg:text-2xl">
            Vehículos Registrados
          </h1>
          <p className="text-muted hidden xl:block">
            Gestiona y revisa todos los vehículos del taller
          </p>
        </div>

        <div className="mt-2 flex w-full gap-2 space-y-2 sm:mt-0 sm:w-auto sm:space-y-0 sm:space-x-2 lg:w-2/3">
          <div className="relative flex-grow lg:min-w-[300px]">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              className="h-8 w-full rounded-md py-2 pr-4 pl-9 sm:h-10"
              placeholder="Buscar por Matrícula, VIN, Marca, Modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-8 w-8 sm:h-auto sm:w-auto"
          >
            <PlusIcon className="!h-5 !w-5" />
            <span className="hidden lg:inline">Añadir Vehículo</span>
          </Button>

          <CreateDiagnosticModal
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
            createOnly
          />
        </div>
      </div>

      {isLoadingCars ? (
        <div className="mt-5 flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="px-2 py-2 sm:px-8 sm:py-4">
          <VehicleList
            vehicles={cars}
            isLoading={isLoadingCars}
            previousPage={handlePreviousPage}
            nextPage={handleNextPage}
            total={total}
            currentPage={currentPage}
            limit={LIMIT}
          />
        </div>
      )}
    </div>
  );
};

export default Vehicles;

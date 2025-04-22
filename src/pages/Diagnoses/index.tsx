import { useState, useEffect } from 'react';
import { FileSearch, PlusIcon, SearchIcon } from 'lucide-react';
import { debounce } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { formatDate } from '@/utils';
import { useApi } from '@/hooks/useApi';
import { Diagnosis } from '@/types/Diagnosis';
import Spinner from '@/components/atoms/Spinner';
import { DiagnosticListItem } from '@/components/molecules/DiagnosticListItem';
import { Pagination } from '@/components/molecules/Pagination';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { CreateDiagnosticModal } from '@/components/organisms/CreateDiagnosticModal';

const LIMIT = 5;

const Diagnoses = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { execute: getDiagnosesRequest } = useApi<{ data: Diagnosis[]; total: number }>(
    'get',
    '/diagnoses',
  );

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
    data: { data: diagnoses = [], total = 0 } = { data: [], total: 0 },
    isLoading: isLoadingDiagnoses,
    isError,
    error,
  } = useQuery<{ data: Diagnosis[]; total: number }>({
    queryKey: ['diagnoses', debouncedSearchTerm, currentPage],
    queryFn: async () => {
      const response = await getDiagnosesRequest(
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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(total / LIMIT);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-grow flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 flex items-center justify-between bg-white px-8 py-4 shadow-xs">
        <div className="w-1/3">
          <h1 className="text-2xl font-semibold">Diagnósticos</h1>
          <p className="text-muted">Gestiona y revisa todos los diagnósticos del taller</p>
        </div>

        <div className="flex w-2/3 flex-col space-y-2 sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="relative min-w-[300px] flex-grow">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              className="h-10 w-full rounded-md py-2 pr-4 pl-9"
              placeholder="Buscar por vehículo o problema..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="h-10">
            <PlusIcon className="!h-5 !w-5" />
            <span className="hidden sm:inline">Nuevo diagnóstico</span>
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto px-8 py-4">
          {isError && (
            <h5 className="text-destructive mb-2 font-semibold">Error: {error?.message}</h5>
          )}

          {isLoadingDiagnoses ? (
            <div className="flex items-center justify-center">
              <Spinner className="mt-5" />
            </div>
          ) : diagnoses.length > 0 ? (
            <div className="space-y-4">
              {diagnoses.map((diagnosis, index) => (
                <DiagnosticListItem
                  key={index}
                  vehicle={diagnosis.car}
                  problems={diagnosis.preliminary?.possibleReasons?.map(({ title }) => title) || []}
                  technician={diagnosis.mechanic}
                  timestamp={formatDate(diagnosis.createdAt)}
                  diagnosisLink={`${window.location.origin}/cars/${diagnosis.carId}/diagnosis/${diagnosis._id}/${diagnosis.diagnosis?.confirmedFailures?.length > 0 ? 'final-report' : ''}`}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <FileSearch className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="mb-1 text-lg font-medium">No se encontraron diagnósticos</h3>
              <p className="mb-4 text-gray-500">Intenta buscar nuevos diagnósticos.</p>
            </div>
          )}
        </div>

        {/* Fixed Footer with Pagination */}
        {diagnoses.length > 0 && (
          <div className="sticky bottom-0">
            <Pagination
              total={total}
              currentPage={currentPage}
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
            />
          </div>
        )}
      </div>

      <CreateDiagnosticModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  );
};

export default Diagnoses;

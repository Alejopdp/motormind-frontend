import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, PlusIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import { diagnosisLink, formatDate } from '@/utils';
import { Diagnosis } from '@/types/Diagnosis';
import { useApi } from '@/hooks/useApi';
import { DiagnosticListItem } from '@/components/molecules/DiagnosticListItem';
import { DIAGNOSIS_STATUS } from '@/constants';
import Spinner from '@/components/atoms/Spinner';
import { CreateDiagnosticModal } from '@/components/organisms/CreateDiagnosticModal';
import { Button } from '@/components/atoms/Button';

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { execute: getDiagnosesRequest } = useApi<{ data: Diagnosis[] }>('get', '/diagnoses');

  const {
    data: { data: diagnoses = [] } = { data: [] },
    isLoading: isLoadingDiagnoses,
    isError,
    error,
  } = useQuery<{ data: Diagnosis[] }>({
    queryKey: ['diagnoses'],
    queryFn: async () => {
      const response = await getDiagnosesRequest(undefined, { totalLimit: 5 }, undefined);

      return response.data;
    },
    enabled: true,
    staleTime: 60000,
    retry: false,
  });

  useEffect(() => {
    if (isError && error) {
      enqueueSnackbar(`Error: No se pudieron obtener los diagnósticos`, { variant: 'error' });
    }
  }, [isError, error]);

  return (
    <div className="flex flex-grow flex-col overflow-auto">
      <div className="fixed top-0 right-0 left-0 z-40 flex h-12 items-center justify-between bg-white px-3 py-2 shadow-xs sm:hidden">
        <h1 className="ml-12 text-base font-bold">Panel</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} size="sm" className="h-8 w-8 p-0">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      <main className="flex flex-col">
        <div className="sticky top-0 z-10 hidden h-12 items-center justify-between bg-white px-4 py-4 shadow-xs sm:flex sm:px-8 sm:py-6 md:h-16">
          <h1 className="ml-6 text-lg font-bold sm:text-xl md:ml-0 lg:text-2xl">Panel</h1>
          <Button onClick={() => setIsCreateModalOpen(true)} size="lg">
            <PlusIcon className="!h-5 !w-5" />
            <span className="hidden sm:inline">Nuevo diagnóstico</span>
          </Button>
        </div>

        <div className="mt-12 p-2 sm:mt-0 sm:px-4">
          <div className="m-2 sm:m-4">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <h2 className="text-base font-bold sm:text-lg lg:text-xl">Diagnósticos Recientes</h2>
              <Link to="/diagnoses" className="text-primary text-sm sm:text-base sm:font-medium">
                Ver todos
              </Link>
            </div>

            {isLoadingDiagnoses ? (
              <div className="flex items-center justify-center">
                <Spinner className="mt-5" />
              </div>
            ) : diagnoses.length > 0 ? (
              <div className="mt-5 sm:mt-0">
                {diagnoses.map((diagnosis, index) => (
                  <DiagnosticListItem
                    key={index}
                    diagnosisLink={diagnosisLink(diagnosis, true)}
                    vehicle={diagnosis.car}
                    problems={
                      diagnosis.preliminary?.possibleReasons.map(({ title }) => title) || []
                    }
                    questions={diagnosis.questions || []}
                    technician={diagnosis.createdBy}
                    status={
                      diagnosis.status as (typeof DIAGNOSIS_STATUS)[keyof typeof DIAGNOSIS_STATUS]
                    }
                    timestamp={formatDate(diagnosis.createdAt)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center">
                <div className="mb-3 rounded-full bg-gray-100 p-3 sm:mb-4 sm:p-4">
                  <FileSearch className="h-8 w-8 text-gray-500 sm:h-10 sm:w-10" />
                </div>
                <h3 className="mb-1 text-base font-medium sm:text-lg">
                  No se encontraron diagnósticos
                </h3>
                <p className="mb-4 text-sm text-gray-500 sm:text-base">
                  No hay diagnósticos recientes.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <CreateDiagnosticModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  );
};

export default Dashboard;

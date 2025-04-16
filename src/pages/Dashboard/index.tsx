import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileSearch } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { formatDate } from '@/utils';
import { Diagnosis } from '@/types/Diagnosis';
import { useApi } from '@/hooks/useApi';
import { DiagnosticListItem } from '@/components/molecules/DiagnosticListItem';
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
  });

  return (
    <div className="flex flex-grow flex-col overflow-auto">
      <div className={'flex h-16 items-center justify-between bg-white px-8 py-6 shadow-xs'}>
        <h1 className="!text-2xl !font-bold">Dashboard</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>+ Crear nuevo diagnóstico</Button>
      </div>

      {/* Dashboard content */}
      <main className="p-4">
        <div className="m-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="!text-xl !font-bold">Diagnósticos Recientes</h2>
            <Link to="/diagnoses" className="text-primary font-medium">
              Ver todos
            </Link>
          </div>

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
                  id={diagnosis._id || ''}
                  carId={diagnosis.carId || ''}
                  diagnosis={diagnosis.diagnosis || ''}
                  key={index}
                  vehicle={diagnosis.car}
                  problems={diagnosis.preliminary.possibleReasons.map(({ title }) => title)}
                  technician={diagnosis.mechanic}
                  timestamp={formatDate(diagnosis.createdAt)}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <FileSearch className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="mb-1 text-lg font-medium">No se encontraron diagnósticos</h3>
              <p className="mb-4 text-gray-500">No hay diagnósticos recientes.</p>
            </div>
          )}
        </div>
      </main>

      <CreateDiagnosticModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
    </div>
  );
};

export default Dashboard;

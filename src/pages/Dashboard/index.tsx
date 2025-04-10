import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { PlusIcon, FileSearch } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/context/Auth.context';
import { Button } from '@/components/atoms/Button';
import { Sidebar } from '@/components/organisms/Sidebar';
import { CreateNewDiagnosticModal } from '@/components/organisms/CreateNewDiagnosticModal';
import { DiagnosticListItem } from '@/components/molecules/DiagnosticListItem';
import { Diagnosis } from '@/types/Diagnosis';
import { useApi } from '@/hooks/useApi';
import Spinner from '@/components/atoms/Spinner';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const { execute: getDiagnosesRequest } = useApi<{ diagnoses: Diagnosis[]; total: number }>(
    'get',
    '/diagnoses',
  );

  const {
    data: { diagnoses = [], total = 0 } = { diagnoses: [], total: 0 },
    isLoading: isLoadingDiagnoses,
    isError,
    error,
  } = useQuery<{ diagnoses: Diagnosis[]; total: number }>({
    queryKey: ['diagnoses'],
    queryFn: async () => {
      const response = await getDiagnosesRequest(undefined, { totalLimit: 5 }, undefined);
      return response.data;
    },
    enabled: true,
    staleTime: 60000,
  });

  console.log(diagnoses, total);

  const handleSubmit = () => {
    // TODO: Implement submit handler
    console.log('Submit handler');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-grow flex-col overflow-auto">
        <div className={'flex h-16 items-center justify-between bg-white px-6 shadow-xs'}>
          <div className="flex items-center justify-center gap-2">
            <h1 className="!text-2xl !font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500">Bienvenido de nuevo, {user?.name || 'NN'}</p>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={() => setModalOpen(true)}>
              <PlusIcon className="h-4 w-4" />
              Nuevo Diagnóstico
            </Button>

            <CreateNewDiagnosticModal
              open={modalOpen}
              onOpenChange={setModalOpen}
              onSubmit={handleSubmit}
            />
          </div>
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

            {isLoadingDiagnoses ? (
              <div className="flex items-center justify-center">
                <Spinner />
              </div>
            ) : total > 0 ? (
              <>
                <DiagnosticListItem
                  vehicle={{
                    make: 'Toyota',
                    model: 'Corolla',
                    plate: 'ABC123',
                  }}
                  problems={['Problema 1', 'Problema 2', 'Problema 3']}
                  technician={{ name: 'Juan Perez', avatar: 'https://via.placeholder.com/150' }}
                  timestamp="2021-01-01"
                />
              </>
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
      </div>
    </div>
  );
};

export default Dashboard;

import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Car, SearchIcon, PlusIcon } from 'lucide-react';

import { useAuth } from '@/context/Auth.context';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Sidebar } from '@/components/organisms/Sidebar';
import { CreateNewDiagnosticModal } from '@/components/organisms/CreateNewDiagnosticModal';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = () => {
    // TODO: Implement submit handler
    console.log('Submit handler');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
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
            <div className="relative">
              <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                className="w-64 rounded-md border-gray-200 bg-gray-50 pl-9 focus:border-[#2A7DE1] focus:ring-[#2A7DE1]"
                placeholder="Buscar diagnóstico..."
              />
            </div>

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
              <a href="#" className="font-medium text-blue-600 hover:text-blue-800">
                Ver todos
              </a>
            </div>

            <div className="mb-4">
              <nav className="flex space-x-2">
                <a href="#" className="rounded-md bg-blue-600 px-3 py-2 font-medium text-white">
                  Todos
                </a>
                <a
                  href="#"
                  className="rounded-md px-3 py-2 font-medium text-gray-700 hover:bg-gray-100"
                >
                  Pendientes
                </a>
                <a
                  href="#"
                  className="rounded-md px-3 py-2 font-medium text-gray-700 hover:bg-gray-100"
                >
                  En Progreso
                </a>
                <a
                  href="#"
                  className="rounded-md px-3 py-2 font-medium text-gray-700 hover:bg-gray-100"
                >
                  Completados
                </a>
              </nav>
            </div>

            <div className="mb-4 rounded-lg bg-white shadow">
              <div className="p-4">
                <div className="mb-3 flex items-center">
                  <div className="mr-3 rounded bg-gray-100 p-2">
                    <Car size={24} />
                  </div>
                  <div>
                    <h5 className="text-subtitle mb-0 font-semibold">Seat León</h5>
                    <small className="text-label text-gray-500">4859 JKL</small>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      Pendiente
                    </span>
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                      Alta
                    </span>
                    <button className="text-gray-500 hover:text-gray-700">⋮</button>
                  </div>
                </div>
                <p className="text-body mb-1 font-bold">Problemas detectados:</p>
                <ul className="text-body mb-3 ml-5 list-disc">
                  <li>Fallo en sistema de inyección</li>
                  <li>Testigo motor encendido</li>
                </ul>
                <div className="flex items-center">
                  <img
                    src="https://github.com/mdo.png"
                    alt=""
                    width="32"
                    height="32"
                    className="mr-2 rounded-full"
                  />
                  <div className="font-medium">Carlos Ruiz</div>
                  <div className="text-label ml-auto text-gray-500">Hoy, 14:32</div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white shadow">
              <div className="p-4">
                <div className="mb-3 flex items-center">
                  <div className="mr-3 rounded bg-gray-100 p-2">
                    <Car size={24} />
                  </div>
                  <div>
                    <h5 className="text-subtitle mb-0 font-semibold">Volkswagen Golf</h5>
                    <small className="text-label text-gray-500">7621 MNP</small>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Completado
                    </span>
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      Media
                    </span>
                    <button className="text-gray-500 hover:text-gray-700">⋮</button>
                  </div>
                </div>
                <p className="text-body mb-1 font-bold">Problemas detectados:</p>
                <ul className="text-body mb-3 ml-5 list-disc">
                  <li>Ruido en suspensión delantera</li>
                </ul>
                <div className="flex items-center">
                  <img
                    src="https://github.com/mdo.png"
                    alt=""
                    width="32"
                    height="32"
                    className="mr-2 rounded-full"
                  />
                  <div className="font-medium">Ana Martínez</div>
                  <div className="text-label ml-auto text-gray-500">Hoy, 11:15</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

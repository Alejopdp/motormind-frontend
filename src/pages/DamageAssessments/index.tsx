import { useNavigate } from 'react-router-dom';
import { FileSearch, PlusIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

const DamageAssessments = () => {
  const navigate = useNavigate();
  // TODO: fetch peritajes, por ahora simula vacío
  const damageAssessments: unknown[] = [];

  return (
    <div className="bg-background flex min-h-screen w-full flex-row">
      <div className="flex flex-1 flex-col">
        {/* Header manual sticky, igual que Diagnósticos */}
        <div className="sticky top-0 z-10 flex flex-col items-center justify-between bg-white px-6 py-2 shadow-xs sm:flex-row sm:px-8 sm:py-4 lg:flex-row">
          <div className="lg:w-1/3">
            <h1 className="mr-2 py-0.5 text-xl font-semibold sm:py-0 lg:text-2xl">Peritajes</h1>
            <p className="text-muted hidden xl:block">
              Listado de peritajes realizados en el taller
            </p>
          </div>
          <div className="mt-2 flex w-full flex-col justify-end gap-2 space-y-2 sm:mt-0 sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-2 lg:w-2/3">
            <Button
              onClick={() => navigate('/damage-assessments/create')}
              className="h-8 w-8 sm:h-auto sm:w-auto"
            >
              <PlusIcon className="!h-5 !w-5" />
              <span className="hidden xl:inline">Crear peritaje</span>
            </Button>
          </div>
        </div>
        {/* Empty state o lista */}
        <div className="mx-auto max-w-2xl px-4 py-12">
          {damageAssessments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <FileSearch className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="mb-1 text-lg font-medium">No hay peritajes</h3>
              <p className="text-muted mb-4">Aún no se ha creado ningún peritaje en el sistema.</p>
              <Button onClick={() => navigate('/damage-assessments/create')}>Crear peritaje</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DamageAssessments;

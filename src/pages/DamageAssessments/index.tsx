import { useState, useEffect } from 'react';
import { FileSearch, PlusIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { CreateDiagnosticModal } from '@/components/organisms/CreateDiagnosticModal';
import { useAuth } from '@/context/Auth.context';
import { UserRole } from '@/types/User';
import { Navigate } from 'react-router-dom';
import { DamageAssessment } from '@/types/DamageAssessment';
import { useApi } from '@/hooks/useApi';
import { DamageAssessmentCard } from '@/components/molecules/DamageAssessmentCard';

const DamageAssessments = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();
  const [damageAssessments, setDamageAssessments] = useState<DamageAssessment[]>([]);
  const { execute, loading, error } = useApi<DamageAssessment[]>('get', '/damage-assessments');

  useEffect(() => {
    execute()
      .then((res) => setDamageAssessments(res.data))
      .catch(() => {});
  }, []);

  // Redirigir si no es admin
  if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen w-full flex-row">
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
              onClick={() => setIsCreateModalOpen(true)}
              className="h-8 w-8 sm:h-auto sm:w-auto"
            >
              <PlusIcon className="!h-5 !w-5" />
              <span className="hidden xl:inline">Crear peritaje</span>
            </Button>
          </div>
        </div>
        {/* Empty state o lista */}
        <div className="mx-auto w-full px-4 py-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span>Cargando peritajes...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span>Error al cargar peritajes</span>
            </div>
          ) : damageAssessments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <FileSearch className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="mb-1 text-lg font-medium">No hay peritajes</h3>
              <p className="text-muted mb-4">Aún no se ha creado ningún peritaje en el sistema.</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>Crear peritaje</Button>
            </div>
          ) : (
            <ul className="flex w-full flex-col gap-4 divide-y divide-gray-200">
              {damageAssessments.map((a) => (
                <li key={a._id} className="py-0">
                  <DamageAssessmentCard assessment={a} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <CreateDiagnosticModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          title="Crear Nuevo Peritaje"
          allowManualCar={false}
          submitButtonText="Comenzar peritaje"
          redirectTo="damage-assessment"
        />
      </div>
    </div>
  );
};

export default DamageAssessments;

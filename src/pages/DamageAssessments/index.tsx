import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { FileSearch, PlusIcon } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { UserRole } from '@/types/User';
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/context/Auth.context';
import { DamageAssessment } from '@/types/DamageAssessment';
import { Button } from '@/components/atoms/Button';
import { CreateDiagnosticModal } from '@/components/organisms/CreateDiagnosticModal';
import { DamageAssessmentCard } from '@/components/molecules/DamageAssessmentCard';
import { FloatingButton } from '@/components/atoms/FloatingButton';
import Spinner from '@/components/atoms/Spinner';
import { Select } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/Select';
import { ASSESSMENT_STATUS } from '@/constants';

const DamageAssessments = () => {
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const { execute: getDamageAssessmentsRequest } = useApi<DamageAssessment[]>(
    'get',
    '/damage-assessments',
  );

  const {
    data: { data: damageAssessments = [] } = { data: [] },
    isLoading: isLoadingDamages,
    isError,
  } = useQuery<{ data: DamageAssessment[]; total: number }>({
    queryKey: ['damage-assessments', selectedStatus],
    queryFn: async () => {
      const response = await getDamageAssessmentsRequest(
        undefined,
        {
          ...(selectedStatus !== 'ALL' ? { status: selectedStatus } : {}),
          limit: 1000, // TODO
          page: 0, // TODO
        },
        undefined,
      );
      return { data: response.data, total: response.data.length };
    },
    enabled: true,
    staleTime: 60000,
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar(`Error: No se pudieron obtener los peritajes`, { variant: 'error' });
    }
  }, [isError]);

  const getStatusText = (status: string) => {
    switch (status) {
      case ASSESSMENT_STATUS.PENDING_REVIEW:
        return 'Pendiente de Revisión';
      case ASSESSMENT_STATUS.DAMAGES_CONFIRMED:
        return 'Daños Confirmados';

      default:
        return status;
    }
  };

  const IS_ADMIN = [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role);

  if (!IS_ADMIN) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen w-full flex-row">
      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-10 flex flex-col items-center justify-between bg-white px-6 py-2 shadow-xs sm:flex-row sm:px-8 sm:py-4 lg:flex-row">
          <div className="lg:w-1/3">
            <h1 className="mr-2 py-0.5 text-xl font-semibold sm:py-0 lg:text-2xl">Peritajes</h1>
            <p className="text-muted hidden xl:block">
              Listado de peritajes realizados en el taller
            </p>
          </div>

          <div className="mt-2 flex w-full flex-col justify-end gap-2 space-y-2 sm:mt-0 sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-2 lg:w-2/3">
            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-8 w-full sm:h-10">
                  <SelectValue placeholder="Filtrar por estado " />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value={ASSESSMENT_STATUS.PENDING_REVIEW}>
                    {getStatusText(ASSESSMENT_STATUS.PENDING_REVIEW)}
                  </SelectItem>
                  <SelectItem value={ASSESSMENT_STATUS.DAMAGES_CONFIRMED}>
                    {getStatusText(ASSESSMENT_STATUS.DAMAGES_CONFIRMED)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {import.meta.env.VITE_WIZARD_V2_ENABLED === 'true' ? (
              <a
                href="/damage-assessments/preview-id/wizard-v2?step=intake"
                className="hidden h-8 w-8 items-center justify-center rounded bg-blue-600 px-3 text-white sm:flex sm:h-auto sm:w-auto"
              >
                Probar Wizard V2
              </a>
            ) : null}
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="hidden h-8 w-8 sm:flex sm:h-auto sm:w-auto"
            >
              <PlusIcon className="!h-5 !w-5" />
              <span className="hidden xl:inline">Crear peritaje</span>
            </Button>
            <FloatingButton onClick={() => setIsCreateModalOpen(true)} className="sm:hidden">
              <PlusIcon className="!h-5 !w-5" />
            </FloatingButton>
          </div>
        </div>
        {/* Empty state o lista */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-8">
          {isLoadingDamages ? (
            <div className="flex items-center justify-center">
              <Spinner className="mt-5" label="Cargando peritajes..." />
            </div>
          ) : damageAssessments.length === 0 || isError ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <FileSearch className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="mb-1 text-lg font-medium">No hay peritajes</h3>
              <p className="text-muted mb-4">Aún no se ha creado ningún peritaje en el sistema.</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>Crear peritaje</Button>
            </div>
          ) : (
            <>
              {damageAssessments.map((a: DamageAssessment, index: number) => (
                <DamageAssessmentCard key={index} assessment={a} />
              ))}
            </>
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

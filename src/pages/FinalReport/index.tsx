import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';

import { useApi } from '@/hooks/useApi';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import Spinner from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';
import HeaderPage from '@/components/molecules/HeaderPage/HeaderPage';
import { Diagnosis } from '@/types/Diagnosis';
import { Car } from '@/types/Car';
import { CheckCircleIcon, Share2Icon, StarIcon } from 'lucide-react';
import { Textarea } from '@/components/atoms/Textarea';
import { Conclusion } from './Conclusion';
import { EstimatedResources } from './EstimatedResources';
import { AlternativeFailures } from './AlternativeFailures';
import { PrimaryRepairSection } from './PrimaryRepairSection';
import { RatingModal } from '@/components/molecules/RatingModal/RatingModal';

const FinalReport = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [finalNotes, setFinalNotes] = useState('');
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { execute: getDiagnosisById } = useApi<Diagnosis>('get', '/cars/diagnosis/:diagnosisId');
  const { execute: updateFinalReportRequest } = useApi<Diagnosis>(
    'put',
    '/cars/:carId/diagnosis/:diagnosisId',
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['getCarById'] });
    };
  }, [params.carId, queryClient]);

  const {
    data: { data: diagnosis = {} as Diagnosis } = { data: {} as Diagnosis },
    isLoading: isLoadingDiagnosis,
    isError,
    error,
  } = useQuery<{ data: Diagnosis }>({
    queryKey: ['getDiagnosisById', params.diagnosisId],
    queryFn: async () => {
      const response = await getDiagnosisById(undefined, undefined, {
        diagnosisId: params.diagnosisId as string,
      });
      console.log('response', response);
      return { data: response.data };
    },
    enabled: !!params.diagnosisId,
    staleTime: 60000, // 1 minute
  });

  const { mutate: updateFinalReportMutation, isPending: isLoadingFinalReport } = useMutation({
    mutationFn: async ({
      finalNotes,
      ratingNotes,
      wasUseful,
    }: {
      finalNotes?: string;
      ratingNotes?: string;
      wasUseful?: boolean;
    }) => {
      const response = await updateFinalReportRequest(
        { finalNotes, ratingNotes, wasUseful },
        undefined,
        {
          carId: params.carId as string,
          diagnosisId: params.diagnosisId as string,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      enqueueSnackbar('Diagnóstico final actualizado correctamente', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al generar el diagnóstico final. Por favor, inténtalo de nuevo.', {
        variant: 'error',
      });
    },
  });

  if (isLoadingDiagnosis)
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
        <Spinner />
      </div>
    );

  if (isError || !diagnosis) {
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
        Error: {error?.message || 'Error al cargar los datos del diagnóstico preliminar'}
      </div>
    );
  }

  const backNavigation = () => navigate(`/cars/${params.carId}/diagnosis/${params.diagnosisId}`);

  const onUpdateReport = () => {
    updateFinalReportMutation({ finalNotes });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFinalNotes(e.target.value);
  };

  const shareReport = () => {
    const url = `${window.location.origin}/cars/${params.carId}/diagnosis/${params.diagnosisId}/final-report`;
    navigator.clipboard.writeText(url);
    enqueueSnackbar('URL del informe copiado', { variant: 'success' });
  };

  const handleRatingSubmit = (wasUseful: boolean, ratingNotes: string) => {
    updateFinalReportMutation({ ratingNotes, wasUseful });
    setIsRatingModalOpen(false);
  };

  return (
    <div className="bg-background min-h-screen">
      <HeaderPage
        onBack={backNavigation}
        data={{
          title: 'Informe Final',
          description: `Matricula: ${diagnosis.car?.plate || diagnosis.car?.vinCode}`,
        }}
      />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
        <VehicleInformation car={diagnosis.car as Car} editMode={false} minimized />

        <PrimaryRepairSection confirmedFailures={diagnosis.diagnosis?.confirmedFailures || []} />

        <AlternativeFailures alternativeFailures={diagnosis.diagnosis?.alternativeFailures || []} />

        <EstimatedResources estimatedResources={diagnosis.diagnosis?.estimatedBudget || {}} />

        <Conclusion
          recommendations={diagnosis.diagnosis?.conclusion?.recommendations || []}
          nextSteps={diagnosis.diagnosis?.conclusion?.nextSteps || []}
        />

        {/* Final Notes */}
        <div className="mb-20 space-y-2">
          <p className="block text-base font-medium">Notas Adicionales del Técnico (Internas)</p>
          <Textarea
            value={finalNotes}
            onChange={handleChange}
            className="min-h-[150px] resize-y"
            placeholder="Añade aquí cualquier observación adicional, detalles específicos del vehículo o consideraciones especiales para la reparación..."
            disabled={isLoadingFinalReport}
          />
        </div>
      </div>

      <div className="fixed right-0 bottom-0 left-0 flex justify-between border-t border-gray-200 bg-white p-4">
        <div className="flex gap-2">
          <Button variant="ghost" onClick={shareReport}>
            <Share2Icon className="h-4 w-4" />
            Compartir
          </Button>

          {diagnosis.wasUseful === undefined && (
            <Button variant="ghost" onClick={() => setIsRatingModalOpen(true)}>
              <StarIcon className="h-4 w-4" />
              Valorar
            </Button>
          )}
        </div>

        <Button onClick={onUpdateReport} disabled={isLoadingFinalReport || finalNotes.length === 0}>
          <CheckCircleIcon className="h-4 w-4" />
          {isLoadingFinalReport ? 'Cargando...' : 'Marcar como Reparación Completa'}
        </Button>
      </div>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleRatingSubmit}
        isLoading={isLoadingFinalReport}
      />
    </div>
  );
};

export default FinalReport;

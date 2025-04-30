import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeftIcon, SaveIcon, Share2Icon, StarIcon } from 'lucide-react';

import { useApi } from '@/hooks/useApi';
import { Car } from '@/types/Car';
import { Diagnosis } from '@/types/Diagnosis';
import { DiagnosisRating } from '@/types/DiagnosisRating';
import Spinner from '@/components/atoms/Spinner';
import HeaderPage from '@/components/molecules/HeaderPage';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import { RatingModal } from '@/components/molecules/RatingModal/RatingModal';
import { DiagnosticContextSection } from '@/components/molecules/DiagnosisContectSection';
import { VoiceTextInput } from '@/components/VoiceTextInput';
import { Button } from '@/components/atoms/Button';
import { AlternativeFailures } from './AlternativeFailures';
import { Conclusion } from './Conclusion';
import { PrimaryRepairSection } from './PrimaryRepairSection';
import { EstimatedResources } from './EstimatedResources';
import { useSymptom } from '@/hooks/useSymptom';

const FinalReport = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const backQueryParam = searchParams.get('back');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [finalNotes, setFinalNotes] = useState('');
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { execute: getDiagnosisById } = useApi<Diagnosis>('get', '/cars/diagnosis/:diagnosisId');
  const { execute: updateFinalReportRequest } = useApi<Diagnosis>(
    'put',
    '/cars/:carId/diagnosis/:diagnosisId',
  );
  const { execute: createDiagnosisRating } = useApi<DiagnosisRating>('post', '/diagnosis-ratings');

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['getCarById'] });
    };
  }, [params.carId, queryClient]);

  const {
    data: { data: diagnosis = {} as Diagnosis } = { data: {} as Diagnosis },
    isLoading: isLoadingDiagnosis,
    isError,
  } = useQuery<{ data: Diagnosis }>({
    queryKey: ['getDiagnosisById', params.diagnosisId],
    queryFn: async () => {
      const response = await getDiagnosisById(undefined, undefined, {
        diagnosisId: params.diagnosisId as string,
      });
      return { data: response.data };
    },
    enabled: !!params.diagnosisId,
    retry: false,
  });
  const { symptom } = useSymptom(diagnosis);

  useEffect(() => {
    if (diagnosis?.finalNotes) {
      setFinalNotes(diagnosis.finalNotes);
    }
  }, [diagnosis]);

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
      if (diagnosis.wasUseful === undefined) setIsRatingModalOpen(true);
    },
    onError: () => {
      enqueueSnackbar('Error al guardar. Por favor, inténtalo de nuevo.', {
        variant: 'error',
      });
    },
  });

  const { mutate: createDiagnosisRatingMutation, isPending: isLoadingDiagnosisRating } =
    useMutation({
      mutationFn: async (data: DiagnosisRating) => {
        const response = await createDiagnosisRating(data);
        return response.data;
      },
      onSuccess: () => {
        enqueueSnackbar('Valoración enviada, Muchas gracias!', { variant: 'success' });
        setIsRatingModalOpen(false);
      },
      onError: () => {
        enqueueSnackbar('Error al guardar la valoración. Por favor, inténtalo de nuevo.', {
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
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
        <div className="text-destructive flex items-center gap-2 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5" />
          <span>Error al cargar los datos del diagnóstico</span>
        </div>
        <Button variant="outline" onClick={() => navigate(`/cars/${params.carId}`)}>
          Volver atrás
        </Button>
      </div>
    );
  }

  const onUpdateReport = () => {
    updateFinalReportMutation({ finalNotes });
  };

  const shareReport = () => {
    const url = `${window.location.origin}/cars/${params.carId}/diagnosis/${params.diagnosisId}/final-report`;
    navigator.clipboard.writeText(url);
    enqueueSnackbar('URL del informe copiado', { variant: 'success' });
  };

  const handleRatingSubmit = (wasUseful: boolean, ratingNotes: string) => {
    createDiagnosisRatingMutation({
      diagnosisId: params.diagnosisId as string,
      notes: ratingNotes,
      wasUseful,
    });
  };

  const onBack = () => {
    if (backQueryParam === 'true') {
      navigate(-1); // Go back to the previous page
    } else {
      navigate(`/cars/${params.carId}`); // Go back to the route
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <HeaderPage
        onBack={onBack}
        data={{
          title: 'Informe Final',
          description: `Matricula: ${diagnosis.car?.plate || diagnosis.car?.vinCode}`,
        }}
      />
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6">
        <VehicleInformation car={diagnosis.car as Car} editMode={false} minimized />

        <DiagnosticContextSection symptoms={symptom} notes={diagnosis.notes} />

        <PrimaryRepairSection confirmedFailures={diagnosis.diagnosis?.confirmedFailures || []} />

        <AlternativeFailures alternativeFailures={diagnosis.diagnosis?.alternativeFailures || []} />

        <EstimatedResources estimatedResources={diagnosis.diagnosis?.estimatedBudget || {}} />

        <Conclusion
          recommendations={diagnosis.diagnosis?.conclusion?.recommendations || []}
          nextSteps={diagnosis.diagnosis?.conclusion?.nextSteps || []}
        />

        {/* Final Notes */}
        <div className="mb-20 space-y-2">
          <p className="block text-sm font-medium sm:text-base">
            Notas Adicionales del Técnico (Internas)
          </p>
          <VoiceTextInput
            value={finalNotes}
            onChange={setFinalNotes}
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
            <span className="hidden sm:inline">Compartir</span>
          </Button>

          {diagnosis.wasUseful === undefined && (
            <Button variant="ghost" onClick={() => setIsRatingModalOpen(true)}>
              <StarIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Valorar</span>
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/cars/${params.carId}`)}
            disabled={isLoadingFinalReport}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Volver <span className="hidden sm:inline">al detalle del Vehículo</span>
          </Button>
          <Button
            onClick={onUpdateReport}
            disabled={isLoadingFinalReport || finalNotes.length === 0}
          >
            <SaveIcon className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isLoadingFinalReport ? 'Cargando...' : 'Guardar Notas Adicionales'}
            </span>
            <span className="sm:hidden">{isLoadingFinalReport ? 'Cargando...' : 'Guardar'}</span>
          </Button>
        </div>
      </div>

      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmit={handleRatingSubmit}
        isLoading={isLoadingDiagnosisRating}
      />
    </div>
  );
};

export default FinalReport;

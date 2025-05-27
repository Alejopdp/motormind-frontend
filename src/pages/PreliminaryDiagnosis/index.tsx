import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowLeftIcon, BrainCircuitIcon, FileTextIcon, PlusIcon } from 'lucide-react';

import { Button } from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import { DiagnosticContextSection } from '@/components/molecules/DiagnosisContectSection';
import FaultCardCollapsible from '@/components/molecules/FaultCardCollapsible';
import HeaderPage from '@/components/molecules/HeaderPage';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import { VoiceTextInput } from '@/components/molecules/VoiceTextInput';
import OBDCodeInput from '@/components/molecules/ObdCodeInput';
import { LoadingModal } from '@/components/molecules/LoadingModal';
import { useApi } from '@/hooks/useApi';
import { useSymptom } from '@/hooks/useSymptom';
import { Car } from '@/types/Car';
import { Diagnosis } from '@/types/Diagnosis';
import { ProbabilityLevel } from '@/types/Probability';
import { ConfirmFaultModal } from './ConfirmFaultModal';
import { useCarPlateOrVin } from '@/hooks/useCarPlateOrVin';
import DetailsContainer from '@/components/atoms/DetailsContainer';

const PreliminaryDiagnosis = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const backQueryParam = searchParams.get('back');
  const [observations, setObservations] = useState('');
  const [obdCodes, setObdCodes] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingMorePossibleReasons, setIsLoadingMorePossibleReasons] = useState(false);
  const { execute: getDiagnosisById } = useApi<Diagnosis>('get', '/cars/diagnosis/:diagnosisId');
  const { execute: createFinalReportRequest } = useApi<Diagnosis>(
    'post',
    '/cars/:carId/diagnosis/:diagnosisId/final',
  );
  const { execute: getMorePossibleReasons } = useApi<Diagnosis>(
    'get',
    '/diagnoses/:diagnosisId/more-possible-reasons',
  );

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
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: false,
  });

  const { symptom } = useSymptom(diagnosis);
  const { mutate: createFinalReportMutation, isPending: isLoadingFinalReport } = useMutation({
    mutationFn: async ({
      observations,
      obdCodes,
      confirmedFailure,
    }: {
      observations: string;
      obdCodes: string[];
      confirmedFailure: {
        source: 'suggested' | 'custom';
        value: string;
        reasonId?: string;
      };
    }) => {
      const response = await createFinalReportRequest(
        { technicalNotes: observations, obdCodes, confirmedFailure },
        undefined,
        {
          carId: params.carId as string,
          diagnosisId: params.diagnosisId as string,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      navigate(`/cars/${params.carId}/diagnosis/${params.diagnosisId}/final-report`);
    },
    onError: () => {
      enqueueSnackbar('Error al generar el diagnóstico final. Por favor, inténtalo de nuevo.', {
        variant: 'error',
      });
    },
  });

  const carDescription = useCarPlateOrVin(diagnosis.car);

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
          <span>Error al cargar los datos del diagnóstico preliminar</span>
        </div>
        <Button variant="outline" onClick={() => navigate(`/cars/${params.carId}`)}>
          Volver atrás
        </Button>
      </div>
    );
  }

  const onGenerateReport = () => {
    setIsModalOpen(true);
  };

  const handleConfirmFault = (selectedFault: string, reasonId?: string) => {
    createFinalReportMutation({
      observations,
      obdCodes,
      confirmedFailure: {
        source: reasonId ? 'suggested' : 'custom',
        value: selectedFault,
        reasonId,
      },
    });
    setIsModalOpen(false);
  };

  const onBack = () => {
    if (backQueryParam === 'true') {
      navigate(-1);
    } else {
      navigate(`/cars/${params.carId}`);
    }
  };

  const onGenerateMorePossibleReasons = async () => {
    setIsLoadingMorePossibleReasons(true);
    try {
      const response = await getMorePossibleReasons(undefined, undefined, {
        diagnosisId: params.diagnosisId as string,
      });

      if (response.status === 200 && response.data) {
        queryClient.setQueryData(
          ['getDiagnosisById', params.diagnosisId],
          (oldData: { data: Diagnosis } | undefined) => {
            if (oldData) {
              return {
                ...oldData,
                data: {
                  ...oldData.data,
                  preliminary: {
                    ...oldData.data.preliminary,
                    possibleReasons: response.data.preliminary.possibleReasons,
                    moreReasonsRequestsQuantity:
                      response.data.preliminary.moreReasonsRequestsQuantity ??
                      oldData.data.preliminary.moreReasonsRequestsQuantity,
                  },
                },
              };
            }
            return oldData;
          },
        );
      } else {
        enqueueSnackbar('Error al generar más posibles averías. Por favor, inténtalo de nuevo.', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Error en onGenerateMorePossibleReasons:', error);
      enqueueSnackbar('Ocurrió un error inesperado al generar más averías.', {
        variant: 'error',
      });
    }
    setIsLoadingMorePossibleReasons(false);
  };

  return (
    <div className="bg-background min-h-screen pb-32 sm:pb-0">
      <HeaderPage
        onBack={onBack}
        data={{
          title: 'Informe Preliminar IA',
          description: carDescription,
        }}
      />
      <DetailsContainer>
        <VehicleInformation car={diagnosis.car as Car} editMode={false} minimized />
        <DiagnosticContextSection
          symptoms={symptom}
          notes={diagnosis.notes}
          questions={diagnosis.questions}
          answers={diagnosis.processedAnswers ?? ''}
        />

        <div className="space-y-2 sm:space-y-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-blue-100 p-2">
              <BrainCircuitIcon className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <h2 className="text-md font-semibold sm:text-xl">Averías Detectadas por IA</h2>
          </div>

          <div className="space-y-2 sm:space-y-4">
            {!diagnosis?.preliminary ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : (
              diagnosis.preliminary.possibleReasons?.map((fault, index) => (
                <FaultCardCollapsible
                  key={index}
                  title={fault.title}
                  probability={fault.probability as ProbabilityLevel}
                  reasoning={fault.reasonDetails}
                  recommendations={fault.diagnosticRecommendations || []}
                  tools={fault.requiredTools || []}
                />
              ))
            )}
          </div>
        </div>

        <OBDCodeInput onChange={setObdCodes} disabled={isLoadingFinalReport} />

        <div className="space-y-1 sm:space-y-2">
          <p className="block text-sm font-medium sm:text-base">
            Observaciones Adicionales del Técnico{' '}
            <span className="text-muted font-normal">(Opcional)</span>
          </p>

          <VoiceTextInput
            value={observations}
            onChange={setObservations}
            className="min-h-[150px]"
            placeholder="Añade tus hallazgos, correcciones, resultados de pruebas o información adicional sobre el diagnóstico..."
            disabled={isLoadingFinalReport}
          />
        </div>
      </DetailsContainer>

      <div className="fixed right-0 bottom-0 left-0 flex flex-col-reverse gap-3 border-t border-gray-200 bg-white p-4 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="sm:hover:text-primary w-full sm:w-auto sm:border-none sm:bg-transparent sm:shadow-none sm:hover:bg-transparent"
          size="lg"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="ml-2 sm:block">Volver</span>
        </Button>

        <div className="flex w-full sm:w-auto sm:gap-3">
          {(!diagnosis.preliminary.moreReasonsRequestsQuantity ||
            diagnosis.preliminary.moreReasonsRequestsQuantity < 3) && (
            <Button
              onClick={onGenerateMorePossibleReasons}
              disabled={isLoadingMorePossibleReasons}
              className="w-full sm:w-auto"
              size="lg"
              variant="outline"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="ml-2">Generar más posibles averías</span>
            </Button>
          )}

          <Button
            onClick={onGenerateReport}
            disabled={isLoadingFinalReport}
            className="w-full sm:w-auto"
            size="lg"
          >
            <FileTextIcon className="h-4 w-4" />
            <span className="ml-2">Generar Informe Final</span>
          </Button>
        </div>
      </div>

      <LoadingModal isOpen={isLoadingFinalReport} message="Generando informe final" />
      <LoadingModal
        isOpen={isLoadingMorePossibleReasons}
        message="Generando más posibles averías"
      />
      <ConfirmFaultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmFault}
        possibleReasons={diagnosis.preliminary?.possibleReasons || []}
      />
    </div>
  );
};

export default PreliminaryDiagnosis;

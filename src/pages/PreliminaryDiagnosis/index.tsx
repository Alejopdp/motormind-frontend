import { useMutation, useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeftIcon, BrainCircuitIcon, FileTextIcon } from 'lucide-react';

import { Button } from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import { DiagnosticContextSection } from '@/components/molecules/DiagnosisContectSection';
import FaultCardCollapsible from '@/components/molecules/FaultCardCollapsible';
import HeaderPage from '@/components/molecules/HeaderPage/HeaderPage';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import { VoiceTextInput } from '@/components/VoiceTextInput';
import OBDCodeInput from '@/components/molecules/ObdCodeInput';
import { useApi } from '@/hooks/useApi';
import { useSymptom } from '@/hooks/useSymptom';
import { Car } from '@/types/Car';
import { Diagnosis } from '@/types/Diagnosis';
import { ProbabilityLevel } from '@/types/Probability';

const PreliminaryDiagnosis = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [observations, setObservations] = useState('');
  const [obdCodes, setObdCodes] = useState<string[]>([]);
  const { execute: getDiagnosisById } = useApi<Diagnosis>('get', '/cars/diagnosis/:diagnosisId');
  const { execute: createFinalReportRequest } = useApi<Diagnosis>(
    'post',
    '/cars/:carId/diagnosis/:diagnosisId/final',
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
    }: {
      observations: string;
      obdCodes: string[];
    }) => {
      const response = await createFinalReportRequest(
        { technicalNotes: observations, obdCodes },
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
    createFinalReportMutation({ observations, obdCodes });
  };

  return (
    <div className="bg-background min-h-screen">
      <HeaderPage
        onBack={() => navigate(-1)}
        data={{
          title: 'Informe Preliminar IA',
          description: `Matricula: ${diagnosis.car?.plate || diagnosis.car?.vinCode}`,
        }}
      />
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6">
        <VehicleInformation car={diagnosis.car as Car} editMode={false} minimized />
        <DiagnosticContextSection
          symptoms={symptom}
          notes={diagnosis.notes}
          questions={diagnosis.questions}
          answers={diagnosis.processedAnswers ?? ''}
        />

        {/* AI Detected Faults */}
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

        {/* OBD Codes Input */}
        <OBDCodeInput onChange={setObdCodes} />

        <div className="mb-20 space-y-1 sm:space-y-2">
          <p className="block text-sm font-medium sm:text-base">
            Observaciones Adicionales del Técnico
          </p>

          <VoiceTextInput
            value={observations}
            onChange={setObservations}
            className="min-h-[150px]"
            placeholder="Añade tus hallazgos, correcciones, resultados de pruebas o información adicional sobre el diagnóstico..."
            disabled={isLoadingFinalReport}
          />
        </div>
      </div>

      <div className="fixed right-0 bottom-0 left-0 flex justify-between border-t border-gray-200 bg-white p-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="hidden sm:block">Volver</span>
        </Button>

        <div className="flex gap-3">
          <Button
            onClick={onGenerateReport}
            disabled={isLoadingFinalReport || observations.length === 0}
          >
            <FileTextIcon className="h-4 w-4" />
            <span className="sm:hidden">{isLoadingFinalReport ? 'Generando...' : 'Generar'}</span>
            <span className="hidden sm:inline">
              {isLoadingFinalReport ? 'Generando...' : 'Generar Informe Final'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreliminaryDiagnosis;

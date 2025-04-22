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
import { DiagnosticContextSection } from '@/components/molecules/DiagnosisContectSection';
import { ArrowLeftIcon, BrainCircuitIcon, FileTextIcon, SaveIcon } from 'lucide-react';
import FaultCardCollapsible from '@/components/molecules/FaultCardCollapsible';
import { Textarea } from '@/components/atoms/Textarea';
import { ProbabilityLevel } from '@/types/Probability';

const PreliminaryDiagnosis = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [observations, setObservations] = useState('');
  const { execute: getDiagnosisById } = useApi<Diagnosis>('get', '/cars/diagnosis/:diagnosisId');
  const { execute: createFinalReportRequest } = useApi<Diagnosis>(
    'post',
    '/cars/:carId/diagnosis/:diagnosisId/final',
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
      return { data: response.data };
    },
    enabled: !!params.diagnosisId,
    staleTime: 60000, // 1 minute
  });

  const { mutate: createFinalReportMutation, isPending: isLoadingFinalReport } = useMutation({
    mutationFn: async ({ observations }: { observations: string }) => {
      const response = await createFinalReportRequest({ technicalNotes: observations }, undefined, {
        carId: params.carId as string,
        diagnosisId: params.diagnosisId as string,
      });
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
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
        Error: {error?.message || 'Error al cargar los datos del diagnóstico preliminar'}
      </div>
    );
  }

  const backNavigation = () => navigate(`/cars/${params.carId}`);

  const onGenerateReport = () => {
    createFinalReportMutation({ observations });
  };

  const saveDraft = () => {
    enqueueSnackbar('Diagnóstico guardado como borrador', { variant: 'success' });
    backNavigation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservations(e.target.value);
  };

  return (
    <div className="bg-background min-h-screen">
      <HeaderPage
        onBack={backNavigation}
        data={{
          title: 'Informe Preliminar IA',
          description: `Matricula: ${diagnosis.car?.plate || diagnosis.car?.vinCode}`,
        }}
      />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
        <VehicleInformation car={diagnosis.car as Car} editMode={false} minimized />
        <DiagnosticContextSection symptoms={diagnosis.fault} notes={diagnosis.notes} />

        {/* AI Detected Faults */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-blue-100 p-2">
              <BrainCircuitIcon className="text-primary h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Averías Detectadas por IA</h2>
          </div>

          <div className="space-y-4">
            {diagnosis.preliminary.possibleReasons?.map((fault, index) => (
              <FaultCardCollapsible
                key={index}
                title={fault.title}
                probability={fault.probability as ProbabilityLevel}
                reasoning={fault.reasonDetails}
                recommendations={fault.diagnosticRecommendations || []}
                tools={fault.requiredTools || []}
              />
            ))}
          </div>
        </div>

        <div className="mb-20 space-y-2">
          <p className="block text-base font-medium">Observaciones Adicionales del Técnico</p>

          <Textarea
            value={observations}
            onChange={handleChange}
            className="min-h-[150px] resize-y"
            placeholder="Añade tus hallazgos, correcciones, resultados de pruebas o información adicional sobre el diagnóstico..."
            disabled={isLoadingFinalReport}
          />
        </div>
      </div>

      <div className="fixed right-0 bottom-0 left-0 flex justify-between border-t border-gray-200 bg-white p-4">
        <Button variant="ghost" onClick={backNavigation}>
          <ArrowLeftIcon className="h-4 w-4" />
          Volver
        </Button>

        <div className="flex gap-3">
          <Button variant="outline" onClick={saveDraft}>
            <SaveIcon className="h-4 w-4" />
            Guardar Borrador
          </Button>

          <Button
            onClick={onGenerateReport}
            disabled={isLoadingFinalReport || observations.length === 0}
          >
            <FileTextIcon className="h-4 w-4" />
            {isLoadingFinalReport ? 'Generando...' : 'Generar Informe Final'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreliminaryDiagnosis;

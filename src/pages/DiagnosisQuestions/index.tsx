import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { AlertCircle } from 'lucide-react';

import { Car } from '@/types/Car';
import { Diagnosis } from '@/types/Diagnosis';
import { useApi } from '@/hooks/useApi';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import { TechnicanObservationsInputForm } from '@/components/molecules/TechnicanObservationsInputForm';
import { QuestionsList } from '@/components/atoms/QuestionsList';
import Spinner from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';
import HeaderPage from '@/components/molecules/HeaderPage/HeaderPage';

const DiagnosisQuestions = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { execute: getCarById } = useApi<Car>('get', '/cars/:carId');
  const { execute: getDiagnosisById } = useApi<Diagnosis>('get', '/cars/diagnosis/:diagnosisId');
  const { execute: generateQuestions } = useApi<Diagnosis>('post', '/cars/:carId/questions');
  const { execute: createPreliminaryDiagnosisRequest } = useApi<Diagnosis>(
    'post',
    '/cars/:carId/diagnosis/:diagnosisId/preliminary',
  );

  const {
    data: { data: car = {} as Car } = { data: {} as Car },
    isLoading: isLoadingCar,
    isError: isErrorCar,
  } = useQuery<{ data: Car }>({
    queryKey: ['getCarById', params.carId],
    queryFn: async () => {
      const response = await getCarById(undefined, undefined, {
        carId: params.carId as string,
      });
      return { data: response.data };
    },
    enabled: !!params.carId,
    staleTime: 60000, // 1 minute
    retry: 0,
  });

  const {
    data: { data: diagnosisData = {} as Diagnosis } = { data: {} as Diagnosis },
    isLoading: isLoadingDiagnosis,
    isError: isErrorDiagnosis,
  } = useQuery<{ data: Diagnosis }>({
    queryKey: ['getDiagnosisById', params.diagnosisId],
    queryFn: async () => {
      const response = await getDiagnosisById(undefined, undefined, {
        diagnosisId: params.diagnosisId as string,
      });
      return { data: response.data };
    },
    enabled: !!params.diagnosisId,
    staleTime: 60000,
    retry: 0,
  });

  const { mutate: generateQuestionsMutation, isPending: isLoadingQuestions } = useMutation({
    mutationFn: async () => {
      const response = await generateQuestions(
        {
          fault: diagnosisData.fault,
          notes: diagnosisData.notes,
          diagnosisId: params.diagnosisId as string,
        },
        undefined,
        { carId: params.carId as string },
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['getDiagnosisById', params.diagnosisId], { data });
    },
    onError: () => {
      enqueueSnackbar('Error al generar las preguntas. Por favor, inténtalo de nuevo.', {
        variant: 'error',
      });
    },
  });

  const { mutate: createPreliminaryDiagnosisMutation, isPending: isLoadingPreliminary } =
    useMutation({
      mutationFn: async ({ notes }: { notes: string }) => {
        const response = await createPreliminaryDiagnosisRequest(
          {
            notes,
          },
          undefined,
          { carId: params.carId as string, diagnosisId: params.diagnosisId as string },
        );
        return response.data;
      },
      onSuccess: (data) => {
        navigate(`/cars/${params.carId}/diagnosis/${data._id}`);
      },
      onError: () => {
        enqueueSnackbar('Error al generar el diagnóstico. Por favor, inténtalo de nuevo.', {
          variant: 'error',
        });
      },
    });

  if (isLoadingCar || isLoadingDiagnosis)
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
        <Spinner />
      </div>
    );

  if (isErrorCar || isErrorDiagnosis || !car || !diagnosisData) {
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
        <div className="text-destructive flex items-center gap-2 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5" />
          <span>Error al cargar los datos</span>
        </div>
        <Button variant="outline" onClick={() => navigate(`/cars/${params.carId}`)}>
          Volver atrás
        </Button>
      </div>
    );
  }

  const createDiagnosis = (details: string) => {
    createPreliminaryDiagnosisMutation({ notes: details });
  };

  return (
    <div className="bg-background min-h-screen">
      <HeaderPage
        onBack={() => navigate(`/cars/${params.carId}`)}
        data={{
          title: 'Nuevo diagnóstico - Preguntas guiadas',
          description: `Matricula: ${car.plate || car.vinCode}`,
        }}
      />
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-3 sm:space-y-6 sm:px-6 sm:py-6">
        <VehicleInformation car={car} editMode={false} minimized={true} />
        <div className="space-y-6">
          <QuestionsList
            questions={diagnosisData?.questions ?? []}
            isLoading={isLoadingQuestions}
          />

          <TechnicanObservationsInputForm
            onSubmit={createDiagnosis}
            onGenerateMoreQuestions={() => generateQuestionsMutation()}
            isLoadingMoreQuestions={isLoadingQuestions}
            isLoadingDiagnosis={isLoadingPreliminary}
            disableMoreQuestions={isLoadingQuestions || (diagnosisData?.questions.length ?? 0) > 7}
          />
        </div>
      </div>
    </div>
  );
};

export default DiagnosisQuestions;

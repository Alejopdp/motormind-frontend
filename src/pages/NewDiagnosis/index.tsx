import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { AlertCircle } from 'lucide-react';

import { Car } from '@/types/Car';
import { Diagnosis } from '@/types/Diagnosis';
import { useApi } from '@/hooks/useApi';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import SymptomInputForm from '@/components/molecules/SymptomInputForm';
import Spinner from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';
import HeaderPage from '@/components/molecules/HeaderPage';

const NewDiagnosis = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { execute: getCarById } = useApi<Car>('get', '/cars/:carId');
  const { execute: generateQuestions } = useApi<Diagnosis>('post', '/cars/:carId/questions');

  const [symptoms, setSymptoms] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['getCarById'] });
    };
  }, [params.carId, queryClient]);

  const {
    data: { data: car = {} as Car } = { data: {} as Car },
    isLoading: isLoadingCar,
    isError,
  } = useQuery<{ data: Car }>({
    queryKey: ['getCarById', params.carId],
    queryFn: async () => {
      const response = await getCarById(undefined, undefined, {
        carId: params.carId as string,
      });
      return { data: response.data };
    },
    staleTime: 60000, // 1 minute
    retry: 0,
  });

  const { mutate: generateQuestionsMutation, isPending: isLoadingQuestions } = useMutation({
    mutationFn: async ({ symptoms, notes }: { symptoms: string; notes: string }) => {
      const response = await generateQuestions(
        {
          fault: symptoms,
          notes,
        },
        undefined,
        { carId: params.carId as string },
      );
      return response.data;
    },
    onSuccess: (data) => {
      navigate(`/cars/${params.carId}/diagnosis/${data._id}/questions`);
    },
    onError: () => {
      enqueueSnackbar('Error al generar las preguntas. Por favor, inténtalo de nuevo.', {
        variant: 'error',
      });
    },
  });

  if (isLoadingCar)
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
        <Spinner />
      </div>
    );

  if (isError || !car) {
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
        <div className="text-destructive flex items-center gap-2 rounded-lg bg-red-50 p-4">
          <AlertCircle className="h-5 w-5" />
          <span>Error al cargar los datos del vehículo</span>
        </div>
        <Button variant="outline" onClick={() => navigate('/cars')}>
          Volver atrás
        </Button>
      </div>
    );
  }

  const generateDiagnosisQuestions = ({ symptoms, notes }: { symptoms: string; notes: string }) => {
    setSymptoms(symptoms);
    setNotes(notes);
    generateQuestionsMutation({ symptoms, notes });
  };

  return (
    <div className="bg-background min-h-screen">
      <HeaderPage
        onBack={() => navigate(`/cars/${params.carId}`)}
        data={{
          title: 'Nuevo diagnóstico',
          description: car.plate ? `Matricula: ${car.plate}` : `Vin: ${car.vinCode}`,
        }}
      />
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-3 sm:space-y-6 sm:px-6 sm:py-6">
        <VehicleInformation car={car} editMode={false} minimized={true} />
        <SymptomInputForm
          initialSymptoms={symptoms}
          initialNotes={notes}
          onSubmit={generateDiagnosisQuestions}
          isLoading={isLoadingQuestions}
        />
      </div>
    </div>
  );
};

export default NewDiagnosis;

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { AlertCircle, CircleCheckIcon } from 'lucide-react';

import { Car } from '@/types/Car';
import { Diagnosis } from '@/types/Diagnosis';
import { useApi } from '@/hooks/useApi';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import SymptomInputForm from '@/components/molecules/SymptomInputForm';
import Spinner from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';
import HeaderPage from '@/components/molecules/HeaderPage';
import { Appointment } from '@/types/Appointment';
import AppointmentInformation from '@/components/molecules/AppointmentInformation';
import { STALE_TIME } from '@/constants';

const AppointmentDiagnosis = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { execute: getCarById } = useApi<{ car: Car; appointment: Appointment }>(
    'get',
    '/appointments/:appointmentId/cars/:carId',
  );
  const { execute: generateQuestions } = useApi<Diagnosis>(
    'post',
    '/appointments/:appointmentId/cars/:carId/questions',
  );

  const [symptoms, setSymptoms] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [appointmentStatus, setAppointmentStatus] = useState<string>('');

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['getCarById'] });
    };
  }, [params.carId, queryClient]);

  const {
    data = { car: {} as Car, appointment: {} as Appointment },
    isLoading: isLoadingCar,
    isError,
  } = useQuery<{ car: Car; appointment: Appointment }>({
    queryKey: ['getCarById', params.carId],
    queryFn: async () => {
      const response = await getCarById(undefined, undefined, {
        carId: params.carId as string,
        appointmentId: params.appointmentId as string,
      });

      setAppointmentStatus(response.data?.appointment?.status);
      return response.data;
    },
    staleTime: STALE_TIME.ONE_MINUTE,
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
        { carId: params.carId as string, appointmentId: params.appointmentId as string },
      );

      setAppointmentStatus(response.data?.appointmentStatus);
      return response.data;
    },
    onSuccess: () => {
      enqueueSnackbar('Diagnóstico generado correctamente.', {
        variant: 'success',
      });
    },
    onError: () => {
      enqueueSnackbar('Error al generar las preguntas. Por favor, inténtalo de nuevo.', {
        variant: 'error',
      });
    },
  });

  const generatePreDiagnosis = ({ symptoms, notes }: { symptoms: string; notes: string }) => {
    setSymptoms(symptoms);
    setNotes(notes);
    generateQuestionsMutation({ symptoms, notes });
  };

  if (isLoadingCar)
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
        <Spinner />
      </div>
    );

  if (isError || !data) {
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

  if (appointmentStatus === 'diagnosis-generated') {
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2 rounded-md bg-white p-6 text-center shadow-sm">
          <CircleCheckIcon className="h-15 w-15 text-green-600" />
          <span className="text-primary text-lg">Diagnóstico generado!</span>
          <span className="text-muted text-sm">
            Gracias por tu tiempo, el diagnóstico se ha generado correctamente.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <HeaderPage
        data={{
          title: 'Nuevo diagnóstico',
          description:
            'Ingrese los síntomas del vehículo para crear diagnóstico de forma automática.',
        }}
      />
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-3 sm:space-y-6 sm:px-6 sm:py-6">
        <AppointmentInformation appointment={data.appointment} />
        <VehicleInformation car={data.car} editMode={false} minimized={true} />

        <SymptomInputForm
          initialSymptoms={symptoms}
          initialNotes={notes}
          onSubmit={generatePreDiagnosis}
          isLoading={isLoadingQuestions}
          context="appointment"
        />
      </div>
    </div>
  );
};

export default AppointmentDiagnosis;

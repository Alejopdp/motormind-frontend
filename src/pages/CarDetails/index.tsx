import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { Car } from '@/types/Car';
import { useApi } from '@/hooks/useApi';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import VehicleFaultsHistory from '@/components/molecules/VehicleFaultsHistory/VehicleFaultsHistory';
import Spinner from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';
import HeaderPage from '@/components/molecules/HeaderPage/HeaderPage';
import SymptomInputForm from '@/components/molecules/SymptomInputForm';
import { TechnicanObservationsInputForm } from '@/components/molecules/TechnicanObservationsInputForm';
import { QuestionsList } from '@/components/atoms/QuestionsList';

const CarDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { execute: getCarById } = useApi<Car>('get', '/cars/:carId');
  const { execute: generateQuestions } = useApi<string[]>('post', '/cars/:carId/questions');

  const [step, setStep] = useState('carDetails');
  const [symptoms, setSymptoms] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    return () => {
      queryClient.removeQueries({ queryKey: ['getCarById'] });
    };
  }, [params.carId, queryClient]);

  const {
    data: { data: car = {} as Car } = { data: {} as Car },
    isLoading: isLoadingCar,
    isError,
    error,
  } = useQuery<{ data: Car }>({
    queryKey: ['getCarById', params.carId],
    queryFn: async () => {
      const response = await getCarById(undefined, undefined, {
        carId: params.carId as string,
      });
      return { data: response.data };
    },
    enabled: step === 'carDetails',
    staleTime: 60000, // 1 minute
  });

  const {
    mutate: generateQuestionsMutation,
    isPending: isLoadingQuestions,
    isError: isQuestionsError,
    error: questionsError,
  } = useMutation({
    mutationFn: async ({ symptoms, notes }: { symptoms: string; notes: string }) => {
      const response = await generateQuestions(
        {
          fault: symptoms,
          notes,
          questionsToAvoid: questions,
        },
        undefined,
        { carId: params.carId as string },
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (step === 'diagnosisQuestions') {
        setQuestions((prevQuestions) => [...prevQuestions, ...data]);
      } else {
        setQuestions(data);
        setStep('diagnosisQuestions');
      }
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
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
        Error: {error?.message || 'Error al cargar los datos del vehículo'}
      </div>
    );
  }

  const backNavigation = () => {
    if (step === 'carDetails') return navigate('/cars');
    if (step === 'newDiagnosis') setStep('carDetails');
    if (step === 'diagnosisQuestions') setStep('newDiagnosis');
  };

  const generateDiagnosisQuestions = ({ symptoms, notes }: { symptoms: string; notes: string }) => {
    setSymptoms(symptoms);
    setNotes(notes);
    generateQuestionsMutation({ symptoms, notes });
  };

  return (
    <div className="bg-background min-h-screen">
      <HeaderPage
        onBack={backNavigation}
        data={{
          title:
            step === 'carDetails'
              ? 'Detalles del Vehículo'
              : step === 'diagnosisQuestions'
                ? 'Nuevo diagnóstico - Preguntas guiadas'
                : 'Nuevo diagnóstico',
          description: `Matricula: ${car.plate || car.vinCode}`,
        }}
        headerActions={
          step === 'carDetails' && (
            <Button onClick={() => setStep('newDiagnosis')}>+ Crear nuevo diagnóstico</Button>
          )
        }
      />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
        <VehicleInformation
          car={car}
          editMode={step === 'carDetails'}
          minimized={step === 'diagnosisQuestions'}
        />
        {/* Faults History */}
        {step === 'carDetails' && <VehicleFaultsHistory carId={params.carId as string} />}

        {/* Symptom and notes input form */}
        {step === 'newDiagnosis' && (
          <SymptomInputForm
            initialSymptoms={symptoms}
            initialNotes={notes}
            onSubmit={generateDiagnosisQuestions}
            isLoading={isLoadingQuestions}
          />
        )}

        {step === 'diagnosisQuestions' && (
          <div className="space-y-6">
            <QuestionsList
              questions={questions}
              isLoading={isLoadingQuestions}
              error={isQuestionsError ? questionsError : null}
              onRetry={() => generateQuestionsMutation({ symptoms, notes })}
            />

            <TechnicanObservationsInputForm
              onSubmit={() => {}}
              onGenerateMoreQuestions={() => generateQuestionsMutation({ symptoms, notes })}
              isLoadingMoreQuestions={isLoadingQuestions}
              disableMoreQuestions={isLoadingQuestions || questions.length > 7}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDetails;

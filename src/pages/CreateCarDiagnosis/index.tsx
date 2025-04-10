import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Spinner from '@/components/atoms/Spinner';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import { useCar } from '@/context/Car.context';
import { useApi } from '@/hooks/useApi';
import { Diagnosis } from '@/types/Diagnosis';

const CreateCarDiagnosis = () => {
  const { car } = useCar();
  const [searchParams, setSearchParams] = useSearchParams();
  const [fault, setFault] = useState('');
  const [notes, setNotes] = useState('');
  const [isCreatingQuestions, setIsCreatingQuestions] = useState(false);
  const [isCreatingMoreQuestions, setIsCreatingMoreQuestions] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [secondStepNotes, setSecondStepNotes] = useState('');
  const [isCreatingDiagnosis, setIsCreatingDiagnosis] = useState(false);
  const { execute: generateQuestions } = useApi<string[]>('post', '/car/:carId/questions');
  const { execute: createDiagnosisRequest } = useApi<Diagnosis>('post', '/car/:carId/diagnosis');
  const step = searchParams.get('step');
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchParams.get('step')) {
      searchParams.set('step', '1');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const createQuestions = async () => {
    if (isCreatingQuestions) return;
    setIsCreatingQuestions(true);

    const carId = car?._id;

    if (!carId) return;

    const res = await generateQuestions(
      {
        fault,
        notes,
        questionsToAvoid: questions,
      },
      undefined,
      { carId },
    );

    if (res.status === 200) {
      setQuestions(res.data);
      searchParams.set('step', '2');
      setSearchParams(searchParams);
    }

    setIsCreatingQuestions(false);
  };

  const createMoreQuestions = async () => {
    if (isCreatingMoreQuestions || isCreatingDiagnosis) return;
    setIsCreatingMoreQuestions(true);

    const carId = car?._id;

    if (!carId) return;

    const res = await generateQuestions(
      {
        fault,
        notes,
        questionsToAvoid: questions,
      },
      undefined,
      { carId },
    );

    if (res.status === 200) {
      setQuestions(res.data);
    }
    setIsCreatingMoreQuestions(false);
  };

  const createDiagnosis = async () => {
    if (isCreatingDiagnosis || isCreatingMoreQuestions) return;
    setIsCreatingDiagnosis(true);

    const carId = car?._id;

    if (!carId) return;

    const res = await createDiagnosisRequest(
      {
        fault,
        notes: secondStepNotes,
      },
      undefined,
      { carId },
    );

    if (res.status === 200) {
      navigate(`/car/${carId}/diagnosis/${res.data._id}`);
    }

    setIsCreatingDiagnosis(false);
  };

  if (!car) return null;

  const titleStepMap = {
    '1': 'Diagnóstico del vehículo',
    '2': 'Cuestionario de diagnóstico',
  };

  const firstStep = (
    <form
      onSubmit={(ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        createQuestions();
      }}
    >
      <div className="mb-4">
        <div className="w-full">
          <div className="mb-2">
            <label htmlFor="faultDescription" className="mb-1 block font-medium">
              ¿Cuál es tu avería?
            </label>
            <textarea
              id="faultDescription"
              value={fault}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFault(e.target.value)}
              rows={5}
              placeholder="Describe detalladamente la avería que presenta el vehículo"
              className="w-full rounded border p-2"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full">
          <div className="mb-2">
            <label htmlFor="additionalNotes" className="mb-1 block font-medium">
              Otras notas
            </label>
            <textarea
              id="additionalNotes"
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              rows={5}
              placeholder="Agrega cualquier otra información relevante"
              className="w-full rounded border p-2"
            />
          </div>
        </div>
      </div>

      <div className="grid">
        <button
          className="col-span-full ml-auto rounded bg-blue-500 px-4 py-3 text-white hover:bg-blue-600 disabled:bg-blue-300 md:col-span-4"
          type="submit"
          disabled={!fault}
        >
          {isCreatingQuestions ? <Spinner /> : 'Generar preguntas'}
        </button>
      </div>
    </form>
  );

  const secondStep = (
    <>
      {questions.map((question, index) => (
        <p key={question}>
          {index + 1}. {question}
        </p>
      ))}

      <form>
        <div className="mb-4">
          <div className="w-full">
            <div className="mb-2">
              <label htmlFor="secondStepNotes" className="mb-1 block font-medium">
                Notas relevantes
              </label>
              <textarea
                id="secondStepNotes"
                value={secondStepNotes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setSecondStepNotes(e.target.value)
                }
                rows={5}
                placeholder="Ingrese notas adicionales relevantes sobre el diagnóstico"
                className="w-full rounded border p-2"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 text-center md:flex-row md:justify-end md:space-y-0 md:space-x-4">
          <div className="w-full lg:w-1/3">
            <button
              className="w-full rounded-lg bg-gray-200 py-3 hover:bg-gray-300"
              type="button"
              onClick={createMoreQuestions}
            >
              {isCreatingMoreQuestions ? <Spinner /> : '+ Generar más preguntas'}
            </button>
          </div>

          <div className="w-full lg:w-1/3">
            <button
              className="w-full rounded-lg bg-blue-500 py-3 text-white hover:bg-blue-600"
              type="button"
              onClick={isCreatingDiagnosis ? () => '' : createDiagnosis}
            >
              {isCreatingDiagnosis ? <Spinner /> : 'Ver / Crear informe'}
            </button>
          </div>
        </div>
      </form>
    </>
  );

  return (
    <div className="container mx-auto">
      <VehicleInformation car={car} />
      <h3 className="mt-4 mb-4">{titleStepMap[(step ?? '1') as '1' | '2']}</h3>
      {step === '1' && firstStep}
      {step === '2' && secondStep}
    </div>
  );
};

export default CreateCarDiagnosis;

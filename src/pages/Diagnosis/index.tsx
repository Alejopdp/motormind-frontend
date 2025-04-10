import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';

import Spinner from '@/components/atoms/Spinner';
import { RateDiagnosis } from '@/components/molecules/RateDiagnosis/RateDiagnosis';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import { useCar } from '@/context/Car.context';
import { useApi } from '@/hooks/useApi';
import { Diagnosis } from '@/types/Diagnosis';

const DiagnosisPage = () => {
  const params = useParams();
  const [isLoadingDiagnosis, setIsLoadingDiagnosis] = useState(true);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | undefined>(undefined);
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [isCreatingFinalDiagnosis, setIsCreatingFinalDiagnosis] = useState(false);
  const [isUpdatingDiagnosis, setIsUpdatingDiagnosis] = useState(false);
  const { car, diagnoses, setDiagnoses } = useCar();
  const [finalNotes, setFinalNotes] = useState(diagnosis?.finalNotes ?? '');
  const { execute: getDiagnosisById } = useApi<Diagnosis>('get', '/car/diagnosis/:diagnosisId');
  const { execute: createDiagnosis } = useApi<Diagnosis>(
    'post',
    '/car/:carId/diagnosis/:diagnosisId/final',
  );
  const { execute: updateDiagnosisRequest } = useApi<Diagnosis>(
    'put',
    '/car/:carId/diagnosis/:diagnosisId',
  );

  useEffect(() => {
    const diagnosisId = params.diagnosisId;
    if (!diagnosisId) return;

    const getDiagnosis = async () => {
      const res = await getDiagnosisById(undefined, undefined, {
        diagnosisId,
      });
      if (res.status === 200) {
        setDiagnosis(res.data);
        setIsLoadingDiagnosis(false);
      }
    };

    getDiagnosis();
  }, [params.diagnosisId, getDiagnosisById]);

  useEffect(() => {
    setFinalNotes(diagnosis?.finalNotes ?? finalNotes ?? '');
  }, [diagnosis, finalNotes]);

  const createFinalDiagnosis = async () => {
    setIsCreatingFinalDiagnosis(true);
    const carId = car?._id ?? '';
    const diagnosisId = diagnosis?._id ?? '';

    const res = await createDiagnosis({ technicalNotes }, undefined, {
      carId,
      diagnosisId,
    });

    if (res.status === 200) {
      setDiagnosis(res.data);
      setDiagnoses([...diagnoses, res.data]);
    }
    setIsCreatingFinalDiagnosis(false);
  };

  const updateDiagnosis = async () => {
    if (isUpdatingDiagnosis) return;
    const carId = car?._id ?? '';
    const diagnosisId = diagnosis?._id ?? '';

    setIsUpdatingDiagnosis(true);

    const res = await updateDiagnosisRequest({ finalNotes }, undefined, {
      carId,
      diagnosisId,
    });

    if (res.status === 200) {
      setDiagnosis(res.data);
      setDiagnoses(diagnoses.map((d) => (d._id === diagnosis?._id ? res.data : d)));
    }
    setIsUpdatingDiagnosis(false);
  };

  const rateDiagnosis = async (wasUseful: boolean) => {
    const carId = car?._id ?? '';
    const diagnosisId = diagnosis?._id ?? '';

    const res = await updateDiagnosisRequest({ wasUseful }, undefined, {
      carId,
      diagnosisId,
    });

    if (res.status === 200) {
      setDiagnosis(res.data);
      enqueueSnackbar('Gracias por responder!', {
        variant: 'success',
      });
    } else {
      enqueueSnackbar('Ocurrió un error al calificar el diagnóstico', {
        variant: 'error',
      });
    }
  };

  const copyDiagnosis = () => {
    navigator.clipboard.writeText(diagnosis?.diagnosis ?? '');
    enqueueSnackbar('Diagnóstico copiado al portapapeles', {
      variant: 'success',
    });
  };

  if (!car) return null;

  return (
    <div className="container mx-auto pb-12">
      {diagnosis && diagnosis.wasUseful === undefined && (
        <RateDiagnosis rateDiagnosis={rateDiagnosis} />
      )}

      <VehicleInformation car={car} />

      {isLoadingDiagnosis || !diagnosis ? (
        <div className="mx-auto mt-4 flex justify-center">
          <Spinner />
        </div>
      ) : !diagnosis.diagnosis ? (
        <>
          <h2 className="my-4">Informe de diagnóstico preliminar</h2>
          <h5 className="mb-3">Posibles Causas del Problema</h5>
          {diagnosis.preliminary.possibleReasons.map((reason, index) => (
            <div key={index}>
              <h6>
                <strong>
                  {index + 1}. {reason.title}
                </strong>
              </h6>
              <ul>
                <li>
                  <strong>Probabilidad:</strong> {reason.probability}
                </li>
                <li>
                  <strong>Razonamiento:</strong> {reason.reasonDetails}
                </li>
              </ul>
            </div>
          ))}
          <h5 className="mb-3">Pasos para Diagnosticar y Reparar</h5>
          {diagnosis.preliminary.fixSteps.map((step, index) => (
            <div key={index}>
              <h6>
                <strong>
                  {index + 1}. {step.title}
                </strong>
              </h6>
              <ul>
                <li>
                  <strong>Procedimiento:</strong> {step.procedure}
                </li>
                <li>
                  <strong>Herramientas:</strong> {step.tools}
                </li>
              </ul>
            </div>
          ))}
          <form>
            <div className="mb-4">
              <label className="mb-1 block font-medium">Información del técnico</label>
              <textarea
                value={technicalNotes}
                onChange={(e) => setTechnicalNotes(e.target.value)}
                rows={5}
                placeholder="Ingrese notas adicionales y relevantes sobre el diagnóstico"
                className="w-full rounded border p-2"
              />
            </div>
            <div className="flex justify-end text-center">
              <div className="w-full lg:w-1/3">
                <button
                  className="w-full rounded-lg bg-blue-500 py-3 text-white hover:bg-blue-600"
                  type="button"
                  onClick={createFinalDiagnosis}
                >
                  {isCreatingFinalDiagnosis ? <Spinner /> : 'Crear diagnóstico final'}
                </button>
              </div>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="my-4">Informe de Diagnóstico</h2>
          <div className="prose lg:prose-lg">
            <ReactMarkdown>{diagnosis.diagnosis}</ReactMarkdown>
          </div>
          <form>
            <div className="mb-4">
              <label className="mb-1 block font-medium">Información relevante</label>
              <textarea
                value={finalNotes}
                onChange={(e) => setFinalNotes(e.target.value)}
                rows={5}
                placeholder="Incluir más información"
                className="w-full rounded border p-2"
              />
            </div>
            <div className="flex flex-col justify-end space-y-3 text-center lg:flex-row lg:space-y-0 lg:space-x-3">
              <div className="w-full lg:w-1/3">
                <button
                  className="w-full rounded-lg bg-gray-200 py-3 hover:bg-gray-300"
                  type="button"
                  onClick={copyDiagnosis}
                >
                  Copiar diagnóstico
                </button>
              </div>
              <div className="w-full lg:w-1/3">
                <button
                  className="w-full rounded-lg bg-blue-500 py-3 text-white hover:bg-blue-600"
                  type="button"
                  onClick={updateDiagnosis}
                >
                  {isUpdatingDiagnosis ? <Spinner /> : 'Actualizar diagnóstico'}
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default DiagnosisPage;

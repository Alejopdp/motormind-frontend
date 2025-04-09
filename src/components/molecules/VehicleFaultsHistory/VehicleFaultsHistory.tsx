import { useCar } from '@/context/Car.context';
import { useNavigate } from 'react-router-dom';
import Spinner from '@/components/atoms/Spinner';
import { Diagnosis } from '@/types/Diagnosis';
const VehicleFaultsHistory = () => {
  const { diagnoses, isLoadingDiagnoses } = useCar();
  const navigate = useNavigate();

  const navigateToDiagnosis = (diagnosis: Diagnosis) => {
    const url = `/car/${diagnosis.carId}/diagnosis/${diagnosis._id}`;

    navigate(url);
  };

  const formatToddmmyyyy = (date: Date) => {
    if (!date) return '';
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <h3 className="mb-4">Historial de averías</h3>

      {isLoadingDiagnoses ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col">
          {diagnoses.length === 0 && (
            <p className="mt-4 text-center">No hay ninguna avería registrada</p>
          )}
          {diagnoses
            .sort((a, b) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .map((diagnosis: Diagnosis) => (
              <div
                className="mb-2 flex w-full items-center rounded-lg border p-3"
                key={diagnosis._id}
              >
                <div className="flex flex-col">
                  <p className="mb-2 text-base font-medium">{diagnosis.fault}</p>
                  <p className="mb-0 text-gray-500">
                    Fecha: {formatToddmmyyyy(new Date(diagnosis.createdAt))}
                  </p>
                </div>
                <button
                  className="ml-auto flex-shrink-0 text-blue-500 hover:text-blue-700"
                  onClick={() => navigateToDiagnosis(diagnosis)}
                >
                  Ver detalles
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default VehicleFaultsHistory;

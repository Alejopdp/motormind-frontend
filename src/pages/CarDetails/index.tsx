import { useNavigate, useParams } from 'react-router-dom';

import { useCar } from '@/context/Car.context';
import VehicleInformation from '@/components/molecules/VehicleInformation/VehicleInformation';
import VehicleFaultsHistory from '@/components/molecules/VehicleFaultsHistory/VehicleFaultsHistory';
import Spinner from '@/components/atoms/Spinner';

const CarDetails = () => {
  const { car, isLoadingCar } = useCar();
  const params = useParams();
  const navigate = useNavigate();

  const redirectToCreateDiagnostic = () => {
    navigate(`/car/${params.carId}/create?step=1`);
  };
  if (!car || isLoadingCar)
    return (
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="mb-4 rounded-lg border bg-white p-4 shadow">
        <div className="flex justify-between">
          <h3 className="mb-2 text-xl font-medium">{car.plate ? car.plate : car.vinCode}</h3>
          <button
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={redirectToCreateDiagnostic}
          >
            + Crear nuevo diagnóstico
          </button>
        </div>
        <VehicleInformation car={car} />
      </div>

      <VehicleFaultsHistory />
    </>
  );
};

export default CarDetails;

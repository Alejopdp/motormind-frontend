import { useNavigate } from 'react-router-dom';
import { Car } from '@/types/Car';
import { useEffect, useState } from 'react';

interface VehicleListProps {
  cars: Car[];
}

const VehicleList = ({ cars }: VehicleListProps) => {
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth < 576);
  const [isMediumScreen, setIsMediumScreen] = useState<boolean>(
    window.innerWidth >= 576 && window.innerWidth < 768,
  );

  const redirectToCarDetails = (id: string) => {
    navigate(`/car/${id}`);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 576);
      setIsMediumScreen(window.innerWidth >= 576 && window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isMediumScreen || isSmallScreen ? (
        <div className="flex flex-col gap-3">
          {cars.map((car) => (
            <div key={car._id} className="w-full rounded border bg-white p-4 shadow">
              <h5 className="text-lg font-medium">
                {car.brand} {car.model}
              </h5>
              <h6 className="mb-2 text-sm text-gray-500">Año: {car.year}</h6>
              <p className="mb-4">Matrícula o VIN: {car.vinCode}</p>
              <button
                className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                onClick={() => redirectToCarDetails(car._id)}
              >
                Ver diagnósticos
              </button>
            </div>
          ))}
        </div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Matrícula o VIN</th>
              <th className="px-4 py-2 text-left">Marca</th>
              <th className="px-4 py-2 text-left">Modelo</th>
              <th className="px-4 py-2 text-left">Año</th>
              <th className="px-4 py-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id} className="border-b">
                <td className="px-4 py-2">{car.plate ? car.plate : car.vinCode}</td>
                <td className="px-4 py-2">{car.brand}</td>
                <td className="px-4 py-2">{car.model}</td>
                <td className="px-4 py-2">{car.year}</td>
                <td className="flex justify-end px-4 py-2">
                  <button
                    className="mr-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                    onClick={() => redirectToCarDetails(car._id)}
                  >
                    Ver diagnósticos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default VehicleList;

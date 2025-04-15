import { Button } from '@/components/atoms/Button';
import {
  CalendarIcon,
  CarIcon,
  FuelIcon,
  GaugeIcon,
  PencilIcon,
  FileSpreadsheet,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type VehicleInformationProps = {
  car: {
    _id: string;
    brand: string;
    model: string;
    year: number;
    vinCode: string;
    plate: string;
    data: {
      kilometers?: number;
    };
  };
};

const VehicleInformation: React.FC<VehicleInformationProps> = ({ car }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-4 rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h5 className="mb-2 text-lg font-medium">Información del vehículo</h5>
        <Button variant="ghost" onClick={() => navigate(`/cars/${car._id}/edit`)}>
          <PencilIcon className="text-muted !h-4 !w-4" />
        </Button>
      </div>

      <div className="container">
        <div className="grid grid-cols-2 gap-4 space-y-4">
          <div className="flex items-center gap-2">
            <CarIcon className="text-muted mr-2 !h-5 !w-5" />
            <div>
              <p className="mb-0 text-sm text-gray-500">Marca / Modelo</p>
              <p className="font-medium">{`${car.brand || ''} ${car.model || ''}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="text-muted mr-2 !h-5 !w-5" />
            <div>
              <p className="mb-0 text-sm text-gray-500">Matrícula</p>
              <p className="font-medium">{car.plate || car.vinCode}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 space-y-4">
          <div className="flex items-center gap-2">
            <GaugeIcon className="text-muted mr-2 !h-5 !w-5" />
            <div>
              <p className="mb-0 text-sm text-gray-500">Kilometraje</p>
              <p className="font-medium">
                {Number(car.data?.kilometers || 0).toLocaleString('es-ES')} km
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FuelIcon className="text-muted mr-2 !h-5 !w-5" />
            <div>
              <p className="mb-0 text-sm text-gray-500">Combustible</p>
              <p className="font-medium">{'-'}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-muted mr-2 !h-5 !w-5" />
            <div>
              <p className="mb-0 text-sm text-gray-500">Última revisión</p>
              <p className="font-medium">{'-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleInformation;

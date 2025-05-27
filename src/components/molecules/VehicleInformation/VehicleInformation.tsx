import { Button } from '@/components/atoms/Button';
import { EditVehicleModal } from '@/components/organisms/EditVehicleModal';
import {
  CalendarIcon,
  CarIcon,
  FuelIcon,
  GaugeIcon,
  PencilIcon,
  FileSpreadsheet,
} from 'lucide-react';
import { useState } from 'react';
import { Car } from '@/types/Car';
import { format } from 'date-fns';

type VehicleInformationProps = {
  car?: Car;
  editMode?: boolean;
  minimized?: boolean;
};

const VehicleInformation: React.FC<VehicleInformationProps> = ({
  car,
  editMode = true,
  minimized = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (minimized) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-100 p-2">
              <CarIcon className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <p className="text-muted text-xs sm:text-sm">Vehículo</p>
              <p className="text-sm font-medium sm:text-base">
                {car ? `${car.brand} ${car.model} (${car.year})` : '-'}
              </p>
            </div>
          </div>

          <div className="flex hidden items-center gap-3 md:flex">
            <div className="rounded-md bg-blue-100 p-2">
              <FileSpreadsheet className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <p className="text-muted text-xs sm:text-sm">{car?.plate ? 'Matrícula' : 'VIN'}</p>
              <p className="text-sm font-medium sm:text-base">
                {car ? car.plate || car.vinCode : '-'}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <div className="rounded-md bg-blue-100 p-2">
              <FuelIcon className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <p className="text-muted text-xs sm:text-sm">Combustible</p>
              <p className="text-sm font-medium sm:text-base">{car ? car.fuel || '-' : '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-100 p-2">
              <CalendarIcon className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <p className="text-muted text-xs sm:text-sm">Última Revisión</p>
              <p className="text-sm font-medium sm:text-base">
                {car && car.lastRevision ? format(new Date(car.lastRevision), 'dd/MM/yyyy') : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md sm:p-6">
      <div className="flex items-center justify-between">
        <h5 className="text-md mb-2 font-medium sm:text-lg">Información del vehículo</h5>
        {editMode && car && (
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            <PencilIcon className="text-muted !h-4 !w-4" />
          </Button>
        )}

        {car && <EditVehicleModal open={isEditing} onOpenChange={setIsEditing} car={car} />}
      </div>

      <div className="container space-y-2 sm:space-y-0">
        <div className="grids-cols-1 grid gap-2 space-y-1 sm:grid-cols-2 sm:gap-4 sm:space-y-4">
          <div className="flex items-center gap-2">
            <CarIcon className="text-muted mr-2 !h-5 !w-5" />
            <div>
              <p className="text-muted mb-0 text-xs sm:text-sm">Marca / Modelo</p>
              <p className="text-sm font-medium sm:text-base">
                {car ? `${car.brand || ''} ${car.model || ''}` : '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="text-muted mr-2 !h-5 !w-5" />
            <div>
              <p className="text-muted mb-0 text-xs sm:text-sm">Matrícula</p>
              <p className="text-sm font-medium sm:text-base">
                {car ? car.plate || car.vinCode : '-'}
              </p>
            </div>
          </div>
        </div>
        <div className="grids-cols-1 grid gap-2 space-y-1 sm:grid-cols-2 sm:gap-4 sm:space-y-4">
          <div className="flex items-center gap-2">
            <GaugeIcon className="text-muted mr-2 !h-5 !w-5" />
            <div>
              <p className="text-muted mb-0 text-xs sm:text-sm">Kilometraje</p>
              <p className="text-sm font-medium sm:text-base">
                {car ? `${Number(car.kilometers || 0).toLocaleString('es-ES')} km` : '-'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FuelIcon className="text-muted mr-2 !h-5 !w-5" />
            <div>
              <p className="text-muted mb-0 text-xs sm:text-sm">Combustible</p>
              <p className="text-sm font-medium sm:text-base">{car ? car.fuel || '-' : '-'}</p>
            </div>
          </div>
        </div>
        <div className="grids-cols-1 grid gap-2 space-y-1 sm:grid-cols-2 sm:gap-4 sm:space-y-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-muted mr-2 !h-5 !w-5" />
            <div>
              <p className="text-muted mb-0 text-xs sm:text-sm">Última revisión</p>
              <p className="text-sm font-medium sm:text-base">
                {car && car.lastRevision ? format(new Date(car.lastRevision), 'dd/MM/yyyy') : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleInformation;

import { CalendarCheck, CalendarCog, Car, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Car as CarType } from '@/types/Car';
import { Button } from '@/components/atoms/Button';
import { enqueueSnackbar } from 'notistack';

interface VehicleListItemProps {
  vehicle: CarType;
}

export const VehicleListItem = ({ vehicle }: VehicleListItemProps) => {
  const copyLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(`${window.location.origin}/cars/${vehicle._id}`);
    enqueueSnackbar('🔗 Link al vehículo copiado.', { variant: 'success' });
  };

  return (
    <Link to={`/cars/${vehicle._id}`}>
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-2 transition-colors duration-200 hover:bg-[#EAF2FD] sm:p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100">
            <Car className="text-primary h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-medium sm:text-sm">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-muted text-xs">{vehicle.plate || vehicle.vinCode || '—'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <CalendarCog className="text-muted h-4 w-4" />
            <p className="text-muted text-xs">Año: {vehicle.year || '—'}</p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <CalendarCheck className="text-muted h-4 w-4" />
            <p className="text-muted text-xs">
              Última Revisión:{' '}
              {vehicle.lastRevision ? format(new Date(vehicle.lastRevision), 'dd/MM/yyyy') : '—'}
            </p>
          </div>
          <Button variant="ghost" className="!p-0" onClick={copyLink}>
            <Share2 className="text-primary h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

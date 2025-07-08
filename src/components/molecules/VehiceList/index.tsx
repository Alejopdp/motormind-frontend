import { FileSearch } from 'lucide-react';

import { Button } from '@/components/atoms/Button';
import { Car } from '@/types/Car';
import { VehicleListItem } from './VehicleListItem';

interface VehicleListProps {
  vehicles: Car[];
  isLoading?: boolean;
  onAddVehicle: () => void;
  // previousPage: () => void;
  // nextPage: () => void;
  // total: number;
  // currentPage: number;
  // limit: number;
}

export const VehicleList = ({
  vehicles,
  isLoading = false,
  onAddVehicle,
  // previousPage,
  // nextPage,
  // total,
  // currentPage,
  // limit,
}: VehicleListProps) => {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-4">
          <FileSearch className="h-10 w-10 text-gray-500" />
        </div>
        <h3 className="mb-1 text-lg font-medium">No se encontraron vehículos</h3>
        <p className="text-muted mb-4">
          No hay vehículos registrados o que coincidan con tu búsqueda.
        </p>
        <Button onClick={onAddVehicle}>Añadir Vehículo</Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col space-y-2">
        {vehicles.map((vehicle) => (
          <VehicleListItem key={vehicle._id} vehicle={vehicle} />
        ))}
      </div>

      {/* {vehicles.length > 0 && (
        <div className="sticky bottom-0">
          <Pagination
            total={total}
            currentPage={currentPage}
            handlePreviousPage={previousPage}
            handleNextPage={nextPage}
            limit={limit}
          />
        </div>
      )} */}
    </div>
  );
};

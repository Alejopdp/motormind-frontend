import { FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/Table';
import { Button } from '@/components/atoms/Button';
import { Car } from '@/types/Car';
import { format } from 'date-fns';
import { Pagination } from '../Pagination';

interface VehicleListTableProps {
  vehicles: Car[];
  isLoading?: boolean;
  previousPage: () => void;
  nextPage: () => void;
  total: number;
  currentPage: number;
  limit: number;
}

export const VehicleListTable = ({
  vehicles,
  isLoading = false,
  previousPage,
  nextPage,
  total,
  currentPage,
  limit,
}: VehicleListTableProps) => {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#2A7DE1]"></div>
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
        <p className="mb-4 text-gray-500">
          No hay vehículos registrados o que coincidan con tu búsqueda.
        </p>
        <Button className="bg-[#2A7DE1] hover:bg-[#2468BE]">Añadir Vehículo</Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-gray-100">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead>Matrícula o VIN</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Última Visita</TableHead>
            <TableHead className="pr-3 text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle._id} className="transition-colors hover:bg-gray-50">
              <TableCell className="font-medium">
                {vehicle.plate || vehicle.vinCode || '—'}
              </TableCell>
              <TableCell>{vehicle.brand || '—'}</TableCell>
              <TableCell>{vehicle.model || '—'}</TableCell>
              <TableCell>{vehicle.year || '—'}</TableCell>
              <TableCell>
                {vehicle.lastRevision ? format(new Date(vehicle.lastRevision), 'dd/MM/yyyy') : '—'}
              </TableCell>
              <TableCell className="text-right">
                <Link to={`/cars/${vehicle._id}`}>
                  <Button variant="link" size="sm">
                    Ver Detalles
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {vehicles.length > 0 && (
        <div className="sticky bottom-0">
          <Pagination
            total={total}
            currentPage={currentPage}
            handlePreviousPage={previousPage}
            handleNextPage={nextPage}
            limit={limit}
          />
        </div>
      )}
    </div>
  );
};

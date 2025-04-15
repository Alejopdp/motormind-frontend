import { ChevronLeftIcon, ChevronRightIcon, FileSearch } from 'lucide-react';
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
              <TableCell>{'—'}</TableCell>
              <TableCell className="text-right">
                <Link to={`/cars/${vehicle._id}`}>
                  <Button size="sm">Ver Detalles</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between border-t border-gray-300 px-4 py-3">
        <div className="text-sm text-gray-500">
          {total <= limit ? (
            <>
              Mostrando <span className="font-medium">1</span> a{' '}
              <span className="font-medium">{total}</span> de{' '}
              <span className="font-medium">{total}</span> vehículo{total !== 1 ? 's' : ''}
            </>
          ) : (
            <>
              Mostrando <span className="font-medium">{(currentPage - 1) * limit + 1}</span> a{' '}
              <span className="font-medium">{Math.min(currentPage * limit, total)}</span> de{' '}
              <span className="font-medium">{total}</span> vehículos
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={previousPage} disabled={currentPage === 1}>
            <ChevronLeftIcon className="h-4 w-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage >= Math.ceil(total / limit)}
          >
            Siguiente
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

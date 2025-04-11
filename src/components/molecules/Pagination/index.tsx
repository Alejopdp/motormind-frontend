import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Button } from '@/components/atoms/Button';

interface PaginationProps {
  total: number;
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  limit?: number;
}

export const Pagination = ({
  total,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  limit = 5,
}: PaginationProps) => {
  return (
    <div className="w-full border-t border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {total <= limit ? (
            <>
              Mostrando <span className="font-medium">1</span> a{' '}
              <span className="font-medium">{total}</span> de{' '}
              <span className="font-medium">{total}</span> vehículo
              {total !== 1 ? 's' : ''}
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
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
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

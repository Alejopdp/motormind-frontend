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
    <div className="w-full border-t border-gray-200 bg-white px-4 py-1 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {total <= limit ? (
            <>
              <span className="hidden lg:inline">Mostrando</span>{' '}
              <span className="text-xs font-medium lg:text-base">1</span> a{' '}
              <span className="text-xs font-medium lg:text-base">{total}</span> de{' '}
              <span className="text-xs font-medium lg:text-base">{total}</span> vehículo
              {total !== 1 ? 's' : ''}
            </>
          ) : (
            <>
              <span className="hidden lg:inline">Mostrando</span>{' '}
              <span className="text-xs font-medium lg:text-base">
                {(currentPage - 1) * limit + 1}
              </span>{' '}
              a{' '}
              <span className="text-xs font-medium lg:text-base">
                {Math.min(currentPage * limit, total)}
              </span>{' '}
              de <span className="text-xs font-medium lg:text-base">{total}</span> vehículos
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
            <span className="hidden lg:inline">Anterior</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= Math.ceil(total / limit)}
          >
            <span className="hidden lg:inline">Siguiente</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

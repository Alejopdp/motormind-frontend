import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, SearchIcon } from 'lucide-react';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

interface VehicleListHeaderProps {
  onSearch: (query: string) => void;
  onAddVehicle: () => void;
}

export const VehicleListHeader = ({ onSearch, onAddVehicle }: VehicleListHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useCallback(
    (value: string) => {
      const timer = setTimeout(() => {
        onSearch(value);
      }, 300);
      return () => clearTimeout(timer);
    },
    [onSearch],
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <h1 className="text-2xl font-bold">Vehículos Registrados</h1>

      <div className="flex w-full flex-col space-y-2 sm:w-auto sm:flex-row sm:space-y-0 sm:space-x-2">
        <div className="relative flex-grow sm:max-w-md">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            className="h-10 w-full min-w-[340px] rounded-md py-2 pr-4 pl-9"
            placeholder="Buscar por Matrícula, VIN, Marca, Modelo..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <Button onClick={onAddVehicle} className="h-10">
          <PlusIcon className="h-4 w-4" />
          Añadir Vehículo
        </Button>
      </div>
    </div>
  );
};

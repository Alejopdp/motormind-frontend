import { useState } from 'react';
import { CheckIcon, HashIcon, FileTextIcon, XIcon, PlusIcon, ArrowLeftIcon } from 'lucide-react';
import { Calendar } from '@/components/atoms/Calendar';
import { useSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';

import { Button } from '@/components/atoms/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/Dialog';
import { Input } from '@/components/atoms/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs';
import { PLATE_REGEX, VIN_REGEX } from '@/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';
import { parseSpanishDate } from '@/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useApi } from '@/hooks/useApi';
import { CreateCar, Car } from '@/types/Car';

const MIN_YEAR = 1980;

interface CreateDiagnosticModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createOnly?: boolean;
}

export const CreateDiagnosticModal = ({
  open,
  onOpenChange,
  createOnly = false,
}: CreateDiagnosticModalProps) => {
  const [licensePlate, setLicensePlate] = useState('');
  const [vin, setVin] = useState('');
  const [activeTab, setActiveTab] = useState('licensePlate');
  const [isLicensePlateValid, setIsLicensePlateValid] = useState<boolean | null>(null);
  const [isVinValid, setIsVinValid] = useState<boolean | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { execute: addVehicleRequest } = useApi<Car>('post', '/cars');
  const { execute: getOrCreateVehicleRequest } = useApi<Car>('get', '/cars/vin-or-plate');

  // Manual creation form state
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualData, setManualData] = useState({
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    kilometers: '',
    fuel: '',
    lastRevision: '',
    vinCode: '',
  });

  const addVehicleMutation = useMutation<AxiosResponse<Car>, Error, CreateCar>({
    mutationFn: (carData: CreateCar) => addVehicleRequest(carData),
    onSuccess: (response) => {
      enqueueSnackbar('Vehículo creado exitosamente', { variant: 'success' });
      onOpenChange(false);
      navigate(`/cars/${response.data._id}`);
    },
    onError: () => {
      enqueueSnackbar('Error al crear el vehículo', { variant: 'error' });
    },
  });

  const getOrCreateVehicleMutation = useMutation<
    AxiosResponse<Car>,
    Error,
    { vinCode?: string; plate?: string }
  >({
    mutationFn: (params: { vinCode?: string; plate?: string }) =>
      getOrCreateVehicleRequest(undefined, params),
    onSuccess: (response) => {
      navigate(`/cars/${response.data._id}`);
    },
    onError: () => {
      enqueueSnackbar('Error al obtener el vehículo', { variant: 'error' });
    },
  });

  const validateLicensePlate = (value: string) => {
    // Only allow letters, numbers, hyphen and space
    const filteredValue = value.replace(/[^a-zA-Z0-9\s-]/g, '');
    // Convert to uppercase
    const upperValue = filteredValue.toUpperCase();

    if (isManualMode) handleManualInputChange('licensePlate', upperValue);
    else setLicensePlate(upperValue);

    // Validate using regex pattern
    if (upperValue.length > 0) {
      setIsLicensePlateValid(PLATE_REGEX.test(upperValue));
    } else {
      setIsLicensePlateValid(null);
    }
  };

  const validateVin = (value: string) => {
    // Only allow letters, numbers, hyphen and space
    const filteredValue = value.replace(/[^a-zA-Z0-9\s-]/g, '');
    // Convert to uppercase
    const upperValue = filteredValue.toUpperCase();

    if (isManualMode) handleManualInputChange('vinCode', upperValue);
    else setVin(upperValue);

    // Validate using regex pattern
    if (upperValue.length > 0) {
      setIsVinValid(VIN_REGEX.test(upperValue));
    } else {
      setIsVinValid(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isManualMode) {
      const carData: CreateCar = {
        vinCode: manualData.vinCode || '',
        brand: manualData.brand,
        model: manualData.model,
        year: parseInt(manualData.year),
        plate: manualData.licensePlate || '',
        kilometers: Number(manualData.kilometers) || 0,
        lastRevision: manualData.lastRevision ? new Date(manualData.lastRevision) : new Date(),
        fuel: manualData.fuel || '',
      };
      addVehicleMutation.mutate(carData);
    } else if (activeTab === 'licensePlate' && licensePlate.trim()) {
      getOrCreateVehicleMutation.mutate({ plate: licensePlate });
    } else if (activeTab === 'vin' && vin.trim()) {
      getOrCreateVehicleMutation.mutate({ vinCode: vin });
    }
  };

  const handleCreateManually = () => {
    setIsManualMode(true);
  };

  const handleBackToSearch = () => {
    setIsManualMode(false);
  };

  const resetForm = () => {
    setLicensePlate('');
    setVin('');
    setActiveTab('licensePlate');
    setIsLicensePlateValid(null);
    setIsVinValid(null);
    setIsManualMode(false);
    setManualData({
      brand: '',
      model: '',
      year: '',
      licensePlate: '',
      kilometers: '',
      fuel: '',
      lastRevision: '',
      vinCode: '',
    });
  };

  const handleManualInputChange = (field: string, value: string) => {
    if (field === 'brand') {
      // Solo permitir letras y espacios
      value = value.replace(/[^a-zA-Z\s]/g, '');
    }
    setManualData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isSubmitDisabled = Boolean(
    isManualMode
      ? !manualData.brand || // Brand is required
          manualData.brand.length < 2 || // Brand must be at least 3 characters
          !manualData.model || // Model is required
          !manualData.year || // Year is required
          Number(manualData.year) < MIN_YEAR || // Year must be greater than 1980
          Number(manualData.year) > new Date().getFullYear() || // Year must be less than current year
          (manualData.kilometers && Number(manualData.kilometers) <= 0) || // Kilometers must be greater than 0
          (manualData.licensePlate && !isLicensePlateValid) // License plate must be valid
      : (activeTab === 'licensePlate' && !licensePlate.trim()) ||
          (activeTab === 'vin' && !vin.trim()),
  );

  const isLoading = addVehicleMutation.isPending || getOrCreateVehicleMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg sm:min-w-lg">
        <DialogHeader>
          <DialogTitle>Crear Nuevo {createOnly ? 'Vehículo' : 'Diagnóstico'}</DialogTitle>
          <DialogDescription className="text-muted">
            {isManualMode
              ? 'Introduce los datos del vehículo manualmente'
              : 'Introduce los datos del vehículo para iniciar un nuevo diagnóstico.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-5">
          {isManualMode ? (
            <div className="grid gap-2 py-0 sm:gap-4 sm:py-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                <div>
                  <p className="mb-0.5 text-xs font-medium sm:text-sm">
                    Marca <span className="text-red-500">*</span>
                  </p>
                  <Input
                    id="brand"
                    value={manualData.brand}
                    onChange={(e) => handleManualInputChange('brand', e.target.value)}
                    placeholder="Ej: Seat"
                    required
                    maxLength={30}
                    minLength={2}
                  />
                </div>

                <div>
                  <p className="mb-0.5 text-xs font-medium sm:text-sm">
                    Modelo <span className="text-red-500">*</span>
                  </p>
                  <Input
                    id="model"
                    value={manualData.model}
                    onChange={(e) => handleManualInputChange('model', e.target.value)}
                    placeholder="Ej: León"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                <div>
                  <p className="mb-0.5 text-xs font-medium sm:text-sm">
                    Año <span className="text-red-500">*</span>
                  </p>
                  <Input
                    id="year"
                    value={manualData.year}
                    onChange={(e) => handleManualInputChange('year', e.target.value)}
                    placeholder="Ej: 2020"
                    type="number"
                    min={MIN_YEAR}
                    max={new Date().getFullYear()}
                    required
                  />
                  {(Number(manualData.year) < MIN_YEAR ||
                    Number(manualData.year) > new Date().getFullYear()) &&
                    manualData.year?.toString().length === 4 && (
                      <p className="mt-1 text-xs text-red-500">
                        Ingrese valores entre {MIN_YEAR} y {new Date().getFullYear()}
                      </p>
                    )}
                </div>

                <div>
                  <p className="mb-0.5 text-xs font-medium sm:text-sm">Matrícula</p>
                  <div>
                    <div className="relative">
                      <Input
                        id="licensePlate"
                        value={manualData.licensePlate}
                        onChange={(e) => validateLicensePlate(e.target.value)}
                        className={`${
                          isLicensePlateValid === true
                            ? 'border-green-500 pr-10'
                            : isLicensePlateValid === false
                              ? 'border-red-500 pr-10'
                              : ''
                        }`}
                        pattern={PLATE_REGEX.source}
                        placeholder="Ej: 4859 JKL / M-1234-AB"
                      />

                      {isLicensePlateValid !== null && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          {isLicensePlateValid ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XIcon className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {isLicensePlateValid === false && (
                      <p className="mt-1 text-xs text-red-500">
                        Matrícula inválida. Por favor, introduce una matrícula válida.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                <div>
                  <p className="mb-0.5 text-xs font-medium sm:text-sm">VIN</p>
                  <div>
                    <div className="relative">
                      <Input
                        id="vinCode"
                        value={manualData.vinCode}
                        onChange={(e) => validateVin(e.target.value)}
                        className={`${
                          isVinValid === true
                            ? 'border-green-500 pr-10'
                            : isVinValid === false
                              ? 'border-red-500 pr-10'
                              : ''
                        }`}
                        pattern={VIN_REGEX.source}
                        placeholder="Ej: 12345678901234567"
                      />

                      {isVinValid !== null && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          {isVinValid ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XIcon className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {isVinValid === false && (
                      <p className="mt-1 text-xs text-red-500">
                        VIN inválido. Por favor, introduce un VIN válido.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-0.5 text-xs font-medium sm:text-sm">KMs</p>
                  <Input
                    id="kilometers"
                    value={manualData.kilometers}
                    onChange={(e) => handleManualInputChange('kilometers', e.target.value)}
                    placeholder="Ej: 50000"
                    type="number"
                    min="1"
                  />
                  {!!manualData.kilometers && Number(manualData.kilometers) <= 0 && (
                    <p className="mt-1 text-xs text-red-500">Ingrese números mayores que 0</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                <div>
                  <p className="mb-0.5 text-xs font-medium sm:text-sm">Combustible</p>
                  <Select
                    value={manualData.fuel}
                    onValueChange={(value) => handleManualInputChange('fuel', value)}
                  >
                    <SelectTrigger id="fuel">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gasolina">Gasolina</SelectItem>
                      <SelectItem value="Diésel">Diésel</SelectItem>
                      <SelectItem value="Híbrido">Híbrido</SelectItem>
                      <SelectItem value="Eléctrico">Eléctrico</SelectItem>
                      <SelectItem value="GLP">GLP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="mb-0.5 text-xs font-medium sm:text-sm">Última revisión</p>

                  <Calendar
                    value={
                      manualData.lastRevision
                        ? parseSpanishDate(manualData.lastRevision) || null
                        : null
                    }
                    onChange={(date) => {
                      if (date) {
                        const formattedDate = format(date, 'dd/MM/yyyy', { locale: es });
                        handleManualInputChange('lastRevision', formattedDate);
                      } else {
                        handleManualInputChange('lastRevision', '');
                      }
                    }}
                    maxDate={new Date()}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-primary flex items-center text-sm"
                  onClick={handleBackToSearch}
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Volver <span className="hidden sm:inline">a búsqueda por matrícula o VIN</span>
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Tabs
                defaultValue="licensePlate"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="licensePlate">Por Matrícula</TabsTrigger>
                  <TabsTrigger value="vin">Por Bastidor (VIN)</TabsTrigger>
                </TabsList>
                <TabsContent value="licensePlate" className="mt-4">
                  <div>
                    <p className="mb-0.5 text-sm font-medium">Matrícula del Vehículo</p>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FileTextIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="licensePlate"
                        value={licensePlate}
                        onChange={(e) => validateLicensePlate(e.target.value)}
                        className={`pl-10 ${
                          isLicensePlateValid === true
                            ? 'border-green-500 pr-10'
                            : isLicensePlateValid === false
                              ? 'border-red-500 pr-10'
                              : ''
                        }`}
                        pattern={PLATE_REGEX.source}
                        placeholder="Ej: 4859 JKL / M-1234-AB"
                        autoComplete="off"
                      />

                      {isLicensePlateValid !== null && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          {isLicensePlateValid ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XIcon className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {isLicensePlateValid === false && (
                      <p className="mt-1 text-xs text-red-500">
                        Matrícula inválida. Por favor, introduce una matrícula válida.
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="vin" className="mt-4">
                  <div>
                    <p className="mb-0.5 text-xs font-medium sm:text-sm">
                      Número de Bastidor (VIN)
                    </p>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <HashIcon className="mb-0.5 h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="vin"
                        value={vin}
                        onChange={(e) => validateVin(e.target.value)}
                        className={`pl-10 ${
                          isVinValid === true
                            ? 'border-green-500 pr-10'
                            : isVinValid === false
                              ? 'border-red-500 pr-10'
                              : ''
                        }`}
                        placeholder="Ej: WVWZZZ1JZXW000001"
                        autoComplete="off"
                        pattern={VIN_REGEX.source}
                      />

                      {isVinValid !== null && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          {isVinValid ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <XIcon className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {isVinValid === false && (
                      <p className="mt-1 text-xs text-red-500">
                        VIN inválido. Por favor, introduce un VIN válido.
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="text-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-primary"
                  onClick={handleCreateManually}
                >
                  <PlusIcon className="h-4 w-4" />O crear manualmente
                </Button>
              </div>
            </>
          )}

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitDisabled || isLoading}>
              {createOnly
                ? isLoading
                  ? 'Creando Vehículo...'
                  : 'Crear Vehículo'
                : isLoading
                  ? 'Comenzando...'
                  : 'Comenzar Diagnóstico'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from 'react';
import { CheckIcon, HashIcon, FileTextIcon, XIcon, PlusIcon, ArrowLeftIcon } from 'lucide-react';

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

const MIN_YEAR = 1980;

interface CreateDiagnosticModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    licensePlate?: string;
    vin?: string;
    manualData?: {
      brand: string;
      model: string;
      year: string;
      licensePlate?: string;
      kilometers?: string;
    };
  }) => void;
  createOnly?: boolean;
  isLoading?: boolean;
}

export const CreateDiagnosticModal = ({
  open,
  onOpenChange,
  onSubmit = () => {},
  createOnly = false,
  isLoading = false,
}: CreateDiagnosticModalProps) => {
  const [licensePlate, setLicensePlate] = useState('');
  const [vin, setVin] = useState('');
  const [activeTab, setActiveTab] = useState('licensePlate');
  const [isLicensePlateValid, setIsLicensePlateValid] = useState<boolean | null>(null);
  const [isVinValid, setIsVinValid] = useState<boolean | null>(null);

  // Manual creation form state
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualData, setManualData] = useState({
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    kilometers: '',
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
    setVin(upperValue);

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
      onSubmit({ manualData });
    } else if (activeTab === 'licensePlate' && licensePlate.trim()) {
      onSubmit({ licensePlate });
    } else if (activeTab === 'vin' && vin.trim()) {
      onSubmit({ vin });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Crear Nuevo {createOnly ? 'Vehículo' : 'Diagnóstico'}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {isManualMode
              ? 'Introduce los datos del vehículo manualmente'
              : 'Introduce los datos del vehículo para iniciar un nuevo diagnóstico.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isManualMode ? (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">
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
                <p className="text-sm font-medium">
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

              <div>
                <p className="text-sm font-medium">
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
                  manualData.year.length === 4 && (
                    <p className="mt-1 text-xs text-red-500">
                      Ingrese valores entre {MIN_YEAR} y {new Date().getFullYear()}
                    </p>
                  )}
              </div>

              <div>
                <p className="text-sm font-medium">Matrícula</p>
                <div>
                  <div className="relative">
                    <Input
                      id="manualLicensePlate"
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
                      placeholder="Ej: 4859 JKL or M-1234-AB"
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

              <div>
                <p className="text-sm font-medium">KMs</p>
                <Input
                  id="kilometers"
                  value={manualData.kilometers}
                  onChange={(e) => handleManualInputChange('kilometers', e.target.value)}
                  placeholder="Ej: 50000"
                  type="number"
                  min="1"
                />
                {manualData.kilometers && Number(manualData.kilometers) <= 0 && (
                  <p className="mt-1 text-xs text-red-500">Ingrese números mayores que 0</p>
                )}
              </div>

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-primary flex items-center text-sm"
                  onClick={handleBackToSearch}
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                  Volver a búsqueda por matrícula o VIN
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
                        placeholder="Ej: 4859 JKL or M-1234-AB"
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
                    <p className="text-sm font-medium">Número de Bastidor (VIN)</p>
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
                  className="text-primary text-sm"
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

import { useState } from 'react';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { useApi } from '@/hooks/useApi';
import Spinner from '@/components/atoms/Spinner';
import { Car } from '@/types/Car';
import { ImageUploadStep } from '@/components/molecules/ImageUploadStep';

const CreateDamageAssessment = () => {
  const [activeTab, setActiveTab] = useState<'vin' | 'plate'>('plate');
  const [vin, setVin] = useState('');
  const [plate, setPlate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState<Car | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const { execute: getOrCreateCar } = useApi<Car>('get', '/cars/vin-or-plate');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const params = activeTab === 'vin' ? { vinCode: vin } : { plate };
      const res = await getOrCreateCar(undefined, params);
      setCar(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error buscando el vehículo');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    console.log('Imágenes seleccionadas:', images);
    // Aquí iría el siguiente paso del flujo
  };

  return (
    <div className="bg-background flex min-h-screen w-full flex-row">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-center text-2xl font-semibold">Nuevo Peritaje</h2>
          {!car ? (
            <>
              <div className="mb-6 flex justify-center gap-2">
                <Button
                  variant={activeTab === 'plate' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('plate')}
                  className="w-1/2"
                >
                  Matrícula
                </Button>
                <Button
                  variant={activeTab === 'vin' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('vin')}
                  className="w-1/2"
                >
                  VIN
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'plate' ? (
                  <Input
                    placeholder="Introduce la matrícula"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    autoFocus
                    maxLength={12}
                    required
                    disabled={loading}
                  />
                ) : (
                  <Input
                    placeholder="Introduce el VIN"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    autoFocus
                    maxLength={20}
                    required
                    disabled={loading}
                  />
                )}
                <Button type="submit" className="mt-2 w-full" disabled={loading}>
                  {loading ? <Spinner label="Buscando..." /> : 'Buscar vehículo'}
                </Button>
                {error && <div className="text-destructive mt-2 text-center text-sm">{error}</div>}
              </form>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="mb-2 text-center text-lg font-medium">Vehículo seleccionado:</div>
                <div className="rounded bg-gray-50 p-3 text-center text-sm">
                  <div>
                    <b>Marca:</b> {car.brand}
                  </div>
                  <div>
                    <b>Modelo:</b> {car.model}
                  </div>
                  <div>
                    <b>Matrícula:</b> {car.plate}
                  </div>
                  <div>
                    <b>VIN:</b> {car.vinCode}
                  </div>
                </div>
              </div>
              <ImageUploadStep images={images} onImagesChange={setImages} />
              <Button
                className="mt-6 w-full"
                onClick={handleContinue}
                disabled={images.length === 0}
              >
                Continuar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateDamageAssessment;

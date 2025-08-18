import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Car, Upload } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { useWizardV2 } from '../hooks/useWizardV2';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useCarSearch } from '@/hooks/useCarSearch';
import { PageShell } from '../components/PageShell';
import { SectionPaper } from '../components/SectionPaper';
import { WizardStepper } from '../components/WizardStepper';
import { DragZone } from '../components/DragZone';
import { ImagePreview } from '../components/ImagePreview';

const Intake = () => {
  const navigate = useNavigate();
  const [,] = useSearchParams();
  const { startIntake } = useWizardV2();
  const { upload, isLoading: isUploading } = useFileUpload();
  const { searchCar, isLoading: isSearchingCar, error: carSearchError } = useCarSearch();
  const [plate, setPlate] = useState('');
  const [claim, setClaim] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const createAssessment = async () => {
    try {
      setIsCreating(true);

      // 1. Buscar/crear el coche primero (como en el flujo original)
      console.log('🔍 Buscando/creando coche por matrícula:', plate);
      const car = await searchCar({ plate: plate.toUpperCase() });
      console.log('✅ Coche encontrado/creado:', car);

      // 2. Subir imágenes con el carId (si hay alguna)
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        console.log('📤 Subiendo imágenes con carId:', car._id);
        const uploadResult = await upload(selectedFiles, { carId: car._id }, 'damage-assessment');
        imageUrls = uploadResult.keys;
        console.log('✅ Imágenes subidas:', imageUrls);
      }

      // 3. Crear el assessment con las URLs reales y el carId
      const assessmentId = await startIntake({
        plate: plate.toUpperCase(),
        claimDescription: claim,
        images: imageUrls,
      });

      // Navegar con el ID real del assessment
      navigate(`/damage-assessments/${assessmentId}/wizard-v2?step=damages`, { replace: true });
    } catch (error) {
      console.error('❌ Error creando assessment:', error);
      // Mostrar error específico según el paso que falló
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsCreating(false);
    }
  };

  const isValid = plate.trim().length > 0 && claim.trim().length > 0;

  return (
    <PageShell
      header={<WizardStepper currentStep="intake" completedSteps={[]} />}
      title="Datos iniciales del vehículo"
      subtitle="Ingresá la matrícula y una breve descripción del siniestro. Podés subir fotos ahora o más tarde."
      content={
        <>
          {/* Vehicle Data Section */}
          <SectionPaper title="Datos del Vehículo" icon={<Car className="h-5 w-5" />}>
            <div className="grid gap-4">
              <div>
                <label className="text-card-foreground mb-1 block text-sm font-medium">
                  Matrícula
                </label>
                <Input
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="AA123BB"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="text-card-foreground mb-1 block text-sm font-medium">
                  Siniestro
                </label>
                <Textarea
                  value={claim}
                  onChange={(e) => setClaim(e.target.value)}
                  placeholder="Ej.: Impacto lateral en puerta delantera izquierda."
                  maxLength={500}
                  rows={4}
                  className="bg-background"
                />
                <div className="text-muted-foreground mt-2 ml-auto w-fit text-xs">
                  {claim.length}/500
                </div>
                {carSearchError && (
                  <div className="mt-2 text-sm text-red-600">Error: {carSearchError}</div>
                )}
              </div>
            </div>
          </SectionPaper>

          {/* Image Upload Section */}
          <SectionPaper title="Subir imágenes del vehículo" icon={<Upload className="h-5 w-5" />}>
            <DragZone onFilesSelected={handleFilesSelected} />
            <ImagePreview files={selectedFiles} onRemoveImage={removeImage} />
          </SectionPaper>
        </>
      }
      footer={
        <div className="flex justify-end">
          <Button
            onClick={createAssessment}
            disabled={!isValid || isCreating || isUploading || isSearchingCar}
            className="px-6"
          >
            {isSearchingCar
              ? 'Buscando coche...'
              : isUploading
                ? 'Subiendo imágenes...'
                : isCreating
                  ? 'Creando assessment...'
                  : 'Crear assessment'}
          </Button>
        </div>
      }
    />
  );
};

export default Intake;

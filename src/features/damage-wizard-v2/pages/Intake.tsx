import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Car, Upload } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { useWizardV2 } from '../hooks/useWizardV2';
import { PageShell } from '../components/PageShell';
import { SectionPaper } from '../components/SectionPaper';
import { WizardStepper } from '../components/WizardStepper';
import { DragZone } from '../components/DragZone';
import { ImagePreview } from '../components/ImagePreview';

const Intake = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { startIntake } = useWizardV2();
  const [plate, setPlate] = useState('SDCSDC');
  const [claim, setClaim] = useState('scsdcJMNM LWEWEWE');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const createMockAssessment = async () => {
    try {
      const images = selectedFiles.map((f) => URL.createObjectURL(f));
      await startIntake({
        plate: plate.toUpperCase(),
        claimDescription: claim,
        images,
      });
      
      setParams({ step: 'damages' });
      navigate(`?step=damages`, { replace: true });
    } catch (error) {
      console.error('Error starting intake:', error);
      // Fallback a mock si falla
      console.warn('Falling back to mock data');
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
          <Button onClick={createMockAssessment} disabled={!isValid} className="px-6">
            Crear assessment
          </Button>
        </div>
      }
    />
  );
};

export default Intake;

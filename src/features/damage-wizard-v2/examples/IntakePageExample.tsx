import { useState } from 'react';
import { Car, Upload } from 'lucide-react';
import { WizardStepper } from '../components/WizardStepper';
import { PageShell } from '../components/PageShell';
import { SectionPaper } from '../components/SectionPaper';
import { DragZone } from '../components/DragZone';
import { ImagePreview } from '../components/ImagePreview';

/**
 * Ejemplo completo de la página Intake usando todos los componentes refactorizados
 * con paridad 1:1 al prototipo del repo de diseño.
 *
 * Demuestra:
 * - WizardStepper con estado 'intake' activo
 * - PageShell con layout narrow para formularios
 * - SectionPaper para "Datos del Vehículo" y "Subir imágenes"
 * - DragZone con todos los estados (normal/drag/error)
 */
export const IntakePageExample = () => {
  const [formData, setFormData] = useState({
    vehicleInfo: { plate: '' },
    claim: { description: '' },
  });
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [dragZoneError, setDragZoneError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleFilesSelected = (files: File[]) => {
    setUploadedImages((prev) => [...prev, ...files]);
    setDragZoneError(null);
    console.log(
      'Files selected:',
      files.map((f) => f.name),
    );
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    console.log('Image removed at index:', index);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.vehicleInfo.plate.trim()) {
      errors.plate = 'La matrícula es obligatoria';
    }

    if (!formData.claim.description.trim()) {
      errors.description = 'La descripción del siniestro es obligatoria';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Form submitted:', { formData, uploadedImages });
      alert(
        `Datos enviados:\nMatrícula: ${formData.vehicleInfo.plate}\nDescripción: ${formData.claim.description}\nImágenes: ${uploadedImages.length}`,
      );
    }
  };

  const handleTestDragError = () => {
    setDragZoneError('Error de prueba: tipo de archivo no válido');
  };

  const clearDragError = () => {
    setDragZoneError(null);
  };

  const footer = (
    <div className="flex items-center justify-between">
      <button
        type="button"
        className="ring-offset-background focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        ← Volver al listado
      </button>

      <button
        type="submit"
        form="intake-form"
        className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        Continuar →
      </button>
    </div>
  );

  const content = (
    <form id="intake-form" onSubmit={handleSubmit} className="space-y-8">
      {/* Vehicle Information Section */}
      <SectionPaper title="Datos del Vehículo" icon={<Car />} formSpacing>
        <div>
          <label htmlFor="plate" className="text-card-foreground mb-1 block text-sm font-medium">
            Matrícula
          </label>
          <input
            id="plate"
            type="text"
            value={formData.vehicleInfo.plate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                vehicleInfo: { ...prev.vehicleInfo, plate: e.target.value.toUpperCase() },
              }))
            }
            onBlur={() => validateForm()}
            placeholder="AA123BB"
            className={`bg-background ring-offset-background file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
              validationErrors.plate ? 'border-destructive' : 'border-input'
            }`}
          />
          {validationErrors.plate && (
            <p className="text-destructive mt-1 text-sm">{validationErrors.plate}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-card-foreground mb-1 block text-sm font-medium"
          >
            Siniestro
          </label>
          <textarea
            id="description"
            value={formData.claim.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                claim: { ...prev.claim, description: e.target.value },
              }))
            }
            onBlur={() => validateForm()}
            placeholder="Describe brevemente lo sucedido..."
            rows={4}
            className={`bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
              validationErrors.description ? 'border-destructive' : 'border-input'
            }`}
          />
          {validationErrors.description && (
            <p className="text-destructive mt-1 text-sm">{validationErrors.description}</p>
          )}
        </div>
      </SectionPaper>

      {/* Image Upload Section */}
      <SectionPaper title="Subir imágenes del vehículo" icon={<Upload />}>
        <DragZone onFilesSelected={handleFilesSelected} error={dragZoneError} />

        <ImagePreview files={uploadedImages} onRemoveImage={removeImage} />

        {/* DragZone Test Controls */}
        <div className="border-border mt-6 border-t pt-6">
          <h4 className="text-card-foreground mb-3 text-sm font-medium">
            Controles de Prueba - Estados DragZone
          </h4>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleTestDragError}
              className="bg-destructive/10 text-destructive border-destructive/20 rounded border px-3 py-1 text-xs"
            >
              Simular Error
            </button>
            <button
              type="button"
              onClick={clearDragError}
              className="bg-success/10 text-success border-success/20 rounded border px-3 py-1 text-xs"
            >
              Limpiar Error
            </button>
          </div>
        </div>
      </SectionPaper>
    </form>
  );

  return (
    <>
      {/* WizardStepper - rendered outside PageShell */}
      <WizardStepper currentStep="intake" completedSteps={[]} />

      {/* Page Content */}
      <PageShell
        narrow
        title="Datos iniciales del vehículo"
        subtitle="Ingresá la matrícula y una breve descripción del siniestro. Podés subir fotos ahora o más tarde."
        content={content}
        footer={footer}
      />

      {/* Status Debug Panel */}
      <div className="bg-card border-border fixed top-4 right-4 max-w-sm rounded-lg border p-4 shadow-lg">
        <h3 className="mb-2 text-sm font-semibold">Estado de Paridad ✅</h3>
        <div className="text-muted-foreground space-y-1 text-xs">
          <p>
            • <strong>WizardStepper:</strong> bg-card + border-b + max-w-7xl
          </p>
          <p>
            • <strong>PageShell:</strong> bg-background + narrow + pb-32
          </p>
          <p>
            • <strong>SectionPaper:</strong> p-6 + gap-3 + text-xl + formSpacing
          </p>
          <p>
            • <strong>DragZone:</strong> border-primary/muted + tokens exactos
          </p>
          <p>
            • <strong>ImagePreview:</strong> grid + componente modular
          </p>
          <p>
            • <strong>ImageRemoveButton:</strong> hover + opacity-0 → 100 + destructive
          </p>
          <p>
            • <strong>Footer:</strong> fixed + bg-card + border-t + shadow-lg
          </p>
        </div>

        <div className="border-border mt-3 border-t pt-3 text-xs">
          <p>
            <strong>Datos:</strong> {formData.vehicleInfo.plate || 'Sin matrícula'}
          </p>
          <p>
            <strong>Imágenes:</strong> {uploadedImages.length}/20
          </p>
          <p>
            <strong>Errores:</strong> {Object.keys(validationErrors).length}
          </p>
          <p>
            <strong>Hover:</strong> ImageRemoveButton separado + modular
          </p>
        </div>
      </div>
    </>
  );
};

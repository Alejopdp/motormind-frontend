import { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const MAX_IMAGES = 15;

interface ImageUploadStepProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export const ImageUploadStep: React.FC<ImageUploadStepProps> = ({ images, onImagesChange }) => {
  // Detecta mobile simple
  const isMobile = useMemo(() => window.innerWidth < 768, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...images, ...acceptedFiles].slice(0, MAX_IMAGES);
      onImagesChange(newFiles);
    },
    [images, onImagesChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
    maxFiles: MAX_IMAGES,
    noClick: isMobile, // En mobile solo input
  });

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newFiles = [...images, ...files].slice(0, MAX_IMAGES);
    onImagesChange(newFiles);
  };

  const removeImage = (idx: number) => {
    const newFiles = images.filter((_, i) => i !== idx);
    onImagesChange(newFiles);
  };

  return (
    <div>
      <h3 className="mb-4 text-center text-lg font-semibold">
        Sube fotos del vehículo (máx {MAX_IMAGES})
      </h3>
      <div className="mb-4 flex flex-wrap justify-center gap-3">
        {images.map((file, idx) => (
          <div key={idx} className="relative h-24 w-24 overflow-hidden rounded border bg-gray-50">
            <img
              src={URL.createObjectURL(file)}
              alt={`preview-${idx}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              className="bg-opacity-80 absolute top-1 right-1 rounded-full bg-white p-1 text-xs"
              onClick={() => removeImage(idx)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      {isMobile ? (
        <div className="flex flex-col items-center gap-2">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            disabled={images.length >= MAX_IMAGES}
            className="mb-2"
          />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <p className="mb-2">Arrastra imágenes aquí o haz click para seleccionar</p>
          {/* El div padre ya es clickable gracias a getRootProps() */}
        </div>
      )}
      <p className="mt-2 text-center text-xs text-gray-400">
        Puedes subir hasta {MAX_IMAGES} imágenes. Formatos soportados: JPG, PNG, WebP.
      </p>
    </div>
  );
};

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Trash2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ImageCarousel } from './ImageCarousel';

const MAX_IMAGES = 15;

interface ImageUploadStepProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export const ImageUploadStep: React.FC<ImageUploadStepProps> = ({ images, onImagesChange }) => {
  const isMobile = useIsMobile();
  const imageCount = images.length;
  const canUploadMore = imageCount < MAX_IMAGES;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!canUploadMore) return;
      const remainingSlots = MAX_IMAGES - imageCount;
      const filesToAdd = acceptedFiles.slice(0, remainingSlots);
      onImagesChange([...images, ...filesToAdd]);
    },
    [images, onImagesChange, imageCount, canUploadMore],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    disabled: !canUploadMore,
  });

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canUploadMore || !event.target.files) return;
    const selectedFiles = Array.from(event.target.files);
    const remainingSlots = MAX_IMAGES - imageCount;
    const filesToAdd = selectedFiles.slice(0, remainingSlots);
    onImagesChange([...images, ...filesToAdd]);
    // Reset input value to allow selecting the same file again if removed
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const imageCounterText = (
    <p
      className={`text-sm ${canUploadMore ? 'text-gray-600' : 'text-red-500'} mt-2 mb-2 text-center md:text-left`}
    >
      {imageCount} de {MAX_IMAGES} imágenes seleccionadas.
      {!canUploadMore && imageCount > 0 && ' Límite alcanzado.'}
    </p>
  );

  const emptyStateMessage = (
    <p className="my-4 text-center text-sm text-gray-500 italic">
      Cuando subas las imágenes, aparecerán aquí. Recuerda que puedes subir hasta {MAX_IMAGES}{' '}
      fotos.
    </p>
  );

  const thumbs = images.map((file, index) => (
    <div
      key={file.name + index}
      className="relative mr-2 mb-2 inline-flex h-24 w-24 rounded border border-gray-300 p-1 md:h-32 md:w-32"
    >
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        className="h-full w-full object-cover"
        onLoad={() => {
          URL.revokeObjectURL(file.name);
        }}
      />
      <button
        onClick={() => removeImage(index)}
        className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
        aria-label="Remove image"
      >
        <Trash2 size={16} />
      </button>
    </div>
  ));

  if (isMobile) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center px-4 pt-4">
        <div className="mb-4 flex w-full flex-col items-center gap-4">
          <label
            htmlFor="take-photo-input"
            className={`flex w-full max-w-xs cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed bg-gray-50 p-6 text-center ${canUploadMore ? 'border-gray-300 hover:bg-gray-100' : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'}`}
          >
            <Camera
              className={`mb-2 h-10 w-10 ${canUploadMore ? 'text-gray-500' : 'text-gray-400'}`}
            />
            <span
              className={`text-sm font-medium ${canUploadMore ? 'text-gray-700' : 'text-gray-400'}`}
            >
              Tomar Foto
            </span>
            <input
              id="take-photo-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelection}
              className="hidden"
              disabled={!canUploadMore}
            />
          </label>
          <label
            htmlFor="select-gallery-input"
            className={`flex w-full max-w-xs cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed bg-gray-50 p-6 text-center ${canUploadMore ? 'border-gray-300 hover:bg-gray-100' : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'}`}
          >
            <ImageIcon
              className={`mb-2 h-10 w-10 ${canUploadMore ? 'text-gray-500' : 'text-gray-400'}`}
            />
            <span
              className={`text-sm font-medium ${canUploadMore ? 'text-gray-700' : 'text-gray-400'}`}
            >
              Desde Galería
            </span>
            <input
              id="select-gallery-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelection}
              className="hidden"
              disabled={!canUploadMore}
            />
          </label>
        </div>
        {images.length > 0 && imageCounterText}
        {images.length > 0 ? (
          <ImageCarousel images={images} onRemove={removeImage} />
        ) : (
          emptyStateMessage
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`dropzone flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center ${canUploadMore ? (isDragActive ? 'border-blue-500 bg-blue-50' : 'cursor-pointer border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100') : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'}`}
      >
        <input {...getInputProps()} disabled={!canUploadMore} />
        <UploadCloud
          className={`mb-3 h-12 w-12 ${canUploadMore ? 'text-gray-400' : 'text-gray-300'}`}
        />
        {isDragActive && canUploadMore ? (
          <p className="text-lg font-semibold text-blue-600">Suelta las imágenes aquí...</p>
        ) : canUploadMore ? (
          <>
            <p className="text-lg font-semibold text-gray-700">
              Arrastra y suelta las imágenes aquí, o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500">Soportamos JPG, PNG, WebP, etc.</p>
          </>
        ) : (
          <p className="text-lg font-semibold">Límite de {MAX_IMAGES} imágenes alcanzado.</p>
        )}
      </div>
      {imageCounterText}
      {images.length > 0 ? (
        <aside className="mt-4 flex flex-wrap justify-start">{thumbs}</aside>
      ) : (
        emptyStateMessage
      )}
    </div>
  );
};

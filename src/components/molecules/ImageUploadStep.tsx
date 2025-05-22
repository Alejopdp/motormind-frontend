import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { MobileImageUploadView } from './MobileImageUploadView';
import { DesktopImageUploadView } from './DesktopImageUploadView';

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
      <MobileImageUploadView
        images={images}
        canUploadMore={canUploadMore}
        handleFileSelection={handleFileSelection}
        onRemoveImage={removeImage}
        imageCounterText={imageCounterText}
        emptyStateMessage={emptyStateMessage}
      />
    );
  }

  return (
    <DesktopImageUploadView
      getRootProps={getRootProps}
      getInputProps={getInputProps}
      isDragActive={isDragActive}
      canUploadMore={canUploadMore}
      MAX_IMAGES={MAX_IMAGES}
      imageCounterText={imageCounterText}
      images={images}
      thumbs={thumbs}
      emptyStateMessage={emptyStateMessage}
    />
  );
};

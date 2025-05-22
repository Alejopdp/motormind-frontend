import React from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { ImageCarousel } from './ImageCarousel';
import { ImageUploadOptionButton } from './ImageUploadOptionButton';

interface MobileImageUploadViewProps {
  images: File[];
  canUploadMore: boolean;
  handleFileSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  imageCounterText: React.ReactNode;
  emptyStateMessage: React.ReactNode;
}

export const MobileImageUploadView: React.FC<MobileImageUploadViewProps> = ({
  images,
  canUploadMore,
  handleFileSelection,
  onRemoveImage,
  imageCounterText,
  emptyStateMessage,
}) => {
  return (
    <div className="flex flex-grow flex-col items-center justify-center px-4 pt-4">
      <div className="mb-4 flex w-full flex-col items-center gap-4">
        <ImageUploadOptionButton
          id="take-photo-input-mobile"
          IconComponent={Camera}
          labelText="Tomar Foto"
          onChange={handleFileSelection}
          disabled={!canUploadMore}
          canUploadMore={canUploadMore}
          capture="environment"
          multiple
        />
        <ImageUploadOptionButton
          id="select-gallery-input-mobile"
          IconComponent={ImageIcon}
          labelText="Desde Galería"
          onChange={handleFileSelection}
          disabled={!canUploadMore}
          canUploadMore={canUploadMore}
          multiple
        />
      </div>
      {images.length > 0 && imageCounterText}
      {images.length > 0 ? (
        <ImageCarousel images={images} onRemove={onRemoveImage} />
      ) : (
        emptyStateMessage
      )}
    </div>
  );
};

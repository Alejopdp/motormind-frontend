import React from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { ImageCarousel } from './ImageCarousel';

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
        <label
          htmlFor="take-photo-input-mobile"
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
            id="take-photo-input-mobile" // Changed ID to avoid conflict if Desktop is ever in DOM simultaneously
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelection}
            className="hidden"
            disabled={!canUploadMore}
          />
        </label>
        <label
          htmlFor="select-gallery-input-mobile"
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
            id="select-gallery-input-mobile" // Changed ID
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
        <ImageCarousel images={images} onRemove={onRemoveImage} />
      ) : (
        emptyStateMessage
      )}
    </div>
  );
};

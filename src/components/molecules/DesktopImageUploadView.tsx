import React from 'react';
import { UploadCloud } from 'lucide-react';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';

interface DesktopImageUploadViewProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  isDragActive: boolean;
  canUploadMore: boolean;
  MAX_IMAGES: number;
  imageCounterText: React.ReactNode;
  images: File[]; // Solo para verificar .length para mostrar thumbs o emptyState
  thumbs: React.ReactNode; // Los thumbs renderizados se pasan como prop
  emptyStateMessage: React.ReactNode;
}

export const DesktopImageUploadView: React.FC<DesktopImageUploadViewProps> = ({
  getRootProps,
  getInputProps,
  isDragActive,
  canUploadMore,
  MAX_IMAGES,
  imageCounterText,
  images,
  thumbs,
  emptyStateMessage,
}) => {
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

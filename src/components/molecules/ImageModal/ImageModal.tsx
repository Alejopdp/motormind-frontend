import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageModalProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageModal = ({ images, initialIndex, isOpen, onClose }: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="bg-opacity-50 hover:bg-opacity-70 absolute top-4 right-4 z-10 cursor-pointer rounded-full bg-black p-2 text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Navegación izquierda */}
        {images.length > 1 && (
          <button
            onClick={goToPrevious}
            className="bg-opacity-50 hover:bg-opacity-70 absolute top-1/2 left-4 z-10 ml-1 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-1 text-white transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Navegación derecha */}
        {images.length > 1 && (
          <button
            onClick={goToNext}
            className="bg-opacity-50 hover:bg-opacity-70 absolute top-1/2 right-4 z-10 mr-1 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-1 text-white transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}

        {/* Imagen principal */}
        <div className="flex h-full w-full items-center justify-center p-4">
          <img
            src={currentImage}
            alt={`Imagen ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
            draggable={false}
          />
        </div>

        {/* Indicador de posición */}
        {images.length > 1 && (
          <div className="bg-opacity-50 absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black px-3 py-1 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

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
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: '50%', y: '50%' });

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
    setZoomOrigin({ x: '50%', y: '50%' });
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsZoomed(false);
            setZoomOrigin({ x: '50%', y: '50%' });
          }
          break;
        case 'ArrowRight':
          if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsZoomed(false);
            setZoomOrigin({ x: '50%', y: '50%' });
          }
          break;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isOpen) {
        e.preventDefault();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, currentIndex, images.length, onClose, isZoomed]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  const goToPrevious = () => {
    if (!isZoomed) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    }
  };

  const goToNext = () => {
    if (!isZoomed) {
      setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isZoomed) {
      // Calcular el punto de origen del zoom basado en el click
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      setZoomOrigin({ x: `${x}%`, y: `${y}%` });
      setIsZoomed(true);
    } else {
      setIsZoomed(false);
      setZoomOrigin({ x: '50%', y: '50%' });
    }
  };

  return (
    <div className="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className={`bg-opacity-50 hover:bg-opacity-70 absolute top-4 right-4 z-10 cursor-pointer rounded-full bg-black p-2 text-white transition-colors ${
            isZoomed ? 'border-2 border-white' : ''
          }`}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Navegación izquierda */}
        {images.length > 1 && !isZoomed && (
          <button
            onClick={goToPrevious}
            className="bg-opacity-50 hover:bg-opacity-70 absolute top-1/2 left-4 z-10 ml-1 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-1 text-white transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Navegación derecha */}
        {images.length > 1 && !isZoomed && (
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
            className={`max-h-full max-w-full rounded-lg border-2 border-white object-contain transition-transform duration-300 ${
              isZoomed ? 'scale-250' : 'scale-100'
            }`}
            style={{
              transformOrigin: `${zoomOrigin.x} ${zoomOrigin.y}`,
              cursor: isZoomed ? 'zoom-out' : 'zoom-in',
            }}
            draggable={false}
            onClick={handleImageClick}
          />
        </div>

        {/* Indicador de posición */}
        {images.length > 1 && !isZoomed && (
          <div className="bg-opacity-50 absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border-2 border-white bg-black px-3 py-1 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Indicador de instrucciones */}
        {!isZoomed && (
          <div className="bg-opacity-50 absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full border-2 border-white bg-black px-3 py-1 text-sm text-white">
            Haz click en una parte de la imagen para hacer zoom
          </div>
        )}

        {/* Indicador de zoom */}
        {isZoomed && (
          <div className="bg-opacity-50 absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border-2 border-white bg-black px-3 py-1 text-sm text-white">
            Zoom 250% - Click para salir
          </div>
        )}
      </div>
    </div>
  );
};

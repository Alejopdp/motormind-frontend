import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2 } from 'lucide-react';

// Definimos un tipo que puede ser File o string (URL)
export type CarouselImage = File | string;

interface ImageCarouselProps {
  images: CarouselImage[];
  onRemove?: (index: number) => void; // onRemove es ahora opcional
  initialIndex?: number;
  showDeleteButton?: boolean; // Nueva prop para controlar el botón de eliminar
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  onRemove, // Recibimos onRemove
  initialIndex = 0, // Usaremos initialIndex para el estado inicial de activeIndex
  showDeleteButton = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(
    initialIndex < images.length && initialIndex >= 0 ? initialIndex : 0,
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, images.length);
  }, [images]);

  // Efecto para actualizar activeIndex si initialIndex cambia y es válido
  useEffect(() => {
    if (initialIndex < images.length && initialIndex >= 0 && initialIndex !== activeIndex) {
      setActiveIndex(initialIndex);
      // Considerar scrollear aquí si es necesario, aunque puede ser complejo con scroll manual
      // if (scrollContainerRef.current && slideRefs.current[initialIndex]) {
      //   slideRefs.current[initialIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      // }
    }
  }, [initialIndex, images.length]); // No activeIndex para evitar loops con el observer

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const intersectingIndex = slideRefs.current.findIndex((ref) => ref === entry.target);
        if (intersectingIndex !== -1) {
          if (entry.intersectionRatio > 0.5) {
            setActiveIndex(intersectingIndex);
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: scrollContainerRef.current,
      rootMargin: '0px',
      threshold: [0.5, 0.75, 1.0],
    });

    const currentSlideRefs = slideRefs.current;
    currentSlideRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentSlideRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [images, observerCallback]);

  useEffect(() => {
    if (images.length === 0) {
      setActiveIndex(0);
    } else if (activeIndex >= images.length) {
      setActiveIndex(Math.max(0, images.length - 1));
    }
  }, [images.length, activeIndex]);

  if (images.length === 0) {
    return null;
  }

  const handleAttemptRemoveImage = (indexToRemove: number) => {
    if (onRemove && showDeleteButton) {
      // Solo llama a onRemove si está definido y el botón debe funcionar
      onRemove(indexToRemove);
    } else if (showDeleteButton) {
      // Si no hay onRemove pero el botón se muestra por error de lógica o testeo
      alert(
        `La eliminación de la imagen ${indexToRemove + 1} no está configurada para esta vista.`,
      );
    }
    // Si showDeleteButton es false, el botón no debería renderizarse ni llamarse esta función.
  };

  const getImageUrl = (image: CarouselImage): string => {
    if (typeof image === 'string') {
      return image;
    }
    return URL.createObjectURL(image);
  };

  return (
    <div className="relative mx-auto my-4 w-full">
      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto py-2"
        style={{ scrollPadding: '0 5%' }}
      >
        {images.map((image, index) => (
          <div
            key={typeof image === 'string' ? image : image.name + index}
            ref={(el: HTMLDivElement | null) => {
              slideRefs.current[index] = el;
            }}
            className="relative mr-3 aspect-[4/3] w-[85%] max-w-[400px] flex-shrink-0 snap-center snap-always rounded-lg bg-gray-200 shadow-lg first:ml-[7.5%] last:mr-[7.5%] md:w-[70%] md:max-w-[500px]"
          >
            <img
              src={getImageUrl(image)}
              alt={`preview-${index}`}
              className="h-full w-full rounded-lg object-cover"
              onLoad={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.startsWith('blob:')) {
                  URL.revokeObjectURL(target.src);
                }
              }}
            />
            {showDeleteButton && (
              <button
                onClick={() => handleAttemptRemoveImage(index)}
                className="absolute top-2 right-2 z-20 rounded-full bg-red-600 p-2 text-white shadow-md transition-colors hover:bg-red-700"
                aria-label={`Eliminar imagen ${index + 1}`}
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
      </div>
      {images.length > 0 && (
        <div className="mt-3 text-center">
          <span className="text-base font-medium text-gray-800">
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      )}
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
              display: none;
          }
          .no-scrollbar {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>
    </div>
  );
};

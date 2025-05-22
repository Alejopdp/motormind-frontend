import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2 } from 'lucide-react';

interface ImageCarouselProps {
  images: File[];
  onRemove: (index: number) => void;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, onRemove }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, images.length);
  }, [images]);

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

    const currentRefs = slideRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
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

  const handleRemoveImage = (indexToRemove: number) => {
    onRemove(indexToRemove);
  };

  return (
    <div className="relative mx-auto my-4 w-full">
      <div
        ref={scrollContainerRef}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto py-2"
        style={{ scrollPadding: '0 5%' }}
      >
        {images.map((file, index) => (
          <div
            key={file.name + index}
            ref={(el: HTMLDivElement | null) => {
              slideRefs.current[index] = el;
            }}
            className="relative mr-3 aspect-[4/3] w-[85%] max-w-[400px] flex-shrink-0 snap-center snap-always rounded-lg bg-gray-200 shadow-lg first:ml-[7.5%] last:mr-[7.5%] md:w-[70%] md:max-w-[500px]"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`preview-${index}`}
              className="h-full w-full rounded-lg object-contain"
              onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 z-20 rounded-full bg-red-600 p-2 text-white shadow-md transition-colors hover:bg-red-700"
              aria-label={`Eliminar imagen ${index + 1}`}
            >
              <Trash2 size={20} />
            </button>
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

import React from 'react';
import { useWorkshop } from '@/context/Workshop.context';
import { Badge } from '@/components/atoms/Badge';

interface WorkshopPricingProps {
  showMechanics?: boolean;
  showBodywork?: boolean;
  compact?: boolean;
}

/**
 * Componente que muestra los precios del taller usando el WorkshopContext
 * Ejemplo de cómo usar el contexto en diferentes partes de la aplicación
 */
export const WorkshopPricing: React.FC<WorkshopPricingProps> = ({
  showMechanics = true,
  showBodywork = true,
  compact = false,
}) => {
  const { workshop, isLoading, error } = useWorkshop();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 w-32 rounded bg-gray-200"></div>
        <div className="h-4 w-24 rounded bg-gray-200"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-600">Error al cargar precios del taller</div>;
  }

  if (!workshop) {
    return <div className="text-sm text-gray-500">No hay información del taller disponible</div>;
  }

  const formatPrice = (price?: number) => {
    if (!price) return 'No configurado';
    return `€${price}/h`;
  };

  if (compact) {
    return (
      <div className="flex gap-2">
        {showMechanics && (
          <Badge variant="secondary">Mecánica: {formatPrice(workshop.pricePerHour)}</Badge>
        )}
        {showBodywork && (
          <Badge variant="secondary">Carrocería: {formatPrice(workshop.bodyworkHourlyRate)}</Badge>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">Precios del Taller</h3>
      <div className="space-y-1">
        {showMechanics && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Mecánica:</span>
            <span className="font-medium">{formatPrice(workshop.pricePerHour)}</span>
          </div>
        )}
        {showBodywork && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Carrocería:</span>
            <span className="font-medium">{formatPrice(workshop.bodyworkHourlyRate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

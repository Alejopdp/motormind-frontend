import { useState } from 'react';
import { ImageRemoveButton } from '../components/ImageRemoveButton';

/**
 * Ejemplo para testear el componente ImageRemoveButton
 * Demuestra todos los estados y variantes del botón
 */
export const ImageRemoveButtonExample = () => {
  const [clickCount, setClickCount] = useState(0);

  const handleRemove = () => {
    setClickCount(prev => prev + 1);
    console.log('Remove button clicked!');
  };

  return (
    <div className="p-8 space-y-8 bg-background">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-4">
          ImageRemoveButton - Ejemplos
        </h1>
        <p className="text-muted-foreground">
          Componente de botón eliminar con paridad 1:1 al repo de diseño
        </p>
      </div>

      {/* Ejemplo básico con imagen simulada */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Ejemplo Básico</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
          <div className="group relative cursor-pointer">
            <div className="border-border h-24 w-full rounded-lg border bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Imagen Mock</span>
            </div>
            <ImageRemoveButton
              onRemove={handleRemove}
              label="Eliminar imagen de ejemplo"
            />
            <p className="text-muted-foreground mt-1 truncate text-xs">ejemplo.jpg</p>
          </div>

          <div className="group relative cursor-pointer">
            <div className="border-border h-24 w-full rounded-lg border bg-muted flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Otra Imagen</span>
            </div>
            <ImageRemoveButton
              onRemove={handleRemove}
              label="Eliminar segunda imagen"
            />
            <p className="text-muted-foreground mt-1 truncate text-xs">ejemplo-2.jpg</p>
          </div>
        </div>
      </div>

      {/* Ejemplo con variantes de tamaño */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Variantes de Tamaño</h2>
        <div className="flex items-center gap-4">
          <div className="group relative">
            <div className="border-border h-16 w-16 rounded-lg border bg-muted flex items-center justify-center">
              <span className="text-xs">Small</span>
            </div>
            <ImageRemoveButton
              onRemove={handleRemove}
              className="h-5 w-5 text-xs"
            />
          </div>

          <div className="group relative">
            <div className="border-border h-24 w-24 rounded-lg border bg-muted flex items-center justify-center">
              <span className="text-xs">Normal</span>
            </div>
            <ImageRemoveButton onRemove={handleRemove} />
          </div>

          <div className="group relative">
            <div className="border-border h-32 w-32 rounded-lg border bg-muted flex items-center justify-center">
              <span className="text-xs">Large</span>
            </div>
            <ImageRemoveButton
              onRemove={handleRemove}
              className="h-8 w-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-card-foreground mb-3">
          Debug Info
        </h3>
        <div className="text-xs space-y-1 text-muted-foreground">
          <p>• <strong>Clicks:</strong> {clickCount}</p>
          <p>• <strong>Hover:</strong> Funciona en todos los containers .group</p>
          <p>• <strong>Estados:</strong> opacity-0 → group-hover:opacity-100</p>
          <p>• <strong>Colores:</strong> bg-destructive + text-destructive-foreground</p>
          <p>• <strong>Posición:</strong> absolute -top-2 -right-2</p>
          <p>• <strong>Accesibilidad:</strong> aria-label personalizable</p>
        </div>
      </div>

      {/* Spec Técnica */}
      <div className="bg-primary-muted/20 border border-primary-muted rounded-lg p-4">
        <h3 className="text-sm font-medium text-primary mb-3">
          Especificación Técnica
        </h3>
        <div className="text-xs space-y-1 text-primary/80">
          <p>• <strong>Tamaño por defecto:</strong> h-6 w-6 rounded-full</p>
          <p>• <strong>Símbolo:</strong> × (multiply symbol)</p>
          <p>• <strong>Transición:</strong> transition-opacity</p>
          <p>• <strong>Cursor:</strong> cursor-pointer</p>
          <p>• <strong>Z-index:</strong> Por encima de la imagen (stacking context)</p>
          <p>• <strong>Customizable:</strong> className prop para overrides</p>
        </div>
      </div>
    </div>
  );
};

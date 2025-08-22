import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Damage } from '../types';

interface DamageCardProps {
  damage: Damage;
  onStatusChange: (id: string, status: 'confirmed' | 'rejected') => void;
  className?: string;
}

/**
 * DamageCard - Paridad 1:1 con repo de diseño
 *
 * Estados:
 * - pending: border-border hover:border-primary + "Toca para confirmar"
 * - confirmed: border-success bg-success-muted/30 + CheckCircle2 verde
 * - rejected: border-border bg-muted grayscale opacity-70 + XCircle rojo
 *
 * Estructura:
 * - Imagen cover: h-48 rounded-t-lg + confidence badge
 * - Content: p-4 space-y-3 + zone + type + severity badge
 * - Interactions: hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
 */

const severityColors = {
  leve: 'text-success border-success-muted bg-success-muted',
  medio: 'text-warning border-warning-muted bg-warning-muted',
  grave: 'text-destructive border-destructive bg-destructive/10',
};

const confidenceColor = (confidence: number): string => {
  const confidencePercent = confidence * 100;
  if (confidencePercent >= 90) return 'bg-success text-success-foreground';
  if (confidencePercent >= 80) return 'bg-warning text-warning-foreground';
  return 'bg-muted text-muted-foreground';
};

export const DamageCard = ({ damage, onStatusChange, className }: DamageCardProps) => {
  const isConfirmed = damage.status === 'confirmed';
  const isRejected = damage.status === 'rejected';
  const isPending = damage.status === 'pending';

  // ✅ NUEVO: obtener ROI de la primera evidencia
  const primaryEvidence = damage.evidences?.[0];
  const roi = primaryEvidence?.roi;

  const handleClick = () => {
    if (isConfirmed) {
      onStatusChange(damage.id, 'rejected');
    } else {
      onStatusChange(damage.id, 'confirmed');
    }
  };

  return (
    <div
      className={cn(
        'bg-card relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
        {
          'border-success bg-success-muted/30': isConfirmed,
          'border-border bg-muted opacity-70 grayscale': isRejected,
          'border-border hover:border-primary': isPending,
        },
        className,
      )}
      onClick={handleClick}
    >
      {/* Status Icon */}
      <div className="absolute top-3 right-3 z-10">
        {isConfirmed && (
          <CheckCircle2 className="text-success bg-success-foreground h-6 w-6 rounded-full" />
        )}
        {isRejected && (
          <XCircle className="text-destructive bg-destructive-foreground h-6 w-6 rounded-full" />
        )}
      </div>

      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <img
          src={damage.imageUrl}
          alt={`Daño en ${damage.zone}`}
          className="h-full w-full object-cover"
        />

        {/* ✅ NUEVO: ROI Overlay */}
        {roi && roi.type === 'bbox' && (
          <div
            className="pointer-events-none absolute rounded-sm border-2 border-red-500 bg-red-500/20"
            style={{
              left: `${roi.x * 100}%`,
              top: `${roi.y * 100}%`,
              width: `${roi.w * 100}%`,
              height: `${roi.h * 100}%`,
            }}
            title="Área del daño detectado"
          />
        )}

        {/* Confidence Badge */}
        <div
          className={cn(
            'absolute bottom-2 left-2 rounded-md px-2 py-1 text-xs font-semibold',
            confidenceColor(damage.confidence),
          )}
        >
          {(damage.confidence * 100).toFixed(1)}% seguro
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        {/* Zone and Subzone */}
        <div>
          <h3 className="text-card-foreground font-semibold">{damage.zone}</h3>
          {damage.subzone && <p className="text-muted text-sm">{damage.subzone}</p>}
        </div>

        {/* Damage Type */}
        <p className="text-card-foreground text-sm font-medium">{damage.type}</p>

        {/* Severity Badge */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span
            className={cn(
              'rounded-md border px-2 py-1 text-xs font-medium',
              severityColors[damage.severity],
            )}
          >
            {damage.severity.charAt(0).toUpperCase() + damage.severity.slice(1)}
          </span>
        </div>
      </div>

      {/* Action Hint */}
      {isPending && (
        <div className="text-muted absolute right-2 bottom-2 text-xs">Toca para confirmar</div>
      )}
    </div>
  );
};

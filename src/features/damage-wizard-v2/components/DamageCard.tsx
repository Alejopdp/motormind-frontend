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
  grave: 'text-destructive border-destructive bg-destructive/10'
};

const confidenceColor = (confidence: number): string => {
  if (confidence >= 90) return 'bg-success text-success-foreground';
  if (confidence >= 80) return 'bg-warning text-warning-foreground';
  return 'bg-muted text-muted-foreground';
};

export const DamageCard = ({ damage, onStatusChange, className }: DamageCardProps) => {
  const isConfirmed = damage.status === 'confirmed';
  const isRejected = damage.status === 'rejected';
  const isPending = damage.status === 'pending';
  
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
        'relative bg-card rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]',
        {
          'border-success bg-success-muted/30': isConfirmed,
          'border-border bg-muted grayscale opacity-70': isRejected,
          'border-border hover:border-primary': isPending,
        },
        className
      )}
      onClick={handleClick}
    >
      {/* Status Icon */}
      <div className="absolute top-3 right-3 z-10">
        {isConfirmed && (
          <CheckCircle2 className="h-6 w-6 text-success bg-success-foreground rounded-full" />
        )}
        {isRejected && (
          <XCircle className="h-6 w-6 text-destructive bg-destructive-foreground rounded-full" />
        )}
      </div>

      {/* Image */}
      <div className="relative h-48 rounded-t-lg overflow-hidden">
        <img 
          src={damage.imageUrl} 
          alt={`Daño en ${damage.zone}`}
          className="w-full h-full object-cover"
        />
        
        {/* Confidence Badge */}
        <div className={cn(
          'absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs font-semibold',
          confidenceColor(damage.confidence)
        )}>
          {damage.confidence}% seguro
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Zone and Subzone */}
        <div>
          <h3 className="font-semibold text-card-foreground">{damage.zone}</h3>
          {damage.subzone && (
            <p className="text-sm text-muted-foreground">{damage.subzone}</p>
          )}
        </div>

        {/* Damage Type */}
        <p className="text-sm font-medium text-card-foreground">{damage.type}</p>

        {/* Severity Badge */}
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span className={cn(
            'px-2 py-1 rounded-md text-xs font-medium border',
            severityColors[damage.severity]
          )}>
            {damage.severity.charAt(0).toUpperCase() + damage.severity.slice(1)}
          </span>
        </div>
      </div>

      {/* Action Hint */}
      {isPending && (
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          Toca para confirmar
        </div>
      )}
    </div>
  );
};
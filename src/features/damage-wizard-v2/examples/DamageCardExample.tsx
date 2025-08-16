import { useState } from 'react';
import { DamageCard } from '../components/DamageCard';
import { Damage } from '../types';

/**
 * Ejemplo completo de DamageCard con paridad 1:1 al repo de diseño
 * Demuestra todos los estados, severidades y niveles de confianza
 */
export const DamageCardExample = () => {
  const [damages, setDamages] = useState<Damage[]>([
    {
      id: 'dmg-1',
      zone: 'Puerta delantera izquierda',
      subzone: 'Panel exterior',
      type: 'Rayado profundo',
      severity: 'medio',
      confidence: 95,
      imageUrl: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?w=400&h=300&fit=crop',
      status: 'pending'
    },
    {
      id: 'dmg-2',
      zone: 'Paragolpes trasero',
      type: 'Abolladuras múltiples',
      severity: 'grave',
      confidence: 88,
      imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop',
      status: 'confirmed'
    },
    {
      id: 'dmg-3',
      zone: 'Retrovisor derecho',
      subzone: 'Carcasa',
      type: 'Rayado ligero',
      severity: 'leve',
      confidence: 72,
      imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
      status: 'rejected'
    },
    {
      id: 'dmg-4',
      zone: 'Capó',
      type: 'Impacto de granizo',
      severity: 'leve',
      confidence: 91,
      imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
      status: 'pending'
    },
    {
      id: 'dmg-5',
      zone: 'Puerta trasera derecha',
      subzone: 'Panel lateral',
      type: 'Abolladura grande',
      severity: 'grave',
      confidence: 93,
      imageUrl: 'https://images.unsplash.com/photo-1592853625511-ad0abcc69a1d?w=400&h=300&fit=crop',
      status: 'confirmed'
    },
    {
      id: 'dmg-6',
      zone: 'Guardabarros delantero',
      type: 'Rayado superficial',
      severity: 'medio',
      confidence: 76,
      imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
      status: 'pending'
    }
  ]);

  const handleStatusChange = (id: string, status: 'confirmed' | 'rejected') => {
    setDamages(prev => 
      prev.map(damage => 
        damage.id === id ? { ...damage, status } : damage
      )
    );
    console.log(`Damage ${id} changed to ${status}`);
  };

  const getStatusCounts = () => {
    const counts = damages.reduce(
      (acc, damage) => {
        acc[damage.status]++;
        return acc;
      },
      { pending: 0, confirmed: 0, rejected: 0 }
    );
    return counts;
  };

  const getSeverityCounts = () => {
    const counts = damages.reduce(
      (acc, damage) => {
        acc[damage.severity]++;
        return acc;
      },
      { leve: 0, medio: 0, grave: 0 }
    );
    return counts;
  };

  const statusCounts = getStatusCounts();
  const severityCounts = getSeverityCounts();

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-4">
          DamageCard - Paridad 1:1 
        </h1>
        <p className="text-muted-foreground">
          Componente de tarjeta de daño con todos los estados interactivos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{statusCounts.pending}</div>
          <div className="text-xs text-muted-foreground">Pendientes</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">{statusCounts.confirmed}</div>
          <div className="text-xs text-muted-foreground">Confirmados</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-destructive">{statusCounts.rejected}</div>
          <div className="text-xs text-muted-foreground">Rechazados</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-card-foreground">{damages.length}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
      </div>

      {/* Damages Grid */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Grid de Daños - Estados Interactivos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {damages.map((damage) => (
            <DamageCard
              key={damage.id}
              damage={damage}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>

      {/* Demo Controls */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Controles de Testing
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDamages(prev => prev.map(d => ({ ...d, status: 'pending' as const })))}
            className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-sm"
          >
            Todos Pendientes
          </button>
          <button
            onClick={() => setDamages(prev => prev.map(d => ({ ...d, status: 'confirmed' as const })))}
            className="px-3 py-1 bg-success/10 text-success border border-success/20 rounded text-sm"
          >
            Todos Confirmados
          </button>
          <button
            onClick={() => setDamages(prev => prev.map(d => ({ ...d, status: 'rejected' as const })))}
            className="px-3 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded text-sm"
          >
            Todos Rechazados
          </button>
        </div>
      </div>

      {/* Technical Spec */}
      <div className="bg-primary-muted/20 border border-primary-muted rounded-lg p-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
          Especificación Técnica - Paridad 1:1
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-primary mb-2">Estados (3/3)</h4>
            <div className="text-sm space-y-1 text-primary/80">
              <p>• <strong>pending:</strong> border-border hover:border-primary + hint</p>
              <p>• <strong>confirmed:</strong> border-success bg-success-muted/30 + CheckCircle2</p>
              <p>• <strong>rejected:</strong> border-border bg-muted grayscale opacity-70 + XCircle</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-primary mb-2">Severidades (3/3)</h4>
            <div className="text-sm space-y-1 text-primary/80">
              <p>• <strong>leve:</strong> text-success border-success-muted ({severityCounts.leve})</p>
              <p>• <strong>medio:</strong> text-warning border-warning-muted ({severityCounts.medio})</p>
              <p>• <strong>grave:</strong> text-destructive border-destructive ({severityCounts.grave})</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-primary mb-2">Confidence Badges</h4>
            <div className="text-sm space-y-1 text-primary/80">
              <p>• <strong>≥90%:</strong> bg-success text-success-foreground</p>
              <p>• <strong>≥80%:</strong> bg-warning text-warning-foreground</p>
              <p>• <strong>&lt;80%:</strong> bg-muted text-muted-foreground</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-primary mb-2">Interacciones</h4>
            <div className="text-sm space-y-1 text-primary/80">
              <p>• <strong>Hover:</strong> shadow-lg + scale-[1.02]</p>
              <p>• <strong>Active:</strong> scale-[0.98]</p>
              <p>• <strong>Click:</strong> Cambia estado (pending ↔ confirmed)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

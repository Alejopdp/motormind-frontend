# DamageSparePartsTable

Componente extraído del `DamageCard` que maneja la tabla de piezas de recambio de un daño específico.

## Características

- ✅ **Sin props drilling** - Usa el contexto `DamageAssessmentDetail` directamente
- ✅ **Modo visualización y edición** - Controlado por la prop `isEditing`
- ✅ **CRUD completo** - Crear, leer, actualizar y eliminar spare parts
- ✅ **Cálculo automático** - Total de recambios calculado automáticamente
- ✅ **Estados vacíos** - Maneja graciosamente cuando no hay piezas
- ✅ **Validaciones** - Campos numéricos con validaciones mínimas

## Props

```typescript
interface DamageSparePartsTableProps {
  damageId: string; // ID del daño para obtener los datos del contexto
  isEditing?: boolean; // Controla si la tabla está en modo edición
}
```

## Uso

```tsx
import { DamageSparePartsTable } from '@/components/molecules/DamageSparePartsTable';

// Modo visualización (solo lectura)
<DamageSparePartsTable damageId="damage-123" />

// Modo edición
<DamageSparePartsTable damageId="damage-123" isEditing={true} />
```

## Dependencias del Contexto

Este componente **requiere** que esté envuelto en el `DamageAssessmentProvider` y usa:

- `getDamageById(damageId)` - Para obtener los datos del daño
- `updateDamage(damageId, partialData)` - Para actualizar las spare parts

## Ejemplo de Uso Completo

```tsx
import { DamageAssessmentProvider } from '@/context/DamageAssessment.context';
import { DamageSparePartsTable } from '@/components/molecules/DamageSparePartsTable';

function DamageDetail({ damageAssessmentId }) {
  return (
    <DamageAssessmentProvider>
      <div>
        <h2>Piezas de Recambio</h2>
        <DamageSparePartsTable damageId="damage-123" isEditing={true} />
      </div>
    </DamageAssessmentProvider>
  );
}
```

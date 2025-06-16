# DamageAdditionalActionsTable

Componente extraído del `DamageCard` que maneja la tabla de suplementos/operaciones adicionales de un daño específico.

## Características

- ✅ **Sin props drilling** - Usa el contexto `DamageAssessmentDetail` directamente
- ✅ **Modo visualización y edición** - Controlado por la prop `isEditing`
- ✅ **CRUD completo** - Crear, leer, actualizar y eliminar additional actions
- ✅ **Gestión de tiempo** - Tiempo en minutos para cada operación
- ✅ **Estados vacíos** - Maneja graciosamente cuando no hay suplementos
- ✅ **Validaciones** - Campos numéricos con validaciones mínimas

## Props

```typescript
interface DamageAdditionalActionsTableProps {
  damageId: string; // ID del daño para obtener los datos del contexto
  isEditing?: boolean; // Controla si la tabla está en modo edición
}
```

## Uso

```tsx
import { DamageAdditionalActionsTable } from '@/components/molecules/DamageAdditionalActionsTable';

// Modo visualización (solo lectura)
<DamageAdditionalActionsTable damageId="damage-123" />

// Modo edición
<DamageAdditionalActionsTable damageId="damage-123" isEditing={true} />
```

## Dependencias del Contexto

Este componente **requiere** que esté envuelto en el `DamageAssessmentProvider` y usa:

- `getDamageById(damageId)` - Para obtener los datos del daño
- `updateDamage(damageId, partialData)` - Para actualizar las additional actions

## Funcionalidades

### Modo Visualización (`isEditing = false`)

- Muestra todos los suplementos/operaciones adicionales en una tabla
- Tiempo mostrado en formato "X min"
- Estado vacío si no hay operaciones definidas

### Modo Edición (`isEditing = true`)

- Permite editar descripción y tiempo en minutos
- Botón "Añadir Suplemento" para agregar nuevas operaciones
- Botón de eliminar (X) en cada fila
- Estado vacío con mensaje para agregar la primera operación
- Validaciones en campo de tiempo (números >= 0)

## Estados

### Daño no encontrado

```tsx
<div className="py-4 text-center text-sm text-gray-500">Daño no encontrado</div>
```

### Sin operaciones (modo visualización)

```tsx
<div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
  <p className="text-center text-sm italic text-gray-500">
    No hay suplementos u operaciones adicionales definidas
  </p>
</div>
```

### Sin operaciones (modo edición)

```tsx
<div className="rounded-lg border border-gray-200 bg-white p-8">
  <p className="text-center text-sm italic text-gray-500">
    Todavía no has añadido ningún suplemento u operación adicional
  </p>
</div>
```

## Columnas de la Tabla

| Columna     | Ancho | Tipo    | Editable | Descripción                |
| ----------- | ----- | ------- | -------- | -------------------------- |
| Descripción | 70%   | Texto   | ✅       | Descripción del suplemento |
| Tiempo      | 20%   | Número  | ✅       | Tiempo en minutos (mín: 0) |
| Acciones    | 10%   | Botones | ❌       | Eliminar (solo en edición) |

## Integración con el Contexto

```typescript
// El componente usa estos métodos del contexto:
const { getDamageById, updateDamage } = useDamageAssessmentDetail();

// Para obtener el daño:
const damage = getDamageById(damageId);

// Para actualizar las additional actions:
updateDamage(damageId, { additionalActions: updatedActions });
```

## Ejemplo de Uso Completo

```tsx
import { DamageAssessmentProvider } from '@/context/DamageAssessment.context';
import { DamageAdditionalActionsTable } from '@/components/molecules/DamageAdditionalActionsTable';

function DamageDetail({ damageAssessmentId }) {
  return (
    <DamageAssessmentProvider>
      <div>
        <h2>Suplementos y Operaciones Adicionales</h2>
        <DamageAdditionalActionsTable damageId="damage-123" isEditing={true} />
      </div>
    </DamageAssessmentProvider>
  );
}
```

## Comparación con DamageSparePartsTable

| Característica        | SparePartsTable                           | AdditionalActionsTable |
| --------------------- | ----------------------------------------- | ---------------------- |
| **Datos principales** | Descripción, Referencia, Cantidad, Precio | Descripción, Tiempo    |
| **Cálculos**          | Total en €                                | No aplica              |
| **Complejidad**       | 5 columnas editables                      | 2 columnas editables   |
| **Validaciones**      | Cantidad ≥ 1, Precio ≥ 0                  | Tiempo ≥ 0             |
| **Formato**           | Moneda española                           | Minutos                |

## Mejoras de Performance

- **Updates optimizados**: Solo actualiza el daño específico en el contexto
- **Rendering condicional**: Diferentes renders para modos de visualización/edición
- **Validaciones inmediatas**: Feedback en tiempo real para campos numéricos

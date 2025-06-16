# Contexto DamageAssessment Refactorizado

## Overview

El contexto `DamageAssessment` ha sido refactorizado para soportar tanto el **flujo de creación** (como estaba antes) como el **flujo de visualización/edición del detalle** de un peritaje de daños.

## Funcionalidades

### ✅ Compatibilidad hacia atrás

- Mantiene la API original para el flujo de creación
- No se rompe ningún código existente

### 🆕 Nuevas funcionalidades

- **Carga automática** del DamageAssessment por ID
- **Estados de loading** y error management
- **Lógica de edición centralizada** para damages
- **Prevención de props drilling**
- **Hooks especializados** para diferentes casos de uso

## Estructura del Estado

```typescript
interface DamageAssessmentContextState {
  // Estados de carga y datos
  isLoading: boolean;
  damageAssessment: DamageAssessment | null;
  error: string | null;

  // Datos para creación (compatibilidad hacia atrás)
  creationData: {
    images: File[];
    details: string;
  };

  // Estado de edición
  editingDamageId: string | null;
  isUpdating: boolean;
}
```

## Hooks Disponibles

### 1. `useDamageAssessment()` - Hook principal

Expone toda la funcionalidad del contexto.

```typescript
const {
  state,
  setImages,
  setDetails,
  reset, // Métodos de creación
  loadDamageAssessment,
  refreshDamageAssessment,
  updateDamage,
  deleteDamage,
  startEditingDamage,
  stopEditingDamage,
  getDamageById,
  isEditingDamage,
} = useDamageAssessment();
```

### 2. `useDamageAssessmentCreation()` - Compatibilidad

Hook para mantener la API original del flujo de creación.

```typescript
const { data, setImages, setDetails, reset } = useDamageAssessmentCreation();
// Funciona exactamente igual que antes
```

### 3. `useDamageAssessmentDetail()` - Para detalles

Hook especializado para el manejo del DamageAssessment completo.

```typescript
const {
  damageAssessment,
  isLoading,
  error,
  isUpdating,
  loadDamageAssessment,
  updateDamage,
  deleteDamage,
  editingDamageId,
  startEditingDamage,
  // ... más métodos
} = useDamageAssessmentDetail();
```

### 4. `useDamageAssessmentDetailPage()` - Para páginas

Hook que combina el contexto con `useParams` para carga automática.

```typescript
const {
  damageAssessment,
  isLoading,
  damages,
  confirmedDamages,
  pendingDamages,
  isEditable,
  updateDamage,
  deleteDamage,
  // ... datos procesados
} = useDamageAssessmentDetailPage();
```

## Casos de Uso

### 1. Flujo de Creación (Sin cambios)

```typescript
// ✅ Funciona igual que antes
function CreateDamageAssessment() {
  const { data, setImages, setDetails, reset } = useDamageAssessmentCreation();

  return (
    <div>
      <input onChange={(e) => setImages(Array.from(e.target.files))} />
      <textarea onChange={(e) => setDetails(e.target.value)} />
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### 2. Página de Detalle (Nuevo)

```typescript
function DamageAssessmentDetail() {
  const {
    damageAssessment,
    isLoading,
    damages,
    isEditable,
    updateDamage,
    deleteDamage
  } = useDamageAssessmentDetailPage(); // 🔥 Carga automática por URL

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1>{damageAssessment?.description}</h1>
      {damages.map(damage => (
        <DamageCard
          key={damage._id}
          damage={damage}
          onUpdateDamage={(updated) => updateDamage(damage._id!, updated)}
          onDeleteDamage={deleteDamage}
          isEditable={isEditable}
        />
      ))}
    </div>
  );
}
```

### 3. Componente que necesita acceso al DamageAssessment

```typescript
function DamageSparePartsTable({ damageId }: { damageId: string }) {
  const { getDamageById, updateDamage, isEditingDamage } = useDamageAssessmentDetail();

  const damage = getDamageById(damageId);
  const isEditing = isEditingDamage(damageId);

  if (!damage) return null;

  return (
    <Table>
      {damage.spareParts?.map(part => (
        <TableRow key={part.reference}>
          {isEditing ? (
            <EditableSparePartRow
              part={part}
              onUpdate={(updatedPart) => {
                const updatedSpareParts = damage.spareParts?.map(p =>
                  p.reference === part.reference ? updatedPart : p
                );
                updateDamage(damageId, { spareParts: updatedSpareParts });
              }}
            />
          ) : (
            <ReadOnlySparePartRow part={part} />
          )}
        </TableRow>
      ))}
    </Table>
  );
}
```

## Setup del Provider

El provider debe envolver las rutas que necesiten acceso al contexto:

```typescript
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DamageAssessmentProvider>
        <Routes>
          <Route path="/damage-assessments/:damageAssessmentId" element={<DamageAssessmentDetail />} />
          <Route path="/create-damage-assessment" element={<CreateDamageAssessment />} />
        </Routes>
      </DamageAssessmentProvider>
    </QueryClientProvider>
  );
}
```

## Beneficios de la Refactorización

### 🚀 Performance

- **Carga automática**: No más useEffect duplicados en componentes
- **Cache inteligente**: No recarga si ya tiene el assessment correcto
- **Invalidación automática**: Actualiza automáticamente las queries de React Query

### 🔧 Mantenibilidad

- **Lógica centralizada**: Toda la lógica de CRUD en un solo lugar
- **Estado unificado**: Un solo source of truth para el DamageAssessment
- **Tipado completo**: TypeScript en todos los niveles

### 📦 Escalabilidad

- **Sin props drilling**: Los componentes pueden acceder directamente al contexto
- **Componentes especializados**: Fácil extraer DamageSparePartsTable, DamageAdditionalActionsTable
- **Hooks reutilizables**: Diferentes hooks para diferentes necesidades

### 🛡️ Robustez

- **Manejo de errores**: Centralizado y consistente
- **Estados de loading**: Feedback visual automático
- **Validaciones**: Verifica que el contexto se use correctamente

## Próximos Pasos

1. **Migrar DamageAssessmentDetail.tsx** para usar el nuevo hook
2. **Extraer DamageSparePartsTable** como componente independiente
3. **Extraer DamageAdditionalActionsTable** como componente independiente
4. **Optimizar DamageCard** removiendo lógica que ahora está en el contexto
5. **Agregar tests** para los nuevos hooks y contexto

## Ejemplo de Migración

### Antes (DamageAssessmentDetail.tsx actual)

```typescript
// ❌ Mucha lógica duplicada, props drilling
const { data: damageAssessment, isLoading } = useQuery(...);
const { mutate: updateDamage } = useMutation(...);
const { mutate: deleteDamage } = useMutation(...);

return (
  <DamageCard
    damage={damage}
    onUpdateDamage={handleUpdate} // Props drilling
    onDeleteDamage={handleDelete} // Props drilling
  />
);
```

### Después (con el nuevo contexto)

```typescript
// ✅ Limpio, sin props drilling, lógica centralizada
const {
  damageAssessment,
  isLoading,
  damages,
  isEditable
} = useDamageAssessmentDetailPage();

return (
  <DamageCard
    damage={damage}
    isEditable={isEditable}
    // No más props drilling - DamageCard usa el contexto internamente
  />
);
```

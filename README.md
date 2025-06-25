# MotorMind Frontend

Aplicación frontend React para el sistema de gestión de talleres y peritajes de daños MotorMind.

## 🚀 Tecnologías Principales

### Framework y Build

- [React 18](https://reactjs.org/) - Biblioteca para interfaces de usuario
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript
- [Vite](https://vitejs.dev/) - Build tool y servidor de desarrollo rápido

### UI y Estilos

- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [Headless UI](https://headlessui.dev/) - Componentes UI sin estilos
- [Lucide React](https://lucide.dev/) - Iconografía moderna

### Estado y Datos

- [React Query](https://tanstack.com/query) - Gestión de estado servidor
- [React Context](https://reactjs.org/docs/context.html) - Estado global de la aplicación
- [React Hook Form](https://react-hook-form.com/) - Gestión de formularios

### Routing y Navegación

- [React Router v6](https://reactrouter.com/) - Routing declarativo para React

## 📁 Estructura del Proyecto

```
src/
├── components/             # Componentes reutilizables
│   ├── atoms/             # Componentes básicos
│   ├── molecules/         # Componentes compuestos
│   └── organisms/         # Componentes complejos
├── pages/                 # Páginas de la aplicación
├── context/               # Contextos React para estado global
├── hooks/                 # Custom hooks
├── services/              # Servicios API
├── types/                 # Definiciones TypeScript
├── utils/                 # Utilidades y helpers
└── constants/             # Constantes de la aplicación
```

## 🔧 Configuración Inicial

### Requisitos Previos

- Node.js >= 16.x
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone [repository-url]
cd motormind-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno

```env
# API Backend
VITE_API_BASE_URL=http://localhost:3000

# Configuraciones de entorno
VITE_ENVIRONMENT=development
```

## 🚀 Comandos de Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview

# Linting
npm run lint

# Linting con corrección automática
npm run lint:fix
```

## 🧩 Arquitectura de Componentes

### Sistema de Diseño Atómico

#### Atoms (Componentes Básicos)

- **Avatar**: Imagen de perfil de usuario
- **Badge**: Etiquetas y estados
- **BodyText**: Texto del cuerpo
- **Button**: Botones con variantes
- **Calendar**: Selector de fechas
- **Dialog**: Modales y diálogos
- **Dropdown**: Menús desplegables
- **Input**: Campos de entrada
- **Select**: Selectores
- **Spinner**: Indicadores de carga
- **Table**: Tablas de datos
- **Tabs**: Navegación por pestañas
- **Textarea**: Campos de texto extenso

#### Molecules (Componentes Compuestos)

- **CostBreakdown**: Desglose de costos
- **DamageCard**: Tarjeta de daño individual
- **DiagnosticListItem**: Item de lista de diagnósticos
- **HeaderPage**: Encabezado de páginas
- **ImageCarousel**: Carousel de imágenes
- **MetricsSection**: Sección de métricas
- **Pagination**: Navegación de páginas
- **PromptCard**: Tarjeta de prompt de IA
- **RateDiagnosis**: Sistema de valoración

## 📊 Contextos y Estado Global

### DamageAssessmentContext

Contexto principal para gestión de peritajes de daños que soporta tanto flujo de creación como visualización/edición.

**Características:**

- ✅ **Compatibilidad hacia atrás** - Mantiene la API original
- 🆕 **Carga automática** del DamageAssessment por ID
- 🔄 **Estados de loading** y manejo de errores
- 🎯 **Lógica de edición centralizada** para damages
- 🚫 **Prevención de props drilling**

#### Hooks Disponibles

##### `useDamageAssessment()` - Hook Principal

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

##### `useDamageAssessmentCreation()` - Flujo de Creación

```typescript
const { data, setImages, setDetails, reset } = useDamageAssessmentCreation();
```

##### `useDamageAssessmentDetail()` - Gestión de Detalles

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
} = useDamageAssessmentDetail();
```

##### `useDamageAssessmentDetailPage()` - Para Páginas

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
} = useDamageAssessmentDetailPage();
```

### WorkshopContext

Contexto para gestión de información del taller autenticado.

**Propósito:**

- 🎯 Acceso centralizado a la información del taller
- 🚫 Evita múltiples llamadas al backend
- 🔄 Mantiene el estado sincronizado

#### Hook: `useWorkshop()`

```typescript
const {
  workshop, // Workshop | null - Datos del taller
  isLoading, // boolean - Estado de carga
  error, // string | null - Error si existe
  updateWorkshop, // (updates: Partial<Workshop>) => Promise<void>
  refreshWorkshop, // () => Promise<void>
} = useWorkshop();
```

#### Tipo Workshop

```typescript
interface Workshop {
  _id: string;
  name: string;
  pricePerHour: number; // Precio por hora - Mecánica
  bodyworkHourlyRate?: number; // Precio por hora - Carrocería
  vendorResources?: VendorResources;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🛠️ Componentes Especializados

### DamageSparePartsTable

Componente extraído del `DamageCard` que maneja la tabla de piezas de recambio de un daño específico.

**Características:**

- ✅ **Sin props drilling** - Usa el contexto `DamageAssessmentDetail` directamente
- ✅ **Modo visualización y edición** - Controlado por la prop `isEditing`
- ✅ **CRUD completo** - Crear, leer, actualizar y eliminar spare parts
- ✅ **Cálculo automático** - Total de recambios calculado automáticamente
- ✅ **Estados vacíos** - Maneja graciosamente cuando no hay piezas
- ✅ **Validaciones** - Campos numéricos con validaciones mínimas

```typescript
interface DamageSparePartsTableProps {
  damageId: string; // ID del daño para obtener los datos del contexto
  isEditing?: boolean; // Controla si la tabla está en modo edición
}
```

**Uso:**

```tsx
import { DamageSparePartsTable } from '@/components/molecules/DamageSparePartsTable';

// Modo visualización (solo lectura)
<DamageSparePartsTable damageId="damage-123" />

// Modo edición
<DamageSparePartsTable damageId="damage-123" isEditing={true} />
```

### DamageAdditionalActionsTable

Componente que maneja la tabla de suplementos/operaciones adicionales de un daño específico.

**Características:**

- ✅ **Sin props drilling** - Usa el contexto `DamageAssessmentDetail` directamente
- ✅ **Modo visualización y edición** - Controlado por la prop `isEditing`
- ✅ **CRUD completo** - Crear, leer, actualizar y eliminar additional actions
- ✅ **Gestión de tiempo** - Tiempo en minutos para cada operación
- ✅ **Estados vacíos** - Maneja graciosamente cuando no hay suplementos
- ✅ **Validaciones** - Campos numéricos con validaciones mínimas

```typescript
interface DamageAdditionalActionsTableProps {
  damageId: string; // ID del daño para obtener los datos del contexto
  isEditing?: boolean; // Controla si la tabla está en modo edición
}
```

**Columnas de la Tabla:**
| Columna | Ancho | Tipo | Editable | Descripción |
| ----------- | ----- | ------- | -------- | -------------------------- |
| Descripción | 70% | Texto | ✅ | Descripción del suplemento |
| Tiempo | 20% | Número | ✅ | Tiempo en minutos (mín: 0) |
| Acciones | 10% | Botones | ❌ | Eliminar (solo en edición) |

## 🎨 Sistema de Estilos

### Configuración de Tailwind CSS

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Colores personalizados del proyecto
      },
    },
  },
  plugins: [],
};
```

### Utilidades CSS

- **cn.ts**: Función utility para combinar clases CSS condicionalmente
- **Responsive Design**: Mobile-first approach con breakpoints de Tailwind

## 🌐 Páginas Principales

### Dashboard

- Métricas generales del taller
- Resumen de diagnósticos recientes
- Indicadores de rendimiento

### Diagnósticos

- **NewDiagnosis**: Crear nuevo diagnóstico
- **Diagnoses**: Lista de diagnósticos
- **DiagnosisQuestions**: Formulario de preguntas
- **PreliminaryDiagnosis**: Diagnóstico preliminar
- **FinalReport**: Reporte final

### Peritajes de Daños

- **DamageAssessments**: Lista de peritajes
- **DamageAssessmentDetail**: Detalle del peritaje
- **CreateDamageAssessment**: Crear nuevo peritaje

### Gestión

- **Vehicles**: Gestión de vehículos
- **Settings**: Configuraciones del taller
- **PromptManager**: Gestión de prompts de IA
- **Metrics**: Métricas y analytics

## 🔧 Servicios API

### ApiService

Servicio principal para comunicación con el backend.

```typescript
// Uso básico
import { apiService } from '@/service/api.service';

const response = await apiService.get('/diagnoses');
const newDiagnosis = await apiService.post('/diagnoses', data);
```

### UploadService

Servicio especializado para subida de archivos.

```typescript
import { uploadService } from '@/service/upload.service';

const uploadedFiles = await uploadService.uploadFiles(files);
```

## 🎣 Custom Hooks

### useApi

Hook para realizar peticiones API con manejo de estados.

```typescript
const { data, isLoading, error, execute } = useApi('get', '/diagnoses');
```

### useCarPlateOrVin

Hook para decodificación de matrículas y VIN de vehículos.

```typescript
const { decodeVehicle, isLoading, vehicleData } = useCarPlateOrVin();
```

### useDamageAssessmentDetail

Hook especializado para gestión de detalles de peritajes.

```typescript
const { damageAssessment, updateDamage, deleteDamage } = useDamageAssessmentDetail();
```

## 🚀 Optimizaciones de Performance

### Código Splitting

- Lazy loading de rutas con React.lazy()
- Carga diferida de componentes pesados

### Gestión de Estado

- React Query para cache inteligente de datos servidor
- Context API para estado global mínimo
- Optimización de re-renders con useMemo y useCallback

### Bundle Optimization

- Tree shaking automático con Vite
- Compresión de assets en producción
- Análisis de bundle con herramientas de Vite

## 🧪 Testing (Pendiente)

```bash
# Configuración recomendada
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

## 🚀 Deployment

### Build para Producción

```bash
# Crear build optimizado
npm run build

# Preview del build
npm run preview
```

### Variables de Entorno de Producción

```env
VITE_API_BASE_URL=https://api.motormind.com
VITE_ENVIRONMENT=production
```

## 📱 Responsive Design

La aplicación está optimizada para:

- 📱 **Mobile**: >= 320px
- 📱 **Tablet**: >= 768px
- 💻 **Desktop**: >= 1024px
- 🖥️ **Large Desktop**: >= 1280px

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Convenciones de Código

- **Componentes**: PascalCase
- **Hooks**: camelCase con prefijo `use`
- **Archivos**: camelCase
- **Constantes**: SCREAMING_SNAKE_CASE

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

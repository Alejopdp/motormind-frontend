import { useNavigate, useParams } from 'react-router-dom';
import { useDamageAssessmentDetailPage } from '@/hooks/useDamageAssessmentDetail.hook';
import { useAuth } from '@/context/Auth.context';
import { UserRole } from '@/types/User';
import { Navigate } from 'react-router-dom';
import Spinner from '@/components/atoms/Spinner';
import { Button } from '@/components/atoms/Button';
import { Printer, Share, Mail, Download } from 'lucide-react';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';

const DamageAssessmentReport = () => {
  const { damageAssessmentId } = useParams<{ damageAssessmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const { damageAssessment, isLoading, error, isCurrentAssessmentLoaded, damages } =
    useDamageAssessmentDetailPage();

  // Cargar el damage assessment al montar el componente
  useEffect(() => {
    // Este efecto se ejecuta para asegurar que se carga el assessment correcto
    // El hook interno ya maneja la carga automática
  }, [damageAssessmentId]);

  // Verificar permisos
  if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Estados de carga
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Cargando informe..." />
      </div>
    );
  }

  if (error || !isCurrentAssessmentLoaded || !damageAssessment || !damageAssessment.car) {
    return (
      <div className="text-destructive flex min-h-screen items-center justify-center">
        Error al cargar el informe
      </div>
    );
  }

  // Solo mostrar daños confirmados
  const confirmedDamages = damages.filter((damage) => damage.isConfirmed);

  // Mock data para el resumen de daños principales
  const mockDamagesSummary = [
    'Daños principales localizados en parte frontal izquierda, afectando paragolpes, faro y aleta.',
    'Se requiere sustitución de paragolpes y faro, y reparación de aleta.',
  ];

  // Mock data para materiales de pintura
  const paintMaterials = [
    {
      description: 'Aplicación según baremo',
      amount: 120.0,
    },
  ];

  // Calcular totales
  const laborSubtotal = confirmedDamages.reduce((total, damage) => {
    const additionalActions = damage.additionalActions || [];
    return total + additionalActions.reduce((sum, action) => sum + action.time * 70, 0);
  }, 0);

  const partsSubtotal = confirmedDamages.reduce((total, damage) => {
    const spareParts = damage.spareParts || [];
    return total + spareParts.reduce((sum, part) => sum + part.quantity * part.price, 0);
  }, 0);

  const paintSubtotal = paintMaterials.reduce((total, material) => total + material.amount, 0);
  const subtotal = laborSubtotal + partsSubtotal + paintSubtotal;
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const currentDate = new Date().toLocaleDateString('es-ES');
  const { car } = damageAssessment;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botones de acción */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Button variant="outline" onClick={() => navigate('/damage-assessments')}>
            ← Volver a Peritajes
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                enqueueSnackbar('Link copiado al portapapeles', { variant: 'success' });
              }}
            >
              <Share className="mr-2 h-4 w-4" />
              Compartir
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Enviar por Email
            </Button>
            <Button size="sm">
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido del informe */}
      <div className="mx-auto my-8 max-w-5xl bg-white shadow-lg">
        <div className="p-8">
          {/* Header del informe */}
          <div className="mb-8 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded bg-blue-600 p-2 text-white">
                <span className="text-sm font-bold">Motormind</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Talleres Motormind</h2>
                <p className="text-sm text-gray-600">Calle Principal 123, 28001 Madrid</p>
                <p className="text-sm text-gray-600">CIF: B12345678 | Tel: 91 234 56 78</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="mb-2 text-xl font-bold text-gray-900">
                INFORME DE PERITACIÓN DE DAÑOS
              </h1>
              <p className="text-sm text-gray-600">Fecha de emisión: {currentDate}</p>
            </div>
          </div>

          {/* Divider */}
          <hr className="mb-8 border-gray-200" />

          {/* Datos del Vehículo y Siniestro */}
          <div className="mb-8 grid grid-cols-2 gap-8">
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-4 font-semibold text-gray-900">Datos del Vehículo</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Marca y Modelo:</span>
                  <span className="font-medium">
                    {car.brand} {car.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Matrícula:</span>
                  <span className="font-medium">{car.plate || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nº de Bastidor (VIN):</span>
                  <span className="font-medium">{car.vinCode || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kilometraje:</span>
                  <span className="font-medium">16,272 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de 1ª Matriculación:</span>
                  <span className="font-medium">{car.year || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="mb-4 font-semibold text-gray-900">Datos del Siniestro</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Aseguradora:</span>
                  <span className="font-medium">{damageAssessment.insuranceCompany}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nº de Póliza:</span>
                  <span className="font-medium">-</span>
                </div>
                {damageAssessment.claimNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nº de Siniestro:</span>
                    <span className="font-medium">{damageAssessment.claimNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha del Siniestro:</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cliente/Asegurado:</span>
                  <span className="font-medium">-</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de Daños Principales */}
          <div className="mb-8">
            <h3 className="mb-4 font-semibold text-gray-900">Resumen de Daños Principales</h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <ul className="space-y-2 text-sm">
                {mockDamagesSummary.map((summary, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-gray-400">•</span>
                    <span>{summary}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fotografías Clave */}
          <div className="mb-8">
            <h3 className="mb-4 font-semibold text-gray-900">Fotografías Clave</h3>
            <div className="grid grid-cols-4 gap-4">
              {damageAssessment.images.slice(0, 8).map((image, index) => (
                <div key={index} className="aspect-square">
                  <img
                    src={image}
                    alt={`Fotografía ${index + 1}`}
                    className="h-full w-full rounded border border-gray-200 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Desglose Detallado de la Valoración */}
          <div className="mb-8">
            <h3 className="mb-6 text-lg font-bold text-gray-900">
              DESGLOSE DETALLADO DE LA VALORACIÓN
            </h3>

            {/* Mano de Obra */}
            <div className="mb-6">
              <h4 className="mb-3 font-semibold text-gray-900">MANO DE OBRA</h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left">OPERACIÓN</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">CÓDIGO BAREMO</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">TIEMPO (HORAS)</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">PRECIO/HORA</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">IMPORTE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedDamages.map((damage, damageIndex) =>
                      (damage.additionalActions || []).map((action, actionIndex) => (
                        <tr key={`${damageIndex}-${actionIndex}`}>
                          <td className="border border-gray-200 px-4 py-2">{action.description}</td>
                          <td className="border border-gray-200 px-4 py-2">
                            {damage.action === 'REPLACE'
                              ? 'SUST-'
                              : damage.action === 'REPAIR_AND_PAINT'
                                ? 'REP-'
                                : 'PINT-'}
                            {String(damageIndex + 1).padStart(2, '0')}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">{action.time}h</td>
                          <td className="border border-gray-200 px-4 py-2">€70.00</td>
                          <td className="border border-gray-200 px-4 py-2 font-medium">
                            €{(action.time * 70).toFixed(2)}
                          </td>
                        </tr>
                      )),
                    )}
                    <tr className="bg-gray-50 font-medium">
                      <td colSpan={4} className="border border-gray-200 px-4 py-2 text-right">
                        Subtotal Mano de Obra:
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        €{laborSubtotal.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recambios */}
            <div className="mb-6">
              <h4 className="mb-3 font-semibold text-gray-900">RECAMBIOS</h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-4 py-2 text-left">DESCRIPCIÓN</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">REFERENCIA</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">CANT.</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">PRECIO UNIT.</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">IMPORTE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedDamages.map((damage, damageIndex) =>
                      (damage.spareParts || []).map((part, partIndex) => (
                        <tr key={`${damageIndex}-${partIndex}`}>
                          <td className="border border-gray-200 px-4 py-2">{part.description}</td>
                          <td className="border border-gray-200 px-4 py-2">
                            {damage.area.slice(0, 3).toUpperCase()}
                            {String(damageIndex + 1).padStart(3, '0')}-{String(partIndex + 1)}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">{part.quantity}</td>
                          <td className="border border-gray-200 px-4 py-2">
                            €{part.price.toFixed(2)}
                          </td>
                          <td className="border border-gray-200 px-4 py-2 font-medium">
                            €{(part.quantity * part.price).toFixed(2)}
                          </td>
                        </tr>
                      )),
                    )}
                    <tr className="bg-gray-50 font-medium">
                      <td colSpan={4} className="border border-gray-200 px-4 py-2 text-right">
                        Subtotal Recambios:
                      </td>
                      <td className="border border-gray-200 px-4 py-2">
                        €{partsSubtotal.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Materiales de Pintura */}
            <div className="mb-6">
              <h4 className="mb-3 font-semibold text-gray-900">MATERIALES DE PINTURA</h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 text-sm">
                  <tbody>
                    {paintMaterials.map((material, index) => (
                      <tr key={index}>
                        <td className="border border-gray-200 px-4 py-2">{material.description}</td>
                        <td className="border border-gray-200 px-4 py-2 text-right font-medium">
                          €{material.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resumen de Costes Totales */}
            <div>
              <h4 className="mb-3 font-semibold text-gray-900">RESUMEN DE COSTES TOTALES</h4>
              <div className="rounded-lg bg-gray-50 p-6">
                <div className="ml-auto max-w-md space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal Mano de Obra:</span>
                    <span className="font-medium">€{laborSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal Recambios:</span>
                    <span className="font-medium">€{partsSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal Materiales Pintura:</span>
                    <span className="font-medium">€{paintSubtotal.toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>BASE IMPONIBLE:</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (21%):</span>
                    <span className="font-medium">€{iva.toFixed(2)}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>TOTAL VALORACIÓN (IVA Incluido):</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamageAssessmentReport;

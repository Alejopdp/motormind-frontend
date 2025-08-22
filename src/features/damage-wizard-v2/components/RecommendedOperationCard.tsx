import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BackendOperation, DamageAction } from '../types';
import { BackendDamage } from '../types/backend.types';
import { Dropdown } from '@/components/atoms/Dropdown';

interface RecommendedOperationCardProps {
  operation: BackendOperation;
  onUpdateOperation: (mappingId: string, newOperation: DamageAction, reason: string) => void;
  // Agregar prop opcional para el daño relacionado
  relatedDamage?: BackendDamage;
}

const operationLabels: Record<DamageAction, string> = {
  REPAIR: 'Reparar',
  REPLACE: 'Reemplazar',
  PAINT: 'Pintar',
  POLISH: 'Pulir',
  REPAIR_AND_PAINT: 'Reparar y Pintar',
};

const severityLabels: Record<string, string> = {
  SEV1: 'Muy Leve',
  SEV2: 'Leve',
  SEV3: 'Moderado',
  SEV4: 'Grave',
  SEV5: 'Muy Grave',
};

const severityColors: Record<string, string> = {
  SEV1: 'bg-green-100 text-green-800',
  SEV2: 'bg-blue-100 text-blue-800',
  SEV3: 'bg-yellow-100 text-yellow-800',
  SEV4: 'bg-orange-100 text-orange-800',
  SEV5: 'bg-red-100 text-red-800',
};

const damageTypeLabels: Record<string, string> = {
  scratch: 'Arañazo',
  dent: 'Abolladura',
  crack: 'Grieta',
  break: 'Rotura',
};

const confidenceColors = (confidence: number): string => {
  if (confidence >= 0.8) return 'bg-green-100 text-green-800';
  if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

export const RecommendedOperationCard: React.FC<RecommendedOperationCardProps> = ({
  operation,
  onUpdateOperation,
  relatedDamage,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Validar que tenemos una operación efectiva válida
  if (!operation.effectiveOperation) {
    console.error('❌ RecommendedOperationCard: effectiveOperation es undefined', operation);
    return (
      <div className="rounded-lg border border-red-200 bg-white p-6 shadow-sm">
        <div className="text-red-600">
          <h3 className="mb-2 text-lg font-semibold">Error en operación</h3>
          <p className="text-sm">
            No se pudo cargar la información de la operación para: {operation.partName}
          </p>
        </div>
      </div>
    );
  }

  const currentOperation = operation.effectiveOperation.operation;
  const currentReason = operation.effectiveOperation.reason;

  const handleOperationChange = (newOperation: DamageAction) => {
    const reason = operation.hasUserOverride ? 'user_decision' : currentReason;
    onUpdateOperation(operation.mappingId, newOperation, reason);
    setIsOpen(false);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold text-gray-900">{operation.partName}</h3>
          {operation.partCode && (
            <p className="mb-2 text-sm text-gray-500">Código: {operation.partCode}</p>
          )}

          {relatedDamage && (
            <div className="flex items-center">
              <span className="text-muted mr-2 text-sm capitalize">
                {damageTypeLabels[relatedDamage.type] || relatedDamage.type}
              </span>
              <span
                className={`ml-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${severityColors[relatedDamage.severity]}`}
              >
                {severityLabels[relatedDamage.severity] || relatedDamage.severity}
              </span>
            </div>
          )}
        </div>

        {/* Indicador de override de usuario */}
        {/* {operation.hasUserOverride && (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            Editado
          </span>
        )} */}
      </div>

      {/* Información del daño si está disponible
      {relatedDamage && (
        <div className="mb-4 rounded-lg bg-gray-50 p-4">
          <h4 className="mb-3 text-sm font-medium text-gray-700">Información del daño</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Tipo:</span>
            </div>
            <div>
              <span className="text-gray-500">Severidad:</span>
              <span
                className={`ml-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${severityColors[relatedDamage.severity]}`}
              >
                {severityLabels[relatedDamage.severity] || relatedDamage.severity}
              </span>
            </div>
            {relatedDamage.confidence && (
              <div>
                <span className="text-gray-500">Confianza:</span>
                <span
                  className={`ml-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${confidenceColors(relatedDamage.confidence)}`}
                >
                  {Math.round(relatedDamage.confidence * 100)}%
                </span>
              </div>
            )}
            {relatedDamage.area && (
              <div>
                <span className="text-gray-500">Área:</span>
                <span className="ml-2 text-gray-900">{relatedDamage.area}</span>
              </div>
            )}
          </div>
          {relatedDamage.description && (
            <div className="mt-3">
              <span className="text-gray-500">Descripción:</span>
              <p className="mt-1 text-sm text-gray-900">{relatedDamage.description}</p>
            </div>
          )}
        </div>
      )} */}

      <div className="space-y-4">
        {/* Operación actual */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Operación recomendada
          </label>
          <Dropdown.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dropdown.Trigger asChild>
              <button className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-left focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
                <span>{operationLabels[currentOperation]}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Content className="w-full min-w-[200px]">
              {Object.entries(operationLabels).map(([value, label]) => (
                <Dropdown.Item
                  key={value}
                  onClick={() => handleOperationChange(value as DamageAction)}
                  className="cursor-pointer"
                >
                  {label}
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown.Root>
        </div>

        {/* Información de confianza y fuente */}
        {operation.proposedOperation && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Confianza:</span>
              <span
                className={`ml-2 inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${confidenceColors(operation.proposedOperation.main.confidence)}`}
              >
                {Math.round(operation.proposedOperation.main.confidence * 100)}%
              </span>
            </div>
            <div>
              <span className="text-gray-500">Fuente:</span>
              <span className="ml-2 text-gray-900 capitalize">
                {operation.proposedOperation.main.source.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}

        {/* Razón de la operación */}
        {/* <div>
          <span className="text-sm text-gray-500">Razón:</span>
          <p className="mt-1 text-sm text-gray-900">{currentReason}</p>
        </div> */}

        {/* Sub-operaciones */}
        {operation.proposedOperation?.subOperations &&
          operation.proposedOperation.subOperations.length > 0 && (
            <div>
              <span className="text-sm text-gray-500">Sub-operaciones:</span>
              <ul className="mt-1 space-y-1">
                {operation.proposedOperation.subOperations.map((subOp, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-900">
                    <span className="mr-2 h-2 w-2 rounded-full bg-gray-400"></span>
                    {subOp.operation}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
};

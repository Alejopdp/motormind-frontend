import { SectionPaper } from './SectionPaper';
import { Info } from 'lucide-react';
import { PaintOperation, PaintMaterial } from '../types';

interface PaintTableProps {
  paintOperations: PaintOperation[];
  paintMaterials: PaintMaterial[];
  className?: string;
}

/**
 * Tabla de Pintura - Mano de obra y materiales.
 * Diseñado para paridad 1:1 con el prototipo de Lovable.
 *
 * - Header: "Pintura — Mano de obra y materiales"
 * - Section 1: MO Pintura con bg-blue-50/50 + headers bg-blue-100/50
 * - Section 2: Materiales con bg-green-50/50 + headers bg-green-100/50  
 * - Info banner: Info icon + explicación de unidades
 * - Highlighted columns: Unidades y Precio por unidad con bg-green-200/50
 * - Footer global: Total Pintura Global con bg-blue-100/30
 * - Colors: blue para MO, green para materiales
 */
export const PaintTable = ({ paintOperations, paintMaterials, className }: PaintTableProps) => {
  const paintLaborTotal = paintOperations.reduce((sum, op) => sum + op.total, 0);
  const paintMaterialsTotal = paintMaterials.reduce((sum, mat) => sum + mat.total, 0);
  const totalPaintGlobal = paintLaborTotal + paintMaterialsTotal;

  return (
    <SectionPaper className={className}>
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Pintura — Mano de obra y materiales</h3>
      </div>
      
      {/* Paint Labor Section */}
      <div className="p-4 bg-blue-50/50 border-b border-border">
        <h4 className="font-medium text-blue-900 mb-3">MO Pintura (h)</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-100/50">
              <tr>
                <th className="text-left p-2 text-sm font-medium">Pieza</th>
                <th className="text-left p-2 text-sm font-medium">Trabajo</th>
                <th className="text-right p-2 text-sm font-medium">Horas MO Pintura</th>
                <th className="text-right p-2 text-sm font-medium">Tarifa MO (€/h)</th>
                <th className="text-right p-2 text-sm font-medium">Total MO Pintura (€)</th>
              </tr>
            </thead>
            <tbody>
              {paintOperations.map((operation) => (
                <tr key={operation.id} className="border-b border-blue-200/50">
                  <td className="p-2 text-sm">{operation.piece}</td>
                  <td className="p-2 text-sm">{operation.operation}</td>
                  <td className="p-2 text-right text-sm font-medium">{operation.hours}</td>
                  <td className="p-2 text-right text-sm">{operation.rate}€</td>
                  <td className="p-2 text-right text-sm font-semibold">{operation.total.toFixed(2)}€</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-blue-100/50">
              <tr>
                <td colSpan={4} className="p-2 text-right text-sm font-semibold">Total MO Pintura:</td>
                <td className="p-2 text-right text-sm font-bold">{paintLaborTotal.toFixed(2)}€</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Paint Materials Section */}
      <div className="p-4 bg-green-50/50">
        <h4 className="font-medium text-green-900 mb-3">Materiales de Pintura (unidades)</h4>
        <div className="flex items-center gap-2 mb-3 text-sm text-green-700">
          <Info className="h-4 w-4" />
          <span>El coste de materiales se calcula por unidades de pintura según baremo</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-100/50">
              <tr>
                <th className="text-left p-2 text-sm font-medium">Pieza</th>
                <th className="text-left p-2 text-sm font-medium">Descripción materiales</th>
                <th className="text-center p-2 text-sm font-medium bg-green-200/50">Unidades</th>
                <th className="text-right p-2 text-sm font-medium bg-green-200/50">Precio por unidad (€/u)</th>
                <th className="text-right p-2 text-sm font-medium">Total Materiales (€)</th>
              </tr>
            </thead>
            <tbody>
              {paintMaterials.map((material) => (
                <tr key={material.id} className="border-b border-green-200/50">
                  <td className="p-2 text-sm">{material.piece}</td>
                  <td className="p-2 text-sm">{material.description}</td>
                  <td className="p-2 text-center text-sm font-medium bg-green-100/30">{material.units}</td>
                  <td className="p-2 text-right text-sm bg-green-100/30">{material.pricePerUnit.toFixed(2)}€</td>
                  <td className="p-2 text-right text-sm font-semibold">{material.total.toFixed(2)}€</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-green-100/50">
              <tr>
                <td colSpan={4} className="p-2 text-right text-sm font-semibold">Total Materiales Pintura:</td>
                <td className="p-2 text-right text-sm font-bold">{paintMaterialsTotal.toFixed(2)}€</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Paint Section Total */}
      <div className="p-4 bg-blue-100/30 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-blue-900">Total Pintura Global:</span>
          <span className="text-xl font-bold text-blue-900">{totalPaintGlobal.toFixed(2)}€</span>
        </div>
      </div>
    </SectionPaper>
  );
};

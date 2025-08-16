import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { useWizardV2 } from '../context/WizardV2Context';
import { PageShell } from '../components/PageShell';
import { SectionPaper } from '../components/SectionPaper';
import { WizardStepper } from '../components/WizardStepper';
import { ValuationTable } from '../components/ValuationTable';

import valuationMock from '../mocks/valuation.json';

const Valuation = () => {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { setState } = useWizardV2();



  const finalize = () => {
    setState((prev) => ({ ...prev, status: 'valuated' }));
    setParams({ step: 'finalize' });
    navigate(`?step=finalize`, { replace: true });
  };

  const sourceConfig = {
    autodata: { color: 'bg-blue-100 text-blue-800', label: 'Autodata' },
    segment_lookup: { color: 'bg-green-100 text-green-800', label: 'Segment' },
    calc: { color: 'bg-purple-100 text-purple-800', label: 'Calc' },
    user_override: { color: 'bg-orange-100 text-orange-800', label: 'Override' },
    no_data: { color: 'bg-red-100 text-red-800', label: 'No Data' },
  };

  // Transform mock data for tables
  const laborData = valuationMock.labor.map((item) => ({
    ...item,
    source: (
      <Badge
        variant="outline"
        className={sourceConfig[item.source as keyof typeof sourceConfig].color}
      >
        {sourceConfig[item.source as keyof typeof sourceConfig].label}
      </Badge>
    ),
    hours: `${item.hours}h`,
    rate: `€${item.rate}/h`,
    total: `€${item.total}`,
  }));

  const paintData = valuationMock.paint.map((item) => ({
    ...item,
    paintHours: `${item.paintHours}h`,
    paintLaborTotal: `€${item.paintLaborTotal}`,
    unitPrice: `€${item.unitPrice}`,
    materialsTotal: `€${item.materialsTotal}`,
    total: `€${item.total}`,
  }));

  const partsData = valuationMock.parts.map((item) => ({
    ...item,
    unitPrice: `€${item.unitPrice}`,
    total: `€${item.total}`,
  }));

  return (
    <PageShell
      header={<WizardStepper currentStep="valuation" completedSteps={['intake', 'damages', 'operations']} />}
      title="Valoración del peritaje"
      subtitle="Revisa los costes calculados para cada operación"
      content={
        <div className="space-y-6">
          {/* Table 1: Mano de obra (sin pintura) */}
          <SectionPaper title="Mano de obra (sin pintura)">
            <ValuationTable
              columns={[
                { key: 'partName', header: 'Pieza' },
                { key: 'operation', header: 'Operación' },
                { key: 'hours', header: 'Horas MO' },
                { key: 'rate', header: 'Tarifa (€/h)' },
                { key: 'total', header: 'Total MO (€)' },
                { key: 'source', header: 'Fuente' },
              ]}
              data={laborData}
            />
          </SectionPaper>

          {/* Table 2: Pintura */}
          <SectionPaper title="Pintura - Mano de obra y materiales">
            <ValuationTable
              columns={[
                { key: 'partName', header: 'Pieza' },
                { key: 'job', header: 'Trabajo' },
                { key: 'paintHours', header: 'Horas MO Pintura' },
                { key: 'paintLaborTotal', header: 'Total MO Pintura (€)' },
                { key: 'units', header: 'Unidades' },
                { key: 'unitPrice', header: '€/unidad' },
                { key: 'materialsTotal', header: 'Total Materiales (€)' },
                { key: 'total', header: 'Total Pintura (€)' },
              ]}
              data={paintData}
            />
          </SectionPaper>

          {/* Table 3: Recambios */}
          <SectionPaper title="Recambios">
            <ValuationTable
              columns={[
                { key: 'ref', header: 'Ref' },
                { key: 'partName', header: 'Pieza' },
                { key: 'unitPrice', header: 'Precio unitario' },
                { key: 'qty', header: 'Cantidad' },
                { key: 'total', header: 'Total' },
              ]}
              data={partsData}
            />
          </SectionPaper>

          {/* Totals card */}
          <SectionPaper title="Resumen de costes">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  €{valuationMock.totals.labor}
                </div>
                <div className="text-sm text-gray-600">MO</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  €{valuationMock.totals.paintLabor}
                </div>
                <div className="text-sm text-gray-600">MO Pintura</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  €{valuationMock.totals.paintMaterials}
                </div>
                <div className="text-sm text-gray-600">Materiales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  €{valuationMock.totals.parts}
                </div>
                <div className="text-sm text-gray-600">Recambios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  €{valuationMock.totals.grandTotal}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              Moneda: {valuationMock.totals.currency}
            </div>
          </SectionPaper>
        </div>
      }
      footer={
        <div className="flex justify-end">
          <Button onClick={finalize} className="px-6">
            Finalizar
          </Button>
        </div>
      }
    />
  );
};

export default Valuation;

import { useWizardV2 } from '../context/WizardV2Context';

const Finalize = () => {
  const { state, setState } = useWizardV2();
  if (state.status !== 'completed') {
    setState((prev) => ({ ...prev, status: 'completed' }));
  }
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Peritaje finalizado</h2>
      <div className="text-gray-700">El assessment ha sido marcado como completado (mock). Próximo paso: conectar endpoint de finalize.</div>
    </div>
  );
};

export default Finalize;



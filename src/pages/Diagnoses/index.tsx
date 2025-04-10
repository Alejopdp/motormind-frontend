import { Sidebar } from '@/components/organisms/Sidebar';

const Diagnoses = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-grow flex-col overflow-auto">Diagnósticos</div>
    </div>
  );
};

export default Diagnoses;

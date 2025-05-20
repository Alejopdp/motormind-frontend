import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/organisms/Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="relative flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import { useAuth } from '@/context/Auth.context';
import { Sidebar } from '@/components/organisms/Sidebar';

const Layout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <Outlet />
    </div>
  );
};

export default Layout;

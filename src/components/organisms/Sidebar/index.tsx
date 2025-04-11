import { BarChartIcon, CarIcon, ClipboardListIcon, SettingsIcon, LogOutIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/Auth.context';
import { UserRole } from '@/types/User';

interface SidebarNavigationProps {
  className?: string;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

export const Sidebar = ({ className }: SidebarNavigationProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems: NavItem[] = [
    {
      icon: BarChartIcon,
      label: 'Dashboard',
      href: '/',
    },
    {
      icon: CarIcon,
      label: 'Vehículos',
      href: '/vehicles',
    },
    {
      icon: ClipboardListIcon,
      label: 'Diagnóstico',
      href: '/diagnoses',
    },
  ];

  return (
    <div className={cn('flex h-full w-60 flex-col bg-[#F5F5F5] px-3 py-4', className)}>
      <div className="mb-8 flex items-center gap-2 px-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#2A7DE1]">
          <CarIcon className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-semibold">Motormind</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          // Check if this item is active
          const isActive =
            (item.href === '/' && currentPath === '/') ||
            (item.href === '/vehicles' && currentPath === '/vehicles') ||
            (item.href === '/diagnoses' && currentPath === '/diagnoses');

          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-primary hover:text-primary-foreground',
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-gray-300 pt-4">
        <div className="flex items-center gap-3 px-3 py-3">
          <Avatar>
            <AvatarImage alt={user?.name || 'Unknown'} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name || 'NN'}</span>
            <span className="text-xs text-gray-500">Jefe de Taller</span>
          </div>
        </div>

        <div className="mt-2 flex px-2">
          {(user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) && (
            <Link to="/configuration" className="flex-1 justify-start">
              <Button variant="ghost" size="sm" className="flex-1 justify-start">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Ajustes
              </Button>
            </Link>
          )}

          <Button variant="ghost" size="sm" onClick={logout} className="flex-1 justify-start">
            <LogOutIcon className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </div>
      </div>
    </div>
  );
};

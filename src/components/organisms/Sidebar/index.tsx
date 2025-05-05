import { useState } from 'react';
import {
  BarChartIcon,
  CarIcon,
  ClipboardListIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  FileTextIcon,
  TestTubeDiagonal,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/Auth.context';
import { UserRole } from '@/types/User';
import { Dialog, DialogContent, DialogTrigger } from '@/components/atoms/Dialog';
import './styles.css';

interface SidebarNavigationProps {
  className?: string;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  roles?: UserRole[];
}

export const Sidebar = ({ className }: SidebarNavigationProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      icon: BarChartIcon,
      label: 'Panel',
      href: '/',
    },
    {
      icon: CarIcon,
      label: 'Vehículos',
      href: '/cars',
    },
    {
      icon: ClipboardListIcon,
      label: 'Diagnósticos',
      href: '/diagnoses',
    },
    {
      icon: TestTubeDiagonal,
      label: 'Evaluaciones',
      href: '/audits/evaluations',
      roles: [UserRole.SUPER_ADMIN],
    },
    {
      icon: FileTextIcon,
      label: 'Prompt Manager',
      href: '/prompts',
      roles: [UserRole.SUPER_ADMIN],
    },
  ];

  const renderNavItems = () => (
    <nav className="flex-1 sm:space-y-1">
      {navItems
        .filter((item) => !item.roles || item.roles.includes(user.role))
        .map((item) => {
          const isActive =
            (item.href === '/' && currentPath === '/') ||
            (item.href === '/cars' && currentPath.startsWith('/cars')) ||
            (item.href === '/diagnoses' && currentPath.startsWith('/diagnoses')) ||
            (item.href === '/audits/evaluations' &&
              currentPath.startsWith('/audits/evaluations')) ||
            (item.href === '/prompts' && currentPath.startsWith('/prompts'));

          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors sm:gap-3 sm:font-medium',
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
  );

  const renderUserSection = () => (
    <div className="mt-auto border-t border-gray-200 pt-2">
      <div className="flex items-center gap-1.5 px-1 py-2 sm:gap-3 sm:px-3 sm:py-3">
        <Avatar>
          <AvatarImage alt={user?.name || 'Unknown'} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user?.name || 'NN'}</span>
          <span className="text-xs text-gray-500">Jefe de Taller</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:mt-2 sm:flex-row">
        {(user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) && (
          <Link
            to="/settings"
            className="flex-1 justify-start"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Button variant="ghost" size="sm" className="flex-1 justify-start">
              <SettingsIcon className="!h-4 !w-4" />
              <span>Ajustes</span>
            </Button>
          </Link>
        )}

        <Button variant="ghost" size="sm" onClick={logout} className="flex-1 justify-start">
          <LogOutIcon className="!h-4 !w-4" />
          <span>Salir</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-[7px] left-4 z-50 block md:hidden">
        <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MenuIcon className="!h-5 !w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sidebar-dialog fixed top-0 left-0 h-full w-[280px] translate-x-0 translate-y-0 p-0">
            <div className="bg-background flex h-full flex-col px-3 py-6 sm:py-4">
              <div className="mb-6 flex w-50 items-center gap-2 px-1 sm:mb-8">
                <img src="/logo_motormind.png" alt="Motormind" />
              </div>
              {renderNavItems()}
              {renderUserSection()}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          'bg-background sticky top-0 hidden h-screen w-[220px] flex-shrink-0 flex-col px-3 py-4 md:flex lg:w-[280px]',
          className,
        )}
      >
        <div className="mb-8 flex items-center gap-2 px-3">
          <img src="/logo_motormind.png" alt="Motormind" />
        </div>
        {renderNavItems()}
        {renderUserSection()}
      </div>
    </>
  );
};

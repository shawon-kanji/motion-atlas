import {
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  Menu,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar, Dropdown } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assets..."
              className="w-64 rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm placeholder-gray-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Mobile Search */}
        <Button variant="ghost" size="sm" className="md:hidden">
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* User Menu */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100">
              <Avatar name={user?.name || 'User'} src={user?.avatar} size="sm" />
            </button>
          }
          items={[
            {
              label: 'Profile',
              icon: <User className="h-4 w-4" />,
              onClick: () => navigate('/settings'),
            },
            {
              label: 'Settings',
              icon: <Settings className="h-4 w-4" />,
              onClick: () => navigate('/settings'),
            },
            {
              label: 'Sign out',
              icon: <LogOut className="h-4 w-4" />,
              onClick: handleLogout,
              danger: true,
            },
          ]}
        />
      </div>
    </header>
  );
}

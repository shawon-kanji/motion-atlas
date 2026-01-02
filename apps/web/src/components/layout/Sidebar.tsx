import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  Users,
  Settings,
  HelpCircle,
  ChevronDown,
  Plus,
  LogOut,
} from 'lucide-react';
import { Avatar, Dropdown } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';

interface SidebarProps {
  collapsed?: boolean;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Assets', href: '/assets', icon: FolderOpen },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ collapsed = false }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, workspace, workspaces, switchWorkspace, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-gray-800 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
            <span className="text-lg font-bold">M</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold">Motion Atlas</span>
          )}
        </div>

        {/* Workspace Selector */}
        {!collapsed && workspace && (
          <div className="border-b border-gray-800 p-4">
            <Dropdown
              trigger={
                <button className="flex w-full items-center justify-between rounded-lg bg-gray-800 px-3 py-2 text-sm hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>{workspace.name}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>
              }
              items={[
                ...workspaces.map((ws) => ({
                  label: ws.name,
                  icon: <div className={clsx('h-2 w-2 rounded-full', ws.id === workspace.id ? 'bg-primary-500' : 'bg-gray-500')} />,
                  onClick: () => switchWorkspace(ws.id),
                })),
                {
                  label: 'Create Workspace',
                  icon: <Plus className="h-4 w-4" />,
                  onClick: () => console.log('Create workspace'),
                },
              ]}
              align="left"
            />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Help & User */}
        <div className="border-t border-gray-800 p-4">
          <Link
            to="/help"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <HelpCircle className="h-5 w-5" />
            {!collapsed && <span>Help & Support</span>}
          </Link>

          {user && (
            <div className="mt-4">
              <Dropdown
                trigger={
                  <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-800">
                    <Avatar name={user.name} src={user.avatar} size="sm" />
                    {!collapsed && (
                      <div className="flex-1 min-w-0 text-left">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="truncate text-xs text-gray-400">{user.email}</p>
                      </div>
                    )}
                  </button>
                }
                items={[
                  {
                    label: 'Settings',
                    icon: <Settings className="h-4 w-4" />,
                    onClick: () => navigate('/settings'),
                  },
                  {
                    label: 'Sign out',
                    icon: <LogOut className="h-4 w-4" />,
                    onClick: handleLogout,
                  },
                ]}
                align="left"
              />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

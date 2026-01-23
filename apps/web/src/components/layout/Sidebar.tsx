import { useState } from 'react';
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
import { Avatar, Dropdown, Modal, Input, Button } from '@/components/ui';
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
  const { user, workspace, workspaces, switchWorkspace, logout, createWorkspace } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleCreateWorkspace = async () => {
      if(!newWorkspaceName.trim()) return;
      setIsCreating(true);
      try {
          await createWorkspace(newWorkspaceName);
          setIsCreateModalOpen(false);
          setNewWorkspaceName('');
      } catch (error) {
          console.error("Failed to create workspace", error);
      } finally {
          setIsCreating(false);
      }
  };

  return (
    <>
    <aside
      className={clsx(
        'fixed left-0 top-0 z-40 h-screen bg-gray-100 text-gray-900 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
              <span className="text-lg font-bold text-gray-50">M</span>
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold">Motion Atlas</span>
            )}
          </Link>
        </div>

        {/* Workspace Selector */}
        {!collapsed && (
          <div className="border-b border-gray-200 p-4">
            <Dropdown
              trigger={
                <button className="flex w-full items-center justify-between rounded-lg bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>{workspace?.name || 'Select Workspace'}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>
              }
              items={[
                ...workspaces.map((ws) => ({
                  label: ws.name,
                  icon: <div className={clsx('h-2 w-2 rounded-full', ws.id === workspace?.id ? 'bg-primary-500' : 'bg-gray-500')} />,
                  onClick: () => switchWorkspace(ws.id),
                })),
                {
                  label: 'Create Workspace',
                  icon: <Plus className="h-4 w-4" />,
                  onClick: () => setIsCreateModalOpen(true),
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
                    ? 'bg-primary-500 text-gray-50'
                    : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Help & User */}
        <div className="border-t border-gray-200 p-4">
          <Link
            to="/help"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          >
            <HelpCircle className="h-5 w-5" />
            {!collapsed && <span>Help & Support</span>}
          </Link>

          <div className="mt-2 border-t border-gray-200 pt-2">
            <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-3">
                    <Avatar src={user?.avatar} alt={user?.name || 'User'} name={user?.name || 'User'} />
                    {!collapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-gray-900 truncate">{user?.name}</span>
                            <span className="text-xs text-gray-500 truncate max-w-[120px]">{user?.email}</span>
                        </div>
                    )}
                </div>
                {!collapsed && (
                    <button
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </aside>

    <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Workspace"
        description="Workspaces allow you to collaborate with your team."
    >
        <div className="mt-4 space-y-4">
            <Input
                label="Workspace Name"
                placeholder="e.g. Acme Corp"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
            />
            <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleCreateWorkspace} isLoading={isCreating}>Create Workspace</Button>
            </div>
        </div>
    </Modal>
    </>
  );
}

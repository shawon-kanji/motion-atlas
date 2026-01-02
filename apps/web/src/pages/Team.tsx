import { useState } from 'react';
import { AppLayout } from '@/components/layout';
import { Button, Card, Avatar, Badge, Modal } from '@/components/ui';
import {
  Mail,
  Crown,
  Trash2,
  UserPlus,
  Search,
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Editor' | 'Viewer';
  status: 'active' | 'pending';
  joinedAt?: string;
}

const members: Member[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@example.com', role: 'Owner', status: 'active', joinedAt: 'Jan 2025' },
  { id: '2', name: 'Mike Johnson', email: 'mike@example.com', role: 'Editor', status: 'active', joinedAt: 'Feb 2025' },
  { id: '3', name: 'Emma Wilson', email: 'emma@example.com', role: 'Editor', status: 'active', joinedAt: 'Mar 2025' },
  { id: '4', name: 'John Doe', email: 'john@example.com', role: 'Viewer', status: 'active', joinedAt: 'Apr 2025' },
  { id: '5', name: 'Alex Smith', email: 'alex@example.com', role: 'Editor', status: 'pending' },
];

const roleColors = {
  Owner: 'bg-yellow-100 text-yellow-800',
  Editor: 'bg-blue-100 text-blue-800',
  Viewer: 'bg-gray-100 text-gray-800',
};

export default function Team() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const filteredMembers = members.filter((member) => {
    if (searchQuery && !member.name.toLowerCase().includes(searchQuery.toLowerCase()) && !member.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedRole !== 'all' && member.role !== selectedRole) {
      return false;
    }
    return true;
  });

  const activeMembers = members.filter((m) => m.status === 'active').length;
  const pendingMembers = members.filter((m) => m.status === 'pending').length;

  return (
    <AppLayout title="Team">
      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm font-medium text-gray-500">Total Members</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{members.length}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-gray-500">Active</p>
          <p className="mt-1 text-3xl font-semibold text-green-600">{activeMembers}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-gray-500">Pending Invites</p>
          <p className="mt-1 text-3xl font-semibold text-yellow-600">{pendingMembers}</p>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">All Roles</option>
            <option value="Owner">Owners</option>
            <option value="Editor">Editors</option>
            <option value="Viewer">Viewers</option>
          </select>
        </div>
        <Button leftIcon={<UserPlus className="h-4 w-4" />} onClick={() => setShowInviteModal(true)}>
          Invite Members
        </Button>
      </div>

      {/* Members List */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Joined
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={member.name} size="md" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      {member.role === 'Owner' && <Crown className="h-4 w-4 text-yellow-500" />}
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${roleColors[member.role]}`}>
                        {member.role}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
                      {member.status}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {member.joinedAt || '-'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    {member.role !== 'Owner' && (
                      <div className="flex items-center justify-end gap-2">
                        {member.status === 'pending' && (
                          <Button variant="ghost" size="sm" leftIcon={<Mail className="h-4 w-4" />}>
                            Resend
                          </Button>
                        )}
                        <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Members"
        description="Send invitations to join your workspace"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Addresses</label>
            <textarea
              rows={3}
              placeholder="Enter email addresses, separated by commas or new lines"
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option value="Viewer">Viewer - Can view and comment</option>
              <option value="Editor">Editor - Can upload and edit assets</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personal Message (optional)</label>
            <textarea
              rows={2}
              placeholder="Add a personal message to the invitation..."
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button leftIcon={<Mail className="h-4 w-4" />}>Send Invitations</Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}

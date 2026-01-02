import { useState } from 'react';
import { AppLayout } from '@/components/layout';
import { Button, Card, Input, Avatar, Badge, Modal } from '@/components/ui';
import { clsx } from 'clsx';
import {
  Building2,
  Users,
  CreditCard,
  Shield,
  Bell,
  Palette,
  Link as LinkIcon,
  Plus,
  Mail,
  Trash2,
  Crown,
  Upload,
  ExternalLink,
} from 'lucide-react';

type SettingsTab = 'general' | 'members' | 'billing' | 'security' | 'notifications' | 'branding' | 'integrations';

const tabs: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: LinkIcon },
];

const members = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@example.com', role: 'Owner', status: 'active' },
  { id: '2', name: 'Mike Johnson', email: 'mike@example.com', role: 'Editor', status: 'active' },
  { id: '3', name: 'Emma Wilson', email: 'emma@example.com', role: 'Editor', status: 'active' },
  { id: '4', name: 'John Doe', email: 'john@example.com', role: 'Viewer', status: 'active' },
  { id: '5', name: 'pending@example.com', email: 'pending@example.com', role: 'Editor', status: 'pending' },
];

const integrations = [
  { id: 'adobe', name: 'Adobe Creative Cloud', description: 'Connect Premiere Pro and After Effects', connected: true, icon: '🎬' },
  { id: 'slack', name: 'Slack', description: 'Get notifications in Slack channels', connected: true, icon: '💬' },
  { id: 'youtube', name: 'YouTube', description: 'Publish directly to YouTube', connected: false, icon: '▶️' },
  { id: 'vimeo', name: 'Vimeo', description: 'Publish directly to Vimeo', connected: false, icon: '🎥' },
  { id: 'drive', name: 'Google Drive', description: 'Import from Google Drive', connected: false, icon: '📁' },
  { id: 'dropbox', name: 'Dropbox', description: 'Sync with Dropbox', connected: false, icon: '📦' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <AppLayout title="Settings">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <Card padding="sm">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </aside>

        {/* Content */}
        <div className="flex-1">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-semibold text-gray-900">Workspace Settings</h2>
                <p className="mt-1 text-sm text-gray-500">Manage your workspace details and preferences</p>

                <div className="mt-6 space-y-6">
                  <div className="flex items-start gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary-100 text-2xl font-bold text-primary-600">
                      MT
                    </div>
                    <div>
                      <Button variant="secondary" size="sm" leftIcon={<Upload className="h-4 w-4" />}>
                        Upload Logo
                      </Button>
                      <p className="mt-2 text-xs text-gray-500">
                        Recommended: 200x200px, PNG or JPG
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Input label="Workspace Name" defaultValue="Marketing Team" />
                    <Input label="Workspace URL" defaultValue="marketing-team" helperText="motionatlas.io/marketing-team" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">Description</label>
                    <textarea
                      rows={3}
                      defaultValue="Creative assets for the marketing department"
                      className="block w-full rounded-lg border border-gray-400 bg-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-600 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-1">Default Timezone</label>
                      <select
                        defaultValue="America/New_York"
                        className="block w-full rounded-lg border border-gray-400 bg-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <optgroup label="Americas">
                          <option value="America/New_York">Eastern Time (ET) - New York</option>
                          <option value="America/Chicago">Central Time (CT) - Chicago</option>
                          <option value="America/Denver">Mountain Time (MT) - Denver</option>
                          <option value="America/Los_Angeles">Pacific Time (PT) - Los Angeles</option>
                          <option value="America/Anchorage">Alaska Time - Anchorage</option>
                          <option value="Pacific/Honolulu">Hawaii Time - Honolulu</option>
                          <option value="America/Toronto">Eastern Time - Toronto</option>
                          <option value="America/Vancouver">Pacific Time - Vancouver</option>
                          <option value="America/Mexico_City">Central Time - Mexico City</option>
                          <option value="America/Sao_Paulo">Brasilia Time - São Paulo</option>
                          <option value="America/Argentina/Buenos_Aires">Argentina Time - Buenos Aires</option>
                        </optgroup>
                        <optgroup label="Europe">
                          <option value="Europe/London">Greenwich Mean Time (GMT) - London</option>
                          <option value="Europe/Paris">Central European Time (CET) - Paris</option>
                          <option value="Europe/Berlin">Central European Time (CET) - Berlin</option>
                          <option value="Europe/Amsterdam">Central European Time (CET) - Amsterdam</option>
                          <option value="Europe/Madrid">Central European Time (CET) - Madrid</option>
                          <option value="Europe/Rome">Central European Time (CET) - Rome</option>
                          <option value="Europe/Stockholm">Central European Time (CET) - Stockholm</option>
                          <option value="Europe/Moscow">Moscow Time - Moscow</option>
                          <option value="Europe/Istanbul">Turkey Time - Istanbul</option>
                        </optgroup>
                        <optgroup label="Asia">
                          <option value="Asia/Dubai">Gulf Standard Time - Dubai</option>
                          <option value="Asia/Kolkata">India Standard Time - Mumbai</option>
                          <option value="Asia/Bangkok">Indochina Time - Bangkok</option>
                          <option value="Asia/Singapore">Singapore Time - Singapore</option>
                          <option value="Asia/Hong_Kong">Hong Kong Time - Hong Kong</option>
                          <option value="Asia/Shanghai">China Standard Time - Shanghai</option>
                          <option value="Asia/Tokyo">Japan Standard Time - Tokyo</option>
                          <option value="Asia/Seoul">Korea Standard Time - Seoul</option>
                        </optgroup>
                        <optgroup label="Australia & Pacific">
                          <option value="Australia/Perth">Australian Western Time - Perth</option>
                          <option value="Australia/Sydney">Australian Eastern Time - Sydney</option>
                          <option value="Australia/Melbourne">Australian Eastern Time - Melbourne</option>
                          <option value="Pacific/Auckland">New Zealand Time - Auckland</option>
                        </optgroup>
                        <optgroup label="Africa">
                          <option value="Africa/Cairo">Eastern European Time - Cairo</option>
                          <option value="Africa/Johannesburg">South Africa Time - Johannesburg</option>
                          <option value="Africa/Lagos">West Africa Time - Lagos</option>
                        </optgroup>
                        <optgroup label="UTC">
                          <option value="UTC">Coordinated Universal Time (UTC)</option>
                        </optgroup>
                      </select>
                    </div>
                    <Input label="Date Format" defaultValue="MM/DD/YYYY" />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="secondary">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </Card>

              <Card className="border-red-800 bg-red-950">
                <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
                <p className="mt-1 text-sm text-red-500">Irreversible and destructive actions</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-400">Delete Workspace</p>
                    <p className="text-sm text-red-500">Permanently delete this workspace and all its data</p>
                  </div>
                  <Button variant="danger">Delete Workspace</Button>
                </div>
              </Card>
            </div>
          )}

          {/* Members */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                    <p className="mt-1 text-sm text-gray-500">Manage who has access to this workspace</p>
                  </div>
                  <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowInviteModal(true)}>
                    Invite Member
                  </Button>
                </div>

                <div className="mt-6">
                  <table className="min-w-full divide-y divide-gray-400">
                    <thead>
                      <tr>
                        <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Member
                        </th>
                        <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Role
                        </th>
                        <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Status
                        </th>
                        <th className="py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-400">
                      {members.map((member) => (
                        <tr key={member.id}>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={member.name} size="sm" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                <p className="text-xs text-gray-500">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {member.role === 'Owner' && <Crown className="h-4 w-4 text-yellow-500" />}
                              <select
                                defaultValue={member.role}
                                disabled={member.role === 'Owner'}
                                className="rounded-md border-gray-400 bg-gray-300 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:bg-gray-400 disabled:text-gray-600"
                              >
                                <option>Owner</option>
                                <option>Editor</option>
                                <option>Viewer</option>
                              </select>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge variant={member.status === 'active' ? 'success' : 'warning'}>
                              {member.status}
                            </Badge>
                          </td>
                          <td className="py-4">
                            {member.role !== 'Owner' && (
                              <button className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Billing */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
                    <p className="mt-1 text-sm text-gray-500">You're currently on the Pro plan</p>
                  </div>
                  <Badge variant="info" size="md">Pro</Badge>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Storage Used</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">34.2 GB</p>
                    <p className="text-xs text-gray-500">of 100 GB</p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full w-[34%] rounded-full bg-primary-500" />
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Team Members</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">5</p>
                    <p className="text-xs text-gray-500">of 10 seats</p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Monthly Cost</p>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">$49</p>
                    <p className="text-xs text-gray-500">billed monthly</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button>Upgrade Plan</Button>
                  <Button variant="secondary">Manage Subscription</Button>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                <div className="mt-4 flex items-center gap-4 rounded-lg border border-gray-200 p-4">
                  <div className="flex h-10 w-14 items-center justify-center rounded bg-gray-100 text-lg font-bold">
                    💳
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/2027</p>
                  </div>
                  <Button variant="secondary" size="sm">Update</Button>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>
                <table className="mt-4 min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                      <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Description</th>
                      <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                      <th className="py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                      <th className="py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { date: 'Dec 1, 2025', description: 'Pro Plan - Monthly', amount: '$49.00', status: 'Paid' },
                      { date: 'Nov 1, 2025', description: 'Pro Plan - Monthly', amount: '$49.00', status: 'Paid' },
                      { date: 'Oct 1, 2025', description: 'Pro Plan - Monthly', amount: '$49.00', status: 'Paid' },
                    ].map((invoice, i) => (
                      <tr key={i}>
                        <td className="py-3 text-sm text-gray-900">{invoice.date}</td>
                        <td className="py-3 text-sm text-gray-500">{invoice.description}</td>
                        <td className="py-3 text-sm font-medium text-gray-900">{invoice.amount}</td>
                        <td className="py-3">
                          <Badge variant="success">{invoice.status}</Badge>
                        </td>
                        <td className="py-3">
                          <Button variant="ghost" size="sm">Download</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-semibold text-gray-900">Single Sign-On (SSO)</h2>
                <p className="mt-1 text-sm text-gray-500">Configure SAML or OIDC authentication for your organization</p>
                <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-6 text-center">
                  <Shield className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm font-medium text-gray-900">SSO is available on Enterprise plans</p>
                  <p className="mt-1 text-xs text-gray-500">Contact sales to enable SSO for your organization</p>
                  <Button variant="secondary" className="mt-4">Contact Sales</Button>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
                <p className="mt-1 text-sm text-gray-500">Require 2FA for all team members</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Enforce 2FA</p>
                    <p className="text-sm text-gray-500">All members must enable two-factor authentication</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-gray-200 transition-colors">
                    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform" />
                  </button>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-gray-900">Session Management</h2>
                <p className="mt-1 text-sm text-gray-500">Control session duration and security settings</p>
                <div className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input label="Session Timeout" defaultValue="30 days" />
                    <Input label="Max Concurrent Sessions" defaultValue="5" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Force Logout All Sessions</p>
                      <p className="text-sm text-gray-500">Sign out all users from all devices</p>
                    </div>
                    <Button variant="secondary">Force Logout</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-gray-900">Audit Log</h2>
                <p className="mt-1 text-sm text-gray-500">View and export security audit logs</p>
                <div className="mt-4 flex gap-3">
                  <Button variant="secondary">View Audit Log</Button>
                  <Button variant="secondary">Export (CSV)</Button>
                </div>
              </Card>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
              <p className="mt-1 text-sm text-gray-500">Configure how you receive notifications</p>
              <div className="mt-6 space-y-6">
                {[
                  { title: 'New Comments', description: 'When someone comments on your assets' },
                  { title: 'Mentions', description: 'When someone mentions you in a comment' },
                  { title: 'Approvals', description: 'When an asset needs your approval' },
                  { title: 'Uploads', description: 'When new assets are uploaded' },
                  { title: 'Share Activity', description: 'When shared links are accessed' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="text-sm text-gray-500">Email</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="text-sm text-gray-500">In-app</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button>Save Preferences</Button>
              </div>
            </Card>
          )}

          {/* Branding */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-semibold text-gray-900">Brand Colors</h2>
                <p className="mt-1 text-sm text-gray-500">Customize the appearance of shared portals</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary-600" />
                      <Input defaultValue="#0284c7" className="flex-1" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-600" />
                      <Input defaultValue="#9333ea" className="flex-1" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold text-gray-900">Custom Domain</h2>
                <p className="mt-1 text-sm text-gray-500">Use your own domain for shared portals</p>
                <div className="mt-4">
                  <Input label="Custom Domain" placeholder="assets.yourcompany.com" helperText="Add a CNAME record pointing to portal.motionatlas.io" />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button>Verify Domain</Button>
                </div>
              </Card>
            </div>
          )}

          {/* Integrations */}
          {activeTab === 'integrations' && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900">Integrations</h2>
              <p className="mt-1 text-sm text-gray-500">Connect Motion Atlas with your favorite tools</p>
              <div className="mt-6 space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-2xl">
                        {integration.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{integration.name}</p>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                      </div>
                    </div>
                    {integration.connected ? (
                      <div className="flex items-center gap-3">
                        <Badge variant="success">Connected</Badge>
                        <Button variant="secondary" size="sm">Configure</Button>
                      </div>
                    ) : (
                      <Button variant="secondary" size="sm" leftIcon={<ExternalLink className="h-4 w-4" />}>
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-dashed border-gray-300 p-6 text-center">
                <LinkIcon className="mx-auto h-10 w-10 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">API & Webhooks</p>
                <p className="mt-1 text-xs text-gray-500">Build custom integrations with our API</p>
                <Button variant="secondary" className="mt-4">View API Documentation</Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Members"
        description="Send invitations to join your workspace"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Email Addresses</label>
            <textarea
              rows={3}
              placeholder="Enter email addresses, separated by commas"
              className="block w-full rounded-lg border border-gray-400 bg-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Role</label>
            <select className="block w-full rounded-lg border border-gray-400 bg-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <option>Viewer</option>
              <option>Editor</option>
            </select>
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

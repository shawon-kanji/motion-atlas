import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { Card, Button, Avatar } from '@/components/ui';
import {
  Upload,
  FolderOpen,
  TrendingUp,
  Clock,
  Play,
  MoreHorizontal,
  Video,
  Image,
  FileText,
  Plus,
} from 'lucide-react';

// Mock data
const stats = [
  { name: 'Total Assets', value: '2,847', change: '+12%', icon: FolderOpen },
  { name: 'Storage Used', value: '34.2 GB', change: '+4.3 GB', icon: TrendingUp },
  { name: 'Team Views', value: '1,234', change: '+23%', icon: Play },
  { name: 'Recent Uploads', value: '47', change: 'this week', icon: Upload },
];

const recentAssets = [
  {
    id: '1',
    name: 'Product Demo Q4.mp4',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop',
    duration: '2:34',
    size: '245 MB',
    updatedAt: '2 hours ago',
    owner: { name: 'Sarah Chen', avatar: null },
  },
  {
    id: '2',
    name: 'Brand Guidelines 2026.pdf',
    type: 'document',
    thumbnail: null,
    size: '12 MB',
    updatedAt: '5 hours ago',
    owner: { name: 'Mike Johnson', avatar: null },
  },
  {
    id: '3',
    name: 'Hero Banner Campaign.png',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=200&fit=crop',
    size: '4.2 MB',
    updatedAt: '1 day ago',
    owner: { name: 'Emma Wilson', avatar: null },
  },
  {
    id: '4',
    name: 'Customer Testimonial.mp4',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
    duration: '1:45',
    size: '156 MB',
    updatedAt: '2 days ago',
    owner: { name: 'John Doe', avatar: null },
  },
];

const recentActivity = [
  { id: '1', user: 'Sarah Chen', action: 'uploaded', target: 'Product Demo Q4.mp4', time: '2 hours ago' },
  { id: '2', user: 'Mike Johnson', action: 'commented on', target: 'Brand Guidelines 2026.pdf', time: '5 hours ago' },
  { id: '3', user: 'Emma Wilson', action: 'approved', target: 'Hero Banner Campaign.png', time: '1 day ago' },
  { id: '4', user: 'John Doe', action: 'shared', target: 'Customer Testimonial.mp4', time: '2 days ago' },
];

function getAssetIcon(type: string) {
  switch (type) {
    case 'video':
      return Video;
    case 'image':
      return Image;
    default:
      return FileText;
  }
}

export default function Home() {
  return (
    <AppLayout title="Dashboard">
      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-3">
        <Button leftIcon={<Upload className="h-4 w-4" />}>
          Upload Assets
        </Button>
        <Button variant="secondary" leftIcon={<FolderOpen className="h-4 w-4" />}>
          Create Folder
        </Button>
        <Button variant="secondary" leftIcon={<Plus className="h-4 w-4" />}>
          New Collection
        </Button>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} padding="md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-green-600">{stat.change}</p>
              </div>
              <div className="rounded-lg bg-primary-50 p-2">
                <stat.icon className="h-5 w-5 text-primary-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Assets */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Assets</h2>
            <Link to="/assets" className="text-sm font-medium text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {recentAssets.map((asset) => {
              const Icon = getAssetIcon(asset.type);
              return (
                <Card key={asset.id} padding="none" className="overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-100">
                    {asset.thumbnail ? (
                      <img
                        src={asset.thumbnail}
                        alt={asset.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Icon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {asset.duration && (
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                        <Play className="h-3 w-3" />
                        {asset.duration}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-medium text-gray-900">
                          {asset.name}
                        </h3>
                        <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <span>{asset.size}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {asset.updatedAt}
                          </span>
                        </p>
                      </div>
                      <button className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Avatar name={asset.owner.name} size="xs" />
                      <span className="text-xs text-gray-500">{asset.owner.name}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <Card padding="none">
            <ul className="divide-y divide-gray-100">
              {recentActivity.map((activity) => (
                <li key={activity.id} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <Avatar name={activity.user} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-gray-500">{activity.action}</span>{' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 p-3">
              <Link
                to="/activity"
                className="block text-center text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all activity
              </Link>
            </div>
          </Card>

          {/* Storage Usage */}
          <Card className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900">Storage Usage</h3>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">34.2 GB of 50 GB used</span>
                <span className="font-medium text-gray-900">68%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[68%] rounded-full bg-primary-500" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-gray-500">Videos</span>
                  </div>
                  <span className="font-medium">24.8 GB</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-gray-500">Images</span>
                  </div>
                  <span className="font-medium">6.2 GB</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="text-gray-500">Documents</span>
                  </div>
                  <span className="font-medium">3.2 GB</span>
                </div>
              </div>
            </div>
            <Button variant="secondary" className="mt-4 w-full" size="sm">
              Upgrade Storage
            </Button>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

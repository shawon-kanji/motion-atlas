import type { Asset, Folder, Collection, AssetVersion, Comment } from '../stores/assetStore';

// Sample video URLs (using public domain videos)
const SAMPLE_VIDEOS = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
];

// Sample thumbnails
const SAMPLE_THUMBNAILS = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
];

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800',
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
  'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
];

export const mockFolders: Folder[] = [
  {
    id: 'folder-1',
    name: 'Marketing Videos',
    parentId: null,
    assetCount: 12,
    createdAt: '2025-12-15T10:00:00Z',
    updatedAt: '2025-12-28T14:30:00Z',
  },
  {
    id: 'folder-2',
    name: 'Product Demos',
    parentId: null,
    assetCount: 8,
    createdAt: '2025-12-10T09:00:00Z',
    updatedAt: '2025-12-27T11:00:00Z',
  },
  {
    id: 'folder-3',
    name: 'Social Media',
    parentId: null,
    assetCount: 24,
    createdAt: '2025-12-08T15:00:00Z',
    updatedAt: '2025-12-29T09:00:00Z',
  },
  {
    id: 'folder-4',
    name: 'Brand Assets',
    parentId: null,
    assetCount: 15,
    createdAt: '2025-11-20T08:00:00Z',
    updatedAt: '2025-12-25T16:00:00Z',
  },
  {
    id: 'folder-5',
    name: 'Q4 Campaign',
    parentId: 'folder-1',
    assetCount: 6,
    createdAt: '2025-12-20T11:00:00Z',
    updatedAt: '2025-12-28T10:00:00Z',
  },
];

export const mockCollections: Collection[] = [
  {
    id: 'collection-1',
    name: 'Featured Content',
    description: 'Top performing content for homepage',
    color: '#3B82F6',
    assetCount: 8,
    isPublic: false,
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-28T14:00:00Z',
  },
  {
    id: 'collection-2',
    name: 'Approved for Publishing',
    description: 'Content ready for external use',
    color: '#10B981',
    assetCount: 15,
    isPublic: true,
    createdAt: '2025-12-05T09:00:00Z',
    updatedAt: '2025-12-29T11:00:00Z',
  },
  {
    id: 'collection-3',
    name: 'Needs Review',
    description: 'Pending approval',
    color: '#F59E0B',
    assetCount: 5,
    isPublic: false,
    createdAt: '2025-12-10T14:00:00Z',
    updatedAt: '2025-12-27T16:00:00Z',
  },
];

export const mockAssets: Asset[] = [
  {
    id: 'asset-1',
    name: 'Big Buck Bunny',
    type: 'video',
    thumbnail: SAMPLE_THUMBNAILS[0],
    url: SAMPLE_VIDEOS[0],
    size: 158008374,
    duration: 596,
    width: 1920,
    height: 1080,
    format: 'mp4',
    status: 'ready',
    folderId: 'folder-1',
    collectionIds: ['collection-1', 'collection-2'],
    tags: ['animation', 'featured', 'bunny'],
    metadata: {
      codec: 'H.264',
      bitrate: '2.1 Mbps',
      framerate: '24fps',
    },
    createdAt: '2025-12-20T10:30:00Z',
    updatedAt: '2025-12-28T14:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'asset-2',
    name: 'Elephants Dream',
    type: 'video',
    thumbnail: SAMPLE_THUMBNAILS[1],
    url: SAMPLE_VIDEOS[1],
    size: 228825531,
    duration: 653,
    width: 1920,
    height: 1080,
    format: 'mp4',
    status: 'ready',
    folderId: 'folder-1',
    collectionIds: ['collection-1'],
    tags: ['animation', 'surreal', 'elephants'],
    metadata: {
      codec: 'H.264',
      bitrate: '2.8 Mbps',
      framerate: '24fps',
    },
    createdAt: '2025-12-18T09:00:00Z',
    updatedAt: '2025-12-26T11:30:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'asset-3',
    name: 'For Bigger Blazes',
    type: 'video',
    thumbnail: SAMPLE_THUMBNAILS[2],
    url: SAMPLE_VIDEOS[2],
    size: 2299653,
    duration: 15,
    width: 1280,
    height: 720,
    format: 'mp4',
    status: 'ready',
    folderId: 'folder-2',
    collectionIds: ['collection-2'],
    tags: ['promo', 'short', 'action'],
    metadata: {
      codec: 'H.264',
      bitrate: '1.2 Mbps',
      framerate: '30fps',
    },
    createdAt: '2025-12-22T14:00:00Z',
    updatedAt: '2025-12-27T09:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'asset-4',
    name: 'For Bigger Escapes',
    type: 'video',
    thumbnail: SAMPLE_THUMBNAILS[3],
    url: SAMPLE_VIDEOS[3],
    size: 4299875,
    duration: 15,
    width: 1280,
    height: 720,
    format: 'mp4',
    status: 'ready',
    folderId: 'folder-2',
    collectionIds: [],
    tags: ['promo', 'adventure'],
    metadata: {
      codec: 'H.264',
      bitrate: '2.3 Mbps',
      framerate: '30fps',
    },
    createdAt: '2025-12-21T11:00:00Z',
    updatedAt: '2025-12-25T15:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'asset-5',
    name: 'For Bigger Fun',
    type: 'video',
    thumbnail: SAMPLE_THUMBNAILS[4],
    url: SAMPLE_VIDEOS[4],
    size: 2123456,
    duration: 15,
    width: 1280,
    height: 720,
    format: 'mp4',
    status: 'ready',
    folderId: 'folder-3',
    collectionIds: ['collection-3'],
    tags: ['promo', 'fun', 'colorful'],
    metadata: {
      codec: 'H.264',
      bitrate: '1.1 Mbps',
      framerate: '30fps',
    },
    createdAt: '2025-12-23T16:00:00Z',
    updatedAt: '2025-12-28T10:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'asset-6',
    name: 'Product Photography',
    type: 'image',
    thumbnail: SAMPLE_IMAGES[0],
    url: SAMPLE_IMAGES[0],
    size: 2456789,
    width: 4000,
    height: 2667,
    format: 'jpg',
    status: 'ready',
    folderId: 'folder-4',
    collectionIds: ['collection-2'],
    tags: ['product', 'photography', 'lighting'],
    metadata: {
      camera: 'Canon EOS R5',
      lens: '24-70mm f/2.8',
      iso: '100',
    },
    createdAt: '2025-12-19T13:00:00Z',
    updatedAt: '2025-12-24T17:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'asset-7',
    name: 'Behind the Scenes',
    type: 'image',
    thumbnail: SAMPLE_IMAGES[1],
    url: SAMPLE_IMAGES[1],
    size: 1876543,
    width: 3500,
    height: 2333,
    format: 'jpg',
    status: 'ready',
    folderId: 'folder-4',
    collectionIds: [],
    tags: ['bts', 'production', 'team'],
    metadata: {
      camera: 'Sony A7III',
      lens: '35mm f/1.4',
      iso: '400',
    },
    createdAt: '2025-12-17T10:00:00Z',
    updatedAt: '2025-12-23T12:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'asset-8',
    name: 'Video Production Setup',
    type: 'image',
    thumbnail: SAMPLE_IMAGES[2],
    url: SAMPLE_IMAGES[2],
    size: 3234567,
    width: 4500,
    height: 3000,
    format: 'jpg',
    status: 'ready',
    folderId: null,
    collectionIds: ['collection-1'],
    tags: ['studio', 'equipment', 'setup'],
    metadata: {
      camera: 'Nikon Z6',
      lens: '14-24mm f/2.8',
      iso: '200',
    },
    createdAt: '2025-12-16T08:00:00Z',
    updatedAt: '2025-12-22T14:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'asset-9',
    name: 'Film Set Wide Shot',
    type: 'image',
    thumbnail: SAMPLE_IMAGES[3],
    url: SAMPLE_IMAGES[3],
    size: 2987654,
    width: 5000,
    height: 3333,
    format: 'jpg',
    status: 'ready',
    folderId: null,
    collectionIds: [],
    tags: ['film', 'set', 'production'],
    metadata: {
      camera: 'RED Komodo',
      lens: 'Zeiss 21mm',
      iso: '800',
    },
    createdAt: '2025-12-15T15:00:00Z',
    updatedAt: '2025-12-21T11:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: 'asset-10',
    name: 'Processing Video',
    type: 'video',
    thumbnail: SAMPLE_THUMBNAILS[0],
    url: SAMPLE_VIDEOS[0],
    size: 52000000,
    duration: 180,
    width: 3840,
    height: 2160,
    format: 'mp4',
    status: 'processing',
    folderId: 'folder-1',
    collectionIds: [],
    tags: ['4k', 'raw'],
    metadata: {},
    createdAt: '2025-12-29T08:00:00Z',
    updatedAt: '2025-12-29T08:00:00Z',
    createdBy: 'user-1',
  },
];

export const mockVersions: Record<string, AssetVersion[]> = {
  'asset-1': [
    {
      id: 'version-1-3',
      assetId: 'asset-1',
      version: 3,
      url: SAMPLE_VIDEOS[0],
      size: 158008374,
      createdAt: '2025-12-28T14:00:00Z',
      createdBy: 'user-1',
      comment: 'Final color grading applied',
    },
    {
      id: 'version-1-2',
      assetId: 'asset-1',
      version: 2,
      url: SAMPLE_VIDEOS[0],
      size: 155000000,
      createdAt: '2025-12-25T10:00:00Z',
      createdBy: 'user-1',
      comment: 'Audio sync fixed',
    },
    {
      id: 'version-1-1',
      assetId: 'asset-1',
      version: 1,
      url: SAMPLE_VIDEOS[0],
      size: 160000000,
      createdAt: '2025-12-20T10:30:00Z',
      createdBy: 'user-1',
      comment: 'Initial upload',
    },
  ],
  'asset-2': [
    {
      id: 'version-2-1',
      assetId: 'asset-2',
      version: 1,
      url: SAMPLE_VIDEOS[1],
      size: 228825531,
      createdAt: '2025-12-18T09:00:00Z',
      createdBy: 'user-1',
      comment: 'Initial upload',
    },
  ],
};

export const mockComments: Record<string, Comment[]> = {
  'asset-1': [
    {
      id: 'comment-1',
      assetId: 'asset-1',
      userId: 'user-1',
      userName: 'Demo User',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      content: 'Great opening sequence! The color grading looks perfect.',
      timestamp: 12.5,
      createdAt: '2025-12-27T10:30:00Z',
      replies: [
        {
          id: 'comment-1-1',
          assetId: 'asset-1',
          userId: 'user-2',
          userName: 'Sarah Chen',
          content: 'Agreed! The lighting transition at this point is smooth.',
          createdAt: '2025-12-27T11:00:00Z',
        },
      ],
    },
    {
      id: 'comment-2',
      assetId: 'asset-1',
      userId: 'user-3',
      userName: 'Mike Johnson',
      content: 'Can we extend this scene by 2 seconds? The pacing feels a bit rushed.',
      timestamp: 45.0,
      createdAt: '2025-12-26T14:00:00Z',
      replies: [],
    },
    {
      id: 'comment-3',
      assetId: 'asset-1',
      userId: 'user-2',
      userName: 'Sarah Chen',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face',
      content: 'Audio levels are perfect in this version. Approved for publishing!',
      createdAt: '2025-12-28T09:00:00Z',
      replies: [],
    },
  ],
  'asset-2': [
    {
      id: 'comment-4',
      assetId: 'asset-2',
      userId: 'user-1',
      userName: 'Demo User',
      content: 'Interesting visual style. Let\'s discuss the color palette in our next meeting.',
      createdAt: '2025-12-25T16:00:00Z',
      replies: [],
    },
  ],
};

// Team members mock data
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'pending' | 'deactivated';
  lastActive?: string;
  joinedAt: string;
}

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    role: 'owner',
    status: 'active',
    lastActive: '2025-12-29T10:00:00Z',
    joinedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face',
    role: 'admin',
    status: 'active',
    lastActive: '2025-12-29T09:30:00Z',
    joinedAt: '2025-03-20T14:00:00Z',
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    role: 'member',
    status: 'active',
    lastActive: '2025-12-28T17:00:00Z',
    joinedAt: '2025-06-10T09:00:00Z',
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    role: 'member',
    status: 'active',
    lastActive: '2025-12-27T14:30:00Z',
    joinedAt: '2025-08-05T11:00:00Z',
  },
  {
    id: 'user-5',
    name: 'Alex Thompson',
    email: 'alex@example.com',
    role: 'viewer',
    status: 'pending',
    joinedAt: '2025-12-28T10:00:00Z',
  },
];

// Activity log mock data
export interface ActivityItem {
  id: string;
  type: 'upload' | 'comment' | 'share' | 'download' | 'edit' | 'delete' | 'approve';
  userId: string;
  userName: string;
  userAvatar?: string;
  assetId?: string;
  assetName?: string;
  description: string;
  createdAt: string;
}

export const mockActivity: ActivityItem[] = [
  {
    id: 'activity-1',
    type: 'upload',
    userId: 'user-1',
    userName: 'Demo User',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    assetId: 'asset-10',
    assetName: 'Processing Video',
    description: 'uploaded a new video',
    createdAt: '2025-12-29T08:00:00Z',
  },
  {
    id: 'activity-2',
    type: 'approve',
    userId: 'user-2',
    userName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=face',
    assetId: 'asset-1',
    assetName: 'Big Buck Bunny',
    description: 'approved for publishing',
    createdAt: '2025-12-28T14:00:00Z',
  },
  {
    id: 'activity-3',
    type: 'comment',
    userId: 'user-3',
    userName: 'Mike Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    assetId: 'asset-1',
    assetName: 'Big Buck Bunny',
    description: 'left a comment',
    createdAt: '2025-12-26T14:00:00Z',
  },
  {
    id: 'activity-4',
    type: 'share',
    userId: 'user-1',
    userName: 'Demo User',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    assetId: 'asset-6',
    assetName: 'Product Photography',
    description: 'shared externally',
    createdAt: '2025-12-25T11:00:00Z',
  },
  {
    id: 'activity-5',
    type: 'download',
    userId: 'user-4',
    userName: 'Emily Davis',
    assetId: 'asset-2',
    assetName: 'Elephants Dream',
    description: 'downloaded',
    createdAt: '2025-12-24T16:30:00Z',
  },
];

// Stats mock data
export interface DashboardStats {
  totalAssets: number;
  totalStorage: number;
  storageLimit: number;
  processingCount: number;
  teamMembers: number;
  recentUploads: number;
}

export const mockStats: DashboardStats = {
  totalAssets: 156,
  totalStorage: 12.5 * 1024 * 1024 * 1024, // 12.5 GB
  storageLimit: 50 * 1024 * 1024 * 1024, // 50 GB
  processingCount: 3,
  teamMembers: 5,
  recentUploads: 24,
};

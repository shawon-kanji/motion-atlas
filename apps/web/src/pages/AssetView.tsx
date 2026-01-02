import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout';
import { Button, Card, Badge, Avatar, Modal, Input } from '@/components/ui';
import { clsx } from 'clsx';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  Share2,
  Clock,
  Folder,
  Send,
  AtSign,
  History,
  Copy,
  Mail,
} from 'lucide-react';
import { useAsset, useAssetVersions, useAssetComments, useAddComment } from '@/api/assets';
import { useAuthStore } from '@/stores/authStore';
import type { Comment } from '@/stores/assetStore';

// Fallback mock data for when API is loading
const fallbackAsset = {
  id: '1',
  name: 'Product Demo Q4.mp4',
  type: 'video' as const,
  description: 'Quarterly product demo showcasing new features and improvements.',
  thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
  url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  duration: 596,
  size: 158008374,
  width: 1920,
  height: 1080,
  format: 'mp4',
  status: 'ready' as const,
  createdAt: '2025-12-15T10:00:00Z',
  updatedAt: '2025-12-28T14:00:00Z',
  createdBy: 'user-1',
  folderId: 'folder-1',
  collectionIds: ['collection-1'],
  tags: ['product', 'demo', 'Q4', 'marketing'],
  metadata: { codec: 'H.264', bitrate: '2.1 Mbps', framerate: '24fps' },
};

const fallbackVersions = [
  { id: 'v1', assetId: '1', version: 3, url: '', size: 158008374, createdAt: '2025-12-28T14:00:00Z', createdBy: 'user-1', comment: 'Final version' },
  { id: 'v2', assetId: '1', version: 2, url: '', size: 155000000, createdAt: '2025-12-25T10:00:00Z', createdBy: 'user-1', comment: 'Audio sync fixed' },
  { id: 'v3', assetId: '1', version: 1, url: '', size: 160000000, createdAt: '2025-12-20T10:30:00Z', createdBy: 'user-1', comment: 'Initial upload' },
];

const fallbackComments: Comment[] = [
  {
    id: '1',
    assetId: '1',
    userId: 'user-2',
    userName: 'Mike Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    timestamp: 45,
    content: 'Great intro sequence! The transitions are smooth.',
    createdAt: '2025-12-27T10:00:00Z',
    replies: [
      {
        id: '2',
        assetId: '1',
        userId: 'user-1',
        userName: 'Sarah Chen',
        content: 'Thanks! I used the new motion blur effect.',
        createdAt: '2025-12-27T11:00:00Z',
      },
    ],
  },
];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB';
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return bytes + ' bytes';
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function AssetView() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  // Video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // UI state
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'comments' | 'details' | 'activity'>('comments');

  // Fetch data
  const { data: asset } = useAsset(id || 'asset-1');
  const { data: versions } = useAssetVersions(id || 'asset-1');
  const { data: comments } = useAssetComments(id || 'asset-1');
  const addComment = useAddComment();

  const currentAsset = asset || fallbackAsset;
  const currentVersions = versions || fallbackVersions;
  const currentComments = comments || fallbackComments;
  const latestVersion = currentVersions[0];

  // Video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;

    addComment.mutate({
      assetId: currentAsset.id,
      content: newComment,
      timestamp: currentTime,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
    });

    setNewComment('');
  };

  // Sync video state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link
            to="/assets"
            className="mt-1 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">{currentAsset.name}</h1>
              <Badge variant="info">v{latestVersion?.version || 1}</Badge>
            </div>
            <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
              {currentAsset.folderId && (
                <span className="flex items-center gap-1">
                  <Folder className="h-4 w-4" />
                  Assets
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTimeAgo(currentAsset.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<History className="h-4 w-4" />}
            onClick={() => setShowVersions(!showVersions)}
          >
            Versions ({currentVersions.length})
          </Button>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Share2 className="h-4 w-4" />}
            onClick={() => setShowShareModal(true)}
          >
            Share
          </Button>
          <Button
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => window.open(currentAsset.url, '_blank')}
          >
            Download
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <Card padding="none" className="overflow-hidden">
            {/* Player */}
            <div className="relative aspect-video bg-black">
              {currentAsset.type === 'video' ? (
                <>
                  <video
                    ref={videoRef}
                    src={currentAsset.url}
                    poster={currentAsset.thumbnail}
                    className="h-full w-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={togglePlay}
                    playsInline
                  />
                  {/* Play Button Overlay - only show when paused */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={togglePlay}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-transform hover:scale-110"
                      >
                        <Play className="h-8 w-8 ml-1" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <img
                  src={currentAsset.url}
                  alt={currentAsset.name}
                  className="h-full w-full object-contain"
                />
              )}
              {/* Duration Badge */}
              {currentAsset.type === 'video' && duration > 0 && (
                <div className="absolute bottom-4 right-4 rounded bg-black/70 px-2 py-1 text-sm text-white">
                  {formatDuration(duration)}
                </div>
              )}
            </div>

            {/* Controls - only for video */}
            {currentAsset.type === 'video' && (
              <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-200"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-200"
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </button>
                    <span className="text-sm text-gray-500">
                      {formatDuration(currentTime)} / {formatDuration(duration)}
                    </span>
                  </div>
                  <button
                    onClick={handleFullscreen}
                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-200"
                  >
                    <Maximize className="h-5 w-5" />
                  </button>
                </div>
                {/* Progress Bar */}
                <div
                  className="mt-2 h-1 cursor-pointer rounded-full bg-gray-200"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Tabs */}
          <div className="mt-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex gap-6">
                {(['comments', 'details', 'activity'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      'border-b-2 pb-3 text-sm font-medium capitalize transition-colors',
                      activeTab === tab
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    {tab}
                    {tab === 'comments' && (
                      <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {currentComments.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="mt-6">
                {/* Comment Input */}
                <div className="flex gap-3">
                  <Avatar name={user?.name || 'Guest'} src={user?.avatar} size="sm" />
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        placeholder={`Add a comment at ${formatDuration(currentTime)}...`}
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-4 pr-24 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                        <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                          <AtSign className="h-4 w-4" />
                        </button>
                        <span className="text-xs text-gray-400 px-1">
                          {formatDuration(currentTime)}
                        </span>
                        <button
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || addComment.isPending}
                          className="rounded bg-primary-600 p-1 text-white hover:bg-primary-700 disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="mt-6 space-y-6">
                  {currentComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar name={comment.userName} src={comment.userAvatar} size="sm" />
                      <div className="flex-1">
                        <div className="rounded-lg bg-gray-50 p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.userName}
                            </span>
                            {comment.timestamp !== undefined && (
                              <button
                                onClick={() => {
                                  if (videoRef.current) {
                                    videoRef.current.currentTime = comment.timestamp!;
                                  }
                                }}
                                className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-medium text-primary-700 hover:bg-primary-200"
                              >
                                {formatDuration(comment.timestamp)}
                              </button>
                            )}
                            <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
                        </div>
                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-6 mt-3 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-3">
                                <Avatar name={reply.userName} src={reply.userAvatar} size="xs" />
                                <div className="flex-1 rounded-lg bg-gray-50 p-3">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">
                                      {reply.userName}
                                    </span>
                                    <span className="text-xs text-gray-500">{formatTimeAgo(reply.createdAt)}</span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-700">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <button className="mt-2 text-xs font-medium text-gray-500 hover:text-gray-700">
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="mt-6">
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Format</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentAsset.format.toUpperCase()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Resolution</dt>
                    <dd className="mt-1 text-sm text-gray-900">{currentAsset.width}x{currentAsset.height}</dd>
                  </div>
                  {currentAsset.duration && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Duration</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDuration(currentAsset.duration)}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">File Size</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatFileSize(currentAsset.size)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatTimeAgo(currentAsset.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize">{currentAsset.status}</dd>
                  </div>
                  {currentAsset.tags.length > 0 && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">Tags</dt>
                      <dd className="mt-2 flex flex-wrap gap-2">
                        {currentAsset.tags.map((tag) => (
                          <Badge key={tag} variant="default">{tag}</Badge>
                        ))}
                      </dd>
                    </div>
                  )}
                  {Object.keys(currentAsset.metadata).length > 0 && (
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Metadata</dt>
                      <dd className="grid gap-2 sm:grid-cols-3">
                        {Object.entries(currentAsset.metadata).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="text-gray-500 capitalize">{key}:</span>{' '}
                            <span className="text-gray-900">{value}</span>
                          </div>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="mt-6">
                <div className="space-y-4">
                  {[
                    { user: 'Sarah Chen', action: 'uploaded a new version', time: '2 hours ago' },
                    { user: 'Mike Johnson', action: 'commented', time: '5 hours ago' },
                    { user: 'Emma Wilson', action: 'viewed', time: '1 day ago' },
                    { user: 'John Doe', action: 'downloaded', time: '2 days ago' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar name={activity.user} size="sm" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span>{' '}
                          <span className="text-gray-500">{activity.action}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Uploaded By */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900">Uploaded By</h3>
            <div className="mt-3 flex items-center gap-3">
              <Avatar name={user?.name || 'Unknown'} src={user?.avatar} size="md" />
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Unknown'}</p>
                <p className="text-xs text-gray-500">{user?.email || ''}</p>
              </div>
            </div>
          </Card>

          {/* Tags */}
          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Tags</h3>
              <button className="text-xs font-medium text-primary-600 hover:text-primary-500">
                Edit
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {currentAsset.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </Card>

          {/* Versions Panel */}
          {showVersions && (
            <Card>
              <h3 className="text-sm font-semibold text-gray-900">Version History</h3>
              <ul className="mt-3 space-y-3">
                {currentVersions.map((version, idx) => (
                  <li key={version.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={clsx(
                        'h-2 w-2 rounded-full',
                        idx === 0 ? 'bg-green-500' : 'bg-gray-300'
                      )} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          v{version.version}
                          {idx === 0 && (
                            <span className="ml-2 text-xs text-green-600">(current)</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {version.comment} • {formatTimeAgo(version.createdAt)}
                        </p>
                      </div>
                    </div>
                    {idx !== 0 && (
                      <Button variant="ghost" size="sm">Restore</Button>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <h3 className="text-sm font-semibold text-gray-900">File Info</h3>
            <dl className="mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">File Size</dt>
                <dd className="text-sm font-medium text-gray-900">{formatFileSize(currentAsset.size)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Versions</dt>
                <dd className="text-sm font-medium text-gray-900">{currentVersions.length}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-500">Comments</dt>
                <dd className="text-sm font-medium text-gray-900">{currentComments.length}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Asset"
        description="Share this asset with your team or create a public link"
        size="md"
      >
        <div className="space-y-6">
          {/* Share Link */}
          <div>
            <label className="text-sm font-medium text-gray-700">Share Link</label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                readOnly
                value={`https://motionatlas.io/share/${currentAsset.id}`}
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
              />
              <Button
                variant="secondary"
                leftIcon={<Copy className="h-4 w-4" />}
                onClick={() => navigator.clipboard.writeText(`https://motionatlas.io/share/${currentAsset.id}`)}
              >
                Copy
              </Button>
            </div>
          </div>

          {/* Link Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Password Protection</p>
                <p className="text-xs text-gray-500">Require a password to view</p>
              </div>
              <button className="relative h-6 w-11 rounded-full bg-gray-200 transition-colors">
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Expiration Date</p>
                <p className="text-xs text-gray-500">Link expires after set date</p>
              </div>
              <button className="relative h-6 w-11 rounded-full bg-gray-200 transition-colors">
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Allow Downloads</p>
                <p className="text-xs text-gray-500">Viewers can download the file</p>
              </div>
              <button className="relative h-6 w-11 rounded-full bg-primary-600 transition-colors">
                <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform" />
              </button>
            </div>
          </div>

          {/* Invite by Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Invite by Email</label>
            <div className="mt-2 flex gap-2">
              <Input placeholder="Enter email addresses" />
              <Button leftIcon={<Mail className="h-4 w-4" />}>Send</Button>
            </div>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
}

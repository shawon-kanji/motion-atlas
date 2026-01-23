import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import { Button, Card, Badge } from "@/components/ui";
import { clsx } from "clsx";
import {
  Upload as UploadIcon,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  FolderOpen,
  Image,
  Video,
  FileText,
} from "lucide-react";
import { FolderPicker } from "@/components/FolderPicker";
import { useCreateAsset, useFolder } from "@/api/assets";
import { useAuthStore } from "@/stores/authStore";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  error?: string;
}

function getFileIcon(type: string) {
  if (type.startsWith("video/")) return Video;
  if (type.startsWith("image/")) return Image;
  return FileText;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function Upload() {
  const [searchParams] = useSearchParams();
  const initialFolderId = searchParams.get("folderId");
  const { workspace } = useAuthStore();
  const createAsset = useCreateAsset();

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    initialFolderId,
  );
  const [isFolderPickerOpen, setIsFolderPickerOpen] = useState(false);

  // Fetch folder details if selected
  const { data: currentFolder } = useFolder(selectedFolderId);

  useEffect(() => {
    setSelectedFolderId(initialFolderId);
  }, [initialFolderId]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
    // Reset input
    if (e.target) {
        e.target.value = '';
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: "pending",
    }));

    setFiles((prev) => [...prev, ...uploadFiles]);
  };

  // Auto-upload effect
  useEffect(() => {
    if (!workspace) return;

    const pendingFiles = files.filter(f => f.status === "pending");

    pendingFiles.forEach(async (fileObj) => {
      // Mark as uploading
      setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'uploading' } : f));

      try {
        await createAsset.mutateAsync({
          file: fileObj.file,
          name: fileObj.file.name,
          workspaceId: workspace.id,
          folderId: selectedFolderId
        });

        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'complete', progress: 100 } : f));
      } catch (err) {
        console.error("Upload failed", err);
        setFiles(prev => prev.map(f => f.id === fileObj.id ? { ...f, status: 'error', error: 'Upload failed' } : f));
      }
    });
  }, [files, workspace, selectedFolderId, createAsset]);


  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const completedFiles = files.filter((f) => f.status === "complete").length;
  const uploadingFiles = files.filter(
    (f) => f.status === "uploading" || f.status === "processing",
  ).length;

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId);
  };

  return (
    <AppLayout title="Upload">
      <div className="mx-auto max-w-4xl">
        {/* Destination Folder */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Upload to</p>
                <p className="text-sm text-gray-500">
                  {selectedFolderId && currentFolder
                    ? `/${currentFolder.name}` // Simplified path for now
                    : "Root folder"}
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setIsFolderPickerOpen(true)}>
              Change Folder
            </Button>
          </div>
        </Card>

        {/* Drop Zone */}
        <Card padding="none">
          <div
            className={clsx(
              "relative rounded-xl border-2 border-dashed p-12 text-center transition-colors",
              isDragActive
                ? "border-primary-500 bg-primary-50"
                : "border-gray-300 hover:border-gray-400",
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
              accept="video/*,image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            />
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  "mb-4 rounded-full p-4",
                  isDragActive ? "bg-primary-100" : "bg-gray-100",
                )}
              >
                <UploadIcon
                  className={clsx(
                    "h-8 w-8",
                    isDragActive ? "text-primary-600" : "text-gray-400",
                  )}
                />
              </div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? "Drop files here" : "Drag and drop files here"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                or click to browse from your computer
              </p>
              <p className="mt-4 text-xs text-gray-400">
                Supports video, images, and documents up to 50GB
              </p>
            </div>
          </div>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Uploads</h2>
                <p className="text-sm text-gray-500">
                  {completedFiles} of {files.length} complete
                  {uploadingFiles > 0 && ` • ${uploadingFiles} uploading`}
                </p>
              </div>
              {completedFiles === files.length && files.length > 0 && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFiles([])}
                >
                  Clear All
                </Button>
              )}
            </div>

            <ul className="mt-4 divide-y divide-gray-100">
              {files.map((uploadFile) => {
                const Icon = getFileIcon(uploadFile.file.type);
                return (
                  <li
                    key={uploadFile.id}
                    className="flex items-center gap-4 py-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <Icon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {uploadFile.file.name}
                        </p>
                        <div className="ml-4 flex items-center gap-2">
                          {uploadFile.status === "complete" && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {uploadFile.status === "error" && (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                          {(uploadFile.status === "uploading" ||
                            uploadFile.status === "processing") && (
                            <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
                          )}
                          <button
                            onClick={() => removeFile(uploadFile.id)}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        <span>{formatFileSize(uploadFile.file.size)}</span>
                        <span>•</span>
                        <Badge
                          size="sm"
                          variant={
                            uploadFile.status === "complete"
                              ? "success"
                              : uploadFile.status === "error"
                                ? "error"
                                : "default"
                          }
                        >
                          {uploadFile.status === "uploading"
                            ? `${Math.round(uploadFile.progress)}%`
                            : uploadFile.status}
                        </Badge>
                      </div>
                      {(uploadFile.status === "uploading" ||
                        uploadFile.status === "pending") && (
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-primary-500 transition-all duration-300"
                            style={{ width: `${uploadFile.progress}%` }}
                          />
                        </div>
                      )}
                      {uploadFile.error && (
                        <p className="mt-1 text-xs text-red-500">
                          {uploadFile.error}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}

        {/* Tips */}
        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <h3 className="text-sm font-medium text-blue-900">Upload Tips</h3>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>
              • Uploads resume automatically if your connection is interrupted
            </li>
            <li>• Large files are uploaded in chunks for reliability</li>
            <li>• Videos will be transcoded to HLS for adaptive streaming</li>
            <li>• AI tagging will be applied automatically after upload</li>
          </ul>
        </div>
      </div>

      {/* Folder Picker Modal */}
      <FolderPicker
        isOpen={isFolderPickerOpen}
        onClose={() => setIsFolderPickerOpen(false)}
        onSelectFolder={handleFolderSelect}
        currentFolderId={selectedFolderId}
      />
    </AppLayout>
  );
}

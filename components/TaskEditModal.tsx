'use client';

import { useState } from 'react';
import { X, Upload, Trash2, ExternalLink } from 'lucide-react';
import { uploadFile, deleteFile, getFileIcon, isValidFileType, isValidFileSize, formatFileSize } from '@/lib/storage';

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    title: string;
    description: string;
    notes?: string;
    attachments?: string[];
  };
  onSave: (updates: { notes?: string; attachments?: string[] }) => void;
}

export default function TaskEditModal({ isOpen, onClose, task, onSave }: TaskEditModalProps) {
  const [notes, setNotes] = useState(task.notes || '');
  const [attachments, setAttachments] = useState<string[]>(task.attachments || []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError('');
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!isValidFileType(file)) {
          setUploadError(`${file.name}: File type not supported. Allowed: Images, PDF, DOC, XLS, PPT, TXT`);
          continue;
        }

        // Validate file size
        if (!isValidFileSize(file, 10)) {
          setUploadError(`${file.name}: File too large. Max size: 10MB`);
          continue;
        }

        // Upload file
        const url = await uploadFile(file);
        if (url) {
          uploadedUrls.push(url);
        } else {
          setUploadError(`${file.name}: Upload failed. Using localStorage fallback (Supabase not configured).`);
        }
      }

      if (uploadedUrls.length > 0) {
        setAttachments([...attachments, ...uploadedUrls]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleDeleteAttachment = async (url: string) => {
    // Remove from UI immediately
    setAttachments(attachments.filter((a) => a !== url));
    
    // Try to delete from storage (will fail silently if using localStorage)
    await deleteFile(url);
  };

  const handleSave = () => {
    onSave({
      notes,
      attachments,
    });
    onClose();
  };

  const getFileName = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1];
    } catch {
      return 'Attachment';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Info (Read-only) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {task.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {task.description}
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Add your notes, learnings, or key points..."
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attachments (Images, PDFs, Documents)
            </label>
            
            {/* Upload Button */}
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              </span>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Max 10MB per file. Supported: Images, PDF, DOC, XLS, PPT, TXT
            </p>

            {/* Upload Error */}
            {uploadError && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
              </div>
            )}

            {/* Attachments List */}
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((url, index) => {
                  const fileName = getFileName(url);
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                  
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-2xl">{getFileIcon(fileName)}</span>
                      
                      <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {fileName}
                      </p>
                      {isImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={url}
                          alt={fileName}
                          className="mt-2 h-20 w-auto object-cover rounded"
                        />
                      )}
                    </div>

                      <div className="flex gap-2">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteAttachment(url)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}


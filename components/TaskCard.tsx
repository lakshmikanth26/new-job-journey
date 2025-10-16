'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Link as LinkIcon, ExternalLink, Edit2, Save, X, FileText, Paperclip, Upload, Trash2 } from 'lucide-react';
import { getCategoryColor } from '@/lib/utils';
import { getFileIcon, uploadFile, deleteFile, isValidFileType, isValidFileSize } from '@/lib/storage';

interface TaskCardProps {
  id?: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  referenceLink?: string;
  notes?: string;
  attachments?: string[];
  onToggleComplete?: () => void;
  onUpdateLink?: (link: string) => void;
  onUpdateTask?: (updates: { title?: string; description?: string; notes?: string; attachments?: string[] }) => void;
  showDay?: boolean;
  day?: number;
}

export default function TaskCard({
  id,
  title,
  description,
  category,
  completed,
  referenceLink,
  notes,
  attachments = [],
  onToggleComplete,
  onUpdateLink,
  onUpdateTask,
  showDay = false,
  day,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingLink, setIsEditingLink] = useState(false);
  
  // Edit form state
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editNotes, setEditNotes] = useState(notes || '');
  const [editAttachments, setEditAttachments] = useState<string[]>(attachments);
  const [linkValue, setLinkValue] = useState(referenceLink || '');
  
  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const handleSaveLink = () => {
    if (onUpdateLink) {
      onUpdateLink(linkValue);
    }
    setIsEditingLink(false);
  };

  const handleCancelLinkEdit = () => {
    setLinkValue(referenceLink || '');
    setIsEditingLink(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(title);
    setEditDescription(description);
    setEditNotes(notes || '');
    setEditAttachments(attachments);
  };

  const handleSave = () => {
    if (onUpdateTask) {
      onUpdateTask({
        title: editTitle,
        description: editDescription,
        notes: editNotes,
        attachments: editAttachments,
      });
    }
    setIsEditing(false);
    setUploadError('');
  };

  const handleCancel = () => {
    setEditTitle(title);
    setEditDescription(description);
    setEditNotes(notes || '');
    setEditAttachments(attachments);
    setIsEditing(false);
    setUploadError('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError('');
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!isValidFileType(file)) {
          setUploadError(`${file.name}: File type not supported`);
          continue;
        }

        if (!isValidFileSize(file, 10)) {
          setUploadError(`${file.name}: File too large (max 10MB)`);
          continue;
        }

        const url = await uploadFile(file);
        if (url) {
          uploadedUrls.push(url);
        } else {
          setUploadError(`${file.name}: Upload failed. Using localStorage fallback.`);
        }
      }

      if (uploadedUrls.length > 0) {
        setEditAttachments([...editAttachments, ...uploadedUrls]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('Failed to upload files');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteAttachment = async (url: string) => {
    setEditAttachments(editAttachments.filter((a) => a !== url));
    await deleteFile(url);
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
    <div className={`
      p-5 rounded-xl border-2 transition-all duration-200
      ${completed 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
      }
    `}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={onToggleComplete}
          className="flex-shrink-0 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
          aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
          disabled={isEditing}
        >
          {completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400 dark:text-gray-500 hover:text-primary-500 dark:hover:text-primary-400" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Day Badge (if shown) */}
          {showDay && day && (
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mb-2">
              Day {day}
            </span>
          )}

          {/* Title - Editable */}
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-lg font-semibold mb-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Task title"
            />
          ) : (
            <h3 className={`
              text-lg font-semibold mb-2
              ${completed 
                ? 'text-gray-600 dark:text-gray-400 line-through' 
                : 'text-gray-900 dark:text-white'
              }
            `}>
              {title}
            </h3>
          )}

          {/* Description - Editable */}
          {isEditing ? (
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={2}
              className="w-full text-sm mb-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Task description"
            />
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {description}
            </p>
          )}

          {/* Category Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}>
              {category}
            </span>
          </div>

          {/* Reference Link */}
          <div className="mt-3">
            {isEditingLink ? (
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={linkValue}
                  onChange={(e) => setLinkValue(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSaveLink}
                  className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg"
                  aria-label="Save link"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelLinkEdit}
                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                  aria-label="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {referenceLink ? (
                  <>
                    <a
                      href={referenceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Reference Link
                    </a>
                    <button
                      onClick={() => setIsEditingLink(true)}
                      className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      aria-label="Edit link"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditingLink(true)}
                    className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Add reference link
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Notes - Editable */}
          {isEditing ? (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Add your notes, learnings, or key points..."
              />
            </div>
          ) : notes ? (
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 dark:text-amber-200 whitespace-pre-wrap">
                  {notes}
                </p>
              </div>
            </div>
          ) : null}

          {/* File Upload - Edit Mode */}
          {isEditing && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Attachments
              </label>
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {uploading ? 'Uploading...' : 'Upload files'}
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
                Max 10MB per file. Images, PDF, DOC, XLS, PPT, TXT
              </p>
              {uploadError && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{uploadError}</p>
              )}
            </div>
          )}

          {/* Attachments List */}
          {(isEditing ? editAttachments : attachments).length > 0 && (
            <div className="mt-3 space-y-2">
              {(isEditing ? editAttachments : attachments).map((url, idx) => {
                const fileName = getFileName(url);
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-xl">{getFileIcon(fileName)}</span>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {fileName}
                      </p>
                      {isImage && !isEditing && (
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
                      {isEditing && (
                        <button
                          onClick={() => handleDeleteAttachment(url)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Task
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


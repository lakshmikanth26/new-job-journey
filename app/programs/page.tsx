'use client';

import { useEffect, useState } from 'react';
import { Plus, ExternalLink, Trash2, Edit2 } from 'lucide-react';
import { storage, getCategoryColor } from '@/lib/utils';

interface Program {
  id: string;
  name: string;
  link: string;
  category: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  status: 'Not Started' | 'In Progress' | 'Completed';
  notes?: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Program>>({
    name: '',
    link: '',
    category: 'DSA',
    difficulty: 'Easy',
    status: 'Not Started',
    notes: '',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = storage.get('programs');
    if (saved) {
      setPrograms(saved);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.link) return;

    if (editingId) {
      // Update existing program
      const updated = programs.map((p) =>
        p.id === editingId ? { ...p, ...formData } as Program : p
      );
      setPrograms(updated);
      storage.set('programs', updated);
      setEditingId(null);
    } else {
      // Add new program
      const newProgram: Program = {
        id: Date.now().toString(),
        name: formData.name!,
        link: formData.link!,
        category: formData.category || 'DSA',
        difficulty: formData.difficulty,
        status: formData.status || 'Not Started',
        notes: formData.notes,
      };
      const updated = [...programs, newProgram];
      setPrograms(updated);
      storage.set('programs', updated);
    }

    // Reset form
    setFormData({
      name: '',
      link: '',
      category: 'DSA',
      difficulty: 'Easy',
      status: 'Not Started',
      notes: '',
    });
    setIsAddingProgram(false);
  };

  const handleEdit = (program: Program) => {
    setEditingId(program.id);
    setFormData(program);
    setIsAddingProgram(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      const updated = programs.filter((p) => p.id !== id);
      setPrograms(updated);
      storage.set('programs', updated);
    }
  };

  const handleCancel = () => {
    setIsAddingProgram(false);
    setEditingId(null);
    setFormData({
      name: '',
      link: '',
      category: 'DSA',
      difficulty: 'Easy',
      status: 'Not Started',
      notes: '',
    });
  };

  const stats = {
    total: programs.length,
    completed: programs.filter((p) => p.status === 'Completed').length,
    inProgress: programs.filter((p) => p.status === 'In Progress').length,
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Coding Problems
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your DSA and coding practice
          </p>
        </div>
        <button
          onClick={() => setIsAddingProgram(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Problem
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Problems</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">In Progress</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.inProgress}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingProgram && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingId ? 'Edit Problem' : 'Add New Problem'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Problem Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Two Sum"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Link (LeetCode/GFG) *
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://leetcode.com/problems/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Arrays, DP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Key insights, approach, time complexity..."
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Problem
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Programs List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          All Problems ({programs.length})
        </h2>

        {programs.length > 0 ? (
          <div className="space-y-4">
            {programs.map((program) => (
              <div
                key={program.id}
                className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {program.name}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(program.category)}`}>
                        {program.category}
                      </span>
                      {program.difficulty && (
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          program.difficulty === 'Easy'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : program.difficulty === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {program.difficulty}
                        </span>
                      )}
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        program.status === 'Completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : program.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {program.status}
                      </span>
                    </div>

                    {program.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {program.notes}
                      </p>
                    )}

                    <a
                      href={program.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Problem
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(program)}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      aria-label="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No problems added yet. Click &quot;Add Problem&quot; to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


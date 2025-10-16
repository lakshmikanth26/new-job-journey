'use client';

import { useEffect, useState } from 'react';
import TaskCard from '@/components/TaskCard';
import planData from '@/lib/plan.json';
import { storage } from '@/lib/utils';
import { ChevronDown, ChevronRight, Plus, Save, X } from 'lucide-react';

interface TaskCompletion {
  [key: string]: {
    completed: boolean;
    referenceLink?: string;
    notes?: string;
    attachments?: string[];
  };
}

interface CustomTask {
  id: string;
  day: number;
  title: string;
  description: string;
  category: string;
}

export default function TasksPage() {
  const [completions, setCompletions] = useState<TaskCompletion>({});
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));
  const [mounted, setMounted] = useState(false);
  const [addingTaskDay, setAddingTaskDay] = useState<number | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'DSA',
  });

  useEffect(() => {
    setMounted(true);
    const saved = storage.get('taskCompletions');
    if (saved) {
      setCompletions(saved);
    }
    const savedCustomTasks = storage.get('customTasks');
    if (savedCustomTasks) {
      setCustomTasks(savedCustomTasks);
    }
  }, []);

  const handleToggleTask = (taskKey: string) => {
    const newCompletions = {
      ...completions,
      [taskKey]: {
        ...completions[taskKey],
        completed: !completions[taskKey]?.completed,
      },
    };
    setCompletions(newCompletions);
    storage.set('taskCompletions', newCompletions);
  };

  const handleUpdateLink = (taskKey: string, link: string) => {
    const newCompletions = {
      ...completions,
      [taskKey]: {
        ...completions[taskKey],
        referenceLink: link,
      },
    };
    setCompletions(newCompletions);
    storage.set('taskCompletions', newCompletions);
  };

  const handleUpdateTask = (taskKey: string, updates: { notes?: string; attachments?: string[] }) => {
    const newCompletions = {
      ...completions,
      [taskKey]: {
        ...completions[taskKey],
        ...updates,
      },
    };
    setCompletions(newCompletions);
    storage.set('taskCompletions', newCompletions);
  };

  const toggleDay = (day: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(day)) {
      newExpanded.delete(day);
    } else {
      newExpanded.add(day);
    }
    setExpandedDays(newExpanded);
  };

  const getDayProgress = (day: number) => {
    const dayTasks = planData.find(d => d.day === day)?.tasks || [];
    const dayCustomTasks = customTasks.filter(t => t.day === day);
    const allTasks = dayTasks.length + dayCustomTasks.length;
    
    const preloadedCompleted = dayTasks.filter((_, idx) => 
      completions[`${day}-${idx}`]?.completed
    ).length;
    
    const customCompleted = dayCustomTasks.filter(t => 
      completions[`custom-${t.id}`]?.completed
    ).length;
    
    return { completed: preloadedCompleted + customCompleted, total: allTasks };
  };

  const handleAddTask = (day: number) => {
    setAddingTaskDay(day);
    setNewTask({ title: '', description: '', category: 'DSA' });
  };

  const handleSaveNewTask = () => {
    if (!newTask.title || !addingTaskDay) return;

    const task: CustomTask = {
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      day: addingTaskDay,
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
    };

    const updated = [...customTasks, task];
    setCustomTasks(updated);
    storage.set('customTasks', updated);

    // Reset form
    setNewTask({ title: '', description: '', category: 'DSA' });
    setAddingTaskDay(null);
  };

  const handleCancelNewTask = () => {
    setNewTask({ title: '', description: '', category: 'DSA' });
    setAddingTaskDay(null);
  };

  const handleDeleteCustomTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this custom task?')) {
      const updated = customTasks.filter(t => t.id !== taskId);
      setCustomTasks(updated);
      storage.set('customTasks', updated);
      
      // Also remove its completion data
      const taskKey = `custom-${taskId}`;
      if (completions[taskKey]) {
        const newCompletions = { ...completions };
        delete newCompletions[taskKey];
        setCompletions(newCompletions);
        storage.set('taskCompletions', newCompletions);
      }
    }
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
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          All Tasks
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Complete 30-day roadmap for interview preparation
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setExpandedDays(new Set(planData.map(d => d.day)))}
          className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
        >
          Expand All
        </button>
        <button
          onClick={() => setExpandedDays(new Set())}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Collapse All
        </button>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {planData.map((dayData) => {
          const isExpanded = expandedDays.has(dayData.day);
          const progress = getDayProgress(dayData.day);
          const isComplete = progress.completed === progress.total;

          return (
            <div
              key={dayData.day}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Day Header */}
              <button
                onClick={() => toggleDay(dayData.day)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Day {dayData.day}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {progress.completed} of {progress.total} tasks completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isComplete && (
                    <span className="px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded-full">
                      Complete
                    </span>
                  )}
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-full bg-primary-600 rounded-full transition-all duration-300"
                      style={{
                        width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </button>

              {/* Day Tasks */}
              {isExpanded && (
                <div className="px-6 pb-6 space-y-4">
                  {/* Preloaded Tasks */}
                  {dayData.tasks.map((task, idx) => {
                    const taskKey = `${dayData.day}-${idx}`;
                    return (
                      <TaskCard
                        key={taskKey}
                        title={task.title}
                        description={task.description}
                        category={task.category}
                        completed={completions[taskKey]?.completed || false}
                        referenceLink={completions[taskKey]?.referenceLink}
                        notes={completions[taskKey]?.notes}
                        attachments={completions[taskKey]?.attachments}
                        onToggleComplete={() => handleToggleTask(taskKey)}
                        onUpdateLink={(link) => handleUpdateLink(taskKey, link)}
                        onUpdateTask={(updates) => handleUpdateTask(taskKey, updates)}
                      />
                    );
                  })}

                  {/* Custom Tasks */}
                  {customTasks
                    .filter(t => t.day === dayData.day)
                    .map((task) => {
                      const taskKey = `custom-${task.id}`;
                      return (
                        <div key={taskKey} className="relative">
                          <TaskCard
                            title={task.title}
                            description={task.description}
                            category={task.category}
                            completed={completions[taskKey]?.completed || false}
                            referenceLink={completions[taskKey]?.referenceLink}
                            notes={completions[taskKey]?.notes}
                            attachments={completions[taskKey]?.attachments}
                            onToggleComplete={() => handleToggleTask(taskKey)}
                            onUpdateLink={(link) => handleUpdateLink(taskKey, link)}
                            onUpdateTask={(updates) => handleUpdateTask(taskKey, updates)}
                          />
                          {/* Delete Custom Task Button */}
                          <button
                            onClick={() => handleDeleteCustomTask(task.id)}
                            className="absolute top-2 right-2 p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                            title="Delete custom task"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}

                  {/* Add Task Form */}
                  {addingTaskDay === dayData.day ? (
                    <div className="p-5 rounded-xl border-2 border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Add New Task to Day {dayData.day}
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Task Title *
                          </label>
                          <input
                            type="text"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            placeholder="e.g., Practice Binary Search"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            placeholder="Additional details about this task..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                          </label>
                          <select
                            value={newTask.category}
                            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="DSA">DSA</option>
                            <option value="Java">Java</option>
                            <option value="Spring Boot">Spring Boot</option>
                            <option value="SAP BTP">SAP BTP</option>
                            <option value="System Design">System Design</option>
                            <option value="Profile">Profile</option>
                            <option value="Project">Project</option>
                            <option value="Revision">Revision</option>
                            <option value="Applications">Applications</option>
                            <option value="Referrals">Referrals</option>
                            <option value="Mock Interview">Mock Interview</option>
                          </select>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={handleSaveNewTask}
                            disabled={!newTask.title}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            Add Task
                          </button>
                          <button
                            onClick={handleCancelNewTask}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Add Task Button */
                    <button
                      onClick={() => handleAddTask(dayData.day)}
                      className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Add Custom Task</span>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


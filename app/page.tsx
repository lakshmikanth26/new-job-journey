'use client';

import { useEffect, useState } from 'react';
import { Calendar, Target, TrendingUp, CheckCircle2, Plus, Save, X } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';
import TaskCard from '@/components/TaskCard';
import planData from '@/lib/plan.json';
import { getCurrentDay, storage } from '@/lib/utils';

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

export default function Dashboard() {
  const [currentDay, setCurrentDay] = useState(1);
  const [completions, setCompletions] = useState<TaskCompletion>({});
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'DSA',
  });

  useEffect(() => {
    setMounted(true);
    // Calculate current day
    const startDate = process.env.NEXT_PUBLIC_START_DATE || '2025-10-16';
    const day = getCurrentDay(startDate);
    setCurrentDay(day);

    // Load completions from localStorage
    const saved = storage.get('taskCompletions');
    if (saved) {
      setCompletions(saved);
    }

    // Load custom tasks from localStorage
    const savedCustomTasks = storage.get('customTasks');
    if (savedCustomTasks) {
      setCustomTasks(savedCustomTasks);
    }
  }, []);

  const todaysTasks = planData.find(d => d.day === currentDay)?.tasks || [];
  const todaysCustomTasks = customTasks.filter(t => t.day === currentDay);
  
  // Calculate statistics
  const allTasks = planData.flatMap(d => d.tasks);
  const totalTasks = allTasks.length + customTasks.length;
  const completedTasks = Object.values(completions).filter(c => c.completed).length;
  const todayCompleted = todaysTasks.filter((_, idx) => 
    completions[`${currentDay}-${idx}`]?.completed
  ).length + todaysCustomTasks.filter(t => 
    completions[`custom-${t.id}`]?.completed
  ).length;

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

  const handleAddTask = () => {
    setIsAddingTask(true);
    setNewTask({ title: '', description: '', category: 'DSA' });
  };

  const handleSaveNewTask = () => {
    if (!newTask.title) return;

    const task: CustomTask = {
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      day: currentDay,
      title: newTask.title,
      description: newTask.description,
      category: newTask.category,
    };

    const updated = [...customTasks, task];
    setCustomTasks(updated);
    storage.set('customTasks', updated);

    // Reset form
    setNewTask({ title: '', description: '', category: 'DSA' });
    setIsAddingTask(false);
  };

  const handleCancelNewTask = () => {
    setNewTask({ title: '', description: '', category: 'DSA' });
    setIsAddingTask(false);
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
          Welcome to Career Compass 🎯
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your journey to Walmart Global Tech and SAP Labs
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Day {currentDay}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">of 30 Days</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {todayCompleted}/{todaysTasks.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Today&apos;s Tasks</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {completedTasks}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Completed</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {Math.round((completedTasks / totalTasks) * 100)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          30-Day Progress
        </h2>
        <ProgressBar
          current={completedTasks}
          total={totalTasks}
          label="Overall Completion"
        />
      </div>

      {/* Today's Tasks */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Today&apos;s Tasks - Day {currentDay}
          </h2>
          <button
            onClick={handleAddTask}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
        
        {(todaysTasks.length > 0 || todaysCustomTasks.length > 0) ? (
          <div className="space-y-4">
            {/* Preloaded Tasks */}
            {todaysTasks.map((task, idx) => {
              const taskKey = `${currentDay}-${idx}`;
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
            {todaysCustomTasks.map((task) => {
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
            {isAddingTask && (
              <div className="p-5 rounded-xl border-2 border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Add New Task to Day {currentDay}
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
                      autoFocus
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
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No tasks scheduled for today. Great job staying ahead!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


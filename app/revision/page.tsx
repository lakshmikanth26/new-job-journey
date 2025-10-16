'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import TaskCard from '@/components/TaskCard';
import planData from '@/lib/plan.json';
import { storage } from '@/lib/utils';

interface TaskCompletion {
  [key: string]: {
    completed: boolean;
    referenceLink?: string;
    revised?: boolean;
  };
}

export default function RevisionPage() {
  const [completions, setCompletions] = useState<TaskCompletion>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = storage.get('taskCompletions');
    if (saved) {
      setCompletions(saved);
    }
  }, []);

  // Get all completed tasks
  const completedTasks = useMemo(() => {
    const tasks: Array<{
      day: number;
      taskIndex: number;
      title: string;
      description: string;
      category: string;
      referenceLink?: string;
      revised?: boolean;
    }> = [];

    planData.forEach((dayData) => {
      dayData.tasks.forEach((task, idx) => {
        const taskKey = `${dayData.day}-${idx}`;
        if (completions[taskKey]?.completed) {
          tasks.push({
            day: dayData.day,
            taskIndex: idx,
            title: task.title,
            description: task.description,
            category: task.category,
            referenceLink: completions[taskKey]?.referenceLink,
            revised: completions[taskKey]?.revised,
          });
        }
      });
    });

    return tasks;
  }, [completions]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(planData.flatMap(d => d.tasks.map(t => t.category)));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return completedTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === 'All' || task.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [completedTasks, searchQuery, selectedCategory]);

  const handleToggleRevised = (day: number, taskIndex: number) => {
    const taskKey = `${day}-${taskIndex}`;
    const newCompletions = {
      ...completions,
      [taskKey]: {
        ...completions[taskKey],
        revised: !completions[taskKey]?.revised,
      },
    };
    setCompletions(newCompletions);
    storage.set('taskCompletions', newCompletions);
  };

  const revisedCount = completedTasks.filter(t => t.revised).length;

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
          Revision Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and revise your completed tasks
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed Tasks</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {completedTasks.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Revised</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {revisedCount}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending Revision</p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {completedTasks.length - revisedCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer min-w-[200px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Completed Tasks ({filteredTasks.length})
        </h2>

        {filteredTasks.length > 0 ? (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={`${task.day}-${task.taskIndex}`} className="relative">
                <TaskCard
                  title={task.title}
                  description={task.description}
                  category={task.category}
                  completed={true}
                  referenceLink={task.referenceLink}
                  showDay={true}
                  day={task.day}
                  onToggleComplete={() => {}}
                />
                
                {/* Revised Button */}
                <button
                  onClick={() => handleToggleRevised(task.day, task.taskIndex)}
                  className={`
                    absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors
                    ${task.revised
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <RotateCcw className="w-4 h-4" />
                  {task.revised ? 'Revised' : 'Mark Revised'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              {completedTasks.length === 0
                ? 'No completed tasks yet. Complete tasks to see them here!'
                : 'No tasks match your filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


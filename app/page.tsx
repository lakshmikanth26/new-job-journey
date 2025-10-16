'use client';

import { useEffect, useState } from 'react';
import { Calendar, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
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

export default function Dashboard() {
  const [currentDay, setCurrentDay] = useState(1);
  const [completions, setCompletions] = useState<TaskCompletion>({});
  const [mounted, setMounted] = useState(false);

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
  }, []);

  const todaysTasks = planData.find(d => d.day === currentDay)?.tasks || [];
  
  // Calculate statistics
  const allTasks = planData.flatMap(d => d.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = Object.values(completions).filter(c => c.completed).length;
  const todayCompleted = todaysTasks.filter((_, idx) => 
    completions[`${currentDay}-${idx}`]?.completed
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
          <p className="text-sm text-gray-600 dark:text-gray-400">Today's Tasks</p>
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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Today's Tasks - Day {currentDay}
        </h2>
        
        {todaysTasks.length > 0 ? (
          <div className="space-y-4">
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


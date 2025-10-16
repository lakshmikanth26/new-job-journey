import { differenceInDays, parseISO } from 'date-fns';

/**
 * Calculate the current day of the 30-day journey based on start date
 */
export function getCurrentDay(startDate: string): number {
  const start = parseISO(startDate);
  const today = new Date();
  const daysPassed = differenceInDays(today, start) + 1;
  
  // Clamp between 1 and 30
  return Math.max(1, Math.min(30, daysPassed));
}

/**
 * Calculate progress percentage
 */
export function getProgressPercentage(completedTasks: number, totalTasks: number): number {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
}

/**
 * Get category color for badges
 */
export function getCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    'DSA': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Spring Boot': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'SAP BTP': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'System Design': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Profile': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'Project': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Revision': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'Applications': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Referrals': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
    'Mock Interview': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    'Java': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
}

/**
 * LocalStorage utility functions with fallback
 */
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};


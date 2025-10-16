import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

if (!isSupabaseConfigured && typeof window === 'undefined') {
  console.warn(
    '⚠️  Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env'
  );
  console.warn('📦 Using localStorage fallback for data persistence.');
}

// Create Supabase client (will be null if not configured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types
export interface Task {
  id?: string;
  day: number;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  completed_at?: string;
  revised?: boolean;
  revised_at?: string;
  reference_link?: string;
  notes?: string;
  attachments?: string[]; // Array of file URLs from Supabase Storage
  created_at?: string;
  updated_at?: string;
}

export interface Program {
  id?: string;
  name: string;
  link: string;
  category: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  status: 'Not Started' | 'In Progress' | 'Completed';
  notes?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  repo_link?: string;
  deployed_link?: string;
  technologies: string[];
  status: 'Planning' | 'In Progress' | 'Completed';
  notes?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper to check if Supabase is available
export const isSupabaseAvailable = () => isSupabaseConfigured && supabase !== null;


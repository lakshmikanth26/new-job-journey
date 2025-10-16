import { NextResponse } from 'next/server';
import { supabase, isSupabaseAvailable } from '@/lib/supabase';

// GET all tasks
export async function GET() {
  try {
    if (!isSupabaseAvailable()) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured. Using localStorage fallback.' },
        { status: 503 }
      );
    }

    const { data, error } = await supabase!
      .from('tasks')
      .select('*')
      .order('day', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST new task
export async function POST(request: Request) {
  try {
    if (!isSupabaseAvailable()) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured. Using localStorage fallback.' },
        { status: 503 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabase!
      .from('tasks')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

// PUT update task
export async function PUT(request: Request) {
  try {
    if (!isSupabaseAvailable()) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured. Using localStorage fallback.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase!
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE task
export async function DELETE(request: Request) {
  try {
    if (!isSupabaseAvailable()) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured. Using localStorage fallback.' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase!
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { supabase, isSupabaseAvailable } from '@/lib/supabase';

// GET all projects
export async function GET() {
  try {
    if (!isSupabaseAvailable()) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured. Using localStorage fallback.' },
        { status: 503 }
      );
    }

    const { data, error } = await supabase!
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST new project
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
      .from('projects')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT update project
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
        { success: false, error: 'Project ID required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase!
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE project
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
        { success: false, error: 'Project ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase!
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

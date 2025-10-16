import { NextResponse } from 'next/server';
import { supabase, isSupabaseAvailable } from '@/lib/supabase';

// GET all programs
export async function GET() {
  try {
    if (!isSupabaseAvailable()) {
      return NextResponse.json(
        { success: false, error: 'Supabase not configured. Using localStorage fallback.' },
        { status: 503 }
      );
    }

    const { data, error } = await supabase!
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

// POST new program
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
      .from('programs')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create program' },
      { status: 500 }
    );
  }
}

// PUT update program
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
        { success: false, error: 'Program ID required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase!
      .from('programs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update program' },
      { status: 500 }
    );
  }
}

// DELETE program
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
        { success: false, error: 'Program ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase!
      .from('programs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete program' },
      { status: 500 }
    );
  }
}

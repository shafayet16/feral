import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// 1. DELETE: Remove a specific item by its ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    
    // CRITICAL FIX: Await params context for Next.js dynamic routing environments
    const resolvedParams = await params;
    const itemId = resolvedParams.id;

    if (!itemId || itemId === 'undefined') {
      return NextResponse.json({ error: 'Missing target item ID segment' }, { status: 400 });
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. PATCH: Update quantity for a specific item by its ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    
    // CRITICAL FIX: Await params context here as well
    const resolvedParams = await params;
    const itemId = resolvedParams.id;
    
    const { quantity } = await req.json();

    if (!itemId || itemId === 'undefined') {
      return NextResponse.json({ error: 'Missing target item ID segment' }, { status: 400 });
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
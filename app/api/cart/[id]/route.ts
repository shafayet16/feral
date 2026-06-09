import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// DELETE: Remove a specific cart item by its ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
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

// PATCH: Update quantity for a specific cart item by its ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
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
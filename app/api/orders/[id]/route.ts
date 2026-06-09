import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// PATCH: update payment_status and/or order_status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // Note: params is a Promise
) {
  const supabase = createClient();

  // 1. Await the params because Next.js 15+ wraps them in a Promise
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  if (!orderId) {
    return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
  }

  const body = await req.json();
  const updates: Record<string, string> = {};

  if (body.payment_status) updates.payment_status = body.payment_status;
  if (body.order_status) updates.order_status = body.order_status;

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE: remove an order
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createClient();
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  if (!orderId) {
    return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
  }

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
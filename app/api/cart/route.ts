import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient();
    const cookieStore = req.cookies;
    let sessionId = cookieStore.get('cart_session')?.value;

    if (!sessionId) {
      sessionId = uuidv4();
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json(data || []);
    if (!cookieStore.get('cart_session')) {
      response.cookies.set('cart_session', sessionId, {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'lax',
      });
    }
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const body = await req.json();

    if (!body.product_id) {
      return NextResponse.json({ error: 'Missing product_id' }, { status: 400 });
    }

    const cookieStore = req.cookies;
    let sessionId = cookieStore.get('cart_session')?.value;
    if (!sessionId) {
      sessionId = uuidv4();
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert([{ product_id: Number(body.product_id), quantity: body.quantity || 1, size: body.size || 'M', session_id: sessionId }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const response = NextResponse.json(data[0]);
    if (!cookieStore.get('cart_session')) {
      response.cookies.set('cart_session', sessionId, {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'lax',
      });
    }
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
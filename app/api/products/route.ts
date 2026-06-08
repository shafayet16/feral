import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// ==========================================
// 1. ONE UNIFIED AGGRESSIVE DEBUG GET FUNCTION
// ==========================================
export async function GET() {
  try {
    // Check if the Supabase client initialization script exists
    if (!supabase) {
      return NextResponse.json({ 
        error: "Supabase client is not initialized. Check your @/lib/supabase file layout." 
      }, { status: 500 });
    }

    // Run the clean select query ordered by ID
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });
    
    // Catch explicit database errors (Bad keys, wrong column names)
    if (error) {
      return NextResponse.json({ 
        debug_message: "Supabase returned an explicit error",
        message: error.message, 
        details: error.details,
        hint: error.hint 
      }, { status: 500 });
    }

    // Catch if connection is clean but table returns nothing (RLS Block)
    if (!data || data.length === 0) {
      return NextResponse.json({
        debug_message: "Connection successful, but database returned 0 rows. This means a Row Level Security (RLS) policy is blocking public read access on your Supabase dashboard.",
        data: data
      }, { status: 200 });
    }

    // If it works perfectly, return the 6 rows of product data
    return NextResponse.json(data);

  } catch (catchErr: any) {
    return NextResponse.json({ 
      debug_message: "The server crashed before finishing the network handshake",
      error: catchErr.message 
    }, { status: 500 });
  }
}

// ==========================================
// 2. POST FUNCTION (INSERT NEW PRODUCT)
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('products')
      .insert([body])
      .select();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data[0]);
  } catch (err: any) {
    return NextResponse.json({ error: "Malformed JSON body" }, { status: 400 });
  }
}

// ==========================================
// 3. PUT FUNCTION (UPDATE PRODUCT)
// ==========================================
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .update(body)
      .eq('id', body.id)
      .select();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data[0]);
  } catch (err: any) {
    return NextResponse.json({ error: "Malformed JSON body" }, { status: 400 });
  }
}

// ==========================================
// 4. DELETE FUNCTION (REMOVE PRODUCT)
// ==========================================
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Malformed JSON body" }, { status: 400 });
  }
}
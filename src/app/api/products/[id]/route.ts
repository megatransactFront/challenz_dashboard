import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client' // adjust this to your actual Supabase client path

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

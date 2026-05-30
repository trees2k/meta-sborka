import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request, { params }: { params: { chatId: string } }) {
  try {
    const { chatId } = params

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json({ messages: messages || [] })
  } catch (error) {
    console.error('GET /api/chats/[chatId]/messages error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { chatId: string } }) {
  try {
    const { chatId } = params
    const body = await request.json()

    const { data: message, error } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, ...body })
      .select()
      .single()

    if (error) throw error

    // Update last_message_at in chats table
    await supabase
      .from('chats')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', chatId)

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error('POST /api/chats/[chatId]/messages error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

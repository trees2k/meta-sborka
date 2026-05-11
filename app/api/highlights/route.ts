import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Загрузка нового хайлайта
export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('video') as File
  const user_nickname = formData.get('user_nickname') as string
  const title = (formData.get('title') as string) || ''

  if (!file || !user_nickname) {
    return NextResponse.json({ error: 'Видео и никнейм обязательны' }, { status: 400 })
  }

  // Загружаем файл в Supabase Storage
  const fileName = `${user_nickname}_${Date.now()}.mp4`
  const { error: uploadError } = await supabase.storage
    .from('highlights')
    .upload(fileName, file)

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Получаем публичную ссылку
  const { data: publicUrl } = supabase.storage
    .from('highlights')
    .getPublicUrl(fileName)

  // Сохраняем в таблицу
  const { error: insertError } = await supabase
    .from('highlights')
    .insert({ user_nickname, video_url: publicUrl.publicUrl, title })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, url: publicUrl.publicUrl })
}

// Получение хайлайтов (с фильтрацией по никнейму)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const nickname = searchParams.get('nickname')

  let query = supabase
    .from('highlights')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (nickname) {
    query = query.eq('user_nickname', nickname)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ highlights: data || [] })
}
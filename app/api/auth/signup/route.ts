import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const { email, password } = await request.json()
  if (!email || !password) return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 })
  if (password.length < 6) return NextResponse.json({ error: 'Пароль не менее 6 символов' }, { status: 400 })

  // Проверяем, нет ли уже такого пользователя
  const { data: existing } = await supabase.from('users').select('id').eq('email', email).limit(1)
  if (existing && existing.length > 0) return NextResponse.json({ error: 'Пользователь уже существует' }, { status: 409 })

  const password_hash = await bcrypt.hash(password, 10)
  const { error } = await supabase.from('users').insert({ email, password_hash })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}


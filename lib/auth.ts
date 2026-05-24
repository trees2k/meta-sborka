import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Получить текущего авторизованного пользователя из JWT токена в cookies
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as string

    // Получаем полные данные пользователя из БД
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

/**
 * Получить userId из JWT токена
 */
export async function getUserIdFromToken() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload.userId as string
  } catch {
    return null
  }
}

/**
 * Проверить авторизацию с выбросом ошибки если нужна
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

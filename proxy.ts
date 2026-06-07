import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret')

/**
 * Middleware для защиты маршрутов
 * Проверяет валидность JWT токена в cookies
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Защищённые маршруты (требуют авторизацию)
  const protectedRoutes = ['/cabinet', '/profile', '/dashboard', '/highlights']
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

  // Открытые маршруты (только для неавторизованных)
  const authRoutes = ['/auth/login', '/auth/signup']
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  const token = request.cookies.get('token')?.value

  // Если пользователь авторизован и пытается зайти на страницу входа/регистрации
  if (isAuthRoute && token) {
    try {
      await jwtVerify(token, JWT_SECRET)
      // Токен валидный, редирект на главную
      return NextResponse.redirect(new URL('/', request.url))
    } catch {
      // Токен невалидный, продолжаем
    }
  }

  // Если пытается зайти на защищённый маршрут без авторизации
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Если токен есть, проверяем его валидность для защищённых маршрутов
  if (isProtected && token) {
    try {
      await jwtVerify(token, JWT_SECRET)
    } catch {
      // Токен невалидный или истёк
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

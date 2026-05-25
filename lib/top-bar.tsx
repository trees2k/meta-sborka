'use client'

import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Home, MessageCircle, Star, Loader2 } from 'lucide-react'
import { useState } from 'react'

export function TopBar() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (loading) {
    return null
  }

  return (
    <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Логотип */}
        <Link href="/" className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          UFUTURE
        </Link>

        {/* Меню */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
            <Home className="w-5 h-5" />
            Главная
          </Link>
          <Link href="/highlights" className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
            <Star className="w-5 h-5" />
            Хайлайты
          </Link>
          {user && (
            <>
              <Link href={`/profile/${user.id}`} className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                Профиль
              </Link>
              <Link href="/messages" className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                <MessageCircle className="w-5 h-5" />
                Чаты
              </Link>
            </>
          )}
        </div>

        {/* Профиль и выход */}
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium text-gray-300">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              <span className="hidden sm:inline">Выход</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="px-4 py-2 text-blue-400 hover:bg-gray-800 rounded-lg transition-colors">
              Вход
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium text-white transition-colors">
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

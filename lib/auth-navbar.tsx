'use client'

import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function AuthNavbar() {
  const { user, logout, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return null
  }

  if (!user) {
    return (
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            UFUTURE
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="px-4 py-2 rounded-lg text-blue-400 hover:bg-gray-800 transition-colors">
              Вход
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium text-white transition-colors">
              Регистрация
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          UFUTURE
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user.email}</p>
              {user.faceit_nickname && (
                <p className="text-xs text-gray-400">{user.faceit_nickname}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Выход
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 p-4 space-y-3">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-800/50 rounded-lg mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user.email}</p>
              {user.faceit_nickname && (
                <p className="text-xs text-gray-400">{user.faceit_nickname}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Выход
          </button>
        </div>
      )}
    </nav>
  )
}

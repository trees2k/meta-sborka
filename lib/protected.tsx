'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Компонент для защиты страниц - требует авторизацию
 * Если пользователь не авторизован, перенаправляет на /auth/login
 */
export function Protected({ children, fallback }: ProtectedProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return fallback || null
  }

  return <>{children}</>
}

/**
 * Компонент для показа контента только авторизованным пользователям
 */
export function AuthOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

/**
 * Компонент для показа контента только неавторизованным пользователям
 */
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (user) {
    return null
  }

  return <>{children}</>
}

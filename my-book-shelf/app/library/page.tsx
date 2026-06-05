'use client'

import { useAuth } from '@/lib/auth'
import AuthForm from '@/components/auth-form'
import Library from '@/components/library'

export default function LibraryPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return <Library />
}

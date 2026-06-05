'use client'

import { useAuth } from '@/lib/auth'
import { BookOpen, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/library" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 transition-colors">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-stone-900">My Book Shelf</span>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-stone-500 hidden sm:block">{user.email}</span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth'
import { createBrowserClient } from '@/utils/supabase/client'
import { Book, BookStatus } from '@/types/database'
import BookCard from '@/components/book-card'
import AddBookModal from '@/components/add-book-modal'
import Header from '@/components/header'
import { Plus, Search, BookOpen, Clock, CheckCircle2, Library as LibraryIcon } from 'lucide-react'

type FilterStatus = 'all' | 'reading' | 'to_read' | 'finished'

export default function Library() {
  const { user } = useAuth()
  const supabase = createBrowserClient()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const fetchBooks = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('books')
      .select('*')
      .order('updated_at', { ascending: false })
    if (data) setBooks(data as Book[])
    setLoading(false)
  }, [user, supabase])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const addBook = async (book: { title: string; author: string; status: BookStatus; description?: string }) => {
    if (!user) return
    const { data } = await supabase
      .from('books')
      .insert({ ...book, user_id: user.id } as Record<string, unknown>)
      .select()
      .single()
    if (data) setBooks((prev) => [data as Book, ...prev])
  }

  const updateBook = async (id: string, updates: Partial<Book>) => {
    const { data } = await supabase
      .from('books')
      .update({ ...updates, updated_at: new Date().toISOString() } as Record<string, unknown>)
      .eq('id', id)
      .select()
      .single()
    if (data) setBooks((prev) => prev.map((b) => (b.id === id ? data as Book : b)))
  }

  const deleteBook = async (id: string) => {
    await supabase.from('books').delete().eq('id', id)
    setBooks((prev) => prev.filter((b) => b.id !== id))
  }

  const filteredBooks = books.filter((book) => {
    const matchesFilter = filter === 'all' || book.status === filter
    const matchesSearch =
      !search ||
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const counts = {
    all: books.length,
    reading: books.filter((b) => b.status === 'reading').length,
    to_read: books.filter((b) => b.status === 'to_read').length,
    finished: books.filter((b) => b.status === 'finished').length,
  }

  const filterTabs: { value: FilterStatus; label: string; icon: typeof BookOpen }[] = [
    { value: 'all', label: 'All', icon: LibraryIcon },
    { value: 'reading', label: 'Reading', icon: BookOpen },
    { value: 'to_read', label: 'To Read', icon: Clock },
    { value: 'finished', label: 'Finished', icon: CheckCircle2 },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-stone-900">{counts.reading}</p>
                <p className="text-xs text-stone-500">Reading</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-stone-900">{counts.to_read}</p>
                <p className="text-xs text-stone-500">To Read</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-stone-900">{counts.finished}</p>
                <p className="text-xs text-stone-500">Finished</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Book
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-stone-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {filterTabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === tab.value
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`text-xs ${filter === tab.value ? 'text-stone-400' : 'text-stone-400'}`}>
                  {counts[tab.value]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Book grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-stone-200 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-20 h-28 bg-stone-200 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                    <div className="h-3 bg-stone-200 rounded w-1/2" />
                    <div className="h-6 bg-stone-200 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-100 mb-4">
              <LibraryIcon className="w-8 h-8 text-stone-300" />
            </div>
            <h3 className="text-lg font-medium text-stone-900 mb-1">
              {books.length === 0 ? 'Your shelf is empty' : 'No books found'}
            </h3>
            <p className="text-sm text-stone-500 mb-4">
              {books.length === 0
                ? 'Add your first book to start tracking your reading'
                : 'Try adjusting your search or filter'}
            </p>
            {books.length === 0 && (
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Your First Book
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onUpdate={updateBook} onDelete={deleteBook} />
            ))}
          </div>
        )}
      </main>

      <AddBookModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addBook} />
    </div>
  )
}

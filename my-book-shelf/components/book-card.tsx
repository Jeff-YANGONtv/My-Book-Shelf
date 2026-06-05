'use client'

import { useState } from 'react'
import { Book, BookStatus } from '@/types/database'
import { Star, BookOpen, Clock, CheckCircle2, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react'

const statusConfig: Record<BookStatus, { label: string; icon: typeof BookOpen; color: string }> = {
  reading: { label: 'Reading', icon: BookOpen, color: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  to_read: { label: 'To Read', icon: Clock, color: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
  finished: { label: 'Finished', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
}

function StarRating({ rating }: { rating: number | null }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= (rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
          }`}
        />
      ))}
    </div>
  )
}

export default function BookCard({ book, onUpdate, onDelete }: {
  book: Book
  onUpdate: (id: string, updates: Partial<Book>) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)
  const [description, setDescription] = useState(book.description || '')
  const [status, setStatus] = useState(book.status)

  const config = statusConfig[book.status]
  const StatusIcon = config.icon

  const handleSave = () => {
    onUpdate(book.id, { title, author, description: description || null, status })
    setEditing(false)
  }

  const handleCancel = () => {
    setTitle(book.title)
    setAuthor(book.author)
    setDescription(book.description || '')
    setStatus(book.status)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            placeholder="Book title"
          />
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            placeholder="Author"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as BookStatus)}
            className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="to_read">To Read</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
          </select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-h-[80px] resize-y"
            placeholder="Description..."
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={handleCancel} className="px-4 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100 transition-colors flex items-center gap-1.5">
            <X className="w-4 h-4" /> Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden bg-stone-100">
          {book.cover_url ? (
            <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-stone-300" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-medium text-stone-900 truncate">{book.title}</h3>
              <p className="text-sm text-stone-500 mt-0.5">{book.author}</p>
            </div>
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 opacity-0 group-hover:opacity-100 transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-8 z-20 bg-white rounded-lg border border-stone-200 shadow-lg py-1 min-w-[140px]">
                    <button
                      onClick={() => { setEditing(true); setMenuOpen(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => { onDelete(book.id); setMenuOpen(false) }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-2.5 flex items-center gap-3">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.color}`}>
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </span>
            {book.status === 'finished' && (
              <StarRating rating={book.rating} />
            )}
          </div>

          {book.description && (
            <p className="mt-3 text-sm text-stone-500 line-clamp-2">{book.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { BookStatus } from '@/types/database'

interface AddBookModalProps {
  open: boolean
  onClose: () => void
  onAdd: (book: { title: string; author: string; status: BookStatus; description?: string }) => void
}

export default function AddBookModal({ open, onClose, onAdd }: AddBookModalProps) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [status, setStatus] = useState<BookStatus>('to_read')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !author.trim()) return
    setSubmitting(true)
    await onAdd({ title: title.trim(), author: author.trim(), status, description: description.trim() || undefined })
    setTitle('')
    setAuthor('')
    setStatus('to_read')
    setDescription('')
    setSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-stone-900">Add a Book</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Author</label>
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="Enter author name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Status</label>
            <div className="flex gap-2">
              {[
                { value: 'to_read' as const, label: 'To Read' },
                { value: 'reading' as const, label: 'Reading' },
                { value: 'finished' as const, label: 'Finished' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                    status === opt.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all min-h-[80px] resize-y"
              placeholder="Optional description..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !title.trim() || !author.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
            {submitting ? 'Adding...' : 'Add Book'}
          </button>
        </form>
      </div>
    </div>
  )
}

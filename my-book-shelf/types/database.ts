export type BookStatus = 'to_read' | 'reading' | 'finished'

export interface Book {
  id: string
  user_id: string | null
  title: string
  author: string
  description: string | null
  cover_url: string | null
  pdf_url: string | null
  category: string | null
  pages: number | null
  current_page: number | null
  rating: number | null
  status: BookStatus
  created_at: string
  updated_at: string
}

export interface BookInsert {
  user_id: string
  title: string
  author: string
  description?: string | null
  cover_url?: string | null
  pdf_url?: string | null
  category?: string | null
  pages?: number | null
  current_page?: number | null
  rating?: number | null
  status?: BookStatus
}

export interface BookUpdate {
  title?: string
  author?: string
  description?: string | null
  cover_url?: string | null
  pdf_url?: string | null
  category?: string | null
  pages?: number | null
  current_page?: number | null
  rating?: number | null
  status?: BookStatus
  updated_at?: string
}

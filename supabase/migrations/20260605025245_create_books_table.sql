CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  status TEXT NOT NULL DEFAULT 'want_to_read' CHECK (status IN ('reading', 'want_to_read', 'finished')),
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_books" ON books FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_books" ON books FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_books" ON books FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_books" ON books FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_books_user_id ON books(user_id);

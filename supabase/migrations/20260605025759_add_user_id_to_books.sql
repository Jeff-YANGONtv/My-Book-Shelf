-- Add user_id as nullable first
ALTER TABLE books ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop insecure policies
DROP POLICY IF EXISTS select_books ON books;
DROP POLICY IF EXISTS insert_books ON books;
DROP POLICY IF EXISTS update_books ON books;
DROP POLICY IF EXISTS delete_books ON books;

-- Temporarily allow authenticated users to see books without user_id
CREATE POLICY "select_own_books" ON books FOR SELECT
  TO authenticated USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "insert_own_books" ON books FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_books" ON books FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_books" ON books FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_books_user_id ON books(user_id);

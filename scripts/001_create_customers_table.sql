-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Insert sample data
INSERT INTO customers (name, email, phone) VALUES
  ('John Doe', 'john.doe@example.com', '+1 (555) 123-4567'),
  ('Jane Smith', 'jane.smith@example.com', '+1 (555) 234-5678'),
  ('Bob Johnson', 'bob.johnson@example.com', '+1 (555) 345-6789'),
  ('Alice Williams', 'alice.williams@example.com', '+1 (555) 456-7890'),
  ('Charlie Brown', 'charlie.brown@example.com', '+1 (555) 567-8901')
ON CONFLICT (email) DO NOTHING;

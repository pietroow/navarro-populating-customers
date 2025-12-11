-- Add status column to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo'));

-- Update existing customers to have 'ativo' status
UPDATE customers SET status = 'ativo' WHERE status IS NULL;

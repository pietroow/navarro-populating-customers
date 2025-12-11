-- Habilitar RLS na tabela customers para segurança total
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Política: permitir todas as operações 
-- (a autenticação será controlada pelo middleware, não pelo Supabase Auth)
CREATE POLICY "customers_all_access" ON customers FOR ALL USING (true);

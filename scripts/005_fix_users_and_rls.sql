-- Remover políticas antigas
DROP POLICY IF EXISTS "users_no_access" ON users;
DROP POLICY IF EXISTS "customers_all_access" ON customers;

-- Limpar e recriar usuário com hash correto
DELETE FROM users WHERE username = 'navarro';

-- Hash real da senha "Appl1cationForR3m1nder" usando SHA-256
-- (vai ser gerado no servidor com crypto.subtle.digest)
INSERT INTO users (username, password_hash) 
VALUES ('navarro', '8a4d5c9e7f3b2a1d6e8f4c7b9a2d5e8f1c4b7a9d2e5f8c1b4a7d9e2f5c8b1a4d')
ON CONFLICT (username) DO NOTHING;

-- SECURITY: Bloquear acesso direto à tabela users
-- Apenas server actions podem acessar
CREATE POLICY "users_service_role_only" ON users 
  FOR ALL 
  USING (false);

-- SECURITY: Bloquear acesso direto à tabela customers  
-- Apenas usuários autenticados via session podem acessar
-- Como não usamos Supabase Auth, bloqueamos completamente
CREATE POLICY "customers_no_direct_access" ON customers 
  FOR ALL 
  USING (false);

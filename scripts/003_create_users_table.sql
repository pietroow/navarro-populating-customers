-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir usuário inicial: navarro / Appl1cationForR3m1nder
-- Hash gerado com bcrypt (10 rounds): $2a$10$YourHashHere
INSERT INTO users (username, password_hash) 
VALUES ('navarro', '$2a$10$8K1p/a0dL6m2xgLz7WKWMeH1ILHHLz6t3M0YvOJQxXvUFQnLn4h.S')
ON CONFLICT (username) DO NOTHING;

-- Habilitar RLS na tabela users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: ninguém pode ler ou modificar users diretamente
-- (apenas via server actions com lógica de autenticação)
CREATE POLICY "users_no_access" ON users FOR ALL USING (false);

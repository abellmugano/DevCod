-- DevCod: Schema Inicial
-- Migração 001: Entidades fundamentais + CHECK constraints

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Roles (gerenciada por admin)
CREATE TABLE user_roles (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    role TEXT CHECK (role IN ('dev', 'maintainer', 'admin')) NOT NULL DEFAULT 'dev',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projetos
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    github_repo TEXT UNIQUE NOT NULL,
    visibility TEXT CHECK (visibility IN ('public', 'private')) DEFAULT 'public',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Desafios (com validação estrita de pesos)
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    weights JSONB NOT NULL CHECK (
        (weights->>'functionality')::numeric >= 30 AND
        (weights->>'quality')::numeric >= 20 AND
        (weights->>'documentation')::numeric >= 10 AND
        (weights->>'security')::numeric >= 10 AND
        ((weights->>'functionality')::numeric +
         (weights->>'quality')::numeric +
         (weights->>'documentation')::numeric +
         (weights->>'security')::numeric) = 100
    ),
    reward_amount INTEGER NOT NULL CHECK (reward_amount > 0),
    deadline_days INTEGER NOT NULL CHECK (deadline_days BETWEEN 1 AND 180),
    status TEXT CHECK (status IN ('open', 'in_progress', 'review', 'resolved', 'disputed')) DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Transações de DevCoins
CREATE TABLE devcoin_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reference_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE devcoin_transactions ENABLE ROW LEVEL SECURITY;

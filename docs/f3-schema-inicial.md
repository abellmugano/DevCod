# FASE 3: Especificação de Schema Inicial (DDL + RLS + Triggers)

Excelente captura do bug no script de scaffolding e da necessidade do `.gitignore`/`tsconfig.json`. A revisão rigorosa é exatamente o que garante a solidez da fundação. O script deve ser atualizado com `$basePath\src\core\ports` antes da execução.

Como PROJETISTA, entrego agora a **Especificação de Schema (DDL)**. Este é um artefato arquitetural de definição de dados, não lógica de negócio. A implementação deve seguir este contrato à risca para garantir Zero-Trust, Event Sourcing e Compliance.

---

## 📄 Arquivo 1: `supabase/migrations/001_initial_schema.sql`

Define as entidades fundamentais e as restrições de integridade de dados (CHECK constraints) para os pesos dos desafios.

```sql
-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabela de Roles (Gerenciada exclusivamente por Admin/Plataforma)
CREATE TABLE user_roles (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    role TEXT CHECK (role IN ('dev', 'maintainer', 'admin')) NOT NULL DEFAULT 'dev',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Projetos
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    github_repo TEXT UNIQUE NOT NULL,
    visibility TEXT CHECK (visibility IN ('public', 'private')) DEFAULT 'public',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Desafios (Com validação estrita de pesos)
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
    status TEXT CHECK (status IN ('open', 'in_progress', 'review', 'resolved', 'disputed')) DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
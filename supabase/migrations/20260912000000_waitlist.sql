-- Migration 006: Waitlist (captura de leads da landing page)
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('dev', 'maintainer', 'enterprise', 'other')) DEFAULT 'dev',
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode se inscrever (landing page pública)
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Apenas service_role pode ler (admins veem os leads)
-- (sem SELECT policy = deny all para anon/authenticated)

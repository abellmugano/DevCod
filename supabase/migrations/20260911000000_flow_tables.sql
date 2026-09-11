-- Migration 004: Tabelas de fluxo (contributions, disputes, etc)
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
    dev_id UUID REFERENCES auth.users(id) NOT NULL,
    proposal TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending','accepted','rejected','withdrawn')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
    dev_id UUID REFERENCES auth.users(id) NOT NULL,
    pr_url TEXT UNIQUE NOT NULL,
    status TEXT CHECK (status IN ('submitted','audited','approved','rejected','paid')) DEFAULT 'submitted',
    score DECIMAL(4,2),
    auto_score DECIMAL(4,2),
    manual_score DECIMAL(4,2),
    metrics_present BOOLEAN DEFAULT FALSE,
    penalty_applied BOOLEAN DEFAULT FALSE,
    algorithm_version TEXT DEFAULT 'score_v1',
    payment_intent_id TEXT,
    stripe_account_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contribution_id UUID REFERENCES contributions(id) ON DELETE CASCADE NOT NULL,
    challenger_id UUID REFERENCES auth.users(id) NOT NULL,
    challenged_id UUID REFERENCES auth.users(id) NOT NULL,
    reason TEXT NOT NULL CHECK (char_length(reason) >= 50),
    status TEXT CHECK (status IN ('pending','resolved','escalated','expired')) DEFAULT 'pending',
    decision TEXT CHECK (decision IN ('approve','reject')),
    deadline_at TIMESTAMPTZ NOT NULL,
    payment_intent_id TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS dispute_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dispute_id UUID REFERENCES disputes(id) ON DELETE CASCADE NOT NULL,
    voter_id UUID REFERENCES auth.users(id) NOT NULL,
    role TEXT CHECK (role IN ('platform','external_maintainer','community_lancer')) NOT NULL,
    option TEXT CHECK (option IN ('approve','reject')) NOT NULL,
    justification TEXT NOT NULL CHECK (char_length(justification) >= 50),
    voted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (dispute_id, voter_id)
);
ALTER TABLE dispute_votes ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS security_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low','medium','high','critical')) DEFAULT 'medium',
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;

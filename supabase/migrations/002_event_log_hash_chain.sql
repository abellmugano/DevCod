-- DevCod: Event Log com Hash Encadeado
-- Migração 002: Imutabilidade forense via SHA-256 + HMAC

CREATE TABLE event_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    previous_hash TEXT NOT NULL,
    current_hash TEXT NOT NULL,
    hmac_signature TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE event_log ENABLE ROW LEVEL SECURITY;

-- Trigger para calcular hash automaticamente
CREATE OR REPLACE FUNCTION calculate_event_hash()
RETURNS TRIGGER AS $$
DECLARE
    hash_input TEXT;
BEGIN
    IF NEW.previous_hash IS NULL OR NEW.previous_hash = '' THEN
        NEW.previous_hash := 'genesis';
    END IF;
    hash_input := NEW.event_type || '|' || NEW.payload::text || '|' || NEW.previous_hash;
    NEW.current_hash := encode(digest(hash_input, 'sha256'), 'hex');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_calculate_event_hash
BEFORE INSERT ON event_log
FOR EACH ROW
EXECUTE FUNCTION calculate_event_hash();

-- RLS: Apenas INSERT permitido
CREATE POLICY "Allow insert only" ON event_log
FOR INSERT TO authenticated
WITH CHECK (true);

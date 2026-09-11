-- Migration 005: Políticas RLS para tabelas de fluxo
-- Corrige omissão da migration 004

-- ============ APPLICATIONS ============
CREATE POLICY "Users read own applications" ON applications
FOR SELECT USING (dev_id = auth.uid());

CREATE POLICY "Users insert own applications" ON applications
FOR INSERT WITH CHECK (dev_id = auth.uid());

CREATE POLICY "Project owners read applications" ON applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM challenges c
    JOIN projects p ON p.id = c.project_id
    WHERE c.id = applications.challenge_id AND p.owner_id = auth.uid()
  )
);

CREATE POLICY "Project owners manage applications" ON applications
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM challenges c
    JOIN projects p ON p.id = c.project_id
    WHERE c.id = applications.challenge_id AND p.owner_id = auth.uid()
  )
);

-- ============ CONTRIBUTIONS ============
CREATE POLICY "Users read own contributions" ON contributions
FOR SELECT USING (dev_id = auth.uid());

CREATE POLICY "Users insert own contributions" ON contributions
FOR INSERT WITH CHECK (dev_id = auth.uid());

CREATE POLICY "Project owners read contributions" ON contributions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM challenges c
    JOIN projects p ON p.id = c.project_id
    WHERE c.id = contributions.challenge_id AND p.owner_id = auth.uid()
  )
);

CREATE POLICY "Service role manage contributions" ON contributions
FOR ALL USING (auth.role() = 'service_role');

-- ============ DISPUTES ============
CREATE POLICY "Users read own disputes" ON disputes
FOR SELECT USING (challenger_id = auth.uid() OR challenged_id = auth.uid());

CREATE POLICY "Users create disputes" ON disputes
FOR INSERT WITH CHECK (challenger_id = auth.uid());

CREATE POLICY "Service role manage disputes" ON disputes
FOR ALL USING (auth.role() = 'service_role');

-- ============ DISPUTE VOTES ============
CREATE POLICY "Committee read own votes" ON dispute_votes
FOR SELECT USING (voter_id = auth.uid());

CREATE POLICY "Committee insert votes" ON dispute_votes
FOR INSERT WITH CHECK (voter_id = auth.uid());

CREATE POLICY "Service role read dispute votes" ON dispute_votes
FOR SELECT USING (auth.role() = 'service_role');

-- ============ SECURITY ALERTS ============
CREATE POLICY "Service role insert alerts" ON security_alerts
FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role read alerts" ON security_alerts
FOR SELECT USING (auth.role() = 'service_role');

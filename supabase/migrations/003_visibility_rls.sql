-- DevCod: Políticas de Visibilidade (RLS)
-- Migração 003: Controle de acesso por role e visibility

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
    SELECT role FROM user_roles WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Projects
CREATE POLICY "Public projects readable" ON projects
FOR SELECT USING (visibility = 'public');

CREATE POLICY "Private projects by owner/admin" ON projects
FOR SELECT USING (
    visibility = 'private' AND (
        owner_id = auth.uid() OR get_user_role() = 'admin'
    )
);

CREATE POLICY "Only owners/admins manage projects" ON projects
FOR ALL USING (owner_id = auth.uid() OR get_user_role() = 'admin');

-- Challenges
CREATE POLICY "Public challenges readable" ON challenges
FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = challenges.project_id AND p.visibility = 'public')
);

CREATE POLICY "Private challenges by members" ON challenges
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM projects p
        WHERE p.id = challenges.project_id AND p.visibility = 'private'
        AND (p.owner_id = auth.uid() OR get_user_role() = 'admin')
    )
);

CREATE POLICY "Only project owners manage challenges" ON challenges
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM projects p
        WHERE p.id = challenges.project_id
        AND (p.owner_id = auth.uid() OR get_user_role() = 'admin')
    )
);

-- DevCoins: usuários leem apenas suas transações
CREATE POLICY "Users read own transactions" ON devcoin_transactions
FOR SELECT USING (user_id = auth.uid() OR get_user_role() = 'admin');

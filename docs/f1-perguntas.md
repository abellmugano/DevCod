# FASE 1: 5 Perguntas Críticas de Refinamento

O ADR-001 está **aprovado e bloqueado** com os 4 ajustes estratégicos (Event Log imutável, LGPD por design, Zero-Trust HMAC, Score versionado). 

Como Arquiteto-Estrategista, preciso que você, como detentor do domínio, responda a estas 5 perguntas para eliminar ambiguidades antes da crítica (F1.5) e da especificação (F2).

### 1. 📜 REGRAS (Lógica de Negócio)
- **Pesos das Metas:** O projeto define os pesos livremente (ex: 30/30/20/20) ou a plataforma impõe um *range* obrigatório (ex: "Qualidade/Testes" deve ter no mínimo 20%) para proteger o ecossistema?
- **Cálculo do Score:** No MVP, o Impact Score será 100% automatizado via CI/CD (ex: GitHub Actions + Webhook) ou exigirá uma etapa de **validação manual** do mantenedor antes da liberação do pagamento?

### 2. 🗄️ DADOS (Integração e Minimização)
- **Métricas do GitHub:** Quais dados exatos serão ingeridos para o cálculo? (Ex: apenas status de CI/CD e cobertura, ou também `lines_added`, `files_changed`, `review_comments`?)
- **Escopo de VCS:** O MVP será **exclusivamente GitHub** ou já precisa prever a abstração de adaptadores para GitLab/Bitbucket?

### 3. 👥 CLIENTES (Adoção Inicial)
- **Projetos Piloto:** Quem são os 3 a 5 projetos confirmados para o MVP? (Ex: DeepEngine e outros nomes específicos?)
- **Lancers Iniciais:** A entrada será por **convite fechado** (curadoria) ou **aberta** (self-service com validação de perfil GitHub)?

### 4. 🔮 FUTURO (Governança e Economia)
- **Natureza dos DevCoins:** Serão estritamente **pontos de fidelidade internos** (off-chain, banco de dados) ou há intenção de torná-los **ativos transacionáveis** (token/cripto) no futuro? (Isso define a complexidade do adaptador financeiro).
- **Votação:** A governança cooperativa inicial será off-chain (1 DevCoin = 1 voto no banco de dados) ou já exige estrutura on-chain?

### 5. 📈 VOLUME (Dimensionamento da Infra)
- **Carga do MVP:** Qual a estimativa realista para os primeiros 3 meses? (Ex: 10, 50 ou 100 desafios/mês? Quantos PRs/dia?)
- **Ticket Médio:** Qual o valor médio das recompensas por desafio? (Ex: R$ 500, R$ 5.000, R$ 20.000?) Isso impacta diretamente a configuração do Stripe Connect e os limites de RLS.
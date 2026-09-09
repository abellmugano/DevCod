# FASE 2: Especificação Completa do DevCod (v1.0)

## 1. 📋 SPECS (Requisitos Funcionais)
- **Desafios**: Criação com validação obrigatória de pesos (Funcionalidade ≥30%, Qualidade ≥20%, Docs ≥10%, Segurança ≥10%).
- **Score Híbrido (v1)**: Cálculo = (Métricas CI/CD: Complexidade Ciclomática, Arquivos de Domínio, Assertions, Diff Coverage, Lint × 60%) + (Avaliação Manual do Mantenedor × 40%).
- **Disputas**: Fluxo de 7 dias com Comitê de 3 membros (Plataforma, Mantenedor Externo, Lancer Sorteado). Pagamento retido em Escrow (Stripe) durante a análise.
- **DevCoins**: Sistema off-chain (tabela `devcoins`), não transferível, usado apenas para benefícios internos (taxas, badges, prioridade).
- **VCS**: Interface `VCSAdapter v1` implementada exclusivamente para GitHub no MVP, com métodos `GetMetrics`, `ParseWebhook`, `ValidateSignature`.

## 2. 🏛️ ARCHITECTURE (Dual Deploy & Core Isolado)
- **Core (`/src/core`)**: TypeScript puro, zero dependências de framework. Contém: `ScoreCalculator`, `ChallengeValidator`, `DisputeResolver`. Testável isoladamente.
- **Adaptadores**:
  - `WebAdapter`: Next.js 14 (App Router) para UI e API routes.
  - `DataAdapter`: Supabase (PostgreSQL + Auth + RLS).
  - `VCSAdapter`: GitHub API v3 + Webhooks (HMAC validated).
  - `PaymentAdapter`: Stripe Connect (Escrow, platform_fee 7%).
- **Event Sourcing**: Tabela `event_log` com `previous_hash` e `current_hash` (SHA-256 + HMAC via Supabase Vault). Append-only.

## 3. 🛡️ COMPLIANCE (Zero-Trust + LGPD + AGPL-3.0)
- **Licença**: AGPL-3.0 para todo o repositório. Modificações no backend devem ser abertas.
- **LGPD por Design**: 
  - Minimização: OAuth scopes restritos (`read:user`, `public_repo`). Dados de PII não armazenados em `event_log` ou `score_log`.
  - Direito ao Esquecimento: Endpoint `DELETE /api/v1/me` executa soft-delete e aciona webhook para expurgo de dados no Stripe.
- **Zero-Trust**: 
  - Webhooks do GitHub validados via HMAC-SHA256.
  - RLS rigoroso: Tabela `event_log` com política `INSERT` apenas via Edge Function autenticada. `UPDATE`/`DELETE` bloqueados universalmente.

## 4. 📊 FITNESS (Métricas de Qualidade Obrigatórias)
- **Complexidade**: Complexidade ciclomática máxima de **10** por função no `/src/core`.
- **Cobertura de Testes**: Mínimo de **80%** para todo o Core e Adaptadores. Mocks de VCS e Stripe obrigatórios.
- **Performance**: Cálculo de Score via Edge Function deve responder em < 2 segundos.
- **Segurança**: Scan de dependências (Dependabot) e linting (ESLint + SonarQube rules) bloqueando PRs com falhas críticas.

## 5. 🔄 MIGRATION (Plano de Evolução Lite → Heavy)
- **Fase 1 (MVP - Lite)**: Next.js + Supabase + Stripe. `event_log` com hash chain em PostgreSQL.
- **Fase 2 (Escala)**: 
  - Migrar cálculos pesados de Score para Workers dedicados (Go/Rust).
  - Substituir `event_log` PostgreSQL por Apache Kafka/Redis Streams para alta vazão, mantendo o schema de hash chain.
- **Fase 3 (Enterprise/DAO)**: 
  - Introdução de adaptador `BlockchainAdapter` para tokenização de DevCoins (ERC-20/SPL) e votação on-chain, mantendo o Core de negócios inalterado.
# ADR-001: Definição Arquitetural Inicial do DevCod

## Status
✅ Aprovado (v1.1)

## Contexto
DevCod é uma plataforma freelancer open source (AGPL-3.0) que remunera contribuições técnicas via metas mensuráveis, Impact Score e DevCoins.

## Decisão
- **Core Isolado** em `/src/core` (TypeScript puro, zero frameworks)
- **Dual Deploy**: Lite (MVP) → Heavy (Escala)
- **Event Sourcing** com hash encadeado + HMAC
- **Zero-Trust** com validação HMAC em webhooks
- **LGPD por Design** com minimização e soft-delete

## Stack Lite (MVP)
- Next.js 14 + Supabase + Stripe Connect + GitHub API v3

## Stack Heavy (Escala)
- Go/Rust workers + Apache Kafka + Kubernetes

## Vida Útil
- 5 anos: 1.000+ projetos mantidos
- 10 anos: Infraestrutura crítica global
- 20 anos: Padrão global de cooperação digital

# ============================================================
# SYNC.PS1 — Sincronização completa do DevCod
# Uso: .\sync.ps1
# ============================================================

$ErrorActionPreference = "Stop"
Write-Host "🔄 Iniciando sincronização DevCod..." -ForegroundColor Cyan

# 1. Git pull
Write-Host "`n📥 [1/5] Puxando alterações do GitHub..." -ForegroundColor Yellow
git pull origin main

# 2. Verificar status
Write-Host "`n📋 [2/5] Verificando status do Git..." -ForegroundColor Yellow
git status --short

# 3. Aplicar migrações pendentes no Supabase
Write-Host "`n🗄️  [3/5] Aplicando migrações no Supabase..." -ForegroundColor Yellow
supabase db push

# 4. Verificar migrações
Write-Host "`n📊 [4/5] Verificando migrações aplicadas..." -ForegroundColor Yellow
supabase migration list

# 5. Deploy das Edge Functions
Write-Host "`n🚀 [5/5] Fazendo deploy das Edge Functions..." -ForegroundColor Yellow
supabase functions deploy process-webhook
supabase functions deploy calculate-score
supabase functions deploy release-payment
supabase functions deploy resolve-dispute
supabase functions deploy verify-event-log
supabase functions deploy award-devcoins

Write-Host "`n✅ Sincronização concluída com sucesso!" -ForegroundColor Green
Write-Host "🌐 Dashboard: https://supabase.com/dashboard/project/yczqdkzyxmdeipejqxee" -ForegroundColor Cyan
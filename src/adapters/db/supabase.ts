// @ts-nocheck
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export class SupabaseAdapter {
  constructor(private supabase: SupabaseClient, private hmacSecret: string) {}

  async getContribution(id: string): Promise<any> {
    const { data, error } = await this.supabase.from("contributions").select("*").eq("id", id).single();
    if (error || !data) return null;
    return this.mapContribution(data);
  }

  async updateContributionScore(id: string, score: any): Promise<void> {
    const { error } = await this.supabase.from("contributions").update({
      score: score.totalScore,
      auto_score: score.autoScore,
      manual_score: score.manualScore,
      metrics_present: score.metricsPresent,
      penalty_applied: score.penaltyApplied,
      algorithm_version: score.algorithmVersion,
      status: "audited",
      updated_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) throw new Error(`updateContributionScore: ${error.message}`);
  }

  async listDisputesByContribution(contributionId: string): Promise<any[]> {
    const { data } = await this.supabase
      .from("disputes")
      .select("*")
      .eq("contribution_id", contributionId);
    return data || [];
  }

  async getDispute(id: string): Promise<any> {
    const { data } = await this.supabase.from("disputes").select("*").eq("id", id).single();
    return data;
  }

  async updateDisputeStatus(id: string, status: string, decision?: string): Promise<void> {
    const { error } = await this.supabase.from("disputes").update({
      status, decision: decision || null, resolved_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) throw new Error(`updateDisputeStatus: ${error.message}`);
  }

  async addDevCoins(userId: string, amount: number, reason: string, refId?: string): Promise<void> {
    const { error } = await this.supabase.from("devcoin_transactions").insert({
      user_id: userId, amount, reason, reference_id: refId,
    });
    if (error) throw new Error(`addDevCoins: ${error.message}`);
  }

  async logEvent(type: string, payload: any, userId: string): Promise<void> {
    const { data: last } = await this.supabase
      .from("event_log")
      .select("current_hash")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const prevHash = last?.current_hash || "genesis";
    const hashInput = `${type}|${JSON.stringify(payload)}|${prevHash}`;
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(hashInput));
    const currentHash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");

    const key = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(this.hmacSecret),
      { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(currentHash));
    const hmacSignature = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, "0")).join("");

    const { error } = await this.supabase.from("event_log").insert({
      event_type: type, payload, previous_hash: prevHash,
      current_hash: currentHash, hmac_signature: hmacSignature,
    });
    if (error) throw new Error(`logEvent: ${error.message}`);
  }

  async verifyEventLogChain(): Promise<boolean> {
    const { data: events } = await this.supabase
      .from("event_log")
      .select("*")
      .order("created_at", { ascending: true });

    let prevHash = "genesis";
    for (const event of events || []) {
      const hashInput = `${event.event_type}|${JSON.stringify(event.payload)}|${prevHash}`;
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(hashInput));
      const expectedHash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
      if (expectedHash !== event.current_hash) return false;
      prevHash = event.current_hash;
    }
    return true;
  }

  private mapContribution(row: any) {
    return {
      id: row.id,
      challengeId: row.challenge_id,
      devId: row.dev_id,
      prUrl: row.pr_url,
      status: row.status,
      score: row.score,
      autoScore: row.auto_score,
      manualScore: row.manual_score,
      metricsPresent: row.metrics_present,
      penaltyApplied: row.penalty_applied,
      algorithmVersion: row.algorithm_version,
      stripeAccountId: row.stripe_account_id,
      paymentIntentId: row.payment_intent_id,
    };
  }
}

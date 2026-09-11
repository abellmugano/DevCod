import { SupabaseClient } from "@supabase/supabase-js";
import * as crypto from "crypto";

// Tipos básicos (importar de src/core/ports/data.ts se existir)
export interface ChallengeInput {
  projectId: string;
  title: string;
  description: string;
  weights: Record<string, number>;
  rewardAmount: number;
  deadlineDays: number;
}

export interface Contribution {
  id: string;
  challengeId: string;
  devId: string;
  prUrl: string;
  status: string;
  score: number | null;
  paymentIntentId: string;
  stripeAccountId: string;
}

export class SupabaseAdapter {
  private supabase: SupabaseClient;
  private hmacSecret: string;

  constructor(supabase: SupabaseClient, hmacSecret: string) {
    this.supabase = supabase;
    this.hmacSecret = hmacSecret;
  }

  async createProject(input: any): Promise<any> {
    const { data, error } = await this.supabase
      .from("projects")
      .insert({
        owner_id: input.ownerId,
        name: input.name,
        github_repo: input.githubRepo,
        visibility: input.visibility,
      })
      .select()
      .single();
    if (error) throw new Error(`createProject: ${error.message}`);
    return data;
  }

  async getContribution(id: string): Promise<Contribution | null> {
    const { data, error } = await this.supabase
      .from("contributions")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      challengeId: data.challenge_id,
      devId: data.dev_id,
      prUrl: data.pr_url,
      status: data.status,
      score: data.score,
      paymentIntentId: data.payment_intent_id || "",
      stripeAccountId: data.stripe_account_id || "",
    };
  }

  async updateContributionScore(id: string, score: any): Promise<void> {
    const { error } = await this.supabase
      .from("contributions")
      .update({
        score: score.totalScore,
        auto_score: score.autoScore,
        manual_score: score.manualScore,
        metrics_present: score.metricsPresent,
        penalty_applied: score.penaltyApplied,
        algorithm_version: score.algorithmVersion,
        status: "audited",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw new Error(`updateContributionScore: ${error.message}`);
  }

  async listDisputesByContribution(contributionId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from("disputes")
      .select("*")
      .eq("contribution_id", contributionId);
    if (error) return [];
    return data || [];
  }

  async getDispute(id: string): Promise<any | null> {
    const { data, error } = await this.supabase
      .from("disputes")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return data;
  }

  async updateDisputeStatus(
    id: string,
    status: string,
    decision?: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from("disputes")
      .update({
        status,
        decision: decision || null,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) throw new Error(`updateDisputeStatus: ${error.message}`);
  }

  async addDevCoins(
    userId: string,
    amount: number,
    reason: string,
    referenceId?: string
  ): Promise<void> {
    const { error } = await this.supabase.from("devcoin_transactions").insert({
      user_id: userId,
      amount,
      reason,
      reference_id: referenceId || null,
    });
    if (error) throw new Error(`addDevCoins: ${error.message}`);
  }

  async logEvent(
    eventType: string,
    payload: Record<string, any>,
    userId: string
  ): Promise<void> {
    const { data: lastEvent } = await this.supabase
      .from("event_log")
      .select("current_hash")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const previousHash = lastEvent?.current_hash || "genesis";
    const hashInput = `${eventType}|${JSON.stringify(payload)}|${previousHash}`;
    const currentHash = crypto
      .createHash("sha256")
      .update(hashInput)
      .digest("hex");
    const hmacSignature = crypto
      .createHmac("sha256", this.hmacSecret)
      .update(currentHash)
      .digest("hex");

    const { error } = await this.supabase.from("event_log").insert({
      event_type: eventType,
      payload,
      previous_hash: previousHash,
      current_hash: currentHash,
      hmac_signature: hmacSignature,
    });
    if (error) throw new Error(`logEvent: ${error.message}`);
  }

  async verifyEventLogChain(fromEventId?: string): Promise<boolean> {
    const query = this.supabase
      .from("event_log")
      .select("*")
      .order("created_at", { ascending: true });
    const { data: events, error } = await query;
    if (error) return false;

    let previousHash = "genesis";
    for (const event of events || []) {
      const hashInput = `${event.event_type}|${JSON.stringify(event.payload)}|${previousHash}`;
      const expectedHash = crypto
        .createHash("sha256")
        .update(hashInput)
        .digest("hex");
      if (expectedHash !== event.current_hash) return false;

      const expectedHmac = crypto
        .createHmac("sha256", this.hmacSecret)
        .update(event.current_hash)
        .digest("hex");
      if (expectedHmac !== event.hmac_signature) return false;

      previousHash = event.current_hash;
    }
    return true;
  }
}

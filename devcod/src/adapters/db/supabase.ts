import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          github_username: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          github_username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          github_username?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          description: string;
          difficulty: 'easy' | 'medium' | 'hard';
          reward: number;
          status: 'open' | 'in_progress' | 'completed' | 'cancelled';
          created_by: string;
          created_at: string;
          deadline: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          difficulty: 'easy' | 'medium' | 'hard';
          reward: number;
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
          created_by: string;
          created_at?: string;
          deadline: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          difficulty?: 'easy' | 'medium' | 'hard';
          reward?: number;
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
          created_by?: string;
          created_at?: string;
          deadline?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          repository_url: string;
          status: 'pending' | 'accepted' | 'rejected';
          score: number | null;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          repository_url: string;
          status?: 'pending' | 'accepted' | 'rejected';
          score?: number | null;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          repository_url?: string;
          status?: 'pending' | 'accepted' | 'rejected';
          score?: number | null;
          submitted_at?: string;
        };
      };
      disputes: {
        Row: {
          id: string;
          submission_id: string;
          submitted_by: string;
          reason: string;
          description: string;
          status: 'pending' | 'under_review' | 'resolved' | 'escalated';
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          submission_id: string;
          submitted_by: string;
          reason: string;
          description: string;
          status?: 'pending' | 'under_review' | 'resolved' | 'escalated';
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          submission_id?: string;
          submitted_by?: string;
          reason?: string;
          description?: string;
          status?: 'pending' | 'under_review' | 'resolved' | 'escalated';
          created_at?: string;
          resolved_at?: string | null;
        };
      };
    };
  };
}

let supabaseInstance: SupabaseClient<Database> | null = null;

export function createSupabaseClient(
  supabaseUrl: string,
  supabaseAnonKey: string
): SupabaseClient<Database> {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

export function getSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Export types for convenience
export type User = Database['public']['Tables']['users']['Row'];
export type Challenge = Database['public']['Tables']['challenges']['Row'];
export type Submission = Database['public']['Tables']['submissions']['Row'];
export type Dispute = Database['public']['Tables']['disputes']['Row'];

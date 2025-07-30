import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          primary_color: string;
          secondary_color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          primary_color?: string;
          secondary_color?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          primary_color?: string;
          secondary_color?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      locations: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          phone: string | null;
          email: string | null;
          timezone: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          phone?: string | null;
          email?: string | null;
          timezone?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          phone?: string | null;
          email?: string | null;
          timezone?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      queues: {
        Row: {
          id: string;
          location_id: string;
          name: string;
          description: string | null;
          queue_type: string;
          status: 'active' | 'paused' | 'stopped';
          max_capacity: number;
          avg_service_time: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location_id: string;
          name: string;
          description?: string | null;
          queue_type?: string;
          status?: 'active' | 'paused' | 'stopped';
          max_capacity?: number;
          avg_service_time?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          location_id?: string;
          name?: string;
          description?: string | null;
          queue_type?: string;
          status?: 'active' | 'paused' | 'stopped';
          max_capacity?: number;
          avg_service_time?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          first_name: string | null;
          last_name: string | null;
          total_xp: number;
          current_level: number;
          avatar_url: string | null;
          preferences: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          total_xp?: number;
          current_level?: number;
          avatar_url?: string | null;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          total_xp?: number;
          current_level?: number;
          avatar_url?: string | null;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          queue_id: string;
          customer_id: string | null;
          ticket_number: string;
          customer_name: string;
          customer_phone: string | null;
          customer_email: string | null;
          purpose: string;
          status: 'waiting' | 'called' | 'served' | 'cancelled' | 'no_show' | 'parked';
          priority: number;
          estimated_wait_time: number;
          actual_wait_time: number;
          joined_at: string;
          called_at: string | null;
          served_at: string | null;
          notes: string | null;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          queue_id: string;
          customer_id?: string | null;
          ticket_number: string;
          customer_name: string;
          customer_phone?: string | null;
          customer_email?: string | null;
          purpose?: string;
          status?: 'waiting' | 'called' | 'served' | 'cancelled' | 'no_show' | 'parked';
          priority?: number;
          estimated_wait_time?: number;
          actual_wait_time?: number;
          joined_at?: string;
          called_at?: string | null;
          served_at?: string | null;
          notes?: string | null;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          queue_id?: string;
          customer_id?: string | null;
          ticket_number?: string;
          customer_name?: string;
          customer_phone?: string | null;
          customer_email?: string | null;
          purpose?: string;
          status?: 'waiting' | 'called' | 'served' | 'cancelled' | 'no_show' | 'parked';
          priority?: number;
          estimated_wait_time?: number;
          actual_wait_time?: number;
          joined_at?: string;
          called_at?: string | null;
          served_at?: string | null;
          notes?: string | null;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      mini_quests: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          description: string;
          quest_type: 'video' | 'survey' | 'social' | 'trivia' | 'review';
          xp_reward: number;
          icon: string;
          content: any;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          description: string;
          quest_type: 'video' | 'survey' | 'social' | 'trivia' | 'review';
          xp_reward?: number;
          icon?: string;
          content?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          title?: string;
          description?: string;
          quest_type?: 'video' | 'survey' | 'social' | 'trivia' | 'review';
          xp_reward?: number;
          icon?: string;
          content?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      customer_quests: {
        Row: {
          id: string;
          customer_id: string;
          quest_id: string;
          ticket_id: string;
          completed_at: string;
          xp_earned: number;
          completion_data: any;
        };
        Insert: {
          id?: string;
          customer_id: string;
          quest_id: string;
          ticket_id: string;
          completed_at?: string;
          xp_earned?: number;
          completion_data?: any;
        };
        Update: {
          id?: string;
          customer_id?: string;
          quest_id?: string;
          ticket_id?: string;
          completed_at?: string;
          xp_earned?: number;
          completion_data?: any;
        };
      };
      xp_rewards: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          description: string;
          cost: number;
          reward_type: 'discount' | 'skip' | 'cosmetic' | 'voucher';
          icon: string;
          effect_data: any;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          description: string;
          cost: number;
          reward_type: 'discount' | 'skip' | 'cosmetic' | 'voucher';
          icon?: string;
          effect_data?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          title?: string;
          description?: string;
          cost?: number;
          reward_type?: 'discount' | 'skip' | 'cosmetic' | 'voucher';
          icon?: string;
          effect_data?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      customer_purchases: {
        Row: {
          id: string;
          customer_id: string;
          reward_id: string;
          ticket_id: string | null;
          xp_cost: number;
          purchased_at: string;
          used_at: string | null;
          is_used: boolean;
        };
        Insert: {
          id?: string;
          customer_id: string;
          reward_id: string;
          ticket_id?: string | null;
          xp_cost: number;
          purchased_at?: string;
          used_at?: string | null;
          is_used?: boolean;
        };
        Update: {
          id?: string;
          customer_id?: string;
          reward_id?: string;
          ticket_id?: string | null;
          xp_cost?: number;
          purchased_at?: string;
          used_at?: string | null;
          is_used?: boolean;
        };
      };
      staff_users: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          location_id: string | null;
          email: string;
          first_name: string | null;
          last_name: string | null;
          role: 'admin' | 'manager' | 'staff';
          permissions: any;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          organization_id: string;
          location_id?: string | null;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: 'admin' | 'manager' | 'staff';
          permissions?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          organization_id?: string;
          location_id?: string | null;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          role?: 'admin' | 'manager' | 'staff';
          permissions?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      queue_analytics: {
        Row: {
          id: string;
          queue_id: string;
          date: string;
          total_tickets: number;
          served_tickets: number;
          cancelled_tickets: number;
          no_show_tickets: number;
          avg_wait_time: number;
          max_wait_time: number;
          peak_queue_length: number;
          total_xp_earned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          queue_id: string;
          date: string;
          total_tickets?: number;
          served_tickets?: number;
          cancelled_tickets?: number;
          no_show_tickets?: number;
          avg_wait_time?: number;
          max_wait_time?: number;
          peak_queue_length?: number;
          total_xp_earned?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          queue_id?: string;
          date?: string;
          total_tickets?: number;
          served_tickets?: number;
          cancelled_tickets?: number;
          no_show_tickets?: number;
          avg_wait_time?: number;
          max_wait_time?: number;
          peak_queue_length?: number;
          total_xp_earned?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
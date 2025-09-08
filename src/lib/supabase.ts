import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      user_info: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone_number?: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone_number?: string;
        };
        Update: {
          full_name?: string;
          phone_number?: string;
        };
      };
      appointments: {
        Row: {
          appointment_id: number;
          user_id: string;
          last_checkup_date?: string;
          next_appointment_date: string;
          notes?: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          last_checkup_date?: string;
          next_appointment_date: string;
          notes?: string;
        };
        Update: {
          last_checkup_date?: string;
          next_appointment_date?: string;
          notes?: string;
        };
      };
      eye_drop_schedules: {
        Row: {
          schedule_id: number;
          user_id: string;
          medication_name: string;
          frequency: number;
          times_of_day: string[];
          notes?: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          medication_name: string;
          frequency: number;
          times_of_day: string[];
          notes?: string;
        };
        Update: {
          medication_name?: string;
          frequency?: number;
          times_of_day?: string[];
          notes?: string;
        };
      };
    };
  };
};
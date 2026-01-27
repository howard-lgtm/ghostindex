export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          domain: string
          logo: string | null
          ghost_index_score: number | null
          stock_ticker: string | null
          stock_exchange: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain: string
          logo?: string | null
          ghost_index_score?: number | null
          stock_ticker?: string | null
          stock_exchange?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string
          logo?: string | null
          ghost_index_score?: number | null
          stock_ticker?: string | null
          stock_exchange?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          company_id: string
          status: 'pending' | 'approved' | 'rejected'
          is_verified: boolean
          job_title: string | null
          email_verification_id: string | null
          application_date: string | null
          last_contact_date: string | null
          days_since_contact: number | null
          auto_ghosted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_id: string
          status: 'pending' | 'approved' | 'rejected'
          is_verified?: boolean
          job_title?: string | null
          email_verification_id?: string | null
          application_date?: string | null
          last_contact_date?: string | null
          auto_ghosted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          is_verified?: boolean
          job_title?: string | null
          email_verification_id?: string | null
          application_date?: string | null
          last_contact_date?: string | null
          auto_ghosted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      verification_queue: {
        Row: {
          id: string
          email_hash: string
          status: 'pending' | 'verified' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email_hash: string
          status: 'pending' | 'verified' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email_hash?: string
          status?: 'pending' | 'verified' | 'failed'
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          report_id: string
          activity_type: 'application_sent' | 'confirmation_received' | 'interview_scheduled' | 'rejection_received' | 'ghosted'
          activity_date: string
          email_source: string | null
          parsed_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          report_id: string
          activity_type: 'application_sent' | 'confirmation_received' | 'interview_scheduled' | 'rejection_received' | 'ghosted'
          activity_date: string
          email_source?: string | null
          parsed_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          report_id?: string
          activity_type?: 'application_sent' | 'confirmation_received' | 'interview_scheduled' | 'rejection_received' | 'ghosted'
          activity_date?: string
          email_source?: string | null
          parsed_data?: Json | null
          created_at?: string
        }
      }
      email_verifications: {
        Row: {
          id: string
          user_id: string
          company_domain: string
          email_from: string
          email_subject: string | null
          email_body: string | null
          parsed_at: string
          verification_status: 'pending' | 'verified' | 'rejected'
          report_id: string | null
          raw_email_json: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_domain: string
          email_from: string
          email_subject?: string | null
          email_body?: string | null
          parsed_at?: string
          verification_status?: 'pending' | 'verified' | 'rejected'
          report_id?: string | null
          raw_email_json?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_domain?: string
          email_from?: string
          email_subject?: string | null
          email_body?: string | null
          parsed_at?: string
          verification_status?: 'pending' | 'verified' | 'rejected'
          report_id?: string | null
          raw_email_json?: Json | null
          created_at?: string
        }
      }
      job_postings: {
        Row: {
          id: string
          company_id: string
          job_title: string
          job_url: string | null
          first_seen_date: string
          last_seen_date: string
          days_active: number | null
          is_ghost_job: boolean
          source_platform: 'linkedin' | 'indeed' | 'glassdoor' | 'manual' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          job_title: string
          job_url?: string | null
          first_seen_date?: string
          last_seen_date?: string
          is_ghost_job?: boolean
          source_platform?: 'linkedin' | 'indeed' | 'glassdoor' | 'manual' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          job_title?: string
          job_url?: string | null
          first_seen_date?: string
          last_seen_date?: string
          is_ghost_job?: boolean
          source_platform?: 'linkedin' | 'indeed' | 'glassdoor' | 'manual' | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Database {
    public: {
      Tables: {
        users: {
          Row: {
            id: string
            user_id: string
            full_name: string
            username: string
            email: string
            profession: string
            summary?: string
            avatar?: string
            role?: string
            plan: "free" | "hustler" | "pro"
            plan_expires_at: string | null
            created_at: string
            updated_at?: string
          }
          Insert: {
            id: string
            email: string
            full_name?: string | null
            plan?: "free" | "hustler" | "pro"
            plan_expires_at?: string | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            email?: string
            full_name?: string | null
            plan?: "free" | "hustler" | "pro"
            plan_expires_at?: string | null
            created_at?: string
            updated_at?: string
          }
        }
        usage_tracking: {
          Row: {
            id: string
            user_id: string
            date: string
            roast_count: number
            plan_at_time: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            user_id: string
            date?: string
            roast_count?: number
            plan_at_time?: string
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            date?: string
            roast_count?: number
            plan_at_time?: string
            created_at?: string
            updated_at?: string
          }
        }
        cv_uploads: {
          Row: {
            id: string
            user_id: string
            file_name: string
            file_size: number
            file_type: string
            page_count: number | null
            word_count: number
            extracted_text: string
            upload_status: "processing" | "completed" | "failed"
            created_at: string
          }
          Insert: {
            id?: string
            user_id: string
            file_name: string
            file_size: number
            file_type: string
            page_count?: number | null
            word_count: number
            extracted_text: string
            upload_status?: "processing" | "completed" | "failed"
            created_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            file_name?: string
            file_size?: number
            file_type?: string
            page_count?: number | null
            word_count?: number
            extracted_text?: string
            upload_status?: "processing" | "completed" | "failed"
            created_at?: string
          }
        }
        roast_responses: {
          Row: {
            id: string
            user_id: string
            cv_upload_id: string
            roast_tone: "light" | "heavy"
            focus_areas: any[]
            show_emojis: boolean
            user_context: any | null
            overall_feedback: string
            feedback_points: any[]
            market_readiness: any
            kenyan_job_market_tips: any[]
            processing_time_seconds: number | null
            ai_tokens_used: number | null
            ai_model: string
            finish_reason: string | null
            created_at: string
            io_tokens: number[]
          }
          Insert: {
            id?: string
            user_id: string
            cv_upload_id: string
            roast_tone: "light" | "heavy"
            focus_areas?: any[]
            show_emojis?: boolean
            user_context?: any | null
            overall_feedback: string
            feedback_points?: any[]
            market_readiness: any
            kenyan_job_market_tips?: any[]
            processing_time_seconds?: number | null
            ai_tokens_used?: number | null
            ai_model?: string
            finish_reason?: string | null
            created_at?: string
            io_tokens: number[]
          }
          Update: {
            id?: string
            user_id?: string
            cv_upload_id?: string
            roast_tone?: "light" | "heavy"
            focus_areas?: any[]
            show_emojis?: boolean
            user_context?: any | null
            overall_feedback?: string
            feedback_points?: any[]
            market_readiness?: any
            kenyan_job_market_tips?: any[]
            processing_time_seconds?: number | null
            ai_tokens_used?: number | null
            ai_model?: string
            finish_reason?: string | null
            created_at?: string
            io_tokens: number[]
          }
        }
        user_feedback: {
          Row: {
            id: string
            user_id: string
            roast_response_id: string
            feedback_point_index: number
            feedback_type: "up" | "down"
            created_at: string
          }
          Insert: {
            id?: string
            user_id: string
            roast_response_id: string
            feedback_point_index: number
            feedback_type: "up" | "down"
            created_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            roast_response_id?: string
            feedback_point_index?: number
            feedback_type?: "up" | "down"
            created_at?: string
          }
        }
        payment_transactions: {
          Row: {
            id: string
            user_id: string
            plan: "hustler" | "pro"
            amount_ksh: number
            payment_method: string
            payment_provider: string
            transaction_reference: string | null
            status: "pending" | "completed" | "failed" | "cancelled"
            metadata: any | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            user_id: string
            plan: "hustler" | "pro"
            amount_ksh: number
            payment_method: string
            payment_provider: string
            transaction_reference?: string | null
            status?: "pending" | "completed" | "failed" | "cancelled"
            metadata?: any | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            plan?: "hustler" | "pro"
            amount_ksh?: number
            payment_method?: string
            payment_provider?: string
            transaction_reference?: string | null
            status?: "pending" | "completed" | "failed" | "cancelled"
            metadata?: any | null
            created_at?: string
            updated_at?: string
          }
        }
        ats_jobs: {
          Row: {
            id: string
            user_id: string
            resume_text: string
            job_description: string
            status: "processing" | "completed" | "failed"
            created_at: string
            updated_at: string
            error: string | null
          }
          Insert: {
            id?: string
            user_id: string
            resume_text: string
            job_description: string
            status?: "processing" | "completed" | "failed"
            created_at?: string
            updated_at?: string
            error?: string | null
          }
          Update: {
            id?: string
            user_id?: string
            resume_text?: string
            job_description?: string
            status?: "processing" | "completed" | "failed"
            created_at?: string
            updated_at?: string
            error?: string | null
          }
        }
      }
      Views: {
        user_analytics: {
          Row: {
            id: string
            email: string
            full_name: string | null
            plan: string
            user_since: string
            total_cv_uploads: number
            total_roasts: number
            avg_market_readiness_score: number | null
            last_roast_date: string | null
            total_historical_roasts: number
          }
        }
        daily_usage_analytics: {
          Row: {
            date: string
            active_users: number
            total_roasts: number
            avg_roasts_per_user: number
            free_users: number
            hustler_users: number
            pro_users: number
          }
        }
        roast_performance_analytics: {
          Row: {
            date: string
            roast_tone: string
            total_roasts: number
            avg_score: number
            avg_processing_time: number
            avg_tokens_used: number
            unique_users: number
          }
        }
      }
      Functions: {
        get_or_create_usage_tracking: {
          Args: { p_user_id: string }
          Returns: Database["public"]["Tables"]["usage_tracking"]["Row"]
        }
        increment_usage_count: {
          Args: { p_user_id: string }
          Returns: boolean
        }
        can_make_request: {
          Args: { p_user_id: string }
          Returns: boolean
        }
        upgrade_user_plan: {
          Args: {
            p_user_id: string
            p_new_plan: "hustler" | "pro"
            p_transaction_id?: string
          }
          Returns: boolean
        }
        get_user_stats: {
          Args: { p_user_id: string }
          Returns: any
        }
      }
    }
  }
  
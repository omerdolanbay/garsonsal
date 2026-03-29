export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    PostgrestVersion: "12"
    Tables: {
      businesses: {
        Row: {
          id: string; name: string; slug: string; email: string
          plan: string; plan_status: string
          trial_ends_at: string | null; subscription_ends_at: string | null
          logo_url: string | null
          brand_primary_color: string; brand_secondary_color: string
          created_at: string; updated_at: string
        }
        Insert: {
          id?: string; name: string; slug: string; email: string
          plan?: string; plan_status?: string
          trial_ends_at?: string | null; subscription_ends_at?: string | null
          logo_url?: string | null
          brand_primary_color?: string; brand_secondary_color?: string
        }
        Update: {
          id?: string; name?: string; slug?: string; email?: string
          plan?: string; plan_status?: string
          trial_ends_at?: string | null; subscription_ends_at?: string | null
          logo_url?: string | null
          brand_primary_color?: string; brand_secondary_color?: string
        }
        Relationships: []
      }
      tables: {
        Row: {
          id: string; business_id: string; table_number: number
          qr_token: string; is_active: boolean; created_at: string
        }
        Insert: {
          id?: string; business_id: string; table_number: number
          qr_token?: string; is_active?: boolean
        }
        Update: {
          id?: string; business_id?: string; table_number?: number
          qr_token?: string; is_active?: boolean
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          id: string; business_id: string; name: string
          sort_order: number; is_active: boolean
        }
        Insert: {
          id?: string; business_id: string; name: string
          sort_order?: number; is_active?: boolean
        }
        Update: {
          id?: string; business_id?: string; name?: string
          sort_order?: number; is_active?: boolean
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          id: string; business_id: string; category_id: string | null
          name: string; description: string | null; price: number
          image_url: string | null; is_active: boolean; sort_order: number
        }
        Insert: {
          id?: string; business_id: string; category_id?: string | null
          name: string; description?: string | null; price: number
          image_url?: string | null; is_active?: boolean; sort_order?: number
        }
        Update: {
          id?: string; business_id?: string; category_id?: string | null
          name?: string; description?: string | null; price?: number
          image_url?: string | null; is_active?: boolean; sort_order?: number
        }
        Relationships: []
      }
      order_sessions: {
        Row: {
          id: string; business_id: string; table_id: string | null
          session_token: string; status: string; expires_at: string; created_at: string
        }
        Insert: {
          id?: string; business_id: string; table_id?: string | null
          session_token?: string; status?: string; expires_at?: string
        }
        Update: {
          id?: string; business_id?: string; table_id?: string | null
          session_token?: string; status?: string; expires_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string; business_id: string; session_id: string | null
          table_id: string | null; table_number: number; items: Json
          total: number; status: string; note: string | null; created_at: string
        }
        Insert: {
          id?: string; business_id: string; session_id?: string | null
          table_id?: string | null; table_number: number; items: Json
          total: number; status?: string; note?: string | null
        }
        Update: {
          id?: string; business_id?: string; session_id?: string | null
          table_id?: string | null; table_number?: number; items?: Json
          total?: number; status?: string; note?: string | null
        }
        Relationships: []
      }
      waiter_calls: {
        Row: {
          id: string; business_id: string; table_id: string | null
          table_number: number; status: string; created_at: string
        }
        Insert: {
          id?: string; business_id: string; table_id?: string | null
          table_number: number; status?: string
        }
        Update: {
          id?: string; business_id?: string; table_id?: string | null
          table_number?: number; status?: string
        }
        Relationships: []
      }
      loyalty_members: {
        Row: {
          id: string; business_id: string; name: string
          phone: string | null; email: string | null; member_code: string
          stamp_count: number; total_stamps_earned: number
          wallet_type: string | null; push_token: string | null; created_at: string
        }
        Insert: {
          id?: string; business_id: string; name: string
          phone?: string | null; email?: string | null; member_code: string
          stamp_count?: number; total_stamps_earned?: number
          wallet_type?: string | null; push_token?: string | null
        }
        Update: {
          id?: string; business_id?: string; name?: string
          phone?: string | null; email?: string | null; member_code?: string
          stamp_count?: number; total_stamps_earned?: number
          wallet_type?: string | null; push_token?: string | null
        }
        Relationships: []
      }
      loyalty_settings: {
        Row: {
          id: string; business_id: string; stamps_required: number
          reward_description: string; stamp_icon_url: string | null
          empty_icon_url: string | null; card_bg_color: string
          card_text_color: string; updated_at: string
        }
        Insert: {
          id?: string; business_id: string; stamps_required?: number
          reward_description?: string; stamp_icon_url?: string | null
          empty_icon_url?: string | null; card_bg_color?: string
          card_text_color?: string
        }
        Update: {
          id?: string; business_id?: string; stamps_required?: number
          reward_description?: string; stamp_icon_url?: string | null
          empty_icon_url?: string | null; card_bg_color?: string
          card_text_color?: string
        }
        Relationships: []
      }
      loyalty_transactions: {
        Row: {
          id: string; business_id: string; member_id: string | null
          type: string; stamps_changed: number; note: string | null; created_at: string
        }
        Insert: {
          id?: string; business_id: string; member_id?: string | null
          type: string; stamps_changed: number; note?: string | null
        }
        Update: {
          id?: string; business_id?: string; member_id?: string | null
          type?: string; stamps_changed?: number; note?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string; business_id: string; plan: string; billing_cycle: string
          amount: number; discount_code: string | null; discount_amount: number
          status: string; starts_at: string; ends_at: string | null; created_at: string
        }
        Insert: {
          id?: string; business_id: string; plan: string; billing_cycle: string
          amount: number; discount_code?: string | null; discount_amount?: number
          status?: string; starts_at?: string; ends_at?: string | null
        }
        Update: {
          id?: string; business_id?: string; plan?: string; billing_cycle?: string
          amount?: number; discount_code?: string | null; discount_amount?: number
          status?: string; starts_at?: string; ends_at?: string | null
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          id: string; code: string; discount_type: string; discount_value: number
          applicable_plan: string | null; max_uses: number | null; used_count: number
          valid_from: string; valid_until: string | null; is_active: boolean; created_at: string
        }
        Insert: {
          id?: string; code: string; discount_type: string; discount_value: number
          applicable_plan?: string | null; max_uses?: number | null; used_count?: number
          valid_from?: string; valid_until?: string | null; is_active?: boolean
        }
        Update: {
          id?: string; code?: string; discount_type?: string; discount_value?: number
          applicable_plan?: string | null; max_uses?: number | null; used_count?: number
          valid_from?: string; valid_until?: string | null; is_active?: boolean
        }
        Relationships: []
      }
      super_admins: {
        Row: { id: string; email: string; created_at: string }
        Insert: { id?: string; email: string }
        Update: { id?: string; email?: string }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

// Tip kısayolları
export type Business = Database['public']['Tables']['businesses']['Row']
export type Table = Database['public']['Tables']['tables']['Row']
export type MenuCategory = Database['public']['Tables']['menu_categories']['Row']
export type MenuItem = Database['public']['Tables']['menu_items']['Row']
export type OrderSession = Database['public']['Tables']['order_sessions']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type WaiterCall = Database['public']['Tables']['waiter_calls']['Row']
export type LoyaltyMember = Database['public']['Tables']['loyalty_members']['Row']
export type LoyaltySettings = Database['public']['Tables']['loyalty_settings']['Row']
export type LoyaltyTransaction = Database['public']['Tables']['loyalty_transactions']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type DiscountCode = Database['public']['Tables']['discount_codes']['Row']

export type OrderStatus = 'new' | 'preparing' | 'delivered'
export type WaiterCallStatus = 'pending' | 'answered'
export type PlanType = 'starter' | 'growth' | 'pro'
export type PlanStatus = 'trial' | 'active' | 'cancelled'
export type BillingCycle = 'monthly' | 'yearly'
export type WalletType = 'apple' | 'google'
export type LoyaltyTransactionType = 'stamp' | 'reward_used'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

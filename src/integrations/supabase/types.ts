export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          hotline: string
          id: number
          office_address: string
          system_email: string
          updated_at: string
        }
        Insert: {
          hotline?: string
          id?: number
          office_address?: string
          system_email?: string
          updated_at?: string
        }
        Update: {
          hotline?: string
          id?: number
          office_address?: string
          system_email?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_assets: {
        Row: {
          caption: string | null
          created_at: string
          device: string
          id: string
          image_url: string
          is_active: boolean
          link_url: string | null
          sort_order: number
          zone: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          device?: string
          id?: string
          image_url: string
          is_active?: boolean
          link_url?: string | null
          sort_order?: number
          zone: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          device?: string
          id?: string
          image_url?: string
          is_active?: boolean
          link_url?: string | null
          sort_order?: number
          zone?: string
        }
        Relationships: []
      }
      cms_banners: {
        Row: {
          background: string | null
          created_at: string
          id: string
          is_active: boolean
          link_url: string | null
          message: string | null
          placement: string
        }
        Insert: {
          background?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          link_url?: string | null
          message?: string | null
          placement: string
        }
        Update: {
          background?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          link_url?: string | null
          message?: string | null
          placement?: string
        }
        Relationships: []
      }
      cms_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          images: Json
          is_active: boolean
          sort_order: number
          title: string
          updated_at: string
          video_url: string | null
          videos: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          images?: Json
          is_active?: boolean
          sort_order?: number
          title: string
          updated_at?: string
          video_url?: string | null
          videos?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          images?: Json
          is_active?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
          video_url?: string | null
          videos?: Json
        }
        Relationships: []
      }
      cms_leads: {
        Row: {
          broker_name: string | null
          contact: string
          created_at: string
          id: string
          name: string
          needs_support: boolean
          note: string | null
          qip: string | null
          role: string | null
          status: string
          updated_at: string
        }
        Insert: {
          broker_name?: string | null
          contact: string
          created_at?: string
          id?: string
          name: string
          needs_support?: boolean
          note?: string | null
          qip?: string | null
          role?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          broker_name?: string | null
          contact?: string
          created_at?: string
          id?: string
          name?: string
          needs_support?: boolean
          note?: string | null
          qip?: string | null
          role?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_lessons: {
        Row: {
          category: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          summary: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          summary?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          summary?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      cms_popup: {
        Row: {
          cooldown_hours: number
          desktop_image_url: string | null
          id: number
          is_active: boolean
          link_url: string | null
          mobile_image_url: string | null
          updated_at: string
        }
        Insert: {
          cooldown_hours?: number
          desktop_image_url?: string | null
          id?: number
          is_active?: boolean
          link_url?: string | null
          mobile_image_url?: string | null
          updated_at?: string
        }
        Update: {
          cooldown_hours?: number
          desktop_image_url?: string | null
          id?: number
          is_active?: boolean
          link_url?: string | null
          mobile_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cms_products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          mockup_url: string | null
          name: string
          risk_level: string
          slug: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          mockup_url?: string | null
          name: string
          risk_level?: string
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          mockup_url?: string | null
          name?: string
          risk_level?: string
          slug?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      dev_audit_log: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          route: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload?: Json
          route?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          route?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ib_audit_submissions: {
        Row: {
          brokers: string[]
          created_at: string
          email: string | null
          full_name: string
          id: string
          media_channel: string | null
          monthly_volume_bucket: string
          note: string | null
          notified_admin: boolean
          phone_zalo: string
          source_user_id: string | null
          team_size_bucket: string
          tier: string
        }
        Insert: {
          brokers?: string[]
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          media_channel?: string | null
          monthly_volume_bucket: string
          note?: string | null
          notified_admin?: boolean
          phone_zalo: string
          source_user_id?: string | null
          team_size_bucket: string
          tier?: string
        }
        Update: {
          brokers?: string[]
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          media_channel?: string | null
          monthly_volume_bucket?: string
          note?: string | null
          notified_admin?: boolean
          phone_zalo?: string
          source_user_id?: string | null
          team_size_bucket?: string
          tier?: string
        }
        Relationships: []
      }
      ib_profiles: {
        Row: {
          created_at: string
          current_team_size: number | null
          estimated_monthly_lots: number | null
          ib_level: number
          id: string
          media_channels: string | null
          parent_ib_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          current_team_size?: number | null
          estimated_monthly_lots?: number | null
          ib_level?: number
          id?: string
          media_channels?: string | null
          parent_ib_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          current_team_size?: number | null
          estimated_monthly_lots?: number | null
          ib_level?: number
          id?: string
          media_channels?: string | null
          parent_ib_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          membership_status: Database["public"]["Enums"]["membership_tier"]
          phone_zalo: string | null
          referred_by_ib_id: string | null
          updated_at: string
          vip_activation_type: Database["public"]["Enums"]["vip_activation_type"]
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          membership_status?: Database["public"]["Enums"]["membership_tier"]
          phone_zalo?: string | null
          referred_by_ib_id?: string | null
          updated_at?: string
          vip_activation_type?: Database["public"]["Enums"]["vip_activation_type"]
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          membership_status?: Database["public"]["Enums"]["membership_tier"]
          phone_zalo?: string | null
          referred_by_ib_id?: string | null
          updated_at?: string
          vip_activation_type?: Database["public"]["Enums"]["vip_activation_type"]
        }
        Relationships: []
      }
      trading_accounts: {
        Row: {
          broker_name: string
          capital_size: number | null
          created_at: string
          id: string
          is_ref_link_verified: boolean
          mt5_id: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          broker_name: string
          capital_size?: number | null
          created_at?: string
          id?: string
          is_ref_link_verified?: boolean
          mt5_id?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          broker_name?: string
          capital_size?: number | null
          created_at?: string
          id?: string
          is_ref_link_verified?: boolean
          mt5_id?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "master_ib" | "customer"
      membership_tier: "free" | "vip"
      vip_activation_type: "none" | "paid_subscription" | "broker_ref_verified"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "master_ib", "customer"],
      membership_tier: ["free", "vip"],
      vip_activation_type: ["none", "paid_subscription", "broker_ref_verified"],
    },
  },
} as const

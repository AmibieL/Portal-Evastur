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
      cart_items: {
        Row: {
          created_at: string
          id: string
          menu_selections: Json | null
          package_id: string
          people: number
          quantity: number
          travel_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          menu_selections?: Json | null
          package_id: string
          people?: number
          quantity?: number
          travel_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          menu_selections?: Json | null
          package_id?: string
          people?: number
          quantity?: number
          travel_date?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      cruzeiro_categories: {
        Row: {
          assigned_packages: string[] | null
          created_at: string | null
          description: string | null
          gallery_images: string[] | null
          id: string
          image_url: string | null
          slug: string
          sort_order: number | null
          title: string
        }
        Insert: {
          assigned_packages?: string[] | null
          created_at?: string | null
          description?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          slug: string
          sort_order?: number | null
          title: string
        }
        Update: {
          assigned_packages?: string[] | null
          created_at?: string | null
          description?: string | null
          gallery_images?: string[] | null
          id?: string
          image_url?: string | null
          slug?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      destination_gallery: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          destination_id: string
          id: string
          image_url: string
          sort_order: number
          storage_path: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          destination_id: string
          id?: string
          image_url: string
          sort_order?: number
          storage_path?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          destination_id?: string
          id?: string
          image_url?: string
          sort_order?: number
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "destination_gallery_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_highlights: {
        Row: {
          created_at: string
          description: string | null
          destination_id: string
          icon: string | null
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          destination_id: string
          icon?: string | null
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          destination_id?: string
          icon?: string | null
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "destination_highlights_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destination_itinerary_days: {
        Row: {
          created_at: string
          day_number: number
          description: string | null
          destination_id: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          day_number: number
          description?: string | null
          destination_id: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          day_number?: number
          description?: string | null
          destination_id?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "destination_itinerary_days_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          access_info: string | null
          active: boolean
          city: string | null
          country: string | null
          cover_image_path: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          publication_status: string
          recommendations: string | null
          region_type: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          state: string | null
          subtitle: string | null
          summary: string | null
          updated_at: string
        }
        Insert: {
          access_info?: string | null
          active?: boolean
          city?: string | null
          country?: string | null
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          publication_status?: string
          recommendations?: string | null
          region_type?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          state?: string | null
          subtitle?: string | null
          summary?: string | null
          updated_at?: string
        }
        Update: {
          access_info?: string | null
          active?: boolean
          city?: string | null
          country?: string | null
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          publication_status?: string
          recommendations?: string | null
          region_type?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          state?: string | null
          subtitle?: string | null
          summary?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          recipient_email: string
          resend_id: string | null
          status: string | null
          subject: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          recipient_email: string
          resend_id?: string | null
          status?: string | null
          subject?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          recipient_email?: string
          resend_id?: string | null
          status?: string | null
          subject?: string | null
          type?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          active: boolean
          created_at: string
          id: string
          image_url: string
          section: string | null
          sort_order: number
          title: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          image_url: string
          section?: string | null
          sort_order?: number
          title?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          image_url?: string
          section?: string | null
          sort_order?: number
          title?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          active: boolean | null
          email: string
          id: string
          name: string | null
          subscribed_at: string | null
          unsubscribe_token: string | null
        }
        Insert: {
          active?: boolean | null
          email: string
          id?: string
          name?: string | null
          subscribed_at?: string | null
          unsubscribe_token?: string | null
        }
        Update: {
          active?: boolean | null
          email?: string
          id?: string
          name?: string | null
          subscribed_at?: string | null
          unsubscribe_token?: string | null
        }
        Relationships: []
      }
      package_destinations: {
        Row: {
          created_at: string
          destination_id: string
          id: string
          is_primary: boolean
          package_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          destination_id: string
          id?: string
          is_primary?: boolean
          package_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          destination_id?: string
          id?: string
          is_primary?: boolean
          package_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "package_destinations_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_destinations_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      package_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          id: string
          image_url: string
          package_id: string
          sort_order: number
          storage_path: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          package_id: string
          sort_order?: number
          storage_path?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          package_id?: string
          sort_order?: number
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_images_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      package_inclusions: {
        Row: {
          id: string
          inclusion_key: string
          label: string
          package_id: string
        }
        Insert: {
          id?: string
          inclusion_key: string
          label: string
          package_id: string
        }
        Update: {
          id?: string
          inclusion_key?: string
          label?: string
          package_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_inclusions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      package_itinerary_days: {
        Row: {
          day_number: number
          description: string | null
          id: string
          package_id: string
          title: string
        }
        Insert: {
          day_number: number
          description?: string | null
          id?: string
          package_id: string
          title: string
        }
        Update: {
          day_number?: number
          description?: string | null
          id?: string
          package_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_itinerary_days_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      package_menu_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          package_id: string
          price: number
          sort_order: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          package_id: string
          price?: number
          sort_order?: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          package_id?: string
          price?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "package_menu_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          active: boolean
          available_slots: number | null
          category: string
          cover_image_path: string | null
          cover_image_url: string | null
          created_at: string
          destination_id: string | null
          destination_name: string | null
          duration: string | null
          full_description: string | null
          id: string
          installments: number | null
          package_details: Json | null
          package_type: string
          price: number
          publication_status: string
          route_info: Json | null
          sales_status: string
          short_description: string | null
          slug: string
          status: string
          title: string
          total_slots: number | null
          travel_date: string | null
          travel_time: string | null
          travel_scope: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          available_slots?: number | null
          category?: string
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          destination_id?: string | null
          destination_name?: string | null
          duration?: string | null
          full_description?: string | null
          id?: string
          installments?: number | null
          package_details?: Json | null
          package_type?: string
          price?: number
          publication_status?: string
          route_info?: Json | null
          sales_status?: string
          short_description?: string | null
          slug: string
          status?: string
          title: string
          total_slots?: number | null
          travel_date?: string | null
          travel_time?: string | null
          travel_scope?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          available_slots?: number | null
          category?: string
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          destination_id?: string | null
          destination_name?: string | null
          duration?: string | null
          full_description?: string | null
          id?: string
          installments?: number | null
          package_details?: Json | null
          package_type?: string
          price?: number
          publication_status?: string
          route_info?: Json | null
          sales_status?: string
          short_description?: string | null
          slug?: string
          status?: string
          title?: string
          total_slots?: number | null
          travel_date?: string | null
          travel_time?: string | null
          travel_scope?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "packages_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          age: string | null
          asaas_customer_id: string | null
          avatar_url: string | null
          city: string | null
          cpf: string | null
          created_at: string
          full_name: string | null
          id: string
          role: string
          state: string | null
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          age?: string | null
          asaas_customer_id?: string | null
          avatar_url?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          state?: string | null
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          age?: string | null
          asaas_customer_id?: string | null
          avatar_url?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          state?: string | null
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      reservations: {
        Row: {
          asaas_payment_id: string | null
          client_city: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          destination: string | null
          id: string
          notes: string | null
          occupants: Json | null
          order_id: string
          package_id: string | null
          package_name: string
          payment_status: string
          people: number
          status: string
          total_price: number
          travel_date: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          asaas_payment_id?: string | null
          client_city?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          destination?: string | null
          id?: string
          notes?: string | null
          occupants?: Json | null
          order_id: string
          package_id?: string | null
          package_name: string
          payment_status?: string
          people?: number
          status?: string
          total_price?: number
          travel_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          asaas_payment_id?: string | null
          client_city?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          destination?: string | null
          id?: string
          notes?: string | null
          occupants?: Json | null
          order_id?: string
          package_id?: string | null
          package_name?: string
          payment_status?: string
          people?: number
          status?: string
          total_price?: number
          travel_date?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          package_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          package_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          package_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          asaas_payment_id: string | null
          client_email: string | null
          client_name: string
          created_at: string
          id: string
          order_id: string | null
          package_name: string | null
          payment_date: string | null
          payment_method: string | null
          reservation_id: string | null
          status: string
        }
        Insert: {
          amount: number
          asaas_payment_id?: string | null
          client_email?: string | null
          client_name: string
          created_at?: string
          id?: string
          order_id?: string | null
          package_name?: string | null
          payment_date?: string | null
          payment_method?: string | null
          reservation_id?: string | null
          status?: string
        }
        Update: {
          amount?: number
          asaas_payment_id?: string | null
          client_email?: string | null
          client_name?: string
          created_at?: string
          id?: string
          order_id?: string | null
          package_name?: string | null
          payment_date?: string | null
          payment_method?: string | null
          reservation_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          package_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          package_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          package_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vouchers: {
        Row: {
          client_email: string | null
          client_name: string
          created_at: string | null
          destination: string | null
          id: string
          occupants: Json | null
          package_duration: string | null
          package_inclusions: Json | null
          package_name: string
          people: number | null
          reservation_id: string | null
          route_info: Json | null
          status: string
          total_price: number | null
          travel_date: string | null
          voucher_code: string
        }
        Insert: {
          client_email?: string | null
          client_name: string
          created_at?: string | null
          destination?: string | null
          id?: string
          occupants?: Json | null
          package_duration?: string | null
          package_inclusions?: Json | null
          package_name: string
          people?: number | null
          reservation_id?: string | null
          route_info?: Json | null
          status?: string
          total_price?: number | null
          travel_date?: string | null
          voucher_code: string
        }
        Update: {
          client_email?: string | null
          client_name?: string
          created_at?: string | null
          destination?: string | null
          id?: string
          occupants?: Json | null
          package_duration?: string | null
          package_inclusions?: Json | null
          package_name?: string
          people?: number | null
          reservation_id?: string | null
          route_info?: Json | null
          status?: string
          total_price?: number | null
          travel_date?: string | null
          voucher_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      save_package_catalog: {
        Args: {
          p_destinations: Json
          p_images: Json
          p_inclusions: Json
          p_itinerary: Json
          p_menu_items: Json
          p_package: Json
          p_travel_time?: string | null
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

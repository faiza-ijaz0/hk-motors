export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string;
          actor_id: string | null;
          created_at: string;
          diff: Json | null;
          entity_id: string | null;
          entity_table: string;
          id: number;
          ip_address: unknown;
        };
        Insert: {
          action: string;
          actor_id?: string | null;
          created_at?: string;
          diff?: Json | null;
          entity_id?: string | null;
          entity_table: string;
          id?: never;
          ip_address?: unknown;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          created_at?: string;
          diff?: Json | null;
          entity_id?: string | null;
          entity_table?: string;
          id?: never;
          ip_address?: unknown;
        };
        Relationships: [
          {
            foreignKeyName: "activity_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      appointments: {
        Row: {
          assigned_to: string | null;
          car_id: string | null;
          created_at: string;
          duration_minutes: number;
          email: string | null;
          full_name: string;
          id: string;
          lead_id: string | null;
          notes: string | null;
          phone: string | null;
          scheduled_at: string;
          service_id: string | null;
          status: Database["public"]["Enums"]["appointment_status"];
          type: Database["public"]["Enums"]["appointment_type"];
          updated_at: string;
        };
        Insert: {
          assigned_to?: string | null;
          car_id?: string | null;
          created_at?: string;
          duration_minutes?: number;
          email?: string | null;
          full_name: string;
          id?: string;
          lead_id?: string | null;
          notes?: string | null;
          phone?: string | null;
          scheduled_at: string;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["appointment_status"];
          type: Database["public"]["Enums"]["appointment_type"];
          updated_at?: string;
        };
        Update: {
          assigned_to?: string | null;
          car_id?: string | null;
          created_at?: string;
          duration_minutes?: number;
          email?: string | null;
          full_name?: string;
          id?: string;
          lead_id?: string | null;
          notes?: string | null;
          phone?: string | null;
          scheduled_at?: string;
          service_id?: string | null;
          status?: Database["public"]["Enums"]["appointment_status"];
          type?: Database["public"]["Enums"]["appointment_type"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "appointments_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "appointments_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          author_id: string | null;
          category_id: string | null;
          content: string;
          cover_image_path: string | null;
          created_at: string;
          excerpt: string | null;
          id: string;
          published_at: string | null;
          seo_description: string | null;
          seo_title: string | null;
          slug: string;
          status: Database["public"]["Enums"]["blog_status"];
          tags: string[];
          title: string;
          updated_at: string;
          view_count: number;
        };
        Insert: {
          author_id?: string | null;
          category_id?: string | null;
          content: string;
          cover_image_path?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug: string;
          status?: Database["public"]["Enums"]["blog_status"];
          tags?: string[];
          title: string;
          updated_at?: string;
          view_count?: number;
        };
        Update: {
          author_id?: string | null;
          category_id?: string | null;
          content?: string;
          cover_image_path?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          published_at?: string | null;
          seo_description?: string | null;
          seo_title?: string | null;
          slug?: string;
          status?: Database["public"]["Enums"]["blog_status"];
          tags?: string[];
          title?: string;
          updated_at?: string;
          view_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "blog_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      car_categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      car_feature_map: {
        Row: {
          car_id: string;
          feature_id: string;
        };
        Insert: {
          car_id: string;
          feature_id: string;
        };
        Update: {
          car_id?: string;
          feature_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "car_feature_map_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "car_feature_map_feature_id_fkey";
            columns: ["feature_id"];
            isOneToOne: false;
            referencedRelation: "car_features";
            referencedColumns: ["id"];
          },
        ];
      };
      car_features: {
        Row: {
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      car_images: {
        Row: {
          alt_text: string | null;
          car_id: string;
          created_at: string;
          external_url: string | null;
          id: string;
          is_primary: boolean;
          media_type: Database["public"]["Enums"]["gallery_media_type"];
          position: number;
          storage_path: string | null;
        };
        Insert: {
          alt_text?: string | null;
          car_id: string;
          created_at?: string;
          external_url?: string | null;
          id?: string;
          is_primary?: boolean;
          media_type?: Database["public"]["Enums"]["gallery_media_type"];
          position?: number;
          storage_path?: string | null;
        };
        Update: {
          alt_text?: string | null;
          car_id?: string;
          created_at?: string;
          external_url?: string | null;
          id?: string;
          is_primary?: boolean;
          media_type?: Database["public"]["Enums"]["gallery_media_type"];
          position?: number;
          storage_path?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "car_images_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          },
        ];
      };
      car_makes: {
        Row: {
          created_at: string;
          id: string;
          logo_path: string | null;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          logo_path?: string | null;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          logo_path?: string | null;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      car_models: {
        Row: {
          created_at: string;
          id: string;
          make_id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          make_id: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          make_id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: "car_models_make_id_fkey";
            columns: ["make_id"];
            isOneToOne: false;
            referencedRelation: "car_makes";
            referencedColumns: ["id"];
          },
        ];
      };
      cars: {
        Row: {
          category_id: string | null;
          condition: Database["public"]["Enums"]["car_condition"];
          created_at: string;
          created_by: string | null;
          currency_code: string;
          description: string | null;
          doors: number | null;
          drivetrain: Database["public"]["Enums"]["drivetrain_type"] | null;
          engine: string | null;
          exterior_color: string | null;
          fuel_type: Database["public"]["Enums"]["fuel_type"] | null;
          horsepower: number | null;
          id: string;
          interior_color: string | null;
          is_featured: boolean;
          make_id: string;
          mileage: number | null;
          model_id: string;
          price: number;
          published_at: string | null;
          seats: number | null;
          slug: string;
          status: Database["public"]["Enums"]["car_status"];
          title: string;
          transmission: Database["public"]["Enums"]["transmission_type"] | null;
          updated_at: string;
          updated_by: string | null;
          view_count: number;
          vin: string | null;
          year: number;
        };
        Insert: {
          category_id?: string | null;
          condition?: Database["public"]["Enums"]["car_condition"];
          created_at?: string;
          created_by?: string | null;
          currency_code?: string;
          description?: string | null;
          doors?: number | null;
          drivetrain?: Database["public"]["Enums"]["drivetrain_type"] | null;
          engine?: string | null;
          exterior_color?: string | null;
          fuel_type?: Database["public"]["Enums"]["fuel_type"] | null;
          horsepower?: number | null;
          id?: string;
          interior_color?: string | null;
          is_featured?: boolean;
          make_id: string;
          mileage?: number | null;
          model_id: string;
          price: number;
          published_at?: string | null;
          seats?: number | null;
          slug: string;
          status?: Database["public"]["Enums"]["car_status"];
          title: string;
          transmission?:
            Database["public"]["Enums"]["transmission_type"] | null;
          updated_at?: string;
          updated_by?: string | null;
          view_count?: number;
          vin?: string | null;
          year: number;
        };
        Update: {
          category_id?: string | null;
          condition?: Database["public"]["Enums"]["car_condition"];
          created_at?: string;
          created_by?: string | null;
          currency_code?: string;
          description?: string | null;
          doors?: number | null;
          drivetrain?: Database["public"]["Enums"]["drivetrain_type"] | null;
          engine?: string | null;
          exterior_color?: string | null;
          fuel_type?: Database["public"]["Enums"]["fuel_type"] | null;
          horsepower?: number | null;
          id?: string;
          interior_color?: string | null;
          is_featured?: boolean;
          make_id?: string;
          mileage?: number | null;
          model_id?: string;
          price?: number;
          published_at?: string | null;
          seats?: number | null;
          slug?: string;
          status?: Database["public"]["Enums"]["car_status"];
          title?: string;
          transmission?:
            Database["public"]["Enums"]["transmission_type"] | null;
          updated_at?: string;
          updated_by?: string | null;
          view_count?: number;
          vin?: string | null;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "cars_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "car_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cars_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cars_make_id_fkey";
            columns: ["make_id"];
            isOneToOne: false;
            referencedRelation: "car_makes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cars_model_id_fkey";
            columns: ["model_id"];
            isOneToOne: false;
            referencedRelation: "car_models";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cars_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          full_name: string;
          handled_by: string | null;
          id: string;
          is_read: boolean;
          message: string;
          phone: string | null;
          replied_at: string | null;
          subject: string | null;
        };
        Insert: {
          created_at?: string;
          email: string;
          full_name: string;
          handled_by?: string | null;
          id?: string;
          is_read?: boolean;
          message: string;
          phone?: string | null;
          replied_at?: string | null;
          subject?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string;
          full_name?: string;
          handled_by?: string | null;
          id?: string;
          is_read?: boolean;
          message?: string;
          phone?: string | null;
          replied_at?: string | null;
          subject?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "contact_messages_handled_by_fkey";
            columns: ["handled_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      gallery_albums: {
        Row: {
          cover_image_path: string | null;
          created_at: string;
          description: string | null;
          id: string;
          is_published: boolean;
          position: number;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          cover_image_path?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_published?: boolean;
          position?: number;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          cover_image_path?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_published?: boolean;
          position?: number;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gallery_images: {
        Row: {
          album_id: string | null;
          caption: string | null;
          category: Database["public"]["Enums"]["gallery_category"];
          created_at: string;
          external_url: string | null;
          id: string;
          media_type: Database["public"]["Enums"]["gallery_media_type"];
          position: number;
          storage_path: string | null;
        };
        Insert: {
          album_id?: string | null;
          caption?: string | null;
          category: Database["public"]["Enums"]["gallery_category"];
          created_at?: string;
          external_url?: string | null;
          id?: string;
          media_type?: Database["public"]["Enums"]["gallery_media_type"];
          position?: number;
          storage_path?: string | null;
        };
        Update: {
          album_id?: string | null;
          caption?: string | null;
          category?: Database["public"]["Enums"]["gallery_category"];
          created_at?: string;
          external_url?: string | null;
          id?: string;
          media_type?: Database["public"]["Enums"]["gallery_media_type"];
          position?: number;
          storage_path?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "gallery_images_album_id_fkey";
            columns: ["album_id"];
            isOneToOne: false;
            referencedRelation: "gallery_albums";
            referencedColumns: ["id"];
          },
        ];
      };
      homepage_sections: {
        Row: {
          content: Json;
          created_at: string;
          id: string;
          is_visible: boolean;
          position: number;
          subtitle: string | null;
          title: string | null;
          type: Database["public"]["Enums"]["homepage_section_type"];
          updated_at: string;
        };
        Insert: {
          content?: Json;
          created_at?: string;
          id?: string;
          is_visible?: boolean;
          position?: number;
          subtitle?: string | null;
          title?: string | null;
          type: Database["public"]["Enums"]["homepage_section_type"];
          updated_at?: string;
        };
        Update: {
          content?: Json;
          created_at?: string;
          id?: string;
          is_visible?: boolean;
          position?: number;
          subtitle?: string | null;
          title?: string | null;
          type?: Database["public"]["Enums"]["homepage_section_type"];
          updated_at?: string;
        };
        Relationships: [];
      };
      lead_notes: {
        Row: {
          created_at: string;
          id: string;
          lead_id: string;
          note: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          lead_id: string;
          note: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          lead_id?: string;
          note?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lead_notes_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      leads: {
        Row: {
          assigned_to: string | null;
          car_id: string | null;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          lead_type: Database["public"]["Enums"]["lead_type"];
          message: string | null;
          phone: string | null;
          service_id: string | null;
          source: Database["public"]["Enums"]["lead_source"];
          status: Database["public"]["Enums"]["lead_status"];
          updated_at: string;
        };
        Insert: {
          assigned_to?: string | null;
          car_id?: string | null;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          lead_type?: Database["public"]["Enums"]["lead_type"];
          message?: string | null;
          phone?: string | null;
          service_id?: string | null;
          source?: Database["public"]["Enums"]["lead_source"];
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
        };
        Update: {
          assigned_to?: string | null;
          car_id?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          lead_type?: Database["public"]["Enums"]["lead_type"];
          message?: string | null;
          phone?: string | null;
          service_id?: string | null;
          source?: Database["public"]["Enums"]["lead_source"];
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "leads_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          entity_id: string | null;
          entity_table: string | null;
          id: string;
          is_read: boolean;
          link_url: string | null;
          read_at: string | null;
          recipient_id: string;
          title: string;
          type: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_table?: string | null;
          id?: string;
          is_read?: boolean;
          link_url?: string | null;
          read_at?: string | null;
          recipient_id: string;
          title: string;
          type: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          entity_id?: string | null;
          entity_table?: string | null;
          id?: string;
          is_read?: boolean;
          link_url?: string | null;
          read_at?: string | null;
          recipient_id?: string;
          title?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_recipient_id_fkey";
            columns: ["recipient_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          created_at: string;
          description: string | null;
          icon: string | null;
          id: string;
          image_path: string | null;
          is_active: boolean;
          position: number;
          price_from: number | null;
          slug: string;
          summary: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          image_path?: string | null;
          is_active?: boolean;
          position?: number;
          price_from?: number | null;
          slug: string;
          summary?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          image_path?: string | null;
          is_active?: boolean;
          position?: number;
          price_from?: number | null;
          slug?: string;
          summary?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      team_members: {
        Row: {
          bio: string | null;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          is_published: boolean;
          phone: string | null;
          photo_path: string | null;
          position: number;
          role_title: string;
          social_links: Json;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          is_published?: boolean;
          phone?: string | null;
          photo_path?: string | null;
          position?: number;
          role_title: string;
          social_links?: Json;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          is_published?: boolean;
          phone?: string | null;
          photo_path?: string | null;
          position?: number;
          role_title?: string;
          social_links?: Json;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      testimonials: {
        Row: {
          approved_at: string | null;
          approved_by: string | null;
          car_id: string | null;
          created_at: string;
          customer_name: string;
          customer_photo_path: string | null;
          id: string;
          is_featured: boolean;
          quote: string;
          rating: number;
          status: Database["public"]["Enums"]["testimonial_status"];
          updated_at: string;
        };
        Insert: {
          approved_at?: string | null;
          approved_by?: string | null;
          car_id?: string | null;
          created_at?: string;
          customer_name: string;
          customer_photo_path?: string | null;
          id?: string;
          is_featured?: boolean;
          quote: string;
          rating: number;
          status?: Database["public"]["Enums"]["testimonial_status"];
          updated_at?: string;
        };
        Update: {
          approved_at?: string | null;
          approved_by?: string | null;
          car_id?: string | null;
          created_at?: string;
          customer_name?: string;
          customer_photo_path?: string | null;
          id?: string;
          is_featured?: boolean;
          quote?: string;
          rating?: number;
          status?: Database["public"]["Enums"]["testimonial_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "testimonials_approved_by_fkey";
            columns: ["approved_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "testimonials_car_id_fkey";
            columns: ["car_id"];
            isOneToOne: false;
            referencedRelation: "cars";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          avatar_path: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          invited_by: string | null;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"];
          status: Database["public"]["Enums"]["user_status"];
          updated_at: string;
        };
        Insert: {
          avatar_path?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id: string;
          invited_by?: string | null;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          status?: Database["public"]["Enums"]["user_status"];
          updated_at?: string;
        };
        Update: {
          avatar_path?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          invited_by?: string | null;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          status?: Database["public"]["Enums"]["user_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_invited_by_fkey";
            columns: ["invited_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      website_settings: {
        Row: {
          address: string | null;
          company_name: string;
          contact_email: string | null;
          contact_phone: string | null;
          id: number;
          logo_path: string | null;
          seo_default_description: string | null;
          seo_default_image_path: string | null;
          seo_default_title: string | null;
          social_links: Json;
          updated_at: string;
          updated_by: string | null;
          whatsapp_number: string | null;
        };
        Insert: {
          address?: string | null;
          company_name: string;
          contact_email?: string | null;
          contact_phone?: string | null;
          id?: number;
          logo_path?: string | null;
          seo_default_description?: string | null;
          seo_default_image_path?: string | null;
          seo_default_title?: string | null;
          social_links?: Json;
          updated_at?: string;
          updated_by?: string | null;
          whatsapp_number?: string | null;
        };
        Update: {
          address?: string | null;
          company_name?: string;
          contact_email?: string | null;
          contact_phone?: string | null;
          id?: number;
          logo_path?: string | null;
          seo_default_description?: string | null;
          seo_default_image_path?: string | null;
          seo_default_title?: string | null;
          social_links?: Json;
          updated_at?: string;
          updated_by?: string | null;
          whatsapp_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "website_settings_updated_by_fkey";
            columns: ["updated_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      current_staff_role: {
        Args: never;
        Returns: Database["public"]["Enums"]["user_role"];
      };
      is_staff: { Args: never; Returns: boolean };
    };
    Enums: {
      appointment_status:
        "requested" | "confirmed" | "completed" | "cancelled" | "no_show";
      appointment_type: "test_drive" | "service" | "consultation" | "delivery";
      blog_status: "draft" | "published" | "archived";
      car_condition: "new" | "used" | "certified_pre_owned";
      car_status:
        | "draft"
        | "pending_review"
        | "published"
        | "reserved"
        | "sold"
        | "archived";
      drivetrain_type: "fwd" | "rwd" | "awd" | "4wd";
      fuel_type: "petrol" | "diesel" | "hybrid" | "electric" | "lpg";
      gallery_category: "cars" | "showroom" | "deliveries" | "events";
      gallery_media_type: "image" | "video";
      homepage_section_type:
        | "hero"
        | "featured_cars"
        | "why_choose_us"
        | "services_highlight"
        | "testimonials_highlight"
        | "gallery_highlight"
        | "blog_highlight"
        | "cta_banner";
      lead_source:
        "website" | "phone" | "walk_in" | "referral" | "social" | "other";
      lead_status: "new" | "contacted" | "qualified" | "converted" | "lost";
      lead_type:
        | "car_inquiry"
        | "service_inquiry"
        | "trade_in"
        | "financing"
        | "general";
      testimonial_status: "pending" | "approved" | "rejected";
      transmission_type: "automatic" | "manual" | "cvt" | "dual_clutch";
      user_role: "super_admin" | "admin" | "employee";
      user_status: "invited" | "active" | "suspended";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        "requested",
        "confirmed",
        "completed",
        "cancelled",
        "no_show",
      ],
      appointment_type: ["test_drive", "service", "consultation", "delivery"],
      blog_status: ["draft", "published", "archived"],
      car_condition: ["new", "used", "certified_pre_owned"],
      car_status: [
        "draft",
        "pending_review",
        "published",
        "reserved",
        "sold",
        "archived",
      ],
      drivetrain_type: ["fwd", "rwd", "awd", "4wd"],
      fuel_type: ["petrol", "diesel", "hybrid", "electric", "lpg"],
      gallery_category: ["cars", "showroom", "deliveries", "events"],
      gallery_media_type: ["image", "video"],
      homepage_section_type: [
        "hero",
        "featured_cars",
        "why_choose_us",
        "services_highlight",
        "testimonials_highlight",
        "gallery_highlight",
        "blog_highlight",
        "cta_banner",
      ],
      lead_source: [
        "website",
        "phone",
        "walk_in",
        "referral",
        "social",
        "other",
      ],
      lead_status: ["new", "contacted", "qualified", "converted", "lost"],
      lead_type: [
        "car_inquiry",
        "service_inquiry",
        "trade_in",
        "financing",
        "general",
      ],
      testimonial_status: ["pending", "approved", "rejected"],
      transmission_type: ["automatic", "manual", "cvt", "dual_clutch"],
      user_role: ["super_admin", "admin", "employee"],
      user_status: ["invited", "active", "suspended"],
    },
  },
} as const;

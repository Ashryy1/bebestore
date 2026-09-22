export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          readable_id: string | null;
          password_hash: string;
          role: 'user' | 'admin';
          phone: string | null;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          readable_id?: string | null;
          password_hash: string;
          role?: 'user' | 'admin';
          phone?: string | null;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          readable_id?: string | null;
          password_hash?: string;
          role?: 'user' | 'admin';
          phone?: string | null;
          image_url?: string | null;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image_url: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image_url?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          image_url?: string | null;
          description?: string | null;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: number;
          images: string[];
          category: string | null;
          colors: string[];
          stock: number;
          size_chart_type: 'table' | 'image' | null;
          size_chart_image_url: string | null;
          size_chart_sizes: Json;
          featured: boolean;
          rating: number;
          num_reviews: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          price: number;
          images?: string[];
          category?: string | null;
          colors?: string[];
          stock?: number;
          size_chart_type?: 'table' | 'image' | null;
          size_chart_image_url?: string | null;
          size_chart_sizes?: Json;
          featured?: boolean;
          rating?: number;
          num_reviews?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          price?: number;
          images?: string[];
          category?: string | null;
          colors?: string[];
          stock?: number;
          size_chart_type?: 'table' | 'image' | null;
          size_chart_image_url?: string | null;
          size_chart_sizes?: Json;
          featured?: boolean;
          rating?: number;
          num_reviews?: number;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          order_number: string;
          user_name: string;
          user_phone: string;
          items: Json;
          total_amount: number;
          status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
          shipping_address: string | null;
          shipping_city: string | null;
          payment_method: 'cod' | 'vodafone_cash' | 'instapay';
          payment_receipt_url: string | null;
          deposit_amount: number;
          deposit_status: 'None' | 'Requested' | 'Pending' | 'Paid' | 'Rejected';
          deposit_screenshot_url: string | null;
          has_unread_update: boolean;
          is_whatsapp_order: boolean;
          is_chat_open: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          order_number: string;
          user_name?: string;
          user_phone: string;
          items: Json;
          total_amount?: number;
          status?: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
          shipping_address?: string | null;
          shipping_city?: string | null;
          payment_method?: 'cod' | 'vodafone_cash' | 'instapay';
          payment_receipt_url?: string | null;
          deposit_amount?: number;
          deposit_status?: 'None' | 'Requested' | 'Pending' | 'Paid' | 'Rejected';
          deposit_screenshot_url?: string | null;
          has_unread_update?: boolean;
          is_whatsapp_order?: boolean;
          is_chat_open?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          order_number?: string;
          user_name?: string;
          user_phone?: string;
          items?: Json;
          total_amount?: number;
          status?: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
          shipping_address?: string | null;
          shipping_city?: string | null;
          payment_method?: 'cod' | 'vodafone_cash' | 'instapay';
          payment_receipt_url?: string | null;
          deposit_amount?: number;
          deposit_status?: 'None' | 'Requested' | 'Pending' | 'Paid' | 'Rejected';
          deposit_screenshot_url?: string | null;
          has_unread_update?: boolean;
          is_whatsapp_order?: boolean;
          is_chat_open?: boolean;
          updated_at?: string;
        };
      };
      custom_requests: {
        Row: {
          id: string;
          user_id: string | null;
          user_name: string;
          user_email: string | null;
          user_phone: string | null;
          order_number: string | null;
          description: string;
          reference_images: string[];
          status: 'Pending' | 'Reviewing' | 'Pricing' | 'Processing' | 'Shipped' | 'Completed' | 'Returned';
          admin_quote: number | null;
          admin_notes: string;
          timeline: Json;
          shipping_address: string | null;
          shipping_city: string | null;
          shipping_phone: string | null;
          payment_method: string | null;
          payment_receipt_url: string | null;
          deposit_amount: number;
          deposit_status: 'None' | 'Requested' | 'Pending' | 'Paid' | 'Rejected';
          deposit_screenshot_url: string | null;
          has_unread_update: boolean;
          is_chat_open: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          user_name?: string;
          user_email?: string | null;
          user_phone?: string | null;
          order_number?: string | null;
          description: string;
          reference_images?: string[];
          status?: 'Pending' | 'Reviewing' | 'Pricing' | 'Processing' | 'Shipped' | 'Completed' | 'Returned';
          admin_quote?: number | null;
          admin_notes?: string;
          timeline?: Json;
          shipping_address?: string | null;
          shipping_city?: string | null;
          shipping_phone?: string | null;
          payment_method?: string | null;
          payment_receipt_url?: string | null;
          deposit_amount?: number;
          deposit_status?: 'None' | 'Requested' | 'Pending' | 'Paid' | 'Rejected';
          deposit_screenshot_url?: string | null;
          has_unread_update?: boolean;
          is_chat_open?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'Pending' | 'Reviewing' | 'Pricing' | 'Processing' | 'Shipped' | 'Completed' | 'Returned';
          admin_quote?: number | null;
          admin_notes?: string;
          timeline?: Json;
          shipping_address?: string | null;
          shipping_city?: string | null;
          shipping_phone?: string | null;
          payment_method?: string | null;
          payment_receipt_url?: string | null;
          deposit_amount?: number;
          deposit_status?: 'None' | 'Requested' | 'Pending' | 'Paid' | 'Rejected';
          deposit_screenshot_url?: string | null;
          has_unread_update?: boolean;
          is_chat_open?: boolean;
          updated_at?: string;
        };
      };
      order_messages: {
        Row: {
          id: string;
          order_id: string;
          sender: 'user' | 'admin';
          content: string | null;
          image_url: string | null;
          is_read: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          sender: 'user' | 'admin';
          content?: string | null;
          image_url?: string | null;
          is_read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          content?: string | null;
          image_url?: string | null;
          is_read?: boolean;
          updated_at?: string;
        };
      };
      support_messages: {
        Row: {
          id: string;
          user_id: string;
          sender: 'user' | 'admin';
          content: string | null;
          image_url: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sender: 'user' | 'admin';
          content?: string | null;
          image_url?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          content?: string | null;
          image_url?: string | null;
          is_read?: boolean;
        };
      };
      store_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          value?: Json;
          updated_at?: string;
        };
      };
    };
  };
}

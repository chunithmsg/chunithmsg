export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      competitions: {
        Row: {
          active: boolean
          created_at: Date
          deleted_at: Date | null
          id: string
          name: string
          updated_at: Date
        }
        Insert: {
          active?: boolean
          created_at?: Date
          deleted_at?: Date | null
          id?: string
          name: string
          updated_at?: Date
        }
        Update: {
          active?: boolean
          created_at?: Date
          deleted_at?: Date | null
          id?: string
          name?: string
          updated_at?: Date
        }
        Relationships: []
      }
      scores: {
        Row: {
          active: boolean
          competition_id: string
          created_at: Date
          deleted_at: Date | null
          disqualified: boolean
          id: string
          ign: string
          played_at: Date
          song1: number
          song1_type: Database["public"]["Enums"]["score_type"]
          song2: number
          song2_type: Database["public"]["Enums"]["score_type"]
          song3: number
          song3_type: Database["public"]["Enums"]["score_type"]
          total_score: number
          updated_at: Date
        }
        Insert: {
          active?: boolean
          competition_id: string
          created_at?: Date
          deleted_at?: Date | null
          disqualified?: boolean
          id?: string
          ign: string
          played_at: Date
          song1: number
          song1_type?: Database["public"]["Enums"]["score_type"]
          song2: number
          song2_type?: Database["public"]["Enums"]["score_type"]
          song3: number
          song3_type?: Database["public"]["Enums"]["score_type"]
          total_score: number
          updated_at?: Date
        }
        Update: {
          active?: boolean
          competition_id?: string
          created_at?: Date
          deleted_at?: Date | null
          disqualified?: boolean
          id?: string
          ign?: string
          played_at?: Date
          song1?: number
          song1_type?: Database["public"]["Enums"]["score_type"]
          song2?: number
          song2_type?: Database["public"]["Enums"]["score_type"]
          song3?: number
          song3_type?: Database["public"]["Enums"]["score_type"]
          total_score?: number
          updated_at?: Date
        }
        Relationships: [
          {
            foreignKeyName: "scores_competition_id_fkey"
            columns: ["competition_id"]
            isOneToOne: false
            referencedRelation: "competitions"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_competition: {
        Args: {
          competition_id: string
        }
        Returns: {
          active: boolean
          created_at: Date
          deleted_at: Date | null
          id: string
          name: string
          updated_at: Date
        }[]
      }
      get_competitions: {
        Args: {
          competition_limit?: number
          competition_offset?: number
        }
        Returns: {
          active: boolean
          created_at: Date
          deleted_at: Date | null
          id: string
          name: string
          updated_at: Date
        }[]
      }
      get_leaderboard: {
        Args: {
          scores_competition_id: string
          scores_limit?: number
          scores_offset?: number
        }
        Returns: {
          active: boolean
          competition_id: string
          created_at: Date
          deleted_at: Date | null
          disqualified: boolean
          id: string
          ign: string
          played_at: Date
          song1: number
          song1_type: Database["public"]["Enums"]["score_type"]
          song2: number
          song2_type: Database["public"]["Enums"]["score_type"]
          song3: number
          song3_type: Database["public"]["Enums"]["score_type"]
          total_score: number
          updated_at: Date
        }[]
      }
      get_score: {
        Args: {
          score_competition_id: string
          score_id: string
        }
        Returns: {
          active: boolean
          competition_id: string
          created_at: Date
          deleted_at: Date | null
          disqualified: boolean
          id: string
          ign: string
          played_at: Date
          song1: number
          song1_type: Database["public"]["Enums"]["score_type"]
          song2: number
          song2_type: Database["public"]["Enums"]["score_type"]
          song3: number
          song3_type: Database["public"]["Enums"]["score_type"]
          total_score: number
          updated_at: Date
        }[]
      }
      get_scores: {
        Args: {
          scores_competition_id: string
          scores_limit?: number
          scores_offset?: number
        }
        Returns: {
          active: boolean
          competition_id: string
          created_at: Date
          deleted_at: Date | null
          disqualified: boolean
          id: string
          ign: string
          played_at: Date
          song1: number
          song1_type: Database["public"]["Enums"]["score_type"]
          song2: number
          song2_type: Database["public"]["Enums"]["score_type"]
          song3: number
          song3_type: Database["public"]["Enums"]["score_type"]
          total_score: number
          updated_at: Date
        }[]
      }
    }
    Enums: {
      score_type: "AJC" | "AJ" | "FC" | "NONE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

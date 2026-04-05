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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      academic_programs: {
        Row: {
          acronym: string | null
          id: number
          program_name: string
          sector_name: string
        }
        Insert: {
          acronym?: string | null
          id?: number
          program_name: string
          sector_name: string
        }
        Update: {
          acronym?: string | null
          id?: number
          program_name?: string
          sector_name?: string
        }
        Relationships: []
      }
      academic_resources: {
        Row: {
          created_at: string | null
          file_url: string | null
          id: string
          target_formation: string | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          target_formation?: string | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          file_url?: string | null
          id?: string
          target_formation?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      academic_targets: {
        Row: {
          academic_year: string | null
          id: number
          target_enrollment: number | null
          target_revenue: number | null
        }
        Insert: {
          academic_year?: string | null
          id?: number
          target_enrollment?: number | null
          target_revenue?: number | null
        }
        Update: {
          academic_year?: string | null
          id?: number
          target_enrollment?: number | null
          target_revenue?: number | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: number
          target_student_id: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: number
          target_student_id?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: number
          target_student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_target_student_id_fkey"
            columns: ["target_student_id"]
            isOneToOne: false
            referencedRelation: "student_debt_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_target_student_id_fkey"
            columns: ["target_student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_target_student_id_fkey"
            columns: ["target_student_id"]
            isOneToOne: false
            referencedRelation: "students_ready_for_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_target_student_id_fkey"
            columns: ["target_student_id"]
            isOneToOne: false
            referencedRelation: "v_finance_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_target_student_id_fkey"
            columns: ["target_student_id"]
            isOneToOne: false
            referencedRelation: "view_honor_roll"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_target_student_id_fkey"
            columns: ["target_student_id"]
            isOneToOne: false
            referencedRelation: "view_student_financial_status"
            referencedColumns: ["student_id"]
          },
        ]
      }
      diplomas: {
        Row: {
          academic_year: string | null
          created_at: string | null
          date_of_issue: string | null
          diploma_serial_no: string | null
          id: string
          is_signed: boolean | null
          mention: string | null
          specialization_option: string | null
          student_id: string | null
        }
        Insert: {
          academic_year?: string | null
          created_at?: string | null
          date_of_issue?: string | null
          diploma_serial_no?: string | null
          id?: string
          is_signed?: boolean | null
          mention?: string | null
          specialization_option?: string | null
          student_id?: string | null
        }
        Update: {
          academic_year?: string | null
          created_at?: string | null
          date_of_issue?: string | null
          diploma_serial_no?: string | null
          id?: string
          is_signed?: boolean | null
          mention?: string | null
          specialization_option?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diplomas_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_debt_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diplomas_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diplomas_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_ready_for_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diplomas_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_finance_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diplomas_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_honor_roll"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diplomas_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_student_financial_status"
            referencedColumns: ["student_id"]
          },
        ]
      }
      grades: {
        Row: {
          academic_year: string | null
          grade_value: number | null
          id: string
          semester: string | null
          student_id: string | null
          subject_name: string
        }
        Insert: {
          academic_year?: string | null
          grade_value?: number | null
          id?: string
          semester?: string | null
          student_id?: string | null
          subject_name: string
        }
        Update: {
          academic_year?: string | null
          grade_value?: number | null
          id?: string
          semester?: string | null
          student_id?: string | null
          subject_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_debt_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_ready_for_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_finance_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_honor_roll"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_student_financial_status"
            referencedColumns: ["student_id"]
          },
        ]
      }
      issued_documents: {
        Row: {
          content_json: Json | null
          document_type: string | null
          id: string
          issue_date: string | null
          student_id: string | null
        }
        Insert: {
          content_json?: Json | null
          document_type?: string | null
          id?: string
          issue_date?: string | null
          student_id?: string | null
        }
        Update: {
          content_json?: Json | null
          document_type?: string | null
          id?: string
          issue_date?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issued_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_debt_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issued_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issued_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_ready_for_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issued_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_finance_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issued_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_honor_roll"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issued_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_student_financial_status"
            referencedColumns: ["student_id"]
          },
        ]
      }
      monthly_fees: {
        Row: {
          amount: number | null
          id: string
          is_paid: boolean | null
          month_name: string
          payment_date: string | null
          student_id: string | null
        }
        Insert: {
          amount?: number | null
          id?: string
          is_paid?: boolean | null
          month_name: string
          payment_date?: string | null
          student_id?: string | null
        }
        Update: {
          amount?: number | null
          id?: string
          is_paid?: boolean | null
          month_name?: string
          payment_date?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_debt_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_ready_for_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_finance_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_honor_roll"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_student_financial_status"
            referencedColumns: ["student_id"]
          },
        ]
      }
      notification_queue: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          recipient_phone: string | null
          status: string | null
          student_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          recipient_phone?: string | null
          status?: string | null
          student_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          recipient_phone?: string | null
          status?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_debt_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_ready_for_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_finance_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_honor_roll"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_student_financial_status"
            referencedColumns: ["student_id"]
          },
        ]
      }
      payment_receipts: {
        Row: {
          generated_at: string | null
          id: string
          payment_id: string | null
          pdf_url: string | null
          receipt_number: string | null
        }
        Insert: {
          generated_at?: string | null
          id?: string
          payment_id?: string | null
          pdf_url?: string | null
          receipt_number?: string | null
        }
        Update: {
          generated_at?: string | null
          id?: string
          payment_id?: string | null
          pdf_url?: string | null
          receipt_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_receipts_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          created_at: string | null
          extra_activity_fee: number | null
          extra_curricular_fee: number | null
          first_month_fee: number | null
          id: string
          is_reconciled: boolean | null
          monthly_fee: number | null
          monthly_fee_paid: number | null
          payment_date: string | null
          payment_method: string | null
          polo_fee: number | null
          processed_by: string | null
          registration_fee: number | null
          registration_number: string | null
          student_card_fee: number | null
          student_id: string | null
          total_paid: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          extra_activity_fee?: number | null
          extra_curricular_fee?: number | null
          first_month_fee?: number | null
          id?: string
          is_reconciled?: boolean | null
          monthly_fee?: number | null
          monthly_fee_paid?: number | null
          payment_date?: string | null
          payment_method?: string | null
          polo_fee?: number | null
          processed_by?: string | null
          registration_fee?: number | null
          registration_number?: string | null
          student_card_fee?: number | null
          student_id?: string | null
          total_paid?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          extra_activity_fee?: number | null
          extra_curricular_fee?: number | null
          first_month_fee?: number | null
          id?: string
          is_reconciled?: boolean | null
          monthly_fee?: number | null
          monthly_fee_paid?: number | null
          payment_date?: string | null
          payment_method?: string | null
          polo_fee?: number | null
          processed_by?: string | null
          registration_fee?: number | null
          registration_number?: string | null
          student_card_fee?: number | null
          student_id?: string | null
          total_paid?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_debt_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_ready_for_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_finance_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_honor_roll"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_student_financial_status"
            referencedColumns: ["student_id"]
          },
        ]
      }
      profiles: {
        Row: {
          admin_id: string | null
          admin_matricule: string | null
          avatar_url: string | null
          department: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          job_title: string | null
          language: string | null
          password_changed: boolean | null
          role: Database["public"]["Enums"]["user_role"] | null
          theme: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          admin_id?: string | null
          admin_matricule?: string | null
          avatar_url?: string | null
          department?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          job_title?: string | null
          language?: string | null
          password_changed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          theme?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          admin_id?: string | null
          admin_matricule?: string | null
          avatar_url?: string | null
          department?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          language?: string | null
          password_changed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"] | null
          theme?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      school_info: {
        Row: {
          address: string | null
          city: string | null
          phones: string | null
          site_name: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          phones?: string | null
          site_name?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          phones?: string | null
          site_name?: string | null
        }
        Relationships: []
      }
      sector_pricing: {
        Row: {
          id: number
          level: string
          monthly_fee: number
          sector_name: string
        }
        Insert: {
          id?: number
          level: string
          monthly_fee: number
          sector_name: string
        }
        Update: {
          id?: number
          level?: string
          monthly_fee?: number
          sector_name?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          email: string | null
          full_name: string
          id: string
          phone: string | null
          role: string
          status: string | null
        }
        Insert: {
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          role: string
          status?: string | null
        }
        Update: {
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          role?: string
          status?: string | null
        }
        Relationships: []
      }
      student_attendance: {
        Row: {
          date_absence: string | null
          id: number
          is_justified: boolean | null
          reason: string | null
          student_id: string | null
        }
        Insert: {
          date_absence?: string | null
          id?: number
          is_justified?: boolean | null
          reason?: string | null
          student_id?: string | null
        }
        Update: {
          date_absence?: string | null
          id?: number
          is_justified?: boolean | null
          reason?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_debt_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_ready_for_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_finance_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_honor_roll"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_student_financial_status"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_grades: {
        Row: {
          assignment_score: number | null
          exam_score: number | null
          id: string
          recorded_at: string | null
          student_id: string | null
          subject_id: number | null
        }
        Insert: {
          assignment_score?: number | null
          exam_score?: number | null
          id?: string
          recorded_at?: string | null
          student_id?: string | null
          subject_id?: number | null
        }
        Update: {
          assignment_score?: number | null
          exam_score?: number | null
          id?: string
          recorded_at?: string | null
          student_id?: string | null
          subject_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_debt_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_ready_for_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_finance_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_honor_roll"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_grades_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_student_financial_status"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_grades_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_payments: {
        Row: {
          amount_paid: number
          balance_remaining: number | null
          campus: Database["public"]["Enums"]["city_location"] | null
          collected_by: string | null
          id: string
          payment_date: string | null
          payment_type: string | null
          receipt_number: number
          student_id: string | null
          total_amount_due: number
        }
        Insert: {
          amount_paid: number
          balance_remaining?: number | null
          campus?: Database["public"]["Enums"]["city_location"] | null
          collected_by?: string | null
          id?: string
          payment_date?: string | null
          payment_type?: string | null
          receipt_number?: number
          student_id?: string | null
          total_amount_due: number
        }
        Update: {
          amount_paid?: number
          balance_remaining?: number | null
          campus?: Database["public"]["Enums"]["city_location"] | null
          collected_by?: string | null
          id?: string
          payment_date?: string | null
          payment_type?: string | null
          receipt_number?: number
          student_id?: string | null
          total_amount_due?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_payments_collected_by_fkey"
            columns: ["collected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_debt_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_ready_for_payment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "v_finance_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_honor_roll"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "view_student_financial_status"
            referencedColumns: ["student_id"]
          },
        ]
      }
      students: {
        Row: {
          address: string | null
          adresse_precision: string | null
          arrondissement: string | null
          birth_date: string | null
          birth_place: string | null
          campus: Database["public"]["Enums"]["city_location"] | null
          chosen_formation: string | null
          city: Database["public"]["Enums"]["congolese_city"] | null
          created_at: string | null
          current_level: string | null
          date_of_birth: string | null
          district_number: string | null
          document_url: string | null
          email: string | null
          first_name: string
          gender: string | null
          guardian_name: string | null
          guardian_phone_1: string | null
          guardian_phone_2: string | null
          guardian_profession: string | null
          has_birth_certificate: boolean | null
          has_certified_degree: boolean | null
          has_id_photos: boolean | null
          id: string
          last_degree_obtained: string | null
          last_name: string
          level: string | null
          nationality: string | null
          neighborhood: string | null
          phone_1: string
          phone_2: string | null
          place_of_birth: string | null
          program_id: number | null
          quartier: string | null
          registration_date: string | null
          registration_number: string | null
          registration_status: string | null
          rejection_reason: string | null
          sector_type: string | null
          status: string | null
          submission_date: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          adresse_precision?: string | null
          arrondissement?: string | null
          birth_date?: string | null
          birth_place?: string | null
          campus?: Database["public"]["Enums"]["city_location"] | null
          chosen_formation?: string | null
          city?: Database["public"]["Enums"]["congolese_city"] | null
          created_at?: string | null
          current_level?: string | null
          date_of_birth?: string | null
          district_number?: string | null
          document_url?: string | null
          email?: string | null
          first_name: string
          gender?: string | null
          guardian_name?: string | null
          guardian_phone_1?: string | null
          guardian_phone_2?: string | null
          guardian_profession?: string | null
          has_birth_certificate?: boolean | null
          has_certified_degree?: boolean | null
          has_id_photos?: boolean | null
          id?: string
          last_degree_obtained?: string | null
          last_name: string
          level?: string | null
          nationality?: string | null
          neighborhood?: string | null
          phone_1: string
          phone_2?: string | null
          place_of_birth?: string | null
          program_id?: number | null
          quartier?: string | null
          registration_date?: string | null
          registration_number?: string | null
          registration_status?: string | null
          rejection_reason?: string | null
          sector_type?: string | null
          status?: string | null
          submission_date?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          adresse_precision?: string | null
          arrondissement?: string | null
          birth_date?: string | null
          birth_place?: string | null
          campus?: Database["public"]["Enums"]["city_location"] | null
          chosen_formation?: string | null
          city?: Database["public"]["Enums"]["congolese_city"] | null
          created_at?: string | null
          current_level?: string | null
          date_of_birth?: string | null
          district_number?: string | null
          document_url?: string | null
          email?: string | null
          first_name?: string
          gender?: string | null
          guardian_name?: string | null
          guardian_phone_1?: string | null
          guardian_phone_2?: string | null
          guardian_profession?: string | null
          has_birth_certificate?: boolean | null
          has_certified_degree?: boolean | null
          has_id_photos?: boolean | null
          id?: string
          last_degree_obtained?: string | null
          last_name?: string
          level?: string | null
          nationality?: string | null
          neighborhood?: string | null
          phone_1?: string
          phone_2?: string | null
          place_of_birth?: string | null
          program_id?: number | null
          quartier?: string | null
          registration_date?: string | null
          registration_number?: string | null
          registration_status?: string | null
          rejection_reason?: string | null
          sector_type?: string | null
          status?: string | null
          submission_date?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_program"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "academic_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          coefficient: number | null
          id: number
          program_id: number | null
          semester: number | null
          subject_name: string
        }
        Insert: {
          coefficient?: number | null
          id?: number
          program_id?: number | null
          semester?: number | null
          subject_name: string
        }
        Update: {
          coefficient?: number | null
          id?: number
          program_id?: number | null
          semester?: number | null
          subject_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "academic_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      temp_payment_import: {
        Row: {
          date_paiement: string | null
          frais_carte: number | null
          matricule_etudiant: string | null
          methode_paiement: string | null
          montant_inscription: number | null
          montant_mensualites_total: number | null
        }
        Insert: {
          date_paiement?: string | null
          frais_carte?: number | null
          matricule_etudiant?: string | null
          methode_paiement?: string | null
          montant_inscription?: number | null
          montant_mensualites_total?: number | null
        }
        Update: {
          date_paiement?: string | null
          frais_carte?: number | null
          matricule_etudiant?: string | null
          methode_paiement?: string | null
          montant_inscription?: number | null
          montant_mensualites_total?: number | null
        }
        Relationships: []
      }
      temp_student_import: {
        Row: {
          email: string | null
          filiere: string | null
          matricule: string | null
          niveau: string | null
          nom: string | null
          prenom: string | null
          secteur: string | null
          telephone: string | null
        }
        Insert: {
          email?: string | null
          filiere?: string | null
          matricule?: string | null
          niveau?: string | null
          nom?: string | null
          prenom?: string | null
          secteur?: string | null
          telephone?: string | null
        }
        Update: {
          email?: string | null
          filiere?: string | null
          matricule?: string | null
          niveau?: string | null
          nom?: string | null
          prenom?: string | null
          secteur?: string | null
          telephone?: string | null
        }
        Relationships: []
      }
      tuition_fees: {
        Row: {
          annual_total: number | null
          id: number
          level: string | null
          sector_name: string | null
        }
        Insert: {
          annual_total?: number | null
          id?: number
          level?: string | null
          sector_name?: string | null
        }
        Update: {
          annual_total?: number | null
          id?: number
          level?: string | null
          sector_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      dashboard_stats: {
        Row: {
          dossiers_incomplets: number | null
          total_etudiants: number | null
          total_percu: number | null
          total_personnel: number | null
        }
        Relationships: []
      }
      dashboard_stats_finance: {
        Row: {
          chiffre_affaire_total: number | null
          total_cartes: number | null
          total_inscriptions: number | null
          total_scolarite: number | null
        }
        Relationships: []
      }
      dashboard_stats_students: {
        Row: {
          nb_admis: number | null
          nb_candidats: number | null
          sector_type: string | null
          total_dossiers: number | null
        }
        Relationships: []
      }
      financial_summary: {
        Row: {
          chiffre_affaires_total: number | null
          total_cartes: number | null
          total_inscriptions: number | null
          total_scolarite: number | null
        }
        Relationships: []
      }
      monthly_revenue_stats: {
        Row: {
          mois: string | null
          total_collecte: number | null
        }
        Relationships: []
      }
      receipt_print_data: {
        Row: {
          date_paiement: string | null
          extra_activity_fee: number | null
          montant_verse: number | null
          monthly_fee: number | null
          polo_fee: number | null
          program_display: string | null
          receipt_number: string | null
          registration_fee: number | null
          registration_number: string | null
          reliquat: number | null
          student_card_fee: number | null
          student_full_name: string | null
          total_a_payer: number | null
        }
        Relationships: []
      }
      student_debt_status: {
        Row: {
          balance: number | null
          first_name: string | null
          id: string | null
          last_name: string | null
          registration_number: string | null
          total_due: number | null
          total_paid: number | null
        }
        Relationships: []
      }
      students_ready_for_payment: {
        Row: {
          current_level: string | null
          expected_registration_fee: number | null
          first_name: string | null
          id: string | null
          last_name: string | null
          registration_number: string | null
          sector_type: string | null
        }
        Insert: {
          current_level?: string | null
          expected_registration_fee?: never
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          registration_number?: string | null
          sector_type?: string | null
        }
        Update: {
          current_level?: string | null
          expected_registration_fee?: never
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          registration_number?: string | null
          sector_type?: string | null
        }
        Relationships: []
      }
      v_finance_overview: {
        Row: {
          carte_etudiant: number | null
          date_inscription: string | null
          frais_inscription: number | null
          id: string | null
          matricule: string | null
          mensualite: number | null
          mode: string | null
          nom_complet: string | null
          parascolaire: number | null
          polo: number | null
          total: number | null
        }
        Relationships: []
      }
      view_daily_welcome_queue: {
        Row: {
          chosen_formation: string | null
          first_name: string | null
          last_name: string | null
          registration_number: string | null
          subject: string | null
        }
        Insert: {
          chosen_formation?: string | null
          first_name?: string | null
          last_name?: string | null
          registration_number?: string | null
          subject?: never
        }
        Update: {
          chosen_formation?: string | null
          first_name?: string | null
          last_name?: string | null
          registration_number?: string | null
          subject?: never
        }
        Relationships: []
      }
      view_diploma_final_print: {
        Row: {
          birth_date_formatted: string | null
          birth_place: string | null
          date_of_issue: string | null
          dg_name: string | null
          diploma_serial_no: string | null
          domaine: string | null
          filiere: string | null
          full_name: string | null
          matricule: string | null
          mention: string | null
          nationality: string | null
          note_service_agrement: string | null
          option: string | null
        }
        Relationships: []
      }
      view_enrollment_certificate: {
        Row: {
          annee_academique: string | null
          date_emission: string | null
          date_naissance: string | null
          filiere_officielle: string | null
          lieu_naissance: string | null
          matricule: string | null
          niveau_etude: string | null
          nom: string | null
          pole_academique: string | null
          prenom: string | null
        }
        Relationships: []
      }
      view_honor_roll: {
        Row: {
          campus: Database["public"]["Enums"]["city_location"] | null
          etudiant: string | null
          filiere: string | null
          id: string | null
          matricule: string | null
          moyenne_generale: number | null
          rang: number | null
        }
        Relationships: []
      }
      view_receipt_details: {
        Row: {
          avance: number | null
          bpf: number | null
          client_name: string | null
          date_reglement: string | null
          formation: string | null
          receipt_no: string | null
          reste_a_payer: number | null
          signature_dg: string | null
          site_origine: Database["public"]["Enums"]["city_location"] | null
          somme_de: number | null
        }
        Relationships: []
      }
      view_stats_enrollment: {
        Row: {
          campus: Database["public"]["Enums"]["city_location"] | null
          effectif: number | null
          gender: string | null
          pourcentage_par_campus: number | null
        }
        Relationships: []
      }
      view_student_badge: {
        Row: {
          campus: Database["public"]["Enums"]["city_location"] | null
          code_filiere: string | null
          matricule: string | null
          niveau: string | null
          nom: string | null
          photo_id: string | null
          prenom: string | null
          validite: string | null
        }
        Relationships: []
      }
      view_student_badge_qr: {
        Row: {
          code_filiere: string | null
          matricule: string | null
          nom: string | null
          statut_paiement: string | null
          verification_url: string | null
        }
        Relationships: []
      }
      view_student_financial_status: {
        Row: {
          etudiant: string | null
          filiere: string | null
          matricule: string | null
          niveau: string | null
          reste_a_payer: number | null
          student_id: string | null
          total_a_payer: number | null
          total_verse: number | null
        }
        Relationships: []
      }
      view_student_report_cards: {
        Row: {
          coefficient: number | null
          decision: string | null
          etudiant: string | null
          matiere: string | null
          matricule: string | null
          moyenne_matiere: number | null
          note_cc: number | null
          note_examen: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      close_daily_cash: { Args: never; Returns: undefined }
      get_student_monthly_fee: {
        Args: { p_level: string; p_sector: string }
        Returns: number
      }
      next_val_from_seq: { Args: { seq_name: string }; Returns: number }
      process_payment_history_import: { Args: never; Returns: undefined }
      process_student_import: { Args: never; Returns: undefined }
    }
    Enums: {
      city_location: "Brazzaville" | "Pointe-Noire"
      congolese_city: "Brazzaville" | "Pointe-Noire"
      user_role:
        | "super_admin"
        | "directrice_academique"
        | "comptable"
        | "informatique"
        | "secretaire"
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
      city_location: ["Brazzaville", "Pointe-Noire"],
      congolese_city: ["Brazzaville", "Pointe-Noire"],
      user_role: [
        "super_admin",
        "directrice_academique",
        "comptable",
        "informatique",
        "secretaire",
      ],
    },
  },
} as const

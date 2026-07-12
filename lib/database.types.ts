// Hand-maintained types mirroring supabase/schema.sql.
// (Supabase type-gen was unavailable at setup time; keep this in sync with the schema.)

export type EntityStatus = 'active' | 'inactive'
export type BookingStatus = 'Booked' | 'Pending' | 'Rejected'
export type UserRole =
  | 'Clinic Owner'
  | 'Moderator'
  | 'Receptionist'
  | 'Accountant'
  | 'Media Buyer'
  | 'Content Creator'
export type ReservationStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled'
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Clinic {
  id: string
  name: string
  address: string | null
  city: string | null
  country: string | null
  phone: string | null
  email: string | null
  website: string | null
  owner: string | null
  status: EntityStatus
  description: string | null
  created_at: string
  updated_at: string
}

export interface Branch {
  id: string
  clinic_id: string | null
  name: string
  address: string | null
  city: string | null
  country: string | null
  phone: string | null
  email: string | null
  working_hours: string | null
  manager: string | null
  status: EntityStatus
  description: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  name: string
  email: string | null
  phone: string | null
  role: UserRole
  status: EntityStatus
  branches: string[]
  permissions: Record<string, unknown>
  clinic_id: string | null
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  date: string | null
  name: string
  phone_number: string | null
  source: string | null
  interest: string | null
  country: string | null
  city: string | null
  area: string | null
  nearest_branch: string | null
  ad_id: string | null
  communication_through: string | null
  moderator_notes: string | null
  receptionist_name: string | null
  attempt1: string | null
  attempt2: string | null
  attempt3: string | null
  booking_status: BookingStatus
  show_no_show: string | null
  reservation_date: string | null
  rejection_feedback1: string | null
  rejection_feedback2: string | null
  quotation_amount: number | null
  amount_paid: number | null
  created_at: string
  updated_at: string
}

export interface Campaign {
  id: string
  campaign_name: string
  platform: string | null
  result_type: string | null
  status: EntityStatus
  created_at: string
  updated_at: string
}

export interface CampaignAdId {
  id: string
  campaign_id: string
  ad_id: string | null
  link: string | null
  daily_spend: number | null
  position: number
}

export interface CampaignDailyData {
  id: string
  campaign_id: string
  day: string | null
  date: string | null
  ad_id_spend: string | null
  results: number
  cpr: number
  spend: number
  impressions: number
  clicks: number
  ctr: number
  position: number
}

export interface Reservation {
  id: string
  patient: string
  patient_id: string | null
  doctor: string | null
  clinic: string | null
  date: string | null
  time: string | null
  status: ReservationStatus
  type: string | null
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  is_read: boolean
  type: NotificationType
  created_at: string
  updated_at: string
}

type Row<T> = T
type Insert<T> = Partial<T>
type Update<T> = Partial<T>

export interface Database {
  public: {
    Tables: {
      clinics: { Row: Row<Clinic>; Insert: Insert<Clinic>; Update: Update<Clinic> }
      branches: { Row: Row<Branch>; Insert: Insert<Branch>; Update: Update<Branch> }
      profiles: { Row: Row<Profile>; Insert: Insert<Profile>; Update: Update<Profile> }
      patients: { Row: Row<Patient>; Insert: Insert<Patient>; Update: Update<Patient> }
      campaigns: { Row: Row<Campaign>; Insert: Insert<Campaign>; Update: Update<Campaign> }
      campaign_ad_ids: { Row: Row<CampaignAdId>; Insert: Insert<CampaignAdId>; Update: Update<CampaignAdId> }
      campaign_daily_data: { Row: Row<CampaignDailyData>; Insert: Insert<CampaignDailyData>; Update: Update<CampaignDailyData> }
      reservations: { Row: Row<Reservation>; Insert: Insert<Reservation>; Update: Update<Reservation> }
      notifications: { Row: Row<Notification>; Insert: Insert<Notification>; Update: Update<Notification> }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      entity_status: EntityStatus
      booking_status: BookingStatus
      user_role: UserRole
      reservation_status: ReservationStatus
    }
  }
}

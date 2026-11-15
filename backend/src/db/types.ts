export type UserRole = 
  | 'admin'
  | 'property_manager'
  | 'landlord'
  | 'finance'
  | 'maintenance'
  | 'field_agent'
  | 'tenant';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  subscription_plan: 'starter' | 'professional' | 'business' | 'locari_internal';
  subscription_status: 'active' | 'trial' | 'past_due' | 'canceled';
  max_units: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  org_id: string;
  full_name: string;
  email?: string;
  phone: string;
  role: UserRole;
  is_diaspora: boolean;
  country: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MagicToken {
  id: string;
  token: string;
  user_id: string;
  org_id: string;
  expires_at: string;
  used_at?: string;
  created_at: string;
}

export interface LandlordProfile {
  id: string;
  user_id: string;
  org_id: string;
  is_diaspora: boolean;
  residence_country: string;
  residence_city?: string;
  preferred_currency: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  management_fee_percentage: number;
  whatsapp_reporting_frequency: 'monthly' | 'quarterly' | 'real_time';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type PropertyType = 
  | 'multi_family_residential'
  | 'single_family_home'
  | 'commercial_plaza'
  | 'mixed_use'
  | 'student_hostel';

export interface Property {
  id: string;
  org_id: string;
  landlord_id?: string;
  manager_id?: string;
  name: string;
  property_type: PropertyType;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  total_units: number;
  featured_image_url?: string;
  is_managed: boolean;
  created_at: string;
  updated_at: string;
}

export type UnitStatus = 'vacant' | 'occupied' | 'reserved' | 'maintenance';

export interface Unit {
  id: string;
  org_id: string;
  property_id: string;
  unit_number: string;
  unit_type: string;
  bedrooms: number;
  bathrooms: number;
  rent_amount: number;
  rent_period: 'year' | 'month';
  service_charge: number;
  caution_deposit: number;
  legal_and_agency: number;
  status: UnitStatus;
  current_tenant_id?: string;
  is_published_to_discovery: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  user_id?: string;
  org_id: string;
  property_id: string;
  unit_id: string;
  full_name: string;
  phone: string;
  email?: string;
  occupation?: string;
  employer?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  move_in_date: string;
  current_lease_end: string;
  status: 'active' | 'overdue' | 'notice_served' | 'moved_out';
  created_at: string;
  updated_at: string;
}

export type RentStatus = 'pending' | 'partial' | 'paid' | 'overdue';

export interface RentSchedule {
  id: string;
  org_id: string;
  property_id: string;
  unit_id: string;
  tenant_id: string;
  landlord_id?: string;
  period_title: string;
  due_date: string;
  expiry_date: string;
  base_rent: number;
  service_charge: number;
  total_amount_due: number;
  amount_paid: number;
  balance_remaining: number;
  status: RentStatus;
  last_reminder_sent_at?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'reported' | 'verified' | 'rejected';

export interface PaymentRecord {
  id: string;
  org_id: string;
  rent_schedule_id?: string;
  tenant_id: string;
  unit_id: string;
  amount: number;
  payment_date: string;
  payment_method: 'bank_transfer' | 'card' | 'cash' | 'pos';
  bank_reference?: string;
  proof_image_url?: string;
  status: PaymentStatus;
  receipt_number?: string;
  verified_by_user_id?: string;
  verified_at?: string;
  rejection_reason?: string;
  notes?: string;
  created_at: string;
}

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'emergency';
export type MaintenanceStatus = 
  | 'open'
  | 'estimate_submitted'
  | 'pending_landlord_approval'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'rejected';

export interface MaintenanceRequest {
  id: string;
  org_id: string;
  property_id: string;
  unit_id?: string;
  reported_by_phone: string;
  reported_by_name: string;
  category: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  estimated_cost?: number;
  actual_cost?: number;
  contractor_name?: string;
  contractor_phone?: string;
  media_urls?: string[];
  landlord_approved_at?: string;
  landlord_rejected_at?: string;
  rejection_reason?: string;
  assigned_staff_id?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskItem {
  id: string;
  org_id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  due_date?: string;
  assigned_to?: string;
  related_property_id?: string;
  related_unit_id?: string;
  created_at: string;
  updated_at: string;
}

export interface LandlordReport {
  id: string;
  org_id: string;
  landlord_id: string;
  month_period: string; // e.g. "2026-11"
  total_rent_collected: number;
  agency_commission: number;
  maintenance_expenses: number;
  net_payout_amount: number;
  vacant_units_count: number;
  total_units_count: number;
  summary_text: string;
  sent_via_whatsapp_at?: string;
  created_at: string;
}

export interface WhatsAppSession {
  id: string;
  phone: string;
  org_id?: string;
  user_id?: string;
  current_state: string;
  session_data: Record<string, any>;
  last_interaction_at: string;
}

export interface AuditLog {
  id: string;
  org_id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, any>;
  created_at: string;
}

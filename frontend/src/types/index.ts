export interface Organization {
  id: string;
  name: string;
  slug: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  subscription_plan: string;
  subscription_status: string;
  max_units: number;
}

export interface User {
  id: string;
  org_id: string;
  full_name: string;
  email?: string;
  phone: string;
  role: 'admin' | 'property_manager' | 'landlord' | 'finance' | 'maintenance' | 'field_agent' | 'tenant';
  is_diaspora: boolean;
  country: string;
  timezone: string;
  is_active: boolean;
}

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
  status: 'vacant' | 'occupied' | 'reserved' | 'maintenance';
  current_tenant_id?: string;
  is_published_to_discovery: boolean;
}

export interface Property {
  id: string;
  org_id: string;
  landlord_id?: string;
  manager_id?: string;
  name: string;
  property_type: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  total_units: number;
  featured_image_url?: string;
  is_managed: boolean;
  units: Unit[];
  stats: {
    total_units: number;
    occupied_units: number;
    vacant_units: number;
    occupancy_rate: number;
    annual_rent_roll: number;
  };
  landlord?: {
    id: string;
    name: string;
    phone: string;
    is_diaspora: boolean;
    country: string;
    profile?: any;
  };
}

export interface Landlord {
  id: string;
  full_name: string;
  email?: string;
  phone: string;
  is_diaspora: boolean;
  country: string;
  timezone: string;
  profile?: {
    residence_country: string;
    residence_city?: string;
    preferred_currency: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    bank_name?: string;
    account_number?: string;
    account_name?: string;
    management_fee_percentage: number;
    notes?: string;
  };
  properties: Array<{ id: string; name: string; city: string }>;
  stats: {
    total_properties: number;
    total_units: number;
    occupied_units: number;
    vacant_units: number;
    total_collected: number;
    total_arrears: number;
    pending_approvals_count: number;
  };
}

export interface Tenant {
  id: string;
  property_id: string;
  unit_id: string;
  full_name: string;
  phone: string;
  email?: string;
  occupation?: string;
  employer?: string;
  move_in_date: string;
  current_lease_end: string;
  status: 'active' | 'overdue' | 'notice_served' | 'moved_out';
  property_name: string;
  unit_number: string;
  rent_amount: number;
  rent_status: string;
  amount_owing: number;
  due_date: string;
}

export interface RentSchedule {
  id: string;
  property_id: string;
  unit_id: string;
  tenant_id: string;
  period_title: string;
  due_date: string;
  expiry_date: string;
  base_rent: number;
  service_charge: number;
  total_amount_due: number;
  amount_paid: number;
  balance_remaining: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  tenant_name: string;
  tenant_phone: string;
  unit_number: string;
  property_name: string;
  landlord_name: string;
}

export interface PaymentRecord {
  id: string;
  rent_schedule_id?: string;
  tenant_id: string;
  unit_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  bank_reference?: string;
  proof_image_url?: string;
  status: 'reported' | 'verified' | 'rejected';
  receipt_number?: string;
  tenant_name: string;
  tenant_phone: string;
  unit_number: string;
  verified_by_name?: string;
  notes?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  unit_id?: string;
  reported_by_name: string;
  reported_by_phone: string;
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'open' | 'estimate_submitted' | 'pending_landlord_approval' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  estimated_cost?: number;
  actual_cost?: number;
  contractor_name?: string;
  contractor_phone?: string;
  media_urls?: string[];
  property_name: string;
  unit_number: string;
  landlord_name: string;
  landlord_phone: string;
  landlord_is_diaspora: boolean;
  assigned_staff_name: string;
  created_at: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  due_date?: string;
  assigned_name: string;
  property_name?: string;
  unit_number?: string;
  created_at: string;
}

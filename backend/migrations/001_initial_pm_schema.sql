-- ==============================================================================
-- LOCARI PROPERTY MANAGEMENT OPERATING SYSTEM
-- Database Migration: 001_initial_pm_schema.sql
-- Single Source of Truth for Web Dashboard & WhatsApp Assistant
-- Target Engine: PostgreSQL / Supabase
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS (Multi-Tenant isolation)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    currency VARCHAR(10) DEFAULT 'NGN',
    subscription_plan VARCHAR(50) DEFAULT 'starter', -- starter, professional, business, locari_internal
    subscription_status VARCHAR(50) DEFAULT 'active', -- active, trial, past_due, canceled
    max_units INT DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS & ROLES
CREATE TYPE user_role AS ENUM (
    'admin',
    'property_manager',
    'landlord',
    'finance',
    'maintenance',
    'field_agent',
    'tenant'
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL, -- Key identifier for WhatsApp
    role user_role NOT NULL DEFAULT 'property_manager',
    is_diaspora BOOLEAN DEFAULT FALSE,
    country VARCHAR(100) DEFAULT 'Nigeria',
    timezone VARCHAR(100) DEFAULT 'Africa/Lagos',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_phone_per_org UNIQUE (org_id, phone)
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_org ON users(org_id);

-- 3. MAGIC TOKENS (One-click secure dashboard access from WhatsApp)
CREATE TABLE IF NOT EXISTS magic_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(128) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LANDLORD PROFILES (Specialized data for Local & Diaspora Property Owners)
CREATE TABLE IF NOT EXISTS landlord_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    is_diaspora BOOLEAN DEFAULT FALSE,
    residence_country VARCHAR(100) DEFAULT 'Nigeria',
    residence_city VARCHAR(100),
    preferred_currency VARCHAR(10) DEFAULT 'NGN',
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    bank_name VARCHAR(100),
    account_number VARCHAR(30),
    account_name VARCHAR(255),
    management_fee_percentage DECIMAL(5,2) DEFAULT 10.00, -- e.g. 10%
    whatsapp_reporting_frequency VARCHAR(20) DEFAULT 'monthly', -- monthly, quarterly, real_time
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROPERTIES (Buildings, Compounds, Plazas)
CREATE TYPE property_type_enum AS ENUM (
    'multi_family_residential',
    'single_family_home',
    'commercial_plaza',
    'mixed_use',
    'student_hostel'
);

CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    landlord_id UUID REFERENCES users(id) ON DELETE SET NULL,
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    property_type property_type_enum DEFAULT 'multi_family_residential',
    address TEXT NOT NULL,
    neighborhood VARCHAR(100) NOT NULL, -- e.g. Bodija, Akobo, Lekki Phase 1
    city VARCHAR(100) NOT NULL DEFAULT 'Ibadan',
    state VARCHAR(100) NOT NULL DEFAULT 'Oyo',
    total_units INT DEFAULT 1,
    featured_image_url TEXT,
    is_managed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_properties_org ON properties(org_id);
CREATE INDEX idx_properties_landlord ON properties(landlord_id);

-- 6. APARTMENT UNITS (Individual flats, shops, or spaces)
CREATE TYPE unit_status_enum AS ENUM (
    'vacant',
    'occupied',
    'reserved',
    'maintenance'
);

CREATE TABLE IF NOT EXISTS units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    unit_number VARCHAR(50) NOT NULL, -- e.g. 'Flat 1', 'Suite 4B'
    unit_type VARCHAR(100) NOT NULL, -- '3 Bedroom Flat', 'Self Contained', 'Shop'
    bedrooms INT DEFAULT 1,
    bathrooms INT DEFAULT 1,
    rent_amount DECIMAL(12,2) NOT NULL, -- e.g. 850000.00
    rent_period VARCHAR(20) DEFAULT 'year', -- 'year', 'month'
    service_charge DECIMAL(12,2) DEFAULT 0.00,
    caution_deposit DECIMAL(12,2) DEFAULT 0.00,
    legal_and_agency DECIMAL(12,2) DEFAULT 0.00,
    status unit_status_enum DEFAULT 'vacant',
    current_tenant_id UUID,
    is_published_to_discovery BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_unit_per_property UNIQUE (property_id, unit_number)
);

CREATE INDEX idx_units_property ON units(property_id);
CREATE INDEX idx_units_status ON units(status);

-- 7. TENANTS
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    occupation VARCHAR(100),
    employer VARCHAR(150),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    move_in_date DATE NOT NULL,
    current_lease_end DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- active, overdue, notice_served, moved_out
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tenants_unit ON tenants(unit_id);
CREATE INDEX idx_tenants_phone ON tenants(phone);

-- 8. RENT SCHEDULES & INVOICES
CREATE TYPE rent_status_enum AS ENUM (
    'pending',
    'partial',
    'paid',
    'overdue'
);

CREATE TABLE IF NOT EXISTS rent_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    landlord_id UUID REFERENCES users(id) ON DELETE SET NULL,
    period_title VARCHAR(150) NOT NULL, -- e.g. 'Rent 2026-2027 (Annual)'
    due_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    base_rent DECIMAL(12,2) NOT NULL,
    service_charge DECIMAL(12,2) DEFAULT 0.00,
    total_amount_due DECIMAL(12,2) NOT NULL,
    amount_paid DECIMAL(12,2) DEFAULT 0.00,
    balance_remaining DECIMAL(12,2) NOT NULL,
    status rent_status_enum DEFAULT 'pending',
    last_reminder_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rent_due_date ON rent_schedules(due_date);
CREATE INDEX idx_rent_status ON rent_schedules(status);

-- 9. PAYMENT RECORDS (Reported Evidence vs Verified Reconciliation)
CREATE TYPE payment_status_enum AS ENUM (
    'reported', -- Tenant submitted bank transfer proof/alert; awaiting manager verification
    'verified', -- Confirmed in landlord/agency bank account; receipt generated
    'rejected'  -- Invalid or fake transaction evidence
);

CREATE TABLE IF NOT EXISTS payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    rent_schedule_id UUID REFERENCES rent_schedules(id) ON DELETE SET NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'bank_transfer', -- bank_transfer, card, cash, pos
    bank_reference VARCHAR(150),
    proof_image_url TEXT, -- WhatsApp attachment or dashboard upload
    status payment_status_enum DEFAULT 'reported',
    receipt_number VARCHAR(100) UNIQUE,
    verified_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MAINTENANCE REQUESTS & WORKORDERS
CREATE TYPE maintenance_status_enum AS ENUM (
    'open',
    'estimate_submitted',
    'pending_landlord_approval',
    'approved',
    'in_progress',
    'completed',
    'rejected'
);

CREATE TYPE maintenance_priority_enum AS ENUM (
    'low',
    'medium',
    'high',
    'emergency'
);

CREATE TABLE IF NOT EXISTS maintenance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
    reported_by_phone VARCHAR(50),
    reported_by_name VARCHAR(255),
    category VARCHAR(100) NOT NULL, -- Plumbing, Electrical, Roof/Structural, Masonry
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority maintenance_priority_enum DEFAULT 'medium',
    status maintenance_status_enum DEFAULT 'open',
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    contractor_name VARCHAR(255),
    contractor_phone VARCHAR(50),
    media_urls TEXT[], -- photos/videos submitted via WhatsApp
    landlord_approved_at TIMESTAMPTZ,
    landlord_rejected_at TIMESTAMPTZ,
    rejection_reason TEXT,
    assigned_staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. OPERATIONAL TASKS
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'todo', -- todo, in_progress, done
    due_date DATE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    related_property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    related_unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. LANDLORD MONTHLY FINANCIAL STATEMENTS
CREATE TABLE IF NOT EXISTS landlord_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    landlord_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month_period VARCHAR(20) NOT NULL, -- e.g. '2026-11'
    total_rent_collected DECIMAL(12,2) DEFAULT 0.00,
    agency_commission DECIMAL(12,2) DEFAULT 0.00,
    maintenance_expenses DECIMAL(12,2) DEFAULT 0.00,
    net_payout_amount DECIMAL(12,2) DEFAULT 0.00,
    vacant_units_count INT DEFAULT 0,
    total_units_count INT DEFAULT 0,
    summary_text TEXT,
    sent_via_whatsapp_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. WHATSAPP CONVERSATIONAL SESSIONS (State tracking for BotSailor & Webhooks)
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(50) UNIQUE NOT NULL,
    org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    current_state VARCHAR(100) DEFAULT 'idle',
    session_data JSONB DEFAULT '{}'::jsonb,
    last_interaction_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

import { v4 as uuidv4 } from 'uuid';
import {
  Organization,
  User,
  MagicToken,
  LandlordProfile,
  Property,
  Unit,
  Tenant,
  RentSchedule,
  PaymentRecord,
  MaintenanceRequest,
  TaskItem,
  LandlordReport,
  WhatsAppSession,
  AuditLog
} from './types.js';

class DataStore {
  organizations: Organization[] = [];
  users: User[] = [];
  magicTokens: MagicToken[] = [];
  landlordProfiles: LandlordProfile[] = [];
  properties: Property[] = [];
  units: Unit[] = [];
  tenants: Tenant[] = [];
  rentSchedules: RentSchedule[] = [];
  paymentRecords: PaymentRecord[] = [];
  maintenanceRequests: MaintenanceRequest[] = [];
  tasks: TaskItem[] = [];
  landlordReports: LandlordReport[] = [];
  whatsappSessions: WhatsAppSession[] = [];
  auditLogs: AuditLog[] = [];

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    const orgId = 'org-locari-01';
    const now = new Date().toISOString();

    // 1. Organization: Locari Property Management Services
    this.organizations.push({
      id: orgId,
      name: 'Locari Property Management Services',
      slug: 'locari-services',
      phone: '+2348000000000',
      email: 'management@locari.africa',
      address: 'Plot 4, Ring Road, Ibadan, Oyo State, Nigeria',
      currency: 'NGN',
      subscription_plan: 'locari_internal',
      subscription_status: 'active',
      max_units: 500,
      created_at: now,
      updated_at: now
    });

    // 2. Users:
    // A. Property Manager (Tunde Balogun)
    const pmUserId = 'usr-pm-01';
    this.users.push({
      id: pmUserId,
      org_id: orgId,
      full_name: 'Tunde Balogun',
      email: 'tunde@locari.africa',
      phone: '+2348011223344',
      role: 'property_manager',
      is_diaspora: false,
      country: 'Nigeria',
      timezone: 'Africa/Lagos',
      is_active: true,
      created_at: now,
      updated_at: now
    });

    // B. Diaspora Landlord in London, UK (Chief Adeleke)
    const diasporaLandlordUserId = 'usr-landlord-uk';
    this.users.push({
      id: diasporaLandlordUserId,
      org_id: orgId,
      full_name: 'Chief Babatunde Adeleke',
      email: 'badeleke@gmail.com',
      phone: '+447911123456', // UK international phone
      role: 'landlord',
      is_diaspora: true,
      country: 'United Kingdom',
      timezone: 'Europe/London',
      is_active: true,
      created_at: now,
      updated_at: now
    });

    // Landlord profile for Chief Adeleke
    this.landlordProfiles.push({
      id: 'lp-01',
      user_id: diasporaLandlordUserId,
      org_id: orgId,
      is_diaspora: true,
      residence_country: 'United Kingdom',
      residence_city: 'London',
      preferred_currency: 'NGN',
      emergency_contact_name: 'Brother Segun Adeleke (Lagos)',
      emergency_contact_phone: '+2348033344455',
      bank_name: 'Guaranty Trust Bank (GTBank)',
      account_number: '0123456789',
      account_name: 'Babatunde Adeleke',
      management_fee_percentage: 10.0,
      whatsapp_reporting_frequency: 'monthly',
      notes: 'Overseas landlord. Please send all repair approvals with photo/video proofs on WhatsApp.',
      created_at: now,
      updated_at: now
    });

    // C. Local Landlord in Lagos (Mrs. Folashade Williams)
    const localLandlordUserId = 'usr-landlord-ng';
    this.users.push({
      id: localLandlordUserId,
      org_id: orgId,
      full_name: 'Mrs. Folashade Williams',
      email: 'fwilliams@outlook.com',
      phone: '+2348022334455',
      role: 'landlord',
      is_diaspora: false,
      country: 'Nigeria',
      timezone: 'Africa/Lagos',
      is_active: true,
      created_at: now,
      updated_at: now
    });

    this.landlordProfiles.push({
      id: 'lp-02',
      user_id: localLandlordUserId,
      org_id: orgId,
      is_diaspora: false,
      residence_country: 'Nigeria',
      residence_city: 'Lagos',
      preferred_currency: 'NGN',
      bank_name: 'Zenith Bank',
      account_number: '1098765432',
      account_name: 'Folashade Williams',
      management_fee_percentage: 8.0,
      whatsapp_reporting_frequency: 'monthly',
      created_at: now,
      updated_at: now
    });

    // D. Field Agent (Kunle Alade)
    const agentUserId = 'usr-agent-01';
    this.users.push({
      id: agentUserId,
      org_id: orgId,
      full_name: 'Kunle Alade',
      email: 'kunle.field@locari.africa',
      phone: '+2348077889900',
      role: 'field_agent',
      is_diaspora: false,
      country: 'Nigeria',
      timezone: 'Africa/Lagos',
      is_active: true,
      created_at: now,
      updated_at: now
    });

    // 3. Properties:
    // Property 1: Adeleke Royal Court (Bodija, Ibadan) - Managed for Diaspora landlord
    const prop1Id = 'prop-adeleke-01';
    this.properties.push({
      id: prop1Id,
      org_id: orgId,
      landlord_id: diasporaLandlordUserId,
      manager_id: pmUserId,
      name: 'Adeleke Royal Court',
      property_type: 'multi_family_residential',
      address: '14 Favos Close, New Bodija',
      neighborhood: 'Old / New Bodija',
      city: 'Ibadan',
      state: 'Oyo',
      total_units: 4,
      featured_image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      is_managed: true,
      created_at: now,
      updated_at: now
    });

    // Property 2: Williams Heights (Lekki Phase 1, Lagos)
    const prop2Id = 'prop-williams-02';
    this.properties.push({
      id: prop2Id,
      org_id: orgId,
      landlord_id: localLandlordUserId,
      manager_id: pmUserId,
      name: 'Williams Heights',
      property_type: 'multi_family_residential',
      address: 'Plot 22, Admiralty Way, Lekki Phase 1',
      neighborhood: 'Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos',
      total_units: 6,
      featured_image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      is_managed: true,
      created_at: now,
      updated_at: now
    });

    // 4. Units for Adeleke Royal Court:
    const unit1Id = 'unit-arc-1';
    const unit2Id = 'unit-arc-2';
    const unit3Id = 'unit-arc-3';
    const unit4Id = 'unit-arc-4';

    this.units.push(
      {
        id: unit1Id,
        org_id: orgId,
        property_id: prop1Id,
        unit_number: 'Flat 1 (Ground Left)',
        unit_type: '3 Bedroom Flat',
        bedrooms: 3,
        bathrooms: 3,
        rent_amount: 900000,
        rent_period: 'year',
        service_charge: 100000,
        caution_deposit: 100000,
        legal_and_agency: 180000,
        status: 'occupied',
        current_tenant_id: 'ten-01',
        is_published_to_discovery: false,
        created_at: now,
        updated_at: now
      },
      {
        id: unit2Id,
        org_id: orgId,
        property_id: prop1Id,
        unit_number: 'Flat 2 (Ground Right)',
        unit_type: '3 Bedroom Flat',
        bedrooms: 3,
        bathrooms: 3,
        rent_amount: 900000,
        rent_period: 'year',
        service_charge: 100000,
        caution_deposit: 100000,
        legal_and_agency: 180000,
        status: 'occupied',
        current_tenant_id: 'ten-02',
        is_published_to_discovery: false,
        created_at: now,
        updated_at: now
      },
      {
        id: unit3Id,
        org_id: orgId,
        property_id: prop1Id,
        unit_number: 'Flat 3 (Upper Left)',
        unit_type: '3 Bedroom Flat',
        bedrooms: 3,
        bathrooms: 3,
        rent_amount: 950000,
        rent_period: 'year',
        service_charge: 100000,
        caution_deposit: 100000,
        legal_and_agency: 190000,
        status: 'occupied',
        current_tenant_id: 'ten-03',
        is_published_to_discovery: false,
        created_at: now,
        updated_at: now
      },
      {
        id: unit4Id,
        org_id: orgId,
        property_id: prop1Id,
        unit_number: 'Flat 4 (Upper Right)',
        unit_type: '3 Bedroom Flat',
        bedrooms: 3,
        bathrooms: 3,
        rent_amount: 950000,
        rent_period: 'year',
        service_charge: 100000,
        caution_deposit: 100000,
        legal_and_agency: 190000,
        status: 'vacant',
        current_tenant_id: undefined,
        is_published_to_discovery: true, // Marked to sync with locari.africa discovery!
        created_at: now,
        updated_at: now
      }
    );

    // Units for Williams Heights (Lekki):
    this.units.push(
      {
        id: 'unit-wh-1',
        org_id: orgId,
        property_id: prop2Id,
        unit_number: 'Unit 1A',
        unit_type: '2 Bedroom Luxury Flat',
        bedrooms: 2,
        bathrooms: 2,
        rent_amount: 2800000,
        rent_period: 'year',
        service_charge: 400000,
        caution_deposit: 300000,
        legal_and_agency: 560000,
        status: 'occupied',
        current_tenant_id: 'ten-04',
        is_published_to_discovery: false,
        created_at: now,
        updated_at: now
      },
      {
        id: 'unit-wh-2',
        org_id: orgId,
        property_id: prop2Id,
        unit_number: 'Unit 1B',
        unit_type: '2 Bedroom Luxury Flat',
        bedrooms: 2,
        bathrooms: 2,
        rent_amount: 2800000,
        rent_period: 'year',
        service_charge: 400000,
        caution_deposit: 300000,
        legal_and_agency: 560000,
        status: 'vacant',
        current_tenant_id: undefined,
        is_published_to_discovery: true,
        created_at: now,
        updated_at: now
      }
    );

    // 5. Tenants:
    this.tenants.push(
      {
        id: 'ten-01',
        org_id: orgId,
        property_id: prop1Id,
        unit_id: unit1Id,
        full_name: 'Dr. Chukwuma Obi',
        phone: '+2348055566677',
        email: 'c.obi@uchealth.ng',
        occupation: 'Medical Doctor',
        employer: 'University College Hospital (UCH)',
        emergency_contact_name: 'Mrs. Ifeoma Obi',
        emergency_contact_phone: '+2348055566688',
        move_in_date: '2025-01-15',
        current_lease_end: '2027-01-14',
        status: 'active',
        created_at: now,
        updated_at: now
      },
      {
        id: 'ten-02',
        org_id: orgId,
        property_id: prop1Id,
        unit_id: unit2Id,
        full_name: 'Amina Bello',
        phone: '+2348033221100',
        email: 'amina.bello@fcmb.com',
        occupation: 'Bank Officer',
        employer: 'FCMB Bodija Branch',
        emergency_contact_name: 'Malam Ibrahim Bello',
        emergency_contact_phone: '+2348033221199',
        move_in_date: '2025-11-01',
        current_lease_end: '2026-10-31', // OVERDUE RENT CASE FOR TESTING!
        status: 'overdue',
        created_at: now,
        updated_at: now
      },
      {
        id: 'ten-03',
        org_id: orgId,
        property_id: prop1Id,
        unit_id: unit3Id,
        full_name: 'Engr. Femi Adeleke-Coker',
        phone: '+2348099887766',
        email: 'femi.coker@buildng.com',
        occupation: 'Civil Engineer',
        employer: 'Costain West Africa',
        emergency_contact_name: 'Kemi Coker',
        emergency_contact_phone: '+2348099887755',
        move_in_date: '2026-03-01',
        current_lease_end: '2027-02-28',
        status: 'active',
        created_at: now,
        updated_at: now
      }
    );

    // 6. Rent Schedules:
    this.rentSchedules.push(
      // Dr. Obi - Fully Paid
      {
        id: 'rs-01',
        org_id: orgId,
        property_id: prop1Id,
        unit_id: unit1Id,
        tenant_id: 'ten-01',
        landlord_id: diasporaLandlordUserId,
        period_title: 'Rent 2026 - 2027 (Annual)',
        due_date: '2026-01-15',
        expiry_date: '2027-01-14',
        base_rent: 900000,
        service_charge: 100000,
        total_amount_due: 1000000,
        amount_paid: 1000000,
        balance_remaining: 0,
        status: 'paid',
        created_at: now,
        updated_at: now
      },
      // Amina Bello - Overdue!
      {
        id: 'rs-02',
        org_id: orgId,
        property_id: prop1Id,
        unit_id: unit2Id,
        tenant_id: 'ten-02',
        landlord_id: diasporaLandlordUserId,
        period_title: 'Rent Renewal 2026 - 2027',
        due_date: '2026-10-31',
        expiry_date: '2027-10-30',
        base_rent: 900000,
        service_charge: 100000,
        total_amount_due: 1000000,
        amount_paid: 300000, // Partial payment
        balance_remaining: 700000,
        status: 'overdue',
        last_reminder_sent_at: '2026-11-05T09:00:00Z',
        created_at: now,
        updated_at: now
      },
      // Engr. Femi - Paid
      {
        id: 'rs-03',
        org_id: orgId,
        property_id: prop1Id,
        unit_id: unit3Id,
        tenant_id: 'ten-03',
        landlord_id: diasporaLandlordUserId,
        period_title: 'Rent 2026 - 2027',
        due_date: '2026-03-01',
        expiry_date: '2027-02-28',
        base_rent: 950000,
        service_charge: 100000,
        total_amount_due: 1050000,
        amount_paid: 1050000,
        balance_remaining: 0,
        status: 'paid',
        created_at: now,
        updated_at: now
      }
    );

    // 7. Payment Records (Distinguishing Reported Proof vs Verified):
    this.paymentRecords.push(
      // Verified payment with official receipt
      {
        id: 'pay-01',
        org_id: orgId,
        rent_schedule_id: 'rs-01',
        tenant_id: 'ten-01',
        unit_id: unit1Id,
        amount: 1000000,
        payment_date: '2026-01-14',
        payment_method: 'bank_transfer',
        bank_reference: 'GTB-TRF-20260114-99881',
        status: 'verified',
        receipt_number: 'REC-LOCARI-2026-0012',
        verified_by_user_id: pmUserId,
        verified_at: '2026-01-14T14:30:00Z',
        notes: 'Confirmed in Agency GTBank account. Receipt dispatched to tenant on WhatsApp.',
        created_at: now
      },
      // REPORTED payment awaiting manager verification!
      {
        id: 'pay-02',
        org_id: orgId,
        rent_schedule_id: 'rs-02',
        tenant_id: 'ten-02',
        unit_id: unit2Id,
        amount: 300000,
        payment_date: '2026-11-02',
        payment_method: 'bank_transfer',
        bank_reference: 'FCMB-ONLINE-776612',
        proof_image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80',
        status: 'reported', // Pending review!
        notes: 'Tenant submitted screenshot on WhatsApp claiming part-payment.',
        created_at: now
      }
    );

    // 8. Maintenance Workorders (with Diaspora Landlord Approval flow):
    this.maintenanceRequests.push(
      // High-priority borehole water pump replacement needing Chief Adeleke's approval from UK
      {
        id: 'maint-01',
        org_id: orgId,
        property_id: prop1Id,
        unit_id: unit1Id,
        reported_by_phone: '+2348055566677',
        reported_by_name: 'Dr. Chukwuma Obi',
        category: 'Plumbing & Water System',
        title: 'Borehole Submersible Pump Failure',
        description: 'Borehole stopped pumping water to the overhead tanks since yesterday evening. Plumbing contractor inspected and confirmed motor coils burned out.',
        priority: 'high',
        status: 'pending_landlord_approval', // Chief Adeleke in London receives WhatsApp notification to approve!
        estimated_cost: 145000,
        actual_cost: undefined,
        contractor_name: 'Engr. Segun (Oyo Water Works tech)',
        contractor_phone: '+2348022001144',
        media_urls: [
          'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=500&q=80'
        ],
        assigned_staff_id: agentUserId,
        created_at: '2026-11-13T08:00:00Z',
        updated_at: '2026-11-13T09:30:00Z'
      },
      // Completed repair
      {
        id: 'maint-02',
        org_id: orgId,
        property_id: prop1Id,
        unit_id: unit3Id,
        reported_by_phone: '+2348099887766',
        reported_by_name: 'Engr. Femi Coker',
        category: 'Electrical',
        title: 'Circuit Breaker Tripping in Master Bedroom',
        description: 'Replaced faulty 32A Schneider breaker and traced grounded wire in AC socket.',
        priority: 'medium',
        status: 'completed',
        estimated_cost: 28000,
        actual_cost: 25000,
        contractor_name: 'Baba Alaba Electrician',
        contractor_phone: '+2348033002211',
        completed_at: '2026-11-08T16:00:00Z',
        created_at: '2026-11-06T10:00:00Z',
        updated_at: '2026-11-08T16:00:00Z'
      }
    );

    // 9. Operational Tasks:
    this.tasks.push(
      {
        id: 'tsk-01',
        org_id: orgId,
        title: 'Follow up on Amina Bello remaining rent (₦700k)',
        description: 'Call tenant and deliver formal reminder notice. Discuss payment plan for remaining balance before month end.',
        priority: 'high',
        status: 'todo',
        due_date: '2026-11-20',
        assigned_to: pmUserId,
        related_property_id: prop1Id,
        related_unit_id: unit2Id,
        created_at: now,
        updated_at: now
      },
      {
        id: 'tsk-02',
        org_id: orgId,
        title: 'Conduct Move-in Inspection for Adeleke Royal Court Flat 4',
        description: 'Take pre-tenancy photos of walls, water fittings, and electrical sockets. Publish to Locari Discovery.',
        priority: 'medium',
        status: 'in_progress',
        due_date: '2026-11-18',
        assigned_to: agentUserId,
        related_property_id: prop1Id,
        related_unit_id: unit4Id,
        created_at: now,
        updated_at: now
      },
      {
        id: 'tsk-03',
        org_id: orgId,
        title: 'Prepare October Landlord Remittance Statement for Chief Adeleke',
        description: 'Compile collected rents, deduct 10% agency fee and electrical repair, draft transfer schedule.',
        priority: 'medium',
        status: 'done',
        due_date: '2026-11-05',
        assigned_to: pmUserId,
        related_property_id: prop1Id,
        created_at: now,
        updated_at: now
      }
    );

    // 10. Landlord Monthly Financial Reports:
    this.landlordReports.push({
      id: 'lr-01',
      org_id: orgId,
      landlord_id: diasporaLandlordUserId,
      month_period: '2026-10',
      total_rent_collected: 1050000,
      agency_commission: 105000, // 10%
      maintenance_expenses: 25000,
      net_payout_amount: 920000,
      vacant_units_count: 1,
      total_units_count: 4,
      summary_text: 'October 2026 statement for Adeleke Royal Court: ₦1,050,000 collected. Net remittance of ₦920,000 sent to GTBank account.',
      sent_via_whatsapp_at: '2026-11-05T12:00:00Z',
      created_at: now
    });
  }

  // --- QUERY HELPERS ---
  findUserByPhone(phone: string): User | undefined {
    const clean = phone.replace(/[^0-9]/g, '');
    return this.users.find(u => u.phone.replace(/[^0-9]/g, '') === clean);
  }

  findUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getPropertiesByOrg(orgId: string): Property[] {
    return this.properties.filter(p => p.org_id === orgId);
  }

  getUnitsByProperty(propertyId: string): Unit[] {
    return this.units.filter(u => u.property_id === propertyId);
  }

  getRentSchedulesByOrg(orgId: string): RentSchedule[] {
    return this.rentSchedules.filter(r => r.org_id === orgId);
  }

  getMaintenanceRequestsByOrg(orgId: string): MaintenanceRequest[] {
    return this.maintenanceRequests.filter(m => m.org_id === orgId);
  }

  getLandlordProfile(userId: string): LandlordProfile | undefined {
    return this.landlordProfiles.find(lp => lp.user_id === userId);
  }
}

export const store = new DataStore();

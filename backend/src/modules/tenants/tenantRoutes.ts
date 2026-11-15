import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../../db/store.js';
import { Tenant } from '../../db/types.js';

const router = Router();

/**
 * Get all tenants with property, unit, and lease information
 */
router.get('/', (req: Request, res: Response) => {
  const orgId = (req.query.org_id as string) || 'org-locari-01';
  const tenants = store.tenants.filter(t => t.org_id === orgId);

  const enhanced = tenants.map(t => {
    const property = store.properties.find(p => p.id === t.property_id);
    const unit = store.units.find(u => u.id === t.unit_id);
    const rentSchedule = store.rentSchedules.find(s => s.tenant_id === t.id);

    return {
      ...t,
      property_name: property?.name || 'Unknown Property',
      unit_number: unit?.unit_number || 'Unknown Unit',
      rent_amount: unit?.rent_amount || 0,
      rent_status: rentSchedule?.status || 'pending',
      amount_owing: rentSchedule?.balance_remaining || 0,
      due_date: rentSchedule?.due_date || t.current_lease_end
    };
  });

  res.json(enhanced);
});

/**
 * Register a new tenant
 */
router.post('/', (req: Request, res: Response) => {
  const {
    org_id = 'org-locari-01',
    property_id,
    unit_id,
    full_name,
    phone,
    email,
    occupation,
    employer,
    emergency_contact_name,
    emergency_contact_phone,
    move_in_date,
    lease_duration_months = 12
  } = req.body;

  if (!property_id || !unit_id || !full_name || !phone) {
    return res.status(400).json({ error: 'Property, unit, name, and phone are required' });
  }

  const now = new Date().toISOString();
  const moveIn = move_in_date || new Date().toISOString().split('T')[0];
  const leaseEndDate = new Date(new Date(moveIn).setMonth(new Date(moveIn).getMonth() + Number(lease_duration_months)))
    .toISOString().split('T')[0];

  const tenantId = `ten-${uuidv4().slice(0, 8)}`;
  const tenant: Tenant = {
    id: tenantId,
    org_id,
    property_id,
    unit_id,
    full_name,
    phone,
    email,
    occupation,
    employer,
    emergency_contact_name,
    emergency_contact_phone,
    move_in_date: moveIn,
    current_lease_end: leaseEndDate,
    status: 'active',
    created_at: now,
    updated_at: now
  };
  store.tenants.unshift(tenant);

  // Mark the unit as occupied
  const unit = store.units.find(u => u.id === unit_id);
  if (unit) {
    unit.status = 'occupied';
    unit.current_tenant_id = tenantId;
  }

  // Create initial rent schedule
  const prop = store.properties.find(p => p.id === property_id);
  const rentSchedId = `rs-${uuidv4().slice(0, 8)}`;
  store.rentSchedules.unshift({
    id: rentSchedId,
    org_id,
    property_id,
    unit_id,
    tenant_id: tenantId,
    landlord_id: prop?.landlord_id,
    period_title: `Rent ${new Date().getFullYear()} - ${new Date().getFullYear() + 1}`,
    due_date: moveIn,
    expiry_date: leaseEndDate,
    base_rent: unit?.rent_amount || 800000,
    service_charge: unit?.service_charge || 50000,
    total_amount_due: (unit?.rent_amount || 800000) + (unit?.service_charge || 50000),
    amount_paid: 0,
    balance_remaining: (unit?.rent_amount || 800000) + (unit?.service_charge || 50000),
    status: 'pending',
    created_at: now,
    updated_at: now
  });

  res.status(201).json(tenant);
});

export default router;

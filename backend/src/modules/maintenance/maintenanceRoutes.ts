import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../../db/store.js';
import { MaintenanceRequest } from '../../db/types.js';

const router = Router();

/**
 * Get all maintenance requests
 */
router.get('/', (req: Request, res: Response) => {
  const orgId = (req.query.org_id as string) || 'org-locari-01';
  const requests = store.getMaintenanceRequestsByOrg(orgId);

  const enhanced = requests.map(m => {
    const property = store.properties.find(p => p.id === m.property_id);
    const unit = m.unit_id ? store.units.find(u => u.id === m.unit_id) : undefined;
    const landlord = property?.landlord_id ? store.findUserById(property.landlord_id) : undefined;
    const staff = m.assigned_staff_id ? store.findUserById(m.assigned_staff_id) : undefined;

    return {
      ...m,
      property_name: property?.name || 'Property',
      unit_number: unit?.unit_number || 'Common Area',
      landlord_name: landlord?.full_name || 'Landlord',
      landlord_phone: landlord?.phone || '',
      landlord_is_diaspora: landlord?.is_diaspora || false,
      assigned_staff_name: staff?.full_name || 'Unassigned'
    };
  });

  res.json(enhanced);
});

/**
 * Create a new maintenance request
 */
router.post('/', (req: Request, res: Response) => {
  const {
    org_id = 'org-locari-01',
    property_id,
    unit_id,
    reported_by_name,
    reported_by_phone,
    category = 'Plumbing',
    title,
    description,
    priority = 'medium',
    estimated_cost,
    contractor_name,
    contractor_phone,
    media_urls = []
  } = req.body;

  if (!property_id || !title || !description) {
    return res.status(400).json({ error: 'Property, title, and description are required' });
  }

  const now = new Date().toISOString();
  const property = store.properties.find(p => p.id === property_id);
  const requiresLandlordApproval = estimated_cost && Number(estimated_cost) > 50000;

  const newMaint: MaintenanceRequest = {
    id: `maint-${uuidv4().slice(0, 8)}`,
    org_id,
    property_id,
    unit_id,
    reported_by_name: reported_by_name || 'Manager Logged',
    reported_by_phone: reported_by_phone || '+2348000000000',
    category,
    title,
    description,
    priority,
    status: requiresLandlordApproval ? 'pending_landlord_approval' : 'open',
    estimated_cost: estimated_cost ? Number(estimated_cost) : undefined,
    contractor_name,
    contractor_phone,
    media_urls,
    created_at: now,
    updated_at: now
  };

  store.maintenanceRequests.unshift(newMaint);

  res.status(201).json({
    request: newMaint,
    requires_approval: requiresLandlordApproval,
    message: requiresLandlordApproval 
      ? `Expense alert sent to Landlord via WhatsApp for authorization.` 
      : `Maintenance request created.`
  });
});

/**
 * Approve maintenance request (Landlord / Manager authorization)
 */
router.patch('/:id/approve', (req: Request, res: Response) => {
  const maint = store.maintenanceRequests.find(m => m.id === String(req.params.id));
  if (!maint) {
    return res.status(404).json({ error: 'Maintenance request not found' });
  }

  maint.status = 'approved';
  maint.landlord_approved_at = new Date().toISOString();
  maint.updated_at = new Date().toISOString();

  res.json({
    request: maint,
    message: `Repair approved. Contractor notified to begin work.`
  });
});

/**
 * Mark maintenance request completed with actual expense
 */
router.patch('/:id/complete', (req: Request, res: Response) => {
  const maint = store.maintenanceRequests.find(m => m.id === String(req.params.id));
  if (!maint) {
    return res.status(404).json({ error: 'Maintenance request not found' });
  }

  const { actual_cost } = req.body;
  maint.status = 'completed';
  if (actual_cost !== undefined) {
    maint.actual_cost = Number(actual_cost);
  }
  maint.completed_at = new Date().toISOString();
  maint.updated_at = new Date().toISOString();

  res.json({
    request: maint,
    message: `Maintenance marked as completed.`
  });
});

export default router;

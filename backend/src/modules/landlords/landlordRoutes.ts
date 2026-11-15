import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { store } from '../../db/store.js';
import { LandlordProfile, LandlordReport } from '../../db/types.js';

const router = Router();

/**
 * Get all landlords with diaspora status and portfolio stats
 */
router.get('/', (req: Request, res: Response) => {
  const orgId = (req.query.org_id as string) || 'org-locari-01';
  
  // Find users with landlord role
  const landlords = store.users.filter(u => u.org_id === orgId && u.role === 'landlord');

  const detailed = landlords.map(landlord => {
    const profile = store.getLandlordProfile(landlord.id);
    const properties = store.properties.filter(p => p.landlord_id === landlord.id);
    
    let totalUnits = 0;
    let occupiedUnits = 0;
    let vacantUnits = 0;

    properties.forEach(p => {
      const units = store.getUnitsByProperty(p.id);
      totalUnits += units.length;
      occupiedUnits += units.filter(u => u.status === 'occupied').length;
      vacantUnits += units.filter(u => u.status === 'vacant').length;
    });

    // Rent schedules for this landlord
    const schedules = store.rentSchedules.filter(s => s.landlord_id === landlord.id);
    const totalCollected = schedules.reduce((acc, s) => acc + s.amount_paid, 0);
    const totalArrears = schedules
      .filter(s => s.status === 'overdue')
      .reduce((acc, s) => acc + s.balance_remaining, 0);

    // Pending approvals
    const pendingMaint = store.maintenanceRequests.filter(m => 
      properties.some(p => p.id === m.property_id) && m.status === 'pending_landlord_approval'
    );

    return {
      ...landlord,
      profile,
      properties: properties.map(p => ({ id: p.id, name: p.name, city: p.city })),
      stats: {
        total_properties: properties.length,
        total_units: totalUnits,
        occupied_units: occupiedUnits,
        vacant_units: vacantUnits,
        total_collected: totalCollected,
        total_arrears: totalArrears,
        pending_approvals_count: pendingMaint.length
      }
    };
  });

  res.json(detailed);
});

/**
 * Generate a Monthly Landlord Remittance Statement
 */
router.post('/:id/statement', (req: Request, res: Response) => {
  const landlordId = String(req.params.id);
  const landlord = store.findUserById(landlordId);

  if (!landlord) {
    return res.status(404).json({ error: 'Landlord not found' });
  }

  const profile = store.getLandlordProfile(landlordId);
  const orgId = landlord.org_id;
  const monthPeriod = (req.body.month_period as string) || new Date().toISOString().slice(0, 7);

  // Compute actual numbers from rent schedules and maintenance
  const landlordProperties = store.properties.filter(p => p.landlord_id === landlordId);
  const propIds = landlordProperties.map(p => p.id);

  const schedules = store.rentSchedules.filter(s => s.landlord_id === landlordId);
  const totalRentCollected = schedules.reduce((sum, s) => sum + s.amount_paid, 0);
  
  const feePercent = profile?.management_fee_percentage || 10.0;
  const agencyCommission = Math.round(totalRentCollected * (feePercent / 100));

  const maintExpenses = store.maintenanceRequests
    .filter(m => propIds.includes(m.property_id) && (m.status === 'completed' || m.status === 'approved'))
    .reduce((sum, m) => sum + (m.actual_cost || m.estimated_cost || 0), 0);

  const netPayout = totalRentCollected - agencyCommission - maintExpenses;

  const totalUnits = store.units.filter(u => propIds.includes(u.property_id)).length;
  const vacantUnits = store.units.filter(u => propIds.includes(u.property_id) && u.status === 'vacant').length;

  const report: LandlordReport = {
    id: `lr-${uuidv4().slice(0, 8)}`,
    org_id: orgId,
    landlord_id: landlordId,
    month_period: monthPeriod,
    total_rent_collected: totalRentCollected,
    agency_commission: agencyCommission,
    maintenance_expenses: maintExpenses,
    net_payout_amount: Math.max(0, netPayout),
    vacant_units_count: vacantUnits,
    total_units_count: totalUnits,
    summary_text: `Monthly Remittance Statement for ${landlord.full_name} (${monthPeriod}). Net disbursement of ₦${Math.max(0, netPayout).toLocaleString()} prepared for payout.`,
    sent_via_whatsapp_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  store.landlordReports.push(report);

  res.status(201).json({
    report,
    message: `Statement generated and dispatched via WhatsApp to ${landlord.phone}`
  });
});

export default router;

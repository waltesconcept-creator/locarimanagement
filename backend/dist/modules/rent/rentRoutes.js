import { Router } from 'express';
import { store } from '../../db/store.js';
const router = Router();
/**
 * Get all rent schedules & arrears
 */
router.get('/schedules', (req, res) => {
    const orgId = req.query.org_id || 'org-locari-01';
    const schedules = store.getRentSchedulesByOrg(orgId);
    const enhanced = schedules.map(s => {
        const tenant = store.tenants.find(t => t.id === s.tenant_id);
        const unit = store.units.find(u => u.id === s.unit_id);
        const property = store.properties.find(p => p.id === s.property_id);
        const landlord = s.landlord_id ? store.findUserById(s.landlord_id) : undefined;
        return {
            ...s,
            tenant_name: tenant?.full_name || 'Unknown Tenant',
            tenant_phone: tenant?.phone || '',
            unit_number: unit?.unit_number || 'Unknown Unit',
            property_name: property?.name || 'Unknown Property',
            landlord_name: landlord?.full_name || 'Landlord'
        };
    });
    res.json(enhanced);
});
/**
 * Get all payment records (reported vs verified)
 */
router.get('/payments', (req, res) => {
    const orgId = req.query.org_id || 'org-locari-01';
    const payments = store.paymentRecords.filter(p => p.org_id === orgId);
    const enhanced = payments.map(p => {
        const tenant = store.tenants.find(t => t.id === p.tenant_id);
        const unit = store.units.find(u => u.id === p.unit_id);
        const verifiedBy = p.verified_by_user_id ? store.findUserById(p.verified_by_user_id) : undefined;
        return {
            ...p,
            tenant_name: tenant?.full_name || 'Tenant',
            tenant_phone: tenant?.phone || '',
            unit_number: unit?.unit_number || 'Unit',
            verified_by_name: verifiedBy?.full_name || null
        };
    });
    res.json(enhanced);
});
/**
 * Verify a reported payment (reconcile with bank account)
 */
router.post('/payments/:id/verify', (req, res) => {
    const paymentId = String(req.params.id);
    const payment = store.paymentRecords.find(p => p.id === paymentId);
    if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
    }
    const { verifier_user_id = 'usr-pm-01' } = req.body;
    const now = new Date().toISOString();
    payment.status = 'verified';
    payment.verified_by_user_id = verifier_user_id;
    payment.verified_at = now;
    payment.receipt_number = `REC-LOCARI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    // Reconcile and update the rent schedule
    if (payment.rent_schedule_id) {
        const schedule = store.rentSchedules.find(s => s.id === payment.rent_schedule_id);
        if (schedule) {
            schedule.amount_paid += payment.amount;
            schedule.balance_remaining = Math.max(0, schedule.total_amount_due - schedule.amount_paid);
            schedule.status = schedule.balance_remaining === 0 ? 'paid' : 'partial';
            schedule.updated_at = now;
        }
    }
    res.json({
        payment,
        message: `Payment of ₦${payment.amount.toLocaleString()} verified successfully. Receipt ${payment.receipt_number} generated.`
    });
});
/**
 * Reject a reported payment (fake transfer or invalid alert)
 */
router.post('/payments/:id/reject', (req, res) => {
    const paymentId = String(req.params.id);
    const payment = store.paymentRecords.find(p => p.id === paymentId);
    if (!payment) {
        return res.status(404).json({ error: 'Payment record not found' });
    }
    const { reason = 'Transaction not found on bank statement' } = req.body;
    payment.status = 'rejected';
    payment.rejection_reason = reason;
    res.json({
        payment,
        message: `Payment rejected: ${reason}`
    });
});
export default router;

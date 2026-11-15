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
 * Record a new payment manually from the console
 */
router.post('/payments', (req, res) => {
    const { tenant_id, unit_id, amount, payment_method, bank_reference, payment_date } = req.body;
    if (!tenant_id || !unit_id || !amount) {
        return res.status(400).json({ error: 'Tenant, unit, and amount are required' });
    }
    const now = new Date().toISOString();
    const paymentId = `pay-${Date.now().toString().slice(-6)}`;
    const tenant = store.tenants.find(t => t.id === tenant_id);
    const schedule = store.rentSchedules.find(s => s.unit_id === unit_id);
    const numAmount = Number(amount);
    const newPayment = {
        id: paymentId,
        org_id: tenant?.org_id || 'org-locari-01',
        rent_schedule_id: schedule?.id,
        tenant_id,
        unit_id,
        amount: numAmount,
        payment_date: payment_date || now.split('T')[0],
        payment_method: payment_method || 'bank_transfer',
        bank_reference: bank_reference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'verified',
        receipt_number: `REC-${Date.now().toString().slice(-6)}`,
        verified_by_user_id: 'usr-pm-01',
        verified_at: now
    };
    store.paymentRecords.unshift(newPayment);
    // If there is an active rent schedule, update amounts
    if (schedule) {
        schedule.amount_paid += numAmount;
        schedule.balance_remaining = Math.max(0, schedule.balance_remaining - numAmount);
        if (schedule.balance_remaining <= 0) {
            schedule.status = 'paid';
        }
    }
    res.status(201).json({
        message: 'Payment recorded and verified successfully',
        payment: newPayment
    });
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

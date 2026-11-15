import test from 'node:test';
import assert from 'node:assert/strict';
import { conversationalEngine } from '../dist/modules/whatsapp/conversationalEngine.js';
import { store } from '../dist/db/store.js';

test('Locari PM OS: WhatsApp Conversational Onboarding Flow', async (t) => {
  const testPhone = '+14155559988';

  // Step 1: Initial greeting from new user
  const step1 = await conversationalEngine.processIncomingMessage({
    fromPhone: testPhone,
    messageText: 'Hello, I want to manage my apartments'
  });
  assert.ok(step1.responseText.includes('Welcome to Locari Property Management'));
  assert.ok(step1.responseText.includes('What is your full name?'));

  // Step 2: Provide full name
  const step2 = await conversationalEngine.processIncomingMessage({
    fromPhone: testPhone,
    messageText: 'Alhaji Musa Danjuma'
  });
  assert.ok(step2.responseText.includes('Alhaji Musa Danjuma'));
  assert.ok(step2.responseText.includes('Landlord / Property Owner'));

  // Step 3: Select Landlord role
  const step3 = await conversationalEngine.processIncomingMessage({
    fromPhone: testPhone,
    messageText: '1'
  });
  assert.ok(step3.responseText.includes('Where are you currently based?'));

  // Step 4: Select Diaspora location
  const step4 = await conversationalEngine.processIncomingMessage({
    fromPhone: testPhone,
    messageText: '2'
  });
  assert.ok(step4.responseText.includes('Congratulations, Alhaji Musa Danjuma!'));
  assert.ok(step4.responseText.includes('Diaspora Landlord Mode Activated'));
  assert.ok(step4.responseText.includes('/auth/magic?token='));
  assert.equal(step4.actionTaken, 'user_registered');

  // Verify DB state
  const createdUser = store.findUserByPhone(testPhone);
  assert.ok(createdUser, 'User should exist in store');
  assert.equal(createdUser.full_name, 'Alhaji Musa Danjuma');
  assert.equal(createdUser.role, 'landlord');
  assert.equal(createdUser.is_diaspora, true);
});

test('Locari PM OS: Conversational Property Creation via WhatsApp', async (t) => {
  const pmPhone = '+2348011223344'; // Tunde Balogun

  // Step 1: Request to add property
  const r1 = await conversationalEngine.processIncomingMessage({
    fromPhone: pmPhone,
    messageText: 'Add property'
  });
  assert.ok(r1.responseText.includes('What is the name of this property'));

  // Step 2: Send property name
  const r2 = await conversationalEngine.processIncomingMessage({
    fromPhone: pmPhone,
    messageText: 'Sunrise Court'
  });
  assert.ok(r2.responseText.includes('What neighborhood and city'));

  // Step 3: Send location
  const r3 = await conversationalEngine.processIncomingMessage({
    fromPhone: pmPhone,
    messageText: 'Akobo, Ibadan'
  });
  assert.ok(r3.responseText.includes('How many apartment units'));

  // Step 4: Send units count
  const r4 = await conversationalEngine.processIncomingMessage({
    fromPhone: pmPhone,
    messageText: '3'
  });
  assert.ok(r4.responseText.includes('annual rent per unit'));

  // Step 5: Send rent
  const r5 = await conversationalEngine.processIncomingMessage({
    fromPhone: pmPhone,
    messageText: '800000'
  });
  assert.ok(r5.responseText.includes('Property Successfully Created!'));
  assert.ok(r5.responseText.includes('Sunrise Court'));
  assert.equal(r5.actionTaken, 'property_created');

  // Verify DB units generated
  const createdProp = store.properties.find(p => p.name === 'Sunrise Court');
  assert.ok(createdProp, 'Property should exist');
  const units = store.getUnitsByProperty(createdProp.id);
  assert.equal(units.length, 3, '3 units should be auto-created');
  assert.equal(units[0].rent_amount, 800000);
  assert.equal(units[0].status, 'vacant');
});

test('Locari PM OS: Rent Queries & Arrears Checking', async (t) => {
  const pmPhone = '+2348011223344';

  const res = await conversationalEngine.processIncomingMessage({
    fromPhone: pmPhone,
    messageText: 'Who is owing rent?'
  });
  assert.ok(res.responseText.includes('Rent Status & Collections'));
  assert.ok(res.responseText.includes('Amina Bello'));
  assert.ok(res.responseText.includes('700,000'));
});

test('Locari PM OS: Payment Reporting & Verification Integrity', async (t) => {
  const pmPhone = '+2348011223344';

  // 1. Report payment via WhatsApp
  const res = await conversationalEngine.processIncomingMessage({
    fromPhone: pmPhone,
    messageText: 'Record payment ₦450,000 for Flat 2'
  });
  assert.ok(res.responseText.includes('Payment Report Logged!'));
  assert.ok(res.responseText.includes('Pending Bank Verification'));
  assert.equal(res.actionTaken, 'payment_reported');

  // Verify it entered paymentRecords with status 'reported'
  const record = store.paymentRecords.find(p => p.amount === 450000);
  assert.ok(record);
  assert.equal(record.status, 'reported');
});

test('Locari PM OS: Landlord Maintenance Approval Flow', async (t) => {
  const landlordPhone = '+2348023456789'; // Chief Adeleke

  // 1. Check maintenance on WhatsApp
  const r1 = await conversationalEngine.processIncomingMessage({
    fromPhone: landlordPhone,
    messageText: 'Maintenance'
  });
  assert.ok(r1.responseText.includes('Borehole Submersible Pump Failure'));
  assert.ok(r1.responseText.includes('Action Needed'));

  // 2. Approve repair
  const r2 = await conversationalEngine.processIncomingMessage({
    fromPhone: landlordPhone,
    messageText: 'Approve'
  });
  assert.ok(r2.responseText.includes('Expense Approved!'));
  assert.equal(r2.actionTaken, 'maintenance_approved');

  // Verify status in DB
  const maint = store.maintenanceRequests.find(m => m.id === 'maint-01');
  assert.equal(maint.status, 'approved');
  assert.ok(maint.landlord_approved_at);
});

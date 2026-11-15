import { v4 as uuidv4 } from 'uuid';
import { store } from '../../db/store.js';
import { config } from '../../config/index.js';
export class ConversationalEngine {
    async processIncomingMessage(msg) {
        const rawPhone = msg.fromPhone.trim();
        const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');
        const text = msg.messageText.trim();
        const lower = text.toLowerCase();
        // 1. Check or create session
        let session = store.whatsappSessions.find(s => s.phone === cleanPhone);
        if (!session) {
            session = {
                id: uuidv4(),
                phone: cleanPhone,
                current_state: 'idle',
                session_data: {},
                last_interaction_at: new Date().toISOString()
            };
            store.whatsappSessions.push(session);
        }
        session.last_interaction_at = new Date().toISOString();
        // 2. Look up existing user
        let user = store.findUserByPhone(cleanPhone);
        // 3. Handle Active Multi-Step Conversation Flows (Onboarding, Adding Property, etc.)
        if (session.current_state.startsWith('onboarding_')) {
            return this.handleOnboardingFlow(session, user, text, cleanPhone, msg.senderName);
        }
        if (session.current_state.startsWith('add_property_')) {
            return this.handleAddPropertyFlow(session, user, text);
        }
        // 4. If New User -> Trigger WhatsApp-First Onboarding
        if (!user) {
            session.current_state = 'onboarding_ask_name';
            session.session_data = {
                detected_name: msg.senderName || '',
                phone: cleanPhone
            };
            return {
                recipientPhone: cleanPhone,
                responseText: `👋 *Welcome to Locari Property Management!* 🏠

The complete property operating system built for landlords, diaspora property owners, and managers across Nigeria.

It looks like your phone number isn't registered yet. Let's get you set up in 30 seconds!

*What is your full name?*`
            };
        }
        // Ensure session has user and org linked
        session.user_id = user.id;
        session.org_id = user.org_id;
        // 5. Registered User Command & Natural Language Processing
        return this.handleRegisteredUserCommands(session, user, text, lower, cleanPhone);
    }
    // --- ONBOARDING FLOW ---
    handleOnboardingFlow(session, user, text, cleanPhone, senderName) {
        const now = new Date().toISOString();
        if (session.current_state === 'onboarding_ask_name') {
            session.session_data.full_name = text.trim();
            session.current_state = 'onboarding_ask_role';
            return {
                recipientPhone: cleanPhone,
                responseText: `Nice to meet you, *${session.session_data.full_name}*!

Are you:
1️⃣ *Landlord / Property Owner* (Managing your own properties)
2️⃣ *Independent Property Manager* (Managing on behalf of multiple landlords)

_Reply 1 or 2_`
            };
        }
        if (session.current_state === 'onboarding_ask_role') {
            const isManager = text.includes('2') || text.toLowerCase().includes('manager');
            session.session_data.role = isManager ? 'property_manager' : 'landlord';
            session.current_state = 'onboarding_ask_location';
            return {
                recipientPhone: cleanPhone,
                responseText: `Great! Where are you currently based?

1️⃣ *Nigeria* (Local)
2️⃣ *Diaspora / Abroad* (UK, US, Canada, Europe, UAE, etc.)

_Reply 1 for Nigeria or 2 for Diaspora_`
            };
        }
        if (session.current_state === 'onboarding_ask_location') {
            const isDiaspora = text.includes('2') || text.toLowerCase().includes('diaspora') || text.toLowerCase().includes('abroad');
            session.session_data.is_diaspora = isDiaspora;
            session.session_data.country = isDiaspora ? 'United Kingdom / Overseas' : 'Nigeria';
            session.session_data.timezone = isDiaspora ? 'Europe/London' : 'Africa/Lagos';
            // PROVISION NEW ORGANIZATION & USER
            const orgId = `org-${uuidv4().slice(0, 8)}`;
            const newOrg = {
                id: orgId,
                name: `${session.session_data.full_name}'s Portfolio`,
                slug: `org-${session.session_data.full_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`,
                phone: cleanPhone,
                email: `${cleanPhone.replace(/[^0-9]/g, '')}@locari-pm.internal`,
                address: session.session_data.country,
                currency: 'NGN',
                subscription_plan: 'starter',
                subscription_status: 'active',
                max_units: 20,
                created_at: now,
                updated_at: now
            };
            store.organizations.push(newOrg);
            const userId = `usr-${uuidv4().slice(0, 8)}`;
            const newUser = {
                id: userId,
                org_id: orgId,
                full_name: session.session_data.full_name,
                phone: cleanPhone,
                role: session.session_data.role,
                is_diaspora: isDiaspora,
                country: session.session_data.country,
                timezone: session.session_data.timezone,
                is_active: true,
                created_at: now,
                updated_at: now
            };
            store.users.push(newUser);
            if (session.session_data.role === 'landlord') {
                const lp = {
                    id: `lp-${uuidv4().slice(0, 8)}`,
                    user_id: userId,
                    org_id: orgId,
                    is_diaspora: isDiaspora,
                    residence_country: session.session_data.country,
                    preferred_currency: 'NGN',
                    management_fee_percentage: 10.0,
                    whatsapp_reporting_frequency: 'monthly',
                    created_at: now,
                    updated_at: now
                };
                store.landlordProfiles.push(lp);
            }
            // Generate Magic Link for Web Dashboard
            const tokenString = `magic_${uuidv4().replace(/-/g, '')}`;
            store.magicTokens.push({
                id: uuidv4(),
                token: tokenString,
                user_id: userId,
                org_id: orgId,
                expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
                created_at: now
            });
            const magicLink = `${config.frontendUrl}/auth/magic?token=${tokenString}&phone=${encodeURIComponent(cleanPhone)}`;
            session.user_id = userId;
            session.org_id = orgId;
            session.current_state = 'idle';
            session.session_data = {};
            return {
                recipientPhone: cleanPhone,
                actionTaken: 'user_registered',
                responseText: `🎉 *Congratulations, ${newUser.full_name}!*

Your Locari Property Management workspace has been created successfully.

${isDiaspora ? '🌍 *Diaspora Landlord Mode Activated:* You can monitor rent, approve maintenance work with video proof, and receive monthly statements directly here from wherever you are.\n' : ''}
🖥️ *Your Web Dashboard Link:*
Tap below to open your full desktop control centre (no password required):
${magicLink}

*What would you like to do right now?*
• Reply *'Add Property'* to register your first building
• Reply *'Menu'* to see all available commands`
            };
        }
        return {
            recipientPhone: cleanPhone,
            responseText: "Sorry, I didn't catch that. Reply *'Menu'* to see options."
        };
    }
    // --- REGISTERED USER COMMANDS ---
    handleRegisteredUserCommands(session, user, text, lower, cleanPhone) {
        const org = store.organizations.find(o => o.id === user.org_id);
        const properties = store.getPropertiesByOrg(user.org_id);
        // 1. HELP / MENU
        if (lower === 'menu' || lower === 'help' || lower === 'hi' || lower === 'hello') {
            return {
                recipientPhone: cleanPhone,
                responseText: `🏠 *Locari Property Management Assistant*
Logged in as: *${user.full_name}* (${user.role.toUpperCase()})
Workspace: *${org?.name || 'Locari'}*

*Quick Commands:*
📊 *Overview* - Portfolio occupancy, collected rent, arrears
🏢 *Properties* - List your buildings and vacant units
➕ *Add Property* - Register a new property & units
💰 *Rent* - Check upcoming & overdue rent
🧾 *Record Payment* - Log a rent transfer from a tenant
🔧 *Maintenance* - View repairs & approve contractor quotes
📑 *Report* - Generate this month's landlord payout statement
🖥️ *Dashboard* - Get an instant one-click link to Web Dashboard

_You can also ask in natural English, e.g. "Who is owing rent in Bodija?"_`
            };
        }
        // 2. DASHBOARD LINK
        if (lower.includes('dashboard') || lower.includes('login') || lower.includes('web link')) {
            const tokenString = `magic_${uuidv4().replace(/-/g, '')}`;
            store.magicTokens.push({
                id: uuidv4(),
                token: tokenString,
                user_id: user.id,
                org_id: user.org_id,
                expires_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
                created_at: new Date().toISOString()
            });
            const magicLink = `${config.frontendUrl}/auth/magic?token=${tokenString}&phone=${encodeURIComponent(cleanPhone)}`;
            return {
                recipientPhone: cleanPhone,
                responseText: `🖥️ *Locari Web Dashboard Access*

Tap the secure link below to open your control centre:
${magicLink}

*(Valid on mobile & desktop browsers)*`
            };
        }
        // 3. OVERVIEW / STATUS
        if (lower.includes('overview') || lower.includes('status') || lower.includes('summary')) {
            const allUnits = store.units.filter(u => u.org_id === user.org_id);
            const vacantCount = allUnits.filter(u => u.status === 'vacant').length;
            const occupiedCount = allUnits.filter(u => u.status === 'occupied').length;
            const schedules = store.getRentSchedulesByOrg(user.org_id);
            const totalCollected = schedules.reduce((sum, s) => sum + s.amount_paid, 0);
            const totalOverdue = schedules
                .filter(s => s.status === 'overdue')
                .reduce((sum, s) => sum + s.balance_remaining, 0);
            const pendingMaint = store.getMaintenanceRequestsByOrg(user.org_id)
                .filter(m => m.status !== 'completed' && m.status !== 'rejected').length;
            return {
                recipientPhone: cleanPhone,
                responseText: `📊 *Locari Portfolio Overview*
🏢 Properties: *${properties.length}*
🚪 Total Units: *${allUnits.length}*
✅ Occupied: *${occupiedCount}* | ⭕ Vacant: *${vacantCount}*

💰 *Financial Summary:*
• Total Rent Collected: *₦${totalCollected.toLocaleString()}*
• Total Outstanding Arrears: *₦${totalOverdue.toLocaleString()}*
• Active Maintenance Requests: *${pendingMaint}*

_Reply 'Rent' for overdue details or 'Properties' to view units._`
            };
        }
        // 4. PROPERTIES LIST
        if (lower === 'properties' || lower === 'my properties' || lower === 'buildings') {
            if (properties.length === 0) {
                return {
                    recipientPhone: cleanPhone,
                    responseText: `You haven't added any properties yet.
Reply *'Add Property'* to register your first building!`
                };
            }
            let textOut = `🏢 *Your Properties (${properties.length}):*\n\n`;
            properties.forEach((p, idx) => {
                const units = store.getUnitsByProperty(p.id);
                const vacant = units.filter(u => u.status === 'vacant').length;
                textOut += `*${idx + 1}. ${p.name}*\n`;
                textOut += `📍 ${p.neighborhood}, ${p.city}\n`;
                textOut += `🚪 Units: ${units.length} (${vacant} vacant)\n\n`;
            });
            textOut += `_Reply 'Add Property' to add another, or reply 'Flat 4' to check specific unit details._`;
            return {
                recipientPhone: cleanPhone,
                responseText: textOut
            };
        }
        // 5. ADD PROPERTY FLOW START
        if (lower.startsWith('add property') || lower.startsWith('new property') || lower === 'add') {
            session.current_state = 'add_property_name';
            session.session_data = {};
            return {
                recipientPhone: cleanPhone,
                responseText: `🏢 *Add New Property*

What is the name of this property or building?
*(e.g. Adeleke Royal Court, Grace Court, Sunshine Plaza)*`
            };
        }
        // 6. RENT & ARREARS
        if (lower.includes('rent') || lower.includes('owing') || lower.includes('arrears') || lower.includes('debt')) {
            const schedules = store.getRentSchedulesByOrg(user.org_id);
            const overdue = schedules.filter(s => s.status === 'overdue');
            const pending = schedules.filter(s => s.status === 'pending');
            if (overdue.length === 0 && pending.length === 0) {
                return {
                    recipientPhone: cleanPhone,
                    responseText: `🎉 Excellent news! All rents in your portfolio are fully paid up. No outstanding arrears.`
                };
            }
            let reply = `💰 *Rent Status & Collections:*\n\n`;
            if (overdue.length > 0) {
                reply += `⚠️ *OVERDUE TENANTS (${overdue.length}):*\n`;
                overdue.forEach(o => {
                    const tenant = store.tenants.find(t => t.id === o.tenant_id);
                    const unit = store.units.find(u => u.id === o.unit_id);
                    reply += `• *${tenant?.full_name || 'Tenant'}* (${unit?.unit_number || 'Unit'})\n`;
                    reply += `  Owing: *₦${o.balance_remaining.toLocaleString()}* (Due: ${o.due_date})\n`;
                    reply += `  Phone: ${tenant?.phone || 'N/A'}\n\n`;
                });
            }
            reply += `_To record a collection, reply:_\n*Record Payment [Amount] for [Unit or Tenant]*`;
            return {
                recipientPhone: cleanPhone,
                responseText: reply
            };
        }
        // 7. RECORD PAYMENT
        if (lower.startsWith('record payment') || lower.startsWith('log payment') || lower.startsWith('paid')) {
            // Extract amount using regex
            const matchAmount = text.match(/(\d[\d,\.]+)/);
            const amountVal = matchAmount ? parseFloat(matchAmount[1].replace(/,/g, '')) : 0;
            if (!amountVal) {
                return {
                    recipientPhone: cleanPhone,
                    responseText: `Please specify the amount. Example:\n*Record Payment ₦500,000 for Flat 2*`
                };
            }
            // Check for unit or tenant mention
            const allUnits = store.units.filter(u => u.org_id === user.org_id);
            let matchedUnit = allUnits.find(u => lower.includes(u.unit_number.toLowerCase()));
            if (!matchedUnit && allUnits.length > 0) {
                matchedUnit = allUnits[0]; // fallback
            }
            const newPayment = {
                id: `pay-${uuidv4().slice(0, 8)}`,
                org_id: user.org_id,
                tenant_id: matchedUnit?.current_tenant_id || 'ten-02',
                unit_id: matchedUnit?.id || 'unit-arc-2',
                amount: amountVal,
                payment_date: new Date().toISOString().split('T')[0],
                payment_method: 'bank_transfer',
                bank_reference: `WA-ALERT-${Date.now().toString().slice(-6)}`,
                status: 'reported', // Awaiting verification
                notes: `Reported via WhatsApp by ${user.full_name}`,
                created_at: new Date().toISOString()
            };
            store.paymentRecords.push(newPayment);
            return {
                recipientPhone: cleanPhone,
                actionTaken: 'payment_reported',
                responseText: `🧾 *Payment Report Logged!*
• Amount: *₦${amountVal.toLocaleString()}*
• Unit: *${matchedUnit?.unit_number || 'Flat 2'}*
• Status: *Reported (Pending Bank Verification)*

⚠️ *Integrity Notice:* To protect against fraudulent transfer receipts, the rent ledger will reflect this payment once verified by the property manager or finance officer on the dashboard.`
            };
        }
        // 8. MAINTENANCE & REPAIRS
        if (lower.includes('maintenance') || lower.includes('repair') || lower.includes('workorder')) {
            const maint = store.getMaintenanceRequestsByOrg(user.org_id);
            if (maint.length === 0) {
                return {
                    recipientPhone: cleanPhone,
                    responseText: `✅ No open maintenance requests across your properties.`
                };
            }
            let reply = `🔧 *Maintenance Requests (${maint.length}):*\n\n`;
            maint.forEach(m => {
                const prop = store.properties.find(p => p.id === m.property_id);
                reply += `*#${m.id.slice(-4).toUpperCase()}: ${m.title}*\n`;
                reply += `📍 ${prop?.name} | Priority: *${m.priority.toUpperCase()}*\n`;
                reply += `Status: *${m.status.replace(/_/g, ' ')}*\n`;
                if (m.estimated_cost) {
                    reply += `Cost Estimate: *₦${m.estimated_cost.toLocaleString()}*\n`;
                }
                if (m.status === 'pending_landlord_approval') {
                    reply += `👉 *Action Needed:* Reply *'Approve #${m.id.slice(-4).toUpperCase()}'* to authorize repair.\n`;
                }
                reply += `\n`;
            });
            return {
                recipientPhone: cleanPhone,
                responseText: reply
            };
        }
        // 9. APPROVE REPAIR (Landlord authorization)
        if (lower.startsWith('approve')) {
            const maint = store.getMaintenanceRequestsByOrg(user.org_id)
                .find(m => m.status === 'pending_landlord_approval');
            if (maint) {
                maint.status = 'approved';
                maint.landlord_approved_at = new Date().toISOString();
                return {
                    recipientPhone: cleanPhone,
                    actionTaken: 'maintenance_approved',
                    responseText: `✅ *Expense Approved!*
The repair for *${maint.title}* (₦${maint.estimated_cost?.toLocaleString()}) has been officially authorized.
The property manager and assigned contractor (*${maint.contractor_name || 'Assigned Tech'}*) have been notified to proceed.`
                };
            }
            return {
                recipientPhone: cleanPhone,
                responseText: `No pending maintenance requests requiring your approval were found.`
            };
        }
        // 10. LANDLORD MONTHLY STATEMENT
        if (lower.includes('report') || lower.includes('statement') || lower.includes('remittance')) {
            const reports = store.landlordReports.filter(r => r.org_id === user.org_id);
            const latest = reports[reports.length - 1];
            if (!latest) {
                return {
                    recipientPhone: cleanPhone,
                    responseText: `No landlord remittance reports have been generated yet for this period.`
                };
            }
            return {
                recipientPhone: cleanPhone,
                responseText: `📑 *Monthly Landlord Remittance Statement*
Period: *${latest.month_period}*

💰 Gross Rent Collected: *₦${latest.total_rent_collected.toLocaleString()}*
➖ Management Fee (10%): *₦${latest.agency_commission.toLocaleString()}*
➖ Approved Maintenance: *₦${latest.maintenance_expenses.toLocaleString()}*
━━━━━━━━━━━━━━━━━━━━
💵 *Net Payout to Landlord:* *₦${latest.net_payout_amount.toLocaleString()}*

Bank: *GTBank* (Acc: *******6789)
Summary: ${latest.summary_text}

_Full statement PDF available in your Web Dashboard._`
            };
        }
        // Fallback Natural Query Response
        return {
            recipientPhone: cleanPhone,
            responseText: `I received: "${text}"

I can help you check rent, list properties, track maintenance, or access your dashboard.
Reply *'Menu'* to see all available commands, or *'Dashboard'* to open the web app.`
        };
    }
    // --- ADD PROPERTY MULTI-STEP FLOW ---
    handleAddPropertyFlow(session, user, text) {
        const cleanPhone = session.phone;
        const now = new Date().toISOString();
        if (session.current_state === 'add_property_name') {
            session.session_data.prop_name = text.trim();
            session.current_state = 'add_property_location';
            return {
                recipientPhone: cleanPhone,
                responseText: `Got it: *${session.session_data.prop_name}*.

What neighborhood and city is it located in?
*(e.g. Bodija, Ibadan OR Lekki Phase 1, Lagos)*`
            };
        }
        if (session.current_state === 'add_property_location') {
            session.session_data.prop_location = text.trim();
            session.current_state = 'add_property_units';
            return {
                recipientPhone: cleanPhone,
                responseText: `How many apartment units does *${session.session_data.prop_name}* have?
*(e.g. 4)*`
            };
        }
        if (session.current_state === 'add_property_units') {
            const count = parseInt(text.replace(/[^0-9]/g, '') || '1', 10);
            session.session_data.unit_count = count;
            session.current_state = 'add_property_rent';
            return {
                recipientPhone: cleanPhone,
                responseText: `What is the approximate annual rent per unit in Naira?
*(e.g. 850000 or 1200000)*`
            };
        }
        if (session.current_state === 'add_property_rent') {
            const rentAmount = parseFloat(text.replace(/[^0-9]/g, '') || '800000');
            const propId = `prop-${uuidv4().slice(0, 8)}`;
            const newProperty = {
                id: propId,
                org_id: user.org_id,
                landlord_id: user.role === 'landlord' ? user.id : undefined,
                manager_id: user.role === 'property_manager' ? user.id : undefined,
                name: session.session_data.prop_name,
                property_type: 'multi_family_residential',
                address: session.session_data.prop_location,
                neighborhood: session.session_data.prop_location.split(',')[0]?.trim() || 'Neighborhood',
                city: session.session_data.prop_location.split(',')[1]?.trim() || 'Ibadan',
                state: 'Oyo',
                total_units: session.session_data.unit_count,
                is_managed: true,
                created_at: now,
                updated_at: now
            };
            store.properties.push(newProperty);
            // Auto-generate units
            for (let i = 1; i <= session.session_data.unit_count; i++) {
                const uId = `unit-${uuidv4().slice(0, 8)}`;
                store.units.push({
                    id: uId,
                    org_id: user.org_id,
                    property_id: propId,
                    unit_number: `Flat ${i}`,
                    unit_type: '2/3 Bedroom Apartment',
                    bedrooms: 2,
                    bathrooms: 2,
                    rent_amount: rentAmount,
                    rent_period: 'year',
                    service_charge: Math.round(rentAmount * 0.1),
                    caution_deposit: Math.round(rentAmount * 0.1),
                    legal_and_agency: Math.round(rentAmount * 0.2),
                    status: 'vacant',
                    is_published_to_discovery: false,
                    created_at: now,
                    updated_at: now
                });
            }
            session.current_state = 'idle';
            session.session_data = {};
            return {
                recipientPhone: cleanPhone,
                actionTaken: 'property_created',
                responseText: `🏢 *Property Successfully Created!*

• Name: *${newProperty.name}*
• Location: *${newProperty.address}*
• Total Units: *${newProperty.total_units} units* created (All initially marked *Vacant*)
• Annual Rent: *₦${rentAmount.toLocaleString()}/yr*

✨ *Live Sync Confirmed:* This property and all ${newProperty.total_units} flats are now immediately live on your Web Dashboard!

Reply *'Properties'* to view them, or *'Dashboard'* to open your control centre.`
            };
        }
        return {
            recipientPhone: cleanPhone,
            responseText: "Let's restart. Reply *'Add Property'* when you're ready."
        };
    }
}
export const conversationalEngine = new ConversationalEngine();

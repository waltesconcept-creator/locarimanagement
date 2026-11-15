# Locari Property Management — Operating System 🏠

A complete, standalone property management operating system engineered specifically for **Locari Digital Services** ([locari.africa](https://locari.africa)). Built to empower **property managers, landlords, and overseas diaspora property owners** managing real estate across Nigeria (Ibadan, Lagos, Abuja, and beyond).

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/waltesconcept-creator/locarimanagement)

* **GitHub Repository:** [https://github.com/waltesconcept-creator/locarimanagement](https://github.com/waltesconcept-creator/locarimanagement)
* **1-Click Render Deploy:** [https://render.com/deploy?repo=https://github.com/waltesconcept-creator/locarimanagement](https://render.com/deploy?repo=https://github.com/waltesconcept-creator/locarimanagement)

---

## 🌟 Architecture & Highlights

```
┌─────────────────────────────────────────────────────────────────┐
│                      OPERATIONAL INTERFACES                     │
│                                                                 │
│   📱 WhatsApp Assistant (BotSailor)     🖥️ Web Dashboard (Vite) │
│   • Conversational Onboarding           • Executive Overview    │
│   • Instant Property & Unit Listing     • Unit Catalogs         │
│   • Arrears Queries ("Who is owing?")   • Anti-Fraud Ledger     │
│   • Expense Approvals with Media        • Landlord Statements   │
│   • Magic Link Web Access               • Live Sync Console     │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                     CENTRAL SINGLE SOURCE OF TRUTH              │
│                     Node.js / Express / TypeScript              │
│                                                                 │
│   ├── WhatsApp Provider Adapter (BotSailor & Meta Webhooks)     │
│   ├── Multi-Tenant Context & RBAC Security                      │
│   ├── Rent Schedules & Payment Reconciler (Reported vs Verified)│
│   ├── Diaspora Landlord Engine & Remittance Automation          │
│   └── Modular Bridge to Locari Discovery (locari.africa)        │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                     DATABASE & STORAGE LAYER                    │
│   Supabase PostgreSQL (`migrations/001_initial_pm_schema.sql`)  │
└─────────────────────────────────────────────────────────────────┘
```

1. **Dual-Interface Synchronization:** 
   * Actions taken on WhatsApp (e.g., adding a 4-flat property in Bodija, recording a ₦450k rent transfer, approving a borehole repair) are immediately reflected on the Web Dashboard.
   * Conversely, status updates made on the Web Dashboard are queryable on WhatsApp in real time.
2. **Diaspora & Remote Landlord Hub:**
   * Empowers property owners residing in the UK, USA, Canada, or Europe to monitor their Nigerian properties hands-off.
   * Instant WhatsApp notifications for tenant payments and maintenance tickets with photo/video proofs.
   * Monthly net remittance statements (collected rent − management fee − approved repairs) dispatched automatically.
3. **Frictionless WhatsApp-First Onboarding:**
   * A landlord or manager can start simply by sending a message on WhatsApp.
   * The assistant captures their name, role, and location, provisions their organization workspace, and delivers an instant one-click magic login link for the web dashboard.
4. **Anti-Fraud Payment Integrity Ledger:**
   * Distinguishes **Reported Payment Evidence** (unverified bank transfer alerts or screenshots) from **Verified Reconciliations**.
   * Only verified payments update the tenant's rent balance and generate official receipts (`REC-LOCARI-2026-XXXX`).
5. **Modular Locari Rental Discovery Connector:**
   * Vacant units can be published with one click directly to the `locari.africa` discovery platform without creating architectural coupling.
6. **Authentic Locari Brand Design:**
   * Inherits typography (`Bricolage Grotesque` headings, `Plus Jakarta Sans` body), signature Locari Amber (`#F59E0B`), deep zinc surfaces, and official SVG geometry from `www.locari.africa`.

---

## 📁 Repository Structure

```
Locari Property Management/
├── backend/
│   ├── migrations/
│   │   └── 001_initial_pm_schema.sql  # Complete PostgreSQL / Supabase schema
│   ├── src/
│   │   ├── config/                    # Environment variables & constants
│   │   ├── db/                        # Central store & data structures
│   │   ├── modules/
│   │   │   ├── auth/                  # Magic links & JWT verification
│   │   │   ├── properties/            # Property & unit management
│   │   │   ├── landlords/             # Landlords & diaspora portfolios
│   │   │   ├── tenants/               # Leases, tenancies & arrears
│   │   │   ├── rent/                  # Rent schedules & anti-fraud verification
│   │   │   ├── maintenance/           # Repairs, contractor quotes & approvals
│   │   │   ├── tasks/                 # Team tasks & operational activity
│   │   │   ├── discovery/             # locari.africa vacant listing publisher
│   │   │   └── whatsapp/              # Conversational engine & BotSailor adapter
│   │   └── server.ts                  # Express server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/                # Brand Navbar, Sidebar, LocariLogo SVG
│   │   ├── pages/                     # Overview, Properties, Landlords, Tenants,
│   │   │                              # Rent, Maintenance, Tasks, Simulator, Settings
│   │   ├── services/                  # Backend REST API client
│   │   ├── types/                     # Shared TypeScript interfaces
│   │   ├── App.tsx                    # Main dashboard application
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js             # Locari brand colors & fonts
│   └── vite.config.ts
│
├── BOTSAILOR_INTEGRATION_GUIDE.md     # Detailed BotSailor webhook setup guide
├── DIASPORA_LANDLORD_GUIDE.md         # Remote landlord operational guide
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* Node.js v18+ (tested on Node.js v24)
* npm

### 2. Start Backend Server
```powershell
cd backend
node dist/server.js
```
* **API Health Check:** `http://localhost:4000/health`
* **BotSailor Webhook:** `http://localhost:4000/webhook/botsailor`
* **WhatsApp Simulator Endpoint:** `http://localhost:4000/api/whatsapp/simulate`

### 3. Start Frontend Dashboard
```powershell
cd frontend
npm run dev
```
* **Web Dashboard:** `http://localhost:5173`

---

## 📱 BotSailor Setup Summary

1. In your **BotSailor Dashboard**, create or edit your main WhatsApp flow.
2. Add a **Webhook / HTTP API Card**:
   * **Method:** `POST`
   * **URL:** `https://<YOUR_DEPLOYED_DOMAIN>/webhook/botsailor`
   * **Body (Raw JSON):**
     ```json
     {
       "subscriber_phone": "{{subscriber_phone}}",
       "subscriber_name": "{{subscriber_name}}",
       "message": "{{last_input}}"
     }
     ```
3. Set BotSailor to display the returned `reply_text`.
4. Users can now register, check rent, log payments, and list properties directly inside WhatsApp!

---

## 🛡️ License & Ownership
Engineered as an independent, standalone proprietary system for **Locari Digital Services** ([locari.africa](https://locari.africa)).

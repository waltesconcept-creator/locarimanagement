# Locari PM OS — BotSailor Integration Guide 📱

This guide explains how to connect your active **BotSailor** subscription directly to the **Locari Property Management Central Backend**.

---

## 1. Webhook Endpoint Specification

* **Endpoint URL:** `POST https://<YOUR_DOMAIN>/webhook/botsailor`
* **Local Test URL:** `http://localhost:4000/webhook/botsailor`
* **Authentication:** Handled via phone number identification and optional shared secret.
* **Content-Type:** `application/json`

---

## 2. Inbound Payload Structure (BotSailor -> Locari Backend)

Configure your BotSailor HTTP API card to send:

```json
{
  "subscriber_phone": "{{subscriber_phone}}",
  "subscriber_name": "{{subscriber_name}}",
  "message": "{{last_input}}"
}
```

*Alternative recognized fields:* `phone`, `sender`, `text`, `user_input`, `query`.

---

## 3. Outbound Response Structure (Locari Backend -> BotSailor)

The backend returns a standard JSON response designed for BotSailor:

```json
{
  "status": "1",
  "recipient_phone": "+2348011223344",
  "reply_text": "📊 *Locari Portfolio Overview*\n🏢 Properties: *2*\n🚪 Total Units: *10*...",
  "vars": {
    "locari_reply": "📊 *Locari Portfolio Overview*...",
    "action_taken": "none"
  }
}
```

In BotSailor, simply set your response text message to display `{{reply_text}}` or `{{locari_reply}}`.

---

## 4. Supported Natural Language Capabilities

Your users can interact naturally on WhatsApp without rigid syntax:

| User Intent | Example WhatsApp Messages | Backend Action |
|---|---|---|
| **New User Registration** | `"Hi, I want to manage my property in Bodija"` | Triggers 30-second conversational onboarding (Name, Role, Diaspora/Local), provisions account, and delivers Magic Link. |
| **Portfolio Summary** | `"Overview"`, `"Status"`, `"How are my properties doing?"` | Returns total units, occupancy rate, collected rent, and arrears. |
| **Properties List** | `"Properties"`, `"My buildings"`, `"Show my flats"` | Lists all managed properties with vacant unit counts. |
| **Add Property** | `"Add property"`, `"New compound"` | Initiates guided multi-step building registration and unit creation. |
| **Rent & Arrears** | `"Rent"`, `"Who is owing?"`, `"Arrears"` | Shows all overdue tenants, amounts owing, and due dates. |
| **Record Payment** | `"Record payment ₦450,000 for Flat 2"` | Logs a reported payment awaiting bank reconciliation on the dashboard. |
| **Maintenance Workorders** | `"Maintenance"`, `"Repairs"` | Lists open repair requests and contractor quotes. |
| **Landlord Approvals** | `"Approve repair"`, `"Authorize borehole repair"` | Authorizes pending maintenance expense. |
| **Landlord Statements** | `"Report"`, `"Monthly statement"` | Generates and summarizes monthly net payout. |
| **Web Dashboard Access** | `"Dashboard"`, `"Web link"`, `"Login"` | Generates an instant, secure one-click magic login link. |

---

## 5. Live Simulation Without BotSailor

To test the assistant immediately before configuring webhooks, you can open the **WhatsApp Simulator** inside the Locari Web Dashboard:
1. Start frontend and backend.
2. In the dashboard top bar, click **"WhatsApp Assistant"** or navigate to **"WhatsApp Simulator"** in the sidebar.
3. Select a persona (e.g. Chief Adeleke in the UK or Tunde Balogun in Nigeria) and type any command!

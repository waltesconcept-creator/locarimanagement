const isLocalVite = typeof window !== 'undefined' && window.location.port === '5173';
const API_BASE = isLocalVite ? 'http://localhost:4000/api' : '/api';

export const api = {
  // Properties
  async getProperties() {
    const res = await fetch(`${API_BASE}/properties`);
    return res.json();
  },

  async createProperty(data: any) {
    const res = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateUnit(unitId: string, data: any) {
    const res = await fetch(`${API_BASE}/properties/units/${unitId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Landlords
  async getLandlords() {
    const res = await fetch(`${API_BASE}/landlords`);
    return res.json();
  },

  async generateLandlordStatement(landlordId: string, monthPeriod?: string) {
    const res = await fetch(`${API_BASE}/landlords/${landlordId}/statement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month_period: monthPeriod })
    });
    return res.json();
  },

  // Tenants
  async getTenants() {
    const res = await fetch(`${API_BASE}/tenants`);
    return res.json();
  },

  async createTenant(data: any) {
    const res = await fetch(`${API_BASE}/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Rent & Payments
  async getRentSchedules() {
    const res = await fetch(`${API_BASE}/rent/schedules`);
    return res.json();
  },

  async getPayments() {
    const res = await fetch(`${API_BASE}/rent/payments`);
    return res.json();
  },

  async verifyPayment(paymentId: string) {
    const res = await fetch(`${API_BASE}/rent/payments/${paymentId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    return res.json();
  },

  async rejectPayment(paymentId: string, reason: string) {
    const res = await fetch(`${API_BASE}/rent/payments/${paymentId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    return res.json();
  },

  // Maintenance
  async getMaintenance() {
    const res = await fetch(`${API_BASE}/maintenance`);
    return res.json();
  },

  async createMaintenance(data: any) {
    const res = await fetch(`${API_BASE}/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async approveMaintenance(id: string) {
    const res = await fetch(`${API_BASE}/maintenance/${id}/approve`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async completeMaintenance(id: string, actualCost: number) {
    const res = await fetch(`${API_BASE}/maintenance/${id}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actual_cost: actualCost })
    });
    return res.json();
  },

  // Tasks
  async getTasks() {
    const res = await fetch(`${API_BASE}/tasks`);
    return res.json();
  },

  async createTask(data: any) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateTaskStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Locari Rental Discovery Modular Connector
  async togglePublishToDiscovery(unitId: string) {
    const res = await fetch(`${API_BASE}/discovery/toggle-publish/${unitId}`, {
      method: 'POST'
    });
    return res.json();
  },

  // WhatsApp Simulator
  async simulateWhatsAppMessage(fromPhone: string, messageText: string, senderName?: string) {
    const res = await fetch(`${API_BASE}/whatsapp/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromPhone, messageText, senderName })
    });
    return res.json();
  }
};

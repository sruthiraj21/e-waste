// Client API Service for EcoCycle
const BASE_URL = '/api';

export const api = {
  // Authentication
  async login(email, role = 'USER') {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role })
    });
    return res.json();
  },

  async register(data) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getCurrentUser(userId) {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'x-user-id': userId }
    });
    return res.json();
  },

  // AI Classification
  async classifyImage(formData) {
    const res = await fetch(`${BASE_URL}/ai/classify`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  // E-Waste Items
  async getEwasteItems(userId) {
    const res = await fetch(`${BASE_URL}/ewaste?userId=${userId}`);
    return res.json();
  },

  async createEwasteItem(data, userId) {
    const res = await fetch(`${BASE_URL}/ewaste`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': userId 
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Collectors
  async getCollectors() {
    const res = await fetch(`${BASE_URL}/collectors`);
    return res.json();
  },

  async toggleCollectorAvailability(collectorId, available) {
    const res = await fetch(`${BASE_URL}/collectors/${collectorId}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available })
    });
    return res.json();
  },

  async verifyCollector(collectorId, verification_status) {
    const res = await fetch(`${BASE_URL}/collectors/${collectorId}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verification_status })
    });
    return res.json();
  },

  // Pickups
  async getPickups(filter = {}) {
    const query = new URLSearchParams(filter).toString();
    const res = await fetch(`${BASE_URL}/pickups?${query}`);
    return res.json();
  },

  async schedulePickup(data) {
    const res = await fetch(`${BASE_URL}/pickups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updatePickupStatus(pickupId, status) {
    const res = await fetch(`${BASE_URL}/pickups/${pickupId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Certificates
  async getCertificates(userId) {
    const res = await fetch(`${BASE_URL}/certificates?userId=${userId}`);
    return res.json();
  },

  async getCertificateById(id) {
    const res = await fetch(`${BASE_URL}/certificates/${id}`);
    return res.json();
  },

  // Rewards & Notifications
  async getRewards(userId) {
    const res = await fetch(`${BASE_URL}/rewards?userId=${userId}`);
    return res.json();
  },

  async getNotifications(userId) {
    const res = await fetch(`${BASE_URL}/notifications?userId=${userId}`);
    return res.json();
  },

  async markNotificationRead(id) {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH'
    });
    return res.json();
  },

  // Admin Stats
  async getAdminStats() {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    return res.json();
  }
};

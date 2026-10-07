// Base API endpoint:
// In Development: Uses '/api' through Vite local proxy (http://localhost:5000)
// In Production: Uses VITE_API_URL if configured on Vercel
const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const BASE_URL = rawApiUrl 
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, '')}/api`) 
  : '/api';

function getAuthHeaders(extraHeaders = {}) {
  const token = localStorage.getItem('ecocycle_token');
  const headers = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Status
  async getStatus() {
    const res = await fetch(`${BASE_URL}/status`);
    return res.json();
  },

  // Authentication
  async login(email, password = 'EcoCyclePass2026!') {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('ecocycle_token', data.token);
    }
    return data;
  },

  async register(data) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (resData.token) {
      localStorage.setItem('ecocycle_token', resData.token);
    }
    return resData;
  },

  async getCurrentUser(userId) {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders({ 'x-user-id': userId })
    });
    return res.json();
  },

  // AI Classification with Supabase Storage upload
  async classifyImage(formData) {
    const res = await fetch(`${BASE_URL}/ai/classify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData
    });
    return res.json();
  },

  // E-Waste Items
  async getEwasteItems(userId) {
    const query = userId ? `?userId=${userId}` : '';
    const res = await fetch(`${BASE_URL}/ewaste${query}`, {
      headers: getAuthHeaders({ 'x-user-id': userId })
    });
    return res.json();
  },

  async createEwasteItem(data, userId) {
    const res = await fetch(`${BASE_URL}/ewaste`, {
      method: 'POST',
      headers: getAuthHeaders({ 
        'Content-Type': 'application/json',
        'x-user-id': userId 
      }),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Collectors
  async getCollectors() {
    const res = await fetch(`${BASE_URL}/collectors`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async toggleCollectorAvailability(collectorId, available) {
    const res = await fetch(`${BASE_URL}/collectors/${collectorId}/availability`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ available })
    });
    return res.json();
  },

  async verifyCollector(collectorId, verification_status) {
    const res = await fetch(`${BASE_URL}/collectors/${collectorId}/verify`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ verification_status })
    });
    return res.json();
  },

  // Pickups
  async getPickups(filter = {}) {
    const query = new URLSearchParams(filter).toString();
    const res = await fetch(`${BASE_URL}/pickups?${query}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async schedulePickup(data) {
    const res = await fetch(`${BASE_URL}/pickups`, {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updatePickupStatus(pickupId, status) {
    const res = await fetch(`${BASE_URL}/pickups/${pickupId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Certificates
  async getCertificates(userId) {
    const query = userId ? `?userId=${userId}` : '';
    const res = await fetch(`${BASE_URL}/certificates${query}`, {
      headers: getAuthHeaders({ 'x-user-id': userId })
    });
    return res.json();
  },

  async getCertificateById(id) {
    const res = await fetch(`${BASE_URL}/certificates/${id}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Rewards & Notifications
  async getRewards(userId) {
    const query = userId ? `?userId=${userId}` : '';
    const res = await fetch(`${BASE_URL}/rewards${query}`, {
      headers: getAuthHeaders({ 'x-user-id': userId })
    });
    return res.json();
  },

  async getNotifications(userId) {
    const query = userId ? `?userId=${userId}` : '';
    const res = await fetch(`${BASE_URL}/notifications${query}`, {
      headers: getAuthHeaders({ 'x-user-id': userId })
    });
    return res.json();
  },

  async markNotificationRead(id) {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Admin Stats
  async getAdminStats() {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return res.json();
  }
};

// Base API endpoint:
// In Development: Uses '/api' through Vite local proxy (http://localhost:5000)
// In Production: Uses VITE_API_URL if configured on Vercel
const rawApiUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ? import.meta.env.VITE_API_URL.trim() : '';
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

export const DEFAULT_DEMO_STATS = {
  totalUsers: 142,
  verifiedCollectors: 3,
  pendingCollectors: 0,
  totalPickups: 8,
  totalRecycledWeightKg: 28.5,
  totalCo2AvoidedKg: 49.8,
  categoryBreakdown: [
    { name: 'Computers/Laptops', value: 42 },
    { name: 'Mobile Devices', value: 28 },
    { name: 'TVs/Monitors', value: 16 },
    { name: 'Small Appliances', value: 9 },
    { name: 'Other Electronics', value: 5 }
  ],
  monthlyTrend: [
    { month: 'Jan', weight: 8.2, pickups: 5 },
    { month: 'Feb', weight: 11.4, pickups: 8 },
    { month: 'Mar', weight: 14.7, pickups: 12 },
    { month: 'Apr', weight: 18.3, pickups: 15 },
    { month: 'May', weight: 21.6, pickups: 19 },
    { month: 'Jun', weight: 25.1, pickups: 24 }
  ],
  statusDistribution: [
    { status: 'REQUESTED', count: 1 },
    { status: 'ACCEPTED', count: 2 },
    { status: 'ON_THE_WAY', count: 1 },
    { status: 'COLLECTED', count: 2 },
    { status: 'RECYCLED', count: 2 }
  ]
};

export const DEFAULT_DEMO_COLLECTORS = [
  {
    id: 'col_rec_1',
    profile_id: 'col_vikram_201',
    business_name: 'GreenCycle Services',
    verification_status: 'VERIFIED',
    rating: 4.8,
    reviews_count: 342,
    available: true,
    service_area: 'Indiranagar, Koramangala & HSR, Bengaluru',
    distance_km: 2.4,
    eta_text: '30–45 mins',
    badges: ['Zero-Emission EV', 'ISO 14001 Certified', 'Digital Custody Seal']
  },
  {
    id: 'col_rec_2',
    profile_id: 'col_vikram_201',
    business_name: 'EcoVan Bangalore',
    verification_status: 'VERIFIED',
    rating: 4.7,
    reviews_count: 198,
    available: true,
    service_area: 'Whitefield & Marathahalli, Bengaluru',
    distance_km: 3.8,
    eta_text: 'Today 4:00 PM',
    badges: ['R2 Certified', 'Solar EV Fleet']
  },
  {
    id: 'col_rec_3',
    profile_id: 'col_vikram_201',
    business_name: 'Urban Green Hub',
    verification_status: 'VERIFIED',
    rating: 4.9,
    reviews_count: 512,
    available: true,
    service_area: 'Jayanagar & JP Nagar, Bengaluru',
    distance_km: 1.9,
    eta_text: 'Tomorrow 9:00 AM',
    badges: ['Govt Authorized Foundry', 'Zero-Landfill Seal']
  }
];

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
    try {
      const res = await fetch(`${BASE_URL}/collectors`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch (e) {
      console.warn('Network issue fetching collectors, using demo collectors:', e);
    }
    return DEFAULT_DEMO_COLLECTORS;
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
    try {
      const res = await fetch(`${BASE_URL}/collectors/${collectorId}/verify`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ verification_status })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Failed to persist verification status remotely:', e);
    }
    return { id: collectorId, verification_status };
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
    try {
      const res = await fetch(`${BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          return {
            ...DEFAULT_DEMO_STATS,
            ...data,
            categoryBreakdown: (Array.isArray(data.categoryBreakdown) && data.categoryBreakdown.length > 0)
              ? data.categoryBreakdown
              : DEFAULT_DEMO_STATS.categoryBreakdown,
            monthlyTrend: (Array.isArray(data.monthlyTrend) && data.monthlyTrend.length > 0)
              ? data.monthlyTrend
              : DEFAULT_DEMO_STATS.monthlyTrend
          };
        }
      }
    } catch (e) {
      console.warn('Network issue fetching admin stats, using demo stats:', e);
    }
    return DEFAULT_DEMO_STATS;
  }
};

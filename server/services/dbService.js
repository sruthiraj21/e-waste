import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/store.json');

// Check for live Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase = null;
if (supabaseUrl && supabaseKey && supabaseUrl !== 'YOUR_SUPABASE_URL') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Connected to live Supabase backend at:', supabaseUrl);
  } catch (e) {
    console.warn('Could not initialize Supabase client:', e.message);
  }
}

// Initial Realistic Indian Context Seed Data
const INITIAL_DATA = {
  profiles: [
    {
      id: 'usr_sruthi_101',
      full_name: 'Sruthi Sundaram',
      email: 'sruthi@ecocycle.in',
      phone: '+91 98450 12345',
      role: 'USER',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      address: 'Flat 402, Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      green_points: 450,
      recycled_kg: 12.5,
      co2_avoided_kg: 8.2,
      pickups_count: 6,
      rank: 'Eco Warrior (Tier 4)',
      created_at: '2026-08-15T10:00:00Z'
    },
    {
      id: 'col_vikram_201',
      full_name: 'Vikram Sharma',
      email: 'vikram@greencycle.in',
      phone: '+91 98860 98765',
      role: 'COLLECTOR',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      address: 'Plot 12, Industrial Area, Koramangala',
      city: 'Bengaluru',
      created_at: '2026-07-01T09:00:00Z'
    },
    {
      id: 'adm_aisha_301',
      full_name: 'Aisha Rao',
      email: 'aisha@ecocycle.in',
      phone: '+91 97410 54321',
      role: 'ADMIN',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      address: 'EcoCycle HQ, Indiranagar',
      city: 'Bengaluru',
      created_at: '2026-06-01T08:00:00Z'
    }
  ],
  collectors: [
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
      badges: ['Zero-Emission EV', 'ISO 14001 Certified', 'Digital Custody Seal'],
      latitude: 12.9716,
      longitude: 77.5946,
      supported_categories: ['Computer Equipment', 'Mobile Phones', 'Home Appliances', 'Cables & Accessories'],
      completed_pickups: 184,
      total_earnings: 48500
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
      badges: ['R2 Certified', 'Solar EV Fleet'],
      latitude: 12.9698,
      longitude: 77.7499,
      supported_categories: ['Computer Equipment', 'Mobile Phones', 'Peripherals'],
      completed_pickups: 112,
      total_earnings: 31200
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
      badges: ['Govt Authorized Foundry', 'Zero-Landfill Seal'],
      latitude: 12.9250,
      longitude: 77.5938,
      supported_categories: ['Computer Equipment', 'Home Appliances', 'Cables & Accessories'],
      completed_pickups: 320,
      total_earnings: 94000
    }
  ],
  ewaste_items: [
    {
      id: 'item_laptop_01',
      user_id: 'usr_sruthi_101',
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      device_name: 'MacBook Pro 14"',
      category: 'Computer Equipment',
      condition: 'Grade B+ (Functional with minor casing wear)',
      confidence: 94,
      estimated_value: 1200,
      estimated_weight: 2.4,
      ai_result: {
        recoveryYield: '89%',
        gold: '0.034g',
        copper: '14.2g',
        specs: 'Aluminum Unibody Chassis • Core i7 / M1 Pro',
        hazardStatus: 'Zero Hazardous Leaks'
      },
      status: 'IN_TRANSIT',
      created_at: '2026-10-06T08:30:00Z'
    },
    {
      id: 'item_iphone_02',
      user_id: 'usr_sruthi_101',
      image_url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80',
      device_name: 'iPhone 13 Pro',
      category: 'Mobile Phones',
      condition: 'Grade A- (Motherboard intact)',
      confidence: 96,
      estimated_value: 950,
      estimated_weight: 0.24,
      ai_result: {
        recoveryYield: '93%',
        gold: '0.024g',
        copper: '8.6g'
      },
      status: 'RECYCLED',
      created_at: '2026-10-05T14:15:00Z'
    },
    {
      id: 'item_headphone_03',
      user_id: 'usr_sruthi_101',
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      device_name: 'Sony WH-1000XM4',
      category: 'Peripherals',
      condition: 'Refurbished Grade B',
      confidence: 92,
      estimated_value: 700,
      estimated_weight: 0.35,
      status: 'RECYCLED',
      created_at: '2026-10-01T11:20:00Z'
    },
    {
      id: 'item_charger_04',
      user_id: 'usr_sruthi_101',
      image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
      device_name: 'Dell XPS 15 Charger',
      category: 'Cables & Accessories',
      condition: 'Pure Copper Harvested',
      confidence: 97,
      estimated_value: 220,
      estimated_weight: 0.45,
      status: 'RECYCLED',
      created_at: '2026-09-24T16:00:00Z'
    }
  ],
  pickups: [
    {
      id: 'pku_active_8954',
      user_id: 'usr_sruthi_101',
      collector_id: 'col_rec_1',
      ewaste_item_id: 'item_laptop_01',
      pickup_address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103',
      scheduled_date: '2026-10-07',
      scheduled_time: 'Today, 3:30 PM',
      status: 'ON_THE_WAY', // REQUESTED -> ACCEPTED -> COLLECTOR_ASSIGNED -> ON_THE_WAY -> COLLECTED -> RECYCLED
      status_note: 'Courier en route to Valo Foundry • 70% complete • ETA 25 mins',
      progress_percent: 70,
      tracking_id: 'EC-8954-BLR',
      user_lat: 12.9352,
      user_lng: 77.6245,
      collector_lat: 12.9510,
      collector_lng: 77.6180,
      created_at: '2026-10-07T09:00:00Z',
      updated_at: '2026-10-07T10:30:00Z'
    }
  ],
  rewards: [
    {
      id: 'rew_1',
      user_id: 'usr_sruthi_101',
      points: 100,
      reason: 'iPhone 13 Pro Melt & Recovery Cycle Complete',
      created_at: '2026-10-06T18:00:00Z'
    },
    {
      id: 'rew_2',
      user_id: 'usr_sruthi_101',
      points: 150,
      reason: 'Sony WH-1000XM4 Refurbished & Re-homed',
      created_at: '2026-10-02T12:00:00Z'
    },
    {
      id: 'rew_3',
      user_id: 'usr_sruthi_101',
      points: 50,
      reason: 'Dell XPS Charger Copper Harvested',
      created_at: '2026-09-25T17:00:00Z'
    }
  ],
  certificates: [
    {
      id: 'cert_89120',
      user_id: 'usr_sruthi_101',
      pickup_id: 'pku_completed_legacy',
      certificate_number: 'CERT-EC-2026-89120-BLR',
      device_name: 'iPhone 13 Pro (128GB Midnight)',
      batch_id: 'Batch #89120',
      foundry_name: 'Valo CleanMetallurgy & EcoCycle Zurich Partner',
      recycled_weight: 2.4,
      co2_avoided: 1.8,
      water_saved_liters: 320,
      green_points_added: 100,
      gold_recovered_grams: '0.034g 24K Gold',
      copper_recovered_grams: '14.2g Pure Copper',
      verification_status: '100% Chain-of-Custody Verified',
      rank_unlocked: 'Eco Warrior Rank (Tier 4)',
      issued_at: '2026-10-06T18:05:00Z'
    }
  ],
  notifications: [
    {
      id: 'notif_1',
      user_id: 'usr_sruthi_101',
      title: 'Courier on the way 🛵',
      message: 'Vikram from GreenCycle Services is arriving in ~25 mins for your MacBook Pro.',
      read: false,
      created_at: '2026-10-07T10:30:00Z'
    },
    {
      id: 'notif_2',
      user_id: 'usr_sruthi_101',
      title: 'Certificate Ready 🌱',
      message: 'Recycling certificate CERT-EC-2026-89120 is verified and ready to view.',
      read: true,
      created_at: '2026-10-06T18:10:00Z'
    }
  ]
};

// In-Memory store initialized from disk or defaults
class DatabaseService {
  constructor() {
    this.ensureDataDir();
    this.data = this.loadData();
  }

  ensureDataDir() {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  loadData() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(content);
      }
    } catch (e) {
      console.warn('Error reading store file, resetting to defaults:', e.message);
    }
    this.saveData(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }

  saveData(data) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving store file:', e.message);
    }
  }

  persist() {
    this.saveData(this.data);
  }

  // --- PROFILES / USERS ---
  findProfileByEmail(email) {
    return this.data.profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
  }

  findProfileById(id) {
    return this.data.profiles.find(p => p.id === id);
  }

  createProfile(profile) {
    const newProfile = {
      id: profile.id || `usr_${Date.now()}`,
      full_name: profile.full_name || 'EcoCycle Member',
      email: profile.email,
      phone: profile.phone || '+91 98000 00000',
      role: profile.role || 'USER',
      avatar_url: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      address: profile.address || 'Bengaluru, India',
      city: profile.city || 'Bengaluru',
      green_points: 50,
      recycled_kg: 0,
      co2_avoided_kg: 0,
      pickups_count: 0,
      rank: 'Eco Starter (Tier 1)',
      created_at: new Date().toISOString()
    };
    this.data.profiles.push(newProfile);
    this.persist();
    return newProfile;
  }

  updateProfile(id, updates) {
    const idx = this.data.profiles.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.profiles[idx] = { ...this.data.profiles[idx], ...updates };
      this.persist();
      return this.data.profiles[idx];
    }
    return null;
  }

  // --- COLLECTORS ---
  getCollectors() {
    return this.data.collectors;
  }

  getCollectorById(id) {
    return this.data.collectors.find(c => c.id === id || c.profile_id === id);
  }

  updateCollector(id, updates) {
    const idx = this.data.collectors.findIndex(c => c.id === id || c.profile_id === id);
    if (idx !== -1) {
      this.data.collectors[idx] = { ...this.data.collectors[idx], ...updates };
      this.persist();
      return this.data.collectors[idx];
    }
    return null;
  }

  // --- EWASTE ITEMS ---
  getEwasteItems(userId) {
    if (userId) {
      return this.data.ewaste_items.filter(item => item.user_id === userId);
    }
    return this.data.ewaste_items;
  }

  createEwasteItem(item) {
    const newItem = {
      id: `item_${Date.now()}`,
      user_id: item.user_id || 'usr_sruthi_101',
      image_url: item.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      device_name: item.device_name || 'Electronic Device',
      category: item.category || 'Computer Equipment',
      condition: item.condition || 'Grade B+ (Verified)',
      confidence: item.confidence || 94,
      estimated_value: item.estimated_value || 1200,
      estimated_weight: item.estimated_weight || 2.4,
      ai_result: item.ai_result || {},
      status: 'SUBMITTED',
      created_at: new Date().toISOString()
    };
    this.data.ewaste_items.unshift(newItem);
    this.persist();
    return newItem;
  }

  // --- PICKUPS & LIFECYCLE ---
  getPickups(filter = {}) {
    let list = this.data.pickups;
    if (filter.user_id) {
      list = list.filter(p => p.user_id === filter.user_id);
    }
    if (filter.collector_id) {
      list = list.filter(p => p.collector_id === filter.collector_id);
    }
    return list.map(p => this.populatePickup(p));
  }

  populatePickup(pickup) {
    const user = this.data.profiles.find(u => u.id === pickup.user_id);
    const collector = this.data.collectors.find(c => c.id === pickup.collector_id);
    const item = this.data.ewaste_items.find(i => i.id === pickup.ewaste_item_id);
    return {
      ...pickup,
      user: user || null,
      collector: collector || null,
      item: item || null
    };
  }

  createPickup(params) {
    const newPickup = {
      id: `pku_${Date.now()}`,
      tracking_id: `EC-${Math.floor(1000 + Math.random() * 9000)}-BLR`,
      user_id: params.user_id || 'usr_sruthi_101',
      collector_id: params.collector_id || 'col_rec_1',
      ewaste_item_id: params.ewaste_item_id,
      pickup_address: params.pickup_address || 'Flat 402, Bellandur, Bengaluru',
      scheduled_date: params.scheduled_date || new Date().toISOString().split('T')[0],
      scheduled_time: params.scheduled_time || 'Today, 4:00 PM',
      status: 'REQUESTED',
      status_note: 'Pickup requested. Matching with certified collector.',
      progress_percent: 15,
      user_lat: 12.9352,
      user_lng: 77.6245,
      collector_lat: 12.9716,
      collector_lng: 77.5946,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.pickups.unshift(newPickup);

    // Update item status
    const itemIdx = this.data.ewaste_items.findIndex(i => i.id === params.ewaste_item_id);
    if (itemIdx !== -1) {
      this.data.ewaste_items[itemIdx].status = 'SCHEDULED';
    }

    // Add notification
    this.addNotification(newPickup.user_id, 'Pickup Scheduled', `Your pickup ${newPickup.tracking_id} has been booked.`);

    this.persist();
    return this.populatePickup(newPickup);
  }

  updatePickupStatus(pickupId, newStatus) {
    const idx = this.data.pickups.findIndex(p => p.id === pickupId || p.tracking_id === pickupId);
    if (idx === -1) return null;

    const pickup = this.data.pickups[idx];
    pickup.status = newStatus;
    pickup.updated_at = new Date().toISOString();

    let note = '';
    let progress = 20;

    switch (newStatus) {
      case 'ACCEPTED':
        note = 'Collector accepted pickup. Verifying vehicle dispatch.';
        progress = 35;
        break;
      case 'COLLECTOR_ASSIGNED':
        note = 'Collector vehicle dispatched. On route to your doorstep.';
        progress = 50;
        break;
      case 'ON_THE_WAY':
        note = 'Collector en route to pickup point. ETA 20-30 mins.';
        progress = 70;
        break;
      case 'COLLECTED':
        note = 'E-waste collected and scanned. Secure transit to foundry.';
        progress = 85;
        // Update item status
        const itemIdx = this.data.ewaste_items.findIndex(i => i.id === pickup.ewaste_item_id);
        if (itemIdx !== -1) this.data.ewaste_items[itemIdx].status = 'COLLECTED';
        break;
      case 'RECYCLED':
        note = 'Melt & recovery cycle complete. Environmental impact certified.';
        progress = 100;
        // Handle recycling completion rewards and certificate!
        this.completeRecycling(pickup);
        break;
      default:
        note = `Status updated to ${newStatus}`;
    }

    pickup.status_note = note;
    pickup.progress_percent = progress;
    this.persist();

    return this.populatePickup(pickup);
  }

  completeRecycling(pickup) {
    const item = this.data.ewaste_items.find(i => i.id === pickup.ewaste_item_id) || {
      device_name: 'Electronic Device',
      estimated_weight: 2.4,
      category: 'Computer Equipment'
    };

    if (item) item.status = 'RECYCLED';

    const weight = Number(item.estimated_weight) || 2.4;
    const co2 = Number((weight * 1.75).toFixed(1));
    const pointsAwarded = Math.round(weight * 40) + 20;

    // 1. Add reward record
    const reward = {
      id: `rew_${Date.now()}`,
      user_id: pickup.user_id,
      points: pointsAwarded,
      reason: `${item.device_name} Melt & Recovery Cycle Complete`,
      created_at: new Date().toISOString()
    };
    this.data.rewards.unshift(reward);

    // 2. Generate Certificate
    const certNum = `CERT-EC-2026-${Math.floor(10000 + Math.random() * 90000)}-BLR`;
    const cert = {
      id: `cert_${Date.now()}`,
      user_id: pickup.user_id,
      pickup_id: pickup.id,
      certificate_number: certNum,
      device_name: item.device_name,
      batch_id: `Batch #${Math.floor(80000 + Math.random() * 10000)}`,
      foundry_name: 'Valo CleanMetallurgy & EcoCycle Zurich Partner',
      recycled_weight: weight,
      co2_avoided: co2,
      water_saved_liters: Math.round(weight * 133),
      green_points_added: pointsAwarded,
      gold_recovered_grams: `${(weight * 0.014).toFixed(3)}g 24K Gold`,
      copper_recovered_grams: `${(weight * 5.9).toFixed(1)}g Pure Copper`,
      verification_status: '100% Chain-of-Custody Verified',
      rank_unlocked: 'Eco Warrior Rank (Tier 4)',
      issued_at: new Date().toISOString()
    };
    this.data.certificates.unshift(cert);

    // 3. Update User profile metrics
    const user = this.data.profiles.find(u => u.id === pickup.user_id);
    if (user) {
      user.green_points = (user.green_points || 0) + pointsAwarded;
      user.recycled_kg = Number(((user.recycled_kg || 0) + weight).toFixed(1));
      user.co2_avoided_kg = Number(((user.co2_avoided_kg || 0) + co2).toFixed(1));
      user.pickups_count = (user.pickups_count || 0) + 1;
      if (user.green_points >= 500) user.rank = 'Planet Protector (Tier 5)';
      else if (user.green_points >= 300) user.rank = 'Eco Warrior (Tier 4)';
    }

    // 4. Update collector metrics
    const collector = this.data.collectors.find(c => c.id === pickup.collector_id);
    if (collector) {
      collector.completed_pickups = (collector.completed_pickups || 0) + 1;
      collector.total_earnings = (collector.total_earnings || 0) + (item.estimated_value || 800);
    }

    // 5. Send notification
    this.addNotification(
      pickup.user_id,
      'Recycling Completed! 🌱',
      `Your ${item.device_name} has been responsibly recycled. +${pointsAwarded} Green Points credited!`
    );
  }

  // --- CERTIFICATES ---
  getCertificates(userId) {
    if (userId) {
      return this.data.certificates.filter(c => c.user_id === userId);
    }
    return this.data.certificates;
  }

  getCertificateById(id) {
    return this.data.certificates.find(c => c.id === id || c.certificate_number === id);
  }

  // --- REWARDS & NOTIFICATIONS ---
  getRewards(userId) {
    if (userId) return this.data.rewards.filter(r => r.user_id === userId);
    return this.data.rewards;
  }

  getNotifications(userId) {
    if (userId) return this.data.notifications.filter(n => n.user_id === userId);
    return this.data.notifications;
  }

  addNotification(userId, title, message) {
    const notif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      user_id: userId,
      title,
      message,
      read: false,
      created_at: new Date().toISOString()
    };
    this.data.notifications.unshift(notif);
    this.persist();
    return notif;
  }

  markNotificationRead(id) {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.persist();
    }
    return notif;
  }

  // --- ADMIN ANALYTICS ---
  getAdminStats() {
    const totalUsers = this.data.profiles.length;
    const verifiedCollectors = this.data.collectors.filter(c => c.verification_status === 'VERIFIED').length;
    const pendingCollectors = this.data.collectors.filter(c => c.verification_status === 'PENDING').length;
    const totalPickups = this.data.pickups.length;
    
    let totalWeight = 0;
    let totalCo2 = 0;
    const categoryCounts = {};

    this.data.ewaste_items.forEach(item => {
      totalWeight += Number(item.estimated_weight) || 0;
      const cat = item.category || 'Other';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    totalCo2 = Number((totalWeight * 1.75).toFixed(1));

    const categoryBreakdown = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));

    const monthlyTrend = [
      { month: 'Jun', weight: 45, pickups: 12 },
      { month: 'Jul', weight: 85, pickups: 24 },
      { month: 'Aug', weight: 140, pickups: 38 },
      { month: 'Sep', weight: 210, pickups: 55 },
      { month: 'Oct', weight: 285, pickups: 78 }
    ];

    const statusDistribution = [
      { status: 'REQUESTED', count: this.data.pickups.filter(p => p.status === 'REQUESTED').length },
      { status: 'ACCEPTED', count: this.data.pickups.filter(p => p.status === 'ACCEPTED').length },
      { status: 'ON_THE_WAY', count: this.data.pickups.filter(p => p.status === 'ON_THE_WAY').length },
      { status: 'COLLECTED', count: this.data.pickups.filter(p => p.status === 'COLLECTED').length },
      { status: 'RECYCLED', count: this.data.pickups.filter(p => p.status === 'RECYCLED').length }
    ];

    return {
      totalUsers,
      verifiedCollectors,
      pendingCollectors,
      totalPickups,
      totalRecycledWeightKg: Number(totalWeight.toFixed(1)),
      totalCo2AvoidedKg: totalCo2,
      categoryBreakdown,
      monthlyTrend,
      statusDistribution
    };
  }
}

export const db = new DatabaseService();

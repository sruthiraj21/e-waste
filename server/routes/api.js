import express from 'express';
import multer from 'multer';
import { db } from '../services/dbService.js';
import { classifyEwasteImage } from '../utils/aiClassifier.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 15 * 1024 * 1024 } }); // 15MB limit

// --- CONNECTION STATUS CHECK ---
router.get('/status', async (req, res) => {
  const isSupabaseConfigured = db.isConfigured();
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'your-gemini-api-key');

  let dbReachable = false;
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await db.supabase.from('profiles').select('id').limit(1);
      dbReachable = !error;
    } catch (e) {
      dbReachable = false;
    }
  }

  res.json({
    supabase: {
      configured: isSupabaseConfigured,
      reachable: dbReachable,
      url: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace(/^(https?:\/\/[^/]+).*$/, '$1') : 'not set',
      storageBucket: 'ewaste-images'
    },
    gemini: {
      configured: hasGeminiKey,
      model: 'gemini-1.5-flash',
      mode: hasGeminiKey ? 'LIVE_GEMINI_VISION' : 'LOCAL_NEURAL_FALLBACK'
    }
  });
});

// --- SUPABASE AUTHENTICATION ---
router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, full_name, role, phone, address, city, avatar_url } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await db.signUp(email, password, {
      full_name,
      role: role || 'USER',
      phone,
      address,
      city,
      avatar_url
    });

    res.json(result);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await db.signIn(email, password);
    res.json(result);
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ error: err.message || 'Authentication failed' });
  }
});

router.get('/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const userId = req.headers['x-user-id'] || 'usr_sruthi_101';

    let user = null;
    if (token) {
      user = await db.getUserByToken(token);
    }
    if (!user && userId) {
      user = await db.findProfileById(userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- AI CLASSIFICATION & SUPABASE STORAGE ---
router.post('/ai/classify', upload.single('image'), async (req, res) => {
  try {
    let buffer = null;
    let mimeType = 'image/jpeg';
    let filename = '';
    let storageUrl = null;

    if (req.file) {
      buffer = req.file.buffer;
      mimeType = req.file.mimetype;
      filename = req.file.originalname;

      // 1. Upload directly to Supabase Storage if configured!
      storageUrl = await db.uploadEwasteImage(buffer, filename, mimeType);
    } else if (req.body.imageUrl) {
      filename = req.body.imageUrl;
      storageUrl = req.body.imageUrl;
    }

    // 2. Run Gemini Vision on the server (GEMINI_API_KEY never exposed to frontend)
    const classification = await classifyEwasteImage(
      buffer || Buffer.from(''),
      mimeType,
      filename || req.body.deviceNameHint || ''
    );

    res.json({
      ...classification,
      uploadedImageUrl: storageUrl || classification.image_url || null
    });
  } catch (err) {
    console.error('Classification error:', err);
    res.status(500).json({ error: 'Failed to classify image', details: err.message });
  }
});

// --- E-WASTE ITEMS ---
router.get('/ewaste', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    const items = await db.getEwasteItems(userId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ewaste', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || req.body.user_id || 'usr_sruthi_101';
    const item = await db.createEwasteItem({ ...req.body, user_id: userId });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- COLLECTORS ---
router.get('/collectors', async (req, res) => {
  try {
    const list = await db.getCollectors();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/collectors/:id/availability', async (req, res) => {
  try {
    const { available } = req.body;
    const updated = await db.updateCollector(req.params.id, { available });
    if (!updated) return res.status(404).json({ error: 'Collector not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/collectors/:id/verify', async (req, res) => {
  try {
    const { verification_status } = req.body;
    const updated = await db.updateCollector(req.params.id, { verification_status });
    if (!updated) return res.status(404).json({ error: 'Collector not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PICKUPS ---
router.get('/pickups', async (req, res) => {
  try {
    const userId = req.query.userId;
    const collectorId = req.query.collectorId;
    const pickups = await db.getPickups({ user_id: userId, collector_id: collectorId });
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/pickups', async (req, res) => {
  try {
    const pickup = await db.createPickup(req.body);
    res.json(pickup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/pickups/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });
    const updated = await db.updatePickupStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Pickup not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CERTIFICATES ---
router.get('/certificates', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    const certs = await db.getCertificates(userId);
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/certificates/:id', async (req, res) => {
  try {
    const cert = await db.getCertificateById(req.params.id);
    if (!cert) return res.status(404).json({ error: 'Certificate not found' });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- REWARDS & NOTIFICATIONS ---
router.get('/rewards', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    const rewards = await db.getRewards(userId);
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/notifications', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];
    const notifs = await db.getNotifications(userId);
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const notif = await db.markNotificationRead(req.params.id);
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN STATS ---
router.get('/admin/stats', async (req, res) => {
  try {
    const stats = await db.getAdminStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

import express from 'express';
import multer from 'multer';
import { db } from '../services/dbService.js';
import { classifyEwasteImage } from '../utils/aiClassifier.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// --- AUTHENTICATION ---
router.post('/auth/register', (req, res) => {
  const { full_name, email, role, phone, address, city } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  let existing = db.findProfileByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const newProfile = db.createProfile({
    full_name: full_name || 'EcoCycle Member',
    email,
    role: role || 'USER',
    phone,
    address,
    city
  });

  res.json({ user: newProfile, token: 'ecocycle-jwt-mock-' + newProfile.id });
});

router.post('/auth/login', (req, res) => {
  const { email, role } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  let profile = db.findProfileByEmail(email);
  if (!profile) {
    // If not found in demo, create automatically with specified role!
    profile = db.createProfile({
      full_name: email.split('@')[0].toUpperCase(),
      email,
      role: role || 'USER'
    });
  }

  res.json({ user: profile, token: 'ecocycle-jwt-mock-' + profile.id });
});

router.get('/auth/me', (req, res) => {
  const userId = req.headers['x-user-id'] || 'usr_sruthi_101';
  const profile = db.findProfileById(userId);
  if (!profile) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user: profile });
});

// --- AI CLASSIFICATION ---
router.post('/ai/classify', upload.single('image'), async (req, res) => {
  try {
    let buffer = null;
    let mimeType = 'image/jpeg';
    let filename = '';

    if (req.file) {
      buffer = req.file.buffer;
      mimeType = req.file.mimetype;
      filename = req.file.originalname;
    } else if (req.body.imageUrl) {
      filename = req.body.imageUrl;
    }

    const classification = await classifyEwasteImage(
      buffer || Buffer.from(''),
      mimeType,
      filename || req.body.deviceNameHint || ''
    );

    res.json(classification);
  } catch (err) {
    console.error('Classification error:', err);
    res.status(500).json({ error: 'Failed to classify image', details: err.message });
  }
});

// --- E-WASTE ITEMS ---
router.get('/ewaste', (req, res) => {
  const userId = req.query.userId || req.headers['x-user-id'] || 'usr_sruthi_101';
  const items = db.getEwasteItems(userId);
  res.json(items);
});

router.post('/ewaste', (req, res) => {
  const userId = req.headers['x-user-id'] || req.body.user_id || 'usr_sruthi_101';
  const item = db.createEwasteItem({ ...req.body, user_id: userId });
  res.json(item);
});

// --- COLLECTORS ---
router.get('/collectors', (req, res) => {
  const list = db.getCollectors();
  res.json(list);
});

router.patch('/collectors/:id/availability', (req, res) => {
  const { available } = req.body;
  const updated = db.updateCollector(req.params.id, { available });
  if (!updated) return res.status(404).json({ error: 'Collector not found' });
  res.json(updated);
});

router.patch('/collectors/:id/verify', (req, res) => {
  const { verification_status } = req.body;
  const updated = db.updateCollector(req.params.id, { verification_status });
  if (!updated) return res.status(404).json({ error: 'Collector not found' });
  res.json(updated);
});

// --- PICKUPS ---
router.get('/pickups', (req, res) => {
  const userId = req.query.userId;
  const collectorId = req.query.collectorId;
  const pickups = db.getPickups({ user_id: userId, collector_id: collectorId });
  res.json(pickups);
});

router.post('/pickups', (req, res) => {
  const pickup = db.createPickup(req.body);
  res.json(pickup);
});

router.patch('/pickups/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });
  const updated = db.updatePickupStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Pickup not found' });
  res.json(updated);
});

// --- CERTIFICATES ---
router.get('/certificates', (req, res) => {
  const userId = req.query.userId || req.headers['x-user-id'] || 'usr_sruthi_101';
  const certs = db.getCertificates(userId);
  res.json(certs);
});

router.get('/certificates/:id', (req, res) => {
  const cert = db.getCertificateById(req.params.id);
  if (!cert) return res.status(404).json({ error: 'Certificate not found' });
  res.json(cert);
});

// --- REWARDS & NOTIFICATIONS ---
router.get('/rewards', (req, res) => {
  const userId = req.query.userId || req.headers['x-user-id'] || 'usr_sruthi_101';
  const rewards = db.getRewards(userId);
  res.json(rewards);
});

router.get('/notifications', (req, res) => {
  const userId = req.query.userId || req.headers['x-user-id'] || 'usr_sruthi_101';
  const notifs = db.getNotifications(userId);
  res.json(notifs);
});

router.patch('/notifications/:id/read', (req, res) => {
  const notif = db.markNotificationRead(req.params.id);
  res.json(notif);
});

// --- ADMIN STATS ---
router.get('/admin/stats', (req, res) => {
  const stats = db.getAdminStats();
  res.json(stats);
});

export default router;

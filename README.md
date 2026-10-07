# EcoCycle — Responsible E-Waste Circularity Platform 🌱

EcoCycle is a full-stack, hackathon-ready e-waste collection platform connecting households and organizations with verified e-waste collectors. Built with the **Circularity Interface System** designed in **Google Stitch**, EcoCycle transforms e-waste recycling from an administrative chore into a high-end digital circularity experience.

---

## 🎨 Stitch MCP Design System (Source of Truth)
- **Design System**: *Circularity Interface System*
- **Primary Color**: Deep Forest (`#0F2D1F`)
- **Secondary Energy**: Emerald (`#10B981`)
- **Tertiary Accent**: Subtle Lime (`#84CC16`)
- **Canvas Base**: Warm Cream / Mint (`#F6FBF5`)
- **Typography**: 
  - Editorial Serifs: `Newsreader` (Headlines & Metrics)
  - Interface Workhorse: `Plus Jakarta Sans` (with `font-variant-numeric: tabular-nums`)
- **Radii**: 24px (`rounded-2xl`) cards, full pill (`rounded-full`) interactive controls.

---

## 🚀 Key Features

### 1. User Experience
- **Startup Landing Page**: Narrative storytelling with *"Your old electronics deserve a better ending."*
- **User Vault / Dashboard**: Personalized view (*"Good morning, Sruthi 🌱"*, *Eco Warrior* tier pill, active pickup card *"Your laptop is on its way to a second life"*).
- **AI Diagnostics HUD**: Reticle bounding boxes, circuit board and battery integrity status, detected make, 94% confidence rating.
- **Direct Recovery Valuation**: Deep Forest Vault card with ₹1,200 escrow guaranteed value, 89% yield meter, and precious metals audit (Gold, Copper, Aluminum).
- **Smart Collector Matching**: Real-time proximity sorting (GreenCycle Services ★4.8, 2.4 km away, Zero-Emission EV, ISO 14001 certified).
- **Doorstep Scheduling**: Custom date/time slot selection with Bellandur/Indiranagar Bengaluru address support.
- **Live GPS Tracking**: Leaflet + OpenStreetMap interactive courier tracking with route polyline, ETA counter, and chain-of-custody stepper.
- **Recycling Completion Experience**: Circular leaf emblem with glowing halo, +100 Green Points credited, milestone unlocked card.
- **Official Green Certificate**: Printable / downloadable PDF certificate with verified batch numbers and cryptographic custody hash.

### 2. Collector Logistics Hub
- Verified collector persona: **Vikram Sharma** (GreenCycle Services)
- Online / Offline availability toggle
- Incoming pickup requests with **Accept** and **Decline** actions
- 1-click status transitions: `ACCEPTED` ➔ `ON_THE_WAY` ➔ `COLLECTED` ➔ `RECYCLED` (which automatically credits user points and issues the certificate).

### 3. Admin Intelligence & Governance
- Executive analytics dashboard: Total Recycled Mass, CO₂ Avoided, Verified Collectors, Total Pickups.
- Interactive **Recharts**: Monthly recycling volume (AreaChart) and category breakdown (PieChart).
- Collector verification queue with real-time **Approve / Suspend** controls.

---

## ⚙️ Tech Stack
- **Frontend**: React 19, Vite 8, Tailwind CSS, Lucide React, Recharts, Leaflet, Canvas-Confetti
- **Backend**: Node.js, Express.js, Multer
- **AI Engine**: Google Gemini Vision API (with intelligent neural fallback classifier)
- **Database**: Supabase PostgreSQL & Storage (with standalone reactive store for instant offline hackathon demonstration)

---

## 🏃 Getting Started

### 1. Running the Platform Locally
In the root directory:
```bash
# Terminal 1: Backend Server (Port 5000)
npm run dev:server

# Terminal 2: Frontend Client (Port 5173)
npm run dev:client
```
Open **`http://localhost:5173`** in your browser.

### 2. Environment Variables (`.env`)
```ini
PORT=5000
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Supabase Schema Migration
To migrate to a live Supabase instance:
1. Open your Supabase project SQL Editor.
2. Run the SQL script found in `supabase/schema.sql`.
3. Set your `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`.

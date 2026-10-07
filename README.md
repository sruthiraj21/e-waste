# 🌱 EcoCycle — AI-Powered E-Waste Collection Platform

EcoCycle is an AI-powered e-waste collection platform that connects households and organizations with verified e-waste collectors for convenient and responsible electronic waste recycling.

The platform simplifies the complete e-waste recycling journey — from identifying an electronic device using AI to scheduling a pickup, tracking the collector, completing recycling, earning Green Points, and receiving a recycling certificate.

---

## 📌 Overview

Electronic waste is one of the fastest-growing waste streams in the world, while many people still struggle to dispose of old electronic devices through reliable and authorized channels.

EcoCycle addresses this problem by creating a digital platform where users can:

- Identify e-waste using AI
- Estimate its recyclable value and weight
- Find suitable verified collectors
- Schedule doorstep pickups
- Track pickup progress
- Monitor their recycling impact
- Earn Green Points and sustainability badges
- Receive a digital recycling certificate

The platform also provides collectors with tools to manage pickup requests and administrators with insights into the overall recycling ecosystem.

---

## 🔄 Core Workflow

```text
User Registration / Login
          ↓
     User Dashboard
          ↓
    Submit E-Waste
          ↓
      Upload Image
          ↓
   AI Classification
          ↓
 Device & Category Identified
          ↓
Estimated Value & Weight
          ↓
 Smart Collector Matching
          ↓
   Select Collector
          ↓
    Schedule Pickup
          ↓
   Pickup Confirmed
          ↓
    Track Collector
          ↓
    E-Waste Collected
          ↓
 Recycling Completed
          ↓
   Green Points Awarded
          ↓
 Environmental Impact Updated
          ↓
 Recycling Certificate

```
###
**🎯 Objectives**

The main objectives of EcoCycle are:

Simplify e-waste disposal by providing a convenient digital collection platform.
Use AI for e-waste identification so users can easily understand what type of electronic waste they have.
Connect users with verified collectors based on location, availability, rating, and supported e-waste categories.
Enable convenient doorstep collection through pickup scheduling and tracking.
Promote responsible recycling by encouraging users to dispose of electronics through appropriate channels.
Increase environmental awareness by showing users their recycling contribution and estimated environmental impact.
Encourage sustainable behavior through Green Points, badges, and recycling certificates.
Provide useful analytics for administrators to understand recycling activity and platform performance.

## ✨ Key Features

### 🤖 AI E-Waste Classification

Users can upload an image of their electronic waste, and Gemini AI analyzes it.

**AI provides:**

- **Device name**
- **E-waste category**
- **Device condition**
- **Classification confidence**
- **Estimated recyclable value**
- **Estimated recyclable weight**

### 📍 Smart Collector Matching

EcoCycle identifies suitable verified collectors based on:

- **Verification status**
- **Location**
- **Distance**
- **Availability**
- **Rating**
- **Supported e-waste categories**

### 📅 Pickup Scheduling

Users can schedule a convenient doorstep pickup.

**Users can select:**

- Pickup address
- Date
- Time slot
- E-waste item
- Preferred collector

### 🚚 Pickup Tracking

Users can track the progress of their e-waste pickup through a delivery-style tracking interface.

**Pickup status flow:**

```text
REQUESTED
    ↓
ACCEPTED
    ↓
COLLECTOR_ASSIGNED
    ↓
ON_THE_WAY
    ↓
COLLECTED
    ↓
RECYCLED
```


### ♻️ Recycling Completion

Once the e-waste is successfully recycled, EcoCycle updates the user's recycling history and environmental impact.

Users can view:

- Recycled weight
- Estimated CO₂ impact avoided
- Green Points earned
- Sustainability badge
- Recycling certificate


### 🌱 Green Points & Rewards

EcoCycle encourages responsible recycling through a reward-based system.

Users earn **Green Points** for recycling e-waste and can unlock sustainability badges.

**Badges include:**

- 🌱 Eco Starter
- 🌿 Green Champion
- ♻️ Eco Warrior
- 🌍 Planet Protector


### 🌍 Environmental Impact Tracking

Users can monitor their contribution toward responsible e-waste recycling.

**Impact metrics include:**

- Total e-waste recycled
- Number of devices recycled
- Estimated CO₂ impact avoided
- Total Green Points
- Successful pickups

Visual analytics help users understand the environmental impact of their actions.


### 📜 Digital Recycling Certificate

After successful recycling, EcoCycle provides a digital recycling certificate.

**Certificate includes:**

- Certificate ID
- User name
- E-waste/device type
- Recycled weight
- Recycling date
- Estimated CO₂ impact avoided
- Collector/recycling partner


### 👥 Role-Based Platform

EcoCycle provides different experiences for different platform roles.

**👤 User**

- Submit e-waste
- Use AI classification
- Find collectors
- Schedule pickups
- Track pickups
- Earn Green Points
- View environmental impact
- Access recycling certificates

**🚛 Collector**

- Manage collector profile
- Set availability
- Receive pickup requests
- Accept or reject requests
- Manage scheduled pickups
- Update pickup status
- View completed pickups

**🛡️ Admin**

- Manage users
- Verify collectors
- Monitor e-waste submissions
- Monitor pickups
- View recycling statistics
- View environmental analytics
- 
###
**🏗️ Architecture**

EcoCycle follows a full-stack architecture:

                    ┌─────────────────────┐
                    │       User          │
                    │  Web / Mobile UI    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │     + Vite           │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │    Express API      │
                    │     Node.js         │
                    └───────┬─────┬──────┘
                            │     │
             ┌──────────────┘     └──────────────┐
             ▼                                   ▼
   ┌──────────────────┐                ┌──────────────────┐
   │     Supabase     │                │    Gemini AI     │
   │                  │                │                  │
   │ PostgreSQL       │                │ E-Waste          │
   │ Authentication   │                │ Classification    │
   │ Storage          │                │ & Analysis       │
   └──────────────────┘                └──────────────────┘
             │
             ▼
   ┌──────────────────┐
   │   E-Waste Data   │
   │   Pickup Data     │
   │   User Profiles   │
   │   Rewards         │
   │   Certificates    │
   └──────────────────┘
Architecture Flow
Frontend
   │
   ├── Authentication ──────► Supabase Auth
   │
   ├── Database Operations ─► Supabase PostgreSQL
   │
   ├── Image Upload ────────► Supabase Storage
   │
   └── AI Requests ─────────► Express Backend
                                  │
                                  ▼
                              Gemini API

                              
###

**🛠️ Technology Stack**

Frontend
Technology	Purpose
React	User interface
Vite	Frontend development and build tool
JavaScript	Application logic
Tailwind CSS	Styling and responsive design
Lucide React	Icons
Recharts	Data visualization
Leaflet	Maps
OpenStreetMap	Map data
Backend
Technology	Purpose
Node.js	Backend runtime
Express.js	REST API
JavaScript	Server-side logic
Database & Services
Technology	Purpose
Supabase PostgreSQL	Database
Supabase Auth	Authentication
Supabase Storage	E-waste image storage
Gemini API	AI-powered e-waste classification
Development Tools
Git
GitHub
Antigravity
Stitch MCP



## 
**📁 Project Structure**

e-waste/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── lib/
│   │   └── utils/
│   │
│   ├── public/
│   └── package.json
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   └── utils/
│
├── supabase/
│   └── schema.sql
│
├── .gitignore
├── package.json
├── README.md
└── ...
Main Components

client/
Contains the React frontend and user-facing application.

server/
Contains Express APIs, business logic, authentication middleware, collector matching, and Gemini integration.

supabase/
Contains database schema and Supabase-related configuration.

components/
Reusable UI components such as cards, buttons, forms, navigation, maps, and tracking components.

pages/
Application screens for users, collectors, and administrators.

services/
Handles API calls, Supabase operations, and other external service integrations.

###
**🔐 Security**

EcoCycle follows basic security practices including:

Supabase Authentication
Role-based access
Row Level Security (RLS)
Protected routes
Environment variables for API keys
Server-side Gemini API integration
Secure image storage

Sensitive credentials are never intended to be committed to the repository.

###
**🚀 Getting Started**
1. Clone the repository
git clone https://github.com/sruthiraj21/e-waste.git
cd e-waste
2. Install dependencies
npm install

If the frontend and backend have separate package files:

cd client
npm install

cd ../server
npm install
3. Configure environment variables

Create a .env file and add:

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_api_key

Never commit .env files to GitHub.

4. Run the application

Start the backend:

npm run server

Start the frontend:

npm run dev
###
**🌟 Future Enhancements**

Potential future improvements include:

Real-time collector GPS tracking
Integration with certified recycling organizations
Automated pickup route optimization
Advanced e-waste price estimation
More detailed AI-based device condition analysis
Mobile application
Multilingual support
Corporate e-waste management
Automated recycling partner verification
Advanced sustainability analytics
###
**🌍 Vision**

EcoCycle aims to make responsible e-waste disposal as simple as ordering a delivery.

By combining AI, smart collector matching, digital tracking, and sustainability rewards, EcoCycle encourages people to give their old electronics a responsible second life.

Recycle smarter. Earn greener. Build a cleaner future. 🌱♻️

###
**👩‍💻 Project**

EcoCycle — AI-Powered E-Waste Collection Platform

Built as a hackathon project under the Environment & Climate domain.


### One small recommendation

Since you're actually building this for a hackathon, **don't claim features in the README that Antigravity hasn't implemented yet**. Once your current build is finished, we can make the README match the *actual* application exactly—including screenshots, live demo, team members, problem statement, and your specific role.

That will make the repository look much more legitimate to a judge than a README that promises 30 features while 12 are still on the TODO list. 😄

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Laptop, 
  Smartphone, 
  Headphones, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Leaf, 
  Award, 
  Camera, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function UserDashboard({ 
  onStartScan, 
  onTrackPickup, 
  onOpenCertificate 
}) {
  const { currentUser } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [activePickup, setActivePickup] = useState(null);

  useEffect(() => {
    if (currentUser?.id) {
      api.getPickups({ user_id: currentUser.id }).then(data => {
        if (Array.isArray(data)) {
          setPickups(data);
          // Find first active pickup
          const active = data.find(p => p.status !== 'RECYCLED') || data[0];
          setActivePickup(active);
        }
      }).catch(() => {});

      api.getEwasteItems(currentUser.id).then(items => {
        if (Array.isArray(items)) setRecentItems(items);
      }).catch(() => {});
    }
  }, [currentUser]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header & Personal Greeting from Stitch Screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif-eco text-3xl sm:text-4xl font-normal text-[#0F2D1F]">
              Good morning, {currentUser?.full_name?.split(' ')[0] || 'Sruthi'} 🌱
            </h1>
            <span className="stitch-badge-mint text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              Eco Warrior
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Here is your circular impact overview today.
          </p>
        </div>

        {/* Quick Scan Action Button on top */}
        <button
          onClick={onStartScan}
          className="px-5 py-2.5 rounded-full bg-[#0F2D1F] hover:bg-[#17422E] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-98 self-start sm:self-auto"
        >
          <Camera className="w-3.5 h-3.5 text-[#10B981]" />
          Instant AI Scan
        </button>
      </div>

      {/* 2. Prominent Active In-Flight Pickup Card matching Stitch Screenshot */}
      {activePickup && (
        <div className="stitch-card-vault p-5 sm:p-6 relative overflow-hidden">
          
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-2 text-[#D1FAE5]">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[#10B981]">
                <Laptop className="w-4 h-4" />
              </div>
              <span className="font-bold text-white">
                {activePickup?.item?.device_name || 'MacBook Pro 14"'}
              </span>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-1 text-[#84CC16] text-[11px]">
                <ShieldCheck className="w-3 h-3" /> Custody Verified
              </span>
            </div>

            <span className="stitch-badge-mint text-[10px] bg-[#10B981]/20 text-[#84CC16] border-[#84CC16]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] animate-ping"></span>
              In Transit
            </span>
          </div>

          <h3 className="font-serif-eco text-2xl sm:text-3xl font-medium text-white tracking-tight mb-1">
            Your laptop is on its way to a second life.
          </h3>
          
          <p className="text-xs text-gray-300 leading-relaxed mb-5">
            {activePickup?.status_note || 'Courier en route to Valo Foundry • 70% complete • ETA 25 mins'}
          </p>

          {/* Stepper track */}
          <div className="space-y-2 mb-5">
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#10B981] to-[#84CC16] rounded-full transition-all duration-700"
                style={{ width: `${activePickup?.progress_percent || 70}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-300">
              <span className="flex items-center gap-1 text-[#84CC16]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Picked Up
              </span>
              <span className="text-white font-semibold">
                {activePickup?.progress_percent || 70}% Completed
              </span>
              <span className="flex items-center gap-1 text-gray-300">
                <Truck className="w-3.5 h-3.5" /> Foundry Intake
              </span>
            </div>
          </div>

          {/* Bottom Card Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="text-[11px] font-mono text-gray-300">
              ID: <span className="text-white font-bold">{activePickup?.tracking_id || '#EC-8954-BLR'}</span>
            </div>

            <button
              onClick={() => onTrackPickup(activePickup)}
              className="px-5 py-2.5 rounded-full bg-[#84CC16] hover:bg-[#91db2a] text-[#0F2D1F] text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
            >
              Track Live Pickup
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

      {/* 3. Sustainability Footprint (2x2 Grid) matching Stitch Screenshot */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif-eco text-xl font-bold text-[#0F2D1F]">
            Sustainability Footprint
          </h3>
          <span className="text-[11px] text-gray-500 font-medium">Lifetime stats</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Tile 1: Recycled */}
          <div className="stitch-card p-4">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-medium">Recycled E-Waste</span>
              <div className="w-6 h-6 rounded-full bg-[#D1FAE5] flex items-center justify-center text-[#10B981]">
                <Leaf className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="font-serif-eco text-2xl sm:text-3xl font-bold text-[#0F2D1F] font-tabular">
              {currentUser?.recycled_kg || 12.5} <span className="text-sm font-normal text-gray-500">kg</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">across 4 home devices</div>
          </div>

          {/* Tile 2: CO2 Avoided */}
          <div className="stitch-card p-4">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-medium">CO₂ Avoided</span>
              <div className="w-6 h-6 rounded-full bg-[#D1FAE5] flex items-center justify-center text-[#10B981]">
                <Leaf className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="font-serif-eco text-2xl sm:text-3xl font-bold text-[#0F2D1F] font-tabular">
              {currentUser?.co2_avoided_kg || 8.2} <span className="text-sm font-normal text-gray-500">kg</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">equiv. to 3 planted pines</div>
          </div>

          {/* Tile 3: Green Points */}
          <div className="stitch-card p-4">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-medium">Green Points</span>
              <div className="w-6 h-6 rounded-full bg-[#0F2D1F] flex items-center justify-center text-[#84CC16]">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="font-serif-eco text-2xl sm:text-3xl font-bold text-[#0F2D1F] font-tabular">
              {currentUser?.green_points || 450} <span className="text-sm font-normal text-gray-500">GP</span>
            </div>
            <div className="text-[11px] text-[#10B981] font-semibold mt-1">50 pts to Planet...</div>
          </div>

          {/* Tile 4: Pickups Done */}
          <div className="stitch-card p-4">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-medium">Pickups Done</span>
              <div className="w-6 h-6 rounded-full bg-[#D1FAE5] flex items-center justify-center text-[#10B981]">
                <Truck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="font-serif-eco text-2xl sm:text-3xl font-bold text-[#0F2D1F] font-tabular">
              {currentUser?.pickups_count || 6} <span className="text-sm font-normal text-gray-500">done</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">100% on-time verified</div>
          </div>

        </div>
      </div>

      {/* 4. Quick Action Card matching Stitch Screenshot */}
      <div className="stitch-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#10B981]/20 bg-gradient-to-r from-white to-[#F6FBF5]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#D1FAE5] flex items-center justify-center text-[#10B981] flex-shrink-0">
            <Camera className="w-5 h-5 text-[#0F2D1F]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#0F2D1F]">Have an old device ready?</h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Get instant credit valuation & schedule zero-emission doorstep pickup in 60s.
            </p>
          </div>
        </div>

        <button
          onClick={onStartScan}
          className="px-6 py-3 rounded-full bg-[#0F2D1F] hover:bg-[#17422E] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 flex-shrink-0"
        >
          <Camera className="w-3.5 h-3.5 text-[#10B981]" />
          Start Instant AI Scan / Recycle
        </button>
      </div>

      {/* 5. Recent Activity Timeline matching Stitch Screenshot */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-serif-eco text-xl font-bold text-[#0F2D1F]">
              Recent Activity
            </h3>
            <p className="text-[11px] text-gray-500">Verifiable device lifecycle timeline</p>
          </div>
          <button 
            onClick={() => onOpenCertificate({})} 
            className="text-xs font-semibold text-[#10B981] hover:underline"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          
          {/* Item 1: iPhone 13 Pro (Completed) */}
          <div className="stitch-card p-3.5 flex items-center justify-between gap-3 hover:border-[#10B981]/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 flex-shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#0F2D1F]">iPhone 13 Pro</h4>
                  <span className="stitch-badge-mint text-[9px] py-0 px-2 bg-[#D1FAE5] text-[#0F2D1F]">
                    Melt & Recovery
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Melt & Recovery Complete (+100 GP, 2.4 kg)
                </p>
                <button
                  onClick={() => onOpenCertificate({
                    device_name: 'iPhone 13 Pro (128GB)',
                    certificate_number: 'CERT-EC-2026-89120-BLR',
                    recycled_weight: 2.4,
                    co2_avoided: 1.8,
                    water_saved_liters: 320,
                    pointsAdded: 100
                  })}
                  className="text-[10px] font-semibold text-[#10B981] hover:underline flex items-center gap-1 mt-1"
                >
                  <ExternalLink className="w-2.5 h-2.5" /> Verifiable Custody Certificate
                </button>
              </div>
            </div>
            <div className="text-[11px] text-gray-400 font-medium">Yesterday</div>
          </div>

          {/* Item 2: Sony WH-1000XM4 (Refurbished) */}
          <div className="stitch-card p-3.5 flex items-center justify-between gap-3 hover:border-[#10B981]/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#0F2D1F]">Sony WH-1000XM4</h4>
                  <span className="stitch-badge-mint text-[9px] py-0 px-2 bg-emerald-50 text-emerald-800">
                    Refurbished
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Refurbished & Re-homed (+150 GP)
                </p>
                <button
                  onClick={() => onOpenCertificate({
                    device_name: 'Sony WH-1000XM4 ANC Headphones',
                    certificate_number: 'CERT-EC-2026-72819-BLR',
                    recycled_weight: 0.35,
                    co2_avoided: 1.4,
                    water_saved_liters: 150,
                    pointsAdded: 150
                  })}
                  className="text-[10px] font-semibold text-[#10B981] hover:underline flex items-center gap-1 mt-1"
                >
                  <ExternalLink className="w-2.5 h-2.5" /> Verifiable Custody Certificate
                </button>
              </div>
            </div>
            <div className="text-[11px] text-gray-400 font-medium">Oct 12</div>
          </div>

          {/* Item 3: Dell XPS 15 Charger */}
          <div className="stitch-card p-3.5 flex items-center justify-between gap-3 hover:border-[#10B981]/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#0F2D1F]">Dell XPS 15 Charger</h4>
                  <span className="stitch-badge-mint text-[9px] py-0 px-2 bg-lime-50 text-lime-800">
                    Harvested
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Clean Copper Harvested (+25 GP)
                </p>
                <button
                  onClick={() => onOpenCertificate({
                    device_name: 'Dell XPS 130W USB-C GaN Charger',
                    certificate_number: 'CERT-EC-2026-61920-BLR',
                    recycled_weight: 0.45,
                    co2_avoided: 1.1,
                    water_saved_liters: 90,
                    pointsAdded: 50
                  })}
                  className="text-[10px] font-semibold text-[#10B981] hover:underline flex items-center gap-1 mt-1"
                >
                  <ExternalLink className="w-2.5 h-2.5" /> Verifiable Custody Certificate
                </button>
              </div>
            </div>
            <div className="text-[11px] text-gray-400 font-medium">Oct 04</div>
          </div>

        </div>
      </div>

    </div>
  );
}

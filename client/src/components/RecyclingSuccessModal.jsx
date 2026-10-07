import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Droplets, 
  Award, 
  Share2, 
  RotateCcw,
  X
} from 'lucide-react';

export default function RecyclingSuccessModal({ 
  isOpen, 
  onClose, 
  onViewCertificate, 
  data = {} 
}) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#84cc16', '#0f2d1f', '#d1fae5']
        });
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const {
    deviceName = 'iPhone 13 Pro (128GB)',
    batchId = 'Batch #89120',
    foundry = 'Valo CleanMetallurgy Zurich & EcoCycle Partner',
    recycledWeight = '2.4',
    co2Avoided = '1.8',
    waterSaved = '320',
    pointsAdded = '100',
    gold = '0.034g 24K Gold',
    copper = '14.2g Pure Copper'
  } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#F6FBF5] rounded-3xl shadow-2xl border border-white/60 p-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Glowing Emblem matching Stitch Screenshot */}
        <div className="flex flex-col items-center text-center mt-2">
          <div className="relative mb-4">
            {/* Ambient Green Halo */}
            <div className="absolute inset-0 rounded-full bg-[#10B981]/25 blur-xl scale-125 animate-pulse"></div>
            
            {/* Circular Deep Forest Badge with Leaf & Sun icon */}
            <div className="relative w-24 h-24 rounded-full bg-[#0F2D1F] border-4 border-white shadow-xl flex items-center justify-center">
              <svg viewBox="0 0 48 48" className="w-14 h-14 text-[#84CC16]">
                <circle cx="24" cy="24" r="14" fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="3 3" />
                <path d="M24 14c4 0 8 4 8 10-5 0-10-3-10-8 0-1 1-2 2-2z" fill="#84CC16" />
                <path d="M24 14c-4 0-8 4-8 10 5 0 10-3 10-8 0-1-1-2-2-2z" fill="#10B981" />
                <path d="M24 24v10M19 28l5 5 5-5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </svg>

              {/* Small check shield badge at bottom right */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md border border-[#10B981]/30 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-[#10B981] fill-[#D1FAE5]" />
              </div>
            </div>
          </div>

          {/* Status Capsule Pill */}
          <div className="stitch-badge-mint text-[11px] uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
            Melt & Recovery Cycle Complete
          </div>

          {/* Headline in Editorial Serif */}
          <h2 className="font-serif-eco text-3xl font-medium tracking-tight text-[#0F2D1F] leading-tight mb-2">
            Your device found a better ending. 🌱
          </h2>

          <p className="text-xs text-[#1A1F1C]/75 max-w-xs leading-relaxed mb-5">
            Rare elements returned to the circular economy. Hazardous toxins permanently diverted from soil and water.
          </p>
        </div>

        {/* Device Information Card */}
        <div className="stitch-card p-3.5 mb-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=150&q=80" 
              alt="Device" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#0F2D1F] truncate">{deviceName}</h4>
              <span className="text-[10px] font-semibold text-[#10B981] bg-[#D1FAE5] px-2 py-0.5 rounded-full">
                {batchId}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 truncate mt-0.5">{foundry}</p>
            <div className="flex items-center gap-1 text-[10px] text-[#10B981] font-semibold mt-1">
              <ShieldCheck className="w-3 h-3" />
              <span>100% Chain-of-Custody Verified</span>
            </div>
          </div>
        </div>

        {/* Audited Metrics 2x2 Grid matching Stitch Screenshot */}
        <div className="stitch-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Audited Metrics</span>
              <h4 className="font-serif-eco text-base font-semibold text-[#0F2D1F]">Certified Impact Breakdown</h4>
            </div>
            <Sparkles className="w-4 h-4 text-[#10B981]" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Tile 1: Recycled */}
            <div className="bg-[#F0F5EF] p-3 rounded-2xl border border-[#1A1F1C]/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-white/80 px-1.5 py-0.5 rounded text-gray-500">100% Pure</span>
              </div>
              <div className="font-serif-eco text-2xl font-bold text-[#0F2D1F] font-tabular">{recycledWeight} kg</div>
              <div className="text-[10px] text-gray-600 mt-0.5">Electronics Recycled</div>
            </div>

            {/* Tile 2: CO2 Avoided */}
            <div className="bg-[#F0F5EF] p-3 rounded-2xl border border-[#1A1F1C]/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-white/80 px-1.5 py-0.5 rounded text-gray-500">-42% Baseline</span>
              </div>
              <div className="font-serif-eco text-2xl font-bold text-[#0F2D1F] font-tabular">{co2Avoided} kg</div>
              <div className="text-[10px] text-gray-600 mt-0.5">CO₂ Footprint Avoided</div>
            </div>

            {/* Tile 3: Water Saved */}
            <div className="bg-[#F0F5EF] p-3 rounded-2xl border border-[#1A1F1C]/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-white/80 px-1.5 py-0.5 rounded text-gray-500">Leach Shield</span>
              </div>
              <div className="font-serif-eco text-2xl font-bold text-[#0F2D1F] font-tabular">{waterSaved} L</div>
              <div className="text-[10px] text-gray-600 mt-0.5">Clean Water Saved</div>
            </div>

            {/* Tile 4: Deep Forest Green Points */}
            <div className="bg-[#0F2D1F] p-3 rounded-2xl text-white shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-wider bg-[#10B981]/30 text-[#84CC16] px-1.5 py-0.5 rounded">Credited</span>
              </div>
              <div className="font-serif-eco text-2xl font-bold text-[#84CC16] font-tabular">+{pointsAdded} GP</div>
              <div className="text-[10px] text-[#D1FAE5]/80 mt-0.5">Green Points Added</div>
            </div>
          </div>

          {/* Recovered Precious Metals Footnote */}
          <div className="mt-3 p-2.5 rounded-xl bg-white border border-[#1A1F1C]/5 flex items-start gap-2">
            <Award className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-600 leading-snug">
              Recovered <strong className="text-[#0F2D1F]">{gold}</strong> and <strong className="text-[#0F2D1F]">{copper}</strong> diverted directly to domestic green manufacturing.
            </p>
          </div>
        </div>

        {/* Milestone Unlocked Card (Deep Forest Vault) matching Stitch Screenshot */}
        <div className="stitch-card-vault p-4 mb-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#84CC16] flex items-center justify-center text-[#0F2D1F] font-bold shadow-sm">
                <Award className="w-5 h-5 text-[#0F2D1F]" />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#84CC16]">Milestone Unlocked</span>
                <h4 className="font-serif-eco text-base font-bold text-white leading-tight">Eco Warrior Rank</h4>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/90">
              Tier 4
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-gray-300 font-medium mb-1">
              <span>Level Progress</span>
              <span className="text-[#84CC16] font-bold">450 / 500 XP to Planet Protector</span>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#10B981] to-[#84CC16] rounded-full transition-all duration-1000" style={{ width: '90%' }}></div>
            </div>
            <div className="mt-2 text-[10px] text-gray-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
              Reward perk ready: <span className="text-white font-semibold">50 XP until ₹25 Store Voucher</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => { onClose(); onViewCertificate(); }}
            className="w-full py-3.5 px-4 rounded-full bg-[#0F2D1F] text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#17422E] shadow-md transition-all active:scale-98"
          >
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            View Official Green Certificate
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'EcoCycle Impact',
                  text: `I just responsibly recycled my device with EcoCycle and avoided ${co2Avoided}kg of CO2! 🌱`
                }).catch(() => {});
              } else {
                alert('Copied certified impact link to clipboard!');
              }
            }}
            className="w-full py-3 px-4 rounded-full bg-[#D1FAE5] text-[#0F2D1F] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#A7F3D0] transition-colors"
          >
            <Share2 className="w-4 h-4 text-[#0F2D1F]" />
            Share Impact to Instagram / LinkedIn
          </button>

          <button
            onClick={onClose}
            className="w-full text-center text-[11px] text-gray-500 hover:text-gray-800 font-semibold pt-1 flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Recycle Another Device
          </button>
        </div>

      </div>
    </div>
  );
}

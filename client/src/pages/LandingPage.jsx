import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Award, 
  Leaf, 
  CheckCircle2, 
  Cpu, 
  ScanLine, 
  Clock, 
  Coins 
} from 'lucide-react';

export default function LandingPage({ onStartRecycle, onExploreDashboard }) {
  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION matching prompt exactly */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#84CC16]/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D1FAE5]/80 border border-[#10B981]/30 text-[#0F2D1F] text-xs font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
          <span>Next-Generation Circularity OS</span>
          <span className="text-gray-400">•</span>
          <span className="text-[#059669]">Doorstep Verification</span>
        </div>

        {/* Hero Headline from prompt Section 4 */}
        <h1 className="font-serif-eco text-4xl sm:text-6xl md:text-7xl font-normal text-[#0F2D1F] tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto">
          Your old electronics deserve a <span className="italic font-medium text-[#10B981]">better ending.</span>
        </h1>

        {/* Supporting text from prompt Section 4 */}
        <p className="text-base sm:text-xl text-[#1A1F1C]/75 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
          EcoCycle makes responsible e-waste disposal simple — from AI identification to verified doorstep collection.
        </p>

        {/* Call to Actions from prompt Section 4 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={onStartRecycle}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#0F2D1F] hover:bg-[#17422E] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0F2D1F]/15 transition-all active:scale-95 group"
          >
            <Sparkles className="w-4 h-4 text-[#10B981] group-hover:rotate-12 transition-transform" />
            Recycle Something
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreDashboard}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#D1FAE5] hover:bg-[#A7F3D0] text-[#0F2D1F] font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            See How It Works
          </button>
        </div>

        {/* Real-time Impact Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto pt-8 border-t border-[#1A1F1C]/5">
          <div className="p-3">
            <div className="font-serif-eco text-3xl font-bold text-[#0F2D1F] font-tabular">12,450 kg</div>
            <div className="text-xs text-gray-500 mt-1">E-Waste Diverted</div>
          </div>
          <div className="p-3">
            <div className="font-serif-eco text-3xl font-bold text-[#10B981] font-tabular">21.8 Tons</div>
            <div className="text-xs text-gray-500 mt-1">CO₂ Emissions Avoided</div>
          </div>
          <div className="p-3">
            <div className="font-serif-eco text-3xl font-bold text-[#0F2D1F] font-tabular">840+</div>
            <div className="text-xs text-gray-500 mt-1">Doorstep Pickups Done</div>
          </div>
          <div className="p-3">
            <div className="font-serif-eco text-3xl font-bold text-[#0F2D1F] font-tabular">100%</div>
            <div className="text-xs text-gray-500 mt-1">Certified Zero Landfill</div>
          </div>
        </div>

      </section>

      {/* 3-STEP SEAMLESS CIRCULAR FLOW */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="stitch-badge-mint text-[11px] uppercase tracking-wider mb-2">The EcoCycle Loop</span>
          <h2 className="font-serif-eco text-3xl sm:text-4xl font-semibold text-[#0F2D1F]">
            From Dusty Drawers to Pure Precious Metals
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto mt-2">
            No friction. No guesswork. Three steps to certified environmental return.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: AI Vision Scan */}
          <div className="stitch-card p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] flex items-center justify-center text-[#0F2D1F] mb-5">
                <ScanLine className="w-6 h-6 text-[#10B981]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Step 01</span>
              <h3 className="font-serif-eco text-2xl font-bold text-[#0F2D1F] mt-1 mb-2">
                Instant AI Diagnostics
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Snap a picture of your old laptop, phone, or cable bundle. Gemini Vision detects make, salvage purity, estimated scrap value in ₹, and recyclable mass in under 3 seconds.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#10B981]">
              <Sparkles className="w-3.5 h-3.5" /> 94% Neural Confidence
            </div>
          </div>

          {/* Card 2: Smart Verified Match */}
          <div className="stitch-card p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#0F2D1F] flex items-center justify-center text-[#10B981] mb-5">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Step 02</span>
              <h3 className="font-serif-eco text-2xl font-bold text-[#0F2D1F] mt-1 mb-2">
                Doorstep EV Collection
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our logistics algorithm pairs you with verified electric vehicle couriers nearby (like GreenCycle Services). Schedule a 30-min window that fits your day with live GPS tracking.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#0F2D1F]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Zero-Emission Logistics
            </div>
          </div>

          {/* Card 3: Certified Foundry Melt */}
          <div className="stitch-card p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-transform">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] flex items-center justify-center text-[#0F2D1F] mb-5">
                <Award className="w-6 h-6 text-[#10B981]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Step 03</span>
              <h3 className="font-serif-eco text-2xl font-bold text-[#0F2D1F] mt-1 mb-2">
                Certified Impact & Rewards
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Upon foundry melt, earn Green Points, unlock badges (Eco Warrior), and receive an official verifiable Green Certificate detailing every gram of Gold and Copper recovered.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#10B981]">
              <Leaf className="w-3.5 h-3.5" /> Verifiable Custody Hash
            </div>
          </div>

        </div>
      </section>

      {/* DEEP VAULT IMPACT BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="stitch-card-vault p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="max-w-xl">
            <span className="text-[11px] uppercase tracking-widest text-[#84CC16] font-bold">
              100% Zero-Landfill Guarantee
            </span>
            <h2 className="font-serif-eco text-3xl sm:text-4xl font-bold text-white mt-2 mb-4 leading-tight">
              Rare earth metals should never sleep in landfills.
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Every 1 million recycled smartphones recovers 16,000 kg of copper, 350 kg of silver, and 34 kg of gold. EcoCycle ensures complete chain-of-custody verification under ISO 14001 standards.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-6 text-xs text-white/90">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#84CC16]" /> NIST 800-88 Data Sanitization</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#84CC16]" /> R2 Certified Recyclers</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#84CC16]" /> Instant UPI Salvage Credit</span>
            </div>
          </div>

          <div className="flex-shrink-0 text-center">
            <button
              onClick={onStartRecycle}
              className="px-8 py-4 rounded-full bg-[#84CC16] hover:bg-[#91db2a] text-[#0F2D1F] font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Start AI Scan Now
            </button>
            <div className="text-[11px] text-gray-400 mt-2 font-medium">Free doorstep pickup across Bengaluru</div>
          </div>

        </div>
      </section>

    </div>
  );
}

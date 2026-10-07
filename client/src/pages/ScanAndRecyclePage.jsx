import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Radio, 
  Calendar, 
  Clock, 
  MapPin, 
  Truck, 
  ArrowRight, 
  RotateCcw, 
  Leaf, 
  Coins, 
  FileText,
  AlertCircle
} from 'lucide-react';

const SAMPLE_PREVIEWS = [
  {
    name: 'MacBook Pro / Dell Laptop',
    type: 'Laptop',
    img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'iPhone 13 / Smartphone',
    type: 'Smartphone',
    img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Desktop Monitor',
    type: 'Monitor',
    img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Copper Charger & Cables',
    type: 'Charger',
    img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80'
  }
];

export default function ScanAndRecyclePage({ onPickupBooked, onBack }) {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);

  const [imagePreview, setImagePreview] = useState(SAMPLE_PREVIEWS[0].img);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState({
    category: 'Computer Equipment',
    deviceName: 'Laptop • Computer Equipment',
    type: 'Laptop',
    condition: 'Grade B+ (Micro-optical wear)',
    confidence: 94,
    estimatedValue: 1200,
    estimatedWeight: 2.4,
    co2Avoided: 4.2,
    points: 100,
    specs: 'Aluminum Unibody Chassis • Core i7 10th Gen',
    traceMetals: {
      gold: '0.034g',
      copper: '14.2g Pure Copper',
      aluminum: 'Cu + Al High',
      rareEarths: 'Zero hazardous leak'
    },
    recoveryYield: '89%'
  });

  const [selectedCollector, setSelectedCollector] = useState('col_rec_1');
  const [scheduledDate, setScheduledDate] = useState('2026-10-07');
  const [scheduledTime, setScheduledTime] = useState('Today, 4:00 PM');
  const [pickupAddress, setPickupAddress] = useState(currentUser?.address || 'Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103');
  const [isBooking, setIsBooking] = useState(false);
  const [showScheduleSheet, setShowScheduleSheet] = useState(false);

  // File upload and AI scan trigger
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);

    await triggerAiScan(file);
  };

  const handleSelectSample = async (sample) => {
    setImagePreview(sample.img);
    setSelectedFile(null);
    await triggerAiScan(null, sample.type);
  };

  const triggerAiScan = async (file, hint = '') => {
    setIsScanning(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('image', file);
      } else {
        formData.append('imageUrl', imagePreview);
        formData.append('deviceNameHint', hint);
      }

      const res = await api.classifyImage(formData);
      if (res && res.deviceName) {
        setScanResult(res);
      }
    } catch (err) {
      console.warn('AI Scan error, preserving state:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleConfirmPickup = async () => {
    setIsBooking(true);
    try {
      // 1. Create ewaste item in db
      const itemRes = await api.createEwasteItem({
        device_name: scanResult.deviceName || 'Electronic Device',
        category: scanResult.category || 'Computer Equipment',
        condition: scanResult.condition,
        confidence: scanResult.confidence,
        estimated_value: scanResult.estimatedValue || 1200,
        estimated_weight: scanResult.estimatedWeight || 2.4,
        image_url: imagePreview,
        ai_result: scanResult
      }, currentUser?.id);

      // 2. Create pickup record
      const pickupRes = await api.schedulePickup({
        user_id: currentUser?.id || 'usr_sruthi_101',
        collector_id: selectedCollector,
        ewaste_item_id: itemRes.id,
        pickup_address: pickupAddress,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime
      });

      if (onPickupBooked) {
        onPickupBooked(pickupRes);
      }
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Failed to book pickup. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28 animate-in fade-in duration-300">
      
      {/* 1. Header matching Stitch Screenshot */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif-eco text-3xl font-normal text-[#0F2D1F]">
            AI Scan & Match
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Instant diagnostics and audited collector network
          </p>
        </div>

        <div className="stitch-badge-mint text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          AI Vision Active
        </div>
      </div>

      {/* 2. Device Photo & AI Diagnostic HUD Card matching Stitch Screenshot */}
      <div className="stitch-card p-4 overflow-hidden relative border border-[#10B981]/25">
        
        {/* Sample selector pill row for quick testing */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 border-b border-gray-100 text-xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 flex-shrink-0">Sample Devices:</span>
          {SAMPLE_PREVIEWS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F0F5EF] hover:bg-[#D1FAE5] text-[#0F2D1F] flex-shrink-0 transition-colors"
            >
              {sample.type}
            </button>
          ))}
        </div>

        {/* Viewfinder Canvas */}
        <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
          <img 
            src={imagePreview} 
            alt="Device for Recycling" 
            className={`w-full h-full object-cover transition-opacity duration-300 ${isScanning ? 'opacity-40' : 'opacity-85'}`}
          />

          {/* Futuristic Scanning Reticle & HUD Overlay */}
          <div className="absolute inset-4 border-2 border-[#10B981]/50 rounded-xl pointer-events-none">
            {/* Corner Reticle brackets */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#84CC16]"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#84CC16]"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#84CC16]"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#84CC16]"></div>
          </div>

          {/* Animated Scan Line when scanning */}
          {isScanning && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#84CC16] to-transparent animate-scan-line"></div>
          )}

          {/* Glowing HUD Labels matching Stitch Screenshot */}
          <div className="absolute top-6 left-6 bg-[#0F2D1F]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#84CC16] flex items-center gap-1.5 border border-[#84CC16]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] animate-ping"></span>
            CIRCUITBOARD: CLEAN
          </div>

          <div className="absolute bottom-6 left-6 bg-[#0F2D1F]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#10B981] flex items-center gap-1.5 border border-[#10B981]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            BATTERY: INTACT 58Wh
          </div>

          {/* Retake / Upload Button on top right */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#0F2D1F] text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
          >
            <Camera className="w-3.5 h-3.5 text-[#10B981]" />
            Retake / Upload
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Classification Title & Confidence Badge */}
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-eco text-xl font-bold text-[#0F2D1F]">
                {scanResult.deviceName}
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {scanResult.specs || 'Aluminum Unibody Chassis • Core i7 10th Gen'}
            </p>
          </div>

          <span className="stitch-badge-mint text-[11px] font-bold flex-shrink-0">
            <Sparkles className="w-3 h-3 text-[#10B981]" />
            {scanResult.confidence}% Confidence
          </span>
        </div>

        {/* 3-Tile Spec Row matching Stitch Screenshot */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100">
          <div className="bg-[#F0F5EF] p-2.5 rounded-xl text-center">
            <div className="text-[10px] text-gray-500">Assessed Mass</div>
            <div className="font-serif-eco text-sm font-bold text-[#0F2D1F] mt-0.5 font-tabular">
              {scanResult.estimatedWeight} kg
            </div>
            <div className="text-[9px] text-gray-400">Within ±4% specs</div>
          </div>

          <div className="bg-[#F0F5EF] p-2.5 rounded-xl text-center">
            <div className="text-[10px] text-gray-500">Material Grade</div>
            <div className="font-serif-eco text-sm font-bold text-[#0F2D1F] mt-0.5">
              {scanResult.condition?.split(' ')[0] || 'Grade B+'}
            </div>
            <div className="text-[9px] text-gray-400">Micro-optical wear</div>
          </div>

          <div className="bg-[#F0F5EF] p-2.5 rounded-xl text-center">
            <div className="text-[10px] text-gray-500">Trace Metals</div>
            <div className="font-serif-eco text-sm font-bold text-[#0F2D1F] mt-0.5">
              Cu + Al High
            </div>
            <div className="text-[9px] text-gray-400">Zero hazardous leak</div>
          </div>
        </div>

      </div>

      {/* 3. Direct Recovery Valuation Card (Deep Forest Vault) matching Stitch Screenshot */}
      <div className="stitch-card-vault p-5 relative overflow-hidden">
        
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 text-[#84CC16] font-bold text-[10px] tracking-widest uppercase">
            <Coins className="w-3.5 h-3.5" />
            Direct Recovery Valuation
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/90">
            Certified Fair Value
          </span>
        </div>

        {/* Large Currency Display in INR */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-serif-eco text-4xl sm:text-5xl font-bold text-white font-tabular">
            ₹{scanResult.estimatedValue?.toLocaleString() || '1,200'}
          </span>
          <span className="text-xs uppercase tracking-wider text-[#84CC16] font-bold">
            Escrow Guaranteed
          </span>
        </div>

        <p className="text-xs text-[#D1FAE5]/80 leading-relaxed mb-4">
          Instant UPI deposit or Green Store voucher credit upon handoff.
        </p>

        {/* Recyclability Progress Meter */}
        <div className="p-3 rounded-2xl bg-black/30 border border-white/10 mb-4">
          <div className="flex justify-between text-xs text-gray-300 font-medium mb-1.5">
            <span className="flex items-center gap-1 text-[11px]">
              <RotateCcw className="w-3.5 h-3.5 text-[#10B981]" /> Recyclability Progress Meter
            </span>
            <span className="text-[#84CC16] font-bold">89% High Yield Recovery</span>
          </div>

          {/* Segmented green bar */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex gap-1">
            <div className="h-full bg-[#10B981] rounded-l-full" style={{ width: '65%' }}></div>
            <div className="h-full bg-[#84CC16]" style={{ width: '24%' }}></div>
            <div className="h-full bg-white/20 rounded-r-full" style={{ width: '11%' }}></div>
          </div>
        </div>

        {/* 3 Impact Badges Row */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <div className="text-[#84CC16] font-bold font-tabular">+{scanResult.points || 100}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Green Points</div>
          </div>
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <div className="text-white font-bold font-tabular">{scanResult.co2Avoided || 4.2} kg</div>
            <div className="text-[10px] text-gray-400 mt-0.5">CO₂ Avoided</div>
          </div>
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
            <div className="text-white font-bold">{scanResult.traceMetals?.gold || '0.034g'}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Recovered Gold</div>
          </div>
        </div>

      </div>

      {/* 4. Smart Collector Matching matching Stitch Screenshot */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
            <h3 className="font-serif-eco text-xl font-bold text-[#0F2D1F]">
              Smart Collector Matching
            </h3>
          </div>
          <span className="stitch-badge-mint text-[11px] font-bold">
            3 Verified Nearby
          </span>
        </div>

        {/* Primary Optimal Match Card (GreenCycle Services) matching Stitch Screenshot */}
        <div 
          onClick={() => setSelectedCollector('col_rec_1')}
          className={`stitch-card p-4 relative cursor-pointer border-2 transition-all ${
            selectedCollector === 'col_rec_1' 
              ? 'border-[#10B981] shadow-md bg-gradient-to-b from-[#F6FBF5] to-white' 
              : 'border-transparent hover:border-gray-200'
          }`}
        >
          {/* Top Optimal Match Tag */}
          <div className="absolute -top-3 right-4 bg-[#0F2D1F] text-[#84CC16] text-[9px] font-bold tracking-widest uppercase px-3 py-0.5 rounded-full shadow-sm">
            Optimal AI Match
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0F2D1F] flex items-center justify-center text-[#10B981] font-bold text-lg">
                GC
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0F2D1F]">GreenCycle Services</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span className="text-amber-500 font-bold">★ 4.8</span>
                  <span>(340+ verified eco-runs)</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-[#0F2D1F]">2.4 km</span>
              <div className="text-[10px] text-[#10B981] font-semibold">Available Today</div>
            </div>
          </div>

          {/* Timing details */}
          <div className="mt-3 bg-[#F0F5EF] p-2.5 rounded-xl flex items-center justify-between text-xs text-gray-700">
            <span className="flex items-center gap-1.5 font-semibold text-[#0F2D1F]">
              <Clock className="w-3.5 h-3.5 text-[#10B981]" /> Pickup in 30–45 mins
            </span>
            <span className="text-gray-500">Doorstep Verification</span>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
              Zero-Emission EV
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
              ISO 14001 Certified
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
              Digital Custody Seal
            </span>
          </div>

          <button
            onClick={() => setShowScheduleSheet(true)}
            className="mt-4 w-full py-3 rounded-full bg-[#0F2D1F] hover:bg-[#17422E] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
          >
            Select & Book Doorstep Pickup
            <ArrowRight className="w-3.5 h-3.5 text-[#10B981]" />
          </button>
        </div>

        {/* Alternative Collectors list */}
        <div className="space-y-2 mt-3">
          
          {/* Option 2: EcoVan Bangalore */}
          <div 
            onClick={() => setSelectedCollector('col_rec_2')}
            className={`stitch-card p-3 flex items-center justify-between cursor-pointer border transition-colors ${
              selectedCollector === 'col_rec_2' ? 'border-[#10B981] bg-[#F6FBF5]' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0F2D1F]">EcoVan Bangalore</span>
                  <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded">R2 Certified</span>
                </div>
                <div className="text-[11px] text-gray-500">★ 4.7 • 3.8 km away • Today 4:00 PM</div>
              </div>
            </div>

            <input 
              type="radio" 
              name="collector" 
              checked={selectedCollector === 'col_rec_2'} 
              onChange={() => setSelectedCollector('col_rec_2')}
              className="accent-[#10B981] w-4 h-4" 
            />
          </div>

          {/* Option 3: Urban Green Hub */}
          <div 
            onClick={() => setSelectedCollector('col_rec_3')}
            className={`stitch-card p-3 flex items-center justify-between cursor-pointer border transition-colors ${
              selectedCollector === 'col_rec_3' ? 'border-[#10B981] bg-[#F6FBF5]' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0F2D1F]">Urban Green Hub</span>
                  <span className="text-[9px] bg-[#D1FAE5] text-[#0F2D1F] px-1.5 py-0.2 rounded font-semibold">Next Day</span>
                </div>
                <div className="text-[11px] text-gray-500">★ 4.9 • 1.9 km away • Tomorrow 9:00 AM</div>
              </div>
            </div>

            <input 
              type="radio" 
              name="collector" 
              checked={selectedCollector === 'col_rec_3'} 
              onChange={() => setSelectedCollector('col_rec_3')}
              className="accent-[#10B981] w-4 h-4" 
            />
          </div>

        </div>

        {/* 100% Zero-Landfill Assurance banner matching Stitch Screenshot */}
        <div className="mt-4 p-3 rounded-2xl bg-[#D1FAE5]/50 border border-[#10B981]/25 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#0F2D1F] leading-snug">
            <strong>100% Zero-Landfill Guarantee:</strong> Compliant with NIST 800-88 Data Sanitization. Cryptographic disposal certificate issued on melt.
          </p>
        </div>

      </div>

      {/* Sticky Bottom Action Bar matching Stitch Screenshot */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#F6FBF5]/95 backdrop-blur-md border-t border-[#1A1F1C]/10 p-3 shadow-xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-gray-400">Estimated Scrap Payout</div>
            <div className="font-serif-eco text-2xl font-bold text-[#0F2D1F] font-tabular">
              ₹{scanResult.estimatedValue?.toLocaleString() || '1,200'}
            </div>
          </div>

          <button
            onClick={() => setShowScheduleSheet(true)}
            className="px-6 py-3.5 rounded-full bg-[#0F2D1F] hover:bg-[#17422E] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-98"
          >
            Confirm GreenCycle Pickup
            <ArrowRight className="w-4 h-4 text-[#10B981]" />
          </button>
        </div>
      </div>

      {/* Schedule Slot Bottom Sheet / Modal */}
      {showScheduleSheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif-eco text-xl font-bold text-[#0F2D1F]">
                Schedule Doorstep Collection
              </h3>
              <button 
                onClick={() => setShowScheduleSheet(false)}
                className="text-gray-400 hover:text-gray-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Pickup Address</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
                <MapPin className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                <input 
                  type="text" 
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full bg-transparent outline-none text-[#0F2D1F] font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Date</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
                  <Calendar className="w-4 h-4 text-[#10B981]" />
                  <input 
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-transparent outline-none text-[#0F2D1F] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Time Slot</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
                  <Clock className="w-4 h-4 text-[#10B981]" />
                  <select 
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-transparent outline-none text-[#0F2D1F] font-medium"
                  >
                    <option value="Today, 3:30 PM">Today, 3:30 PM</option>
                    <option value="Today, 5:00 PM">Today, 5:00 PM</option>
                    <option value="Tomorrow, 10:00 AM">Tomorrow, 10:00 AM</option>
                    <option value="Tomorrow, 2:30 PM">Tomorrow, 2:30 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#D1FAE5]/40 rounded-2xl border border-[#10B981]/20 flex items-center justify-between text-xs">
              <span className="text-[#0F2D1F] font-medium">Estimated Value Credit:</span>
              <span className="font-bold text-[#0F2D1F] font-serif-eco text-base">₹{scanResult.estimatedValue} (Direct UPI)</span>
            </div>

            <button
              disabled={isBooking}
              onClick={handleConfirmPickup}
              className="w-full py-4 rounded-full bg-[#0F2D1F] hover:bg-[#17422E] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {isBooking ? 'Dispatching Collector Request...' : 'Finalize & Dispatch Pickup →'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

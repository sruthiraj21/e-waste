import React, { useRef } from 'react';
import { ShieldCheck, Download, Printer, CheckCircle, Award, Leaf, X, ExternalLink } from 'lucide-react';

export default function CertificateModal({ isOpen, onClose, certificate }) {
  const printRef = useRef(null);

  if (!isOpen || !certificate) return null;

  const {
    certificate_number = 'CERT-EC-2026-89120-BLR',
    device_name = 'iPhone 13 Pro (128GB Midnight)',
    recycled_weight = 2.4,
    co2_avoided = 1.8,
    water_saved_liters = 320,
    gold_recovered_grams = '0.034g 24K Gold',
    copper_recovered_grams = '14.2g Pure Copper',
    foundry_name = 'Valo CleanMetallurgy & EcoCycle Zurich Partner',
    issued_at = new Date().toISOString(),
    verification_status = '100% Chain-of-Custody Verified',
    rank_unlocked = 'Eco Warrior Rank (Tier 4)'
  } = certificate;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-[#10B981]/30 p-8 my-8 print:border-none print:shadow-none animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F6FBF5] border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors print:hidden"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Certificate Printable Canvas */}
        <div ref={printRef} className="border-4 border-[#0F2D1F]/10 p-8 rounded-2xl relative bg-[#FCFDFB]">
          
          {/* Subtle Watermark Logo Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <Leaf className="w-96 h-96 text-[#0F2D1F]" />
          </div>

          {/* Certificate Header */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#0F2D1F] flex items-center justify-center text-[#10B981]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif-eco text-2xl font-bold text-[#0F2D1F]">EcoCycle</h3>
                <span className="text-[11px] uppercase tracking-widest text-[#10B981] font-bold">
                  Verified Circularity Protocol
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400">Certificate Identifier</span>
              <div className="font-mono text-xs font-bold text-[#0F2D1F] bg-[#F0F5EF] px-2.5 py-1 rounded-md mt-0.5 border border-gray-200">
                {certificate_number}
              </div>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center my-6 relative z-10">
            <span className="stitch-badge-mint text-[11px] mb-2 uppercase">Official Chain-of-Custody</span>
            <h2 className="font-serif-eco text-3xl sm:text-4xl font-semibold text-[#0F2D1F]">
              Certificate of Responsible Recycling
            </h2>
            <p className="text-xs text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
              This document certifies that the electronic asset specified below was diverted from landfills, decommissioned under strict environmental protocols, and harvested for circular recovery.
            </p>
          </div>

          {/* Details Table */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-xs relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-medium">Decommissioned Asset:</span>
                <p className="font-bold text-[#0F2D1F] mt-0.5">{device_name}</p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Certified Mass:</span>
                <p className="font-bold text-[#0F2D1F] mt-0.5 font-tabular">{recycled_weight} kg</p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">CO₂ Avoided:</span>
                <p className="font-bold text-[#10B981] mt-0.5 font-tabular">{co2_avoided} kg Net GHG</p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Water Safeguarded:</span>
                <p className="font-bold text-[#0F2D1F] mt-0.5 font-tabular">{water_saved_liters} Liters</p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Gold Salvaged:</span>
                <p className="font-bold text-[#0F2D1F] mt-0.5">{gold_recovered_grams}</p>
              </div>
              <div>
                <span className="text-gray-400 font-medium">Copper Salvaged:</span>
                <p className="font-bold text-[#0F2D1F] mt-0.5">{copper_recovered_grams}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
              <div>
                Foundry Partner: <span className="font-semibold text-[#0F2D1F]">{foundry_name}</span>
              </div>
              <div>
                Issued Date: <span className="font-semibold text-[#0F2D1F]">{new Date(issued_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full border-2 border-[#10B981] flex items-center justify-center bg-[#D1FAE5]/40 text-[#0F2D1F]">
                <div className="text-center">
                  <div className="text-[9px] font-extrabold uppercase leading-none">VERIFIED</div>
                  <div className="text-[8px] font-bold text-[#10B981]">CIRCULAR</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-[#0F2D1F] flex items-center gap-1">
                  {verification_status}
                  <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                </div>
                <div className="text-[10px] text-gray-400">Cryptographic Hash: 0x89fa9b12e094</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif-eco text-base italic text-[#0F2D1F]">Dr. Ananya Nair</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Chief Sustainability Auditor</div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Certificate
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-full bg-[#0F2D1F] hover:bg-[#17422E] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-[#10B981]" />
            Download PDF
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Phone, 
  ShieldCheck, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';

export default function PickupTrackingMap({ 
  pickup, 
  onStatusUpdate, 
  onRecycleCompleted 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const courierMarkerRef = useRef(null);

  const defaultUserLat = pickup?.user_lat || 12.9352;
  const defaultUserLng = pickup?.user_lng || 77.6245;
  const defaultColLat = pickup?.collector_lat || 12.9580;
  const defaultColLng = pickup?.collector_lng || 77.6100;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [(defaultUserLat + defaultColLat) / 2, (defaultUserLng + defaultColLng) / 2],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Custom icon helper
      const createCustomIcon = (bgColor, iconHtml) => {
        return L.divIcon({
          className: 'custom-leaflet-icon',
          html: `<div style="background-color: ${bgColor}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 2px solid white;">${iconHtml}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });
      };

      // User pin
      L.marker([defaultUserLat, defaultUserLng], {
        icon: createCustomIcon('#0F2D1F', '<span style="color: white; font-size: 14px;">🏠</span>')
      }).addTo(map).bindPopup('<b>Your Doorstep</b><br/>Indiranagar / Bellandur');

      // Courier pin
      const courierMarker = L.marker([defaultColLat, defaultColLng], {
        icon: createCustomIcon('#10B981', '<span style="color: white; font-size: 14px;">🛵</span>')
      }).addTo(map).bindPopup('<b>GreenCycle EV Courier</b><br/>En Route');

      courierMarkerRef.current = courierMarker;

      // Polyline route
      L.polyline([
        [defaultColLat, defaultColLng],
        [defaultUserLat, defaultUserLng]
      ], {
        color: '#10B981',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.8
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const statuses = [
    { key: 'REQUESTED', label: 'Pickup Requested' },
    { key: 'ACCEPTED', label: 'Collector Accepted' },
    { key: 'COLLECTOR_ASSIGNED', label: 'Collector Assigned' },
    { key: 'ON_THE_WAY', label: 'Collector On The Way' },
    { key: 'COLLECTED', label: 'E-Waste Collected' },
    { key: 'RECYCLED', label: 'Recycling Completed' },
  ];

  const currentStatus = pickup?.status || 'ON_THE_WAY';
  const currentIndex = statuses.findIndex(s => s.key === currentStatus);

  const handleNextStatus = () => {
    if (currentIndex < statuses.length - 1) {
      const nextStatus = statuses[currentIndex + 1].key;
      onStatusUpdate(pickup.id, nextStatus);
      if (nextStatus === 'RECYCLED' && onRecycleCompleted) {
        onRecycleCompleted();
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Active In-Transit Header Card matching Stitch Dashboard style */}
      <div className="stitch-card-vault p-5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#10B981] flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#84CC16]">Live Tracking</span>
                <span className="stitch-badge-mint text-[10px] bg-[#10B981]/20 text-[#84CC16] border-[#84CC16]/30">
                  {pickup?.tracking_id || 'EC-8954-BLR'}
                </span>
              </div>
              <h3 className="font-serif-eco text-2xl font-bold text-white mt-1">
                {pickup?.item?.device_name || 'MacBook Pro 14"'}
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                {pickup?.status_note || 'Courier en route to doorstep • ETA 25 mins'}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center sm:text-right">
            <span className="text-[10px] uppercase font-bold text-gray-300">Estimated Arrival</span>
            <div className="font-serif-eco text-2xl font-bold text-[#84CC16]">
              {currentStatus === 'RECYCLED' ? 'Completed' : currentStatus === 'COLLECTED' ? 'At Foundry' : '25 mins'}
            </div>
          </div>
        </div>

        {/* Progress Bar with checkpoints */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] text-gray-300 mb-2 font-medium">
            <span className="flex items-center gap-1 text-[#84CC16]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Picked Up
            </span>
            <span className="text-white font-bold">{pickup?.progress_percent || 70}% Completed</span>
            <span className="flex items-center gap-1 text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5" /> Foundry Intake
            </span>
          </div>
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#10B981] to-[#84CC16] rounded-full transition-all duration-700" 
              style={{ width: `${pickup?.progress_percent || 70}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Map + Collector Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Map View */}
        <div className="lg:col-span-2 stitch-card overflow-hidden h-96 relative flex flex-col">
          <div className="p-3 bg-[#F6FBF5] border-b border-[#1A1F1C]/5 flex items-center justify-between text-xs font-semibold text-[#0F2D1F]">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
              Live Leaflet GPS Simulation
            </span>
            <span className="text-gray-500 text-[11px]">Indiranagar ⇄ Bellandur corridor</span>
          </div>
          <div ref={mapContainerRef} className="flex-1 w-full h-full z-10" />
        </div>

        {/* Collector Profile & Stepper Details */}
        <div className="space-y-4">
          
          {/* Collector Card */}
          <div className="stitch-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Assigned Logistics Partner</span>
              <span className="stitch-badge-mint text-[10px]">Verified EV</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0F2D1F] flex items-center justify-center text-[#10B981] text-lg font-bold">
                GC
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F2D1F]">GreenCycle Services</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span className="text-amber-500 font-bold">★ 4.8</span>
                  <span>•</span>
                  <span>Vikram (Courier Lead)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Zero-Emission EV Van</span>
              <a 
                href="tel:+919886098765" 
                className="flex items-center gap-1.5 text-[#10B981] font-bold hover:underline"
              >
                <Phone className="w-3.5 h-3.5" /> Call Courier
              </a>
            </div>
          </div>

          {/* Status Timeline Stepper */}
          <div className="stitch-card p-4">
            <h4 className="text-xs font-bold text-[#0F2D1F] uppercase tracking-wider mb-3">
              Chain of Custody Stepper
            </h4>

            <div className="space-y-3">
              {statuses.map((step, idx) => {
                const isDone = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step.key} className="flex items-start gap-2.5 text-xs">
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-[#84CC16]' : 'text-[#10B981]'}`} />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${isCurrent ? 'text-[#0F2D1F] font-bold' : isDone ? 'text-gray-700' : 'text-gray-400'}`}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simulation Action for Hackathon Evaluators */}
            {currentIndex < statuses.length - 1 && (
              <button
                onClick={handleNextStatus}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-[#F0F5EF] hover:bg-[#E5E9E4] text-[#0F2D1F] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#1A1F1C]/10"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                Simulate Next Status: {statuses[currentIndex + 1]?.label}
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

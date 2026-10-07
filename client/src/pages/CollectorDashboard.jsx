import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Phone, 
  DollarSign, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Power
} from 'lucide-react';

export default function CollectorDashboard({ onOpenTracking, onRecycleCompleted }) {
  const { currentUser } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPickups = async () => {
    try {
      const data = await api.getPickups();
      if (Array.isArray(data)) {
        setPickups(data);
      }
    } catch (e) {
      console.warn('Error fetching pickups:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleToggleAvailability = async () => {
    const nextVal = !isAvailable;
    setIsAvailable(nextVal);
    if (currentUser?.collector_id) {
      api.toggleCollectorAvailability(currentUser.collector_id, nextVal);
    }
  };

  const handleUpdateStatus = async (pickupId, newStatus) => {
    try {
      await api.updatePickupStatus(pickupId, newStatus);
      await fetchPickups();
      if (newStatus === 'RECYCLED' && onRecycleCompleted) {
        onRecycleCompleted();
      }
    } catch (e) {
      console.error('Failed to update pickup status:', e);
    }
  };

  // Group pickups
  const pendingRequests = pickups.filter(p => p.status === 'REQUESTED');
  const activeRuns = pickups.filter(p => ['ACCEPTED', 'COLLECTOR_ASSIGNED', 'ON_THE_WAY', 'COLLECTED'].includes(p.status));
  const completedRuns = pickups.filter(p => p.status === 'RECYCLED');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Collector Profile Header & Availability Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif-eco text-3xl font-normal text-[#0F2D1F]">
              GreenCycle Logistics Hub 🛵
            </h1>
            <span className="stitch-badge-mint text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              ISO 14001 Verified
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Partner ID: GC-BLR-09 • Indiranagar & Koramangala Hub
          </p>
        </div>

        {/* Availability Toggle */}
        <button
          onClick={handleToggleAvailability}
          className={`px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 ${
            isAvailable 
              ? 'bg-[#0F2D1F] text-[#84CC16] border border-[#84CC16]/30' 
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isAvailable ? 'Online for Instant Bookings' : 'Offline'}</span>
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-[#84CC16] animate-pulse' : 'bg-gray-400'}`}></span>
        </button>
      </div>

      {/* Collector Performance Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="stitch-card p-4">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Today's Pickups</span>
          <div className="font-serif-eco text-2xl font-bold text-[#0F2D1F] mt-1 font-tabular">
            {activeRuns.length + completedRuns.length}
          </div>
          <span className="text-[10px] text-[#10B981] font-semibold mt-1 block">100% on-schedule</span>
        </div>

        <div className="stitch-card p-4">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Pending Requests</span>
          <div className="font-serif-eco text-2xl font-bold text-amber-600 mt-1 font-tabular">
            {pendingRequests.length}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">Awaiting response</span>
        </div>

        <div className="stitch-card p-4">
          <span className="text-[10px] text-gray-500 uppercase font-bold">Service Rating</span>
          <div className="font-serif-eco text-2xl font-bold text-[#0F2D1F] mt-1">
            ★ 4.8
          </div>
          <span className="text-[10px] text-gray-400 mt-1 block">342 verified ratings</span>
        </div>

        <div className="stitch-card-vault p-4">
          <span className="text-[10px] text-gray-300 uppercase font-bold">Salvage Value Moved</span>
          <div className="font-serif-eco text-2xl font-bold text-[#84CC16] mt-1 font-tabular">
            ₹48,500
          </div>
          <span className="text-[10px] text-[#D1FAE5]/80 mt-1 block">+₹1,200 today</span>
        </div>
      </div>

      {/* Section 1: Pending Doorstep Pickup Requests (Accept / Reject) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <h3 className="font-serif-eco text-xl font-bold text-[#0F2D1F]">
              Incoming Pickup Requests
            </h3>
          </div>
          <span className="text-xs text-gray-500">{pendingRequests.length} waiting</span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="stitch-card p-6 text-center text-xs text-gray-400">
            No incoming pending requests at this moment. You are ready for new bookings!
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map(pickup => (
              <div key={pickup.id} className="stitch-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-amber-500">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#0F2D1F]">
                        {pickup?.item?.device_name || 'MacBook Pro / Electronics'}
                      </h4>
                      <span className="text-[10px] font-semibold bg-[#D1FAE5] text-[#0F2D1F] px-2 py-0.5 rounded-full">
                        ₹{pickup?.item?.estimated_value || 1200}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 flex flex-wrap items-center gap-2">
                      <span>Customer: <strong>{pickup?.user?.full_name || 'Sruthi'}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" /> {pickup?.pickup_address}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400" /> {pickup?.scheduled_time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleUpdateStatus(pickup.id, 'ACCEPTED')}
                    className="px-4 py-2 rounded-full bg-[#0F2D1F] hover:bg-[#17422E] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Accept Request
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(pickup.id, 'REJECTED')}
                    className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Active Courier Runs with 1-Click Status Advancements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
            <h3 className="font-serif-eco text-xl font-bold text-[#0F2D1F]">
              Active Courier Runs & Foundry Transits
            </h3>
          </div>
          <span className="stitch-badge-mint text-[10px]">Real-time logistics</span>
        </div>

        {activeRuns.length === 0 ? (
          <div className="stitch-card p-6 text-center text-xs text-gray-400">
            No active runs currently in transit.
          </div>
        ) : (
          <div className="space-y-4">
            {activeRuns.map(pickup => (
              <div key={pickup.id} className="stitch-card p-5 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-[#F0F5EF] px-2 py-0.5 rounded text-[#0F2D1F]">
                        {pickup.tracking_id}
                      </span>
                      <h4 className="text-sm font-bold text-[#0F2D1F]">
                        {pickup?.item?.device_name || 'Laptop'}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Customer: {pickup?.user?.full_name} ({pickup?.pickup_address})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="stitch-badge-mint text-[10px] uppercase font-bold">
                      {pickup.status.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => onOpenTracking(pickup)}
                      className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#0F2D1F] text-xs font-semibold flex items-center gap-1"
                    >
                      View Map <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Status Advancement Quick Bar */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-gray-600">
                    Next Action:
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {pickup.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateStatus(pickup.id, 'ON_THE_WAY')}
                        className="px-4 py-2 rounded-full bg-[#0F2D1F] text-white text-xs font-bold hover:bg-[#17422E] flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#10B981]" /> Mark "On The Way"
                      </button>
                    )}

                    {pickup.status === 'ON_THE_WAY' && (
                      <button
                        onClick={() => handleUpdateStatus(pickup.id, 'COLLECTED')}
                        className="px-4 py-2 rounded-full bg-[#0F2D1F] text-white text-xs font-bold hover:bg-[#17422E] flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> Mark "Collected & Weighed"
                      </button>
                    )}

                    {pickup.status === 'COLLECTED' && (
                      <button
                        onClick={() => handleUpdateStatus(pickup.id, 'RECYCLED')}
                        className="px-4 py-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white" /> Complete Foundry Melt & Certify!
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Completed Runs */}
      <div>
        <h3 className="font-serif-eco text-xl font-bold text-[#0F2D1F] mb-3">
          Completed & Certified Recyclings ({completedRuns.length})
        </h3>
        <div className="space-y-2">
          {completedRuns.slice(0, 3).map(p => (
            <div key={p.id} className="stitch-card p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <div>
                  <span className="font-bold text-[#0F2D1F]">{p?.item?.device_name || 'iPhone 13 Pro'}</span>
                  <span className="text-gray-500 ml-2">ID: {p.tracking_id}</span>
                </div>
              </div>
              <span className="text-[#10B981] font-bold">100% Melt Certified</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

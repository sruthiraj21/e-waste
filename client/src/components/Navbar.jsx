import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Sparkles, Truck, ShieldCheck, User, LogOut, CheckCircle2, ChevronDown, Leaf } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ onNavigate, activeTab }) {
  const { currentUser, role, switchRole } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      api.getNotifications(currentUser.id).then(data => {
        if (Array.isArray(data)) setNotifications(data);
      }).catch(() => {});
    }
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    notifications.forEach(n => {
      if (!n.read) api.markNotificationRead(n.id);
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F6FBF5]/90 backdrop-blur-md border-b border-[#1A1F1C]/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo & Name matching Stitch Screenshot */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#0F2D1F] flex items-center justify-center text-[#10B981] shadow-sm group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2">
              <circle cx="12" cy="12" r="9" strokeOpacity="0.4" />
              <path d="M12 7c2 2 3 5 1 8-2 3-5 2-6 0 1-3 3-5 5-8z" fill="#10B981" fillOpacity="0.8" />
              <path d="M16 11l2-2m-8 6l-2 2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <span className="font-serif-eco text-2xl font-semibold tracking-tight text-[#0F2D1F]">
              EcoCycle
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest text-[#10B981] bg-[#D1FAE5] px-2 py-0.5 rounded-full">
              Circularity OS
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#EBEFEA]/60 p-1 rounded-full border border-[#1A1F1C]/5">
          <button
            onClick={() => onNavigate('home')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'home' 
                ? 'bg-[#0F2D1F] text-[#F9FAF7] shadow-sm' 
                : 'text-[#1A1F1C]/70 hover:text-[#1A1F1C] hover:bg-white/50'
            }`}
          >
            Overview
          </button>
          
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-[#0F2D1F] text-[#F9FAF7] shadow-sm' 
                : 'text-[#1A1F1C]/70 hover:text-[#1A1F1C] hover:bg-white/50'
            }`}
          >
            User Vault
          </button>

          <button
            onClick={() => onNavigate('scan')}
            className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'scan' 
                ? 'bg-[#0F2D1F] text-[#F9FAF7] shadow-sm' 
                : 'text-[#10B981] font-bold hover:bg-[#D1FAE5]/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            AI Scan & Recycle
          </button>

          <button
            onClick={() => onNavigate('tracking')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'tracking' 
                ? 'bg-[#0F2D1F] text-[#F9FAF7] shadow-sm' 
                : 'text-[#1A1F1C]/70 hover:text-[#1A1F1C] hover:bg-white/50'
            }`}
          >
            Live Tracking
          </button>

          <button
            onClick={() => onNavigate('collector')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'collector' 
                ? 'bg-[#0F2D1F] text-[#F9FAF7] shadow-sm' 
                : 'text-[#1A1F1C]/70 hover:text-[#1A1F1C] hover:bg-white/50'
            }`}
          >
            Collector Hub
          </button>

          <button
            onClick={() => onNavigate('admin')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'admin' 
                ? 'bg-[#0F2D1F] text-[#F9FAF7] shadow-sm' 
                : 'text-[#1A1F1C]/70 hover:text-[#1A1F1C] hover:bg-white/50'
            }`}
          >
            Admin Impact
          </button>
        </nav>

        {/* Right Section: Role Switcher & Profile Avatar */}
        <div className="flex items-center gap-3">
          
          {/* Quick Role Switcher Pill (Critical for Hackathon demo) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#1A1F1C]/10 text-[#0F2D1F] shadow-xs hover:border-[#10B981]/50 transition-colors"
              title="Switch demo persona"
            >
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-wider text-gray-500">Role:</span>
              <span className="font-bold">{role}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#1A1F1C]/10 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Switch Hackathon Role
                </div>
                <button
                  onClick={() => { switchRole('USER'); setShowRoleMenu(false); onNavigate('dashboard'); }}
                  className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-[#F6FBF5] ${role === 'USER' ? 'text-[#10B981] font-bold bg-[#D1FAE5]/30' : 'text-[#1A1F1C]'}`}
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0F2D1F]" />
                    User (Sruthi)
                  </span>
                  {role === 'USER' && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
                </button>
                <button
                  onClick={() => { switchRole('COLLECTOR'); setShowRoleMenu(false); onNavigate('collector'); }}
                  className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-[#F6FBF5] ${role === 'COLLECTOR' ? 'text-[#10B981] font-bold bg-[#D1FAE5]/30' : 'text-[#1A1F1C]'}`}
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#0F2D1F]" />
                    Collector (Vikram)
                  </span>
                  {role === 'COLLECTOR' && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
                </button>
                <button
                  onClick={() => { switchRole('ADMIN'); setShowRoleMenu(false); onNavigate('admin'); }}
                  className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-[#F6FBF5] ${role === 'ADMIN' ? 'text-[#10B981] font-bold bg-[#D1FAE5]/30' : 'text-[#1A1F1C]'}`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0F2D1F]" />
                    Admin (Aisha)
                  </span>
                  {role === 'ADMIN' && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="w-10 h-10 rounded-full bg-white border border-[#1A1F1C]/10 flex items-center justify-center text-[#1A1F1C] hover:border-[#10B981]/40 transition-colors relative"
            >
              <Bell className="w-4 h-4 text-[#0F2D1F]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#10B981] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#1A1F1C]/10 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-[#0F2D1F]">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[11px] text-[#10B981] font-semibold hover:underline">
                      Mark read
                    </button>
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2 mt-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">No notifications</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`p-2.5 rounded-xl text-xs ${n.read ? 'bg-gray-50' : 'bg-[#D1FAE5]/30 border border-[#10B981]/20'}`}>
                        <div className="font-semibold text-[#0F2D1F] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                          {n.title}
                        </div>
                        <div className="text-gray-600 mt-1 text-[11px] leading-relaxed">{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Avatar Circle from Stitch Prototype */}
          <div 
            onClick={() => onNavigate('dashboard')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-[#1A1F1C]/10 group-hover:ring-[#10B981] transition-all">
              <img 
                src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}

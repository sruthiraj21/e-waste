import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const DEMO_PROFILES = {
  USER: {
    id: 'usr_sruthi_101',
    full_name: 'Sruthi Sundaram',
    email: 'sruthi@ecocycle.in',
    phone: '+91 98450 12345',
    role: 'USER',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    address: 'Flat 402, Green Glen Layout, Bellandur',
    city: 'Bengaluru',
    green_points: 450,
    recycled_kg: 12.5,
    co2_avoided_kg: 8.2,
    pickups_count: 6,
    rank: 'Eco Warrior (Tier 4)'
  },
  COLLECTOR: {
    id: 'col_vikram_201',
    collector_id: 'col_rec_1',
    full_name: 'Vikram Sharma',
    business_name: 'GreenCycle Services',
    email: 'vikram@greencycle.in',
    phone: '+91 98860 98765',
    role: 'COLLECTOR',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    address: 'Plot 12, Industrial Area, Koramangala',
    city: 'Bengaluru',
    verification_status: 'VERIFIED',
    rating: 4.8
  },
  ADMIN: {
    id: 'adm_aisha_301',
    full_name: 'Aisha Rao',
    email: 'aisha@ecocycle.in',
    phone: '+91 97410 54321',
    role: 'ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    address: 'EcoCycle HQ, Indiranagar',
    city: 'Bengaluru'
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ecocycle_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEMO_PROFILES.USER;
  });

  const [role, setRole] = useState(currentUser?.role || 'USER');

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ecocycle_user', JSON.stringify(currentUser));
      setRole(currentUser.role);
    }
  }, [currentUser]);

  const switchRole = (newRole) => {
    const profile = DEMO_PROFILES[newRole] || DEMO_PROFILES.USER;
    setCurrentUser(profile);
    setRole(newRole);
  };

  const login = async (email, selectedRole = 'USER') => {
    try {
      const data = await api.login(email, selectedRole);
      if (data.user) {
        setCurrentUser(data.user);
        setRole(data.user.role);
        return data.user;
      }
    } catch (e) {
      console.warn('API login failed, falling back to local profile:', e);
      const profile = DEMO_PROFILES[selectedRole] || {
        ...DEMO_PROFILES.USER,
        email,
        full_name: email.split('@')[0]
      };
      setCurrentUser(profile);
      setRole(selectedRole);
      return profile;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ecocycle_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, role, setCurrentUser, switchRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

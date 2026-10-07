import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/UserDashboard';
import ScanAndRecyclePage from './pages/ScanAndRecyclePage';
import CollectorDashboard from './pages/CollectorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PickupTrackingMap from './components/PickupTrackingMap';
import RecyclingSuccessModal from './components/RecyclingSuccessModal';
import CertificateModal from './components/CertificateModal';
import { api } from './services/api';

function MainApp() {
  const { currentUser, role } = useAuth();
  
  // Navigation tab: 'home' | 'dashboard' | 'scan' | 'tracking' | 'collector' | 'admin'
  const [activeTab, setActiveTab] = useState('home');
  const [activePickup, setActivePickup] = useState(null);
  const [showRecycleModal, setShowRecycleModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Sync default view when role changes
  useEffect(() => {
    if (role === 'COLLECTOR') setActiveTab('collector');
    else if (role === 'ADMIN') setActiveTab('admin');
  }, [role]);

  // Load default in-flight pickup
  useEffect(() => {
    if (currentUser?.id) {
      api.getPickups().then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const inFlight = data.find(p => p.status !== 'RECYCLED') || data[0];
          setActivePickup(inFlight);
        }
      }).catch(() => {});
    }
  }, [currentUser]);

  const handlePickupBooked = (newPickup) => {
    setActivePickup(newPickup);
    setActiveTab('tracking');
  };

  const handleOpenTracking = (pickup) => {
    setActivePickup(pickup);
    setActiveTab('tracking');
  };

  const handleStatusUpdate = async (pickupId, status) => {
    try {
      const updated = await api.updatePickupStatus(pickupId, status);
      setActivePickup(updated);
      if (status === 'RECYCLED') {
        setShowRecycleModal(true);
      }
    } catch (e) {
      console.error('Status update failed:', e);
    }
  };

  const handleOpenCertificate = (certData = null) => {
    const defaultCert = {
      certificate_number: 'CERT-EC-2026-89120-BLR',
      device_name: 'iPhone 13 Pro (128GB Midnight)',
      recycled_weight: 2.4,
      co2_avoided: 1.8,
      water_saved_liters: 320,
      gold_recovered_grams: '0.034g 24K Gold',
      copper_recovered_grams: '14.2g Pure Copper',
      foundry_name: 'Valo CleanMetallurgy & EcoCycle Zurich Partner',
      issued_at: new Date().toISOString(),
      verification_status: '100% Chain-of-Custody Verified',
      rank_unlocked: 'Eco Warrior Rank (Tier 4)'
    };
    setSelectedCertificate(certData && certData.certificate_number ? certData : defaultCert);
    setShowCertModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6FBF5] text-[#1A1F1C]">
      
      {/* Top Navbar */}
      <Navbar onNavigate={setActiveTab} activeTab={activeTab} />

      {/* Main View Area */}
      <main className="flex-1 pb-20 md:pb-8">
        {activeTab === 'home' && (
          <LandingPage 
            onStartRecycle={() => setActiveTab('scan')} 
            onExploreDashboard={() => setActiveTab('dashboard')} 
          />
        )}

        {activeTab === 'dashboard' && (
          <UserDashboard 
            onStartScan={() => setActiveTab('scan')}
            onTrackPickup={(p) => handleOpenTracking(p)}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {activeTab === 'scan' && (
          <ScanAndRecyclePage 
            onPickupBooked={handlePickupBooked}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'tracking' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            <PickupTrackingMap 
              pickup={activePickup}
              onStatusUpdate={handleStatusUpdate}
              onRecycleCompleted={() => setShowRecycleModal(true)}
            />
          </div>
        )}

        {activeTab === 'collector' && (
          <CollectorDashboard 
            onOpenTracking={handleOpenTracking}
            onRecycleCompleted={() => setShowRecycleModal(true)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Bottom Mobile Navigation */}
      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} />

      {/* Memorable Recycling Completion Modal matching Stitch Screenshot */}
      <RecyclingSuccessModal 
        isOpen={showRecycleModal}
        onClose={() => setShowRecycleModal(false)}
        onViewCertificate={() => handleOpenCertificate()}
        data={{
          deviceName: activePickup?.item?.device_name || 'iPhone 13 Pro (128GB)',
          batchId: 'Batch #89120',
          recycledWeight: activePickup?.item?.estimated_weight || 2.4,
          co2Avoided: (Number(activePickup?.item?.estimated_weight || 2.4) * 0.75).toFixed(1),
          waterSaved: '320',
          pointsAdded: '100'
        }}
      />

      {/* Verifiable Certificate Modal */}
      <CertificateModal 
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        certificate={selectedCertificate}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

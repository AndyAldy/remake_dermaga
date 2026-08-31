import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import GuestView from './pages/GuestView';
import SeleksiView from './pages/SeleksiView';
import PelaksanaanView from './pages/PelaksanaanView';
import AuthModal from './Auth/AuthModal';
import AdminLayout from './pages/Admin/AdminLayout';

const defaultQuotas = [
  { id: 1, divisi: "Pengolahan Data & Statistik", total: 15, terisi: 12 },
  { id: 2, divisi: "Pengembangan IT (Web/Apps)", total: 5, terisi: 4 }, 
  { id: 3, divisi: "Administrasi Perkantoran", total: 10, terisi: 4 },
];

const defaultPendaftar = [
  { id: 1, nama: "Andy Aldyansyah", nim: "A11.2023.12345", asal: "Universitas Duta Bangsa", periode: "3 Bulan", divisiId: 2, status: "pending" },
  { id: 2, nama: "Budi Santoso", nim: "23019234", asal: "SMKN 7 Semarang", periode: "2 Bulan", divisiId: 1, status: "pending" },
  { id: 3, nama: "Siti Aminah", nim: "240201191", asal: "Universitas Diponegoro", periode: "1 Bulan", divisiId: 3, status: "pending" },
];

const getInitialData = (key, defaultData) => {
  const savedData = localStorage.getItem(key);
  if (savedData) {
    try { return JSON.parse(savedData); } catch (e) { return defaultData; }
  }
  return defaultData;
};

function App() {
  const [user, setUser] = useState(() => getInitialData('simba_user', null));
  const [quotas, setQuotas] = useState(() => getInitialData('simba_quotas', defaultQuotas));
  const [pendaftar, setPendaftar] = useState(() => getInitialData('simba_pendaftar', defaultPendaftar));
  
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  useEffect(() => { localStorage.setItem('simba_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('simba_quotas', JSON.stringify(quotas)); }, [quotas]);
  useEffect(() => { localStorage.setItem('simba_pendaftar', JSON.stringify(pendaftar)); }, [pendaftar]);

  const handleOpenAuth = (mode) => setAuthModal({ isOpen: true, mode });
  const handleCloseAuth = () => setAuthModal({ isOpen: false, mode: 'login' });

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    handleCloseAuth();
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (user?.status === 'admin') {
    return (
      <AdminLayout 
        user={user} 
        onLogout={handleLogout} 
        quotas={quotas} 
        setQuotas={setQuotas}
        pendaftar={pendaftar}
        setPendaftar={setPendaftar}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} onOpenAuth={handleOpenAuth} />

      <main className="flex-grow w-full">
        {!user && <GuestView onOpenAuth={handleOpenAuth} quotas={quotas} />}
        
        {/* BAGIAN INI DIPERBARUI: Mengirim properti lengkap ke form pendaftaran */}
        {user?.status === 'seleksi' && (
          <SeleksiView 
            quotas={quotas} 
            pendaftar={pendaftar} 
            setPendaftar={setPendaftar} 
            user={user}
            setUser={setUser}
          />
        )}
        
        {user?.status === 'lulus' && <PelaksanaanView />}
      </main>
      
      <Footer />

      <AuthModal 
        isOpen={authModal.isOpen} 
        initialMode={authModal.mode} 
        onClose={handleCloseAuth} 
        onAuthSuccess={handleAuthSuccess} 
      />
    </div>
  );
}

export default App;
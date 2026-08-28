import React, { useState } from 'react';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import GuestView from './pages/GuestView';
import SeleksiView from './pages/SeleksiView';
import PelaksanaanView from './pages/PelaksanaanView';
import AuthModal from './components/AuthModal';
import AdminLayout from './pages/Admin/AdminLayout';

function App() {
  const [user, setUser] = useState(null); 
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  // === DATA GLOBAL: KUOTA & PENDAFTAR ===
  const [quotas, setQuotas] = useState([
    { id: 1, divisi: "Pengolahan Data & Statistik", total: 15, terisi: 12 },
    { id: 2, divisi: "Pengembangan IT (Web/Apps)", total: 5, terisi: 4 }, 
    { id: 3, divisi: "Administrasi Perkantoran", total: 10, terisi: 4 },
  ]);

  const [pendaftar, setPendaftar] = useState([
    { id: 1, nama: "Andy Aldyansyah", nim: "A11.2023.12345", asal: "Universitas Duta Bangsa", periode: "3 Bulan", divisiId: 2, status: "pending" },
    { id: 2, nama: "Budi Santoso", nim: "23019234", asal: "SMKN 7 Semarang", periode: "2 Bulan", divisiId: 1, status: "pending" },
    { id: 3, nama: "Siti Aminah", nim: "240201191", asal: "Universitas Diponegoro", periode: "1 Bulan", divisiId: 3, status: "pending" },
  ]);

  const handleOpenAuth = (mode) => setAuthModal({ isOpen: true, mode });
  const handleCloseAuth = () => setAuthModal({ isOpen: false, mode: 'login' });

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    handleCloseAuth();
  };

  const handleLogout = () => setUser(null);

  // Jika Admin yang login
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
        {/* Kirim data quotas ke halaman yang membutuhkannya */}
        {!user && <GuestView onOpenAuth={handleOpenAuth} quotas={quotas} />}
        {user?.status === 'seleksi' && <SeleksiView quotas={quotas} />}
        {user?.status === 'lulus' && <PelaksanaanView />}
      </main>
      
      <Footer />

      <AuthModal isOpen={authModal.isOpen} initialMode={authModal.mode} onClose={handleCloseAuth} onAuthSuccess={handleAuthSuccess} />
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import GuestView from './pages/GuestView';
import SeleksiView from './pages/SeleksiView';
import PelaksanaanView from './pages/PelaksanaanView';
import AuthModal from './components/AuthModal';
import AdminLayout from './pages/Admin/AdminLayout';

// === DATA BAWAAN JIKA BROWSER KOSONG ===
const initialQuotas = [
  { id: 1, divisi: "Pengolahan Data & Statistik", total: 15, terisi: 12 },
  { id: 2, divisi: "Pengembangan IT (Web/Apps)", total: 5, terisi: 4 }, 
  { id: 3, divisi: "Administrasi Perkantoran", total: 10, terisi: 4 },
];

const initialPendaftar = [
  { id: 1, nama: "Andy Aldyansyah", nim: "A11.2023.12345", asal: "Universitas Duta Bangsa", periode: "3 Bulan", divisiId: 2, status: "pending" },
  { id: 2, nama: "Budi Santoso", nim: "23019234", asal: "SMKN 7 Semarang", periode: "2 Bulan", divisiId: 1, status: "pending" },
  { id: 3, nama: "Siti Aminah", nim: "240201191", asal: "Universitas Diponegoro", periode: "1 Bulan", divisiId: 3, status: "pending" },
];

function App() {
  // === 1. INISIALISASI STATE MENGGUNAKAN LOCAL STORAGE ===
  // Mengambil data dari memori browser, jika tidak ada, gunakan data bawaan di atas.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('simba_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [quotas, setQuotas] = useState(() => {
    const savedQuotas = localStorage.getItem('simba_quotas');
    return savedQuotas ? JSON.parse(savedQuotas) : initialQuotas;
  });

  const [pendaftar, setPendaftar] = useState(() => {
    const savedPendaftar = localStorage.getItem('simba_pendaftar');
    return savedPendaftar ? JSON.parse(savedPendaftar) : initialPendaftar;
  });

  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  // === 2. SIMPAN OTOMATIS KE LOCAL STORAGE JIKA ADA PERUBAHAN ===
  // Setiap kali 'user', 'quotas', atau 'pendaftar' berubah, otomatis simpan ke memori browser.
  useEffect(() => {
    localStorage.setItem('simba_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('simba_quotas', JSON.stringify(quotas));
  }, [quotas]);

  useEffect(() => {
    localStorage.setItem('simba_pendaftar', JSON.stringify(pendaftar));
  }, [pendaftar]);


  // === FUNGSI OTENTIKASI ===
  const handleOpenAuth = (mode) => setAuthModal({ isOpen: true, mode });
  const handleCloseAuth = () => setAuthModal({ isOpen: false, mode: 'login' });

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    handleCloseAuth();
  };

  const handleLogout = () => {
    setUser(null);
  };

  // === RENDER HALAMAN ===
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
        {user?.status === 'seleksi' && <SeleksiView quotas={quotas} />}
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
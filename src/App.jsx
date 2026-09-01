import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import GuestView from './pages/GuestView';
import SeleksiView from './pages/SeleksiView';
import PelaksanaanView from './pages/PelaksanaanView';
import AuthModal from './Auth/AuthModal';
import AdminLayout from './pages/Admin/AdminLayout';

function App() {
  // FITUR BARU: SAVE STATE SESSION
  // Membaca memori browser saat web pertama kali dimuat
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('dermaga_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [quotas, setQuotas] = useState([]);
  const [pendaftar, setPendaftar] = useState([]);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  // FITUR BARU: AUTOSAVE SESSION
  // Menyimpan data user ke memori browser setiap kali ada perubahan login/logout
  useEffect(() => {
    if (user) {
      localStorage.setItem('dermaga_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('dermaga_session');
    }
  }, [user]);

  const refreshData = async () => {
    try {
      const resQuotas = await fetch('http://localhost:5000/api/quotas');
      setQuotas(await resQuotas.json());

      const resPendaftar = await fetch('http://localhost:5000/api/pendaftar');
      setPendaftar(await resPendaftar.json());
    } catch (error) {
      console.error("Gagal terhubung ke database", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleOpenAuth = (mode) => setAuthModal({ isOpen: true, mode });
  const handleCloseAuth = () => setAuthModal({ isOpen: false, mode: 'login' });

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    handleCloseAuth();
  };

  const handleLogout = () => setUser(null);

  if (user?.role === 'admin') {
    return (
      <AdminLayout 
        user={user} 
        onLogout={handleLogout} 
        quotas={quotas} 
        setQuotas={setQuotas}
        pendaftar={pendaftar}
        refreshData={refreshData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} onOpenAuth={handleOpenAuth} />

<main className="flex-grow w-full">
        {!user ? (
          <GuestView onOpenAuth={handleOpenAuth} quotas={quotas} />
        ) : user.status === 'lulus' ? (
          <PelaksanaanView />
        ) : (
          <SeleksiView 
            quotas={quotas} 
            pendaftar={pendaftar} 
            user={user}
            refreshData={refreshData}
          />
        )}
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
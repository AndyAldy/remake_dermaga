import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import GuestView from './pages/GuestView';
import SeleksiView from './pages/SeleksiView';
import PelaksanaanView from './pages/PelaksanaanView';
import AuthModal from './Auth/AuthModal';
import AdminLayout from './pages/Admin/AdminLayout';

function App() {
  const [user, setUser] = useState(null);
  const [quotas, setQuotas] = useState([]);
  const [pendaftar, setPendaftar] = useState([]);
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

  // Fungsi untuk mengambil data dari Backend MySQL
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

  // Panggil refreshData saat aplikasi pertama kali dibuka
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
        {!user && <GuestView onOpenAuth={handleOpenAuth} quotas={quotas} />}
        {user?.status === 'seleksi' && (
          <SeleksiView 
            quotas={quotas} 
            pendaftar={pendaftar} 
            user={user}
            setUser={setUser}
            refreshData={refreshData} // Kirim fungsi refresh ke Form
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
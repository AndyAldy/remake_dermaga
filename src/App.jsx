import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GuestView from './pages/GuestView';
import SeleksiView from './pages/SeleksiView';
import PelaksanaanView from './pages/PelaksanaanView';
import AdminLayout from './pages/Admin/AdminLayout';
import { supabase } from './supabase';
import './styles/App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [quotas, setQuotas] = useState([]);
  const [pendaftar, setPendaftar] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. FUNGSI UTAMA UNTUK MENARIK SEMUA DATA DARI SUPABASE
  const fetchData = async () => {
    try {
      // Ambil data Divisi (Kuota)
      const { data: qData, error: qError } = await supabase.from('divisi').select('*');
      if (qError) throw qError;
      
      if (qData) {
        setQuotas(qData.map(item => ({
          id: item.id,
          divisi: item.nama_divisi,
          total: item.total_kuota,
          terisi: item.terisi || 0
        })));
      }

      // Ambil data Pendaftar
      const { data: pData, error: pError } = await supabase.from('pendaftaran').select('*');
      if (pError) throw pError;
      
      if (pData) {
        setPendaftar(pData);
      }
    } catch (error) {
      console.error('Gagal memuat data dari Supabase:', error.message);
    }
  };

  // 2. DETEKSI OTOMATIS SAAT WEB DIBUKA & PANTAU STATUS LOGIN
  useEffect(() => {
    // Tarik data tabel
    fetchData();

    // Cek apakah ada user yang sudah login sebelumnya (saat di-refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) handleUserSession(session.user);
      setLoading(false);
    });

    // Listener jika user melakukan Login / Logout
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        handleUserSession(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 3. LOGIKA PEMBAGIAN ROLE (ADMIN VS PESERTA)
  const handleUserSession = (u) => {
    // Jika yang login adalah email admin
    if (u.email === 'admin@bps.go.id') {
      setUser({ 
        id: u.id, 
        email: u.email, 
        name: 'Administrator', 
        role: 'admin', 
      });
    } else {
      // Jika yang login adalah peserta biasa
      setUser({
        id: u.id,
        email: u.email,
        name: u.user_metadata?.nama_lengkap || u.email,
        role: u.user_metadata?.role || 'peserta',
        status: u.user_metadata?.status_akun || 'seleksi'
      });
    }
  };

  // 4. FUNGSI LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Tampilkan layar putih sementara saat mengecek sesi login
  if (loading) {
    return <div className="flex h-screen items-center justify-center font-bold text-slate-500">Memuat Sistem...</div>;
  }

  // 5. PENGATURAN TAMPILAN HALAMAN (ROUTING)
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Jika GuestView sudah punya Navbar sendiri, Navbar ini bisa diatur opsional */}
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="flex-grow">
        {!user ? (
          // Jika belum login, tampilkan Beranda (GuestView)
          <GuestView />
        ) : user.role === 'admin' ? (
          // Jika login sebagai Admin, tampilkan Panel Admin
          <AdminLayout quotas={quotas} pendaftar={pendaftar} refreshData={fetchData} />
        ) : user.status === 'lulus' ? (
          // Jika peserta dinyatakan lulus, arahkan ke Pelaksanaan
          <PelaksanaanView user={user} />
        ) : (
          // Jika peserta baru mendaftar atau pending, arahkan ke Seleksi
          <SeleksiView quotas={quotas} pendaftar={pendaftar} user={user} refreshData={fetchData} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
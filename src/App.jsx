import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GuestView from './pages/GuestView';
import SeleksiView from './pages/SeleksiView';
import PelaksanaanView from './pages/PelaksanaanView';
import AdminLayout from './pages/Admin/AdminLayout';
import { supabase } from './supabase';
import AuthModal from './Auth/AuthModal';
import './styles/App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [quotas, setQuotas] = useState([]);
  const [pendaftar, setPendaftar] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tambahan state untuk Auth Modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };


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

const handleUserSession = async (u) => {
    // 1. Ambil email dasar
    const email = u.email || '';

    // 2. Ambil nama secara cerdas
    const fullName = u.user_metadata?.display_name || 
                     u.user_metadata?.nama_lengkap || 
                     u.name || 
                     email.split('@')[0];

    // 3. Ambil role dasar
    const role = u.user_metadata?.role || u.role || 'peserta';
    
    // Default status awal dari metadata
    let statusAktif = u.user_metadata?.status_akun || 'seleksi';

    // Pengecekan Akun Demo & Admin
    if (email === 'admin@bps.go.id') {
      setUser({ id: u.id, email, name: 'Administrator', role: 'admin', status: 'lulus' });
      return;
    } 
    else if (email === 'peserta.lulus@bps.go.id') {
      setUser({ id: u.id, email, name: 'Budi Peserta Lulus (Demo)', role: 'peserta', status: 'lulus' });
      return;
    } 
    else if (email === 'peserta.seleksi@bps.go.id') {
      setUser({ id: u.id, email, name: 'Ani Peserta Seleksi (Demo)', role: 'peserta', status: 'seleksi' });
      return;
    } 

    // UNTUK USER BIASA: Cek kolom 'status_akun' langsung ke tabel 'pendaftaran' di Database Supabase
// UNTUK USER BIASA: Cek kolom 'status_seleksi' langsung ke tabel 'pendaftaran' di Supabase
    try {
      const { data: regData } = await supabase
        .from('pendaftaran')
        .select('status_seleksi') // <-- Mengambil kolom status_seleksi
        .eq('user_id', u.id)
        .maybeSingle();

      if (regData && regData.status_seleksi) {
        statusAktif = regData.status_seleksi; // Bisa bernilai 'pending', 'diterima', atau 'ditolak'
      }
    } catch (err) {
      console.error("Gagal mengecek status seleksi:", err);
    }

    // Set user ke state aplikasi
    setUser({
      id: u.id,
      email: email,
      name: fullName, 
      role: role,
      // Jika status_seleksi di database bernilai 'diterima', arahkan ke halaman pelaksanaan ('lulus')
      status: (statusAktif === 'diterima' ? 'lulus' : 'seleksi')
    });

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
      <Navbar user={user} onLogout={handleLogout} onOpenAuth={handleOpenAuth} />
      
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        initialMode={authMode} 
        onAuthSuccess={(userData) => {
          handleUserSession(userData);
          setIsAuthOpen(false);
        }} 
      />
      
      <main className="flex-grow">        {!user ? (
          // Jika belum login, tampilkan Beranda (GuestView)
          <GuestView quotas={quotas} />
        ) : user.role === 'admin' ? (
          // Jika login sebagai Admin, tampilkan Panel Admin
          <AdminLayout quotas={quotas} pendaftar={pendaftar} refreshData={fetchData} />
        ) : user.status === 'lulus' || user.status === 'diterima' ? (
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
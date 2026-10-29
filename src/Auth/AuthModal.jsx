import React, { useState, useEffect } from 'react';
import FadeIn from '../components/FadeIn';
import { supabase } from '../supabase';
import '../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode, onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode || 'login');
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memastikan card yang muncul sesuai dengan tombol Navbar yang diklik
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'login');
      setUsername('');
      setPassword('');
      setName('');
      setShowPassword(false);
    }
  }, [isOpen, initialMode]);
  
  if (!isOpen) return null;

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setShowPassword(false);
    setUsername(''); setPassword(''); setName('');
  };

  // Proses Utama (Login atau Registrasi)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.includes(' ')) return alert("Username tidak boleh menggunakan spasi!");
    setIsLoading(true);

    // Trik Pseudo-Email: Menggabungkan username dengan domain dummy untuk syarat Supabase Auth
    const dummyEmail = `${username.toLowerCase()}@dermaga.local`;

    try {
      if (mode === 'login') {
        // --- LOGIKA LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: dummyEmail, // Menggunakan dummyEmail dari username
          password: password,
        });

        if (error) throw error;

        const user = data.user;
        
        // Memastikan nama lengkap diambil dari user_metadata
        const fullName = user.user_metadata?.nama_lengkap || user.user_metadata?.display_name || username;

        onAuthSuccess({
          id: user.id,
          name: fullName,
          email: user.email,
          role: user.user_metadata?.role || 'peserta',
          status: user.user_metadata?.status_akun || 'seleksi'
        });

      } else {
        // --- LOGIKA REGISTRASI (Daftar Akun) ---
        const { error } = await supabase.auth.signUp({
          email: dummyEmail, // Menggunakan dummyEmail dari username
          password: password,
          options: {
            data: { 
              display_name: username, // Menyimpan username ke display_name sesuai permintaan
              nama_lengkap: name,     // Menyimpan Nama Lengkap ke metadata
              role: 'peserta', 
              status_akun: 'seleksi' 
            }
          }
        });

        if (error) throw error;

        alert('Pendaftaran Berhasil! Silakan masuk menggunakan username dan kata sandi yang baru saja Anda buat.');
        
        // Bersihkan password dan pindah ke mode login (TIDAK memanggil onAuthSuccess)
        setMode('login');
        setPassword('');
        setName('');
        // Username tidak di-reset agar user tidak perlu mengetik ulang saat login
      }
    } catch (error) {
      console.error(error);
      alert(error.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <FadeIn direction="up">
        <div className="auth-box">
          <button onClick={onClose} className="auth-close-btn">X</button>

          <div className="auth-content">
            <div className="auth-header">
              <h2 className="auth-title">{mode === 'login' ? 'Masuk' : 'Daftar Akun'}</h2>
              <p className="auth-subtitle">{mode === 'login' ? 'Gunakan akun terdaftar Anda.' : 'Buat akun baru untuk mulai mendaftar magang.'}</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {mode === 'register' && (
                <div>
                  <label className="auth-label">Nama Lengkap</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Sesuai KTP/KTM" />
                </div>
              )}
              
              <div>
                {/* Label dan Input diganti dari Email menjadi Username */}
                <label className="auth-label">Username</label>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" placeholder="Masukkan username" />
              </div>

              <div>
                <label className="auth-label">Kata Sandi</label>
                <div className="auth-pwd-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="input-field pr-12" 
                    placeholder="••••••••" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="auth-pwd-toggle"
                    title={showPassword ? "Sembunyikan Sandi" : "Tampilkan Sandi"}
                  >
                    {showPassword ? "🙈" : "🙉"}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary">
                {isLoading ? 'Memproses...' : (mode === 'login' ? 'Masuk' : 'Daftar Sekarang')}
              </button>
            </form>
            
            <div className="auth-footer">
              {mode === 'login' ? "Belum punya akun? " : "Sudah punya akun? "}
              <button type="button" onClick={toggleMode} className="auth-link">
                {mode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
              </button>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default AuthModal;
import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';
import { supabase } from '../supabase';
import '../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode, onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState(''); // Berfungsi sebagai Email
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  if (!isOpen) return null;

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setShowPassword(false);
    setUsername(''); setPassword(''); setName('');
  };

  // Proses Utama (Login atau Registrasi Langsung)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.includes('@') || !username.includes('.')) return alert("Email tidak valid!");
    setIsLoading(true);

    try {
      if (mode === 'login') {
        // --- LOGIKA LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password: password,
        });

        if (error) throw error;

        const user = data.user;
        
        // Ambil nama lengkap dari metadata, jika kosong fallback ke nama dari email (huruf sebelum @)
        const fallbackName = user.email.split('@')[0];
        const fullName = user.user_metadata?.nama_lengkap || fallbackName;

        onAuthSuccess({
          id: user.id,
          name: fullName,
          email: user.email,
          role: user.user_metadata?.role || 'peserta',
          status: user.user_metadata?.status_akun || 'seleksi'
        });

      } else {
        // --- LOGIKA REGISTRASI ---
        const { data, error } = await supabase.auth.signUp({
          email: username,
          password: password,
          options: {
            data: { 
              nama_lengkap: name, 
              role: 'peserta', 
              status_akun: 'seleksi' 
            }
          }
        });

        if (error) throw error;

        // Setelah sukses mendaftar, arahkan pengguna ke form login dan berikan notifikasi
        alert('Pendaftaran Berhasil! Silakan masuk menggunakan email dan kata sandi yang baru saja dibuat.');
        
        // Reset form & ubah mode kembali ke login
        setMode('login');
        setPassword('');
        setOtpCode?.('');
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
                <label className="auth-label">Alamat Email Aktif</label>
                <input type="email" required value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" placeholder="nama@email.com" />
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
import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';
import { supabase } from '../supabase'; // Hubungkan ke konfigurasi supabase.js
import '../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode, onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState(''); // Berfungsi sebagai Email
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  if (!isOpen) return null;

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setOtpSent(false); setOtpCode(''); setShowPassword(false);
    setUsername(''); setPassword(''); setName('');
  };

  // 1. KIRIM OTP / SIGN UP AWAL MENGGUNAKAN SUPABASE AUTH
  const handleSendOTP = async () => {
    if (!username.includes('@') || !username.includes('.')) return alert("Email tidak valid!");
    setIsLoading(true);
    
    try {
      // Supabase mengirimkan Magic Link / OTP ke email pengguna
      const { error } = await supabase.auth.signInWithOtp({
        email: username,
        options: {
          data: { nama_lengkap: name } // Menyimpan nama lengkap ke metadata user
        }
      });

      if (error) throw error;

      alert("Kode verifikasi/OTP telah dikirim ke email Anda. Cek kotak masuk/spam!");
      setOtpSent(true);
    } catch (error) {
      console.error(error);
      alert(error.message || "Gagal mengirim OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. PROSES UTAMA (LOGIN ATAU VERIFIKASI OTP REGISTRASI)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        // --- LOGIKA LOGIN ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password: password,
        });

        if (error) throw error;

        // Ambil data tambahan dari tabel 'users' jika ada, atau gunakan data auth
        const user = data.user;
        onAuthSuccess({
          id: user.id,
          name: user.user_metadata?.nama_lengkap || user.email,
          email: user.email,
          role: user.user_metadata?.role || 'peserta',
          status: user.user_metadata?.status_akun || 'seleksi'
        });

      } else {
        // --- LOGIKA VERIFIKASI OTP & REGISTRASI ---
        if (!otpSent || !otpCode) {
          setIsLoading(false);
          return alert("Silakan masukkan kode OTP yang dikirim ke email Anda!");
        }

        // Verifikasi token OTP dengan Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          email: username,
          token: otpCode,
          type: 'email'
        });

        if (error) throw error;

        // Setelah email terverifikasi, update password pengguna
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
          data: { nama_lengkap: name, role: 'peserta', status_akun: 'seleksi' }
        });

        if (updateError) throw updateError;

        alert('Pendaftaran Berhasil! Akun Anda telah aktif. Silakan masuk.');
        toggleMode();
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
              <p className="auth-subtitle">{mode === 'login' ? 'Gunakan akun terdaftar Anda.' : 'Verifikasi email dengan OTP.'}</p>
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
                <div className="auth-input-group">
                  <input type="email" required value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" placeholder="nama@email.com" />
                  {mode === 'register' && !otpSent && (
                    <button type="button" onClick={handleSendOTP} disabled={isLoading} className="auth-btn-otp">
                      {isLoading ? 'Mengirim...' : 'Kirim OTP'}
                    </button>
                  )}
                </div>
              </div>

              {mode === 'register' && otpSent && (
                <FadeIn direction="up">
                  <div className="auth-otp-box">
                    <label className="auth-otp-label">Masukkan Kode OTP dari Email</label>
                    <input type="text" required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="auth-otp-input" placeholder="Masukkan token OTP" />
                  </div>
                </FadeIn>
              )}

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
                {isLoading ? 'Memproses...' : (mode === 'login' ? 'Masuk' : 'Verifikasi & Daftar')}
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
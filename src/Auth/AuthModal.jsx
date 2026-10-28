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
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  if (!isOpen) return null;

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setOtpSent(false); setOtpCode(''); setShowPassword(false);
    setUsername(''); setPassword(''); setName('');
  };

  // 1. KIRIM OTP (Minta Supabase mengirim 6-digit angka ke email)
  const handleSendOTP = async () => {
    if (!username.includes('@') || !username.includes('.')) return alert("Email tidak valid!");
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: username,
        options: {
          shouldCreateUser: true, // Pastikan membuat user baru jika belum ada
          data: { nama_lengkap: name }
        }
      });

      if (error) throw error;

      alert("Kode verifikasi OTP 6-Digit telah dikirim. Silakan cek kotak masuk/spam email Anda!");
      setOtpSent(true);
    } catch (error) {
      console.error(error);
      alert(error.message || "Gagal mengirim OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. PROSES UTAMA (LOGIN ATAU VERIFIKASI OTP)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        // --- LOGIKA LOGIN BIASA ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username,
          password: password,
        });

        if (error) throw error;

        const user = data.user;
        onAuthSuccess({
          id: user.id,
          name: user.user_metadata?.nama_lengkap || user.email,
          email: user.email,
          role: user.user_metadata?.role || 'peserta',
          status: user.user_metadata?.status_akun || 'seleksi'
        });

      } else {
        // --- LOGIKA VERIFIKASI KODE 6-DIGIT OTP ---
        if (!otpSent || !otpCode) {
          setIsLoading(false);
          return alert("Silakan masukkan kode OTP 6-Digit yang dikirim ke email Anda!");
        }

        // PERBAIKAN KRUSIAL: type harus 'signup' bukan 'email'
        const { data, error } = await supabase.auth.verifyOtp({
          email: username,
          token: otpCode,
          type: 'signup' 
        });

        if (error) throw error;

        // Setelah OTP benar dan sesi terbuka, kita set password yang diketik user
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
          data: { 
            nama_lengkap: name, 
            role: 'peserta', 
            status_akun: 'seleksi' 
          }
        });

        if (updateError) throw updateError;

        alert('Pendaftaran Berhasil! Akun Anda telah aktif. Silakan login dengan password yang baru dibuat.');
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
              <p className="auth-subtitle">{mode === 'login' ? 'Gunakan akun terdaftar Anda.' : 'Verifikasi email dengan OTP 6-Digit.'}</p>
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
                    <label className="auth-otp-label">Masukkan Kode OTP 6-Digit dari Email</label>
                    <input type="text" required maxLength="6" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="auth-otp-input text-center text-xl tracking-widest font-bold" placeholder="• • • • • •" />
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
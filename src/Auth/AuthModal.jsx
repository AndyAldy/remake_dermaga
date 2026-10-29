import React, { useState, useEffect } from 'react';
import FadeIn from '../components/FadeIn';
import { supabase } from '../supabase';
import '../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode, onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sinkronisasi initialMode saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setIsOtpSent(false);
      setOtp('');
      setEmail('');
      setName('');
      setErrorMsg('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOtpSent(false);
    setErrorMsg('');
    onClose();
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setIsOtpSent(false);
    setOtp('');
    setEmail('');
    setName('');
    setErrorMsg('');
  };

  // TAHAP 1: Meminta Pengiriman Kode OTP ke Email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) return alert("Email tidak valid!");
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Jika mode register, kita sisipkan nama_lengkap ke metadata saat akun pertama kali dibuat
      const options = { shouldCreateUser: true };
      
      if (mode === 'register') {
        options.data = { 
          nama_lengkap: name,
          role: 'peserta', 
          status_akun: 'seleksi' 
        };
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: options
      });

      if (error) throw error;

      setIsOtpSent(true);
      alert('Kode OTP telah dikirim! Silakan periksa Kotak Masuk atau folder Spam email Anda.');
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Terjadi kesalahan saat mengirim OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // TAHAP 2: Memverifikasi Kode OTP yang Diinput User
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return setErrorMsg("Masukkan 6 digit kode OTP!");
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email' // Penting: menentukan tipe verifikasi
      });

      if (error) throw error;

      const user = data.user;
      
      // Ekstraksi data untuk App.jsx
      const fullName = user.user_metadata?.nama_lengkap || user.email.split('@')[0];

      onAuthSuccess({
        id: user.id,
        name: fullName,
        email: user.email,
        role: user.user_metadata?.role || 'peserta',
        status: user.user_metadata?.status_akun || 'seleksi'
      });

    } catch (error) {
      console.error(error);
      setErrorMsg('Kode OTP salah atau sudah kadaluarsa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <FadeIn direction="up">
        <div className="auth-box">
          <button onClick={handleClose} className="auth-close-btn">X</button>

          <div className="auth-content">
            <div className="auth-header">
              <h2 className="auth-title">
                {!isOtpSent 
                  ? (mode === 'login' ? 'Masuk' : 'Daftar Akun') 
                  : 'Verifikasi Email'}
              </h2>
              <p className="auth-subtitle">
                {!isOtpSent 
                  ? (mode === 'login' ? 'Gunakan email aktif Anda.' : 'Gunakan email aktif untuk mendaftar.') 
                  : `Masukkan 6 digit kode yang dikirim ke ${email}`}
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200">
                {errorMsg}
              </div>
            )}

            {!isOtpSent ? (
              /* FORM 1: INPUT EMAIL (& NAMA JIKA REGISTER) */
              <form onSubmit={handleRequestOtp} className="auth-form">
                {mode === 'register' && (
                  <div>
                    <label className="auth-label">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="input-field" 
                      placeholder="Sesuai KTP/KTM" 
                    />
                  </div>
                )}
                
                <div>
                  <label className="auth-label">Alamat Email Aktif</label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="input-field" 
                    placeholder="nama@email.com" 
                  />
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary mt-2">
                  {isLoading ? 'Mengirim OTP...' : 'Kirim Kode OTP'}
                </button>
              </form>
            ) : (
              /* FORM 2: INPUT KODE OTP */
              <form onSubmit={handleVerifyOtp} className="auth-form">
                <div>
                  <label className="auth-label text-center block">Kode OTP</label>
                  <input 
                    type="text" 
                    required 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    className="input-field text-center tracking-[0.5em] text-xl font-bold" 
                    placeholder="000000" 
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary mt-2">
                  {isLoading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => setIsOtpSent(false)} 
                  className="w-full mt-3 text-sm text-slate-500 font-semibold hover:text-slate-800 transition"
                >
                  Batal / Ganti Email
                </button>
              </form>
            )}
            
            {!isOtpSent && (
              <div className="auth-footer">
                {mode === 'login' ? "Belum punya akun? " : "Sudah punya akun? "}
                <button type="button" onClick={toggleMode} className="auth-link">
                  {mode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
                </button>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default AuthModal;
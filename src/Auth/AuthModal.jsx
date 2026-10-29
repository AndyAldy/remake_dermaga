import React, { useState, useEffect } from 'react';
import FadeIn from '../components/FadeIn';
import { supabase } from '../supabase';
import '../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode, onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  
  // States Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  
  // States UI
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); // Penanda apakah user sedang di tahap verifikasi OTP
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sinkronisasi form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setIsOtpSent(false);
      setOtp('');
      setEmail('');
      setPassword('');
      setName('');
      setErrorMsg('');
      setShowPassword(false);
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
    setPassword('');
    setName('');
    setErrorMsg('');
    setShowPassword(false);
  };

  // --- TAHAP 1: PROSES LOGIN ATAU DAFTAR (KIRIM OTP) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) return setErrorMsg("Email tidak valid!");
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'login') {
        // --- LOGIKA LOGIN (Hanya Email & Password) ---
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        // Tangkap error jika email belum diverifikasi
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setIsOtpSent(true); // Lempar ke layar OTP jika ternyata email belum di-ACC
            throw new Error("Email ini belum diverifikasi. Silakan cek email Anda untuk kode OTP.");
          }
          throw error;
        }

        const user = data.user;
        const fullName = user.user_metadata?.nama_lengkap || user.email.split('@')[0];

        onAuthSuccess({
          id: user.id,
          name: fullName,
          email: user.email,
          role: user.user_metadata?.role || 'peserta',
          status: user.user_metadata?.status_akun || 'seleksi'
        });

      } else {
        // --- LOGIKA REGISTRASI (Daftar Akun + Buat Password -> Kirim OTP) ---
        const { data, error } = await supabase.auth.signUp({
          email: email,
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

        // Jika berhasil, Supabase akan mengirimkan OTP (karena 'Confirm email' dinyalakan di dashboard)
        setIsOtpSent(true);
        alert('Pendaftaran tahap 1 berhasil! Kode OTP telah dikirim ke email Anda.');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- TAHAP 2: PROSES VERIFIKASI OTP (Hanya untuk Registrasi Baru) ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return setErrorMsg("Masukkan 6 digit kode OTP!");
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'signup' // Penting: tipe 'signup' untuk memverifikasi akun baru
      });

      if (error) throw error;

      alert('Email berhasil diverifikasi! Pendaftaran selesai.');
      
      const user = data.user;
      const fullName = user.user_metadata?.nama_lengkap || user.email.split('@')[0];

      // Langsung login-kan user setelah OTP berhasil
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
                  ? (mode === 'login' ? 'Gunakan email dan kata sandi Anda.' : 'Buat akun baru untuk mulai mendaftar magang.') 
                  : `Masukkan 6 digit kode yang dikirim ke ${email}`}
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200">
                {errorMsg}
              </div>
            )}

            {!isOtpSent ? (
              /* FORM 1: EMAIL & PASSWORD (LOGIN / REGISTER) */
              <form onSubmit={handleSubmit} className="auth-form">
                {mode === 'register' && (
                  <div>
                    <label className="auth-label">Nama Lengkap</label>
                    <input 
                      type="text" required 
                      value={name} onChange={(e) => setName(e.target.value)} 
                      className="input-field" placeholder="Sesuai KTP/KTM" 
                    />
                  </div>
                )}
                
                <div>
                  <label className="auth-label">Alamat Email Aktif</label>
                  <input 
                    type="email" required 
                    value={email} onChange={(e) => setEmail(e.target.value)} 
                    className="input-field" placeholder="nama@email.com" 
                  />
                </div>

                <div>
                  <label className="auth-label">Kata Sandi</label>
                  <div className="auth-pwd-wrapper">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required minLength="6"
                      value={password} onChange={(e) => setPassword(e.target.value)} 
                      className="input-field pr-12" placeholder="••••••••" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="auth-pwd-toggle" title={showPassword ? "Sembunyikan" : "Tampilkan"}
                    >
                      {showPassword ? "🙈" : "🙉"}
                    </button>
                  </div>
                  {mode === 'register' && <p className="text-[10px] text-slate-500 mt-1">Minimal 6 karakter.</p>}
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary mt-2">
                  {isLoading ? 'Memproses...' : (mode === 'login' ? 'Masuk' : 'Daftar Sekarang')}
                </button>
              </form>
            ) : (
              /* FORM 2: INPUT KODE OTP (HANYA MUNCUL SAAT VERIFIKASI DAFTAR) */
              <form onSubmit={handleVerifyOtp} className="auth-form">
                <div>
                  <label className="auth-label text-center block">Kode OTP</label>
                  <input 
                    type="text" required 
                    value={otp} onChange={(e) => setOtp(e.target.value)} 
                    className="input-field text-center tracking-[0.5em] text-xl font-bold" 
                    placeholder="000000" maxLength={6} autoComplete="one-time-code"
                  />
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary mt-2">
                  {isLoading ? 'Memverifikasi...' : 'Verifikasi Akun'}
                </button>
                
                <button 
                  type="button" onClick={() => setIsOtpSent(false)} 
                  className="w-full mt-3 text-sm text-slate-500 font-semibold hover:text-slate-800 transition"
                >
                  Kembali
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
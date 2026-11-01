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
  const [isOtpSent, setIsOtpSent] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Jangan validasi email jika sedang di tahap buat sandi baru
    if (mode !== 'update_password' && (!email.includes('@') || !email.includes('.'))) {
      return setErrorMsg("Email tidak valid!");
    }
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      // --- 1. LOGIKA SIMPAN SANDI BARU (SETELAH KLIK LINK EMAIL) ---
      if (mode === 'update_password') {
        const { error } = await supabase.auth.updateUser({ password: password });
        if (error) throw error;
        
        alert("Kata sandi berhasil diperbarui! Silakan masuk kembali menggunakan sandi baru Anda.");
        await supabase.auth.signOut(); // Logout sesi sementara
        setMode('login'); // Kembalikan ke form login
        setIsLoading(false);
        return;
      }

      // --- 2. LOGIKA MINTA LINK LUPA SANDI ---
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        
        alert("Tautan pemulihan kata sandi telah dikirim ke email Anda!");
        setMode('login');
        setIsLoading(false);
        return;
      }

      // --- 3. LOGIKA LOGIN ---
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setIsOtpSent(true); 
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
        // --- 4. LOGIKA REGISTRASI ---
        if (name.trim().length < 3) throw new Error("Nama Lengkap minimal 3 huruf!");

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

        if (data?.user?.identities?.length === 0) {
          throw new Error("Email ini sudah terdaftar. Jika lupa sandi, silakan gunakan menu Lupa Kata Sandi.");
        }

        setIsOtpSent(true);
        alert('Pendaftaran berhasil! Kode OTP telah dikirim ke email Anda.');
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 8) return setErrorMsg("Masukkan 8 digit kode OTP!");
    
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'signup' 
      });

      if (error) throw error;
      alert('Email berhasil diverifikasi! Pendaftaran selesai.');
      
      const user = data.user;
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
                  ? (mode === 'login' ? 'Masuk' : mode === 'register' ? 'Daftar Akun' : mode === 'forgot' ? 'Lupa Sandi' : 'Buat Sandi Baru') 
                  : 'Verifikasi Email'}
              </h2>
              <p className="auth-subtitle">
                {!isOtpSent 
                  ? (mode === 'login' ? 'Gunakan email dan kata sandi Anda.' : mode === 'register' ? 'Buat akun baru untuk mulai mendaftar magang.' : mode === 'forgot' ? 'Masukkan email terdaftar untuk mengatur ulang sandi.' : 'Masukkan kata sandi baru untuk akun Anda.') 
                  : `Masukkan 8 digit kode yang dikirim ke ${email}`}
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200">
                {errorMsg}
              </div>
            )}

            {!isOtpSent ? (
              <form onSubmit={handleSubmit} className="auth-form">
                
                {/* --- UI FORM MINTA LINK LUPA SANDI --- */}
                {mode === 'forgot' ? (
                  <>
                    <div>
                      <label className="auth-label">Alamat Email Aktif</label>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field text-slate-900" placeholder="nama@email.com" />
                    </div>
                    <button type="submit" disabled={isLoading} className="btn-primary mt-2">
                      {isLoading ? 'Memproses...' : 'Kirim Link Pemulihan'}
                    </button>
                    <button type="button" onClick={() => setMode('login')} className="w-full mt-3 text-sm text-slate-500 font-semibold hover:text-slate-800 transition">
                      Kembali ke Halaman Masuk
                    </button>
                  </>

                ) : mode === 'update_password' ? (
                  /* --- UI FORM INPUT SANDI BARU --- */
                  <>
                    <div>
                      <label className="auth-label">Kata Sandi Baru</label>
                      <div className="auth-pwd-wrapper">
                        <input type={showPassword ? "text" : "password"} required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-12 text-slate-900" placeholder="••••••••" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-pwd-toggle" title={showPassword ? "Sembunyikan" : "Tampilkan"}>{showPassword ? "🙈" : "🙉"}</button>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">Minimal 6 karakter.</p>
                    </div>
                    <button type="submit" disabled={isLoading} className="btn-primary mt-2">
                      {isLoading ? 'Menyimpan...' : 'Simpan Sandi Baru'}
                    </button>
                  </>

                ) : (
                  /* --- UI FORM LOGIN & DAFTAR NORMAL --- */
                  <>
                    {mode === 'register' && (
                      <div>
                        <label className="auth-label">Nama Lengkap</label>
                        <input 
                          type="text" required value={name} 
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^[a-zA-Z\s]*$/.test(val)) setName(val);
                          }} 
                          className="input-field text-slate-900" placeholder="Sesuai KTP/KTM" 
                        />
                      </div>
                    )}
                    
                    <div>
                      <label className="auth-label">Alamat Email Aktif</label>
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field text-slate-900" placeholder="nama@email.com" />
                    </div>

                    <div>
                      <label className="auth-label">Kata Sandi</label>
                      <div className="auth-pwd-wrapper">
                        <input type={showPassword ? "text" : "password"} required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-12 text-slate-900" placeholder="••••••••" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-pwd-toggle" title={showPassword ? "Sembunyikan" : "Tampilkan"}>{showPassword ? "🙈" : "🙉"}</button>
                      </div>
                      
                      {mode === 'login' ? (
                        <div className="flex justify-end mt-1">
                          <button type="button" onClick={() => setMode('forgot')} className="text-xs text-blue-600 hover:underline">Lupa Kata Sandi?</button>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-500 mt-1">Minimal 6 karakter.</p>
                      )}
                    </div>

                    <button type="submit" disabled={isLoading} className="btn-primary mt-2">
                      {isLoading ? 'Memproses...' : (mode === 'login' ? 'Masuk' : 'Daftar Sekarang')}
                    </button>
                  </>
                )}
              </form>
            ) : (
              /* --- UI VERIFIKASI OTP --- */
              <form onSubmit={handleVerifyOtp} className="auth-form">
                <div>
                  <label className="auth-label text-center block">Kode OTP</label>
                  <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="input-field text-center tracking-[0.5em] text-xl font-bold text-slate-900" placeholder="00000000" maxLength={8} autoComplete="one-time-code" />
                </div>
                <button type="submit" disabled={isLoading} className="btn-primary mt-2">{isLoading ? 'Memverifikasi...' : 'Verifikasi Akun'}</button>
                <button type="button" onClick={() => setIsOtpSent(false)} className="w-full mt-3 text-sm text-slate-500 font-semibold hover:text-slate-800 transition">Kembali</button>
              </form>
            )}
            
            {(!isOtpSent && mode !== 'forgot' && mode !== 'update_password') && (
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
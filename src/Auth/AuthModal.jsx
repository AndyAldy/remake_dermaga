import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';

const AuthModal = ({ isOpen, onClose, initialMode, onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoadingOTP, setIsLoadingOTP] = useState(false); // Indikator tombol
  
  if (!isOpen) return null;

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setOtpSent(false); setOtpCode(''); setShowPassword(false);
    setUsername(''); setPassword('');
  };

  // FUNGSI MEMANGGIL API OTP GMAIL REAL-TIME
  const handleSendOTP = async () => {
    if (!username.includes('@') || !username.includes('.')) {
      alert("Silakan masukkan alamat email yang valid!");
      return;
    }

    setIsLoadingOTP(true); // Memutar efek loading
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username })
      });
      const data = await response.json();

      if (response.ok) {
        alert("Berhasil! Kode OTP 4 digit telah dikirim ke email Anda.");
        setOtpSent(true);
      } else {
        alert(data.error || "Gagal mengirim email.");
      }
    } catch (error) {
      alert("Tidak dapat menghubungi server. Pastikan Backend menyala.");
    } finally {
      setIsLoadingOTP(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'register') {
      if (!otpSent) return alert("Anda harus menekan tombol 'Kirim OTP' terlebih dahulu!");
      if (otpCode.length < 4) return alert("Silakan masukkan 4 digit kode OTP yang valid!");
    }

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    // Tambahkan properti OTP ke payload
    const payload = mode === 'login' ? { username, password } : { username, password, nama_lengkap: name, otp: otpCode };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok) {
        if (mode === 'login') {
          onAuthSuccess({ id: data.id, name: data.name, email: data.email, status: data.status, role: data.role });
        } else {
          alert('Pendaftaran Berhasil! Email telah terverifikasi. Silakan masuk.');
          toggleMode();
        }
      } else {
        alert(data.error || 'Terjadi kesalahan.');
      }
    } catch (error) {
      alert('Gagal terhubung ke Server Backend.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[60] flex justify-center items-center p-4 backdrop-blur-sm">
      <FadeIn direction="up">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">{mode === 'login' ? 'Masuk' : 'Daftar Akun'}</h2>
              <p className="text-sm text-slate-500">
                {mode === 'login' ? 'Gunakan akun yang telah didaftarkan.' : 'Verifikasi email Anda untuk bergabung.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Sesuai KTP/KTM" />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  {mode === 'login' ? 'Username / Email' : 'Alamat Email Aktif'}
                </label>
                <div className="flex gap-2">
                  <input 
                    type={mode === 'register' ? "email" : "text"} 
                    required 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="input-field" 
                    placeholder={mode === 'login' ? "Username admin atau email" : "nama@kampus.ac.id"} 
                  />
                  {mode === 'register' && (
                    <button type="button" onClick={handleSendOTP} disabled={isLoadingOTP} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors focus:outline-none disabled:opacity-50">
                      {isLoadingOTP ? 'Mengirim...' : (otpSent ? 'Kirim Ulang' : 'Kirim OTP')}
                    </button>
                  )}
                </div>
              </div>

              {mode === 'register' && otpSent && (
                <FadeIn direction="up">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <label className="block text-sm font-semibold text-blue-900 mb-2 text-center">Masukkan Kode OTP</label>
                    <input type="text" required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="w-full border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 focus:outline-none tracking-[1em] text-center font-bold text-xl bg-white" placeholder="XXXX" maxLength="4" />
                    <p className="text-xs text-blue-600 mt-2 text-center">*Cek kotak masuk atau folder spam email Anda.</p>
                  </div>
                </FadeIn>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kata Sandi</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-12" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1">
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary">
                {mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-slate-600">
              {mode === 'login' ? "Belum punya akun? " : "Sudah punya akun? "}
              <button type="button" onClick={toggleMode} className="text-orange-600 font-bold hover:underline focus:outline-none">
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
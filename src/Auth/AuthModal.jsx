import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';
import '../styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode, onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isLoadingOTP, setIsLoadingOTP] = useState(false);
  
  if (!isOpen) return null;

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setOtpSent(false); setOtpCode(''); setShowPassword(false);
    setUsername(''); setPassword('');
  };

  const handleSendOTP = async () => {
    if (!username.includes('@') || !username.includes('.')) return alert("Email tidak valid!");
    setIsLoadingOTP(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username })
      });
      const data = await response.json();
      if (response.ok) {
        alert("Kode OTP terkirim!");
        setOtpSent(true);
      } else alert(data.error);
    } catch (error) { alert("Server Error."); } finally { setIsLoadingOTP(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'register' && (!otpSent || otpCode.length < 4)) return alert("Lengkapi OTP!");
    
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login' ? { username, password } : { username, password, nama_lengkap: name, otp: otpCode };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok) {
        mode === 'login' ? onAuthSuccess(data) : alert('Registrasi Berhasil!') && toggleMode();
      } else alert(data.error);
    } catch (error) { alert('Server Error.'); }
  };

  return (
    <div className="auth-overlay">
      <FadeIn direction="up">
        <div className="auth-box">
          <button onClick={onClose} className="auth-close-btn">X</button>

          <div className="auth-content">
            <div className="auth-header">
              <h2 className="auth-title">{mode === 'login' ? 'Masuk' : 'Daftar Akun'}</h2>
              <p className="auth-subtitle">{mode === 'login' ? 'Gunakan akun Anda.' : 'Verifikasi email Anda.'}</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {mode === 'register' && (
                <div>
                  <label className="auth-label">Nama Lengkap</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Sesuai KTP/KTM" />
                </div>
              )}
              
              <div>
                <label className="auth-label">{mode === 'login' ? 'Username / Email' : 'Alamat Email Aktif'}</label>
                <div className="auth-input-group">
                  <input type={mode === 'register' ? "email" : "text"} required value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" placeholder="nama@email.com" />
                  {mode === 'register' && (
                    <button type="button" onClick={handleSendOTP} disabled={isLoadingOTP} className="auth-btn-otp">
                      {isLoadingOTP ? 'Mengirim...' : (otpSent ? 'Kirim Ulang' : 'Kirim OTP')}
                    </button>
                  )}
                </div>
              </div>

              {mode === 'register' && otpSent && (
                <FadeIn direction="up">
                  <div className="auth-otp-box">
                    <label className="auth-otp-label">Masukkan Kode OTP</label>
                    <input type="text" required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} className="auth-otp-input" placeholder="XXXX" maxLength="4" />
                  </div>
                </FadeIn>
              )}

              <div>
                <label className="auth-label">Kata Sandi</label>
                <div className="auth-pwd-wrapper">
                  <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-12" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-pwd-toggle">O</button>
                </div>
              </div>

              <button type="submit" className="btn-primary">
                {mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
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
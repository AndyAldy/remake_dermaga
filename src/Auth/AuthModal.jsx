import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';

const AuthModal = ({ isOpen, onClose, initialMode, onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let status = 'seleksi';
    let userName = mode === 'register' ? name : (email.split('@')[0] || 'Peserta');
    
    // FIXED AUTH: Logika untuk Admin dan status kelulusan
    if (email === 'admin@bps.go.id' && password === 'admin123') {
      status = 'admin';
      userName = 'Administrator BPS';
    } else if (email === 'lulus@gmail.com') {
      status = 'lulus';
    }
    
    onAuthSuccess({ name: userName, email, status });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[60] flex justify-center items-center p-4 backdrop-blur-sm">
      <FadeIn direction="up">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">{mode === 'login' ? 'Masuk' : 'Daftar Akun'}</h2>
              <p className="text-sm text-slate-500">
                {mode === 'login' ? 'Gunakan admin@bps.go.id | pass: admin123 untuk akses Admin' : 'Bergabunglah untuk memulai magang.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3" placeholder="Sesuai KTP/KTM" />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Alamat Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3" placeholder="nama@email.com" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kata Sandi</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3" placeholder="••••••••" />
              </div>

              <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg shadow mt-4">
                {mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
              </button>
            </form>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default AuthModal;
import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';

const AuthModal = ({ isOpen, onClose, initialMode, onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login' ? { username, password } : { username, password, nama_lengkap: name };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok) {
        if (mode === 'login') {
          // Menyimpan status login dengan data asli dari database
          onAuthSuccess({ id: data.id, name: data.name, email: data.email, status: data.status });
        } else {
          alert('Registrasi berhasil! Silakan masuk.');
          setMode('login');
        }
      } else {
        alert(data.error || 'Terjadi kesalahan pada server.');
      }
    } catch (error) {
      alert('Gagal terhubung ke Server Backend.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[60] flex justify-center items-center p-4 backdrop-blur-sm">
      <FadeIn direction="up">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">{mode === 'login' ? 'Masuk' : 'Daftar Akun'}</h2>
              <p className="text-sm text-slate-500">
                {mode === 'login' ? 'Gunakan akun yang telah didaftarkan.' : 'Bergabunglah untuk memulai magang.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900" placeholder="Sesuai KTP/KTM" />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Username / Email</label>
                <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900" placeholder="Username Anda" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kata Sandi</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900" placeholder="••••••••" />
              </div>

              <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg shadow mt-4 transition-all">
                {mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-slate-600">
              {mode === 'login' ? "Belum punya akun? " : "Sudah punya akun? "}
              <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-orange-600 font-bold hover:underline">
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
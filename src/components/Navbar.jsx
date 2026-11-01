import React, { useState } from 'react';

const Navbar = ({ user, onLogout, onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (user?.role === 'admin') {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="text-xl sm:text-2xl font-extrabold text-blue-900 tracking-tight">
              DERMAGA<span className="text-orange-500">.</span>
            </div>
            <div className="flex flex-col border-l-2 border-slate-200 pl-2">
              <p className="text-[11px] sm:text-xs font-bold text-slate-700 leading-none">BPS</p>
              <p className="text-[9px] sm:text-[10px] text-slate-500 leading-none mt-0.5">Kota Semarang</p>
            </div>
          </div>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <button 
                  onClick={() => onOpenAuth && onOpenAuth('login')} 
                  className="text-sm font-bold text-slate-600 hover:text-blue-700 px-4 py-2 transition"
                >
                  Masuk
                </button>
                <button 
                  onClick={() => onOpenAuth && onOpenAuth('register')} 
                  className="text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm transition"
                >
                  Daftar
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="font-bold text-sm text-blue-900 leading-none">{user?.name}</span>
                  <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest mt-1">
                    Status: {user?.status || 'Seleksi'}
                  </span>
                </div>
                <button 
                  onClick={() => { if(window.confirm("Yakin keluar?")) onLogout(); }} 
                  className="text-sm font-bold bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-4 py-2 rounded-lg border border-red-200 transition"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>

          {/* TOMBOL HAMBURGER MOBILE */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-blue-600 focus:outline-none p-2 rounded-lg bg-slate-50 border border-slate-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* DROPDOWN MENU MOBILE */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-4 pb-6 shadow-xl absolute w-full left-0">
          {!user ? (
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setIsMenuOpen(false); if(onOpenAuth) onOpenAuth('login'); }} 
                className="w-full text-center text-sm font-bold text-slate-700 bg-slate-100 py-3 rounded-xl hover:bg-slate-200 transition"
              >
                Masuk
              </button>
              <button 
                onClick={() => { setIsMenuOpen(false); if(onOpenAuth) onOpenAuth('register'); }} 
                className="w-full text-center text-sm font-bold bg-blue-600 text-white py-3 rounded-xl shadow-md hover:bg-blue-700 transition"
              >
                Daftar Akun
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="block font-bold text-base text-blue-900">{user?.name}</span>
                <span className="block text-[11px] font-extrabold text-orange-600 uppercase tracking-widest mt-1">
                  Status: {user?.status || 'Seleksi'}
                </span>
              </div>
              <button 
                onClick={() => { setIsMenuOpen(false); if(window.confirm("Yakin keluar?")) onLogout(); }} 
                className="w-full text-center text-sm font-bold bg-red-50 text-red-600 py-3 rounded-xl border border-red-200 hover:bg-red-600 hover:text-white transition"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
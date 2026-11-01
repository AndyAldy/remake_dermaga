import React, { useState } from 'react';
import '../styles/NavBar.css';

const Navbar = ({ user, onLogout, onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Jika user yang login adalah admin, sembunyikan Navbar sepenuhnya
  if (user?.role === 'admin') {
    return null;
  }

  return (
    <nav className="nav-bar relative z-50">
      <div className="nav-container flex justify-between items-center w-full px-4 md:px-0">
        
        {/* LOGO */}
        <div className="nav-logo-wrap">
          <div className="nav-logo-text">DERMAGA<span className="text-orange-500">.</span></div>
          <div className="nav-subtitle">
            <p className="text-[11px] sm:text-sm font-bold text-slate-700 leading-none">BPS</p>
            <p className="text-[9px] sm:text-xs text-slate-500">Kota Semarang</p>
          </div>
        </div>

        {/* MENU DESKTOP (Tersembunyi di HP) */}
        <div className="nav-desktop-menu hidden md:flex">
          {!user ? (
            <>
              <button onClick={() => onOpenAuth && onOpenAuth('login')} className="nav-btn-login">Masuk</button>
              <button onClick={() => onOpenAuth && onOpenAuth('register')} className="nav-btn-register">Daftar</button>
            </>
          ) : (
            <div className="nav-user-badge">
              <div className="flex flex-col items-end mr-3">
                <span className="font-bold text-sm text-blue-900 leading-none">{user?.name}</span>
                <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest mt-1">
                  Status: {user?.status || 'Seleksi'}
                </span>
              </div>
              <button 
                onClick={() => { if(window.confirm("Yakin keluar?")) onLogout(); }} 
                className="nav-logout-btn">
                Keluar
              </button>
            </div>
          )}
        </div>

        {/* TOMBOL MENU HAMBURGER KHUSUS HP */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-slate-600 hover:text-blue-600 focus:outline-none p-2"
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                // Ikon "X" jika menu terbuka
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                // Ikon Garis Tiga jika menu tertutup
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* DROPDOWN MENU MOBILE (Hanya muncul jika tombol hamburger diklik) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-5 shadow-lg absolute w-full left-0 top-full">
          {!user ? (
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setIsMenuOpen(false); if(onOpenAuth) onOpenAuth('login'); }} 
                className="w-full text-center text-sm font-bold text-slate-600 border border-slate-300 py-3 rounded-lg hover:bg-slate-50 transition">
                Masuk
              </button>
              <button 
                onClick={() => { setIsMenuOpen(false); if(onOpenAuth) onOpenAuth('register'); }} 
                className="w-full text-center text-sm font-bold bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 shadow-sm transition">
                Daftar Akun
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col justify-center items-center text-center">
                <span className="block font-bold text-base text-blue-900">{user?.name}</span>
                <span className="block text-[11px] font-extrabold text-orange-600 uppercase tracking-widest mt-1">
                  Status: {user?.status || 'Seleksi'}
                </span>
              </div>
              <button 
                onClick={() => { setIsMenuOpen(false); if(window.confirm("Yakin keluar?")) onLogout(); }} 
                className="w-full text-center text-sm font-bold bg-red-50 text-red-600 py-3 rounded-lg border border-red-200 hover:bg-red-600 hover:text-white transition">
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
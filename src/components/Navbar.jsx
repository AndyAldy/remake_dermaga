import React, { useState } from 'react';
import '../styles/Navbar.css';

const Navbar = ({ user, onLogout, onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        <div className="nav-logo-wrap">
          <div className="nav-logo-text">BPS<span className="text-orange-500">.</span></div>
          <div className="nav-subtitle">
            <p className="text-sm font-bold text-slate-700 leading-none">BPS</p>
            <p className="text-xs text-slate-500">Kota Semarang</p>
          </div>
        </div>

        <div className="nav-desktop-menu">
          {!user ? (
            <>
              <button onClick={() => onOpenAuth('login')} className="nav-btn-login">Masuk</button>
              <button onClick={() => onOpenAuth('register')} className="nav-btn-register">Daftar</button>
            </>
          ) : (
            <div className="nav-user-badge">
              <span className="nav-user-name">{user.name}, {status_seleksi}</span>
              <button onClick={() => { if(window.confirm("Yakin keluar?")) onLogout(); }} className="nav-logout-btn">Keluar</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
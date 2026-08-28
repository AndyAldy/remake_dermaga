import React, { useState } from 'react';

const Navbar = ({ user, onLogout, onOpenAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="font-extrabold text-2xl text-blue-900 tracking-tight">
            BPS<span className="text-orange-500">.</span>
          </div>
          <div className="hidden sm:block border-l-2 border-slate-300 pl-3">
            <p className="text-xs text-slate-500">Kota Semarang</p>
          </div>
        </div>

        {/* User Account / Auth Buttons (Desktop) */}
        <div className="hidden md:flex gap-3 items-center">
          {!user ? (
            <>
              <button onClick={() => onOpenAuth('login')} className="text-blue-900 font-bold px-4 py-2 hover:bg-slate-100 rounded transition-colors text-sm">Masuk</button>
              <button onClick={() => onOpenAuth('register')} className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded shadow transition-all text-sm font-bold">Daftar</button>
            </>
          ) : (
            <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              <div className="w-7 h-7 bg-blue-900 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-blue-900 leading-none">{user.name}</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">{user.status}</span>
              </div>
<button 
  onClick={() => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      onLogout();
    }
  }} 
  className="text-xs text-red-500 hover:underline ml-2 font-semibold border-l border-blue-200 pl-3"
>
  Keluar
</button> 
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-slate-800 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
           </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
         <div className="md:hidden bg-white px-4 py-4 space-y-3 shadow-lg border-t border-slate-100 absolute w-full">
            {!user ? (
              <div className="flex flex-col gap-2">
                <button onClick={() => {onOpenAuth('login'); setIsMenuOpen(false);}} className="w-full text-blue-900 font-bold px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded text-center">Masuk</button>
                <button onClick={() => {onOpenAuth('register'); setIsMenuOpen(false);}} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded text-center">Daftar</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 items-center">
                <p className="font-bold text-blue-900">Halo, {user.name}</p>
<button 
  onClick={() => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      onLogout(); 
      setIsMenuOpen(false);
    }
  }} 
  className="w-full bg-red-100 text-red-700 font-bold px-4 py-2 rounded text-center"
>
  Keluar Akun</button>
              </div>
            )}
         </div>
      )}
    </nav>
  );
};

export default Navbar;
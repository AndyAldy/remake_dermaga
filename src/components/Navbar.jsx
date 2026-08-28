import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-sm flex items-center justify-center font-bold text-white shadow-sm">
            BPS
          </div>
          <div>
            <h1 className="text-lg font-bold text-blue-900 tracking-tight leading-tight">DERMAGA</h1>
            <p className="text-xs text-slate-500 font-medium">Portal Magang BPS Kota Semarang</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="text-orange-500 font-semibold border-b-2 border-orange-500 pb-1">Beranda</a>
          <a href="#alur" className="hover:text-blue-900 transition-colors">Alur Pendaftaran</a>
          <a href="#posisi" className="hover:text-blue-900 transition-colors">Posisi</a>
          <button className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow-md transition-all font-semibold">
            Login Peserta
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
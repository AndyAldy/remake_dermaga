import React, { useState } from 'react';
import DashboardView from './DashboardView';
import PendaftarView from './PendaftarView';

const AdminLayout = ({ user, onLogout, quotas, setQuotas, pendaftar, setPendaftar }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleSafeLogout = () => {
    if (window.confirm("Yakin ingin keluar dari panel Administrator?")) {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-700">
          <div className="font-extrabold text-2xl text-white tracking-tight">SIMBA<span className="text-orange-500">.</span> Admin</div>
          <p className="text-xs text-slate-400 mt-1">Panel Kendali BPS</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveMenu('dashboard')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeMenu === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>Beranda & Kuota</button>
          <button onClick={() => setActiveMenu('pendaftar')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeMenu === 'pendaftar' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}>Data Pendaftar Form</button>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button onClick={handleSafeLogout} className="w-full bg-slate-800 hover:bg-red-600 text-white text-sm font-bold py-2 rounded transition-colors">Logout Admin</button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto">
        {/* Kirim props ke masing-masing halaman */}
        {activeMenu === 'dashboard' && <DashboardView user={user} quotas={quotas} setQuotas={setQuotas} />}
        {activeMenu === 'pendaftar' && <PendaftarView pendaftar={pendaftar} setPendaftar={setPendaftar} quotas={quotas} setQuotas={setQuotas} />}
      </main>
    </div>
  );
};

export default AdminLayout;
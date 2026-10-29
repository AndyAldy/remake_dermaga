import React, { useState } from 'react';
import DashboardView from './DashboardView';
import PendaftarView from './PendaftarView';
import KelolaAkunView from './KelolaAkunView'; 
import StorageManagerView from './StorageManagerView'; // <-- Impor komponen StorageManagerView
import '../../styles/Admin.css'; 

const AdminLayout = ({ user, onLogout, quotas, setQuotas, pendaftar, refreshData }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="p-6 border-b border-slate-700">
          <div className="font-extrabold text-2xl text-white">DERMAGA Admin</div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveMenu('dashboard')} 
            className={`admin-menu-btn ${activeMenu === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            Beranda
          </button>
          <button 
            onClick={() => setActiveMenu('pendaftar')} 
            className={`admin-menu-btn ${activeMenu === 'pendaftar' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            Pendaftar
          </button>
          <button 
            onClick={() => setActiveMenu('kelola_akun')} 
            className={`admin-menu-btn ${activeMenu === 'kelola_akun' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            Kelola Akun
          </button>
          {/* Menu Tambahan Manajemen Storage */}
          <button 
            onClick={() => setActiveMenu('storage')} 
            className={`admin-menu-btn ${activeMenu === 'storage' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            Data Storage
          </button>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button onClick={() => { if(window.confirm("Keluar?")) onLogout(); }} className="w-full bg-slate-800 hover:bg-red-600 text-white py-2 rounded transition">Logout</button>
        </div>
      </aside>
      <main className="admin-main">
        {activeMenu === 'dashboard' && <DashboardView user={user} quotas={quotas} setQuotas={setQuotas} refreshData={refreshData} />}
        {activeMenu === 'pendaftar' && <PendaftarView pendaftar={pendaftar} quotas={quotas} refreshData={refreshData} />}
        {activeMenu === 'kelola_akun' && <KelolaAkunView refreshData={refreshData} />}
        {/* Render halaman Storage */}
        {activeMenu === 'storage' && <StorageManagerView />}
      </main>
    </div>
  );
};
export default AdminLayout;
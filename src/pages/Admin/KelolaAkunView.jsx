import React, { useState, useEffect } from 'react';
import FadeIn from '../../components/FadeIn';
import { supabase } from '../../supabase';

const KelolaAkunView = ({ refreshData }) => {
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data user dari database (tabel pendaftaran atau profil jika ada)
const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // UBAH DARI 'pendaftaran' MENJADI 'profiles'
      const { data, error } = await supabase
        .from('profiles') 
        .select('id, email, display_name, role, created_at');
      
      if (error) throw error;
      setUsersList(data || []);
    } catch (err) {
      console.error("Gagal memuat data akun:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Logika untuk menghapus akun / data pendaftar
  const handleDeleteAccount = async (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data dan akses pendaftar atas nama "${nama}"?`)) {
      try {
        // Hapus data pendaftaran berdasarkan ID baris
        const { error } = await supabase
          .from('pendaftaran')
          .delete()
          .eq('id', id);

        if (error) throw error;

        alert(`Data akun ${nama} berhasil dibersihkan/dihapus.`);
        fetchUsers(); // Refresh daftar user lokal
        if (refreshData) refreshData(); // Refresh data utama aplikasi
      } catch (err) {
        console.error(err);
        alert(`Gagal menghapus akun: ${err.message}`);
      }
    }
  };

  return (
    <div className="p-6">
      <FadeIn>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Pembersihan & Manajemen Akun</h2>
            <p className="text-sm text-slate-500">Kelola dan bersihkan data akun pendaftar yang terdaftar di sistem.</p>
          </div>
          <button 
            onClick={fetchUsers} 
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 px-4 rounded-lg transition"
          >
            🔄 Muat Ulang Data
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Memuat data akun...</div>
          ) : usersList.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Belum ada akun pendaftar yang tersimpan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="p-4">Nama Peserta</th>
                    <th className="p-4">NIM / NISN</th>
                    <th className="p-4">Asal Instansi</th>
                    <th className="p-4">Tanggal Daftar</th>
                    <th className="p-4 text-center">Aksi Pembersihan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">{item.nama_peserta}</td>
                      <td className="p-4 text-slate-600">{item.nim_nisn || '-'}</td>
                      <td className="p-4 text-slate-600">{item.asal_sekolah_kampus || '-'}</td>
                      <td className="p-4 text-slate-500 text-xs">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeleteAccount(item.id, item.nama_peserta)}
                          className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-bold py-1.5 px-3 rounded transition border border-red-200"
                        >
                          🗑️ Hapus Akun
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

export default KelolaAkunView;
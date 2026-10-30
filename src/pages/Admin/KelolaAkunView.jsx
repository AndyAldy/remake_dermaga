import React, { useState, useEffect } from 'react';
import FadeIn from '../../components/FadeIn';
import { supabase } from '../../supabase';

const KelolaAkunView = ({ refreshData }) => {
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Menggunakan fungsi RPC untuk menarik data langsung dari auth.users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_all_users');
      
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

  // Menghapus SATU akun
  const handleDeleteAccount = async (id, nama, email) => {
    if (window.confirm(`PERINGATAN Keras: Apakah Anda yakin ingin menghapus permanen akun "${nama || email}" dari sistem?`)) {
      try {
        const { error } = await supabase.rpc('delete_user_account', { 
          target_user_id: id 
        });

        if (error) throw error;

        alert(`Akun ${nama || email} berhasil dihapus permanen.`);
        fetchUsers(); 
        if (refreshData) refreshData(); 
      } catch (err) {
        console.error(err);
        alert(`Gagal menghapus akun: ${err.message}`);
      }
    }
  };

  // Menghapus SEMUA akun (Fitur Baru)
  const handleDeleteAllAccounts = async () => {
    if (usersList.length === 0) return alert("Belum ada akun pendaftar yang tersimpan.");
    
    // Verifikasi 2 Lapis untuk mencegah salah klik
    const confirm1 = window.confirm("🚨 PERINGATAN KRITIS: Anda yakin ingin MENGHAPUS SEMUA AKUN MAHASISWA secara permanen?");
    if (!confirm1) return;
    
    const confirm2 = window.confirm("Tindakan ini TIDAK BISA DIBATALKAN. Seluruh data peserta akan hilang. Lanjutkan?");
    if (!confirm2) return;

    setIsLoading(true);
    try {
      // Loop untuk menghapus setiap akun berdasarkan fungsi RPC yang sudah ada
      for (const user of usersList) {
        const { error } = await supabase.rpc('delete_user_account', { 
          target_user_id: user.id 
        });
        if (error) throw error;
      }

      alert("SUKSES: Seluruh akun pendaftar berhasil dibersihkan dari sistem!");
      fetchUsers(); 
      if (refreshData) refreshData(); 
    } catch (err) {
      console.error(err);
      alert(`Terjadi kesalahan saat menghapus semua akun: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Pembersihan & Manajemen Akun</h2>
            <p className="text-sm text-slate-500">Kelola semua akun yang terdaftar di aplikasi (meski belum mengisi formulir magang).</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={fetchUsers} 
              disabled={isLoading}
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              🔄 Muat Ulang
            </button>
            <button 
              onClick={handleDeleteAllAccounts} 
              disabled={isLoading || usersList.length === 0}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition shadow-md disabled:opacity-50"
            >
              🗑️ Hapus Semua Akun
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Memuat data...</div>
          ) : usersList.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Belum ada akun pendaftar yang tersimpan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="p-4 font-semibold">Nama Peserta</th>
                    <th className="p-4 font-semibold">Alamat Email</th>
                    <th className="p-4 font-semibold">Tanggal Register</th>
                    <th className="p-4 font-semibold text-center">Aksi Pembersihan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">{item.nama_lengkap || '-'}</td>
                      <td className="p-4 text-slate-600">{item.email}</td>
                      <td className="p-4 text-slate-500 text-xs">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDeleteAccount(item.id, item.nama_lengkap, item.email)}
                          className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-bold py-1.5 px-3 rounded transition border border-red-200"
                        >
                          Hapus Akun
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs text-slate-500 font-bold">
                Total Akun Pendaftar: {usersList.length}
              </div>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

export default KelolaAkunView;
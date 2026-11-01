import React, { useState, useEffect } from 'react';
import FadeIn from '../../components/FadeIn';
import { supabase } from '../../supabase';

const MonitoringView = () => {
  const [interns, setInterns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInterns = async () => {
    setIsLoading(true);
    try {
      // PERBAIKAN: Ambil juga user_id untuk keperluan fungsi hapus (RPC)
      const { data, error } = await supabase
        .from('pendaftaran')
        .select('id, user_id, nama_peserta, asal_sekolah_kampus, tanggal_akhir')
        .eq('status_seleksi', 'diterima')
        .order('tanggal_akhir', { ascending: true }); 

      if (error) throw error;

      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      const validInterns = [];
      const deletePromises = [];

      // Logika Pengecekan Hapus Otomatis (Sehari setelah selesai)
      for (const item of (data || [])) {
        const endDate = new Date(item.tanggal_akhir);
        endDate.setHours(0, 0, 0, 0);

        // Tambahkan 1 hari dari tanggal berakhir (Batas Kedaluwarsa)
        const expireDate = new Date(endDate);
        expireDate.setDate(expireDate.getDate() + 1);

        if (today > expireDate) {
          // Jika hari ini sudah LEBIH DARI batas kedaluwarsa, masukkan ke antrean hapus backend
          deletePromises.push(
            supabase.rpc('delete_user_account', { target_user_id: item.user_id })
          );
        } else {
          // Jika masih valid atau baru hari-H selesai, tampilkan di frontend
          validInterns.push(item);
        }
      }

      // Eksekusi penghapusan backend secara massal jika ada yang kedaluwarsa
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
        console.log(`${deletePromises.length} mahasiswa otomatis dihapus karena masa magang telah usai.`);
      }

      setInterns(validInterns);
    } catch (err) {
      console.error("Gagal memuat data magang:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  // Fungsi Logika Penentu Status Magang (Visual Frontend)
  const getStatus = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    // Akan berstatus 'Finished' tepat satu hari sebelum akhirnya besoknya dihapus otomatis
    if (today > end) {
      return { label: 'Finished Intern', color: 'bg-red-50 text-red-600 border-red-200' };
    } else {
      return { label: 'On-going Intern', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
    }
  };

  // Fungsi Tombol Hapus/Keluarkan Manual
  const handleKickIntern = async (userId, nama) => {
    // Alert Peringatan Khusus Sesuai Permintaan
    const confirmMsg = `Peringatan: Tombol ini hanya boleh dipencet ketika hanya anda ingin mengeluarkan anak magang.\n\nLanjutkan mengeluarkan "${nama}"?`;
    
    if (window.confirm(confirmMsg)) {
      setIsLoading(true);
      try {
        const { error } = await supabase.rpc('delete_user_account', { 
          target_user_id: userId 
        });

        if (error) throw error;

        alert(`Mahasiswa atas nama ${nama} berhasil dikeluarkan dari program magang.`);
        fetchInterns(); // Muat ulang data setelah dihapus
      } catch (err) {
        console.error(err);
        alert(`Gagal mengeluarkan mahasiswa: ${err.message}`);
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="p-6 md:p-10">
      <FadeIn>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Monitoring Mahasiswa Magang</h2>
            <p className="text-sm text-slate-500">Pantau status mahasiswa yang sedang atau telah selesai masa magangnya.</p>
          </div>
          <button 
            onClick={fetchInterns} 
            disabled={isLoading}
            className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            🔄 Muat Ulang
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Memuat data...</div>
          ) : interns.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Belum ada mahasiswa yang berstatus diterima magang.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="p-4 font-semibold">Nama Peserta</th>
                    <th className="p-4 font-semibold">Asal Kampus/Sekolah</th>
                    <th className="p-4 font-semibold">Periode Selesai</th>
                    <th className="p-4 font-semibold text-center">Status</th>
                    <th className="p-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {interns.map((item) => {
                    const status = getStatus(item.tanggal_akhir);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-bold text-slate-800">{item.nama_peserta}</td>
                        <td className="p-4 text-slate-600">{item.asal_sekolah_kampus}</td>
                        <td className="p-4 text-slate-600">{formatDate(item.tanggal_akhir)}</td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleKickIntern(item.user_id, item.nama_peserta)}
                            className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-bold py-1.5 px-3 rounded transition border border-red-200"
                          >
                            Keluarkan
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs text-slate-500 font-bold">
                Total Mahasiswa: {interns.length}
              </div>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

export default MonitoringView;
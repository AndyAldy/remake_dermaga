import React from 'react';
import FadeIn from '../../components/FadeIn';
import { supabase } from '../../supabase';

const PendaftarView = ({ pendaftar, quotas, refreshData }) => {
  
  const handleDownloadPDF = (fileUrl) => {
    if (!fileUrl) return alert("File tidak tersedia.");
    window.open(fileUrl, '_blank');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getNamaDivisi = (divisiId) => {
    const divisi = quotas.find(q => q.id === divisiId);
    return divisi ? divisi.divisi : 'Tidak diketahui';
  };

  const handleTerima = async (peserta) => {
    const divisiTarget = quotas.find(q => q.id === peserta.divisi_id);
    
    if (!divisiTarget) return alert("Gagal: Data divisi tidak ditemukan!");
    if ((divisiTarget.total - divisiTarget.terisi) <= 0) return alert("Gagal: Kuota untuk divisi ini sudah penuh!");

    if(window.confirm(`Yakin ingin MENERIMA ${peserta.nama_peserta}?`)) {
      try {
// Di PendaftarView.jsx (fungsi handleTerima)
const { error: errPendaftar } = await supabase
  .from('pendaftaran')
  .update({ 
    status_seleksi: 'diterima',
    status_akun: 'lulus' // <-- Tambahkan ini agar sinkron dengan tipe data Enum 'lulus' di database
  })
  .eq('id', peserta.id);
          
        if (errPendaftar) throw errPendaftar;

        const { error: errDivisi } = await supabase
          .from('divisi')
          .update({ terisi: divisiTarget.terisi + 1 })
          .eq('id', peserta.divisi_id);
          
        if (errDivisi) throw errDivisi;

        alert('Peserta berhasil diterima!');
        refreshData(); 
      } catch (error) { 
        console.error(error);
        alert(`Gagal memproses penerimaan: ${error.message}`); 
      }
    }
  };

  const handleTolak = async (peserta) => {
    const alasanAdmin = window.prompt(
      `Masukkan alasan menolak berkas milik ${peserta.nama_peserta}:`, 
      "Berkas kurang lengkap / Kuota penuh"
    );

    if (alasanAdmin !== null) {
      try {
        const { error } = await supabase
          .from('pendaftaran')
          .update({ 
            status_seleksi: 'ditolak',
            alasan_tolak: alasanAdmin
          })
          .eq('id', peserta.id);
          
        if (error) throw error;
        
        alert('Peserta berhasil ditolak beserta alasannya!'); 
        refreshData(); 
      } catch (error) { 
        console.error(error);
        alert(`Gagal memproses penolakan: ${error.message}`); 
      }
    }
  };

  const pendaftarPending = pendaftar.filter(p => p.status_seleksi === 'pending');

  return (
    <div className="p-6 md:p-10">
      <FadeIn>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Antrean Pendaftar Masuk</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola data peserta. Menerima peserta otomatis mengurangi sisa kuota.</p>
          </div>
        </div>

        <div className="admin-table-box">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="admin-th">Nama & Asal</th>
                  <th className="admin-th">NIM/NISN</th>
                  <th className="admin-th">Pilihan Divisi</th>
                  <th className="admin-th">Periode Magang</th> 
                  <th className="admin-th text-center">Berkas Utama</th>
                  {/* Tambahan Kolom Baru Khusus Sosmed */}
                  <th className="admin-th text-center">Bukti Sosmed</th> 
                  <th className="admin-th text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {pendaftarPending.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-10 text-center text-slate-500 italic">Tidak ada pendaftar baru dalam antrean.</td></tr>
                ) : (
                  pendaftarPending.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{row.nama_peserta}</p>
                        <p className="text-xs text-slate-500">{row.asal_sekolah_kampus}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{row.nim_nisn}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium text-blue-800">
                        {getNamaDivisi(row.divisi_id)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="block text-xs font-bold text-slate-700">{formatDate(row.tanggal_mulai)}</span>
                        <span className="block text-xs text-slate-500">s.d. {formatDate(row.tanggal_akhir)}</span>
                      </td>

                      {/* Berkas Utama (Surat, CV, Porto, dll) */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col gap-2 items-center justify-center">
                          <button onClick={() => handleDownloadPDF(row.berkas_pdf)} className="admin-btn-dl w-full text-[11px] py-1">Surat</button>
                          {row.berkas_cv && <button onClick={() => handleDownloadPDF(row.berkas_cv)} className="admin-btn-dl w-full text-[11px] py-1">CV</button>}
                          {row.berkas_portofolio && <button onClick={() => handleDownloadPDF(row.berkas_portofolio)} className="admin-btn-dl w-full text-[11px] py-1">Porto</button>}
                        </div>
                      </td>

                      {/* Kolom Bukti Screenshot Sosial Media */}
                      <td className="px-6 py-4 text-center">
                        <div className="grid grid-cols-2 gap-1 items-center justify-center">
                          {row.bukti_ig && <button onClick={() => handleDownloadPDF(row.bukti_ig)} className="bg-pink-100 text-pink-700 hover:bg-pink-600 hover:text-white rounded text-[10px] py-1 px-2 font-bold transition">IG</button>}
                          {row.bukti_fb && <button onClick={() => handleDownloadPDF(row.bukti_fb)} className="bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white rounded text-[10px] py-1 px-2 font-bold transition">FB</button>}
                          {row.bukti_tt && <button onClick={() => handleDownloadPDF(row.bukti_tt)} className="bg-slate-200 text-slate-800 hover:bg-slate-800 hover:text-white rounded text-[10px] py-1 px-2 font-bold transition">TT</button>}
                          {row.bukti_yt && <button onClick={() => handleDownloadPDF(row.bukti_yt)} className="bg-red-100 text-red-700 hover:bg-red-600 hover:text-white rounded text-[10px] py-1 px-2 font-bold transition">YT</button>}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col justify-center gap-2 items-center h-full">
                          <button onClick={() => handleTerima(row)} className="admin-btn-acc w-full">Terima</button>
                          <button onClick={() => handleTolak(row)} className="admin-btn-reject w-full">Tolak</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};
export default PendaftarView;
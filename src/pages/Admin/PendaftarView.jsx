import React from 'react';
import FadeIn from '../../components/FadeIn';

const PendaftarView = ({ pendaftar, quotas, refreshData }) => {
  
  const handleDownloadPDF = (filename) => {
    window.open(`http://localhost:5000/uploads/${filename}`, '_blank');
  };

  const handleTerima = async (peserta) => {
    const divisiTarget = quotas.find(q => q.id === peserta.divisi_id);
    if ((divisiTarget.total - divisiTarget.terisi) <= 0) return alert("Gagal: Kuota untuk divisi ini sudah penuh!");

    if(window.confirm(`Yakin ingin MENERIMA ${peserta.nama_peserta}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/terima/${peserta.id}`, { method: 'PUT' });
        if (response.ok) { alert('Peserta berhasil diterima!'); refreshData(); } 
        else alert('Gagal memproses penerimaan.');
      } catch (error) { alert('Gagal menghubungi Server Database.'); }
    }
  };

  // FITUR BARU: Fungsi Tolak
  const handleTolak = async (peserta) => {
    if(window.confirm(`Yakin ingin MENOLAK ${peserta.nama_peserta}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/tolak/${peserta.id}`, { method: 'PUT' });
        if (response.ok) { alert('Peserta berhasil ditolak!'); refreshData(); } 
        else alert('Gagal memproses penolakan.');
      } catch (error) { alert('Gagal menghubungi Server Database.'); }
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
                  <th className="admin-th text-center">Berkas</th>
                  <th className="admin-th text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {pendaftarPending.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500 italic">Tidak ada pendaftar baru dalam antrean.</td></tr>
                ) : (
                  pendaftarPending.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{row.nama_peserta}</p>
                        <p className="text-xs text-slate-500">{row.asal_sekolah_kampus}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{row.nim_nisn}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium text-blue-800">{row.nama_divisi}</td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleDownloadPDF(row.berkas_pdf)} className="admin-btn-dl">Cek PDF</button>
                      </td>
                      <td className="px-6 py-4 text-center flex justify-center gap-2 items-center h-full">
                        <button onClick={() => handleTerima(row)} className="admin-btn-acc">Terima</button>
                        {/* FITUR BARU: Tombol Tolak */}
                        <button onClick={() => handleTolak(row)} className="admin-btn-reject">Tolak</button>
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
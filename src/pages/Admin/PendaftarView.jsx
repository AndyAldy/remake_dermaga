import React from 'react';
import FadeIn from '../../components/FadeIn';

const PendaftarView = ({ pendaftar, quotas, refreshData }) => {
  
  const handleDownloadPDF = (filename) => {
    window.open(`http://localhost:5000/uploads/${filename}`, '_blank');
  };

  // FITUR BARU: Fungsi untuk merapikan format tanggal (Contoh: 15 Jun 2026)
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
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

  const handleTolak = async (peserta) => {
    const alasanAdmin = window.prompt(
      `Masukkan alasan menolak berkas milik ${peserta.nama_peserta}:`, 
      "Berkas kurang lengkap / Kuota penuh"
    );

    if (alasanAdmin !== null) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/tolak/${peserta.id}`, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ alasan: alasanAdmin }) 
        });
        
        if (response.ok) { alert('Peserta berhasil ditolak beserta alasannya!'); refreshData(); } 
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
                  {/* KOLOM BARU */}
                  <th className="admin-th">Periode Magang</th> 
                  <th className="admin-th text-center">Berkas</th>
                  <th className="admin-th text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {pendaftarPending.length === 0 ? (
                  /* colSpan diubah menjadi 6 karena ada tambahan 1 kolom baru */
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500 italic">Tidak ada pendaftar baru dalam antrean.</td></tr>
                ) : (
                  pendaftarPending.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{row.nama_peserta}</p>
                        <p className="text-xs text-slate-500">{row.asal_sekolah_kampus}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{row.nim_nisn}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium text-blue-800">{row.nama_divisi}</td>
                      
                      {/* TAMPILAN KOLOM BARU: Tanggal Mulai dan Akhir */}
                      <td className="px-6 py-4">
                        <span className="block text-xs font-bold text-slate-700">{formatDate(row.tanggal_mulai)}</span>
                        <span className="block text-xs text-slate-500">s.d. {formatDate(row.tanggal_akhir)}</span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col gap-2 items-center justify-center">
                          <button onClick={() => handleDownloadPDF(row.berkas_pdf)} className="admin-btn-dl w-full">Cek Surat</button>
                          {row.berkas_cv && (
                            <button onClick={() => handleDownloadPDF(row.berkas_cv)} className="admin-btn-dl w-full">Cek CV</button>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2 items-center h-full">
                          <button onClick={() => handleTerima(row)} className="admin-btn-acc">Terima</button>
                          <button onClick={() => handleTolak(row)} className="admin-btn-reject">Tolak</button>
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
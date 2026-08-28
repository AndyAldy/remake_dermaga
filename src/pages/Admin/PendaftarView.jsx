import React from 'react';
import FadeIn from '../../components/FadeIn';

const PendaftarView = ({ pendaftar, setPendaftar, quotas, setQuotas }) => {
  
  const handleDownloadImage = (namaPendaftar) => {
    const dummyImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const link = document.createElement("a");
    link.href = dummyImageBase64;
    link.download = `Berkas_${namaPendaftar.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // LOGIKA TERIMA PESERTA
  const handleTerima = (peserta) => {
    // 1. Cek apakah kuota divisi ini masih ada
    const divisiTarget = quotas.find(q => q.id === peserta.divisiId);
    if ((divisiTarget.total - divisiTarget.terisi) <= 0) {
      alert("Gagal: Kuota untuk divisi ini sudah penuh! Silakan tambah kuota di Beranda Admin.");
      return;
    }

    if(window.confirm(`Yakin ingin MENERIMA ${peserta.nama}?`)) {
      // 2. Tambah angka "terisi" di kuota
      setQuotas(quotas.map(q => q.id === peserta.divisiId ? { ...q, terisi: q.terisi + 1 } : q));
      // 3. Ubah status peserta agar hilang dari antrean pending
      setPendaftar(pendaftar.map(p => p.id === peserta.id ? { ...p, status: 'diterima' } : p));
    }
  };

  // Filter hanya tampilkan yang statusnya masih 'pending'
  const pendaftarPending = pendaftar.filter(p => p.status === 'pending');

  return (
    <div className="p-6 md:p-10">
      <FadeIn>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Antrean Pendaftar Masuk</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola data peserta. Menerima peserta otomatis mengurangi sisa kuota.</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold">Nama & Asal</th>
                  <th className="px-6 py-4 font-semibold">NIM/NISN</th>
                  <th className="px-6 py-4 font-semibold">Pilihan Divisi</th>
                  <th className="px-6 py-4 font-semibold text-center">Berkas</th>
                  <th className="px-6 py-4 font-semibold text-center">Aksi (Terima/Tolak)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {pendaftarPending.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-500 italic">Tidak ada pendaftar baru dalam antrean.</td>
                  </tr>
                ) : (
                  pendaftarPending.map((row) => {
                    // Cari nama divisi untuk ditampilkan di tabel
                    const namaDivisi = quotas.find(q => q.id === row.divisiId)?.divisi;
                    
                    return (
                      <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{row.nama}</p>
                          <p className="text-xs text-slate-500">{row.asal}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{row.nim}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium text-blue-800">{namaDivisi}</td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handleDownloadImage(row.nama)} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center gap-1 mx-auto bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            Unduh
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center space-x-2">
                          <button onClick={() => handleTerima(row)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow">Terima</button>
                          <button onClick={() => setPendaftar(pendaftar.map(p => p.id === row.id ? { ...p, status: 'ditolak' } : p))} className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1.5 rounded text-xs font-bold transition-colors">Tolak</button>
                        </td>
                      </tr>
                    )
                  })
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
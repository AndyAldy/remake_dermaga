import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';
import QuotaTable from '../components/QuotaTable';

const SeleksiView = ({ quotas, pendaftar, setPendaftar, user, setUser }) => {
  // Cek apakah user saat ini sudah pernah mengirim form
  const myApplication = pendaftar.find(p => p.nama === user?.name);

  // State untuk Input Form
  const [nama, setNama] = useState(user?.name || '');
  const [nim, setNim] = useState('');
  const [asal, setAsal] = useState('');
  const [divisiId, setDivisiId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > (2 * 1024 * 1024)) {
        setFileError('Gagal: Ukuran file maksimal 2MB!');
        setSelectedFile(null);
      } else if (file.type !== 'application/pdf') {
        setFileError('Gagal: Format file harus PDF!');
        setSelectedFile(null);
      } else {
        setFileError('');
        setSelectedFile(file);
      }
    }
  };

  // Fungsi saat form dikirim
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileError('File surat pengantar wajib diunggah!');
      return;
    }
    if (!divisiId) {
      alert('Mohon pilih divisi penempatan!');
      return;
    }

    // Memasukkan data baru ke Global State App.jsx agar dibaca oleh Admin
    const newPeserta = {
      id: Date.now(),
      nama: nama,
      nim: nim,
      asal: asal,
      periode: `${startDate} s/d ${endDate}`,
      divisiId: parseInt(divisiId),
      status: 'pending' // Status awal
    };

    setPendaftar([...pendaftar, newPeserta]);
    alert("Berkas berhasil dikirim! Silakan tunggu validasi dari Admin.");
  };

  // ==========================================
  // TAMPILAN JIKA SUDAH PERNAH MENGIRIM BERKAS
  // ==========================================
  if (myApplication) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen text-center flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <FadeIn>
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
              
              {/* Jika Masih Pending */}
              {myApplication.status === 'pending' && (
                <>
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Berkas Sedang Diproses</h2>
                  <p className="text-slate-600">Terima kasih, <b>{user?.name}</b>. Berkas pendaftaran Anda telah kami terima dan sedang masuk dalam antrean validasi Admin.</p>
                  <p className="text-sm text-amber-600 font-bold bg-amber-50 py-2 px-4 rounded-lg inline-block mt-6">Harap cek kembali halaman ini secara berkala.</p>
                </>
              )}

              {/* Jika Diterima Admin */}
              {myApplication.status === 'diterima' && (
                <>
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Selamat! Anda Diterima</h2>
                  <p className="text-slate-600">Admin BPS Kota Semarang telah memvalidasi berkas Anda dan Anda resmi diterima sebagai peserta magang/PKL.</p>
                  {/* Tombol ajaib untuk meng-upgrade akun jadi "Lulus" */}
                  <button onClick={() => setUser({...user, status: 'lulus'})} className="mt-8 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
                    Buka Portal Pelaksanaan &rarr;
                  </button>
                </>
              )}

              {/* Jika Ditolak Admin */}
              {myApplication.status === 'ditolak' && (
                <>
                  <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Mohon Maaf, Berkas Ditolak</h2>
                  <p className="text-slate-600">Terdapat ketidaksesuaian pada dokumen Anda atau kuota telah penuh.</p>
                  {/* Hapus data peserta ini dari array agar dia bisa mengisi form ulang */}
                  <button onClick={() => setPendaftar(pendaftar.filter(p => p.nama !== user.name))} className="mt-8 bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
                    Isi Ulang Formulir
                  </button>
                </>
              )}

            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN FORMULIR (JIKA BELUM MENGIRIM)
  // ==========================================
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        
        <FadeIn>
          <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 mb-8 rounded shadow-sm flex items-start gap-4">
            <svg className="w-6 h-6 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <p className="font-bold">Status Anda: Dalam Tahap Pemberkasan</p>
              <p className="text-sm mt-1">Harap lengkapi formulir di bawah ini dan unggah surat pengantar.</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-4">Formulir Peserta Magang</h2>
            
            {/* TAMBAHAN onSubmit pada FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                  <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">NIM / NISN</label>
                  <input type="text" value={nim} onChange={(e) => setNim(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 focus:outline-none" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Asal Universitas / Sekolah</label>
                  <input type="text" value={asal} onChange={(e) => setAsal(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Rencana Periode</label>
                  <div className="flex items-center gap-2">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 bg-white text-sm" required />
                    <span className="font-bold">-</span>
                    <input type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 bg-white text-sm" required />
                  </div>
                </div>
              </div>

              {/* FITUR BARU: Dropdown Pemilihan Divisi */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pilihan Divisi Penempatan</label>
                <select value={divisiId} onChange={(e) => setDivisiId(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 focus:outline-none bg-white" required>
                  <option value="">-- Silakan Pilih Divisi --</option>
                  {quotas.map(q => (
                    <option key={q.id} value={q.id}>{q.divisi} (Sisa Kuota: {q.total - q.terisi})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Unggah Surat Pengantar (PDF)</label>
                <label className={`block border-2 ${fileError ? 'border-red-400 bg-red-50' : selectedFile ? 'border-emerald-400 bg-emerald-50' : 'border-dashed border-slate-300 hover:bg-slate-50'} rounded-lg p-8 text-center transition-colors cursor-pointer`}>
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                  {selectedFile ? (
                    <div>
                      <svg className="mx-auto h-12 w-12 text-emerald-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <p className="text-sm text-emerald-700 font-bold">{selectedFile.name}</p>
                    </div>
                  ) : (
                    <div>
                      <svg className={`mx-auto h-12 w-12 mb-3 ${fileError ? 'text-red-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      <p className="text-sm font-medium">Klik untuk memilih file PDF</p>
                    </div>
                  )}
                </label>
                {fileError && <p className="text-red-500 text-xs mt-2 font-semibold">{fileError}</p>}
              </div>

              <div className="flex justify-end pt-4">
                {/* UBAH: type menjadi submit */}
                <button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
                  Simpan & Kirim Berkas
                </button>
              </div>
            </form>
          </div>
        </FadeIn>

        <QuotaTable quotas={quotas} />
        
      </div>
    </div>
  );
};

export default SeleksiView;
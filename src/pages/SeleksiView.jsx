import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';
import QuotaTable from '../components/QuotaTable';

const SeleksiView = ({ quotas, pendaftar, user, setUser, refreshData }) => {
  // Cek database, apakah user_id peserta ini sudah ada di tabel pendaftaran
  const myApplication = pendaftar.find(p => p.user_id === user?.id);

  const [nama, setNama] = useState(user?.name);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return setFileError('File surat pengantar wajib diunggah!');
    if (!divisiId) return alert('Mohon pilih divisi penempatan!');

    // Format pengiriman file dan data menggunakan FormData
    const formData = new FormData();
    formData.append('user_id', user.id);
    formData.append('nama_peserta', nama);
    formData.append('nim_nisn', nim);
    formData.append('asal', asal);
    formData.append('tanggal_mulai', startDate);
    formData.append('tanggal_akhir', endDate);
    formData.append('divisi_id', divisiId);
    formData.append('berkas_pdf', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/api/pendaftar', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert("Berkas berhasil dikirim ke Admin!");
        refreshData(); // Perbarui data secara otomatis dari database
      } else {
        alert("Gagal mengirim berkas ke server.");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi.");
    }
  };

  // TAMPILAN JIKA SUDAH MENGIRIM BERKAS
  if (myApplication) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen text-center flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <FadeIn>
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
              {myApplication.status_seleksi === 'pending' && (
                <>
                  <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Berkas Sedang Diproses</h2>
                  <p className="text-slate-600">Berkas pendaftaran Anda masuk dalam antrean validasi Admin.</p>
                </>
              )}
              {myApplication.status_seleksi === 'ditolak' && (
                <h2 className="text-2xl font-bold text-red-600 mb-2">Mohon Maaf, Berkas Ditolak Admin.</h2>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                  <input type="text" value={nama} disabled className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 focus:outline-none" required />
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
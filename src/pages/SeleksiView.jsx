import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';
import QuotaTable from '../components/QuotaTable';

// TAMBAHKAN 'quotas' SEBAGAI PROPS DI SINI
const SeleksiView = ({ quotas }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setFileError('Gagal: Ukuran file melebihi batas maksimal 2MB!');
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

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        
        <FadeIn>
          <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 mb-8 rounded shadow-sm flex items-start gap-4">
            <svg className="w-6 h-6 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <p className="font-bold">Status Anda: Dalam Tahap Pemberkasan & Seleksi</p>
              <p className="text-sm mt-1">Harap lengkapi formulir di bawah ini dan unggah surat pengantar. Admin akan memvalidasi data Anda maksimal 3x24 jam kerja.</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-10 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-4">Formulir Peserta Magang</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 focus:outline-none" placeholder="Sesuai KTP/KTM" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">NIM / NISN</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 focus:outline-none" placeholder="Nomor Induk" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Asal Universitas / Sekolah</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 focus:outline-none" placeholder="Contoh: Universitas Diponegoro" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Rencana Periode Magang</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 focus:outline-none bg-white text-slate-700 text-sm" 
                      required
                    />
                    <span className="text-slate-400 font-bold">-</span>
                    <input 
                      type="date" 
                      value={endDate}
                      min={startDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-900 focus:outline-none bg-white text-slate-700 text-sm" 
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Unggah Surat Pengantar / Pernyataan (PDF)</label>
                <label className={`block border-2 ${fileError ? 'border-red-400 bg-red-50' : selectedFile ? 'border-emerald-400 bg-emerald-50' : 'border-dashed border-slate-300 hover:bg-slate-50'} rounded-lg p-8 text-center transition-colors cursor-pointer`}>
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                  {selectedFile ? (
                    <div>
                      <svg className="mx-auto h-12 w-12 text-emerald-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <p className="text-sm text-emerald-700 font-bold break-all px-4">{selectedFile.name}</p>
                      <p className="text-xs text-emerald-600 mt-1">File berhasil ditambahkan ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                      <p className="text-xs text-slate-500 mt-4 underline decoration-slate-300">Klik lagi untuk mengganti file</p>
                    </div>
                  ) : (
                    <div>
                      <svg className={`mx-auto h-12 w-12 mb-3 ${fileError ? 'text-red-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      <p className={`text-sm font-medium ${fileError ? 'text-red-600' : 'text-slate-600'}`}>Klik di sini untuk memilih file PDF</p>
                      <p className="text-xs text-slate-400 mt-1">Maksimal ukuran file: 2MB</p>
                    </div>
                  )}
                </label>
                {fileError && (
                  <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {fileError}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <button type="button" className="bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
                  Simpan & Kirim Berkas
                </button>
              </div>
            </form>
          </div>
        </FadeIn>

        {/* TERUSKAN DATA QUOTAS KE TABEL */}
        <QuotaTable quotas={quotas} />
        
      </div>
    </div>
  );
};

export default SeleksiView;
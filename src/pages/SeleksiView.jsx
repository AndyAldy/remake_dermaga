import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';
import QuotaTable from '../components/QuotaTable';
import { supabase } from '../supabase'; // Pastikan file konfigurasi supabase.js sudah dibuat
import '../styles/SeleksiView.css';

const SeleksiView = ({ quotas, pendaftar, user, refreshData }) => {
  const myApp = pendaftar.find(p => p.user_id === user?.id);

  const [nim, setNim] = useState('');
  const [asal, setAsal] = useState('');
  const [divisiId, setDivisiId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  
  const [selectedCv, setSelectedCv] = useState(null);
  const [cvError, setCvError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2097152) { setFileError('Maksimal 2MB!'); setSelectedFile(null); }
    else if (file && file.type !== 'application/pdf') { setFileError('Harus PDF!'); setSelectedFile(null); }
    else { setFileError(''); setSelectedFile(file); }
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2097152) { setCvError('Maksimal 2MB!'); setSelectedCv(null); }
    else if (file && file.type !== 'application/pdf') { setCvError('Harus PDF!'); setSelectedCv(null); }
    else { setCvError(''); setSelectedCv(file); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedCv || !divisiId) return alert('Lengkapi divisi, Surat Pengantar, dan file CV!');

    try {
      // 1. Upload Surat Pengantar (PDF) ke Supabase Storage
      const pdfName = `${Date.now()}-${selectedFile.name.replace(/\s+/g, '_')}`;
      const { error: pdfError } = await supabase.storage
        .from('berkas_pendaftar')
        .upload(pdfName, selectedFile);
      if (pdfError) throw pdfError;
      
      const { data: pdfData } = supabase.storage.from('berkas_pendaftar').getPublicUrl(pdfName);
      const pdfUrl = pdfData.publicUrl;

      // 2. Upload Berkas CV (PDF) ke Supabase Storage
      const cvName = `${Date.now()}-${selectedCv.name.replace(/\s+/g, '_')}`;
      const { error: cvError } = await supabase.storage
        .from('berkas_pendaftar')
        .upload(cvName, selectedCv);
      if (cvError) throw cvError;
      
      const { data: cvData } = supabase.storage.from('berkas_pendaftar').getPublicUrl(cvName);
      const cvUrl = cvData.publicUrl;

      // 3. Simpan seluruh data teks dan URL ke tabel pendaftaran
      const { error: dbError } = await supabase
        .from('pendaftaran')
        .insert([
          {
            user_id: user.id,
            nama_peserta: user.name,
            nim_nisn: nim,
            asal_sekolah_kampus: asal,
            tanggal_mulai: startDate,
            tanggal_akhir: endDate,
            divisi_id: divisiId,
            berkas_pdf: pdfUrl,
            berkas_cv: cvUrl,
            status_seleksi: 'pending'
          }
        ]);

      if (dbError) throw dbError;

      alert("Pendaftaran Berhasil Dikirim!");
      refreshData();
    } catch (err) {
      console.error(err);
      alert(`Gagal mengirim berkas: ${err.message}`);
    }
  };

  const handleReapply = async () => {
    if (window.confirm("Hapus data pendaftaran sebelumnya dan isi ulang formulir?")) {
      try {
        // Hapus baris data pendaftar dari tabel Supabase
        const { error } = await supabase
          .from('pendaftaran')
          .delete()
          .eq('id', myApp.id);
        
        if (error) throw error;
        
        refreshData();
      } catch (e) {
        console.error(e);
        alert("Gagal menghapus data.");
      }
    }
  };

  if (myApp) {
    return (
      <div className="sv-center-wrap">
        <FadeIn>
          <div className="sv-status-box">
            {myApp.status_seleksi === 'pending' ? (
              <>
                <div className="sv-icon-spin">
                  <svg className="w-10 h-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Sedang Diproses</h2>
                <p className="text-slate-600">Mohon bersabar, berkas pendaftaran Anda masuk dalam antrean validasi Admin 24/7.</p>
              </>
            ) : (
              <>
                <div className="sv-icon-fail">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-3">Mohon Maaf, Berkas Anda Ditolak</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left mx-4">
                  <p className="text-sm font-bold text-red-800 mb-1">Catatan dari Admin BPS:</p>
                  <p className="text-slate-700 text-sm italic">"{myApp.alasan_tolak || 'Tidak memenuhi kriteria yang berlaku.'}"</p>
                </div>
                <p className="text-slate-600 text-sm mb-8 leading-relaxed px-4">
                  Silakan perbaiki berkas Anda sesuai catatan di atas. Anda dapat menghapus data pendaftaran sebelumnya dan mengisi ulang formulir pendaftaran.
                </p>
                <button onClick={handleReapply} className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all focus:outline-none">
                  Hapus & Isi Ulang Formulir
                </button>
              </>
            )}
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="sv-wrapper">
      <div className="sv-banner">
        <div><p className="font-bold">Tahap Pemberkasan</p><p className="text-sm">Lengkapi data di bawah ini.</p></div>
      </div>
      <FadeIn delay={200}>
        <div className="sv-card">
          <h2 className="sv-title">Formulir Magang</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="sv-label">Nama Lengkap</label><input type="text" value={user?.name || ''} readOnly className="input-field" /></div>
              <div><label className="sv-label">NIM/NISN</label><input type="text" value={nim} onChange={(e)=>setNim(e.target.value)} required className="input-field" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="sv-label">Asal Instansi</label><input type="text" value={asal} onChange={(e)=>setAsal(e.target.value)} required className="input-field" /></div>
              <div>
                <label className="sv-label">Rencana Periode</label>
                <div className="flex gap-2">
                  <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} required className="input-field" />
                  <input type="date" min={startDate} value={endDate} onChange={(e)=>setEndDate(e.target.value)} required className="input-field" />
                </div>
              </div>
            </div>
            <div>
              <label className="sv-label">Pilih Divisi</label>
              <select value={divisiId} onChange={(e)=>setDivisiId(e.target.value)} required className="input-field">
                <option value="">-- Pilih --</option>
                {quotas.map(q => <option key={q.id} value={q.id}>{q.divisi}</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="sv-label">Unggah Surat Pengantar (PDF)</label>
                  <label className={`sv-upload ${fileError ? 'sv-upload-error' : selectedFile ? 'sv-upload-success' : 'sv-upload-default'}`}>
                    <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                    <p className="font-bold">{selectedFile ? selectedFile.name : 'Klik upload Pengantar'}</p>
                    {fileError && <p className="text-red-500 text-xs mt-2">{fileError}</p>}
                  </label>
                </div>
                <div>
                  <label className="sv-label">Unggah CV (PDF)</label>
                  <label className={`sv-upload ${cvError ? 'sv-upload-error' : selectedCv ? 'sv-upload-success' : 'sv-upload-default'}`}>
                    <input type="file" accept=".pdf" className="hidden" onChange={handleCvChange} />
                    <p className="font-bold">{selectedCv ? selectedCv.name : 'Klik upload CV'}</p>
                    {cvError && <p className="text-red-500 text-xs mt-2">{cvError}</p>}
                  </label>
                </div>
            </div>
            <div className="flex justify-end"><button type="submit" className="btn-primary px-8">Kirim Berkas</button></div>
          </form>
        </div>
      </FadeIn>
      <QuotaTable quotas={quotas} />
    </div>
  );
};
export default SeleksiView;
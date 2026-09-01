import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';
import QuotaTable from '../components/QuotaTable';
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2097152) { setFileError('Maksimal 2MB!'); setSelectedFile(null); }
    else if (file && file.type !== 'application/pdf') { setFileError('Harus PDF!'); setSelectedFile(null); }
    else { setFileError(''); setSelectedFile(file); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !divisiId) return alert('Lengkapi divisi dan file PDF!');

    const formData = new FormData();
    formData.append('user_id', user.id); formData.append('nama_peserta', user.name);
    formData.append('nim_nisn', nim); formData.append('asal', asal);
    formData.append('tanggal_mulai', startDate); formData.append('tanggal_akhir', endDate);
    formData.append('divisi_id', divisiId); formData.append('berkas_pdf', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/api/pendaftar', { method: 'POST', body: formData });
      if (response.ok) { alert("Berhasil!"); refreshData(); }
    } catch (err) { alert("Error."); }
  };

  if (myApp) {
    return (
      <div className="sv-center-wrap">
        <FadeIn>
          <div className="sv-status-box">
            {myApp.status_seleksi === 'pending' ? (
              <><div className="sv-icon-spin">...</div><h2 className="text-2xl font-bold mb-2">Sedang Diproses, Mohon Bersabar 24/7</h2></>
            ) : (
              <><div className="sv-icon-fail">X</div><h2 className="text-2xl font-bold text-red-600 mb-2">Berkas Ditolak</h2></>
            )}
          </div>
        </FadeIn>
      </div>
    );
  }
const handleReapply = async () => {
    if (window.confirm("Hapus data pendaftaran sebelumnya dan isi ulang formulir?")) {
      try {
        await fetch(`http://localhost:5000/api/pendaftar/${myApp.id}`, { method: 'DELETE' });
        refreshData();
      } catch(e) { alert("Gagal menghapus data."); }
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
                <p className="text-slate-600">Berkas pendaftaran Anda masuk dalam antrean validasi Admin.</p>
              </>
            ) : (
              // TAMPILAN BARU: Permohonan Maaf & Tombol Daftar Ulang
              <>
                <div className="sv-icon-fail">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-3">Mohon Maaf, Berkas Anda Ditolak</h2>
                <p className="text-slate-600 text-sm mb-8 leading-relaxed px-4">
                  Berdasarkan hasil verifikasi tim BPS Kota Semarang, permohonan magang Anda belum dapat kami terima saat ini. Hal ini mungkin disebabkan oleh ketidaksesuaian dokumen pengantar atau kuota divisi yang telah terpenuhi penuh.
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
              {/* FIX READONLY INPUT */}
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
            <div>
              <label className="sv-label">Unggah Surat (PDF)</label>
              <label className={`sv-upload ${fileError ? 'sv-upload-error' : selectedFile ? 'sv-upload-success' : 'sv-upload-default'}`}>
                <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                <p className="font-bold">{selectedFile ? selectedFile.name : 'Klik untuk upload PDF'}</p>
                {fileError && <p className="text-red-500 text-xs mt-2">{fileError}</p>}
              </label>
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
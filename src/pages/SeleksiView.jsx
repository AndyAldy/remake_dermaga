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
              <><div className="sv-icon-spin">...</div><h2 className="text-2xl font-bold mb-2">Sedang Diproses</h2></>
            ) : (
              <><div className="sv-icon-fail">X</div><h2 className="text-2xl font-bold text-red-600 mb-2">Berkas Ditolak</h2></>
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
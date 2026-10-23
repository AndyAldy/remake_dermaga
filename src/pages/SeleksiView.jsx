import React, { useState } from 'react';
import FadeIn from '../components/FadeIn';
import QuotaTable from '../components/QuotaTable';
import { supabase } from '../supabase';
import '../styles/SeleksiView.css';

const SeleksiView = ({ quotas, pendaftar, user, refreshData }) => {
  const myApp = pendaftar.find(p => p.user_id === user?.id);

  const [nim, setNim] = useState('');
  const [asal, setAsal] = useState('');
  const [divisiId, setDivisiId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // File States
  const [ktmFile, setKtmFile] = useState(null);
  const [ktmError, setKtmError] = useState('');

  const [suratFile, setSuratFile] = useState(null);
  const [suratError, setSuratError] = useState('');

  const [cvFile, setCvFile] = useState(null);
  const [cvError, setCvError] = useState('');

  const [portoFile, setPortoFile] = useState(null);
  const [portoError, setPortoError] = useState('');

  // Social Media Follow Tracking (IG, FB, TikTok, YouTube)
  const [followed, setFollowed] = useState({
    ig: false,
    fb: false,
    tt: false,
    yt: false
  });

  const [isLoading, setIsLoading] = useState(false);

  // Helper Validasi File PDF/Gambar max 2MB
  const handleFileValidation = (e, setFileFunc, setErrorFunc, isPdfOnly = true) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2097152) {
      setErrorFunc('Maksimal ukuran file 2MB!');
      setFileFunc(null);
      return;
    }
    if (isPdfOnly && file.type !== 'application/pdf') {
      setErrorFunc('Format file harus PDF!');
      setFileFunc(null);
      return;
    }
    setErrorFunc('');
    setFileFunc(file);
  };

  // Cek apakah divisi yang dipilih termasuk kategori IT / Komputer / Informatika
  const selectedDivisiObj = quotas.find(q => q.id === divisiId);
  const divisiNameLower = selectedDivisiObj ? selectedDivisiObj.divisi.toLowerCase() : '';
  const isDivisiIT = divisiNameLower.includes('it') || 
                     divisiNameLower.includes('informatika') || 
                     divisiNameLower.includes('software') || 
                     divisiNameLower.includes('komputer') || 
                     divisiNameLower.includes('developer');

  // Handle klik tombol follow medsos (membuka tab baru dan menandai sudah difollow)
  const handleFollowAction = (platform, url) => {
    window.open(url, '_blank');
    setFollowed(prev => ({ ...prev, [platform]: true }));
  };

  const allSocialsFollowed = followed.ig && followed.fb && followed.tt && followed.yt;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ktmFile || !suratFile || !cvFile || !portoFile || !divisiId) {
      return alert('Mohon lengkapi semua pilihan divisi dan unggah seluruh berkas wajib!');
    }
    if (!allSocialsFollowed) {
      return alert('Anda wajib mengikuti semua akun media sosial BPS Kota Semarang terlebih dahulu!');
    }

    setIsLoading(true);

    try {
      const uploadToSupabaseStorage = async (file) => {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const { error: uploadErr } = await supabase.storage
          .from('berkas_pendaftar')
          .upload(fileName, file);
        if (uploadErr) throw uploadErr;

        const { data } = supabase.storage.from('berkas_pendaftar').getPublicUrl(fileName);
        return data.publicUrl;
      };

      // 1. Upload semua berkas ke Supabase Storage
      const ktmUrl = await uploadToSupabaseStorage(ktmFile);
      const suratUrl = await uploadToSupabaseStorage(suratFile);
      const cvUrl = await uploadToSupabaseStorage(cvFile);
      const portoUrl = await uploadToSupabaseStorage(portoFile);

      // 2. Simpan ke tabel pendaftaran
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
            berkas_ktm: ktmUrl,
            berkas_pdf: suratUrl,
            berkas_cv: cvUrl,
            berkas_portofolio: portoUrl,
            status_seleksi: 'pending'
          }
        ]);

      if (dbError) throw dbError;

      alert("Pendaftaran Berhasil Dikirim dan Masuk Antrean Verifikasi!");
      refreshData();
    } catch (err) {
      console.error(err);
      alert(`Gagal mengirim berkas: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReapply = async () => {
    if (window.confirm("Hapus data pendaftaran sebelumnya dan isi ulang formulir?")) {
      try {
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
                <button onClick={handleReapply} className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
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
        <div>
          <p className="font-bold text-lg">Tahap Pemberkasan Magang</p>
          <p className="text-sm text-blue-100">Pastikan seluruh dokumen dan persyaratan di bawah ini terpenuhi dengan benar.</p>
        </div>
      </div>

      {/* Box Petunjuk & Ketentuan Lampiran Sesuai Panduan BPS */}
      <FadeIn>
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl shadow-sm">
            <h3 className="font-bold text-amber-900 text-lg mb-2">📋 Ketentuan Lampiran Wajib Pendaftaran</h3>
            <ol className="list-decimal list-inside text-sm text-slate-700 space-y-1.5 leading-relaxed">
              <li><b>KTM (Kartu Tanda Mahasiswa)</b> atau Surat Keterangan Kuliah Aktif.</li>
              <li><b>Surat Pengantar</b> dari instansi/kampus/sekolah.</li>
              <li><b>Formulir Permohonan Magang</b> (<a href="https://docs.google.com/document/d/1-y2Z3eAoS3irhl7XpiPIfg91O862u1YnZGZ9ialcuoU/edit?tab=t.0" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">Unduh Template Dokumen Di Sini</a>).</li>
              <li><b>Daftar Riwayat Hidup (CV)</b>.</li>
              <li>
                <b>Portofolio</b> (Contoh template/outline dapat dilihat di <a href="http://s.bps.go.id/CTH_PORTOFOLIO" target="_blank" rel="noreferrer" className="text-blue-600 underline">s.bps.go.id/CTH_PORTOFOLIO</a>). 
                <br />
                <span className="text-xs text-slate-500 block ml-4 mt-1">
                  • <b>Mahasiswa TI:</b> Program atau Aplikasi yang pernah dibuat.<br />
                  • <b>Mahasiswa Non-TI:</b> Infografis atau videografi dengan data BPS Kota Semarang (sumber: semarangkota.bps.go.id - tabel statistik, berita resmi statistik, publikasi). Outline dapat berpedoman pada medsos BPS Kota Semarang.
                </span>
              </li>
              <li><b>Karya Infografis / Video Grafis / Content Statistik</b> menggunakan data statistik Kota Semarang terbaru bersumber dari BPS Kota Semarang (100% hasil sendiri bukan karya orang lain).</li>
              <li><b>Bukti Follow Media Sosial BPS Kota Semarang</b> (Wajib memfollow seluruh akun resmi di bawah sebelum mengirim formulir).</li>
            </ol>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <div className="sv-card max-w-4xl mx-auto my-6">
          <h2 className="sv-title">Formulir Pendaftaran Magang</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="sv-label">Nama Lengkap (Sesuai Akun)</label>
                <input type="text" value={user?.name || ''} readOnly className="input-field bg-slate-100 cursor-not-allowed" />
              </div>
              <div>
                <label className="sv-label">NIM / NISN</label>
                <input type="text" value={nim} onChange={(e)=>setNim(e.target.value)} required className="input-field" placeholder="Masukkan NIM atau NISN" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="sv-label">Asal Kampus / Sekolah</label>
                <input type="text" value={asal} onChange={(e)=>setAsal(e.target.value)} required className="input-field" placeholder="Contoh: Universitas Diponegoro" />
              </div>
              <div>
                <label className="sv-label">Rencana Periode Magang</label>
                <div className="flex gap-2">
                  <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} required className="input-field" title="Tanggal Mulai" />
                  <input type="date" min={startDate} value={endDate} onChange={(e)=>setEndDate(e.target.value)} required className="input-field" title="Tanggal Selesai" />
                </div>
              </div>
            </div>

            <div>
              <label className="sv-label">Pilih Divisi Penempatan</label>
              <select value={divisiId} onChange={(e)=>setDivisiId(e.target.value)} required className="input-field">
                <option value="">-- Pilih Divisi --</option>
                {quotas.map(q => <option key={q.id} value={q.id}>{q.divisi} (Sisa Kuota: {q.total - q.terisi})</option>)}
              </select>
            </div>

            {/* Grid Unggah Berkas Wajib */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
              {/* 1. KTM */}
              <div>
                <label className="sv-label">1. Unggah KTM / Surat Kuliah Aktif (PDF/Foto, Max 2MB)</label>
                <label className={`sv-upload ${ktmError ? 'sv-upload-error' : ktmFile ? 'sv-upload-success' : 'sv-upload-default'}`}>
                  <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => handleFileValidation(e, setKtmFile, setKtmError, false)} required />
                  <p className="font-bold text-xs truncate">{ktmFile ? ktmFile.name : '📁 Klik untuk Pilih File KTM'}</p>
                  {ktmError && <p className="text-red-500 text-xs mt-1">{ktmError}</p>}
                </label>
              </div>

              {/* 2. Surat Pengantar */}
              <div>
                <label className="sv-label">2. Unggah Surat Pengantar (PDF, Max 2MB)</label>
                <label className={`sv-upload ${suratError ? 'sv-upload-error' : suratFile ? 'sv-upload-success' : 'sv-upload-default'}`}>
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileValidation(e, setSuratFile, setSuratError, true)} required />
                  <p className="font-bold text-xs truncate">{suratFile ? suratFile.name : '📁 Klik untuk Pilih Surat Pengantar'}</p>
                  {suratError && <p className="text-red-500 text-xs mt-1">{suratError}</p>}
                </label>
              </div>

              {/* 3. Daftar Riwayat Hidup / CV */}
              <div>
                <label className="sv-label">3. Unggah Daftar Riwayat Hidup / CV (PDF, Max 2MB)</label>
                <label className={`sv-upload ${cvError ? 'sv-upload-error' : cvFile ? 'sv-upload-success' : 'sv-upload-default'}`}>
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileValidation(e, setCvFile, setCvError, true)} required />
                  <p className="font-bold text-xs truncate">{cvFile ? cvFile.name : '📁 Klik untuk Pilih CV'}</p>
                  {cvError && <p className="text-red-500 text-xs mt-1">{cvError}</p>}
                </label>
              </div>

              {/* 4. Portofolio (Dinamis Berdasarkan Divisi) */}
              <div>
                <label className="sv-label">
                  4. Unggah Portofolio ({isDivisiIT ? 'Mahasiswa TI: Program/Aplikasi' : 'Mahasiswa Non-TI: Infografis/Videografi BPS'}) (PDF, Max 2MB)
                </label>
                <label className={`sv-upload ${portoError ? 'sv-upload-error' : portoFile ? 'sv-upload-success' : 'sv-upload-default'}`}>
                  <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileValidation(e, setPortoFile, setPortoError, true)} required />
                  <p className="font-bold text-xs truncate">{portoFile ? portoFile.name : '📁 Klik untuk Pilih Portofolio'}</p>
                  {portoError && <p className="text-red-500 text-xs mt-1">{portoError}</p>}
                </label>
              </div>
            </div>

            {/* Verifikasi Follow Media Sosial BPS */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mt-4">
              <h4 className="font-bold text-slate-800 mb-2">📲 Verifikasi Follow Media Sosial Resmi BPS Kota Semarang</h4>
              <p className="text-xs text-slate-500 mb-4">Klik tombol di bawah satu per satu untuk mengikuti akun resmi. Tombol akan berubah menjadi abu-abu (Forbidden) setelah Anda mengikutinya.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Instagram */}
                <button
                  type="button"
                  disabled={followed.ig}
                  onClick={() => handleFollowAction('ig', 'https://instagram.com/bpskotasemarang')}
                  className={`py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-between transition ${
                    followed.ig 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300' 
                      : 'bg-pink-600 hover:bg-pink-700 text-white shadow-sm'
                  }`}
                >
                  <span>📷 Instagram (@bpskotasemarang)</span>
                  <span>{followed.ig ? '✔ Sudah Di-follow' : 'Ikuti ➔'}</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  disabled={followed.fb}
                  onClick={() => handleFollowAction('fb', 'https://facebook.com')}
                  className={`py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-between transition ${
                    followed.fb 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  }`}
                >
                  <span>📘 Facebook (BPS Kota Semarang)</span>
                  <span>{followed.fb ? '✔ Sudah Di-follow' : 'Ikuti ➔'}</span>
                </button>

                {/* TikTok */}
                <button
                  type="button"
                  disabled={followed.tt}
                  onClick={() => handleFollowAction('tt', 'https://tiktok.com')}
                  className={`py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-between transition ${
                    followed.tt 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300' 
                      : 'bg-slate-900 hover:bg-black text-white shadow-sm'
                  }`}
                >
                  <span>🎵 TikTok (@bps.kota.semarang)</span>
                  <span>{followed.tt ? '✔ Sudah Di-follow' : 'Ikuti ➔'}</span>
                </button>

                {/* YouTube */}
                <button
                  type="button"
                  disabled={followed.yt}
                  onClick={() => handleFollowAction('yt', 'https://youtube.com')}
                  className={`py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-between transition ${
                    followed.yt 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300' 
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                  }`}
                >
                  <span>▶ YouTube (@bpskotasemarang8647)</span>
                  <span>{followed.yt ? '✔ Sudah Di-follow' : 'Ikuti ➔'}</span>
                </button>
              </div>

              {!allSocialsFollowed && (
                <p className="text-xs text-amber-600 font-medium mt-3 text-center">⚠ Harap ikuti keempat media sosial di atas agar tombol Kirim Berkas dapat diakses.</p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={isLoading || !allSocialsFollowed} 
                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Mengunggah & Mengirim...' : 'Kirim Berkas Pendaftaran'}
              </button>
            </div>
          </form>
        </div>
      </FadeIn>
      
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <QuotaTable quotas={quotas} />
      </div>
    </div>
  );
};

export default SeleksiView;
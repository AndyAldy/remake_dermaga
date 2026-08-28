import React from 'react';

const Syarat = () => {
  return (
    <section id="syarat" className="py-16 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-800 mb-4">Persyaratan Pendaftaran</h3>
          <p className="text-slate-600">Penuhi dokumen berikut sebelum melakukan registrasi di sistem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Syarat 1 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <h4 className="font-bold text-lg mb-2">Surat Pengantar Resmi</h4>
            <p className="text-sm text-slate-500">Surat pengantar magang/PKL dari Universitas atau Sekolah asal yang ditujukan kepada Kepala BPS Kota Semarang.</p>
          </div>

          {/* Card Syarat 2 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h4 className="font-bold text-lg mb-2">Curriculum Vitae (CV)</h4>
            <p className="text-sm text-slate-500">Daftar riwayat hidup terbaru yang mencantumkan keahlian (tools/software), pengalaman, dan kontak yang bisa dihubungi.</p>
          </div>

          {/* Card Syarat 3 */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h4 className="font-bold text-lg mb-2">Transkrip Nilai / Rapor</h4>
            <p className="text-sm text-slate-500">Transkrip nilai semester terakhir (untuk Mahasiswa) atau scan Rapor semester terakhir (untuk Siswa SMK).</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Syarat;
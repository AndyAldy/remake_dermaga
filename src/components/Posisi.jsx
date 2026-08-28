import React from 'react';

const Posisi = () => {
  return (
    <section id="posisi" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-3xl font-bold text-blue-900 mb-4">Posisi Penempatan</h3>
            <p className="text-slate-600">Pilih divisi yang sesuai dengan jurusan dan minat Anda.</p>
          </div>
          <button className="hidden sm:block text-orange-600 font-semibold hover:underline">Lihat Semua Divisi &rarr;</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">Data Pengolahan & Analisis</h4>
            <p className="text-sm text-slate-500 mb-4">Fokus pada rekapitulasi data survei, pembersihan data, dan visualisasi dasar.</p>
            <div className="flex gap-2">
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">Statistika</span>
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">Matematika</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">Tim IT (Software Engineer)</h4>
            <p className="text-sm text-slate-500 mb-4">Pengembangan sistem internal, pemeliharaan website instansi, dan manajemen database.</p>
            <div className="flex gap-2">
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">Informatika</span>
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">Sistem Informasi</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">Administrasi Perkantoran</h4>
            <p className="text-sm text-slate-500 mb-4">Membantu tata kelola arsip, korespondensi, dan kegiatan operasional harian kantor.</p>
            <div className="flex gap-2">
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">Manajemen</span>
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">Administrasi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Posisi;
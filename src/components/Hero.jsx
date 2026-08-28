import React from 'react';

const Hero = () => {
  return (
    <header className="bg-blue-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-800 opacity-50 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="md:w-3/5">
          <div className="inline-block bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-6 border border-orange-500/50">
            PENDAFTARAN BATCH GANJIL 2026 DIBUKA
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Mulai Karir Profesionalmu Bersama <span className="text-orange-400">BPS Kota Semarang</span>
          </h2>
          <p className="text-lg text-blue-100 mb-10 max-w-xl leading-relaxed">
            Tingkatkan kompetensi dan dapatkan pengalaman kerja nyata melalui program magang dan Praktik Kerja Lapangan (PKL) di Badan Pusat Statistik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all text-center">
              Daftar Sekarang
            </button>
            <button className="bg-transparent hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-lg border border-blue-400 transition-all text-center">
              Cek Status Pendaftaran
            </button>
          </div>
        </div>
        
        <div className="md:w-2/5 flex justify-center">
           <div className="w-full max-w-sm aspect-square bg-slate-100 rounded-2xl p-6 shadow-2xl rotate-3 flex flex-col justify-center items-center border-4 border-white text-slate-400">
             <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
             </svg>
             <span className="font-semibold text-lg">Ilustrasi Magang</span>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
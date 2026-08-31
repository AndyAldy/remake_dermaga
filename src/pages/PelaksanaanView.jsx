import React from 'react';
import FadeIn from '../components/FadeIn';

const PelaksanaanView = ({status_seleksi}) => {
  const menus = [
    { title: "Presensi Harian", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", desc: "Isi daftar hadir masuk dan pulang." },
    { title: "Logbook Kegiatan", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", desc: "Catat aktivitas magang harian Anda." },
    { title: "Unggah Laporan Akhir", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12", desc: "Kumpulkan laporan PKL yang telah disahkan." },
    { title: "Sertifikat Digital", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", desc: "Unduh sertifikat kelulusan magang." }
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Selamat Banner */}
        <FadeIn>
          <div className="bg-emerald-600 text-white p-6 md:p-8 rounded-2xl shadow-lg mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="bg-emerald-800 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">LULUS SELEKSI</span>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Selamat Datang di Portal Pelaksanaan</h2>
              <p className="text-emerald-100">Gunakan menu di bawah ini untuk melaporkan absensi dan progres magang Anda setiap hari.</p>
            </div>
            <div className="hidden md:block bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl shadow-sm text-center">
              <p className="text-xs uppercase tracking-wider text-emerald-500">Divisi</p>
              <p>Pengembangan IT</p>
            </div>
          </div>
        </FadeIn>

        {/* Grid Menu Pelaksanaan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menus.map((menu, idx) => (
            <FadeIn delay={idx * 150} key={idx}>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer text-center group h-full">
                <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menu.icon}></path></svg>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{menu.title}</h3>
                <p className="text-sm text-slate-500">{menu.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PelaksanaanView;
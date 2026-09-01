import React from 'react';
import FadeIn from '../components/FadeIn';

const PelaksanaanView = () => {
  // Susunan menu disesuaikan dengan gambar referensi dan tautan yang diberikan
  const menus = [
    { 
      title: "1. Absensi", 
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", 
      desc: "Isi daftar hadir masuk dan pulang.",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSfy37MhTvDVGGCklo_QNwgvut4g2xwo4jLEPIjQAn23QTTpRw/viewform"
    },
    { 
      title: "2. G-Form Kegiatan Harian", 
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", 
      desc: "Catat aktivitas magang harian Anda di sini.",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSdLIjIjeB_gZqv9CbkIEqku6jpEZpyPNjInTecm9uk3GfK_vQ/viewform"
    },
    { 
      title: "Link Response", 
      icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1", 
      desc: "Lihat hasil rekapan response kegiatan harian.",
      link: "https://docs.google.com/spreadsheets/d/15v0VIzoLXIH0ub3HKd17vNlq-b6gOqtM4m6QiMin0oM/edit?gid=842150949#gid=842150949"
    },
    { 
      title: "3. Sheet Kegiatan Harian", 
      icon: "M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", 
      desc: "Khusus Mahasiswa TI (Pengisian manual/rekap).",
      link: "https://docs.google.com/spreadsheets/d/1h10vFhh64ecM8-_pQCAMFly3YwdvrN2hchbivnr-v4o/edit?gid=1938509773#gid=1938509773"
    },
    { 
      title: "4. Dokumentasi & Administrasi", 
      icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z", 
      desc: "Akses folder drive dokumentasi dan administrasi.",
      link: "https://drive.google.com/drive/folders/1kpU5Quxk2dmevFnaKqw9ryvzKyCz5weL"
    },
    { 
      title: "5. Laporan Akhir Magang", 
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", 
      desc: "Cek format dan pedoman laporan akhir magang.",
      link: "https://docs.google.com/document/d/1SpKCjlPpXwIlmsC3XmGBjXpeBCl01hx4/edit"
    },
    { 
      title: "6. Presentasi Laporan", 
      icon: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z", 
      desc: "Akses folder untuk bahan presentasi laporan.",
      link: "https://drive.google.com/drive/folders/1lczKeEN6xRNihyNVNnql3MSX1DTu63e4"
    }
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

        {/* Grid Menu Pelaksanaan Dinamis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menus.map((menu, idx) => (
            <FadeIn delay={idx * 100} key={idx}>
              <a 
                href={menu.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-orange-500 transition-all cursor-pointer text-center group h-full"
              >
                {/* Efek Hover warna khas BPS (Orange) agar senada dengan UI referensi */}
                <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menu.icon}></path>
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-orange-600 transition-colors">{menu.title}</h3>
                <p className="text-sm text-slate-500">{menu.desc}</p>
              </a>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PelaksanaanView;
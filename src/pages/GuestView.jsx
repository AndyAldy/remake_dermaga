// Di dalam src/pages/GuestView.jsx
import React from 'react';
import FadeIn from '../components/FadeIn';
import QuotaTable from '../components/QuotaTable';

// TAMBAHKAN PROPS onOpenAuth
const GuestView = ({ onOpenAuth }) => {
  return (
    <div>
      <header className="bg-blue-900 text-white relative py-20 md:py-32 border-b-8 border-orange-500 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="inline-block bg-white text-blue-900 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6">PORTAL RESMI</div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 uppercase tracking-wide">
              Sistem Informasi Magang <br /><span className="text-orange-400">BPS Kota Semarang</span>
            </h2>
            <p className="text-base md:text-xl text-blue-100 mb-10">Wadah pendaftaran terpadu program Magang dan PKL bagi Mahasiswa/Siswa SMK.</p>
            
            {/* UBAH FUNGSI TOMBOL INI */}
            <button onClick={() => onOpenAuth('register')} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-md shadow-lg transition-all w-full sm:w-auto">
              Daftar / Buat Akun Sekarang
            </button>
            
          </FadeIn>
        </div>
      </header>

      {/* Sisa kodenya tetap sama persis seperti sebelumnya (QuotaTable, Alur, dll) */}
      <section className="pt-16 px-4 bg-slate-50"><QuotaTable /></section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn><h3 className="text-3xl font-bold text-center text-slate-800 mb-12">Alur Pendaftaran Interaktif</h3></FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Registrasi Akun", desc: "Buat akun menggunakan email kampus/sekolah Anda." },
              { step: "02", title: "Pemberkasan", desc: "Isi form data diri dan unggah Surat Pengantar resmi." },
              { step: "03", title: "Verifikasi", desc: "Tim BPS akan memvalidasi dokumen dan ketersediaan kuota." },
              { step: "04", title: "Pelaksanaan", desc: "Akses dashboard untuk absensi dan pelaporan harian." }
            ].map((item, i) => (
              <FadeIn delay={i * 150} key={item.step}>
                <div className="group bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:bg-blue-900 hover:shadow-xl transition-all duration-300 h-full cursor-pointer">
                  <div className="text-4xl font-black text-slate-200 group-hover:text-orange-500 transition-colors mb-4">{item.step}</div>
                  <h4 className="text-xl font-bold text-slate-800 group-hover:text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-500 group-hover:text-blue-100 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GuestView;
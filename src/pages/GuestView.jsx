import React from 'react';
import FadeIn from '../components/FadeIn';
import QuotaTable from '../components/QuotaTable';
import '../styles/GuestView.css';

const GuestView = ({ onOpenAuth, quotas }) => {
  return (
    <div>
      <header className="hero-section">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="hero-badge">PORTAL RESMI</div>
            <h2 className="hero-title">Sistem Informasi Magang <br /><span className="text-orange-400">BPS Kota Semarang</span></h2>
            <p className="text-xl text-blue-100 mb-10">Wadah pendaftaran terpadu program Magang dan PKL bagi Mahasiswa/Siswa SMK.</p>
            <button onClick={() => onOpenAuth('register')} className="btn-primary w-full sm:w-auto px-8 py-3">Daftar / Buat Akun Sekarang</button>
          </FadeIn>
        </div>
      </header>

      <section className="pt-16 px-4 bg-slate-50"><QuotaTable quotas={quotas} /></section>

      <section className="alur-section">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn><h3 className="text-3xl font-bold text-center text-slate-800 mb-12">Alur Pendaftaran</h3></FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[{step:"01", title:"Registrasi"}, {step:"02", title:"Pemberkasan"}, {step:"03", title:"Verifikasi"}, {step:"04", title:"Pelaksanaan"}].map((item, i) => (
              <FadeIn delay={i * 150} key={item.step}>
                <div className="alur-card group">
                  <div className="alur-step">{item.step}</div>
                  <h4 className="text-xl font-bold text-slate-800 group-hover:text-white mb-2">{item.title}</h4>
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
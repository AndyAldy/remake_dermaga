import React from 'react';
import FadeIn from '../../components/FadeIn';

const DashboardView = ({ user, quotas, setQuotas }) => {

  // Fungsi menambah kuota
  const tambahKuota = (id) => {
    setQuotas(quotas.map(q => q.id === id ? { ...q, total: q.total + 1 } : q));
  };

  // Fungsi mengurangi kuota (tidak boleh lebih kecil dari yang sudah terisi)
  const kurangiKuota = (id) => {
    setQuotas(quotas.map(q => {
      if (q.id === id && q.total > q.terisi) {
        return { ...q, total: q.total - 1 };
      }
      return q;
    }));
  };

  return (
    <div className="p-6 md:p-10">
      <FadeIn>
        <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-lg mb-10">
          <h1 className="text-3xl font-extrabold mb-2">Welcome Back, {user.name}!</h1>
          <p className="text-blue-200 text-lg">Pantau dan kelola data beserta kuota peserta magang BPS Kota Semarang.</p>
        </div>
      </FadeIn>

      {/* Bagian Manajemen Kuota */}
      <FadeIn delay={200}>
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Manajemen Kuota Divisi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotas.map((q) => {
            const sisa = q.total - q.terisi;
            return (
              <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight mb-2">{q.divisi}</h3>
                  <div className="flex justify-between text-sm text-slate-500 mb-4">
                    <span>Terisi: <b className="text-blue-600">{q.terisi}</b></span>
                    <span>Sisa: <b className={sisa > 0 ? "text-emerald-600" : "text-red-600"}>{sisa}</b></span>
                  </div>
                </div>
                
                {/* Kontrol Kuota */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-slate-500 uppercase">Set Total Kuota:</span>
                  <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                    <button onClick={() => kurangiKuota(q.id)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-600 hover:text-red-600 rounded shadow-sm font-bold disabled:opacity-50" disabled={q.total <= q.terisi}>-</button>
                    <span className="font-bold w-6 text-center">{q.total}</span>
                    <button onClick={() => tambahKuota(q.id)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-600 hover:text-emerald-600 rounded shadow-sm font-bold">+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </FadeIn>
    </div>
  );
};

export default DashboardView;
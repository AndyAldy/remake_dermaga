import React, { useState } from 'react';
import FadeIn from '../../components/FadeIn';
import { supabase } from '../../supabase'; // Wajib import Supabase

// Ubah prop setQuotas menjadi refreshData (seperti di PendaftarView)
const DashboardView = ({ user, quotas, refreshData }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi sentral untuk mengupdate kuota ke Supabase
  const updateKuotaDatabase = async (id, newTotal) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('divisi')
        .update({ total_kuota: newTotal })
        .eq('id', id);

      if (error) throw error;
      
      // Panggil refreshData dari App.jsx agar angka di layar otomatis terupdate dari database
      if (refreshData) refreshData();
    } catch (error) {
      console.error(error);
      alert('Gagal mengupdate kuota: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const tambahKuota = (id, currentTotal) => {
    updateKuotaDatabase(id, currentTotal + 1);
  };

  const kurangiKuota = (id, currentTotal, terisi) => {
    if (currentTotal > terisi) {
      updateKuotaDatabase(id, currentTotal - 1);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <FadeIn>
        <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-lg mb-10">
          <h1 className="text-3xl font-extrabold mb-2">Welcome Back, {user?.name}!</h1>
          <p className="text-blue-200 text-lg">Pantau dan kelola data beserta kuota peserta magang BPS Kota Semarang.</p>
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Manajemen Kuota Divisi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotas?.map((q) => {
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
                
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-slate-500 uppercase">Set Total Kuota:</span>
                  <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                    <button 
                      onClick={() => kurangiKuota(q.id, q.total, q.terisi)} 
                      className="w-8 h-8 flex items-center justify-center bg-white text-slate-600 hover:text-red-600 rounded shadow-sm font-bold disabled:opacity-50" 
                      disabled={q.total <= q.terisi || isLoading}
                    >
                      -
                    </button>
                    <span className="font-bold w-6 text-center">{q.total}</span>
                    <button 
                      onClick={() => tambahKuota(q.id, q.total)} 
                      className="w-8 h-8 flex items-center justify-center bg-white text-slate-600 hover:text-emerald-600 rounded shadow-sm font-bold disabled:opacity-50"
                      disabled={isLoading}
                    >
                      +
                    </button>
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
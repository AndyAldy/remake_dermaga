import React, { useState } from 'react';
import FadeIn from '../../components/FadeIn';
import { supabase } from '../../supabase';

const DashboardView = ({ user, quotas, refreshData }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk form tambah divisi baru
  const [newDivisi, setNewDivisi] = useState('');
  const [newKuota, setNewKuota] = useState(1);

  const updateKuotaDatabase = async (id, newTotal) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('divisi')
        .update({ total_kuota: newTotal })
        .eq('id', id);

      if (error) throw error;
      if (refreshData) refreshData();
    } catch (error) {
      alert('Gagal mengupdate kuota: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const tambahKuota = (id, currentTotal) => updateKuotaDatabase(id, currentTotal + 1);
  
  const kurangiKuota = (id, currentTotal, terisi) => {
    if (currentTotal > terisi) updateKuotaDatabase(id, currentTotal - 1);
  };

  // Fungsi menambah divisi baru ke Supabase
  const handleAddDivisi = async (e) => {
    e.preventDefault();
    if (!newDivisi.trim()) return alert('Nama divisi tidak boleh kosong!');
    if (newKuota < 1) return alert('Kuota minimal 1!');

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('divisi')
        .insert([
          { 
            nama_divisi: newDivisi, 
            total_kuota: parseInt(newKuota),
            terisi: 0 // Default terisi selalu 0 saat divisi baru dibuat
          }
        ]);

      if (error) throw error;

      alert('Divisi baru berhasil ditambahkan!');
      setNewDivisi('');
      setNewKuota(1);
      if (refreshData) refreshData(); // Render ulang layar
    } catch (error) {
      alert('Gagal menambah divisi: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <FadeIn>
        <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-lg mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold mb-2">Welcome Back, {user?.name}!</h1>
            <p className="text-blue-200 text-lg">Pantau dan kelola data beserta kuota peserta magang BPS Kota Semarang.</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-10">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Buat Divisi Baru</h2>
          <form onSubmit={handleAddDivisi} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-slate-600 mb-1">Nama Divisi</label>
              <input 
                type="text" 
                value={newDivisi} 
                onChange={(e) => setNewDivisi(e.target.value)} 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Contoh: Statistik Distribusi"
                required 
              />
            </div>
            <div className="w-full md:w-32">
              <label className="block text-sm font-bold text-slate-600 mb-1">Total Kuota</label>
              <input 
                type="number" 
                min="1" 
                value={newKuota} 
                onChange={(e) => setNewKuota(e.target.value)} 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full md:w-auto px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Menyimpan...' : 'Tambah Divisi'}
            </button>
          </form>
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
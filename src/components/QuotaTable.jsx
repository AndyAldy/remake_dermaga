import React from 'react';
import FadeIn from './FadeIn';

const QuotaTable = ({ quotas }) => {
  return (
    <FadeIn>
      <div className="max-w-4xl mx-auto my-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header Tabel */}
        <div className="bg-blue-900 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="font-bold text-base md:text-lg tracking-wide">📊 Informasi Kuota Magang</h3>
          <span className="text-xs bg-blue-800 text-blue-200 px-3 py-1 rounded-full font-medium">
            Update Real-time
          </span>
        </div>

        {/* Konten Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b border-slate-200">
                <th className="py-4 px-6 font-semibold">Divisi Penempatan</th>
                <th className="py-4 px-4 font-semibold text-center">Total Kuota</th>
                <th className="py-4 px-4 font-semibold text-center">KuotaTerisi</th>
                <th className="py-4 px-6 font-semibold text-center">Sisa Slot tersedia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!quotas || quotas.length === 0) ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400 italic">
                    Memuat data kuota divisi...
                  </td>
                </tr>
              ) : (
                quotas.map((row) => {
                  const sisa = row.total - row.terisi;
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-bold text-slate-800">
                        {row.divisi}
                      </td>
                      <td className="py-4 px-4 text-center font-semibold text-slate-700">
                        {row.total}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-blue-600">
                        {row.terisi}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${
                          sisa > 0 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                            : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                          {sisa > 0 ? `${sisa} Slot Tersedia` : 'Penuh'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </FadeIn>
  );
};

export default QuotaTable;
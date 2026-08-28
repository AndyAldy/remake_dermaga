import React from 'react';
import FadeIn from './FadeIn';

// Sekarang QuotaTable menerima 'quotas' dari atas (App.jsx)
const QuotaTable = ({ quotas }) => {
  return (
    <FadeIn>
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mt-8 mb-16 max-w-4xl mx-auto">
        <div className="bg-blue-900 text-white px-6 py-4">
          <h3 className="font-bold text-lg">Informasi Kuota Magang Periode Ganjil</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="px-6 py-3 font-semibold">Divisi Penempatan</th>
                <th className="px-6 py-3 font-semibold text-center">Total Kuota</th>
                <th className="px-6 py-3 font-semibold text-center">Terisi</th>
                <th className="px-6 py-3 font-semibold text-center">Sisa Slot</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {quotas.map((row) => {
                const sisa = row.total - row.terisi; // Hitung sisa otomatis
                return (
                  <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{row.divisi}</td>
                    <td className="px-6 py-4 text-center text-slate-600 font-bold">{row.total}</td>
                    <td className="px-6 py-4 text-center text-blue-600 font-bold">{row.terisi}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold text-xs ${sisa > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {sisa > 0 ? `${sisa} Slot` : 'Penuh'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </FadeIn>
  );
};

export default QuotaTable;
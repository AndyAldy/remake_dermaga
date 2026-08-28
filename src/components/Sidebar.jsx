// src/components/Sidebar.jsx
import React from 'react';

const Sidebar = ({ tahun, setTahun, kecamatan, setKecamatan }) => {
  const kecamatanList = ["Semua Kecamatan", "Banyumanik", "Pedurungan", "Semarang Tengah", "Tembalang"];

  return (
    <aside className="w-full md:w-1/3 flex flex-col gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Parameter Filter</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 mb-2">Tahun Anggaran</label>
          <select 
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 mb-2">Kecamatan</label>
          <select 
            value={kecamatan}
            onChange={(e) => setKecamatan(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
          >
            {kecamatanList.map(kec => (
               <option key={kec} value={kec}>{kec}</option>
            ))}
          </select>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-600 mb-2">Metode Clustering:</p>
          <p className="font-semibold text-slate-800">K-Means (k=3)</p>
          <p className="text-sm text-slate-600 mt-3 mb-2">Evaluasi Model:</p>
          <p className="font-semibold text-slate-800">Elbow Method</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
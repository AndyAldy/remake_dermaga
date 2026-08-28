// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import Sidebar from '../components/Sidebar';
import { themeColors } from '../theme/colors';

const Dashboard = () => {
  // State untuk kontrol dari Sidebar
  const [tahun, setTahun] = useState('2026');
  const [kecamatan, setKecamatan] = useState('Semua Kecamatan');

  // Simulasi data hasil K-Means Python
  const demografiData = {
    total_penduduk_terdata: 4500,
    bawah: 42.5,
    menengah: 45.0,
    atas: 12.5
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Panggil komponen Sidebar dan kirim state sebagai props */}
      <Sidebar 
        tahun={tahun} 
        setTahun={setTahun} 
        kecamatan={kecamatan} 
        setKecamatan={setKecamatan} 
      />

      <section className="w-full md:w-2/3 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Distribusi Kelas Ekonomi</h2>
            <p className="text-sm text-slate-500">Area: {kecamatan} | Tahun: {tahun}</p>
          </div>
          <div className="bg-red-50 text-red-800 px-4 py-1.5 rounded-full text-sm font-semibold border border-red-200">
            Total Sampel: {demografiData.total_penduduk_terdata} Data
          </div>
        </div>
        
        {/* Row Kartu Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard 
            title="Kelas Atas" 
            percentage={demografiData.atas} 
            themeStyle={themeColors.kelasAtas} 
            description="Cluster 3: Transaksi Tinggi" 
          />
          <StatCard 
            title="Kelas Menengah" 
            percentage={demografiData.menengah} 
            themeStyle={themeColors.kelasMenengah} 
            description="Cluster 2: Transaksi Sedang" 
          />
          <StatCard 
            title="Kelas Bawah" 
            percentage={demografiData.bawah} 
            themeStyle={themeColors.kelasBawah} 
            description="Cluster 1: Transaksi Rendah" 
          />
        </div>
        
        {/* Visualisasi Bar Horizontal */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mt-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Visualisasi Komposisi (%)</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700">Kelas Menengah</span>
                <span className="font-bold text-blue-600">{demografiData.menengah}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4">
                <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${demografiData.menengah}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700">Kelas Bawah</span>
                <span className="font-bold text-amber-500">{demografiData.bawah}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4">
                <div className="bg-amber-400 h-4 rounded-full" style={{ width: `${demografiData.bawah}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700">Kelas Atas</span>
                <span className="font-bold text-emerald-700">{demografiData.atas}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4">
                <div className="bg-emerald-600 h-4 rounded-full" style={{ width: `${demografiData.atas}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
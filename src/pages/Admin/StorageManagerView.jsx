import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import FadeIn from '../../components/FadeIn';

const StorageManagerView = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Batas Storage Supabase Free Tier (1 GB dalam Bytes)
  const MAX_STORAGE_BYTES = 1073741824; 

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('berkas_pendaftar')
        .list('', {
          limit: 1000,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;
      
      const validFiles = data.filter(file => file.name !== '.emptyFolderPlaceholder');
      setFiles(validFiles);
    } catch (error) {
      console.error('Gagal memuat storage:', error);
      alert('Gagal memuat data file dari Storage.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // --- KALKULASI PENGGUNAAN STORAGE ---
  const totalUsedBytes = files.reduce((acc, file) => acc + (file.metadata?.size || 0), 0);
  const usedPercentage = Math.min((totalUsedBytes / MAX_STORAGE_BYTES) * 100, 100).toFixed(2);
  
  // Tentukan warna progress bar berdasarkan kapasitas
  const progressColor = usedPercentage > 85 ? 'bg-red-500' : usedPercentage > 60 ? 'bg-amber-500' : 'bg-blue-500';

  const handleDeleteFile = async (fileName) => {
    if (!window.confirm(`Yakin ingin menghapus file "${fileName}"? File ini tidak bisa dikembalikan.`)) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase.storage
        .from('berkas_pendaftar')
        .remove([fileName]);

      if (error) throw error;
      
      fetchFiles(); 
    } catch (error) {
      alert(`Gagal menghapus file: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (files.length === 0) return alert("Storage sudah kosong.");
    
    const confirm1 = window.confirm("PERINGATAN KRITIS: Anda yakin ingin menghapus SEMUA BERKAS di Storage?");
    if (!confirm1) return;
    
    const confirm2 = window.confirm("Apakah Anda benar-benar yakin? Tindakan ini akan merusak link download berkas peserta yang masih ada di database.");
    if (!confirm2) return;

    setIsDeleting(true);
    try {
      const fileNames = files.map(f => f.name);
      
      const { error } = await supabase.storage
        .from('berkas_pendaftar')
        .remove(fileNames);

      if (error) throw error;
      
      alert('BERHASIL: Semua berkas telah dibersihkan dari Storage!');
      fetchFiles();
    } catch (error) {
      alert(`Gagal menghapus semua file: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 md:p-10">
      <FadeIn>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Storage</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola file berkas pendaftar agar storage tidak penuh.</p>
          </div>
          
          <button 
            onClick={handleDeleteAll}
            disabled={isDeleting || files.length === 0}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow disabled:opacity-50 transition"
          >
            {isDeleting ? 'Memproses...' : '🗑️ Hapus Semua Berkas'}
          </button>
        </div>

        {/* --- BAGIAN INDIKATOR STORAGE --- */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
          <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
            <span>Kapasitas Bucket Terpakai (Limit Free: 1 GB)</span>
            <span className={usedPercentage > 85 ? 'text-red-600' : ''}>{usedPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
            <div
              className={`h-4 transition-all duration-500 ease-in-out ${progressColor}`}
              style={{ width: `${usedPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
            <span>Terpakai: {formatBytes(totalUsedBytes)}</span>
            <span>Sisa: {formatBytes(MAX_STORAGE_BYTES - totalUsedBytes)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-10 text-center text-slate-500 font-bold">Memuat data dari Storage...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-600 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Nama File</th>
                    <th className="px-6 py-4 font-semibold">Ukuran</th>
                    <th className="px-6 py-4 font-semibold">Tgl Diupload</th>
                    <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {files.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500 italic">Storage dalam keadaan kosong.</td></tr>
                  ) : (
                    files.map((file) => (
                      <tr key={file.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-700" title={file.name}>
                          {file.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{formatBytes(file.metadata.size)}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {new Date(file.created_at).toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => handleDeleteFile(file.name)}
                            disabled={isDeleting}
                            className="text-red-500 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition disabled:opacity-50"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

export default StorageManagerView;
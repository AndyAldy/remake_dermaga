import React from 'react';

const Alur = () => {
  return (
    <section id="alur" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-blue-900 mb-4">Alur Pendaftaran Magang</h3>
          <p className="text-slate-600">Langkah mudah untuk bergabung menjadi bagian dari kami.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-900 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-sm border-2 border-white ring-4 ring-blue-50">1</div>
            <h4 className="font-bold text-lg mb-2">Registrasi Akun</h4>
            <p className="text-sm text-slate-500">Buat akun menggunakan email aktif untuk mengakses dasbor.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-900 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-sm border-2 border-white ring-4 ring-blue-50">2</div>
            <h4 className="font-bold text-lg mb-2">Lengkapi Berkas</h4>
            <p className="text-sm text-slate-500">Unggah Surat Pengantar Kampus/Sekolah, CV, dan transkrip nilai.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-900 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-sm border-2 border-white ring-4 ring-blue-50">3</div>
            <h4 className="font-bold text-lg mb-2">Verifikasi & Seleksi</h4>
            <p className="text-sm text-slate-500">Tim kami akan meninjau kesesuaian berkas dan kuota divisi.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-sm border-2 border-white ring-4 ring-orange-50">4</div>
            <h4 className="font-bold text-lg mb-2">Pengumuman</h4>
            <p className="text-sm text-slate-500">Cek status kelulusan langsung melalui dasbor peserta.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Alur;
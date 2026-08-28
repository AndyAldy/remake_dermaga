import React from 'react';

const Tentang = () => {
  return (
    <section id="tentang" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h3 className="text-3xl font-bold text-slate-800 mb-6">Tentang Program Magang</h3>
        <div className="w-20 h-1 bg-orange-500 mx-auto mb-8"></div>
        <p className="text-lg text-slate-600 leading-relaxed">
          Program Magang/PKL BPS Kota Semarang dirancang untuk memberikan ruang bagi talenta-talenta muda, khususnya di bidang <strong>Statistika, Administrasi, dan Teknik Informatika</strong>, untuk merasakan pengalaman kerja nyata (<i>real-world experience</i>). Peserta akan dilibatkan langsung dalam pengolahan data, pengembangan sistem, dan tata kelola administrasi pemerintahan.
        </p>
      </div>
    </section>
  );
};

export default Tentang;
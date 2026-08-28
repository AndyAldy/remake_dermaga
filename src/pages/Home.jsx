import React from 'react';
import Navbar from '../components/navbar';
import Hero from '../components/Hero';
import Alur from '../components/Alur';
import Posisi from '../components/Posisi';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />
      <main>
        <Hero />
        <Alur />
        <Posisi />
      </main>
    </div>
  );
};

export default Home;
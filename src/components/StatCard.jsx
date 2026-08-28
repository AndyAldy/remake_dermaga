// src/components/StatCard.jsx
import React from 'react';

const StatCard = ({ title, percentage, themeStyle, description }) => {
  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border border-slate-100 border-t-4 ${themeStyle}`}>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${themeStyle.split(' ')[0]}`}>{percentage}%</p>
      <p className="text-xs text-slate-400 mt-2">{description}</p>
    </div>
  );
};

export default StatCard;
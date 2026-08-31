import React from 'react';
import FadeIn from './FadeIn';
import '../styles/QuotaTable.css';

const QuotaTable = ({ quotas }) => {
  return (
    <FadeIn>
      <div className="quota-wrapper">
        <div className="quota-header">Informasi Kuota Magang Periode Ganjil</div>
        <div className="overflow-x-auto">
          <table className="quota-table">
            <thead>
              <tr>
                <th className="quota-th">Divisi Penempatan</th>
                <th className="quota-th text-center">Total</th>
                <th className="quota-th text-center">Terisi</th>
                <th className="quota-th text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {quotas.map((row) => {
                const sisa = row.total - row.terisi;
                return (
                  <tr key={row.id} className="quota-tr">
                    <td className="quota-td font-medium">{row.divisi}</td>
                    <td className="quota-td text-center font-bold">{row.total}</td>
                    <td className="quota-td text-center text-blue-600 font-bold">{row.terisi}</td>
                    <td className="quota-td text-center">
                      <span className={sisa > 0 ? 'badge-avail' : 'badge-full'}>
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
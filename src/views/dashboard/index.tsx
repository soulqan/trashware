import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import StatCard from '@/components/dashboard/StatCard';
import BinCard from '@/components/dashboard/BinCard';
import { FiTrash2, FiCheckCircle, FiAlertTriangle, FiXCircle, FiWifiOff } from 'react-icons/fi';

export default function DashboardView() {
  const [bins, setBins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "bins"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const binsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBins(binsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const stats = {
    total: bins.length,
    empty: bins.filter(b => b.status === 'on' && b.capacity == 0).length,
    nearlyFull: bins.filter(b => b.status === 'on' && b.capacity >= 70 && b.capacity < 90).length,
    full: bins.filter(b => b.status === 'on' && b.capacity >= 90).length,
    offline: bins.filter(b => b.status === 'off').length,
  };

  if (loading) return <div className="p-10 text-center text-emerald-500 font-bold">Menghubungkan ke Sistem...</div>;

  return (
    <div className="p-6 space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Total Bin" value={stats.total} textColor="text-gray-800" icon={<FiTrash2 className="text-gray-400" />} />
        <StatCard title="Kosong" value={stats.empty} textColor="text-emerald-500" icon={<FiCheckCircle className="text-emerald-500" />} />
        <StatCard title="Hampir Penuh" value={stats.nearlyFull} textColor="text-orange-400" icon={<FiAlertTriangle className="text-orange-400" />} />
        <StatCard title="Penuh" value={stats.full} textColor="text-red-500" icon={<FiXCircle className="text-red-500" />} />
        <StatCard title="Offline" value={stats.offline} textColor="text-gray-400" icon={<FiWifiOff className="text-gray-400" />} />
      </div>

      {/* 2. Banner Alert */}
      {(stats.full > 0 || stats.nearlyFull > 0) && (
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-red-700 font-bold">
            <FiAlertTriangle size={18} />
            <span>Perhatian! {stats.full} tempat sampah penuh, {stats.nearlyFull} hampir penuh</span>
          </div>
          <p className="text-red-600 text-sm mt-1">Segera kosongkan tempat sampah yang penuh untuk menjaga kebersihan kampus</p>
        </div>
      )}

      {/* 3. Monitoring Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-black text-gray-800">Monitoring Real-time</h2>
          <p className="text-sm text-gray-400">Tempat sampah yang memerlukan perhatian</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bins.map((bin) => (
            <BinCard
              key={bin.id}
              id={bin.id}
              location={bin.location}
              building={bin.building || bin.location.split(' - ')[0]}
              capacity={bin.capacity}
              status={bin.status}
            />
          ))}
        </div>
      </div>
      {/* Table Section - Otomatis menampilkan data dari DB
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between">
          <p className="font-bold text-gray-700">Real-time Bin Status</p>
          <span className="text-xs text-green-500">Live data</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
            <tr>
              <th className="p-4 font-semibold">Bin ID</th>
              <th className="p-4 font-semibold">Location</th>
              <th className="p-4 font-semibold">Capacity</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {bins.map((bin) => (
              <tr key={bin.id} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-700">{bin.id}</td>
                <td className="p-4 text-gray-500">{bin.location || 'Unknown'}</td>
                <td className="p-4">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${bin.capacity >= 90 ? 'bg-red-500' : bin.capacity >= 70 ? 'bg-orange-500' : bin.capacity > 0 ? 'bg-green-500' : 'bg-gray-300'}`}
                      style={{ width: `${bin.capacity}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-gray-400">{bin.capacity}%</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${bin.capacity >= 90 ? 'bg-red-100 text-red-600' : bin.capacity >= 70 ? 'bg-orange-100 text-orange-600' : bin.capacity > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-500 text-white'}`}>
                    ● {bin.capacity >= 90 ? 'Penuh' : bin.capacity >= 70 ? 'Hampir Penuh' : bin.capacity > 0 ? 'Terisi' : 'Kosong'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
}
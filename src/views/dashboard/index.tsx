import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase'; // Pastikan path config firebase benar
import { collection, onSnapshot, query } from 'firebase/firestore';
import StatCard from '@/components/dashboard/StatCard';
import { FiTrash2, FiCheckCircle, FiAlertTriangle, FiXCircle, FiWifiOff } from 'react-icons/fi';

export default function DashboardView() {
  const [bins, setBins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prevCounts, setPrevCounts] = useState<any>({});

  useEffect(() => {
    const q = query(collection(db, "bins"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const binsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPrevCounts((prev: any) => ({
        total: bins.length,
        empty: bins.filter(b => b.capacity < 20).length,
        nearlyFull: bins.filter(b => b.capacity >= 70 && b.capacity < 90).length,
        full: bins.filter(b => b.capacity >= 90).length,
      }));

      setBins(binsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }); 

  const stats = {
    total: bins.length,
    empty: bins.filter(bin => bin.capacity < 20).length,
    nearlyFull: bins.filter(bin => bin.capacity >= 70 && bin.capacity < 90).length,
    full: bins.filter(bin => bin.capacity >= 90).length,
    offline: bins.filter(bin => bin.isOffline).length, 
  };

  const getTrend = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 0) return `+${diff}`;
    if (diff < 0) return `${diff}`;
    return "0";
  };

  if (loading) return <div className="p-8 text-center">Loading Dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Real-time monitoring from Firestore</p>
        </div>
        <div className="flex items-center gap-2 text-green-500 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          System Online
        </div>
      </div>

      {/* Stats Grid - Otomatis terupdate dari DB */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Total Active" value={stats.total} trend={getTrend(stats.total, prevCounts.total)} iconBg="bg-green-100" textColor="text-green-600" icon={<FiTrash2 size={20}/>} />
        <StatCard title="Empty Bins" value={stats.empty} trend={getTrend(stats.empty, prevCounts.empty)} iconBg="bg-emerald-100" textColor="text-emerald-600" icon={<FiCheckCircle size={20}/>} />
        <StatCard title="Nearly Full" value={stats.nearlyFull} trend={getTrend(stats.nearlyFull, prevCounts.nearlyFull)} iconBg="bg-orange-100" textColor="text-orange-600" icon={<FiAlertTriangle size={20}/>} />
        <StatCard title="Full Bins" value={stats.full} trend={getTrend(stats.full, prevCounts.full)} iconBg="bg-red-100" textColor="text-red-600" icon={<FiXCircle size={20}/>} />
        <StatCard title="Offline" value={stats.offline} trend="0" iconBg="bg-gray-100" textColor="text-gray-600" icon={<FiWifiOff size={20}/>} />
      </div>

      {/* Main Content: Chart & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-64 flex flex-col justify-center items-center">
          <p className="font-bold text-gray-700 self-start mb-auto">Daily Fill Trend</p>
          <p className="text-gray-400 text-sm">Grafik akan muncul di sini setelah integrasi Recharts</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between mb-4">
            <p className="font-bold text-gray-700">Recent Alerts</p>
            <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-md font-bold">
              {stats.full} ACTIVE
            </span>
          </div>
          {/* Menampilkan alert jika ada bin yang Full (>= 90%) */}
          {bins.filter(b => b.capacity >= 90).map(bin => (
            <div key={bin.id} className="bg-red-50 p-3 rounded-xl border border-red-100 border-l-4 border-l-red-500 mb-2">
              <p className="text-xs font-bold text-red-700">Bin Full - {bin.id}</p>
              <p className="text-[10px] text-red-600 mt-1">{bin.location} reaches {bin.capacity}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section - Otomatis menampilkan data dari DB */}
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
                      className={`h-1.5 rounded-full transition-all duration-500 ${bin.capacity > 90 ? 'bg-red-500' : bin.capacity > 70 ? 'bg-orange-500' : 'bg-green-500'}`} 
                      style={{ width: `${bin.capacity}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-gray-400">{bin.capacity}%</span>
                </td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${bin.capacity >= 90 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        ● {bin.capacity >= 90 ? 'Full' : bin.capacity >= 70 ? 'Nearly Full' : 'Empty'}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
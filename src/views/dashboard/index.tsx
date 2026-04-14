import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useSearch } from '@/context/SearchContext';
import StatCard from '@/components/dashboard/StatCard';
import BinCard from '@/components/dashboard/BinCard';
import { FiTrash2, FiCheckCircle, FiAlertTriangle, FiXCircle, FiWifiOff } from 'react-icons/fi';

interface Bin {
  id: string;
  location: string;
  building?: string;
  capacity: number;
  status?: string;
  isOffline?: boolean;
}

export default function DashboardView() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useSearch();

  useEffect(() => {
    const q = query(collection(db, "bins"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const binsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Bin[];

      setBins(binsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

const filteredBins = bins.filter((bin) => {
  const isFull = bin.status === 'on' && bin.capacity >= 90;
  const isProblematic = isFull || bin.status === 'off';

  const searchTarget = `${bin.location} ${bin.id}`.toLowerCase();
  const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());

  return isProblematic && matchesSearch;
});

  const stats = {
    total: bins.length,
    empty: bins.filter(b => b.status === 'on' && b.capacity < 20).length,
    nearlyFull: bins.filter(b => b.status === 'on' && b.capacity >= 70 && b.capacity < 90).length,
    full: bins.filter(b => b.status === 'on' && b.capacity >= 90).length,
    offline: bins.filter(b => b.status === 'off').length,
  };

  if (loading) return <div className="p-20 text-center text-emerald-500 font-bold animate-pulse">Syncing Dashboard...</div>;

  return (
    <div className="p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      {/* 1. StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Total Bin" value={stats.total} textColor="text-gray-800" icon={<FiTrash2/>} />
        <StatCard title="Kosong" value={stats.empty} textColor="text-emerald-500" icon={<FiCheckCircle/>} />
        <StatCard title="Hampir Penuh" value={stats.nearlyFull} textColor="text-orange-400" icon={<FiAlertTriangle/>} />
        <StatCard title="Penuh" value={stats.full} textColor="text-red-500" icon={<FiXCircle/>} />
        <StatCard title="Offline" value={stats.offline} textColor="text-gray-400" icon={<FiWifiOff/>} />
      </div>

      {/* 2. Banner Perhatian */}
      {(stats.full > 0 || stats.nearlyFull > 0) && (
        <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex flex-col gap-1 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
            <FiAlertTriangle />
            <span>Perhatian! {stats.full} tempat sampah penuh, {stats.nearlyFull} hampir penuh</span>
          </div>
          <p className="text-red-600 text-xs italic">Segera bersihkan untuk menjaga kebersihan kampus.</p>
        </div>
      )}

      {/* 3. Monitoring Real-time */}
      <div className="space-y-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-gray-800">Monitoring Real-time</h2>
          <p className="text-xs text-gray-400">
            {searchQuery ? `Hasil pencarian untuk "${searchQuery}"` : "Tempat sampah yang memerlukan perhatian"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBins.length > 0 ? (
            filteredBins.map((bin) => (
              <BinCard
                key={bin.id}
                id={bin.id}
                location={bin.location}
                capacity={bin.capacity}
                status={bin.status}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400 italic text-sm">
              Data tidak ditemukan...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
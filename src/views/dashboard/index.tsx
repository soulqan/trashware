import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer'; 
import PageHeader from '@/components/layout/PageHeader'; 
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import StatCard from '@/components/dashboard/StatCard';
import { FiTrash2, FiCheckCircle, FiAlertTriangle, FiXCircle, FiWifiOff } from 'react-icons/fi';
import { getPickupPriorityRanking } from '@/lib/services/historyAnalyticsService';
import { subscribeHistoryRecords } from '@/lib/services/historyService';
import type { HistoryRecord } from '@/lib/services/historyService';

export default function DashboardView() {
  const [bins, setBins] = useState<Array<{ id: string; gedung?: string; lantai?: string | number; ruang?: string; level?: number; status?: string; capacity?: number; location?: string }>>([])
  const [loading, setLoading] = useState(true);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    const q = query(collection(db, "bins"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const binsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBins(binsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsub = subscribeHistoryRecords((data) => setHistoryRecords(data), (err) => console.error(err));
    return () => unsub();
  }, []);

  const stats = {
    total: bins.length,
    // Update pengecekan menggunakan b.level
    empty: bins.filter(b => b.status === 'on' && (b.level ?? 0) < 20).length,
    nearlyFull: bins.filter(b => b.status === 'on' && (b.level ?? 0) >= 70 && (b.level ?? 0) < 90).length,
    full: bins.filter(b => b.status === 'on' && (b.level ?? 0) >= 90).length,
    offline: bins.filter(b => b.status === 'off').length,
  };

  if (loading) return (
    <PageContainer>
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-emerald-500 font-bold animate-pulse text-2xl">Syncing Dashboard...</div>
      </div>
    </PageContainer>
  );

  return (
    <PageContainer>
      <PageHeader 
        title="Dashboard" 
        subtitle="Pantau ringkasan status tempat sampah secara real-time." 
      />

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
      {/* <div className="space-y-4">
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
                gedung={bin.gedung || ''}
                lantai={String(bin.lantai || '')}
                ruang={bin.ruang || ''}
                level={bin.level || 0}
                status={bin.status === 'on' ? 'on' : 'off'}
                capacity={bin.capacity || 0}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400 italic text-sm border border-dashed border-gray-200 rounded-3xl">
              Data tidak ditemukan...
            </div>
          )}
        </div>
      </div> */}

      {/* 4. Prioritas Pengambilan - Leaderboard */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-gray-800">Prioritas Pengambilan</h2>
          <p className="text-xs text-gray-400">Berdasarkan lamanya sampah penuh dan belum diambil</p>
        </div>

        <div className="space-y-3">
          {(() => {
            const ranking = getPickupPriorityRanking(bins, historyRecords).slice(0, 10);

            if (!ranking || ranking.length === 0) return (
              <div className="py-6 text-center text-gray-400 italic text-sm">Tidak ada prioritas saat ini</div>
            );

            return ranking.map((r, idx) => (
              <div key={r.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-300 transition-all flex items-center gap-4">
                {/* Rank Badge */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-white text-lg flex-shrink-0 ${
                  idx === 0 ? 'bg-red-600' :
                  idx === 1 ? 'bg-orange-500' :
                  idx === 2 ? 'bg-amber-500' :
                  'bg-gray-400'
                }`}>
                  #{idx + 1}
                </div>

                {/* Location & Details */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-800 text-sm">{r.location}</div>
                  <div className="text-xs text-gray-500 mt-1">ID: {r.binId}</div>
                  
                  {/* Capacity Bar */}
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500">Level Isi</span>
                      <span className="text-xs font-bold text-red-500">{r.capacity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min(r.capacity, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Reason
                  {r.reason && (
                    <div className="text-xs text-gray-600 mt-2 italic">
                      {r.reason}
                    </div>
                  )} */}

                  {/* Full Age */}
                  {r.fullAgeMinutes !== null && (
                    <div className="text-xs text-orange-600 font-semibold mt-1">
                      Penuh selama: {r.fullAgeMinutes} menit
                    </div>
                  )}
                </div>

                {/* Priority Label */}
                <div className="flex-shrink-0">
                  <div className={`text-xs font-bold px-3 py-2 rounded-lg text-center ${
                    r.priorityLabel === 'High' ? 'bg-red-100 text-red-600' :
                    r.priorityLabel === 'Medium' ? 'bg-orange-100 text-orange-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {r.priorityLabel}
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </PageContainer>
  );
}
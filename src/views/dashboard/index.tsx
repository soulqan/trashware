'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer'; 
import PageHeader from '@/components/layout/PageHeader'; 
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import StatCard from '@/components/dashboard/StatCard';
import { FiTrash2, FiCheckCircle, FiAlertTriangle, FiXCircle, FiWifiOff } from 'react-icons/fi';
import { formatDurationInHours, getPickupPriorityRanking } from '@/lib/services/historyAnalyticsService';
import { subscribeHistoryRecords } from '@/lib/services/historyService';
import type { HistoryRecord } from '@/lib/services/historyService';
import type { Bin } from '@/types/database'; // ✅ Menggunakan tipe data Bin murni dari database

export default function DashboardView() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    const q = query(collection(db, "bins"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // 🟢 SEKARANG: Langsung ambil data mentah dari Firestore tanpa filter waktu binService
      const binsData = snapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() } as Bin;
      });
      
      setBins(binsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsub = subscribeHistoryRecords((data) => setHistoryRecords(data), (err) => console.error(err));
    return () => unsub();
  }, []);

  // LOGIKA HITUNG STATISTIK - Sekarang membaca string "on"/"off" asli kiriman hardware
  const stats = {
    total: bins.length,
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
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-5">
        <StatCard title="Total Bin" value={stats.total} textColor="text-gray-800" icon={<FiTrash2/>} />
        <StatCard title="Kosong" value={stats.empty} textColor="text-emerald-500" icon={<FiCheckCircle/>} />
        <StatCard title="Hampir Penuh" value={stats.nearlyFull} textColor="text-orange-400" icon={<FiAlertTriangle/>} />
        <StatCard title="Penuh" value={stats.full} textColor="text-red-500" icon={<FiXCircle/>} />
        <StatCard title="Offline" value={stats.offline} textColor="text-gray-400" icon={<FiWifiOff/>} />
      </div>

      {/* 2. Banner Perhatian */}
      {(stats.full > 0 || stats.nearlyFull > 0) && (
        <div className="bg-red-50 border border-red-100 p-3 rounded-2xl flex flex-col gap-0.5 animate-in fade-in slide-in-from-top-4 duration-500 sm:p-5 sm:gap-1">
          <div className="flex items-center gap-2 text-red-700 font-bold text-xs sm:text-sm">
            <FiAlertTriangle />
            <span>Perhatian! {stats.full} tempat sampah penuh, {stats.nearlyFull} hampir penuh</span>
          </div>
          <p className="text-red-600 text-[11px] italic sm:text-xs">Segera bersihkan untuk menjaga kebersihan kampus.</p>
        </div>
      )}

      {/* 3. Prioritas Pengambilan - Leaderboard */}
      <div className="mt-4 sm:mt-8">
        <div className="mb-2 flex flex-col gap-0.5 sm:mb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-1">
          <h2 className="text-base font-black text-gray-800 sm:text-lg">Prioritas Pengambilan</h2>
          <p className="text-xs text-gray-400">Berdasarkan lamanya sampah penuh dan belum diambil</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-1">
          {(() => {
            const ranking = getPickupPriorityRanking(bins, historyRecords).slice(0, 10);

            if (!ranking || ranking.length === 0) return (
              <div className="col-span-2 py-6 text-center text-gray-400 italic text-sm lg:col-span-1">Tidak ada prioritas saat ini</div>
            );

            return ranking.map((r, idx) => (
              <div key={r.id} className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-2.5 shadow-sm transition-all hover:border-red-300 hover:shadow-md sm:flex-row sm:items-center sm:gap-4 sm:p-4">
                {/* Rank Badge */}
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-white text-sm flex-shrink-0 sm:h-12 sm:w-12 sm:text-lg ${
                  idx === 0 ? 'bg-red-600' :
                  idx === 1 ? 'bg-orange-500' :
                  idx === 2 ? 'bg-amber-500' :
                  'bg-gray-400'
                }`}>
                  #{idx + 1}
                </div>

                {/* Location & Details */}
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-800 text-sm">{r.location}</div>
                  <div className="text-xs text-gray-500 mt-1">ID: {r.binId}</div>
                  
                  {/* Capacity Bar */}
                  <div className="mt-1.5 sm:mt-2">
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

                  {/* Full Age */}
                  {r.fullAgeMinutes != null && (
                    <div className="text-xs text-orange-600 font-semibold mt-1">
                      Penuh selama: {formatDurationInHours(r.fullAgeMinutes)}
                    </div>
                  )}
                </div>

                {/* Priority Label */}
                <div className="flex-shrink-0 self-start sm:self-auto">
                  <div className={`text-xs font-bold px-3 py-1.5 rounded-lg text-center sm:py-2 ${
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
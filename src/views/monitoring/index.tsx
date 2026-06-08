'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer'; 
import PageHeader from '@/components/layout/PageHeader'; 
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useSearch } from '@/context/SearchContext';
import BinCard from '@/components/dashboard/BinCard';
import { FiFilter, FiInfo } from 'react-icons/fi';
import type { Bin } from '@/types/database';
import { binService } from '@/lib/services/binService'; // ✅ 1. IMPORT SERVICE SINKRONISASI DI SINI

export default function MonitoringView() {
  // Intersection Type agar menampung properti firestoreId secara legal
  const [bins, setBins] = useState<(Bin & { firestoreId: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useSearch(); 
  
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  useEffect(() => {
    const q = query(collection(db, "bins"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const binsData = snapshot.docs.map(doc => {
        const rawBin = { firestoreId: doc.id, ...doc.data() } as Bin & { firestoreId: string };
        
        // ✅ 2. KOREKSI STATUS DI SINI (Jika > 8 detik tak kirim data, status otomatis dibalik jadi 'off')
        const processedBin = binService.enforceHeartbeat(rawBin);
        
        return {
          ...processedBin,
          firestoreId: doc.id // Pastikan ID dokumen Firestore tetap menempel
        };
      });
      
      setBins(binsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // LOGIKA FILTER GABUNGAN (Search + Dropdown) - 100% TETAP ASLI TANPA PERUBAHAN
  const filteredBins = bins.filter((bin) => {
    // 1. Filter Search (Menggunakan variabel baru: gedung, lantai, ruang)
    const searchTarget = `${bin.gedung || ''} ${bin.lantai || ''} ${bin.ruang || ''} ${bin.id || ''}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());

    // 2. Filter Dropdown Status (Menggunakan variabel 'level')
    let matchesStatus = true;
    const currentLevel = bin.level ?? 0;
    
    if (statusFilter === "Penuh") matchesStatus = bin.status === 'on' && currentLevel >= 90;
    else if (statusFilter === "Hampir Penuh") matchesStatus = bin.status === 'on' && currentLevel >= 70 && currentLevel < 90;
    else if (statusFilter === "Terisi") matchesStatus = bin.status === 'on' && currentLevel > 0 && currentLevel < 70;
    else if (statusFilter === "Kosong") matchesStatus = bin.status === 'on' && currentLevel <= 0;
    else if (statusFilter === "Offline") matchesStatus = bin.status === 'off'; // Otomatis sinkron dengan binService

    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <PageContainer>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-emerald-500 font-bold animate-bounce text-2xl">Memuat Data Monitoring...</div>
      </div>
    </PageContainer>
  );

  return (
    <PageContainer>
      <PageHeader 
        title="Monitoring Bin" 
        subtitle="Pantau status seluruh tempat sampah secara real-time." 
      />

      {/* Filter Bar */}
      <div className="flex flex-col gap-2 bg-white p-2.5 rounded-2xl border border-gray-100 shadow-sm md:flex-row md:items-center md:justify-between sm:gap-3 sm:p-4">
        <div className="flex items-center gap-2 text-gray-500">
          <FiFilter className="text-emerald-500" />
          <span className="text-xs font-medium sm:text-sm">Filter Tampilan:</span>
        </div>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full cursor-pointer rounded-xl border-none bg-gray-50 p-2 text-[11px] font-bold text-gray-700 outline-none transition-all focus:ring-2 focus:ring-emerald-500 sm:p-2.5 sm:text-sm md:w-56"
        >
          <option>Semua Status</option>
          <option>Penuh</option>
          <option>Hampir Penuh</option>
          <option>Terisi</option>
          <option>Kosong</option>
          <option>Offline</option>
        </select>
      </div>

      {/* Stats Info */}
      <div className="flex items-center gap-2 px-1">
        <FiInfo className="text-gray-400" size={14} />
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider sm:text-[11px]">
          Menampilkan {filteredBins.length} dari {bins.length} tempat sampah
        </p>
      </div>

      {/* Grid Monitoring */}
      {filteredBins.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {filteredBins.map((bin) => (
            <BinCard
              key={bin.firestoreId} 
              id={bin.id}
              gedung={bin.gedung}
              lantai={bin.lantai}
              ruang={bin.ruang}
              level={bin.level}
              status={bin.status} // Otomatis akurat terkirim ke komponen UI kartu
              capacity={bin.capacity}
              distance={bin.distance}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 text-center border border-dashed border-gray-200 sm:p-20">
          <p className="text-gray-400 italic">Tidak ada tempat sampah yang cocok dengan filter ini.</p>
        </div>
      )}
    </PageContainer>
  );
}
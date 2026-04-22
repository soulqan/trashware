import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer'; 
import PageHeader from '@/components/layout/PageHeader'; // Import PageHeader
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { useSearch } from '@/context/SearchContext';
import BinCard from '@/components/dashboard/BinCard';
import { FiFilter, FiInfo } from 'react-icons/fi';

export default function MonitoringView() {
  const [bins, setBins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useSearch(); // Search dari Navbar
  
  // State untuk Dropdown Status
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  useEffect(() => {
    const q = query(collection(db, "bins"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const binsData = snapshot.docs.map(doc => ({ 
        firestoreId: doc.id, 
        ...doc.data() 
      }));
      setBins(binsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // LOGIKA FILTER GABUNGAN (Search + Dropdown)
  const filteredBins = bins.filter((bin) => {
    // 1. Filter Search (Berdasarkan ID atau Lokasi)
    const searchTarget = `${bin.location} ${bin.id}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());

    // 2. Filter Dropdown Status
    let matchesStatus = true;
    if (statusFilter === "Penuh") matchesStatus = bin.status === 'on' && bin.capacity >= 90;
    if (statusFilter === "Hampir Penuh") matchesStatus = bin.status === 'on' && bin.capacity >= 70 && bin.capacity < 90;
    if (statusFilter === "Terisi") matchesStatus = bin.status === 'on' && bin.capacity > 0 && bin.capacity < 70;
    if (statusFilter === "Kosong") matchesStatus = bin.status === 'on' && bin.capacity <= 0;
    if (statusFilter === "Offline") matchesStatus = bin.status === 'off';

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
      {/* Header Section menggunakan PageHeader */}
      <PageHeader 
        title="Monitoring Bin" 
        subtitle="Pantau status seluruh tempat sampah secara real-time." 
      />

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <FiFilter className="text-emerald-500" />
          <span className="text-sm font-medium">Filter Tampilan:</span>
        </div>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-50 border-none text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 block w-full md:w-56 p-2.5 outline-none font-bold cursor-pointer transition-all"
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
      <div className="flex items-center gap-2 px-2">
        <FiInfo className="text-gray-400" size={14} />
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
          Menampilkan {filteredBins.length} dari {bins.length} tempat sampah
        </p>
      </div>

      {/* Grid Monitoring */}
      {filteredBins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBins.map((bin) => (
            <BinCard
              key={bin.firestoreId}
              id={bin.id}
              location={bin.location}
              capacity={bin.capacity}
              status={bin.status}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
          <p className="text-gray-400 italic">Tidak ada tempat sampah yang cocok dengan filter ini.</p>
        </div>
      )}
    </PageContainer>
  );
}
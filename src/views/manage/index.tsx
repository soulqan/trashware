import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { useSearch } from '@/context/SearchContext';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import ManageBin, { BinData } from '@/components/manage/ManageBin';

export default function ManageView() {
  const [bins, setBins] = useState<BinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBin, setSelectedBin] = useState<BinData | null>(null);
  const { searchQuery } = useSearch();

  useEffect(() => {
    const q = query(collection(db, "bins"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const binsData = snapshot.docs.map(doc => ({ 
        firestoreId: doc.id, 
        ...doc.data() 
      } as BinData));
      setBins(binsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Hapus data bin ini?")) {
      await deleteDoc(doc(db, "bins", id));
    }
  };

  const filteredBins = bins.filter((bin) => {
    const searchTarget = `${bin.location} ${bin.name} ${bin.id}`.toLowerCase();
    return searchTarget.includes(searchQuery.toLowerCase());
  });

  if (loading) return <div className="p-8 text-emerald-500 font-bold animate-pulse text-left">Menghubungkan Database...</div>;

  return (
    <div className="p-8 space-y-6 min-h-screen font-sans text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Manage Bin</h1>
          <p className="text-sm text-gray-400">Monitoring infrastruktur dan status perangkat real-time</p>
        </div>
        <button 
          onClick={() => { setSelectedBin(null); setModalOpen(true); }} 
          className="flex items-center gap-2 bg-[#00D26A] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-50 hover:bg-[#00b95d] transition-all active:scale-95"
        >
          <FiPlus strokeWidth={3} /> Tambah Bin
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Nama</th>
                <th className="px-6 py-5">Lokasi</th>
                <th className="px-6 py-5">Kapasitas</th>
                <th className="px-6 py-5">Level Isi</th>
                <th className="px-6 py-5 text-center">Status Isi</th>
                <th className="px-6 py-5 text-center">Device</th>
                <th className="px-6 py-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBins.map((bin) => {
                const fillLevel = bin.capacity || 0;
                const percentage = Math.round((fillLevel / 100) * 100);
                const isOnline = bin.status === 'on';

                return (
                  <tr key={bin.firestoreId} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600 tracking-tight">{bin.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{bin.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">{bin.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-bold italic">100L</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{fillLevel}L ({percentage}%)</td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[11px] font-bold text-white inline-block w-28 text-center shadow-sm ${
                        percentage >= 90 ? 'bg-[#FF3B30]' : 
                        percentage >= 70 ? 'bg-[#FFCC00]' : 
                        percentage > 0 ? 'bg-[#00D26A]' : 'bg-gray-400'
                      }`}>
                        {percentage >= 90 ? 'Penuh' : percentage >= 70 ? 'Hampir Penuh' : percentage > 0 ? 'Terisi' : 'Kosong'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        isOnline ? 'border-emerald-200 text-emerald-500 bg-emerald-50' : 'border-red-200 text-red-500 bg-red-50'
                      }`}>
                        {bin.status || 'OFF'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-1">
                        <button onClick={() => { setSelectedBin(bin); setModalOpen(true); }} className="p-2 text-gray-400 hover:text-blue-500 rounded-xl transition-all"><FiEdit2 size={16} /></button>
                        <button onClick={() => handleDelete(bin.firestoreId!)} className="p-2 text-gray-400 hover:text-red-500 rounded-xl transition-all"><FiTrash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      <ManageBin isOpen={isModalOpen} onClose={() => setModalOpen(false)} editData={selectedBin} />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { useSearch } from '@/context/SearchContext';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import ManageBin from '@/components/manage/ManageBin';

export default function ManageView() {
  const [bins, setBins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedBin, setSelectedBin] = useState<any>(null);
  const { searchQuery } = useSearch();

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

  const handleDelete = async (id: string) => {
    if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
      try {
        await deleteDoc(doc(db, "bins", id));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredBins = bins.filter((bin) => {
    const searchTarget = `${bin.location} ${bin.name} ${bin.id}`.toLowerCase();
    return searchTarget.includes(searchQuery.toLowerCase());
  });

  if (loading) return <div className="p-8 text-emerald-500 font-bold animate-pulse">Menyiapkan data...</div>;

  return (
    <div className="p-8 space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">Manage Bin</h1>
          <p className="text-sm text-gray-400">Kelola semua infrastruktur tempat sampah di lingkungan kampus</p>
        </div>
        <button 
          onClick={() => { setSelectedBin(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-[#22C55E] text-white px-5 py-2.5 rounded-xl font-bold transition-all hover:bg-[#1dae52] shadow-lg shadow-emerald-50 active:scale-95"
        >
          <FiPlus strokeWidth={3} /> Tambah Bin
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Nama</th>
                <th className="px-6 py-5">Lokasi</th>
                <th className="px-6 py-5">Kapasitas</th>
                <th className="px-6 py-5">Level Saat Ini</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBins.map((bin) => {
                const currentFill = bin.currentFill || 0;
                const totalCap = bin.capacity || 100;
                const percentage = Math.round((currentFill / totalCap) * 100);

                return (
                  <tr key={bin.firestoreId} className="hover:bg-gray-50/40 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600 tracking-tight">{bin.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{bin.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400 font-medium">{bin.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{bin.capacity}L</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">
                      {currentFill}L ({percentage}%)
                    </td>
                    <td className="px-6 py-4">
                      {/* FIX LOGIC STATUS DISINI */}
                      <span className={`px-4 py-1.5 rounded-xl text-[11px] font-bold text-white inline-block w-28 text-center shadow-sm transition-all ${
                        percentage >= 90 
                          ? 'bg-[#FF3B30]' 
                          : percentage >= 70 
                            ? 'bg-[#FFCC00]' 
                            : percentage > 0 
                              ? 'bg-[#00D26A]' 
                              : 'bg-gray-400'
                      }`}>
                        {percentage >= 90 ? 'Penuh' : percentage >= 70 ? 'Hampir Penuh' : percentage > 0 ? 'Terisi' : 'Kosong'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setSelectedBin(bin); setModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(bin.firestoreId)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredBins.length === 0 && (
          <div className="p-20 text-center text-gray-400 italic text-sm">Data tidak ditemukan dalam database.</div>
        )}
      </div>

      <ManageBin 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        editData={selectedBin} 
      />
    </div>
  );
}
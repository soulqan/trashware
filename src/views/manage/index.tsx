'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer'; 
import PageHeader from '@/components/layout/PageHeader'; 
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
      // 🟢 SEKARANG: Langsung mengambil data asli dari Firestore secara bersih dan aman
      const binsData = snapshot.docs.map(doc => {
        return { firestoreId: doc.id, ...doc.data() } as BinData;
      });
      
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

  // LOGIKA FILTER PENCARIAN - Tetap Asli
  const filteredBins = bins.filter((bin) => {
    const searchTarget = `${bin.ruang} ${bin.lantai} ${bin.gedung} ${bin.id}`.toLowerCase();
    return searchTarget.includes(searchQuery.toLowerCase());
  });

  if (loading) return (
    <PageContainer>
      <div className="text-emerald-500 font-bold animate-pulse text-left">
        Menghubungkan Database...
      </div>
    </PageContainer>
  );

  return (
    <PageContainer>
      {/* Header Section */}
      <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between sm:gap-3">
        <PageHeader 
          title="Manage Bin" 
          subtitle="Monitoring infrastruktur dan status perangkat real-time" 
        />
        <button 
          onClick={() => { setSelectedBin(null); setModalOpen(true); }} 
          className="flex w-full items-center justify-center gap-2 bg-[#00D26A] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-50 hover:bg-[#00b95d] transition-all active:scale-95 sm:w-auto sm:px-5 sm:py-2.5"
        >
          <FiPlus strokeWidth={3} /> Tambah Bin
        </button>
      </div>

      {/* Table Section (Desktop) */}
      <div className="hidden overflow-hidden rounded-4xl border border-gray-100 bg-white shadow-sm sm:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-black text-left">
              <tr>
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Gedung</th>
                <th className="px-6 py-5">Lantai</th>
                <th className="px-6 py-5">Ruang</th>
                <th className="px-6 py-5">Kapasitas</th>
                <th className="px-6 py-5 text-center">Level Isi</th>
                <th className="px-6 py-5 text-center">Status Isi</th>
                <th className="px-6 py-5 text-center">Device</th>
                <th className="px-6 py-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBins.map((bin) => {
                const level = bin.level || 0;
                // Murni membaca string 'on' dari database hasil kiriman rutin hardware
                const isOnline = bin.status === 'on'; 

                return (
                  <tr key={bin.firestoreId} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600 tracking-tight">{bin.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">{bin.gedung}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{bin.lantai}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{bin.ruang}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-bold italic">{bin.capacity}L</td>
                    <td className="px-6 py-4 text-sm font-bold text-center text-gray-700">{level}%</td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[11px] font-bold text-white inline-block w-28 text-center shadow-sm ${
                        level >= 90 ? 'bg-[#FF3B30]' : 
                        level >= 70 ? 'bg-[#FFCC00]' : 
                        level > 0 ? 'bg-[#00D26A]' : 'bg-gray-400'
                      }`}>
                        {level >= 90 ? 'Penuh' : level >= 70 ? 'Hampir Penuh' : level > 0 ? 'Terisi' : 'Kosong'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        isOnline ? 'border-emerald-200 text-emerald-500 bg-emerald-50' : 'border-red-200 text-red-500 bg-red-50'
                      }`}>
                        {isOnline ? 'ON' : 'OFF'}
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
          {filteredBins.length === 0 && (
            <div className="p-10 text-center text-gray-400 italic">
              Data bin tidak ditemukan.
            </div>
          )}
        </div>
      </div>

      {/* Card Section (Mobile) */}
      <div className="space-y-2 sm:hidden">
        {filteredBins.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-400 italic">
            Data bin tidak ditemukan.
          </div>
        ) : (
          filteredBins.map((bin) => {
            const level = bin.level || 0;
            const isOnline = bin.status === 'on';

            return (
              <div key={bin.firestoreId} className="rounded-2xl border border-gray-100 bg-white p-2.5 shadow-sm sm:rounded-3xl sm:p-3">
                <div className="flex items-start justify-between gap-2.5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">{bin.id}</p>
                    <h3 className="mt-1 text-sm font-bold text-gray-800 sm:text-base">{bin.gedung}</h3>
                    <p className="text-xs text-gray-500 sm:text-sm">{bin.lantai} · {bin.ruang}</p>
                  </div>
                  <span className={`rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border sm:px-2.5 sm:py-1 sm:text-[10px] ${
                    isOnline ? 'border-emerald-200 text-emerald-500 bg-emerald-50' : 'border-red-200 text-red-500 bg-red-50'
                  }`}>
                    {isOnline ? 'ON' : 'OFF'}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-1.5 text-sm sm:gap-2">
                  <div className="rounded-xl bg-gray-50 p-2 sm:rounded-2xl sm:p-2.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Kapasitas</p>
                    <p className="mt-1 font-bold text-gray-700">{bin.capacity}L</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-2 sm:rounded-2xl sm:p-2.5">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Level</p>
                    <p className="mt-1 font-bold text-gray-700">{level}%</p>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 sm:mt-3 sm:gap-3">
                  <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold text-white ${
                    level >= 90 ? 'bg-[#FF3B30]' : 
                    level >= 70 ? 'bg-[#FFCC00]' : 
                    level > 0 ? 'bg-[#00D26A]' : 'bg-gray-400'
                  }`}>
                    {level >= 90 ? 'Penuh' : level >= 70 ? 'Hampir Penuh' : level > 0 ? 'Terisi' : 'Kosong'}
                  </span>

                  <div className="flex gap-1">
                    <button onClick={() => { setSelectedBin(bin); setModalOpen(true); }} className="rounded-xl p-1.5 text-gray-400 transition-all hover:text-blue-500">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(bin.firestoreId!)} className="rounded-xl p-1.5 text-gray-400 transition-all hover:text-red-500">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <ManageBin
        key={`${isModalOpen}-${selectedBin?.firestoreId || 'new'}`}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        editData={selectedBin}
      />
    </PageContainer>
  );
}
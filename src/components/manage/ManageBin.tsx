import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { FiX } from 'react-icons/fi';

interface BinData {
  firestoreId?: string;
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentFill: number;
}

interface ManageBinProps {
  isOpen: boolean;
  onClose: () => void;
  editData: BinData | null;
}

export default function ManageBin({ isOpen, onClose, editData }: ManageBinProps) {
  const [formData, setFormData] = useState<BinData>({
    id: "",
    name: "",
    location: "",
    capacity: 100,
    currentFill: 0
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({ id: "", name: "", location: "", capacity: 100, currentFill: 0 });
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editData?.firestoreId) {
        const docRef = doc(db, "bins", editData.firestoreId);
        const { firestoreId, ...dataToSave } = formData;
        await updateDoc(docRef, dataToSave);
      } else {
        const finalId = formData.id || `BIN-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
        await addDoc(collection(db, "bins"), {
          ...formData,
          id: finalId,
          status: "on",
          last_updated: new Date().toISOString()
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving bin:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4 font-sans">
      <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl relative p-8">
        <button onClick={onClose} className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <FiX size={20} />
        </button>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">{editData ? 'Edit Tempat Sampah' : 'Tambah Tempat Sampah'}</h2>
          <p className="text-sm text-blue-400 mt-1">Kelola informasi infrastruktur tempat sampah kampus</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Nama</label>
            <input 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Lokasi</label>
            <input 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Kapasitas (L)</label>
              <input 
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Level Sekarang (L)</label>
              <input 
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.currentFill}
                onChange={(e) => setFormData({...formData, currentFill: Number(e.target.value)})}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <button type="button" onClick={onClose} className="px-8 py-2.5 text-sm font-semibold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Batal</button>
            <button type="submit" className="px-8 py-2.5 text-sm font-semibold bg-[#22C55E] text-white rounded-xl hover:bg-[#1dae52] shadow-lg shadow-emerald-50 transition-all">
              {editData ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
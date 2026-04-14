import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { FiX } from 'react-icons/fi';

export interface BinData {
  firestoreId?: string;
  id: string;
  name: string;
  location: string;
  capacity: number; // Berfungsi sebagai level isi
  status: 'on' | 'off';
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
    capacity: 0,
    status: 'on'
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({ id: "", name: "", location: "", capacity: 0, status: 'on' });
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
          last_updated: new Date().toISOString()
        });
      }
      onClose();
    } catch (error) {
      console.error("Firebase Error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4 font-sans text-left">
      <div className="bg-white w-full max-w-lg rounded-[24px] shadow-2xl relative p-8">
        <button onClick={onClose} className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <FiX size={20} />
        </button>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">{editData ? 'Edit Data Bin' : 'Tambah Bin Baru'}</h2>
          <p className="text-sm text-blue-400 mt-1">Konfigurasi perangkat dan level isi (Maks 100L)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Nama Tempat Sampah</label>
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
              <label className="text-sm font-semibold text-emerald-600 ml-1">Kapasitas Isi (L)</label>
              <input 
                type="number" max="100" min="0"
                className="w-full px-4 py-3 bg-gray-50 border border-emerald-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Status Perangkat</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as 'on' | 'off'})}
              >
                <option value="on">ON (Active)</option>
                <option value="off">OFF (Inactive)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button type="button" onClick={onClose} className="px-8 py-2.5 text-sm font-semibold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Batal</button>
            <button type="submit" className="px-8 py-2.5 text-sm font-semibold bg-[#00D26A] text-white rounded-xl shadow-lg shadow-emerald-50 hover:bg-[#00b95d] active:scale-95 transition-all">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
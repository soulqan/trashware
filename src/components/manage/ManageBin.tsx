import { useState } from 'react';
import { db } from '@/lib/firebase';
import { updateDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FiX } from 'react-icons/fi';
import { Bin } from '@/types/database';

export interface BinData extends Bin {
  firestoreId?: string;
}

// FIX 1: Menambahkan kembali interface ManageBinProps yang terlewat
interface ManageBinProps {
  isOpen: boolean;
  onClose: () => void;
  editData: BinData | null;
}

const initialFormState: BinData = {
  id: "",
  gedung: "",
  lantai: "",
  ruang: "",
  capacity: 0,
  level: 0,
  status: 'off',
  distance: 0 
};

export default function ManageBin({ isOpen, onClose, editData }: ManageBinProps) {
  // FIX 2 & 3: Menghapus useEffect sepenuhnya. 
  // State langsung diinisialisasi dari editData (jika ada) atau initialFormState.
  // Ini sangat aman karena komponen di-remount oleh parent menggunakan properti 'key'.
  const [formData, setFormData] = useState<BinData>(editData || initialFormState);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!editData && !formData.id.trim()) {
        setError('ID Bin wajib diisi');
        return;
      }

      if (editData?.firestoreId) {
        // UPDATE: Hanya kirim data konfigurasi web saja.
        const docRef = doc(db, "bins", editData.firestoreId);
        await updateDoc(docRef, {
          gedung: formData.gedung,
          lantai: formData.lantai,
          ruang: formData.ruang,
          capacity: formData.capacity,
          lastUpdate: serverTimestamp()
        });
      } else {
        // CREATE: Buat dokumen baru dengan ID bertindak sebagai Document ID.
        // Field sensor/IoT sengaja di-set null.
        const docRef = doc(db, "bins", formData.id.trim());
        await setDoc(docRef, {
          id: formData.id.trim(),
          gedung: formData.gedung,
          lantai: formData.lantai,
          ruang: formData.ruang,
          capacity: formData.capacity,
          level: null,      
          distance: null,   
          status: null,     
          lastUpdate: serverTimestamp()
        });
      }
      onClose();
    } catch (error) {
      console.error("Firebase Error:", error);
      setError('Gagal menyimpan data. Silakan coba lagi.');
    }
  };

  if (!isOpen) return null;

  return (  
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4 font-sans text-left">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button onClick={onClose} className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <FiX size={20} />
        </button>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">{editData ? 'Edit Data Bin' : 'Tambah Bin Baru'}</h2>
          <p className="text-sm text-blue-400 mt-1">Konfigurasi lokasi dan kapasitas tempat sampah</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">
              ID Bin {!editData && <span className="text-red-500">*</span>}
            </label>
            <input 
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${
                editData 
                  ? 'bg-gray-100 border border-gray-100 text-gray-600 cursor-not-allowed' 
                  : 'bg-gray-50 border border-gray-100'
              }`}
              placeholder={editData ? undefined : "Contoh: BIN-001"}
              value={formData.id}
              onChange={(e) => !editData && setFormData({...formData, id: e.target.value})}
              disabled={!!editData}
              required={!editData}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Gedung/Lokasi</label>
            <input 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="Contoh: Gedung A"
              value={formData.gedung}
              onChange={(e) => setFormData({...formData, gedung: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Lantai</label>
              <input 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Contoh: 3"
                value={formData.lantai}
                onChange={(e) => setFormData({...formData, lantai: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Ruang</label>
              <input 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Contoh: Pantry"
                value={formData.ruang}
                onChange={(e) => setFormData({...formData, ruang: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Kapasitas (L)</label>
            <input 
              type="number" min="0"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Contoh: 100"
              value={formData.capacity || ""}
              onChange={(e) => setFormData({...formData, capacity: e.target.value ? Number(e.target.value) : 0})}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="w-full rounded-xl border border-gray-200 bg-white px-8 py-2.5 text-sm font-semibold text-gray-500 transition-all hover:bg-gray-50 sm:w-auto">Batal</button>
            <button type="submit" className="w-full rounded-xl bg-[#00D26A] px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-50 transition-all active:scale-95 hover:bg-[#00b95d] sm:w-auto">
              {editData ? 'Perbarui' : 'Tambah'} Bin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  onSnapshot, 
  addDoc, 
  collection, 
  serverTimestamp, 
  updateDoc 
} from 'firebase/firestore';
import { Bin, TrashHistory } from '@/types/database';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { 
  FiUser, 
  FiTrash2, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiLoader, 
  FiArrowLeft, 
  FiMapPin, 
  FiBarChart2 
} from 'react-icons/fi';
import { useRouter } from 'next/router';

export default function ActionView({ id }: { id: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  
  // State Data
  const [binData, setBinData] = useState<Bin | null>(null);
  const [initialLevel, setInitialLevel] = useState<number | null>(null);
  
  // State UI
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 1. Ambil Level Awal (Snapshot saat pertama kali halaman dibuka)
  useEffect(() => {
    if (!id) return;
    const fetchInitial = async () => {
      const docRef = doc(db, "bins", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setInitialLevel(Number(snap.data().level));
      }
    };
    fetchInitial();
  }, [id]);

  // 2. Real-time Listener (Pantau perubahan sensor selama petugas di lokasi)
  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, "bins", id), (docSnap) => {
      if (docSnap.exists()) {
        setBinData({ id: docSnap.id, ...docSnap.data() } as Bin);
      }
    });
    return () => unsubscribe();
  }, [id]);

  const handleApproveAction = async () => {
    // Validasi dasar
    if (!session?.user || !binData || initialLevel === null) return;
    
    setIsProcessing(true);
    setMessage(null);

    try {
      // Ambil data paling fresh dari Firestore untuk validasi akhir
      const binRef = doc(db, "bins", id);
      const freshSnap = await getDoc(binRef);
      
      if (!freshSnap.exists()) throw new Error("Unit tidak ditemukan");
      
      const currentLevel = Number(freshSnap.data().level);

      // LOGIKA 1: Mencegah Fraud (Level harus berubah dari awal datang)
      if (currentLevel === initialLevel) {
        setMessage({ 
          type: 'error', 
          text: `Gagal! Level masih tetap ${currentLevel}%. Sensor tidak mendeteksi adanya aktivitas pengosongan.` 
        });
        setIsProcessing(false);
        return;
      }

      // LOGIKA 2: Ambang Batas (Harus di bawah 20% untuk dianggap sukses)
      if (currentLevel >= 20) {
        setMessage({ 
          type: 'error', 
          text: `Gagal! Bak masih berisi ${currentLevel}%. Harap kosongkan hingga di bawah 20%.` 
        });
        setIsProcessing(false);
        return;
      }

      // LOGIKA 3: Simpan ke History menggunakan Interface TrashHistory
      const historyData: TrashHistory = {
        binId: id,
        officerName: session.user.name || "Petugas",
        officerEmail: session.user.email || "",
        location: `${binData.gedung} - ${binData.lantai} (${binData.ruang})`,
        levelCaptured: currentLevel,
        status: 'Approved',
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, "history"), historyData);

      // LOGIKA 4: Update 'lastUpdate' di koleksi bins (sebagai tanda pengosongan terakhir)
      await updateDoc(binRef, {
        lastUpdate: serverTimestamp()
      });
      
      setMessage({ type: 'success', text: 'Berhasil! Data penjemputan terverifikasi dan waktu update diperbarui.' });
      
      // Delay sebelum kembali ke dashboard
      setTimeout(() => router.push('/monitoring'), 2500);

    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal menghubungi database. Periksa koneksi internet Anda.' });
    } finally {
      setIsProcessing(false);
    }
  };

  // UI state untuk proteksi tombol (Double Bang !! untuk menghindari null error di TypeScript)
  const isButtonDisabled = !!isProcessing || !binData || (!!binData && binData.level < 20 && !message);

  return (
    <PageContainer>
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-gray-500 mb-6 font-bold text-sm hover:text-gray-900 transition-colors"
      >
        <FiArrowLeft /> Kembali
      </button>

      <PageHeader 
        title="Verifikasi Penjemputan" 
        subtitle="Verifikasi dilakukan otomatis melalui pencocokan data sensor IoT Trashware." 
      />

      <div className="max-w-xl mx-auto mt-8 bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden">
        <div className="p-10 space-y-8">
          
          {/* Section: Petugas */}
          <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-[24px] border border-emerald-100">
            <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <FiUser size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Petugas Penjemputan</p>
              <p className="font-extrabold text-gray-800 text-lg">{session?.user?.name || 'Loading...'}</p>
            </div>
          </div>

          {/* Section: Level Comparison */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-[24px] border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FiBarChart2 /> Level Awal
              </p>
              <p className="font-black text-2xl text-gray-400 tracking-tighter">
                {initialLevel !== null ? `${initialLevel}%` : '--%'}
              </p>
            </div>
            <div className="p-6 bg-emerald-50/30 rounded-[24px] border border-emerald-100/50">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FiBarChart2 /> Real-time
              </p>
              <p className={`font-black text-2xl tracking-tighter ${binData && binData.level < 20 ? 'text-emerald-500' : 'text-orange-500'}`}>
                {binData ? `${binData.level}%` : '--%'}
              </p>
            </div>
          </div>

          {/* Section: Lokasi */}
          <div className="p-6 bg-white border-2 border-dashed border-gray-100 rounded-[24px]">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <FiMapPin />
              <p className="text-[10px] font-bold uppercase tracking-widest">Titik Unit</p>
            </div>
            <p className="font-bold text-gray-700">
              {binData ? `${binData.gedung}, ${binData.lantai}` : 'Memuat lokasi...'}
            </p>
            <p className="text-sm text-gray-400 font-medium italic">
              {binData?.ruang || 'Mencari detail ruang...'}
            </p>
          </div>

          {/* Feedback Messages */}
          {message && (
            <div className={`p-5 rounded-2xl flex items-start gap-4 animate-in fade-in zoom-in duration-300 ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {message.type === 'success' ? <FiCheckCircle size={20} className="mt-1 shrink-0" /> : <FiAlertCircle size={20} className="mt-1 shrink-0" />}
              <p className="text-sm font-black leading-tight">{message.text}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleApproveAction}
            disabled={isButtonDisabled}
            className={`w-full py-6 rounded-[28px] font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl
              ${isButtonDisabled && !message
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none' 
                : 'bg-gray-900 hover:bg-black text-white shadow-gray-200'}`}
          >
            {isProcessing ? (
              <><FiLoader className="animate-spin" /> Sinkronisasi...</>
            ) : (binData && binData.level < 20 && !message) ? (
              <><FiCheckCircle /> Selesai Dikosongkan</>
            ) : (
              <><FiTrash2 /> Ambil & Approve</>
            )}
          </button>

          <p className="text-center text-[10px] text-gray-400 font-bold px-6 uppercase tracking-tight">
            Verifikasi ini akan mencatat log aktivitas petugas dan memperbarui status pada dashboard admin.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
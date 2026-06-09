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
        // 🟢 SEKARANG: Langsung mengambil data asli Firestore tanpa perantara enforceHeartbeat
        const rawBin = { id: docSnap.id, ...docSnap.data() } as Bin;
        setBinData(rawBin);
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
        timestamp: serverTimestamp() as unknown as Date
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

  // UI state untuk proteksi tombol
  const isButtonDisabled = !!isProcessing || !binData || (!!binData && binData.level < 20 && !message);

  return (
    <PageContainer>
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-gray-500 mb-3 font-bold text-xs hover:text-gray-900 transition-colors sm:mb-6 sm:text-sm"
      >
        <FiArrowLeft /> Kembali
      </button>

      <PageHeader 
        title="Verifikasi Penjemputan" 
        subtitle="Verifikasi dilakukan otomatis melalui pencocokan data sensor IoT Trashware." 
      />

      <div className="mx-auto mt-4 max-w-xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl sm:mt-8 sm:rounded-[40px]">
        <div className="space-y-3 p-3.5 sm:space-y-6 sm:p-8 lg:p-10">
          
          {/* Section: Petugas */}
          <div className="flex items-center gap-2.5 p-3 bg-emerald-50 rounded-2xl border border-emerald-100 sm:gap-4 sm:p-5 sm:rounded-3xl">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 sm:h-14 sm:w-14 sm:rounded-2xl">
              <FiUser size={28} />
            </div>
            <div>
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] sm:text-[10px]">Petugas Penjemputan</p>
              <p className="font-extrabold text-gray-800 text-base sm:text-lg">{session?.user?.name || 'Loading...'}</p>
            </div>
          </div>

          {/* Section: Level Comparison */}
          <div className="grid grid-cols-2 gap-2 sm:gap-6">
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 sm:p-6 sm:rounded-3xl">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2 sm:text-[10px]">
                <FiBarChart2 /> Level Awal
              </p>
              <p className="font-black text-lg text-gray-400 tracking-tighter sm:text-2xl">
                {initialLevel !== null ? `${initialLevel}%` : '--%'}
              </p>
            </div>
            <div className="p-3 bg-emerald-50/30 rounded-2xl border border-emerald-100/50 sm:p-6 sm:rounded-3xl">
              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2 sm:text-[10px]">
                <FiBarChart2 /> Real-time
              </p>
              {/* Membaca string status asli kiriman hardware */}
              <p className={`font-black text-lg tracking-tighter sm:text-2xl ${
                binData?.status === 'off' 
                  ? 'text-gray-400 line-through' 
                  : (binData && binData.level < 20 ? 'text-emerald-500' : 'text-orange-500')
              }`}>
                {binData ? `${binData.level}%` : '--%'}
                {binData?.status === 'off' && <span className="text-[10px] block font-medium tracking-normal text-red-500 mt-0.5">⚠️ Perangkat Offline</span>}
              </p>
            </div>
          </div>

          {/* Section: Lokasi */}
          <div className="rounded-2xl border-2 border-dashed border-gray-100 bg-white p-3 sm:p-6 sm:rounded-3xl">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <FiMapPin />
              <p className="text-[9px] font-bold uppercase tracking-widest sm:text-[10px]">Titik Unit</p>
            </div>
            <p className="font-bold text-gray-700">
              {binData ? `${binData.gedung}, ${binData.lantai}` : 'Memuat lokasi...'}
            </p>
            <p className="text-xs text-gray-400 font-medium italic sm:text-sm">
              {binData?.ruang || 'Mencari detail ruang...'}
            </p>
          </div>

          {/* Feedback Messages */}
          {message && (
            <div className={`p-4 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in duration-300 sm:p-5 sm:gap-4 ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {message.type === 'success' ? <FiCheckCircle size={20} className="mt-1 shrink-0" /> : <FiAlertCircle size={20} className="mt-1 shrink-0" />}
              <p className="text-xs font-black leading-tight sm:text-sm">{message.text}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleApproveAction}
            disabled={isButtonDisabled}
            className={`w-full py-3 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 transition-all active:scale-95 shadow-xl sm:py-6 sm:text-xl sm:rounded-[28px] sm:gap-3
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

          <p className="px-2 text-center text-[9px] font-bold uppercase tracking-tight text-gray-400 sm:px-6 sm:text-[10px]">
            Verifikasi ini akan mencatat log aktivitas petugas dan memperbarui status pada dashboard admin.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
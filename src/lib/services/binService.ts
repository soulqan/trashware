import { Bin } from '@/types/database';

export const binService = {
  /**
   * Mengoreksi status ON/OFF berdasarkan detak jantung (heartbeat) IoT.
   * Jika tidak ada kiriman data baru lebih dari 8 detik, paksa status jadi 'off'.
   */
  enforceHeartbeat(bin: Bin): Bin {
    let isOnline = bin.status === 'on';

    if (bin.lastUpdate) {
      // Ekstrak waktu milidetik (aman untuk Timestamp Firestore maupun Date)
      const lastUpdateMs = typeof bin.lastUpdate === 'object' && bin.lastUpdate && 'toMillis' in bin.lastUpdate
        ? (bin.lastUpdate as any).toMillis()
        : new Date(bin.lastUpdate as any).getTime();

      const batasToleransi = 8 * 1000; // Jeda ketat 8 detik untuk interval IoT 5 detik
      const waktuMaksimalUpdate = Date.now() - batasToleransi;

      if (lastUpdateMs < waktuMaksimalUpdate) {
        isOnline = false;
      }
    } else {
      isOnline = false; // Jika tidak ada timestamp, otomatis anggap offline
    }

    return {
      ...bin,
      status: isOnline ? ('on' as const) : ('off' as const),
    };
  }
};
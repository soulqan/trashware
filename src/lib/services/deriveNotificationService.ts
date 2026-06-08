import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Bin } from '@/types/database';
import { notificationReadService } from './notificationReadService';
import { binService } from './binService'; 

export interface DerivedNotification {
  id: string;
  binId: string;
  gedung: string;
  lantai: string;
  ruang: string;
  location: string;
  title: string;
  description: string;
  level: number;
  capacity: number;
  status: 'baru' | 'dibaca';
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

export const deriveNotificationService = {
  // Subscribe to bins and derive notifications (ONLY FULL BINS - level >= 90 & status === 'on')
  subscribeToDerivedNotifications(
    callback: (notifications: DerivedNotification[]) => void
  ) {
    const unsubscribe = onSnapshot(collection(db, 'bins'), (snapshot) => {
      const bins = snapshot.docs.map((doc) => {
        const rawBin = { id: doc.id, ...doc.data() } as Bin;
        return binService.enforceHeartbeat(rawBin);
      });

      // Derive notifications dari tempat sampah yang PENUH DAN AKTIF saja
      const derivedNotifications = bins
        .filter((bin) => bin.status === 'on' && bin.level >= 90) 
        .map((bin) => {
          const location = `${bin.gedung} - ${bin.lantai} - ${bin.ruang}`;
          
          const timestamp = bin.lastUpdate 
            ? (typeof bin.lastUpdate === 'object' && 'toDate' in bin.lastUpdate
                ? (bin.lastUpdate as { toDate: () => Date }).toDate()
                : new Date(bin.lastUpdate as string | number | Date))
            : new Date();

          return {
            id: bin.id,
            binId: bin.id,
            gedung: bin.gedung,
            lantai: bin.lantai,
            ruang: bin.ruang,
            location: location,
            title: location,
            description: `${location} penuh (level ${bin.level}) - segera kosongkan`,
            level: bin.level,
            capacity: bin.capacity,
            status: 'baru' as const, 
            type: 'error' as const, 
            timestamp: timestamp,
          } as DerivedNotification;
        })
        .sort((a, b) => b.level - a.level);

      callback(derivedNotifications);
    });

    return unsubscribe;
  },

  // Get derived notification counts (ONLY FULL BINS) - Real-time dengan status baca
  subscribeToNotificationCounts(
    callback: (counts: { semua: number; baru: number; dibaca: number }) => void
  ) {
    let binsData: Bin[] = [];
    let readIds: string[] = [];

    // Subscribe to bins
    const unsubscribeBins = onSnapshot(collection(db, 'bins'), (snapshot) => { 
      binsData = snapshot.docs.map((doc) => {
        const rawBin = { id: doc.id, ...doc.data() } as Bin;
        return binService.enforceHeartbeat(rawBin);
      });

      updateCounts();
    });

    // Subscribe to read notifications (real-time)
    const unsubscribeRead = onSnapshot(collection(db, 'notificationRead'), (snapshot) => {
      readIds = snapshot.docs
        .map((doc) => doc.data() as { notificationId?: string })
        .map((data) => data.notificationId)
        .filter((id): id is string => Boolean(id));
      updateCounts();
    });

    const updateCounts = () => {
      const fullBins = binsData.filter((b) => b.status === 'on' && b.level >= 90);
      const fullBinIds = new Set(fullBins.map((b) => b.id));

      notificationReadService.cleanupReadNotificationsForNonFullBins(
        fullBinIds
      );

      const validReadIds = readIds.filter((id) => fullBinIds.has(id));

      callback({
        semua: fullBins.length,
        baru: fullBins.length - validReadIds.length, 
        dibaca: validReadIds.length, 
      });
    };

    return () => {
      unsubscribeBins();
      unsubscribeRead();
    };
  },

  // Subscribe to notifications with read status - Real-time
  subscribeToDerivedNotificationsWithStatus(
    callback: (notifications: DerivedNotification[]) => void,
    filter?: 'semua' | 'baru' | 'dibaca'
  ) {
    let binsData: Bin[] = [];
    let readIds: string[] = [];

    // Subscribe to bins
    const unsubscribeBins = onSnapshot(collection(db, 'bins'), (snapshot) => {
      binsData = snapshot.docs.map((doc) => {
        const rawBin = { id: doc.id, ...doc.data() } as Bin;
        return binService.enforceHeartbeat(rawBin);
      });

      updateNotifications();
    });

    // Subscribe to read notifications (real-time)
    const unsubscribeRead = onSnapshot(collection(db, 'notificationRead'), (snapshot) => {
      readIds = snapshot.docs
        .map((doc) => doc.data() as { notificationId?: string })
        .map((data) => data.notificationId)
        .filter((id): id is string => Boolean(id));
      updateNotifications();
    });

    const updateNotifications = () => {
      const fullBins = binsData.filter((bin) => bin.status === 'on' && bin.level >= 90);

      const derivedNotifications = fullBins
        .map((bin) => {
          const location = `${bin.gedung} - ${bin.lantai} - ${bin.ruang}`;
          const isRead = readIds.includes(bin.id);
          
          const timestamp = bin.lastUpdate 
            ? (typeof bin.lastUpdate === 'object' && 'toDate' in bin.lastUpdate
                ? (bin.lastUpdate as { toDate: () => Date }).toDate()
                : new Date(bin.lastUpdate as string | number | Date))
            : new Date();

          return {
            id: bin.id,
            binId: bin.id,
            gedung: bin.gedung,
            lantai: bin.lantai,
            ruang: bin.ruang,
            location: location,
            title: location,
            description: `${location} penuh (level ${bin.level}) - segera kosongkan`,
            level: bin.level,
            capacity: bin.capacity,
            status: isRead ? 'dibaca' : 'baru',
            type: 'error' as const,
            timestamp: timestamp,
          } as DerivedNotification;
        })
        .filter((notif) => {
          if (!filter || filter === 'semua') return true;
          return notif.status === filter;
        })
        .sort((a, b) => b.level - a.level);

      callback(derivedNotifications);
    };

    return () => {
      unsubscribeBins();
      unsubscribeRead();
    };
  },
};
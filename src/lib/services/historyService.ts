import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type HistoryRecord = {
  id: string;
  binId: string;
  location: string;
  capacity: number;
  timestamp: Date;
};

const parseFirestoreDate = (value: Timestamp | Date | string | number | null | undefined): Date => {
  if (value == null) return new Date();
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? new Date() : d;
};

const hourKeyNow = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  return `${yyyy}${mm}${dd}${hh}`;
};

export const subscribeBinsToHistoryHourly = () => {
  const lastSyncedHourMap: Record<string, string> = {};
  const binsQuery = query(collection(db, 'bins'));

  return onSnapshot(
    binsQuery,
    async (snapshot) => {
      const hourKey = hourKeyNow();

      try {
        await Promise.all(
          snapshot.docChanges().map(async (change) => {
            if (change.type === 'removed') return;

            const binDoc = change.doc;
            const stableBinKey = binDoc.id;
            const data = binDoc.data() as {
              id?: string;
              location?: string;
              capacity?: number;
            };

            if (typeof data.capacity !== 'number') return;
            if (lastSyncedHourMap[stableBinKey] === hourKey) return;

            const binId = data.id ?? stableBinKey;
            const historyDocId = `${stableBinKey}_${hourKey}`;
            const historyDocRef = doc(db, 'bin_history', historyDocId);

            const existing = await getDoc(historyDocRef);
            if (existing.exists()) {
              lastSyncedHourMap[stableBinKey] = hourKey;
              return;
            }

            await setDoc(historyDocRef, {
              binId,
              location: data.location ?? 'Lokasi Tidak Diketahui',
              capacity: data.capacity,
              timestamp: serverTimestamp(),
              source: 'sync-from-bins',
            });

            lastSyncedHourMap[stableBinKey] = hourKey;
          })
        );
      } catch (error) {
        console.error('Gagal sinkron bins ke bin_history:', error);
      }
    },
    (error) => {
      console.error('Gagal membaca bins untuk sinkron history:', error);
    }
  );
};

export const subscribeHistoryRecords = (onData: (data: HistoryRecord[]) => void, onError?: (error: unknown) => void) => {
  const historyQuery = query(collection(db, 'bin_history'), orderBy('timestamp', 'asc'));

  return onSnapshot(
    historyQuery,
    (snapshot) => {
      const mapped = snapshot.docs.map((historyDoc) => {
        const data = historyDoc.data();
        return {
          id: historyDoc.id,
          binId: data.binId || 'Unknown ID',
          location: data.location || 'Lokasi Tidak Diketahui',
          capacity: data.capacity || 0,
          timestamp: parseFirestoreDate(data.timestamp),
        };
      });

      onData(mapped);
    },
    (error) => {
      onError?.(error);
    }
  );
};

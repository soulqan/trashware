import {
  collection,
  onSnapshot,
  orderBy,
  query,
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


export const subscribeHistoryRecords = (onData: (data: HistoryRecord[]) => void, onError?: (error: unknown) => void) => {
  const historyQuery = query(collection(db, 'bin_history'), orderBy('timestamp', 'asc'));

  return onSnapshot(
    historyQuery,
    (snapshot) => {
      const mapped = snapshot.docs.map((historyDoc) => {
        const data = historyDoc.data();
        const composedLocation =
          data.location ||
          [data.gedung, data.lantai, data.ruang]
            .filter((p) => p !== undefined && p !== null && String(p).trim() !== '')
            .join(' - ') ||
          'Lokasi Tidak Diketahui';

        return {
          id: historyDoc.id,
          binId: data.binId || 'Unknown ID',
          location: composedLocation,
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

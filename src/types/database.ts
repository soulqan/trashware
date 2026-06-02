import type { Timestamp } from "firebase/firestore";

export interface Bin {
  id: string;
  gedung: string;
  lantai: string;
  ruang: string;
  capacity: string | number;
  level: number;
  status: 'on' | 'off';
  lastUpdate?: Timestamp | Date | string | number | null;
}

export interface TrashHistory {
  binId: string;
  officerName: string;
  officerEmail: string;
  location: string;
  levelCaptured: number;
  status: 'Approved' | 'Rejected';
  timestamp: Timestamp | Date | string | number;
}

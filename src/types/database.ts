import type { Timestamp } from "firebase/firestore";

export interface Bin {
  id: string;
  gedung: string;
  lantai: string;
  ruang: string;
  capacity: number;          // Diubah ke number sesuai di gambar (100)
  distance: number;          // BARU: Ditambahkan sesuai di gambar (13)
  level: number;             // Berwujud angka (46)
  status: 'on' | 'off';      // Berwujud string ("on")
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
export interface Bin {
  id: string;
  gedung: string;
  lantai: string;
  ruang: string;
  capacity: string | number;
  level: number;
  status: 'on' | 'off';
  lastUpdate?: any;
}

export interface TrashHistory {
  binId: string;
  officerName: string;
  officerEmail: string;
  location: string;
  levelCaptured: number;
  status: 'Approved' | 'Rejected';
  timestamp: any;
}
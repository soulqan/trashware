import Link from 'next/link';
import { Bin } from '@/types/database'; 
import { FiMapPin, FiClock, FiWifi, FiWifiOff } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns'; // Opsional: Instal dengan 'npm install date-fns'
import { id as localeId } from 'date-fns/locale';

export default function BinCard({ id, gedung, lantai, ruang, level, capacity, status, lastUpdate }: Bin) {
  const isOnline = status === 'on';
  
  // Logika tema diletakkan SEBELUM return

  const getLastUpdateLabel = (timestamp: any) => {
    if (!timestamp) return 'Belum ada data';
    
    // Jika timestamp berasal dari Firestore, kita perlu panggil .toDate()
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true, locale: localeId });
    } catch (e) {
      return 'Baru saja';
    }
  };
  const getTheme = () => {
    if (!isOnline) {
      return { color: 'bg-gray-300', text: 'text-gray-500', label: 'Offline', bgLabel: 'bg-gray-100' };
    }
    if (level >= 90) {
      return { color: 'bg-red-500', text: 'text-red-500', label: 'Penuh', bgLabel: 'bg-red-100' };
    }
    if (level >= 70) {
      return { color: 'bg-orange-400', text: 'text-orange-500', label: 'Hampir Penuh', bgLabel: 'bg-orange-100' };
    }
    if (level > 0) {
      return { color: 'bg-emerald-500', text: 'text-emerald-500', label: 'Terisi', bgLabel: 'bg-emerald-100' };
    }
    return { color: 'bg-gray-300', text: 'text-gray-400', label: 'Kosong', bgLabel: 'bg-gray-50' };
  };

  const theme = getTheme();

  return (
    <Link href={`/monitoring/${id}`}>
      <div className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-300 transition-all cursor-pointer">
        {/* Header: ID & Status Wifi */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-black text-gray-800 group-hover:text-emerald-600 transition-colors uppercase leading-none">
              {id}
            </h3>
            <div className="flex items-center gap-1 text-gray-400 text-[10px] mt-2 font-medium">
              <FiMapPin size={10} className="shrink-0" />
              <span className="truncate max-w-[150px]">{gedung} - {lantai}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? <FiWifi className="text-green-400" size={16}/> : <FiWifiOff className="text-gray-300" size={16}/>}
            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${theme.bgLabel} ${theme.text}`}>
              {theme.label}
            </span>
          </div>
        </div>

        {/* Progress Bar Level Isi */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs text-gray-400 font-medium tracking-tight">Level Isi</span>
            <span className={`text-xl font-black ${theme.text}`}>
              {isOnline ? `${level}%` : '--'}
            </span>
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${theme.color}`}
              style={{ width: `${isOnline ? (level > 100 ? 100 : level < 0 ? 0 : level) : 0}%` }}
            />
          </div>

          <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-widest">
            <span>0L</span>
            <span>{capacity}L</span>
          </div>
        </div>

        {/* Footer Card */}
        <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-gray-400 text-[10px]">
          <div className="flex items-center gap-1.5">
            <FiClock size={12} />
            <span>Update: {getLastUpdateLabel(lastUpdate)}</span>
          </div>
          <span className="text-emerald-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            DETAIL AKSI &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}


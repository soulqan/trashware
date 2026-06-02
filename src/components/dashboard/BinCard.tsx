import Link from 'next/link';
import { Bin } from '@/types/database'; 
import { FiMapPin, FiClock, FiWifi, FiWifiOff } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns'; // Opsional: Instal dengan 'npm install date-fns'
import { id as localeId } from 'date-fns/locale';

export default function BinCard({ id, gedung, lantai, ruang, level, capacity, status, lastUpdate }: Bin) {
  const isOnline = status === 'on';
  
  // Logika tema diletakkan SEBELUM return

  const getLastUpdateLabel = (timestamp: unknown) => {
    if (!timestamp) return 'Belum ada data';
    
    try {
      const maybeTimestamp = timestamp as { toDate?: () => Date };
      const date = maybeTimestamp.toDate ? maybeTimestamp.toDate() : new Date(timestamp as string | number | Date);
      return formatDistanceToNow(date, { addSuffix: true, locale: localeId });
    } catch {
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
      <div className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-emerald-300 sm:p-6">
        {/* Header: ID & Status Wifi */}
        <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
          <div>
            <h3 className="text-lg font-black uppercase leading-none text-gray-800 transition-colors group-hover:text-emerald-600 sm:text-xl">
              {id}
            </h3>
            <div className="flex items-center gap-1 text-gray-400 text-[10px] mt-2 font-medium">
              <FiMapPin size={10} className="shrink-0" />
            <span className="max-w-[180px] truncate sm:max-w-full">{gedung} - {lantai} {ruang ? `• ${ruang}` : ''}</span>
          </div>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? <FiWifi className="text-green-400" size={16}/> : <FiWifiOff className="text-gray-300" size={16}/>}
            <span className={`rounded-lg px-2 py-1 text-[10px] font-bold uppercase ${theme.bgLabel} ${theme.text}`}>
              {theme.label}
            </span>
          </div>
        </div>

        {/* Progress Bar Level Isi */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-xs text-gray-400 font-medium tracking-tight">Level Isi</span>
            <span className={`text-lg font-black sm:text-xl ${theme.text}`}>
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
        <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4 text-[10px] text-gray-400">
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

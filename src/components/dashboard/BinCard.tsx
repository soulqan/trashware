import { FiMapPin, FiClock, FiWifi, FiWifiOff } from 'react-icons/fi';

interface BinCardProps {
  id: string;
  gedung: string;
  lantai: string;
  ruang: string;
  level: number;     // Persentase (0-100)
  capacity: number;  // Total volume (misal: 100)
  status: 'on' | 'off';
}

export default function BinCard({ id, gedung, lantai, ruang, level, capacity, status }: BinCardProps) {
  const isOnline = status === 'on';
  
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
    <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all ${!isOnline && 'opacity-75'}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-black text-gray-800 tracking-tighter uppercase leading-none">
            {id}
          </h3>
          <div className="flex items-start gap-1 text-gray-400 text-[10px] mt-2 font-medium">
            <FiMapPin size={10} className="shrink-0 mt-0.5" />
            <div className="flex flex-col leading-tight">
              <span className="truncate max-w-[150px] font-bold text-gray-500">{gedung}</span>
              <span className="truncate max-w-[150px]">{lantai} - {ruang}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isOnline ? <FiWifi className="text-green-400" size={16}/> : <FiWifiOff className="text-gray-300" size={16}/>}
          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${theme.bgLabel} ${theme.text}`}>
            {theme.label}
          </span>
        </div>
      </div>

      {/* Bagian Progress Bar dengan Label Volume */}
      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-xs text-gray-400 font-medium tracking-tight">Level Isi</span>
          <span className={`text-xl font-black ${theme.text}`}>
            {isOnline ? `${level}%` : '--'}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${theme.color}`}
            style={{ width: `${isOnline ? (level > 100 ? 100 : level < 0 ? 0 : level) : 0}%` }}
          />
        </div>

        {/* Label Volume di bawah Bar */}
        <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
          <span>0L</span>
          <span>{capacity ? `${capacity}L` : '-- L'}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-2 text-gray-400 text-[10px]">
        <FiClock size={12} />
        <span>Update: Baru saja</span>
      </div>
    </div>
  );
}
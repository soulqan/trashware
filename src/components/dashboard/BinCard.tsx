import { FiMapPin, FiClock, FiWifi, FiWifiOff } from 'react-icons/fi';

interface BinCardProps {
  id: string;
  location: string;
  capacity: number;
  status: 'on' | 'off';
}

export default function BinCard({ id, location, capacity, status }: BinCardProps) {
  const isOnline = status === 'on';
  
  const getTheme = () => {
    if (!isOnline) return { color: 'bg-gray-300', text: 'text-gray-500', label: 'Offline', bgLabel: 'bg-gray-100' };
    if (capacity >= 90) return { color: 'bg-red-500', text: 'text-red-500', label: 'Penuh', bgLabel: 'bg-red-100' };
    if (capacity >= 70) return { color: 'bg-orange-400', text: 'text-orange-500', label: 'Hampir Penuh', bgLabel: 'bg-orange-100' };
    return { color: 'bg-emerald-500', text: 'text-emerald-500', label: 'Kosong', bgLabel: 'bg-emerald-100' };
  };

  const theme = getTheme();

  return (
    <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all ${!isOnline && 'opacity-75'}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          {/* JUDUL UTAMA ADALAH ID */}
          <h3 className="text-xl font-black text-gray-800 tracking-tighter uppercase leading-none">
            {id}
          </h3>
          
          {/* LOKASI DI BAWAHNYA */}
          <div className="flex items-center gap-1 text-gray-400 text-[10px] mt-2 font-medium">
            <FiMapPin size={10} className="shrink-0" />
            <span className="truncate max-w-[150px]">{location}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isOnline ? <FiWifi className="text-green-400" size={16}/> : <FiWifiOff className="text-gray-300" size={16}/>}
          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${theme.bgLabel} ${theme.text}`}>
            {theme.label}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-xs text-gray-400 font-medium">Kapasitas</span>
          <span className="text-xl font-black text-gray-800">{isOnline ? `${capacity}%` : '--'}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${theme.color}`}
            style={{ width: `${isOnline ? capacity : 0}%` }}
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-2 text-gray-400 text-[10px]">
        <FiClock size={12} />
        <span>Update: 0 detik lalu</span>
      </div>
    </div>
  );
}
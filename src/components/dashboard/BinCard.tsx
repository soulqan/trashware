import { FiMapPin, FiClock, FiWifi, FiWifiOff } from 'react-icons/fi';

interface BinCardProps {
  id: string;
  location: string;
  building: string;
  capacity: number;
  status: 'on' | 'off';
}

export default function BinCard({ id, location, building, capacity, status }: BinCardProps) {
  const isOnline = status === 'on';
  
  // Logika warna berdasarkan kapasitas
  const getStatusColor = () => {
    if (!isOnline) return 'bg-gray-100 text-gray-500';
    if (capacity >= 90) return 'bg-red-500 text-white';
    if (capacity >= 70) return 'bg-orange-400 text-white';
    if (capacity > 0) return 'bg-emerald-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const getStatusLabel = () => {
    if (!isOnline) return 'Offline';
    if (capacity >= 90) return 'Penuh';
    if (capacity >= 70) return 'Hampir Penuh';
    if (capacity > 0) return 'Terisi';
    return 'Kosong';
  };

  return (
    <div className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all ${!isOnline && 'opacity-70'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{id}</h3>
          <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
            <FiMapPin size={12} />
            <span>{building}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? <FiWifi className="text-green-400" size={16}/> : <FiWifiOff className="text-gray-300" size={16}/>}
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs text-gray-400 font-medium">Kapasitas</span>
          <span className="text-xl font-black text-gray-800">{isOnline ? `${capacity}%` : '--'}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${
              !isOnline ? 'bg-gray-300' : capacity >= 90 ? 'bg-red-500' : capacity >= 70 ? 'bg-orange-400' : 'bg-emerald-500'
            }`}
            style={{ width: `${isOnline ? capacity : 0}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
          <span>{isOnline ? `${capacity}L` : '0L'}</span>
          <span>100L</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-2 text-gray-400 text-[10px]">
        <FiClock size={12} />
        <span>Update: {isOnline ? '0 detik lalu' : 'N/A'}</span>
      </div>
    </div>
  );
}
import { FiSearch, FiBell, FiMoon } from 'react-icons/fi';
import { useSearch } from '@/context/SearchContext'; // Import context

export default function Navbar() {
  const { searchQuery, setSearchQuery } = useSearch(); // Ambil state global

  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-8">
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
          <FiSearch />
        </span>
        <input 
          type="text" 
          placeholder="Cari lokasi, gedung, atau ID..." 
          className="w-full bg-white border-none shadow-sm rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update state global saat mengetik
        />
      </div>

      {/* Sisi Kanan Navbar (Profile & Icons) tetap sama */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-500">
          <button className="hover:text-emerald-500"><FiMoon size={20}/></button>
          <div className="relative">
            <FiBell size={20} className="cursor-pointer"/>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">2</span>
          </div>
        </div>
        <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">Admin Trashware</p>
            <p className="text-[10px] text-gray-400 font-medium">Polinema Manager</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">AT</div>
        </div>
      </div>
    </header>
  );
}
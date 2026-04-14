import { FiSearch, FiBell, FiMoon } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { deriveNotificationService } from '@/lib/services/deriveNotificationService';
import { useSearch } from '@/context/SearchContext'; 

export default function Navbar() {
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  
  // 2. Gunakan Context Search
  const { searchQuery, setSearchQuery } = useSearch();

  // Subscribe to notification counts
  useEffect(() => {
    const unsubscribe = deriveNotificationService.subscribeToNotificationCounts((counts) => {
      setNotificationCount(counts.baru); 
    });

    return () => unsubscribe();
  }, []);

  const handleBellClick = () => {
    router.push('/notifications');
  };

  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
          <FiSearch />
        </span>
        <input 
          type="text" 
          placeholder="Search bins, locations..." 
          // 3. Hubungkan ke state global
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border-none shadow-soft rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
        />
      </div>

      {/* Right Side Icons & Profile */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-500">
          <button className="hover:text-emerald-500 transition-colors">
            <FiMoon size={20}/>
          </button>
          
          <button onClick={handleBellClick} className="relative hover:text-emerald-500 cursor-pointer transition-colors group">
            <FiBell size={20}/>
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#F9FAFB] font-bold group-hover:bg-red-600 transition-colors">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">Admin User</p>
            <p className="text-[10px] text-gray-400 font-medium">Facility Manager</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold border-2 border-white shadow-sm">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}
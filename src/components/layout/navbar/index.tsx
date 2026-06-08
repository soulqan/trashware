import { FiSearch, FiBell } from "react-icons/fi";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { deriveNotificationService } from "@/lib/services/deriveNotificationService";
import { useSearch } from "@/context/SearchContext";
import { useSession } from "next-auth/react";
import { FiMenu } from "react-icons/fi";
import Image from "next/image";

type NavbarProps = {
  onMenuClick?: () => void;
};

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const [notificationCount, setNotificationCount] = useState(0);
  const { searchQuery, setSearchQuery } = useSearch();
  const { data: session } = useSession();
  const userRole = session?.user?.role || "user";
  const userName = session?.user?.name || "Loading...";

  // 1. Tentukan halaman mana yang SEARCH-nya mau DIHILANGKAN
  const hideSearchOn = ["/notifications", "/settings", "/profile"];
  const shouldHideSearch = hideSearchOn.includes(router.pathname);

  const handleBellClick = () => {
    router.push("/notifications");
  };

  useEffect(() => {
    const unsubscribe = deriveNotificationService.subscribeToNotificationCounts((counts) => {
      setNotificationCount(counts.baru);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="flex items-center gap-1 px-2 py-2 sm:gap-3 sm:px-5 sm:py-4 lg:h-20 lg:px-8 lg:gap-6">
      {/* Menu Button - Mobile Only */}
      <div className="flex sm:hidden shrink-0">
        <button
          onClick={onMenuClick || (() => {})}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
          aria-label="Buka menu"
        >
          <FiMenu />
        </button>
      </div>

      {/* Search Bar Group - Mobile and Desktop */}
      <div className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-1 sm:max-w-4xl">
        {!shouldHideSearch ? (
          <>
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 sm:left-4">
                <FiSearch />
              </span>
              <input
                type="text"
                placeholder="Search bins, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border-none bg-white py-1.5 pl-9 pr-2 text-[11px] shadow-soft outline-none transition-all focus:ring-2 focus:ring-emerald-500 sm:py-2.5 sm:pl-12 sm:pr-4 sm:text-sm"
              />
            </div>
            {/* Bell Icon Mobile - di sebelah kanan search */}
            <button onClick={handleBellClick} className="flex sm:hidden relative hover:text-emerald-500 cursor-pointer transition-colors group items-center justify-center text-gray-500">
              <FiBell size={20} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#F9FAFB] font-bold group-hover:bg-red-600 transition-colors">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </button>
          </>
        ) : (
          /* Hidden Search - Show empty space or nothing */
          <div className="hidden"></div>
        )}
      </div>

      {/* Spacer for desktop - pushes right side to the right */}
      <div className="hidden sm:flex flex-1"></div>

      {/* Right Side - Bell and Profile - Always on Right */}
      <div className="flex items-center justify-end gap-1 sm:gap-4 lg:gap-6 shrink-0">
        {/* Notification Icon Desktop Only */}
        <button onClick={handleBellClick} className="hidden sm:flex relative hover:text-emerald-500 cursor-pointer transition-colors group items-center justify-center text-gray-500">
          <FiBell size={20} />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#F9FAFB] font-bold group-hover:bg-red-600 transition-colors">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
        
        {/* User Profile */}
        <div className="flex items-center gap-1.5 border-l pl-2 sm:gap-3 sm:pl-6 border-gray-200">
          <button onClick={() => router.push("/profile")} className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-gray-800 sm:text-sm">{userName}</p>
              <p className="text-[11px] text-gray-400 capitalize sm:text-xs">{userRole}</p>
            </div>
            {session?.user?.image ? (
              <Image src={session.user.image} alt="avatar" width={40} height={40} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm sm:h-10 sm:w-10" />
            ) : (
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xs border-2 border-white shadow-sm sm:h-10 sm:w-10 sm:text-sm">
                {(session?.user?.name || "").split(" ").map((n: string) => n[0]).slice(0,2).join("")}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

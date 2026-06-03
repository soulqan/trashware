import { FiSearch, FiBell } from "react-icons/fi";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { deriveNotificationService } from "@/lib/services/deriveNotificationService";
import { useSearch } from "@/context/SearchContext";
import { useSession } from "next-auth/react";
import { FiMenu } from "react-icons/fi";

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
  const hideSearchOn = ["/notifications", "/settings", "/profile", "/analytics"];
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
    <header className="grid grid-cols-[auto,1fr,auto] items-center gap-2 px-2 py-2 sm:gap-4 sm:px-5 sm:py-4 lg:h-20 lg:flex lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div className="col-span-2 flex items-center justify-between gap-1.5 sm:gap-2">
        <button
          onClick={onMenuClick || (() => {})}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 sm:h-10 sm:w-10 sm:rounded-xl"
          aria-label="Buka menu"
        >
          <FiMenu />
        </button>
        <div className="flex items-center gap-4 text-gray-500">
          <button onClick={handleBellClick} className="relative hover:text-emerald-500 cursor-pointer transition-colors group">
            <FiBell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#F9FAFB] font-bold group-hover:bg-red-600 transition-colors">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar Group */}
      <div className="col-span-full row-start-2 relative w-full mt-1 sm:mt-0 lg:row-start-auto lg:col-span-auto lg:max-w-2xl">
        {/* 2. Gunakan Conditional Rendering */}
        {!shouldHideSearch ? (
          <>
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
          </>
        ) : (
          /* Bisa dikosongkan atau ganti jadi Breadcrumb/Judul Kecil */
          <div className="h-9 sm:h-10"></div>
        )}
      </div>

      {/* Sisi Kanan (Bell, Profile, dll) tetap muncul di semua page */}
      {/* Right Side Icons & Profile */}
      <div className="col-start-3 row-start-1 flex items-center justify-end gap-1.5 sm:gap-4 lg:gap-6">
        {/* User Profile */}
        <div className="flex items-center gap-1.5 border-l pl-2 sm:gap-3 sm:pl-6 border-gray-200">
          <button onClick={() => router.push("/profile")} className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-gray-800 sm:text-sm">{userName}</p>
              <p className="text-[11px] text-gray-400 capitalize sm:text-xs">{userRole}</p>
            </div>
            {session?.user?.image ? (
              <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm sm:h-10 sm:w-10" />
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

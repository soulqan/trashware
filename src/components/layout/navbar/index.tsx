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
    <header className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:h-20 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <button
          onClick={onMenuClick || (() => {})}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
          aria-label="Buka menu"
        >
          <FiMenu />
        </button>
        <div className="min-w-0 flex-1 text-right">
              <p className="truncate text-sm font-bold text-gray-800">{userName}</p>
          <p className="text-xs capitalize text-gray-400">{userRole}</p>
        </div>
      </div>

      {/* Search Bar Group */}
      <div className="relative w-full lg:max-w-2xl">
        {/* 2. Gunakan Conditional Rendering */}
        {!shouldHideSearch ? (
          <>
            <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Search bins, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-none bg-white py-2.5 pl-12 pr-4 text-sm shadow-soft outline-none transition-all focus:ring-2 focus:ring-emerald-500"
            />
          </>
        ) : (
          /* Bisa dikosongkan atau ganti jadi Breadcrumb/Judul Kecil */
          <div className="h-10"></div>
        )}
      </div>

      {/* Sisi Kanan (Bell, Profile, dll) tetap muncul di semua page */}
      {/* Right Side Icons & Profile */}
      <div className="flex items-center justify-between gap-4 sm:justify-end lg:gap-6">
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

        {/* User Profile */}
        <div className="flex items-center gap-3 border-l pl-4 sm:pl-6 border-gray-200">
          <button onClick={() => router.push("/profile")} className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-gray-800">{userName}</p>
              <p className="text-xs text-gray-400 capitalize">{userRole}</p>
            </div>
            {session?.user?.image ? (
              <img src={session.user.image} alt="avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
            ) : (
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold border-2 border-white shadow-sm">
                {(session?.user?.name || "").split(" ").map((n: string) => n[0]).slice(0,2).join("")}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

import { FiGrid, FiBarChart2, FiMapPin, FiBell, FiSettings, FiChevronLeft, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiLogOut } from "react-icons/fi";

const menuItems = [
  { name: "Dashboard", icon: <FiGrid />, path: "/" },
  { name: "Monitoring", icon: <FiTrash2 />, path: "/monitoring" },
  { name: "Map View", icon: <FiMapPin />, path: "/map-view" },
  { name: "Analytics", icon: <FiBarChart2 />, path: "/analytics" },
  { name: "Notifications", icon: <FiBell />, path: "/notifications" },
  { name: "Dashboard", icon: <FiGrid />, path: "/" },
  { name: "Monitoring", icon: <FiTrash2 />, path: "/monitoring" },
  { name: "Manage Bin", icon: <FiMapPin />, path: "/manage" },
  { name: "Analytics", icon: <FiBarChart2 />, path: "/analytics" },
  { name: "Notifications", icon: <FiBell />, path: "/notifications" },
];

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // hapus token login
    router.push("auth/login"); // arahkan ke halaman login
  };

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-4 sticky top-0">
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="bg-emerald-500 p-2 rounded-xl text-white">
            <FiTrash2 size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 leading-tight">SmartBin</h2>
            <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">IoT Monitoring</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
                  router.pathname === item.path ? "bg-emerald-50 text-emerald-600 font-semibold" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-1 border-t border-gray-50 pt-4">
        <Link href="/settings">
          <div className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 rounded-xl cursor-pointer">
            <FiSettings />
            <span className="text-sm">Settings</span>
          </div>
        </Link>
        <div onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-white bg-red-500 hover:bg-red-600 rounded-xl cursor-pointer">
          <FiLogOut />
          <span className="text-sm">Logout</span>
        </div>
      </div>
    </div>
  );
}

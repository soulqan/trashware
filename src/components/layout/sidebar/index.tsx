import { FiGrid, FiMapPin, FiBell, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiLogOut, FiX } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const menuItems = [
  { name: "Dashboard", icon: <FiGrid />, path: "/", role: ["admin", "petugas"] },
  { name: "Monitoring", icon: <FiTrash2 />, path: "/monitoring", role: ["admin", "petugas"] },
  { name: "Manage Bin", icon: <FiMapPin />, path: "/manage", role: ["admin"] }, // hanya admin
  // { name: "Analytics", icon: <FiBarChart2 />, path: "/analytics", role: ["admin", "petugas"] },
  { name: "Notifications", icon: <FiBell />, path: "/notifications", role: ["admin", "petugas"] },
];

type Role = "admin" | "petugas";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();

  const { data: session } = useSession();
  const role = (session?.user as { role?: Role })?.role;

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-full w-56 flex-col justify-between border-r border-gray-100 bg-white p-2.5 shadow-2xl transition-transform duration-300 sm:w-72 sm:p-4 lg:z-30 lg:h-screen lg:w-64 lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-4 flex items-center justify-between gap-1.5 px-0.5 sm:mb-8 sm:gap-3 sm:px-2">
          <div className="flex items-center gap-1">
            <Image src="/img/logotrashware1.png" alt="Trashware Logo" width={40} height={40} className="object-contain sm:w-12.5 sm:h-12.5" />
            <div>
              <h2 className="text-sm font-bold leading-tight text-gray-800 sm:text-lg">TrashWare</h2>
              <p className="text-[9px] font-medium uppercase tracking-widest text-gray-400 sm:text-[10px]">IoT Monitoring</p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 lg:hidden sm:p-2">
            <FiX size={18} />
          </button>
        </div>

        <nav className="space-y-0.5 overflow-y-auto sm:space-y-1">
          {menuItems.map((item) => {
            if (!role || !item.role.includes(role)) return null;

            return (
              <Link key={item.path} href={item.path} onClick={onClose}>
                <div
                  className={`flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer transition-all sm:gap-3 sm:rounded-xl sm:px-4 sm:py-3 ${
                    router.pathname === item.path ? "bg-emerald-50 text-emerald-600 font-semibold" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  }`}
                >
                  {item.icon}
                  <span className="text-[13px] sm:text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1 border-t border-gray-50 pt-2.5 sm:pt-4">
        <div onClick={handleLogout} className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-red-500 px-2.5 py-2 text-white transition hover:bg-red-600 sm:gap-3 sm:rounded-xl sm:px-4 sm:py-3">
          <FiLogOut />
          <span className="text-[13px] sm:text-sm">Logout</span>
        </div>
      </div>
    </aside>
  );
}

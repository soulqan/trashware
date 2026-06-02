import { FiGrid, FiBarChart2, FiMapPin, FiBell, FiTrash2 } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiLogOut, FiX } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const menuItems = [
  { name: "Dashboard", icon: <FiGrid />, path: "/", role: ["admin", "petugas"] },
  { name: "Monitoring", icon: <FiTrash2 />, path: "/monitoring", role: ["admin", "petugas"] },
  { name: "Manage Bin", icon: <FiMapPin />, path: "/manage", role: ["admin"] }, // hanya admin
  { name: "Analytics", icon: <FiBarChart2 />, path: "/analytics", role: ["admin", "petugas"] },
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
      className={`fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col justify-between border-r border-gray-100 bg-white p-4 shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-8 flex items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-1">
            <Image src="/img/logotrashware1.png" alt="Trashware Logo" width={50} height={50} className="object-contain" />
            <div>
              <h2 className="text-lg font-bold leading-tight text-gray-800">TrashWare</h2>
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">IoT Monitoring</p>
            </div>
          </div>

          <button onClick={onClose} className="rounded-full p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 lg:hidden">
            <FiX size={18} />
          </button>
        </div>

        <nav className="space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            if (!role || !item.role.includes(role)) return null;

            return (
              <Link key={item.path} href={item.path} onClick={onClose}>
                <div
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all ${
                    router.pathname === item.path ? "bg-emerald-50 text-emerald-600 font-semibold" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1 border-t border-gray-50 pt-4">
        <div onClick={handleLogout} className="flex cursor-pointer items-center gap-3 rounded-xl bg-red-500 px-4 py-3 text-white transition hover:bg-red-600">
          <FiLogOut />
          <span className="text-sm">Logout</span>
        </div>
      </div>
    </aside>
  );
}

// src/pages/index.tsx
import DashboardView from '@/views/dashboard';
import Sidebar from '@/components/layout/sidebar'; // Pastikan sudah buat Sidebar
import Navbar from '@/components/layout/navbar';   // Pastikan sudah buat Navbar

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      
      {/* Konten Utama */}
      <div className="flex-1">
        <main className="p-8">
          <DashboardView />
        </main>
      </div>
    </div>
  );
}
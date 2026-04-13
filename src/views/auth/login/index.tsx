import React from "react";
// import { Leaf } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f2f7f9] flex items-center justify-center p-6 relative font-sans text-slate-800">
      {/* Container Utama */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* Kolom Kiri: Branding & Informasi */}
        <div className="flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-10">
            <div className="bg-[#22c55e] p-3 rounded-2xl flex items-center justify-center text-white shadow-sm">{/* <Leaf size={32} strokeWidth={2.5} /> */}</div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Trashware</h1>
              <p className="text-slate-500 text-sm font-medium">Monitoring System</p>
            </div>
          </div>

          {/* Teks Judul */}
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">Smart Waste Management</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-10 max-w-md">Sistem pemantauan tempat sampah berbasis IoT untuk kampus yang lebih bersih dan berkelanjutan</p>

          {/* Kartu Fitur */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Kartu 1 */}
            <div className="bg-white px-6 py-5 rounded-2xl shadow-sm border border-slate-100 flex-1">
              <h3 className="text-[#22c55e] text-3xl font-bold mb-1">24/7</h3>
              <p className="text-slate-500 text-sm font-medium">Real-time Monitoring</p>
            </div>
            {/* Kartu 2 */}
            <div className="bg-white px-6 py-5 rounded-2xl shadow-sm border border-slate-100 flex-1">
              <h3 className="text-[#22c55e] text-3xl font-bold mb-1">IoT</h3>
              <p className="text-slate-500 text-sm font-medium">Smart Integration</p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Login */}
        <div className="w-full max-w-md mx-auto lg:ml-auto">
          <div className="bg-white p-8 sm:p-10 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Login</h2>
              <p className="text-slate-500 text-sm">Masuk ke sistem monitoring Trashware</p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Input Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="nama@trashware.id"
                  className="w-full bg-[#f8fafc] border-transparent focus:bg-white focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 rounded-xl px-4 py-3 text-sm transition-all outline-none text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Input Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#f8fafc] border-transparent focus:bg-white focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 rounded-xl px-4 py-3 text-sm transition-all outline-none text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Checkbox Ingat Saya */}
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-[#22c55e] focus:ring-[#22c55e] bg-[#f8fafc]" />
                <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                  Ingat saya
                </label>
              </div>

              {/* Tombol Submit */}
              <button type="submit" className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-medium py-3 rounded-xl transition-colors mt-2">
                Masuk
              </button>
            </form>

            {/* Info Demo Account */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-2 font-medium">Demo accounts:</p>
              <div className="text-xs text-slate-400 space-y-1">
                <p>Admin: admin@trashware.id / password</p>
                <p>Petugas: petugas@trashware.id / password</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Privacy Tag Kiri Bawah */}
      <div className="absolute bottom-6 left-6">
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded text-[11px] text-slate-400 border border-slate-100">Do not sell or share my personal info</div>
      </div>
    </div>
  );
}

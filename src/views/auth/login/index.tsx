import React from "react";
// import { Leaf } from 'lucide-react';
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      router.push("/"); // redirect ke dashboard/home
    } else {
      alert("Login gagal!");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f2f7f9] p-4 font-sans text-slate-800 sm:p-6">
      {/* Container Utama */}
      <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-24">
        {/* Kolom Kiri: Branding & Informasi */}
        <div className="flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-10">
            {/* <div className="bg-[#ffffff] p-3 rounded-2xl flex items-center justify-center shadow-sm"> */}
            <Image src="/img/logotrashware1.png" alt="Trashware Logo" width={80} height={80} className="object-contain" />
            {/* </div> */}
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
              <h3 className="text-[#249357] text-3xl font-bold mb-1">24/7</h3>
              <p className="text-slate-500 text-sm font-medium">Real-time Monitoring</p>
            </div>
            {/* Kartu 2 */}
            <div className="bg-white px-6 py-5 rounded-2xl shadow-sm border border-slate-100 flex-1">
              <h3 className="text-[#249357] text-3xl font-bold mb-1">IoT</h3>
              <p className="text-slate-500 text-sm font-medium">Smart Integration</p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Login */}
        <div className="mx-auto w-full max-w-md lg:ml-auto">
          <div className="bg-white p-8 sm:p-10 rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Login</h2>
              <p className="text-slate-500 text-sm">Masuk ke sistem monitoring Trashware</p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Input Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@trashware.id"
                  className="w-full bg-[#f8fafc] border-transparent focus:bg-white focus:border-[#249357] focus:ring-2 focus:ring-[#249357]/20 rounded-xl px-4 py-3 text-sm transition-all outline-none text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Input Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f8fafc] border-transparent focus:bg-white focus:border-[#249357] focus:ring-2 focus:ring-[#249357]/20 rounded-xl px-4 py-3 text-sm transition-all outline-none text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Checkbox Ingat Saya */}
              {/* <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-[#249357] focus:ring-[#249357] bg-[#f8fafc]" />
                <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer">
                  Ingat saya
                </label>
              </div> */}

              {/* Tombol Submit */}
              <button type="submit" className="w-full bg-[#249357] hover:bg-[#1b6e42] text-white font-medium py-3 rounded-xl transition-colors mt-2">
                Masuk
              </button>

              {/* Divider */}
              <div className="flex items-center my-5">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="px-3 text-xs text-slate-400">atau</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <button type="button" onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 py-3 rounded-xl transition">
                <FcGoogle className="text-xl" />
                <span className="text-sm font-medium text-slate-700">Masuk dengan Google</span>
              </button>

              {/* Link ke Halaman Register */}
              {/* Link ke Halaman Register */}
              <p className="text-sm text-center text-slate-500 mt-4">
                Belum punya akun?{" "}
                <Link href="/auth/register" className="text-[#249357] hover:underline font-medium">
                  Daftar di sini
                </Link>
              </p>
            </form>

            {/* Info Demo Account */}
            {/* <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-2 font-medium">Demo accounts:</p>
                <div className="text-xs text-slate-400 space-y-1">
                  <p>Admin: admin@trashware.id / password</p>
                  <p>Petugas: petugas@trashware.id / password</p>
                </div>
              </div> */}
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

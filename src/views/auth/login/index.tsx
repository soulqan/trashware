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
    <div className="relative flex min-h-screen items-start lg:items-center justify-center bg-[#f2f7f9] px-4 py-6 sm:px-6 sm:py-8 font-sans text-slate-800 overflow-hidden">
      {/* Container Utama */}
      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-24">
        {/* Kolom Kiri */}
        <div className="flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <Image src="/img/logotrashware1.png" alt="Trashware Logo" width={72} height={72} className="object-contain w-14 h-14 md:w-20 md:h-20" />

            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Trashware</h1>

              <p className="text-slate-500 text-sm font-medium">Monitoring System</p>
            </div>
          </div>

          {/* Hidden di mobile */}
          <div className="hidden md:block">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">Smart Waste Management</h2>

            <p className="text-slate-600 text-lg leading-relaxed mb-10 max-w-md">Sistem pemantauan tempat sampah berbasis IoT untuk kampus yang lebih bersih dan berkelanjutan</p>

            {/* Kartu fitur */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-white px-6 py-5 rounded-2xl shadow-sm border border-slate-100 flex-1">
                <h3 className="text-[#249357] text-3xl font-bold mb-1">24/7</h3>

                <p className="text-slate-500 text-sm font-medium">Real-time Monitoring</p>
              </div>

              <div className="bg-white px-6 py-5 rounded-2xl shadow-sm border border-slate-100 flex-1">
                <h3 className="text-[#249357] text-3xl font-bold mb-1">IoT</h3>

                <p className="text-slate-500 text-sm font-medium">Smart Integration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="mx-auto w-full max-w-md lg:ml-auto">
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[1.8rem] shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-white/60 backdrop-blur">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Login</h2>

              <p className="text-slate-500 text-sm">Masuk ke sistem monitoring Trashware</p>
            </div>

            <form className="space-y-4 md:space-y-5" onSubmit={handleLogin}>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@trashware.id"
                  className="w-full bg-[#f8fafc] border-transparent focus:bg-white focus:border-[#249357] focus:ring-2 focus:ring-[#249357]/20 rounded-xl px-4 py-3 text-base md:text-sm transition-all outline-none text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f8fafc] border-transparent focus:bg-white focus:border-[#249357] focus:ring-2 focus:ring-[#249357]/20 rounded-xl px-4 py-3 text-base md:text-sm transition-all outline-none text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Button */}
              <button type="submit" className="w-full bg-[#249357] hover:bg-[#1b6e42] text-white font-medium py-3 rounded-xl transition-colors mt-2">
                Masuk
              </button>

              {/* Divider */}
              <div className="flex items-center my-5">
                <div className="flex-1 h-px bg-slate-200"></div>

                <span className="px-3 text-xs text-slate-400">atau</span>

                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* Google */}
              <button type="button" onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 py-3 rounded-xl transition">
                <FcGoogle className="text-xl" />

                <span className="text-sm font-medium text-slate-700">Masuk dengan Google</span>
              </button>

              {/* Register */}
              <p className="text-sm text-center text-slate-500 mt-4">
                Belum punya akun?{" "}
                <Link href="/auth/register" className="text-[#249357] hover:underline font-medium">
                  Daftar di sini
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="hidden md:block absolute bottom-6 left-6">
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded text-[11px] text-slate-400 border border-slate-100">Do not sell or share my personal info</div>
      </div>
    </div>
  );
}

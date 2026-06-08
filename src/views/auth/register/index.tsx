import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, fullName }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Register berhasil!");
      router.push("/auth/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-start lg:items-center justify-center bg-[#f2f7f9] px-4 py-6 sm:p-6 font-sans text-slate-800 overflow-hidden">
      <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-24">
        {/* KIRI (SAMA PERSIS LOGIN) */}
        <div className="flex flex-col">
          {/* Logo tetap tampil */}
          <div className="flex items-center gap-3 mb-0 md:mb-6 ">
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
        {/* KANAN (FORM REGISTER) */}
        <div className="mx-auto w-full max-w-md lg:ml-auto">
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[1.8rem] shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-white/60 backdrop-blur">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Register</h2>
              <p className="text-slate-500 text-sm">Daftar akun baru</p>
            </div>

            <form className="space-y-4 md:space-y-5" onSubmit={handleRegister}>
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full bg-[#f8fafc] border-transparent focus:bg-white focus:border-[#249357] focus:ring-2 focus:ring-[#1b6e42]/20 rounded-xl px-4 py-3 text-sm transition-all outline-none text-slate-700 placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Email */}
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

              {/* Password */}
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

              {/* Button */}
              <button type="submit" className="w-full bg-[#249357] hover:bg-[#16a34a] text-white font-medium py-3 rounded-xl transition-colors">
                Register
              </button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="px-3 text-xs text-slate-400">atau</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              {/* Google Login */}
              <button type="button" onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 py-3 rounded-xl transition">
                <FcGoogle className="text-xl" />
                <span className="text-sm font-medium text-slate-700">Daftar dengan Google</span>
              </button>

              {/* Link ke Login */}
              <p className="text-sm text-center text-slate-500 mt-5">
                Sudah punya akun?{" "}
                <Link href="/auth/login" className="text-[#249357] hover:underline font-medium">
                  Masuk
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

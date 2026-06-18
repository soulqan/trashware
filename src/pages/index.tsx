import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  FiArrowRight,
  FiCpu,
  FiActivity,
  FiBell,
  FiTrendingUp,
  FiGithub,
  FiGrid,
  FiSun,
  FiMoon,
  FiServer,
  FiDatabase,
  FiLayers,
  FiGlobe,
  FiZap,
  FiShield,
  FiLayout
} from "react-icons/fi";

export default function LandingPage() {
  const { data: session, status } = useSession();

  // Theme Toggle State - Default to Light Mode (false)
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Interactive Simulator State
  const [simLevel, setSimLevel] = useState(65);
  const [simStatus, setSimStatus] = useState("on");

  // Dynamic status check based on simulated level and status
  const getSimColor = (level: number, status: string) => {
    if (status !== "on") {
      return isDarkMode
        ? "bg-slate-900 border-slate-800 text-slate-500"
        : "bg-slate-100 border-slate-200 text-slate-500";
    }
    if (level >= 90) {
      return isDarkMode
        ? "bg-red-500/10 border-red-500/30 text-red-400"
        : "bg-red-50 border-red-200 text-red-650";
    }
    if (level >= 70) {
      return isDarkMode
        ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
        : "bg-orange-50 border-orange-200 text-orange-650";
    }
    if (level > 0) {
      return isDarkMode
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        : "bg-emerald-50 border-emerald-250 text-emerald-700";
    }
    return isDarkMode
      ? "bg-slate-900 border-slate-800 text-slate-550"
      : "bg-slate-100 border-slate-200 text-slate-500";
  };

  const getSimLabel = (level: number, status: string) => {
    if (status !== "on") return "Offline";
    if (level >= 90) return "Penuh";
    if (level >= 70) return "Hampir Penuh";
    if (level > 0) return "Terisi";
    return "Kosong";
  };

  const handleSimIncrement = () => {
    setSimLevel((prev) => Math.min(prev + 15, 100));
  };

  const handleSimDecrement = () => {
    setSimLevel((prev) => Math.max(prev - 15, 0));
  };

  const toggleSimStatus = () => {
    setSimStatus((prev) => (prev === "on" ? "off" : "on"));
  };

  return (
    <div className={`relative min-h-screen font-sans overflow-x-hidden transition-colors duration-500 ${isDarkMode
      ? "bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-900"
      : "bg-slate-50 text-slate-800 selection:bg-emerald-100 selection:text-emerald-900"
      }`}>
      {/* Decorative Background Glowing Orbs */}
      {isDarkMode ? (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
          <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-0 left-[5%] w-[700px] h-[700px] rounded-full bg-emerald-600/5 blur-[150px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-400/5 blur-[120px] pointer-events-none" />
          <div className="absolute top-[25%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-400/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-[5%] w-[700px] h-[700px] rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" />
        </>
      )}

      {/* Sticky Glassmorphic Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ${isDarkMode
        ? "border-slate-900 bg-slate-950/80 text-slate-100"
        : "border-slate-200/80 bg-white/80 text-slate-800"
        } backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">

          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className={`relative w-10 h-10 overflow-hidden rounded-xl flex items-center justify-center border transition-colors bg-white border-slate-200 shadow-sm
              }`}>
              <Image
                src="/img/logotrashware1.png"
                alt="Trashware Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#30BD75]">TrashWare</span>
              <p className="text-[9px] font-bold text-[#30BD75] uppercase tracking-widest leading-none mt-0.5">IoT Operations</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}>
            <a href="#features" className="hover:text-emerald-500 transition-colors">Fitur</a>
            <a href="#simulator" className="hover:text-emerald-500 transition-colors">Simulasi</a>
            <a href="#tech" className="hover:text-emerald-500 transition-colors">Tech Stack</a>
          </nav>

          {/* User & Theme controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode
                ? "bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm"
                }`}
              title={isDarkMode ? "Mode Terang" : "Mode Gelap"}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {status === "loading" ? (
              <div className={`h-10 w-24 rounded-xl animate-pulse border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
                }`} />
            ) : session ? (
              <Link href="/dashboard">
                <div className="group flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 sm:px-5 sm:py-2.5 text-sm font-semibold text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/20 cursor-pointer">
                  <FiGrid size={16} />
                  <span>Dashboard</span>
                  <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ) : (
              <>
                {/* Desktop Buttons */}
                <div className="hidden sm:flex items-center gap-3">
                  <Link href="/auth/login">
                    <span className={`text-sm font-semibold cursor-pointer transition-colors ${isDarkMode ? "text-slate-300 hover:text-white" : "text-slate-600 hover:text-slate-900"
                      } px-2.5 py-2`}>
                      Masuk
                    </span>
                  </Link>
                  <Link href="/auth/register">
                    <span className={`flex items-center gap-1 border text-sm font-semibold px-4 py-2 rounded-xl cursor-pointer transition-all ${isDarkMode
                      ? "bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-200 hover:border-slate-700"
                      : "bg-white border-slate-250 hover:bg-slate-50 text-slate-700 hover:border-slate-350 shadow-sm"
                      }`}>
                      Daftar
                    </span>
                  </Link>
                </div>

                {/* Mobile Button - Combined into 1 button */}
                <Link href="/auth/login" className="sm:hidden">
                  <div className="rounded-xl bg-[#30BD75] px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-md shadow-[#30BD75]/10 cursor-pointer">
                    Masuk
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold transition-colors ${isDarkMode
              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
              }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Sistem Pemantauan Tempat Sampah Pintar IoT
            </div>

            <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight transition-colors ${isDarkMode ? "text-white" : "text-slate-900"
              }`}>
              Kelola Sampah dengan <br className="hidden sm:inline" />
              <span className="tracking-tight text-[#30BD75]">
                Data IoT Real-Time
              </span>
            </h1>

            <p className={`text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}>
              Pantau volume sampah di setiap gedung secara real-time. Minimalkan sampah meluap, optimalkan rute armada kebersihan, dan jaga lingkungan kampus tetap bersih dan asri.
            </p>

            <div className="flex flex-row items-center justify-center lg:justify-start gap-3">
              {session ? (
                <Link href="/dashboard">
                  <div className="text-center rounded-xl bg-[#30BD75] px-5 py-3.5 text-xs sm:text-sm text-slate-950 font-bold tracking-wide transition-all shadow-md shadow-[#30BD75]/10 hover:scale-105 active:scale-95 cursor-pointer">
                    Masuk ke Dashboard
                  </div>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <div className="text-center rounded-xl bg-[#30BD75] px-5 py-3.5 text-xs sm:text-sm text-slate-950 font-bold tracking-wide transition-all shadow-md shadow-[#30BD75]/10 hover:scale-105 active:scale-95 cursor-pointer">
                      Mulai Sekarang
                    </div>
                  </Link>
                  <a href="#simulator" className={`text-center rounded-xl border px-5 py-3.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${isDarkMode
                    ? "bg-slate-900/60 hover:bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-350 shadow-sm"
                    }`}>
                    Coba Simulator
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Hero Right Content - Dashboard Mockup Image with Premium Browser Frame (Hidden on Mobile) */}
          <div className="hidden lg:block lg:col-span-5 relative w-full">
            {/* Glowing Backdrop Aura */}
            <div className="absolute -inset-1.5 rounded-[1.8rem] bg-gradient-to-tr from-emerald-500 to-teal-500 opacity-20 blur-2xl pointer-events-none" />

            {/* Browser Mockup Container */}
            <div className={`relative border rounded-[1.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_25px_60px_rgba(16,185,129,0.1)] ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/80"
              }`}>
              {/* Browser Header Bar */}
              <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                {/* Mac Dots */}
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/90" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/90" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/90" />
                </div>
                {/* Simulated URL bar */}
                <div className={`w-3/5 text-[9px] font-medium tracking-tight text-center px-4 py-0.5 rounded transition-colors ${isDarkMode ? "bg-slate-900/80 text-slate-500" : "bg-white text-slate-500 border border-slate-200/60"
                  }`}>
                  trashware.id/dashboard
                </div>
                {/* Spacer */}
                <div className="w-8" />
              </div>

              {/* Dashboard Screenshot Image Container (Self-adapting without crop) */}
              <div className="w-full bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
                <Image
                  src="/img/dashboard.png"
                  alt="Trashware Live Dashboard"
                  width={1200}
                  height={750}
                  priority
                  className="w-full h-auto block object-contain object-top"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`border-y py-12 sm:py-24 relative transition-colors duration-500 ${isDarkMode ? "bg-slate-955 border-slate-900" : "bg-slate-100/40 border-slate-200"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-8 sm:mb-16">
            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-widest">Didesain untuk Efisiensi</span>
            <h2 className={`text-2xl sm:text-4xl font-extrabold transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Unggul dalam Operasional & Manajemen
            </h2>
            <p className={`text-sm sm:text-base transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-605"}`}>
              Serangkaian fitur terintegrasi yang dirancang untuk mempercepat koordinasi pengambilan sampah dan menjaga kebersihan lingkungan tanpa beban administrasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Card 1 */}
            <div className={`border p-6 rounded-2xl transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-lg ${isDarkMode
              ? "bg-slate-900/40 border-slate-900 hover:border-emerald-500/30 text-white"
              : "bg-white border-slate-200/80 hover:border-emerald-500/30 shadow-soft text-slate-800"
              }`}>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-emerald-500 mb-5 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                <FiCpu size={22} />
              </div>
              <h3 className={`text-base font-bold mb-2 transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}>Syncing Telemetri</h3>
              <p className={`text-xs leading-relaxed transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Menghubungkan sensor ultrasonik IoT langsung ke Firestore dengan langganan database real-time untuk pembaruan data instan.
              </p>
            </div>

            {/* Card 2 */}
            <div className={`border p-6 rounded-2xl transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-lg ${isDarkMode
              ? "bg-slate-900/40 border-slate-900 hover:border-emerald-500/30 text-white"
              : "bg-white border-slate-200/80 hover:border-emerald-500/30 shadow-soft text-slate-800"
              }`}>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-emerald-500 mb-5 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 ${isDarkMode ? "bg-slate-955 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                <FiActivity size={22} />
              </div>
              <h3 className={`text-base font-bold mb-2 transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}>Urutan Prioritas</h3>
              <p className={`text-xs leading-relaxed transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Menghitung prioritas pengambilan berdasarkan durasi tingkat pengisian sampah agar lokasi yang paling kritis dibersihkan terlebih dahulu.
              </p>
            </div>

            {/* Card 3 */}
            <div className={`border p-6 rounded-2xl transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-lg ${isDarkMode
              ? "bg-slate-900/40 border-slate-900 hover:border-emerald-500/30 text-white"
              : "bg-white border-slate-200/80 hover:border-emerald-500/30 shadow-soft text-slate-800"
              }`}>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-emerald-500 mb-5 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                <FiBell size={22} />
              </div>
              <h3 className={`text-base font-bold mb-2 transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}>Notifikasi Otomatis</h3>
              <p className={`text-xs leading-relaxed transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Mendeteksi kondisi penuh secara langsung untuk menghasilkan notifikasi on-the-fly dengan penanda unread yang efisien di Firestore.
              </p>
            </div>

            {/* Card 4 */}
            <div className={`border p-6 rounded-2xl transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-lg ${isDarkMode
              ? "bg-slate-900/40 border-slate-900 hover:border-emerald-500/30 text-white"
              : "bg-white border-slate-200/80 hover:border-emerald-500/30 shadow-soft text-slate-800"
              }`}>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-emerald-500 mb-5 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                }`}>
                <FiTrendingUp size={22} />
              </div>
              <h3 className={`text-base font-bold mb-2 transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}>Histori</h3>
              <p className={`text-xs leading-relaxed transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Merekam histori telemetri secara berkala untuk analisis performa jangka panjang dan pelaporan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator Section */}
      <section id="simulator" className="py-12 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`border rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-12 lg:p-16 relative overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-slate-900/30 border-slate-900" : "bg-white border-slate-200 shadow-xl shadow-slate-100/30"
          }`}>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-semibold text-emerald-500 uppercase tracking-widest">Coba Platform Kami</span>
              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Coba Simulator Sensor Secara Langsung
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                Perangkat IoT mengirimkan telemetri secara berkelanjutan. Pada panel simulator di sebelah kanan, Anda dapat menyimulasikan tempat sampah pintar fisik. Coba naikkan level isi hingga 90% atau lebih dan lihat perubahan status operasional.
              </p>

              <ul className={`space-y-3.5 text-sm transition-colors ${isDarkMode ? "text-slate-350" : "text-slate-700"}`}>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Kontrol penyesuaian level isi secara interaktif</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Perubahan status real-time (Online / Offline)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Notifikasi otomatis saat kapasitas penuh</span>
                </li>
              </ul>

              <div className="pt-4">
                {session ? (
                  <Link href="/dashboard">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3 font-bold text-slate-950 transition-all cursor-pointer hover:scale-[1.03] active:scale-97">
                      <span>Buka Dashboard</span>
                      <FiArrowRight size={16} />
                    </span>
                  </Link>
                ) : (
                  <Link href="/auth/login">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3 font-bold text-slate-950 transition-all cursor-pointer hover:scale-[1.03] active:scale-97">
                      <span>Masuk untuk Akses Dashboard</span>
                      <FiArrowRight size={16} />
                    </span>
                  </Link>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              {/* Simulator Card duplicating the interactive preview for full attention */}
              <div className={`w-full max-w-sm border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl relative transition-all duration-300 hover:shadow-2xl ${isDarkMode ? "bg-slate-955 border-slate-850" : "bg-slate-50 border-slate-200/80 shadow-inner"
                }`}>
                <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
                  <h3 className={`text-xs sm:text-sm font-bold flex items-center gap-2 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                    <FiCpu className="text-emerald-500 shrink-0" />
                    <span>Panel Simulator TR-ENG-04</span>
                  </h3>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Aktif</span>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Slider control */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span className={isDarkMode ? "text-slate-400" : "text-slate-655"}>Level Isi Sampah:</span>
                      <span className={`text-sm font-bold ${simLevel >= 90 ? "text-red-500" : "text-emerald-500"}`}>
                        {simLevel}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={simLevel}
                      onChange={(e) => setSimLevel(Number(e.target.value))}
                      disabled={simStatus === "off"}
                      className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  {/* Live Display Visualizer */}
                  <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border transition-colors ${isDarkMode ? "bg-slate-900/60 border-slate-850" : "bg-white border-slate-200"
                    }`}>
                    <div className={`relative w-12 h-20 border rounded-b-xl rounded-t flex flex-col justify-end overflow-hidden shrink-0 ${isDarkMode ? "bg-slate-850 border-slate-750" : "bg-slate-100 border-slate-200"
                      }`}>
                      <div
                        className={`w-full transition-all duration-550 ${simLevel >= 90
                          ? "bg-red-500"
                          : simLevel >= 70
                            ? "bg-orange-500"
                            : "bg-emerald-500"
                          }`}
                        style={{ height: `${simStatus === "on" ? simLevel : 0}%` }}
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-1.5 w-full">
                      <p className={`text-xs ${isDarkMode ? "text-slate-450" : "text-slate-600"}`}>
                        Kategori Status: <span className={`font-bold ${isDarkMode ? "text-slate-200" : "text-slate-855"}`}>{getSimLabel(simLevel, simStatus)}</span>
                      </p>
                      <p className={`text-xs ${isDarkMode ? "text-slate-455" : "text-slate-600"}`}>
                        Status Operasional: <span className={`font-semibold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{simStatus === "on" ? "Online" : "Offline"}</span>
                      </p>

                      <button
                        onClick={toggleSimStatus}
                        className={`w-full sm:w-auto text-[10px] font-bold px-3 py-1.5 rounded-md transition-all duration-300 cursor-pointer ${simStatus === "on"
                          ? isDarkMode ? "bg-slate-850 hover:bg-slate-800 text-rose-450" : "bg-slate-200 hover:bg-slate-250 text-red-650"
                          : isDarkMode
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-emerald-100 text-emerald-700 border border-emerald-250 hover:bg-emerald-150"
                          }`}
                      >
                        {simStatus === "on" ? "Matikan Perangkat" : "Aktifkan Perangkat"}
                      </button>
                    </div>
                  </div>

                  {/* Trigger alert output */}
                  {simLevel >= 90 && simStatus === "on" ? (
                    <div className={`border px-3.5 py-2.5 rounded-xl flex items-start gap-3 transition-colors ${isDarkMode ? "bg-red-955/20 border-red-500/20" : "bg-red-50 border-red-200"
                      }`}>
                      <div className="text-red-550 pt-0.5">
                        <FiBell className="animate-swing" />
                      </div>
                      <div className="text-left text-xs">
                        <p className={`font-bold ${isDarkMode ? "text-red-400" : "text-red-700"}`}>Notifikasi Simulasi Terkirim</p>
                        <p className={`mt-0.5 leading-tight ${isDarkMode ? "text-slate-550" : "text-red-600"}`}>Telemetri perangkat memicu permintaan pengambilan otomatis pada dashboard utama.</p>
                      </div>
                    </div>
                  ) : (
                    <div className={`border px-3.5 py-2.5 rounded-xl flex items-start gap-3 transition-colors ${isDarkMode ? "bg-slate-900/30 border-slate-855/50 text-slate-500" : "bg-white border-slate-200 text-slate-500"
                      }`}>
                      <div className="text-slate-500 pt-0.5">
                        <FiCpu />
                      </div>
                      <p className="text-left text-xs leading-tight">
                        Level sampah normal. Status operasional dalam batas aman. Pengambilan belum diperlukan.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className={`border-t transition-colors duration-300 py-12 sm:py-24 ${isDarkMode ? "border-slate-900 bg-slate-950" : "border-slate-200 bg-slate-50/50"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-semibold text-emerald-500 uppercase tracking-widest">Infrastruktur Modern</span>
          <h2 className={`text-2xl sm:text-3xl font-extrabold mt-2 mb-8 sm:mb-16 transition-colors ${isDarkMode ? "text-white" : "text-slate-900"}`}>
            Teknologi & Ekosistem Terintegrasi
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Next.js Card */}
            <div className={`border p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isDarkMode ? "bg-slate-900/20 border-slate-900/80 text-slate-200" : "bg-white border-slate-200/80 shadow-soft text-slate-800"
              }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left sm:justify-center">
                <FiGlobe className="text-[#30BD75] shrink-0 text-xl sm:text-base" />
                <h3 className={`text-sm sm:text-base font-bold ${isDarkMode ? "text-slate-200" : "text-slate-850"}`}>
                  Next.js
                </h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-2 text-left sm:text-center">Server-Side Rendering & Pages Routing framework.</p>
            </div>

            {/* Firebase Card */}
            <div className={`border p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isDarkMode ? "bg-slate-900/20 border-slate-900/80 text-slate-200" : "bg-white border-slate-200/80 shadow-soft text-slate-800"
              }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left sm:justify-center">
                <FiZap className="text-[#30BD75] shrink-0 text-xl sm:text-base" />
                <h3 className={`text-sm sm:text-base font-bold ${isDarkMode ? "text-slate-200" : "text-slate-850"}`}>
                  Firebase
                </h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-2 text-left sm:text-center">Firestore Real-time Subscriptions database telemetry.</p>
            </div>

            {/* NextAuth.js Card */}
            <div className={`border p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isDarkMode ? "bg-slate-900/20 border-slate-900/80 text-slate-200" : "bg-white border-slate-200/80 shadow-soft text-slate-800"
              }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left sm:justify-center">
                <FiShield className="text-[#30BD75] shrink-0 text-xl sm:text-base" />
                <h3 className={`text-sm sm:text-base font-bold ${isDarkMode ? "text-slate-200" : "text-slate-850"}`}>
                  NextAuth.js
                </h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-2 text-left sm:text-center">Otentikasi & otorisasi berbasis token JWT dan Role.</p>
            </div>

            {/* Tailwind CSS Card */}
            <div className={`border p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isDarkMode ? "bg-slate-900/20 border-slate-900/80 text-slate-200" : "bg-white border-slate-200/80 shadow-soft text-slate-800"
              }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left sm:justify-center">
                <FiLayout className="text-[#30BD75] shrink-0 text-xl sm:text-base" />
                <h3 className={`text-sm sm:text-base font-bold ${isDarkMode ? "text-slate-200" : "text-slate-855"}`}>
                  Tailwind CSS
                </h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-2 text-left sm:text-center">Pengembangan styling responsif berbasis utility-first.</p>
            </div>

            {/* ESP32 Card */}
            <div className={`border p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isDarkMode ? "bg-slate-900/20 border-slate-900/80 text-slate-200" : "bg-white border-slate-200/80 shadow-soft text-slate-800"
              }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left sm:justify-center">
                <FiCpu className="text-[#30BD75] shrink-0 text-xl sm:text-base" />
                <h3 className={`text-sm sm:text-base font-bold ${isDarkMode ? "text-slate-200" : "text-slate-850"}`}>
                  ESP32 Node MCU
                </h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-2 text-left sm:text-center">Mikrokontroler klien pengirim data telemetri sensor ultrasonik.</p>
            </div>

            {/* GCP Card */}
            <div className={`border p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isDarkMode ? "bg-slate-900/20 border-slate-900/80 text-slate-200" : "bg-white border-slate-200/80 shadow-soft text-slate-800"
              }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left sm:justify-center">
                <FiServer className="text-[#30BD75] shrink-0 text-xl sm:text-base" />
                <h3 className={`text-sm sm:text-base font-bold ${isDarkMode ? "text-slate-200" : "text-slate-850"}`}>
                  Google Cloud (GCP)
                </h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-2 text-left sm:text-center">Penyimpanan Firestore DB, Hosting, dan Cloud Functions backend.</p>
            </div>

            {/* Hadoop Card */}
            <div className={`border p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isDarkMode ? "bg-slate-900/20 border-slate-900/80 text-slate-200" : "bg-white border-slate-200/80 shadow-soft text-slate-800"
              }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left sm:justify-center">
                <FiDatabase className="text-[#30BD75] shrink-0 text-xl sm:text-base" />
                <h3 className={`text-sm sm:text-base font-bold ${isDarkMode ? "text-slate-200" : "text-slate-850"}`}>
                  Apache Hadoop
                </h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-2 text-left sm:text-center">Pemrosesan batch data besar historis tempat sampah offline.</p>
            </div>

            {/* React Card */}
            <div className={`border p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isDarkMode ? "bg-slate-900/20 border-slate-900/80 text-slate-200" : "bg-white border-slate-200/80 shadow-soft text-slate-800"
              }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left sm:justify-center">
                <FiLayers className="text-[#30BD75] shrink-0 text-xl sm:text-base" />
                <h3 className={`text-sm sm:text-base font-bold ${isDarkMode ? "text-slate-200" : "text-slate-850"}`}>
                  React.js
                </h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-2 text-left sm:text-center">Pustaka UI deklaratif responsif berbasis komponen web reusable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t transition-colors duration-300 py-16 ${isDarkMode ? "border-slate-700 bg-slate-950 text-slate-400" : "border-slate-200 bg-white text-slate-650"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-slate-900/10 dark:border-slate-850/50">
             {/* Brand Column */}
             <div className="md:col-span-5 space-y-4">
               <div className="flex items-center gap-3">
                 <div className="relative w-10 h-10 overflow-hidden rounded-xl flex items-center justify-center border bg-white border-slate-200 shadow-sm">
                   <Image
                     src="/img/logotrashware1.png"
                     alt="Trashware Logo"
                     width={30}
                     height={30}
                     className="object-contain"
                   />
                 </div>
                 <span className={`text-xl font-bold transition-colors tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"
                   }`}>
                   TrashWare
                 </span>
               </div>
              <p className={`text-xs leading-relaxed max-w-xs ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                Sistem pemantauan tempat sampah pintar berbasis IoT untuk mendukung kebersihan, keberlanjutan, dan efisiensi operasional kampus secara real-time.
              </p>
              <div className="flex items-center gap-3.5 pt-2">
                <a
                  href="https://github.com/soulqan/trashware"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors p-2 rounded-lg border ${isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400"
                    : "bg-slate-50 border-slate-200 text-slate-655 hover:text-emerald-600 shadow-sm"
                    }`}
                  aria-label="GitHub Repository"
                >
                  <FiGithub size={18} />
                </a>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-2 space-y-4">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-900"}`}>Navigasi</h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <a href="#features" className={`hover:text-emerald-500 transition-colors ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                    Fitur Utama
                  </a>
                </li>
                <li>
                  <a href="#simulator" className={`hover:text-emerald-500 transition-colors ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                    Simulator Sensor
                  </a>
                </li>
                <li>
                  <a href="#tech" className={`hover:text-emerald-500 transition-colors ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                    Tech Stack
                  </a>
                </li>
              </ul>
            </div>

            {/* Platform Column */}
            <div className="md:col-span-2 space-y-4">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-900"}`}>Akses</h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/auth/login">
                    <span className={`hover:text-emerald-500 transition-colors cursor-pointer ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                      Masuk Aplikasi
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register">
                    <span className={`hover:text-emerald-500 transition-colors cursor-pointer ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>
                      Daftar Akun Baru
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Status Sistem Column */}
            <div className="md:col-span-3 space-y-4">
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-300" : "text-slate-900"}`}>Status Sistem</h4>
              <ul className="space-y-2.5 text-xs">
                <li className="flex items-center justify-between">
                  <span className={isDarkMode ? "text-slate-500" : "text-slate-500"}>Database Firestore:</span>
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className={isDarkMode ? "text-slate-500" : "text-slate-500"}>IoT Gateway (ESP32):</span>
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Aktif
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className={isDarkMode ? "text-slate-500" : "text-slate-500"}>API Service:</span>
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Normal
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[11px] text-slate-500">
            <p>&copy; {new Date().getFullYear()} TrashWare IoT Operations. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

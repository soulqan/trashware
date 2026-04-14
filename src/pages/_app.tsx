import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Jika di halaman login, jangan tampilkan Sidebar & Navbar
  const isLoginPage = router.pathname === "/login";

  if (isLoginPage) {
    return <Component {...pageProps} />;
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="px-8 py-8 flex-1">
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  );
}
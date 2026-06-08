import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { SearchProvider } from "@/context/SearchContext";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const disableLayout = ["/auth/login", "/auth/register"];
  const isDisable = disableLayout.includes(router.pathname);

  return (
    <SessionProvider session={pageProps.session}>
      <SearchProvider>
        {isDisable ? (
          // tanpa layout (login/register)
          <Component {...pageProps} />
        ) : (
          // pakai layout responsif
          <div className="flex min-h-screen overflow-x-hidden bg-slate-50 text-gray-900">
            <Sidebar isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
            {isMobileNavOpen && (
              <button
                aria-label="Tutup menu"
                onClick={() => setIsMobileNavOpen(false)}
                className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
              />
            )}
            <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
              <Navbar onMenuClick={() => setIsMobileNavOpen(true)} />
              <main className="min-w-0 px-2 pb-3 sm:px-5 sm:pb-6 lg:px-8 lg:pb-8">
                <Component {...pageProps} />
              </main>
            </div>
          </div>
        )}
      </SearchProvider>
    </SessionProvider>
  );
}

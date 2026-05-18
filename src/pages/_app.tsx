import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { SearchProvider } from "@/context/SearchContext";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const disableLayout = ["/auth/login", "/auth/register"];
  const isDisable = disableLayout.includes(router.pathname);

  return (
    <SessionProvider session={pageProps.session}>
      <SearchProvider>
        {isDisable ? (
          // tanpa layout (login/register)
          <Component {...pageProps} />
        ) : (
          // pakai layout
          <div className="flex min-h-screen bg-white text-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="px-8 pb-8">
                <Component {...pageProps} />
              </main>
            </div>
          </div>
        )}
      </SearchProvider>
    </SessionProvider>
  );
}

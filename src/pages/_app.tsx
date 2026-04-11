import "@/styles/globals.css"; // Pastikan path CSS benar
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
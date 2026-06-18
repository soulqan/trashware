import DashboardView from "@/views/dashboard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-emerald-500 font-bold animate-pulse text-2xl">Loading Session...</div>
    </div>
  );

  return <DashboardView />;
}

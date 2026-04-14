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
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <div className="flex-1">
        <main className="p-8">
          <DashboardView />
        </main>
      </div>
    </div>
  );
}

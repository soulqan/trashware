import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProfileModal from "@/components/profile/ProfileModal";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", { 
        method: "GET",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const profileData = profile || session?.user;

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-6">
              {profileData?.image ? (
                <img src={profileData.image} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-3xl font-bold text-emerald-600">{(profileData?.name || "").split(" ").map((n:string)=>n[0]).slice(0,2).join("")}</div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{profileData?.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{profileData?.email}</p>
                {profileData?.phone && <p className="text-sm text-gray-500">Telepon: {profileData.phone}</p>}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => setOpen(true)} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors">
                Edit Profile
              </button>
              <button onClick={() => setPasswordOpen(true)} className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
                Ganti Password
              </button>
            </div>
          </>
        )}
      </div>

      <ProfileModal open={open} onClose={() => setOpen(false)} onSave={fetchProfile} />
      <ChangePasswordModal open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </div>
  );
}

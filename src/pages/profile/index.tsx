'use client';

import { useState, useEffect, useCallback } from "react"; 
import { useSession } from "next-auth/react";
import ProfileModal from "@/components/profile/ProfileModal";
import ChangePasswordModal from "@/components/profile/ChangePasswordModal";
import Image from "next/image"; 

type ProfileShape = {
  name?: string;
  email?: string;
  image?: string | null;
  phone?: string | null;
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileShape | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
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
  }, []); 

  useEffect(() => {
    if (session?.user?.email) {
      fetchProfile();
    }
  }, [session, fetchProfile]); 

  const profileData = (profile || session?.user) as ProfileShape | undefined;

  return (
    <div className="p-3 sm:p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              {profileData?.image ? (
                <Image 
                  src={profileData.image} 
                  alt="avatar" 
                  width={96} 
                  height={96} 
                  className="w-20 h-20 rounded-full object-cover sm:h-24 sm:w-24"
                  priority 
                  unoptimized={profileData.image.startsWith('data:')} 
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-600 sm:h-24 sm:w-24 sm:text-3xl">
                  {(profileData?.name || "")
                    .split(" ")
                    .filter(Boolean) 
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()} 
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">{profileData?.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 sm:text-sm">{profileData?.email}</p>
                {profileData?.phone && <p className="text-xs text-gray-500 sm:text-sm mt-1">Telepon: {profileData.phone}</p>}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:gap-3">
              <button onClick={() => setOpen(true)} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 sm:px-6 sm:py-3 sm:text-sm">
                Edit Profile
              </button>
              <button onClick={() => setPasswordOpen(true)} className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:px-6 sm:py-3 sm:text-sm">
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
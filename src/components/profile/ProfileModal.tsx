import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
};

export default function ProfileModal({ open, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) fetchProfile();
  }, [open]);

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
        const user = data.user;
        setName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      
      const data = await res.json();
      console.log("PUT response:", { status: res.status, data });
      
      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan");
      }
      
      // Wait for onSave callback to complete before closing
      await onSave?.();
      
      onClose();
    } catch (err) {
      console.error("Save error:", err);
      alert(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl sm:p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Profile</h2>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Nama</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
                <input value={email} readOnly className="w-full px-4 py-3 bg-gray-100 border border-gray-100 rounded-xl text-sm font-medium text-gray-600 cursor-not-allowed outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">No. Telepon</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button onClick={onClose} className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

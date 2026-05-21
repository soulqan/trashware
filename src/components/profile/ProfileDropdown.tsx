import { MouseEvent } from "react";

type Props = {
  onView: () => void;
  onEdit: () => void;
  onLogout: () => void;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function ProfileDropdown({ onView, onEdit, onLogout, name, email, image }: Props) {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg z-50 overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-600">{(name||"").split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
          )}
          <div className="min-w-0">
            <div className="font-semibold text-sm text-gray-800">{name}</div>
            <div className="text-xs text-gray-500 truncate">{email}</div>
          </div>
        </div>
      </div>

      <button onClick={onView} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
        View Profile
      </button>
      <button onClick={onEdit} className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
        Edit Profile
      </button>
      <button onClick={onLogout} className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">
        Logout
      </button>
    </div>
  );
}

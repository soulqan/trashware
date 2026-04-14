import { DerivedNotification } from '@/lib/services/deriveNotificationService';
import NotificationItem from './NotificationItem';

interface NotificationFilter {
  semua: number;
  baru: number;
  dibaca: number;
}

interface NotificationListProps {
  notifications: DerivedNotification[];
  filter: 'semua' | 'baru' | 'dibaca';
  counts: NotificationFilter;
  onFilterChange: (filter: 'semua' | 'baru' | 'dibaca') => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  loading: boolean;
}

export default function NotificationList({
  notifications,
  filter,
  counts,
  onFilterChange,
  onMarkAsRead,
  onMarkAllAsRead,
  loading,
}: NotificationListProps) {
  const filterOptions = [
    { label: 'Semua', value: 'semua' as const, count: counts.semua },
    { label: 'Baru', value: 'baru' as const, count: counts.baru },
    { label: 'Dibaca', value: 'dibaca' as const, count: counts.dibaca },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifikasi</h1>
          <p className="text-gray-500 text-sm mt-1" suppressHydrationWarning>
            {counts.baru} notifikasi belum dibaca
          </p>
        </div>
        <button
          onClick={onMarkAllAsRead}
          disabled={counts.baru === 0}
          className="px-4 py-2 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span>✓</span>
          Tandai Semua Dibaca
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 bg-gray-100 p-2 rounded-2xl w-fit">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition ${
              filter === option.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {option.label} (<span suppressHydrationWarning>{option.count}</span>)
          </button>
        ))}
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <p className="text-gray-500">Loading notifikasi...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <p className="text-gray-500">Tidak ada notifikasi</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
}

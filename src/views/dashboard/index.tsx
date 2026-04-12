// src/views/dashboard/index.tsx
import StatCard from '@/components/dashboard/StatCard';
import { FiTrash2, FiCheckCircle, FiAlertTriangle, FiXCircle, FiWifiOff } from 'react-icons/fi';

// Data Dummy untuk Tabel
const binData = [
  { id: 'BIN-001', location: 'Lobby Utama', building: 'Gedung A', capacity: 23, status: 'Empty', updated: '2 min ago' },
  { id: 'BIN-002', location: 'Kantin Lt.1', building: 'Gedung B', capacity: 67, status: 'Nearly Full', updated: '5 min ago' },
  { id: 'BIN-003', location: 'Koridor Lt.2', building: 'Gedung A', capacity: 95, status: 'Full', updated: '1 min ago' },
];

export default function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Real-time monitoring of campus waste management system</p>
        </div>
        <div className="flex items-center gap-2 text-green-500 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          System Online
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Total Active" value={10} trend="+2" iconBg="bg-green-100" textColor="text-green-600" icon={<FiTrash2 size={20}/>} />
        <StatCard title="Empty Bins" value={3} trend="+1" iconBg="bg-emerald-100" textColor="text-emerald-600" icon={<FiCheckCircle size={20}/>} />
        <StatCard title="Nearly Full" value={5} trend="+3" iconBg="bg-orange-100" textColor="text-orange-600" icon={<FiAlertTriangle size={20}/>} />
        <StatCard title="Full Bins" value={2} trend="+1" iconBg="bg-red-100" textColor="text-red-600" icon={<FiXCircle size={20}/>} />
        <StatCard title="Offline" value={2} trend="0" iconBg="bg-gray-100" textColor="text-gray-600" icon={<FiWifiOff size={20}/>} />
      </div>

      {/* Main Content: Chart & Alerts (Simplified for now) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-64">
          <p className="font-bold text-gray-700">Daily Fill Trend</p>
          <div className="flex items-center justify-center h-full text-gray-400">
            [Chart Area - Gunakan Recharts di sini nanti]
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between mb-4">
            <p className="font-bold text-gray-700">Recent Alerts</p>
            <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-md font-bold">4 ACTIVE</span>
          </div>
          {/* Simple Alert Item */}
          <div className="bg-red-50 p-3 rounded-xl border border-red-100 border-l-4 border-l-red-500">
            <p className="text-xs font-bold text-red-700">Bin Full - Auto Locked</p>
            <p className="text-[10px] text-red-600 mt-1">BIN-003 has reached 95% capacity...</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between">
            <p className="font-bold text-gray-700">Real-time Bin Status</p>
            <span className="text-xs text-green-500">Live data</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
            <tr>
              <th className="p-4 font-semibold">Bin ID</th>
              <th className="p-4 font-semibold">Location</th>
              <th className="p-4 font-semibold">Capacity</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {binData.map((bin) => (
              <tr key={bin.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-700">{bin.id}</td>
                <td className="p-4 text-gray-500">{bin.location}</td>
                <td className="p-4">
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${bin.capacity > 80 ? 'bg-red-500' : bin.capacity > 50 ? 'bg-orange-500' : 'bg-green-500'}`} 
                      style={{ width: `${bin.capacity}%` }}
                    ></div>
                  </div>
                </td>
                <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${bin.status === 'Full' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        ● {bin.status}
                    </span>
                </td>
                <td className="p-4 text-gray-400 text-xs">{bin.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
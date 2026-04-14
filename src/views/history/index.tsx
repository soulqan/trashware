import { useEffect, useMemo, useState } from 'react';
import { FiBarChart2, FiMapPin, FiList } from 'react-icons/fi';
import TrendChart from '@/components/history/TrendChart';
import { subscribeBinsToHistoryHourly, subscribeHistoryRecords, type HistoryRecord } from '@/lib/services/historyService';
import {
  FULL_THRESHOLD,
  LOCATION_OPTIONS,
  formatDateInput,
  getChartData,
  getChartPoints,
  getFilteredRecords,
  getPeakHour,
  getTopFullLocations,
  shortenId,
} from '@/lib/services/historyAnalyticsService';

export default function HistoryView() {
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('Semua Tempat Sampah');
  const [startDate, setStartDate] = useState(() => formatDateInput(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)));
  const [endDate, setEndDate] = useState(() => formatDateInput(new Date()));

  useEffect(() => {
    const unsubscribe = subscribeBinsToHistoryHourly();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeHistoryRecords(
      (data) => {
        setHistoryRecords(data);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore Error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredRecords = useMemo(
    () => getFilteredRecords(historyRecords, selectedLocation, startDate, endDate),
    [historyRecords, selectedLocation, startDate, endDate]
  );

  const chartData = useMemo(() => getChartData(filteredRecords, startDate, endDate), [filteredRecords, startDate, endDate]);
  const chartPoints = useMemo(() => getChartPoints(chartData), [chartData]);
  const latestRecord = filteredRecords.length > 0 ? filteredRecords[filteredRecords.length - 1] : null;
  const peakHour = useMemo(() => getPeakHour(filteredRecords), [filteredRecords]);
  const topFullLocations = useMemo(() => getTopFullLocations(filteredRecords), [filteredRecords]);

  if (loading) return <div className="py-8 text-center text-gray-500">Memuat log riwayat sampah...</div>;

  return (
    <div className="space-y-6 py-2">
      <h1 className="text-2xl font-bold text-gray-800">Analitik Bin</h1>

      <section className="flex flex-wrap gap-4">
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="min-w-[280px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-400"
        >
          {LOCATION_OPTIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent outline-none" />
          <span>sampai</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent outline-none" />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-gray-200 bg-white p-7">
          <div className="mb-8 flex items-center justify-between">
            <p className="font-semibold text-gray-700">Rata-rata Kapasitas</p>
            <FiBarChart2 className="text-emerald-500" size={28} />
          </div>
          <p className="text-5xl font-bold text-gray-900">{chartData.length > 0 ? chartData[chartData.length - 1].avg : 0}%</p>
          <p className="mt-2 text-sm text-gray-600">Berdasarkan data filter terakhir</p>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-7">
          <div className="mb-8 flex items-center justify-between">
            <p className="font-semibold text-gray-700">Total Aktivitas</p>
            <FiList className="text-blue-500" size={28} />
          </div>
          <p className="text-5xl font-bold text-gray-900">{filteredRecords.length}</p>
          <p className="mt-2 text-sm text-gray-600">Jumlah log yang tercatat</p>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-7">
          <div className="mb-8 flex items-center justify-between">
            <p className="font-semibold text-gray-700">Log Terbaru</p>
            <FiMapPin className="text-amber-500" size={28} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{latestRecord ? latestRecord.location : '-'}</p>
          <p className="mt-2 text-sm text-gray-600">{latestRecord ? `BIN: ${shortenId(latestRecord.binId)}` : 'BIN: -'}</p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-gray-200 bg-white p-7">
          <p className="font-semibold text-gray-700">Jam Sibuk</p>
          <p className="mt-3 text-3xl font-bold text-gray-900">{peakHour ? peakHour.label : '-'}</p>
          <p className="mt-2 text-sm text-gray-600">{peakHour ? `${peakHour.count} log pada jam ini` : 'Belum ada data log'}</p>
        </article>

        <article className="rounded-2xl border border-gray-200 bg-white p-7">
          <p className="font-semibold text-gray-700">Top Lokasi Sering Penuh</p>
          {topFullLocations.length > 0 ? (
            <div className="mt-4 space-y-3">
              {topFullLocations.map((item, index) => (
                <div key={item.location} className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
                  <p className="text-sm font-medium text-gray-800">
                    {index + 1}. {item.location}
                  </p>
                  <p className="text-sm font-bold text-amber-700">{item.count}x</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-600">Belum ada lokasi dengan kapasitas {FULL_THRESHOLD}% ke atas.</p>
          )}
        </article>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-7">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Tren Kapasitas Sampah</h2>
        <TrendChart chartData={chartData} chartPoints={chartPoints} />
      </section>

      <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-emerald-800">
        <h3 className="mb-2 text-lg font-bold">Tentang Dashboard Analitik</h3>
        <p className="text-sm leading-relaxed">
          Dashboard ini menampilkan analisis real-time pengisian sampah di seluruh lokasi. Gunakan filter <strong>lokasi</strong> dan <strong>tanggal</strong> untuk melihat metrik spesifik. 
          Pantau <strong>Jam Sibuk</strong> untuk mengetahui periode puncak pengumpulan, dan <strong>Top Lokasi Sering Penuh</strong> untuk prioritas pengangkutan. Grafik tren membantu merencanakan jadwal maintenance yang lebih efisien.
        </p>
      </section>
    </div>
  );
}

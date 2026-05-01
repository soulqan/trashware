import type { HistoryRecord } from './historyService';

export type ChartPoint = {
  key: string;
  label: string;
  avg: number;
};

export const LOCATION_OPTIONS = [
  'Semua Tempat Sampah',
  'Entrance Lobby - Gedung A',
  'Pantry - Gedung B Lantai 8',
  'Pantry Lantai 3 - Gedung C',
  'Kantin Politeknik - Gedung A Lantai 1',
  'Korridor - Gedung B Lantai 2',
  'Gedung B - Lantai 3',
  'Gedung B - Lantai 8',
];

export const FULL_THRESHOLD = 90;

export const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const shortenId = (id: string) => (id.length <= 12 ? id : `${id.slice(0, 6)}...${id.slice(-4)}`);

export const formatHourRange = (hour: number) => {
  const start = String(hour).padStart(2, '0');
  const end = String((hour + 1) % 24).padStart(2, '0');
  return `${start}:00-${end}:00`;
};

export const getFilteredRecords = (
  historyRecords: HistoryRecord[],
  selectedLocation: string,
  startDate: string,
  endDate: string
) => {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59`);
  const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const selectedNormalized = normalize(selectedLocation);

  return historyRecords.filter((record) => {
    const inDateRange = record.timestamp >= start && record.timestamp <= end;
    const isValidLocation = LOCATION_OPTIONS.some((loc) => normalize(record.location) === normalize(loc));

    const matchLocation =
      selectedLocation === 'Semua Tempat Sampah'
        ? isValidLocation
        : isValidLocation && normalize(record.location) === selectedNormalized;

    return inDateRange && matchLocation;
  });
};

export const getChartData = (filteredRecords: HistoryRecord[], startDate: string, endDate: string): ChartPoint[] => {
  const singleDayRange = startDate === endDate;
  const groupedMap = new Map<string, { total: number; count: number; sortKey: number; label: string }>();

  filteredRecords.forEach((record) => {
    const dateKey = formatDateInput(record.timestamp);
    const hour = String(record.timestamp.getHours()).padStart(2, '0');
    const key = singleDayRange ? `${dateKey} ${hour}:00` : dateKey;

    const sortKey = singleDayRange
      ? new Date(record.timestamp.getFullYear(), record.timestamp.getMonth(), record.timestamp.getDate(), record.timestamp.getHours(), 0, 0, 0).getTime()
      : new Date(record.timestamp.getFullYear(), record.timestamp.getMonth(), record.timestamp.getDate(), 0, 0, 0, 0).getTime();

    const label = singleDayRange
      ? `${hour}:00`
      : `${String(record.timestamp.getDate()).padStart(2, '0')}/${String(record.timestamp.getMonth() + 1).padStart(2, '0')}`;

    const existing = groupedMap.get(key);
    if (!existing) {
      groupedMap.set(key, { total: record.capacity, count: 1, sortKey, label });
    } else {
      groupedMap.set(key, {
        total: existing.total + record.capacity,
        count: existing.count + 1,
        sortKey: existing.sortKey,
        label: existing.label,
      });
    }
  });

  const groupedData = Array.from(groupedMap.entries())
    .sort(([, a], [, b]) => a.sortKey - b.sortKey)
    .map(([key, val]) => ({
      key,
      label: val.label,
      avg: Math.round(val.total / val.count),
    }));

  if (groupedData.length <= 1 && filteredRecords.length > 1) {
    const hourlyMap = new Map<string, { total: number; count: number; sortKey: number; label: string }>();

    filteredRecords.forEach((record) => {
      const hh = String(record.timestamp.getHours()).padStart(2, '0');
      const dayKey = formatDateInput(record.timestamp);
      const key = `${dayKey} ${hh}:00`;
      const sortKey = new Date(
        record.timestamp.getFullYear(),
        record.timestamp.getMonth(),
        record.timestamp.getDate(),
        record.timestamp.getHours(),
        0,
        0,
        0
      ).getTime();

      const existing = hourlyMap.get(key);
      if (!existing) {
        hourlyMap.set(key, { total: record.capacity, count: 1, sortKey, label: `${hh}:00` });
      } else {
        hourlyMap.set(key, {
          total: existing.total + record.capacity,
          count: existing.count + 1,
          sortKey: existing.sortKey,
          label: existing.label,
        });
      }
    });

    return Array.from(hourlyMap.entries())
      .sort(([, a], [, b]) => a.sortKey - b.sortKey)
      .map(([key, val]) => ({
        key,
        label: val.label,
        avg: Math.round(val.total / val.count),
      }));
  }

  return groupedData;
};

export const getChartPoints = (chartData: ChartPoint[]) => {
  if (chartData.length === 0) return '';
  const width = 820;
  const height = 280;
  const maxY = 100;

  return chartData
    .map((point, index) => {
      const x = chartData.length === 1 ? width / 2 : (index * width) / (chartData.length - 1);
      const y = height - (point.avg / maxY) * height;
      return `${80 + x},${50 + y}`;
    })
    .join(' ');
};

export const getPeakHour = (filteredRecords: HistoryRecord[]) => {
  if (filteredRecords.length === 0) return null;

  const hourCountMap = new Map<number, number>();
  filteredRecords.forEach((record) => {
    const hour = record.timestamp.getHours();
    hourCountMap.set(hour, (hourCountMap.get(hour) ?? 0) + 1);
  });

  let bestHour = -1;
  let bestCount = 0;
  hourCountMap.forEach((count, hour) => {
    if (count > bestCount) {
      bestHour = hour;
      bestCount = count;
    }
  });

  if (bestHour < 0) return null;
  return { label: formatHourRange(bestHour), count: bestCount };
};

export const getTopFullLocations = (filteredRecords: HistoryRecord[]) => {
  if (filteredRecords.length === 0) return [] as Array<{ location: string; count: number }>;

  const locationCountMap = new Map<string, number>();
  filteredRecords.forEach((record) => {
    if (record.capacity >= FULL_THRESHOLD) {
      locationCountMap.set(record.location, (locationCountMap.get(record.location) ?? 0) + 1);
    }
  });

  return Array.from(locationCountMap.entries())
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
};


export type BinPriorityItem = {
  id: string;
  binId?: string;
  location: string;
  capacity: number;
  status: string | undefined;
  priorityScore: number;
  priorityLabel: 'High' | 'Medium' | 'Low';
  fullAgeMinutes?: number | null; // minutes since last became full
  reason?: string;
};

// Compute pickup priority ranking using live bins and optional history records
export const getPickupPriorityRanking = (
  liveBins: Array<{ id: string; location?: string; capacity?: number; level?: number; status?: string; gedung?: string; lantai?: string|number; ruang?: string }> = [],
  historyRecords: HistoryRecord[] = []
): BinPriorityItem[] => {
  const now = Date.now();

  // helper: find last timestamp when this bin was >= FULL_THRESHOLD
  const lastFullTimeForBin = (binId: string) => {
    const rec = [...historyRecords]
      .filter((r) => r.binId === binId && typeof r.capacity === 'number' && r.capacity >= FULL_THRESHOLD)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    return rec ? rec.timestamp.getTime() : null;
  };

  // helper: count how often bin was full in recent period (e.g., 7 days)
  const fullCountForBin = (binId: string, days = 7) => {
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return historyRecords.filter((r) => r.binId === binId && r.timestamp.getTime() >= cutoff && r.capacity >= FULL_THRESHOLD).length;
  };

  const items = liveBins.map((bin) => {
    const currentLevel = typeof bin.level === 'number'
      ? bin.level
      : typeof bin.capacity === 'number'
        ? bin.capacity
        : 0;
    const status = bin.status;
    // Compose location from gedung/lantai/ruang if location field is missing
    const location =
      bin.location ||
      [bin.gedung, bin.lantai, bin.ruang]
        .filter((p) => p !== undefined && p !== null && String(p).trim() !== '')
        .join(' - ') ||
      'Lokasi Tidak Diketahui';
    const binId = bin.id;

    const lastFullTs = lastFullTimeForBin(binId);
    let fullAgeMinutes: number | null = null;
    if (lastFullTs) {
      fullAgeMinutes = Math.max(0, Math.floor((now - lastFullTs) / 60000));
    }

    // Only rank bins that are currently full. This keeps the leaderboard aligned with manage/monitoring.
    if (status !== 'on' || currentLevel < FULL_THRESHOLD) {
      return null;
    }

    const freq = fullCountForBin(binId, 14); // last 14 days

    let score = 0;
    // main factor: how long it has been full
    if (fullAgeMinutes !== null) {
      score += fullAgeMinutes;
    }
    // tie-breakers: current fullness and repeat full pattern
    score += currentLevel;
    if (freq > 0) score += Math.min(30, freq * 2);

    // reason summary
    const reasons: string[] = [];
    reasons.push('Penuh');
    if (fullAgeMinutes !== null) reasons.push(`Penuh selama ${fullAgeMinutes} menit`);

    const priorityLabel: BinPriorityItem['priorityLabel'] = score >= 100 ? 'High' : score >= 60 ? 'Medium' : 'Low';

    return {
      id: binId,
      binId,
      location,
      capacity: currentLevel,
      status,
      priorityScore: Math.round(score),
      priorityLabel,
      fullAgeMinutes: fullAgeMinutes ?? null,
      reason: reasons.join(' • ') || undefined,
    };
  }).filter((item) => item !== null) as BinPriorityItem[];

  return items.sort((a, b) => {
    const aAge = a.fullAgeMinutes ?? -1;
    const bAge = b.fullAgeMinutes ?? -1;
    if (bAge !== aAge) return bAge - aAge;
    return b.priorityScore - a.priorityScore;
  });
};

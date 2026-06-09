import type { HistoryRecord } from './historyService';

export const formatDurationInHours = (minutes: number) => {
  if (minutes < 60) return `${minutes} menit`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} jam`;
  }

  return `${hours} jam ${remainingMinutes} menit`;
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
  liveBins: Array<{ id: string; location?: string; capacity?: number; level?: number; status?: string; lastUpdate?: Date | string | number | { toDate?: () => Date; toMillis?: () => number } | null; gedung?: string; lantai?: string|number; ruang?: string }> = [],
  historyRecords: HistoryRecord[] = []
): BinPriorityItem[] => {
  const now = Date.now();

  // helper: count how often bin was full in recent period (e.g., 7 days)
  const fullCountForBin = (binId: string, days = 7) => {
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    return historyRecords.filter((r) => r.binId === binId && r.timestamp.getTime() >= cutoff && r.capacity >= 90).length;
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

    const lastUpdateTs = bin.lastUpdate
      ? (typeof bin.lastUpdate === 'object' && bin.lastUpdate !== null && 'toDate' in bin.lastUpdate && typeof bin.lastUpdate.toDate === 'function'
          ? bin.lastUpdate.toDate().getTime()
          : typeof bin.lastUpdate === 'object' && bin.lastUpdate !== null && 'toMillis' in bin.lastUpdate && typeof bin.lastUpdate.toMillis === 'function'
            ? bin.lastUpdate.toMillis()
            : new Date(bin.lastUpdate as string | number | Date).getTime())
      : null;

    const lastFullTs = currentLevel >= 90
      ? lastUpdateTs ?? now
      : null;
    let fullAgeMinutes: number | null = null;
    if (lastFullTs) {
      fullAgeMinutes = Math.max(0, Math.floor((now - lastFullTs) / 60000));
    }

    // Rank only bins that are full and currently online.
    if (status !== 'on' || currentLevel < 90) {
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
    if (fullAgeMinutes !== null) reasons.push(`Penuh selama ${formatDurationInHours(fullAgeMinutes)}`);

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

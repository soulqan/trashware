import { useState } from 'react';

type ChartPoint = {
  key: string;
  label: string;
  avg: number;
};

type Props = {
  chartData: ChartPoint[];
  chartPoints: string;
};

export default function TrendChart({ chartData, chartPoints }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (chartData.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
        Tidak ada data log riwayat pada rentang tanggal ini.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 940 370" className="h-[370px] min-w-[940px] w-full">
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = 330 - (tick / 100) * 280;
          return (
            <g key={tick}>
              <line x1="80" y1={y} x2="900" y2={y} stroke="#F3F4F6" strokeWidth="2" />
              <text x="48" y={y + 4} fontSize="12" fill="#9CA3AF">
                {tick}%
              </text>
            </g>
          );
        })}

        <line x1="80" y1="50" x2="80" y2="330" stroke="#E5E7EB" strokeWidth="2" />
        <line x1="80" y1="330" x2="900" y2="330" stroke="#E5E7EB" strokeWidth="2" />

        <polyline points={chartPoints} fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

        {chartData.map((point, index) => {
          const x = 80 + (chartData.length === 1 ? 410 : (index * 820) / (chartData.length - 1));
          const y = 330 - (point.avg / 100) * 280;
          const isHovered = hoveredIndex === index;

          return (
            <g key={point.key}>
              {isHovered && <circle cx={x} cy={y} r="14" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.3" />}

              <circle
                cx={x}
                cy={y}
                r={isHovered ? 10 : 6}
                fill="#10B981"
                stroke="white"
                strokeWidth={isHovered ? 3 : 2}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onTouchStart={() => setHoveredIndex(index)}
                onTouchEnd={() => setHoveredIndex(null)}
              />

              <text x={x - 15} y="356" fontSize="11" fill="#6B7280" fontWeight="500" pointerEvents="none">
                {point.label}
              </text>

              {isHovered && (
                <>
                  <line
                    x1={x}
                    y1={y}
                    x2={x}
                    y2={y - 50}
                    stroke="#10B981"
                    strokeWidth="1"
                    strokeDasharray="3"
                    opacity="0.5"
                    pointerEvents="none"
                  />

                  <rect
                    x={Math.max(x - 50, 80)}
                    y={Math.max(y - 70, 10)}
                    width="100"
                    height="50"
                    fill="#10B981"
                    rx="6"
                    pointerEvents="none"
                  />

                  <text
                    x={Math.max(x, 130)}
                    y={Math.max(y - 50, 25)}
                    fontSize="16"
                    fontWeight="bold"
                    fill="white"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {point.avg}%
                  </text>

                  <text
                    x={Math.max(x, 130)}
                    y={Math.max(y - 35, 42)}
                    fontSize="11"
                    fill="white"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {point.label}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

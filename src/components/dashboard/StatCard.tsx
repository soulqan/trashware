// src/components/dashboard/StatCard.tsx
import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  trend: string;
  iconBg: string;
  textColor: string;
  icon: React.ReactNode;
}

export default function StatCard({ title, value, trend, iconBg, textColor, icon }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-xl ${iconBg} ${textColor}`}>
          {icon}
        </div>
        <span className={`text-xs font-semibold ${textColor}`}>{trend}</span>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{title}</p>
      </div>
    </div>
  );
}
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  textColor: string; // Untuk mewarnai angka
}

export default function StatCard({ title, value, icon, textColor }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <span className="text-gray-500 font-medium text-sm">{title}</span>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
      <div>
        <span className={`text-4xl font-bold ${textColor}`}>
          {value}
        </span>
      </div>
    </div>
  );
}
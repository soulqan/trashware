interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  textColor: string;
}

export default function StatCard({ title, value, icon, textColor }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <span className="text-gray-500 font-medium text-sm">{title}</span>
        <div className={textColor}>
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-4xl font-bold ${textColor}`} suppressHydrationWarning>
          {value}
        </span>
      </div>
    </div>
  );
}
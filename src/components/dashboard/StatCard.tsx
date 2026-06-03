interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  textColor: string;
}

export default function StatCard({ title, value, icon, textColor }: StatCardProps) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-24 sm:h-32 sm:p-6">
      <div className="flex justify-between items-start">
        <span className="text-gray-500 font-medium text-xs sm:text-sm">{title}</span>
        <div className={textColor}>
          {icon}
        </div>
      </div>
      <div className="mt-2 sm:mt-4">
        <span className={`text-2xl font-bold ${textColor} sm:text-4xl`} suppressHydrationWarning>
          {value}
        </span>
      </div>
    </div>
  );
}
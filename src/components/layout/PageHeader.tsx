interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function PageHeader({ title, subtitle, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-0.5 sm:gap-1 ${className}`}>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-800 tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs text-gray-400 sm:text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
}


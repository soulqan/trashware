import React, { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function PageHeader({ title, subtitle, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <h1 className="text-2xl lg:text-3xl font-black text-gray-800 tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}


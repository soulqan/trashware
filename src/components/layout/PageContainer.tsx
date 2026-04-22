import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`max-w-[1440px] mx-auto px-4 md:px-8 py-8 lg:py-10 space-y-8 min-h-screen font-sans text-left ${className}`}>
      {children}
    </div>
  );
}
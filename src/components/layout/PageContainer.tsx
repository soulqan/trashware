import React, { ReactNode } from 'react';

interface PageContainerProps {  
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`mx-auto min-h-screen w-full max-w-360 space-y-3 px-0 py-0 font-sans text-left sm:space-y-6 lg:space-y-8 ${className}`}>
      {children}
    </div>
  );
}

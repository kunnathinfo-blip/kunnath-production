import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: 'center' | 'left';
  badge?: string;
}

export const SectionHeading = ({
  children,
  subtitle,
  className,
  align = 'center',
  badge
}: SectionHeadingProps) => {
  return (
    <div className={cn(
      "flex flex-col mb-12",
      align === 'center' ? "items-center text-center" : "items-start text-left",
      className
    )}>
      {badge && (
        <span className="px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest mb-6 border border-primary/10">
          {badge}
        </span>
      )}

      <div className={cn(
        "relative inline-block px-10 py-4 rounded-full border-2 border-gray-100 bg-white/50 backdrop-blur-sm",
        align === 'center' ? "mx-auto" : ""
      )}>
        <h2 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-hover to-[#FF8A65] tracking-tight">
          {children}
        </h2>
      </div>

      {subtitle && (
        <p className="mt-6 text-gray-500 max-w-2xl text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

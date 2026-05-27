import React from 'react';
import { Card } from './Card';

export const SkeletonStayCard = () => {
  return (
    <Card className="overflow-hidden border border-gray-100 bg-white flex flex-col h-full rounded-[32px] animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[16/10] relative overflow-hidden rounded-[24px] m-2.5 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      <div className="p-6 pt-2 flex flex-col flex-1">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4 overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>

        {/* Info Icons Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-4 bg-gray-200 rounded-md w-16 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
          <div className="h-4 bg-gray-200 rounded-md w-24 overflow-hidden relative">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>

        {/* Pricing Skeleton */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 h-[46px]">
            <div className="h-3 bg-gray-200 rounded-md w-16" />
            <div className="h-4 bg-gray-200 rounded-md w-20" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 h-[46px]">
            <div className="h-3 bg-gray-200 rounded-md w-16" />
            <div className="h-4 bg-gray-200 rounded-md w-20" />
          </div>
        </div>
      </div>
    </Card>
  );
};

import React from 'react';

export const SkeletonSportCard = () => {
  return (
    <div className="block relative h-[420px] rounded-3xl overflow-hidden shadow-xl animate-pulse bg-gray-200">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

      <div className="absolute top-6 left-6">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/10" />
      </div>

      <div className="absolute bottom-8 left-8 right-8">
        <div className="h-6 bg-white/30 rounded-md w-3/4 mb-3" />
        <div className="flex items-center justify-between">
          <div className="h-5 bg-white/30 rounded-md w-1/2" />
          <div className="w-10 h-10 bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};

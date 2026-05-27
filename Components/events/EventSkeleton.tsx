import React from 'react';
import { Card } from '../ui/Card';

export const EventSkeleton = () => {
  return (
    <Card className="h-full flex flex-col border-0 shadow-soft overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-6 flex flex-col flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
        <div className="flex justify-between mb-6">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="mt-auto h-10 bg-gray-200 rounded-lg w-full" />
      </div>
    </Card>
  );
};

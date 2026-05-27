import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteEvents } from '../../hooks/useEvents';
import { EventCard } from './EventCard';
import { EventSkeleton } from './EventSkeleton';

interface EventGridProps {
  category: string;
  search: string;
}

export const EventGrid: React.FC<EventGridProps> = ({ category, search }) => {
  const { ref, inView } = useInView();
  
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteEvents(category, search);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="py-12 text-center text-red-500">
        <p>Failed to load events. Please try again later.</p>
      </div>
    );
  }

  const events = data?.pages.flatMap(page => page.events) || [];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <EventSkeleton key={i} />)
        ) : events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query.</p>
          </div>
        )}

        {/* Load more skeletons */}
        {isFetchingNextPage && (
          Array.from({ length: 3 }).map((_, i) => <EventSkeleton key={`fetching-${i}`} />)
        )}
      </div>

      {/* Intersection Observer target */}
      <div ref={ref} className="h-10 mt-8" />
    </div>
  );
};

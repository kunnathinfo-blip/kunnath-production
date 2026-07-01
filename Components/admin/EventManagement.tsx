import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Edit2, Trash2, Calendar, Eye, EyeOff } from 'lucide-react';
import { useAdminEvents, useDeleteEvent, Event } from '../../hooks/useEvents';
import { EventModal } from './EventModal';

export const EventManagement = () => {
  const { data: events, isLoading } = useAdminEvents();
  const deleteEvent = useDeleteEvent();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const handleCreate = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEvent.mutate(id);
    }
  };

  if (isLoading) return <div>Loading events...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Manage Events</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage your traditional, corporate, and upcoming events.</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus size={18} /> Add Event
        </Button>
      </div>

      {/* Mobile view (List Cards) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {events?.map((event) => (
          <Card key={event._id} className="p-4 space-y-4 border border-gray-200">
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                {event.images?.[0] ? (
                  <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Calendar size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 truncate">{event.title}</h4>
                <p className="text-xs text-gray-505 truncate">{event.slug}</p>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">
                    {event.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    event.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {event.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl text-xs space-y-2 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Date/Type:</span>
                <span className="font-medium text-gray-900">
                  {event.isFlexibleDate ? 'Flexible Dates' : new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price:</span>
                <span className="font-bold text-gray-900">₹{event.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleEdit(event)}
              >
                <Edit2 size={14} className="mr-1.5" /> Edit
              </Button>
              <Button
                variant="outline"
                className="flex-none text-red-600 hover:text-red-750 hover:bg-red-55 hover:border-red-200"
                onClick={() => handleDelete(event._id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}

        {!events?.length && (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-150">
            No events found. Click "Add Event" to create one.
          </div>
        )}
      </div>

      {/* Table (Desktop View) */}
      <Card className="border-gray-100 shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 text-sm font-semibold text-gray-600">Event</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Date/Type</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Price</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events?.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {event.images?.[0] ? (
                          <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Calendar size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{event.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {event.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {event.isFlexibleDate ? 'Flexible Dates' : new Date(event.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    ₹{event.price.toLocaleString()}
                  </td>
                  <td className="p-4">
                    {event.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <Eye size={14} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        <EyeOff size={14} /> Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(event)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(event._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {!events?.length && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No events found. Click "Add Event" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <EventModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          eventToEdit={editingEvent} 
        />
      )}
    </div>
  );
};

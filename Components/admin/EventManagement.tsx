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

      <Card className="border-gray-100 shadow-sm overflow-hidden">
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

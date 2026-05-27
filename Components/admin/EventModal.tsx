import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { X, Plus, Trash2 } from 'lucide-react';
import { useCreateEvent, useUpdateEvent, Event } from '../../hooks/useEvents';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit: Event | null;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, eventToEdit }) => {
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Upcoming' as 'Traditional' | 'Corporate' | 'Upcoming',
    shortDescription: '',
    description: '',
    price: 0,
    date: '',
    isFlexibleDate: false,
    images: [] as string[],
    capacity: 0,
    isActive: true,
    tags: [] as string[]
  });

  const [newImage, setNewImage] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || '',
        slug: eventToEdit.slug || '',
        category: eventToEdit.category || 'Upcoming',
        shortDescription: eventToEdit.shortDescription || '',
        description: eventToEdit.description || '',
        price: eventToEdit.price || 0,
        date: eventToEdit.date ? new Date(eventToEdit.date).toISOString().split('T')[0] : '',
        isFlexibleDate: eventToEdit.isFlexibleDate || false,
        images: eventToEdit.images || [],
        capacity: eventToEdit.capacity || 0,
        isActive: eventToEdit.isActive ?? true,
        tags: eventToEdit.tags || []
      });
    }
  }, [eventToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Auto-generate slug from title if creating new
    if (name === 'title' && !eventToEdit) {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({ ...prev, images: [...prev.images, newImage.trim()] }));
      setNewImage('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = { ...formData };
    
    if (eventToEdit) {
      updateEvent.mutate(
        { id: eventToEdit._id, data: payload },
        { onSuccess: onClose }
      );
    } else {
      createEvent.mutate(payload, { onSuccess: onClose });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {eventToEdit ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form id="event-form" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Basic Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none">
                    <option value="Upcoming">Upcoming</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Configuration</label>
                  <div className="flex items-center gap-4 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="isFlexibleDate" checked={formData.isFlexibleDate} onChange={handleChange} className="w-4 h-4 text-primary rounded" />
                      <span className="text-sm text-gray-600">Flexible Dates</span>
                    </label>
                  </div>
                  {!formData.isFlexibleDate && (
                    <input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 text-primary rounded" />
                    <span className="text-sm font-medium text-gray-700">Active (Visible to users)</span>
                  </label>
                </div>
              </div>

              {/* Descriptions & Media */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Description & Media</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <textarea required name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Description (HTML Supported)</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images (URLs)</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="https://..." className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                    <Button type="button" variant="outline" onClick={handleAddImage}><Plus size={18} /></Button>
                  </div>
                  <div className="space-y-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-xs text-gray-500 truncate mr-2">{img}</span>
                        <button type="button" onClick={() => handleRemoveImage(idx)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="e.g. Festival" className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                    <Button type="button" variant="outline" onClick={handleAddTag}><Plus size={18} /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-gray-600"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            form="event-form"
            disabled={createEvent.isPending || updateEvent.isPending}
          >
            {createEvent.isPending || updateEvent.isPending ? 'Saving...' : 'Save Event'}
          </Button>
        </div>

      </div>
    </div>
  );
};

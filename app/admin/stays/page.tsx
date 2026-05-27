'use client';

import React, { useState } from 'react';
import { useStays, FarmStay, useDeleteStay } from '@/hooks/useStays';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import StayModal from '@/Components/admin/StayModal';

export default function AdminStaysPage() {
  const { data: stays, isLoading } = useStays();
  const { mutate: deleteStay } = useDeleteStay();
  
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stayToEdit, setStayToEdit] = useState<FarmStay | null>(null);

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this stay? This will only hide it from users (soft delete).')) return;
    
    setIsDeleting(id);
    deleteStay(id, {
      onSettled: () => setIsDeleting(null)
    });
  };

  const openAddModal = () => {
    setStayToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (stay: FarmStay) => {
    setStayToEdit(stay);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Farm Stays</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your luxury farm stays</p>
        </div>
        <Button onClick={openAddModal} className="shrink-0 group">
          <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Add New Stay
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stays?.map((stay) => (
          <Card key={stay._id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-gray-100 flex flex-col h-full">
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
              {stay.images && stay.images.length > 0 ? (
                <img 
                  src={stay.images[0]} 
                  alt={stay.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
                ₹{stay.price.toLocaleString()} <span className="text-xs text-gray-500 font-normal">/ night</span>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{stay.name}</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4 flex-1 line-clamp-2">{stay.description}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                  {stay.capacity} Guests
                </span>
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                  {stay.beds} Beds
                </span>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => openEditModal(stay)}
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-none text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                  onClick={() => handleDelete(stay._id)}
                  disabled={isDeleting === stay._id}
                >
                  {isDeleting === stay._id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {stays?.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No farm stays yet</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first stay to start receiving bookings.</p>
            <Button onClick={openAddModal} variant="outline">
              Add New Stay
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <StayModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        stayToEdit={stayToEdit} 
      />
    </div>
  );
}

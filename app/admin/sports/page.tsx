// 'use client';

// import React, { useState } from 'react';
// import { useSports, Sport } from '@/hooks/useSports';
// import { Card } from '@/Components/ui/Card';
// import { Button } from '@/Components/ui/Button';
// import { Plus, Edit2, Trash2 } from 'lucide-react';
// import api from '@/lib/axios';
// import SportModal from '@/Components/admin/SportModal';

// export default function AdminSportsPage() {
//   const { data: sports, isLoading, refetch } = useSports();
//   const [isDeleting, setIsDeleting] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [sportToEdit, setSportToEdit] = useState<Sport | null>(null);

//   const handleDelete = async (id: string) => {
//     if (!window.confirm('Are you sure you want to delete this sport?')) return;

//     setIsDeleting(id);
//     try {
//       await api.delete(`/admin/sports/${id}`);
//       refetch();
//     } catch (error) {
//       alert('Failed to delete sport');
//     }
//     setIsDeleting(null);
//   };

//   const handleEdit = (sport: Sport) => {
//     setSportToEdit(sport);
//     setIsModalOpen(true);
//   };

//   const handleAdd = () => {
//     setSportToEdit(null);
//     setIsModalOpen(true);
//   };

//   if (isLoading) return <div className="py-12 text-center text-gray-500">Loading sports...</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold font-display text-gray-900">Manage Sports</h1>
//           <p className="text-gray-500">Add, edit, or remove sports from the platform</p>
//         </div>
//         <Button onClick={handleAdd} className="flex items-center gap-2">
//           <Plus size={18} /> Add Sport
//         </Button>
//       </div>

//       <Card className="overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-sm text-gray-600">
//             <thead className="bg-gray-50 text-gray-900 border-b border-gray-100">
//               <tr>
//                 <th className="p-4 font-semibold">Sport Name</th>
//                 <th className="p-4 font-semibold">Price</th>
//                 <th className="p-4 font-semibold">Duration</th>
//                 <th className="p-4 font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {sports?.map((sport) => (
//                 <tr key={sport._id} className="hover:bg-gray-50 transition-colors">
//                   <td className="p-4">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
//                         <img src={sport.image} alt={sport.name} className="w-full h-full object-cover" />
//                         <div className="absolute top-0.5 left-0.5 bg-white/90 p-0.5 rounded text-[10px]">
//                           {sport.icon}
//                         </div>
//                       </div>
//                       <span className="font-medium text-gray-900">{sport.name}</span>
//                     </div>
//                   </td>
//                   <td className="p-4">₹{sport.price.toLocaleString()}</td>
//                   <td className="p-4">{sport.duration}</td>
//                   <td className="p-4">
//                     <div className="flex items-center gap-2">
//                       <button 
//                         onClick={() => handleEdit(sport)}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                       >
//                         <Edit2 size={16} />
//                       </button>
//                       <button 
//                         onClick={() => handleDelete(sport._id)}
//                         disabled={isDeleting === sport._id}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {sports?.length === 0 && (
//                 <tr>
//                   <td colSpan={4} className="p-8 text-center text-gray-500">
//                     No sports found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       <SportModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         sportToEdit={sportToEdit} 
//       />
//     </div>
//   );
// }


'use client';

import React, { useState } from 'react';
import { useSports, Sport } from '@/hooks/useSports';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '@/lib/axios';
import SportModal from '@/Components/admin/SportModal';

export default function AdminSportsPage() {
  const { data: sports, isLoading, refetch } = useSports();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sportToEdit, setSportToEdit] = useState<Sport | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sport?')) return;

    setIsDeleting(id);
    try {
      await api.delete(`/admin/sports/${id}`);
      refetch();
    } catch (error) {
      alert('Failed to delete sport');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (sport: Sport) => {
    setSportToEdit(sport);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSportToEdit(null);
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
          <h1 className="text-2xl font-bold font-display text-gray-900">Manage Sports</h1>
          <p className="text-sm text-gray-500 mt-1">Add, edit, or remove sports from the platform</p>
        </div>
        <Button onClick={handleAdd} className="shrink-0 group">
          <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Add Sport
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sports?.map((sport) => (
          <Card key={sport._id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-gray-100 flex flex-col h-full">
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
              {sport.image ? (
                <img
                  src={sport.image}
                  alt={sport.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              {/* Display icon overlay if present */}
              {sport.icon && (
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-sm">
                  {sport.icon}
                </div>
              )}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow-sm">
                ₹{sport.price.toLocaleString()}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{sport.name}</h3>

              <div className="flex items-center gap-2 mb-4 mt-2">
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                  Duration: {sport.duration}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEdit(sport)}
                >
                  <Edit2 size={16} className="mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="flex-none text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                  onClick={() => handleDelete(sport._id)}
                  disabled={isDeleting === sport._id}
                >
                  {isDeleting === sport._id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {sports?.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No sports found</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first sport to offer activities on the platform.</p>
            <Button onClick={handleAdd} variant="outline">
              Add Sport
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <SportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sportToEdit={sportToEdit}
      />
    </div>
  );
}
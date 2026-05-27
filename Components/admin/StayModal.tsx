import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Settings, DollarSign, CheckCircle2 } from 'lucide-react';
import { FarmStay, useCreateStay, useUpdateStay } from '@/hooks/useStays';
import { Button } from '@/Components/ui/Button';

interface StayModalProps {
  isOpen: boolean;
  onClose: () => void;
  stayToEdit: FarmStay | null;
}

export default function StayModal({ isOpen, onClose, stayToEdit }: StayModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    images: [''],
    price: 0,
    capacity: 2,
    beds: 1,
    bathrooms: 1,
    bedrooms: 1,
    halls: 0,
    maxGuests: 2,
    extraGuestCharge: 0,
    securityDeposit: 0,
    bookingAdvance: 0,
    amenities: [''],
    foodOptions: [''],
    addOns: [{ name: '', price: 0 }],
  });

  const { mutate: createStay, isPending: isCreating } = useCreateStay();
  const { mutate: updateStay, isPending: isUpdating } = useUpdateStay();

  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      if (stayToEdit) {
        setFormData({
          name: stayToEdit.name,
          slug: stayToEdit.slug || '',
          description: stayToEdit.description,
          images: stayToEdit.images?.length ? stayToEdit.images : [''],
          price: stayToEdit.price,
          capacity: stayToEdit.capacity,
          beds: stayToEdit.beds,
          bathrooms: stayToEdit.bathrooms || 1,
          bedrooms: stayToEdit.bedrooms || 1,
          halls: stayToEdit.halls || 0,
          maxGuests: stayToEdit.maxGuests || stayToEdit.capacity,
          extraGuestCharge: stayToEdit.extraGuestCharge || 0,
          securityDeposit: stayToEdit.securityDeposit || 0,
          bookingAdvance: stayToEdit.bookingAdvance || 0,
          amenities: stayToEdit.amenities?.length ? stayToEdit.amenities : [''],
          foodOptions: stayToEdit.foodOptions?.length ? stayToEdit.foodOptions : [''],
          addOns: stayToEdit.addOns?.length ? stayToEdit.addOns : [{ name: '', price: 0 }],
        });
      } else {
        setFormData({
          name: '',
          slug: '',
          description: '',
          images: [''],
          price: 0,
          capacity: 2,
          beds: 1,
          bathrooms: 1,
          bedrooms: 1,
          halls: 0,
          maxGuests: 2,
          extraGuestCharge: 0,
          securityDeposit: 0,
          bookingAdvance: 0,
          amenities: [''],
          foodOptions: [''],
          addOns: [{ name: '', price: 0 }],
        });
      }
      setStep(1);
    }
  }, [isOpen, stayToEdit]);

  if (!isOpen) return null;

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const isStep1Valid = formData.name.trim() !== '' && formData.description.trim() !== '';
  const isStep2Valid = formData.images[0]?.trim() !== '';
  const isStep3Valid = formData.price > 0 && formData.capacity > 0 && formData.beds > 0;

  const handleArrayChange = (index: number, value: string, field: 'images' | 'amenities') => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'images' | 'amenities') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (index: number, field: 'images' | 'amenities') => {
    const newArray = formData[field].filter((_, i) => i !== index);
    if (newArray.length === 0) newArray.push('');
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = () => {
    const payload = {
      ...formData,
      images: formData.images.filter((img) => img.trim() !== ''),
      amenities: formData.amenities.filter((a) => a.trim() !== ''),
      foodOptions: formData.foodOptions.filter((f) => f.trim() !== ''),
      addOns: formData.addOns.filter((a) => a.name.trim() !== ''),
    };

    const onSuccess = () => onClose();

    if (stayToEdit) {
      updateStay({ id: stayToEdit._id, stayData: payload }, { onSuccess });
    } else {
      createStay(payload, { onSuccess });
    }
  };

  const steps = [
    { num: 1, title: 'Basic Info', icon: Settings },
    { num: 2, title: 'Media', icon: ImageIcon },
    { num: 3, title: 'Details', icon: DollarSign },
    { num: 4, title: 'Review', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold font-display text-gray-900">
              {stayToEdit ? 'Edit Stay' : 'Add New Stay'}
            </h2>
            <p className="text-sm text-gray-500">
              Step {step} of 4: {steps[step - 1].title}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="flex justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors bg-white ${
                  step >= s.num ? 'border-primary text-primary' : 'border-gray-200 text-gray-400'
                }`}>
                  <Icon size={18} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stay Name *</label>
                <input 
                  type="text"
                  placeholder="e.g. Luxury Pool Villa"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL identifier) *</label>
                <input 
                  type="text"
                  placeholder="e.g. luxury-pool-villa"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea 
                  placeholder="Describe the farm stay..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none min-h-[120px]"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs *</label>
                <p className="text-xs text-gray-500 mb-3">Provide direct links to images. The first image will be the cover.</p>
                
                <div className="space-y-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        value={img}
                        onChange={(e) => handleArrayChange(idx, e.target.value, 'images')}
                      />
                      <button 
                        onClick={() => removeArrayItem(idx, 'images')}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg border border-red-100"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => addArrayItem('images')}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    + Add another image
                  </button>
                </div>
              </div>

              {formData.images[0] && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Cover Preview</p>
                  <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <img 
                      src={formData.images[0]} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per night (₹) *</label>
                  <input 
                    type="number"
                    min="0"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (Guests) *</label>
                  <input 
                    type="number"
                    min="1"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beds *</label>
                  <input 
                    type="number"
                    min="1"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={formData.beds}
                    onChange={(e) => setFormData({...formData, beds: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input 
                    type="number"
                    min="1"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({...formData, bathrooms: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input 
                    type="number"
                    min="1"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Living Rooms/Halls</label>
                  <input 
                    type="number"
                    min="0"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={formData.halls}
                    onChange={(e) => setFormData({...formData, halls: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                  <input 
                    type="number"
                    min="1"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={formData.maxGuests}
                    onChange={(e) => setFormData({...formData, maxGuests: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Extra Guest Charge (₹)</label>
                  <input 
                    type="number"
                    min="0"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={formData.extraGuestCharge}
                    onChange={(e) => setFormData({...formData, extraGuestCharge: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)</label>
                  <input 
                    type="number"
                    min="0"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({...formData, securityDeposit: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Advance Payment (₹)</label>
                <input 
                  type="number"
                  min="0"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.bookingAdvance}
                  onChange={(e) => setFormData({...formData, bookingAdvance: Number(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                <p className="text-xs text-gray-500 mb-3">e.g. WiFi, Pool, Air Conditioning</p>
                <div className="space-y-3">
                  {formData.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="e.g. WiFi"
                        className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        value={amenity}
                        onChange={(e) => handleArrayChange(idx, e.target.value, 'amenities')}
                      />
                      <button 
                        onClick={() => removeArrayItem(idx, 'amenities')}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg border border-red-100"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => addArrayItem('amenities')}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    + Add amenity
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Options</label>
                <p className="text-xs text-gray-500 mb-3">e.g. Swiggy Available, Chef on Request</p>
                <div className="space-y-3">
                  {formData.foodOptions.map((option, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="e.g. Swiggy & Zomato Available"
                        className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...formData.foodOptions];
                          newOptions[idx] = e.target.value;
                          setFormData({ ...formData, foodOptions: newOptions });
                        }}
                      />
                      <button 
                        onClick={() => {
                          const newOptions = formData.foodOptions.filter((_, i) => i !== idx);
                          if (newOptions.length === 0) newOptions.push('');
                          setFormData({ ...formData, foodOptions: newOptions });
                        }}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg border border-red-100"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setFormData({ ...formData, foodOptions: [...formData.foodOptions, ''] })}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    + Add food option
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add-ons (e.g. Campfire, Kitchen)</label>
                <div className="space-y-3">
                  {formData.addOns.map((addon, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text"
                        placeholder="Name (e.g. Campfire)"
                        className="flex-[2] p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        value={addon.name}
                        onChange={(e) => {
                          const newAddOns = [...formData.addOns];
                          newAddOns[idx] = { ...newAddOns[idx], name: e.target.value };
                          setFormData({ ...formData, addOns: newAddOns });
                        }}
                      />
                      <input 
                        type="number"
                        placeholder="Price"
                        className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        value={addon.price}
                        onChange={(e) => {
                          const newAddOns = [...formData.addOns];
                          newAddOns[idx] = { ...newAddOns[idx], price: Number(e.target.value) };
                          setFormData({ ...formData, addOns: newAddOns });
                        }}
                      />
                      <button 
                        onClick={() => {
                          const newAddOns = formData.addOns.filter((_, i) => i !== idx);
                          if (newAddOns.length === 0) newAddOns.push({ name: '', price: 0 });
                          setFormData({ ...formData, addOns: newAddOns });
                        }}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg border border-red-100"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setFormData({ ...formData, addOns: [...formData.addOns, { name: '', price: 0 }] })}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    + Add add-on
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4">
                <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-200 relative">
                  <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{formData.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm">
                      ₹{formData.price.toLocaleString()} / night
                    </span>
                    <span className="text-gray-500 text-sm">· {formData.capacity} guests · {formData.beds} beds</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm border-t border-gray-200 pt-4">
                  {formData.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.amenities.filter(a => a.trim() !== '').map((amenity, idx) => (
                    <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={step === 1 ? onClose : handleBack}
            disabled={isSaving}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>

          {step < 4 ? (
            <Button 
              onClick={handleNext}
              disabled={
                (step === 1 && !isStep1Valid) ||
                (step === 2 && !isStep2Valid) ||
                (step === 3 && !isStep3Valid)
              }
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              isLoading={isSaving}
            >
              {stayToEdit ? 'Update Stay' : 'Create Stay'}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Settings, DollarSign, CheckCircle2, ChevronDown } from 'lucide-react';
import { FarmStay, useCreateStay, useUpdateStay } from '@/hooks/useStays';
import { Button } from '@/Components/ui/Button';
import { normalizeStayImages } from '@/lib/utils';

interface StayModalProps {
  isOpen: boolean;
  onClose: () => void;
  stayToEdit: FarmStay | null;
}

export default function StayModal({ isOpen, onClose, stayToEdit }: StayModalProps) {
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    images: [''],
    featuredImages: ['', '', '', '', ''] as string[],
    categorizedImages: {
      rooms: [''],
      amenities: [''],
      dining: [''],
      activities: [''],
      exterior: [''],
      interior: ['']
    },
    otherImages: [''],
    price: 0,
    weekendPrice: 0,
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
      setErrorMsg(null);
      if (stayToEdit) {
        const normalized = normalizeStayImages(stayToEdit);
        const feat = [...(normalized.featuredImages || [])];
        while (feat.length < 5) feat.push('');
        
        setFormData({
          name: stayToEdit.name,
          slug: stayToEdit.slug || '',
          description: stayToEdit.description,
          images: stayToEdit.images?.length ? stayToEdit.images : [''],
          featuredImages: feat.slice(0, 5),
          categorizedImages: {
            rooms: normalized.categorizedImages?.rooms?.length ? normalized.categorizedImages.rooms : [''],
            amenities: normalized.categorizedImages?.amenities?.length ? normalized.categorizedImages.amenities : [''],
            dining: normalized.categorizedImages?.dining?.length ? normalized.categorizedImages.dining : [''],
            activities: normalized.categorizedImages?.activities?.length ? normalized.categorizedImages.activities : [''],
            exterior: normalized.categorizedImages?.exterior?.length ? normalized.categorizedImages.exterior : [''],
            interior: normalized.categorizedImages?.interior?.length ? normalized.categorizedImages.interior : ['']
          },
          otherImages: normalized.otherImages?.length ? normalized.otherImages : [''],
          price: stayToEdit.price,
          weekendPrice: stayToEdit.weekendPrice !== undefined ? stayToEdit.weekendPrice : stayToEdit.price,
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
          featuredImages: ['', '', '', '', ''],
          categorizedImages: {
            rooms: [''],
            amenities: [''],
            dining: [''],
            activities: [''],
            exterior: [''],
            interior: ['']
          },
          otherImages: [''],
          price: 0,
          weekendPrice: 0,
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
  const isStep2Valid = formData.featuredImages.filter(img => img.trim() !== '').length === 5;
  const isStep3Valid = formData.price > 0 && formData.weekendPrice > 0 && formData.capacity > 0 && formData.beds > 0;

  const handleFeaturedImageChange = (index: number, value: string) => {
    const newFeatured = [...formData.featuredImages];
    newFeatured[index] = value;
    setFormData({ ...formData, featuredImages: newFeatured });
  };

  const handleCategorizedImageChange = (category: string, index: number, value: string) => {
    const newCategorized = { ...formData.categorizedImages };
    const arr = [...(newCategorized as any)[category]];
    arr[index] = value;
    (newCategorized as any)[category] = arr;
    setFormData({ ...formData, categorizedImages: newCategorized });
  };

  const addCategorizedImageItem = (category: string) => {
    const newCategorized = { ...formData.categorizedImages };
    (newCategorized as any)[category] = [...(newCategorized as any)[category], ''];
    setFormData({ ...formData, categorizedImages: newCategorized });
  };

  const removeCategorizedImageItem = (category: string, index: number) => {
    const newCategorized = { ...formData.categorizedImages };
    const arr = (newCategorized as any)[category].filter((_: any, i: number) => i !== index);
    if (arr.length === 0) arr.push('');
    (newCategorized as any)[category] = arr;
    setFormData({ ...formData, categorizedImages: newCategorized });
  };

  const handleOtherImageChange = (index: number, value: string) => {
    const newOther = [...formData.otherImages];
    newOther[index] = value;
    setFormData({ ...formData, otherImages: newOther });
  };

  const addOtherImageItem = () => {
    setFormData({ ...formData, otherImages: [...formData.otherImages, ''] });
  };

  const removeOtherImageItem = (index: number) => {
    const newOther = formData.otherImages.filter((_, i) => i !== index);
    if (newOther.length === 0) newOther.push('');
    setFormData({ ...formData, otherImages: newOther });
  };

  const handleArrayChange = (index: number, value: string, field: 'amenities') => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'amenities') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (index: number, field: 'amenities') => {
    const newArray = formData[field].filter((_, i) => i !== index);
    if (newArray.length === 0) newArray.push('');
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = () => {
    const cleanFeatured = formData.featuredImages.filter(img => img.trim() !== '');
    const cleanCategorized = {
      rooms: formData.categorizedImages.rooms.filter(img => img.trim() !== ''),
      amenities: formData.categorizedImages.amenities.filter(img => img.trim() !== ''),
      dining: formData.categorizedImages.dining.filter(img => img.trim() !== ''),
      activities: formData.categorizedImages.activities.filter(img => img.trim() !== ''),
      exterior: formData.categorizedImages.exterior.filter(img => img.trim() !== ''),
      interior: formData.categorizedImages.interior.filter(img => img.trim() !== '')
    };
    const cleanOther = formData.otherImages.filter(img => img.trim() !== '');

    const payload = {
      ...formData,
      featuredImages: cleanFeatured,
      categorizedImages: cleanCategorized,
      otherImages: cleanOther,
      images: [
        ...cleanFeatured,
        ...cleanCategorized.rooms,
        ...cleanCategorized.amenities,
        ...cleanCategorized.dining,
        ...cleanCategorized.activities,
        ...cleanCategorized.exterior,
        ...cleanCategorized.interior,
        ...cleanOther
      ],
      amenities: formData.amenities.filter((a) => a.trim() !== ''),
      foodOptions: formData.foodOptions.filter((f) => f.trim() !== ''),
      addOns: formData.addOns.filter((a) => a.name.trim() !== ''),
    };

    const onSuccess = () => {
      setErrorMsg(null);
      onClose();
    };

    const onError = (err: any) => {
      console.error(err);
      setErrorMsg(err.response?.data?.message || err.message || 'An error occurred while saving.');
    };

    if (stayToEdit) {
      updateStay({ id: stayToEdit._id, stayData: payload }, { onSuccess, onError });
    } else {
      createStay(payload, { onSuccess, onError });
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
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium animate-in fade-in duration-200">
              {errorMsg}
            </div>
          )}
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
              
              {/* Featured Images with Drag & Drop */}
              <div className="border-b border-gray-150 pb-6">
                <label className="block text-sm font-bold text-gray-900 mb-1">Featured Gallery Images *</label>
                <p className="text-xs text-gray-500 mb-4">Provide exactly 5 featured images. Drag and drop the thumbnail cards to reorder them.</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                  {formData.featuredImages.map((img, idx) => {
                    const isValidUrl = img && img.startsWith('http');
                    return (
                      <div 
                        key={idx}
                        draggable={!!isValidUrl}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', idx.toString());
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const srcIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                          if (isNaN(srcIndex) || srcIndex === idx) return;
                          const newFeatured = [...formData.featuredImages];
                          const temp = newFeatured[srcIndex];
                          newFeatured[srcIndex] = newFeatured[idx];
                          newFeatured[idx] = temp;
                          setFormData({ ...formData, featuredImages: newFeatured });
                        }}
                        className={`aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden relative transition-all duration-300 ${
                          isValidUrl 
                            ? 'border-gray-200 cursor-grab active:cursor-grabbing hover:border-primary hover:shadow-md' 
                            : 'border-gray-200 bg-gray-50 text-gray-400'
                        }`}
                      >
                        {isValidUrl ? (
                          <>
                            <img src={img} alt={`Featured ${idx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute top-1 left-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-1">
                            <span className="text-[10px] font-black uppercase text-gray-400">Slot {idx + 1}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2.5">
                  {formData.featuredImages.map((img, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-gray-400 w-16">Image {idx + 1}:</span>
                      <input 
                        type="url"
                        placeholder="Cloudinary Image URL..."
                        className="flex-1 p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        value={img}
                        onChange={(e) => handleFeaturedImageChange(idx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Category-wise Images Accordion */}
              <div className="border-b border-gray-150 pb-6">
                <label className="block text-sm font-bold text-gray-900 mb-1">Category-wise Images</label>
                <p className="text-xs text-gray-500 mb-4">Organize property images into specific visual categories.</p>
                
                <div className="space-y-3">
                  {[
                    { key: 'rooms', label: 'Rooms' },
                    { key: 'amenities', label: 'Amenities' },
                    { key: 'dining', label: 'Dining' },
                    { key: 'activities', label: 'Activities' },
                    { key: 'exterior', label: 'Exterior' },
                    { key: 'interior', label: 'Interior' }
                  ].map(cat => {
                    const catList = formData.categorizedImages[cat.key as keyof typeof formData.categorizedImages] || [''];
                    return (
                      <details key={cat.key} className="group border border-gray-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer select-none">
                          <span className="text-sm font-bold text-gray-800">{cat.label} ({catList.filter(u => u.trim()).length} images)</span>
                          <span className="text-gray-400 transition group-open:rotate-180">
                            <ChevronDown size={18} />
                          </span>
                        </summary>
                        <div className="p-4 bg-white border-t border-gray-150 space-y-3">
                          {catList.map((url, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input 
                                type="url"
                                placeholder={`Cloudinary URL for ${cat.label}...`}
                                className="flex-1 p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                value={url}
                                onChange={(e) => handleCategorizedImageChange(cat.key, idx, e.target.value)}
                              />
                              <button 
                                onClick={() => removeCategorizedImageItem(cat.key, idx)}
                                className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-100"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => addCategorizedImageItem(cat.key)}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            + Add {cat.label} image
                          </button>
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>

              {/* Other Images */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">Other Images</label>
                <p className="text-xs text-gray-500 mb-3">Add miscellaneous images that do not fit standard categories.</p>
                <div className="space-y-3">
                  {formData.otherImages.map((img, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="url"
                        placeholder="Cloudinary Image URL..."
                        className="flex-1 p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        value={img}
                        onChange={(e) => handleOtherImageChange(idx, e.target.value)}
                      />
                      <button 
                        onClick={() => removeOtherImageItem(idx)}
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-100"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addOtherImageItem}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    + Add other image
                  </button>
                </div>
              </div>

            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weekday Price per night (₹) *</label>
                  <input 
                    type="number"
                    min="0"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weekend Price per night (₹) *</label>
                  <input 
                    type="number"
                    min="0"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={formData.weekendPrice}
                    onChange={(e) => setFormData({...formData, weekendPrice: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm">
                      Weekday: ₹{formData.price.toLocaleString()} / night
                    </span>
                    <span className="bg-amber-50 text-amber-700 font-semibold px-3 py-1 rounded-full text-sm">
                      Weekend: ₹{formData.weekendPrice.toLocaleString()} / night
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

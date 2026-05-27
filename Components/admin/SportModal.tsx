import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Settings, DollarSign, CheckCircle2 } from 'lucide-react';
import { Sport, useCreateSport, useUpdateSport } from '@/hooks/useSports';
import { Button } from '@/Components/ui/Button';

interface SportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sportToEdit: Sport | null;
}

export default function SportModal({ isOpen, onClose, sportToEdit }: SportModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '⚽',
    image: '',
    price: 0,
    duration: '1 hr',
  });

  const { mutate: createSport, isPending: isCreating } = useCreateSport();
  const { mutate: updateSport, isPending: isUpdating } = useUpdateSport();

  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      if (sportToEdit) {
        setFormData({
          name: sportToEdit.name,
          description: sportToEdit.description,
          icon: sportToEdit.icon,
          image: sportToEdit.image,
          price: sportToEdit.price,
          duration: sportToEdit.duration,
        });
      } else {
        setFormData({
          name: '',
          description: '',
          icon: '⚽',
          image: '',
          price: 0,
          duration: '1 hr',
        });
      }
      setStep(1);
    }
  }, [isOpen, sportToEdit]);

  if (!isOpen) return null;

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const isStep1Valid = formData.name.trim() !== '' && formData.description.trim() !== '';
  const isStep2Valid = formData.image.trim() !== '';
  const isStep3Valid = formData.price >= 0 && formData.duration.trim() !== '';

  const handleSubmit = () => {
    const onSuccess = () => {
      onClose();
    };

    if (sportToEdit) {
      updateSport({ id: sportToEdit._id, sportData: formData }, { onSuccess });
    } else {
      createSport(formData, { onSuccess });
    }
  };

  const steps = [
    { num: 1, title: 'Basic Info', icon: Settings },
    { num: 2, title: 'Media', icon: ImageIcon },
    { num: 3, title: 'Pricing', icon: DollarSign },
    { num: 4, title: 'Review', icon: CheckCircle2 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold font-display text-gray-900">
              {sportToEdit ? 'Edit Sport' : 'Add New Sport'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Sport Name *</label>
                <input 
                  type="text"
                  placeholder="e.g. Box Cricket"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emoji Icon</label>
                <input 
                  type="text"
                  placeholder="🏏"
                  className="w-20 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-xl text-center"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea 
                  placeholder="Describe the sport..."
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <p className="text-xs text-gray-500 mb-3">Provide a direct link to an image (e.g. Unsplash or Cloudinary url).</p>
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
              </div>

              {formData.image && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Preview</p>
                  <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <img 
                      src={formData.image} 
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <p className="text-xs text-gray-500 mb-3">Numeric value only. Example: 1000</p>
                <input 
                  type="number"
                  min="0"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration text *</label>
                <p className="text-xs text-gray-500 mb-3">How the duration should be displayed. Example: "1 hr", "30 mins", "1 lap"</p>
                <input 
                  type="text"
                  placeholder="e.g. 1 hr"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4">
                <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-200 relative">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-white/90 p-2 rounded-lg text-2xl shadow-sm">
                    {formData.icon}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{formData.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-primary/10 text-primary font-semibold px-3 py-1 rounded-full text-sm">
                      ₹{formData.price.toLocaleString()}
                    </span>
                    <span className="text-gray-500 text-sm">per {formData.duration}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm border-t border-gray-200 pt-4">
                  {formData.description}
                </p>
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
              {sportToEdit ? 'Update Sport' : 'Create Sport'}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}

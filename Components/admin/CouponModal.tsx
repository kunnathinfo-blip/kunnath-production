'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/Components/ui/Button';
import { Card } from '@/Components/ui/Card';
import { useCreateCoupon, useUpdateCoupon, Coupon } from '@/hooks/useCoupons';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  couponToEdit: Coupon | null;
}

export default function CouponModal({ isOpen, onClose, couponToEdit }: CouponModalProps) {
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 0,
    minimumAmount: 0,
    maximumDiscount: '',
    usageLimit: '',
    perUserLimit: 1,
    startDate: '',
    expiryDate: '',
    isActive: true,
    applicableTo: 'stay',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (couponToEdit) {
      setFormData({
        code: couponToEdit.code,
        type: couponToEdit.type,
        value: couponToEdit.value,
        minimumAmount: couponToEdit.minimumAmount,
        maximumDiscount: couponToEdit.maximumDiscount !== undefined ? String(couponToEdit.maximumDiscount) : '',
        usageLimit: couponToEdit.usageLimit !== undefined ? String(couponToEdit.usageLimit) : '',
        perUserLimit: couponToEdit.perUserLimit,
        startDate: couponToEdit.startDate ? new Date(couponToEdit.startDate).toISOString().split('T')[0] : '',
        expiryDate: couponToEdit.expiryDate ? new Date(couponToEdit.expiryDate).toISOString().split('T')[0] : '',
        isActive: couponToEdit.isActive,
        applicableTo: couponToEdit.applicableTo || 'stay',
      });
    } else {
      // Default dates (today to +30 days)
      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setFormData({
        code: '',
        type: 'percentage',
        value: 10,
        minimumAmount: 1000,
        maximumDiscount: '',
        usageLimit: '',
        perUserLimit: 1,
        startDate: today,
        expiryDate: nextMonth,
        isActive: true,
        applicableTo: 'stay',
      });
    }
    setErrors({});
  }, [couponToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.code.trim()) newErrors.code = 'Coupon code is required';
    if (!formData.value || formData.value <= 0) newErrors.value = 'Discount value must be greater than 0';
    if (formData.type === 'percentage' && formData.value > 100) {
      newErrors.value = 'Percentage discount cannot exceed 100%';
    }
    if (formData.minimumAmount < 0) newErrors.minimumAmount = 'Minimum amount cannot be negative';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (formData.startDate && formData.expiryDate && formData.startDate > formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date must be after start date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload: any = {
      code: formData.code.trim().toUpperCase(),
      type: formData.type,
      value: Number(formData.value),
      minimumAmount: Number(formData.minimumAmount),
      maximumDiscount: formData.maximumDiscount ? Number(formData.maximumDiscount) : undefined,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
      perUserLimit: Number(formData.perUserLimit),
      startDate: new Date(formData.startDate + 'T00:00:00Z'),
      expiryDate: new Date(formData.expiryDate + 'T23:59:59Z'),
      isActive: formData.isActive,
      applicableTo: formData.applicableTo,
    };

    try {
      if (couponToEdit) {
        await updateCoupon.mutateAsync({ id: couponToEdit._id, couponData: payload });
      } else {
        await createCoupon.mutateAsync(payload);
      }
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save coupon';
      setErrors({ api: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-gray-900">
            {couponToEdit ? 'Edit Coupon' : 'Create New Coupon'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {errors.api && (
            <div className="p-3 bg-red-55 text-red-600 text-xs font-semibold rounded-xl border border-red-100">
              ⚠️ {errors.api}
            </div>
          )}

          {/* Code and ApplicableTo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Coupon Code</label>
              <input
                type="text"
                placeholder="SAVE20"
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                  errors.code ? 'border-red-500' : 'border-gray-200'
                }`}
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                disabled={!!couponToEdit} // Disable editing the code string to avoid breaking active campaigns
              />
              {errors.code && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.code}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Applicable To</label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={formData.applicableTo}
                onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })}
              >
                <option value="stay">Stay Bookings</option>
                <option value="sport">Sports Bookings</option>
              </select>
            </div>
          </div>

          {/* Type and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Discount Type</label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, value: 0 })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Discount Value {formData.type === 'percentage' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                  errors.value ? 'border-red-500' : 'border-gray-200'
                }`}
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              />
              {errors.value && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.value}</p>}
            </div>
          </div>

          {/* Min Amount & Max Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Min Booking Amount (₹)</label>
              <input
                type="number"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={formData.minimumAmount}
                onChange={(e) => setFormData({ ...formData, minimumAmount: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Max Discount Cap (₹)
              </label>
              <input
                type="number"
                placeholder={formData.type === 'fixed' ? 'N/A' : 'No Limit'}
                disabled={formData.type === 'fixed'}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:bg-gray-50"
                value={formData.maximumDiscount}
                onChange={(e) => setFormData({ ...formData, maximumDiscount: e.target.value })}
              />
            </div>
          </div>

          {/* Usage Limit & Per User Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Total Usage Limit</label>
              <input
                type="number"
                placeholder="No Limit"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Per User Limit</label>
              <input
                type="number"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={formData.perUserLimit}
                onChange={(e) => setFormData({ ...formData, perUserLimit: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Start Date & Expiry Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Start Date</label>
              <input
                type="date"
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                  errors.startDate ? 'border-red-500' : 'border-gray-200'
                }`}
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              {errors.startDate && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Expiry Date</label>
              <input
                type="date"
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                  errors.expiryDate ? 'border-red-500' : 'border-gray-200'
                }`}
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
              {errors.expiryDate && <p className="text-[10px] text-red-500 font-semibold mt-1">{errors.expiryDate}</p>}
            </div>
          </div>

          {/* Active status */}
          <div className="flex items-center gap-3 pt-2">
            <input
              id="isActive"
              type="checkbox"
              className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300 cursor-pointer"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <label htmlFor="isActive" className="text-sm font-semibold text-gray-800 cursor-pointer select-none">
              Coupon is Active and Available for checkout
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : couponToEdit ? 'Save Changes' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

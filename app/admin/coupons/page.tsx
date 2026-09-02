'use client';

import React, { useState } from 'react';
import { useAdminCoupons, useDeleteCoupon, useUpdateCoupon, Coupon } from '@/hooks/useCoupons';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Plus, Edit2, Trash2, Tag, Calendar, Check, X, ShieldAlert } from 'lucide-react';
import CouponModal from '@/Components/admin/CouponModal';
import { formatCurrency } from '@/lib/utils';

export default function AdminCouponsPage() {
  const { data: coupons, isLoading, refetch } = useAdminCoupons();
  const deleteCoupon = useDeleteCoupon();
  const updateCoupon = useUpdateCoupon();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = () => {
    setCouponToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setCouponToEdit(coupon);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteCoupon.mutateAsync(id);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete coupon');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (coupon: Coupon) => {
    try {
      await updateCoupon.mutateAsync({
        id: coupon._id,
        couponData: { isActive: !coupon.isActive },
      });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getCouponStatus = (coupon: Coupon) => {
    if (!coupon.isActive) return { text: 'Inactive', style: 'bg-gray-100 text-gray-600' };
    const now = new Date();
    if (now < new Date(coupon.startDate)) return { text: 'Scheduled', style: 'bg-blue-50 text-blue-600' };
    if (now > new Date(coupon.expiryDate)) return { text: 'Expired', style: 'bg-red-50 text-red-600' };
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { text: 'Limit Reached', style: 'bg-amber-50 text-amber-600' };
    return { text: 'Active', style: 'bg-green-50 text-green-600' };
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
      {/* Header card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 flex items-center gap-2">
            <Tag className="text-primary" /> Manage Coupons
          </h1>
          <p className="text-sm text-gray-500 mt-1">Create, edit, and monitor coupon discount campaigns</p>
        </div>
        <Button onClick={handleAdd} className="shrink-0 group">
          <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Add Coupon
        </Button>
      </div>

      {/* Coupons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {coupons?.map((coupon) => {
          const status = getCouponStatus(coupon);
          return (
            <Card
              key={coupon._id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-100 flex flex-col h-full bg-white relative"
            >
              {/* Top Banner indicating stay vs sport */}
              <div className={`px-4 py-2 text-xs font-bold flex justify-between items-center ${
                coupon.applicableTo === 'sport' ? 'bg-amber-50/50 text-amber-800' : 'bg-green-50/50 text-green-800'
              }`}>
                <span>{coupon.applicableTo === 'sport' ? '🏸 Sports Coupon' : '🏡 Stay Coupon'}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${status.style}`}>
                  {status.text}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight font-mono uppercase">
                      {coupon.code}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Created on {formatDate(coupon.createdAt || '')}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-primary">
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                    </span>
                    <span className="text-[10px] text-gray-400 block">discount</span>
                  </div>
                </div>

                <div className="space-y-2.5 my-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Min. Booking Amount:</span>
                    <span className="font-semibold text-gray-800">₹{coupon.minimumAmount.toLocaleString()}</span>
                  </div>
                  {coupon.type === 'percentage' && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Max. Discount Cap:</span>
                      <span className="font-semibold text-gray-800">
                        {coupon.maximumDiscount ? `₹${coupon.maximumDiscount.toLocaleString()}` : 'No limit'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Overall Usage:</span>
                    <span className="font-semibold text-gray-800">
                      {coupon.usedCount} / {coupon.usageLimit || '∞'} times used
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Per User Limit:</span>
                    <span className="font-semibold text-gray-800">{coupon.perUserLimit} {coupon.perUserLimit === 1 ? 'time' : 'times'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                    <span className="text-gray-500 flex items-center gap-1"><Calendar size={13} /> Validity:</span>
                    <span className="font-semibold text-gray-800 text-[10px]">
                      {formatDate(coupon.startDate)} - {formatDate(coupon.expiryDate)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-auto">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(coupon)}
                  >
                    <Edit2 size={16} className="mr-2" />
                    Edit
                  </Button>
                  
                  {/* Toggle Active status */}
                  <Button
                    variant="outline"
                    className={`flex-none ${coupon.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                    onClick={() => toggleStatus(coupon)}
                    title={coupon.isActive ? 'Click to Deactivate' : 'Click to Activate'}
                  >
                    {coupon.isActive ? <Check size={16} /> : <X size={16} />}
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-none text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                    onClick={() => handleDelete(coupon._id)}
                    disabled={deletingId === coupon._id}
                  >
                    {deletingId === coupon._id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-650 border-t-transparent" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {coupons?.length === 0 && (
          <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Tag className="mx-auto text-gray-400 mb-3" size={40} />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No coupons found</h3>
            <p className="text-sm text-gray-500 mb-6">Create your first coupon discount campaign to drive more stays and activity bookings.</p>
            <Button onClick={handleAdd}>
              Add Coupon
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <CouponModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refetch();
        }}
        couponToEdit={couponToEdit}
      />
    </div>
  );
}

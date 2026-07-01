'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertTriangle, Trash2, CheckCircle2, ShieldAlert, Edit2 } from 'lucide-react';
import { FarmStay, useBlockedDates, useCreateBlock, useDeleteBlock, useUpdateBlock, BlockedDateRange } from '@/hooks/useStays';
import { Button } from '@/Components/ui/Button';

interface BlockDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  stay: FarmStay | null;
}

export default function BlockDatesModal({ isOpen, onClose, stay }: BlockDatesModalProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('Offline Booking');
  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [override, setOverride] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [conflictDetected, setConflictDetected] = useState(false);
  const [editingBlock, setEditingBlock] = useState<BlockedDateRange | null>(null);

  const { data: blocks, isLoading: loadingBlocks, refetch: refetchBlocks } = useBlockedDates(stay?._id || '');
  const { mutate: createBlock, isPending: isCreating } = useCreateBlock();
  const { mutate: deleteBlock, isPending: isDeleting } = useDeleteBlock();
  const { mutate: updateBlock, isPending: isUpdating } = useUpdateBlock();

  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (isOpen) {
      setActiveTab('list');
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen || !stay) return null;

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setReason('Offline Booking');
    setNotes('');
    setCustomerName('');
    setPhoneNumber('');
    setAadhaarNumber('');
    setOverride(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    setConflictDetected(false);
    setEditingBlock(null);
  };

  const handleSubmitBlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!startDate || !endDate || !reason) {
      setErrorMessage('Please select start date, end date, and reason');
      return;
    }

    const payload = {
      startDate,
      endDate,
      reason,
      notes,
      override,
      customerName,
      phoneNumber,
      aadhaarNumber
    };

    const onSuccess = () => {
      setSuccessMessage(editingBlock ? 'Blocked dates updated successfully!' : 'Dates blocked successfully!');
      refetchBlocks();
      setTimeout(() => {
        resetForm();
        setActiveTab('list');
      }, 1500);
    };

    const onError = (err: any) => {
      const status = err.response?.status;
      const msg = err.response?.data?.message || 'Error saving date block';
      if (status === 409) {
        setConflictDetected(true);
      }
      setErrorMessage(msg);
    };

    if (editingBlock) {
      updateBlock(
        {
          stayId: stay._id,
          blockId: editingBlock._id,
          blockData: payload
        },
        {
          onSuccess,
          onError
        }
      );
    } else {
      createBlock(
        {
          stayId: stay._id,
          blockData: payload
        },
        {
          onSuccess,
          onError
        }
      );
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!window.confirm('Are you sure you want to unblock these dates?')) return;

    deleteBlock(
      { stayId: stay._id, blockId },
      {
        onSuccess: () => {
          setSuccessMessage('Dates unblocked successfully!');
          refetchBlocks();
          setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (err: any) => {
          setErrorMessage(err.response?.data?.message || 'Error unblocking dates');
        }
      }
    );
  };

  const formatDateString = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold font-display text-gray-900">Manage Blocked Dates</h2>
            <p className="text-sm text-gray-500">{stay.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-gray-100 bg-gray-50/50 px-4 sm:px-6">
          <button
            onClick={() => { setActiveTab('list'); setErrorMessage(null); setEditingBlock(null); }}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'list' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Blocked Ranges ({blocks?.length || 0})
          </button>
          <button
            onClick={() => { setActiveTab('add'); setErrorMessage(null); }}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'add' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {editingBlock ? 'Edit Blocked Dates' : 'Block New Dates'}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Notifications */}
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm flex items-center gap-3">
              <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
              {conflictDetected && (
                <div className="pl-7 mt-1 flex flex-col gap-2">
                  <p className="text-xs text-red-600">
                    If this is an urgent override (e.g. you have manually resolved the client conflict), you can check the "Override guest bookings" option below and save again.
                  </p>
                  <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={override}
                      onChange={(e) => setOverride(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                      <ShieldAlert size={14} className="text-red-500" /> Force Override Conflicting Bookings
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: Blocks List */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {loadingBlocks ? (
                <div className="flex justify-center py-10">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : blocks?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                  <Calendar className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm font-medium text-gray-600">No dates are currently blocked</p>
                  <p className="text-xs text-gray-400 mt-1">Admins can block stay dates for offline events or maintenance.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {blocks?.map((block) => (
                    <div key={block._id} className="border border-gray-100 rounded-xl p-4 bg-white hover:shadow-sm transition-shadow flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">
                            {formatDateString(block.startDate)} — {formatDateString(block.endDate)}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            block.reason === 'Maintenance' ? 'bg-orange-50 text-orange-600' :
                            block.reason === 'Owner Use' ? 'bg-purple-50 text-purple-600' :
                            block.reason === 'Offline Booking' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                          }`}>
                            {block.reason}
                          </span>
                          {block.isOverride && (
                            <span className="bg-red-50 text-red-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <ShieldAlert size={10} /> Overrode Booking
                            </span>
                          )}
                        </div>
                        {block.notes && (
                          <p className="text-xs text-gray-500 italic">“{block.notes}”</p>
                        )}
                        {(block.customerName || block.phoneNumber || block.aadhaarNumber) && (
                          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg mt-1 space-y-0.5 w-fit border border-gray-100">
                            {block.customerName && <div><span className="font-semibold text-gray-700">Customer:</span> {block.customerName}</div>}
                            {block.phoneNumber && <div><span className="font-semibold text-gray-700">Phone:</span> {block.phoneNumber}</div>}
                            {block.aadhaarNumber && <div><span className="font-semibold text-gray-700">Aadhaar:</span> {block.aadhaarNumber}</div>}
                          </div>
                        )}
                        <p className="text-[10px] text-gray-400">
                          Blocked by: {typeof block.blockedBy === 'object' ? block.blockedBy.name : 'Administrator'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditingBlock(block);
                            setStartDate(block.startDate.split('T')[0]);
                            setEndDate(block.endDate.split('T')[0]);
                            setReason(block.reason);
                            setNotes(block.notes || '');
                            setCustomerName(block.customerName || '');
                            setPhoneNumber(block.phoneNumber || '');
                            setAadhaarNumber(block.aadhaarNumber || '');
                            setOverride(block.isOverride || false);
                            setActiveTab('add');
                          }}
                          className="text-gray-400 hover:text-primary p-2 hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                          title="Edit Blocked Dates"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteBlock(block._id)}
                          disabled={isDeleting}
                          className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-55 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Delete Blocked Dates"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Create/Edit Block Form */}
          {activeTab === 'add' && (
            <form onSubmit={handleSubmitBlock} className="space-y-5 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Block Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Block End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Reason for Block</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm bg-white"
                >
                  <option value="Offline Booking">Offline Booking (OTA, Walk-in, Phone)</option>
                  <option value="Maintenance">Maintenance / Repairs</option>
                  <option value="Owner Use">Owner Use / Personal Hold</option>
                  <option value="Special Event">Special Event / VVIP Hold</option>
                  <option value="Other">Other / Unknown</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Customer Name (Optional)</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone (Optional)</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Aadhaar (Optional)</label>
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="e.g. 1234 5678 9012"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Administrative Notes (Optional)</label>
                <textarea
                  placeholder="e.g. Painting walls, offline group booking for Mr. Rao..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm min-h-[100px]"
                />
              </div>

              <div className="border-t border-gray-100 pt-5 flex justify-end gap-3 bg-white">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { resetForm(); setActiveTab('list'); }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSaving}
                >
                  {editingBlock ? 'Update Date Block' : 'Save Date Block'}
                </Button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

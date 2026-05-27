'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAdminContacts, useMarkAllRead, useDeleteContact, ContactMessage } from '@/hooks/useContact';
import { Card } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Search, Trash2, X, Mail, MailOpen, Calendar as CalendarIcon, User, Phone } from 'lucide-react';

export default function AdminContactPage() {
  const { data: messages, isLoading } = useAdminContacts();
  const { mutate: markAllRead } = useMarkAllRead();
  const { mutate: deleteContact } = useDeleteContact();

  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Mark all as read when the page is opened
  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this enquiry permanently?')) {
      deleteContact(id);
      if (selectedMessage?._id === id) setSelectedMessage(null);
    }
  };

  const filteredMessages = useMemo(() => {
    if (!messages) return [];
    return messages.filter((msg) => {
      const nameMatch = `${msg.firstName} ${msg.lastName}`.toLowerCase().includes(search.toLowerCase());
      const emailMatch = msg.email.toLowerCase().includes(search.toLowerCase());
      const searchMatch = !search || nameMatch || emailMatch;

      const dateMatch = !dateFilter || msg.createdAt.startsWith(dateFilter);

      return searchMatch && dateMatch;
    });
  }, [messages, search, dateFilter]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <h1 className="text-2xl font-bold font-display text-gray-900">Contact Enquiries</h1>
          <p className="text-sm text-gray-500 mt-1">
            {messages?.length || 0} total · {messages?.filter((m) => !m.isRead).length || 0} unread
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <input
          type="date"
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        {(search || dateFilter) && (
          <Button variant="outline" onClick={() => { setSearch(''); setDateFilter(''); }} className="shrink-0">
            Clear Filters
          </Button>
        )}
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold w-8"></th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Subject</th>
                <th className="p-4 font-semibold hidden lg:table-cell">Message</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500">
                    {search || dateFilter ? 'No enquiries match your filters.' : 'No enquiries yet.'}
                  </td>
                </tr>
              ) : (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg._id}
                    className={`transition-colors cursor-pointer hover:bg-gray-50 ${!msg.isRead ? 'bg-primary/[0.03] font-medium' : ''}`}
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <td className="p-4 text-center">
                      {!msg.isRead ? (
                        <Mail size={16} className="text-primary" />
                      ) : (
                        <MailOpen size={16} className="text-gray-400" />
                      )}
                    </td>
                    <td className={`p-4 ${!msg.isRead ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                      {msg.firstName} {msg.lastName}
                    </td>
                    <td className="p-4 text-gray-600">{msg.email}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium">
                        {msg.subject}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 max-w-xs truncate hidden lg:table-cell">
                      {msg.message.substring(0, 60)}{msg.message.length > 60 ? '…' : ''}
                    </td>
                    <td className="p-4 text-gray-500 text-xs whitespace-nowrap">{formatDate(msg.createdAt)}</td>
                    <td className="p-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setSelectedMessage(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedMessage.firstName} {selectedMessage.lastName}</h2>
                <p className="text-sm text-gray-500 mt-0.5">{selectedMessage.subject}</p>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-gray-700">{selectedMessage.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon size={14} className="text-gray-400" />
                  <span className="text-gray-700">{formatDate(selectedMessage.createdAt)}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Message</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-60 overflow-y-auto">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <Button
                variant="outline"
                className="text-red-600 hover:bg-red-50 hover:border-red-200"
                onClick={() => { handleDelete(selectedMessage._id); }}
              >
                <Trash2 size={16} className="mr-2" /> Delete
              </Button>
              <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

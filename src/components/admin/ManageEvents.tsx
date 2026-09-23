import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Plus, Edit2, Trash2, X, Calendar, Clock, MapPin } from 'lucide-react';
import { EventItem } from '../../types';

export const ManageEvents: React.FC = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useSchool();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);

  const [form, setForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'অনুষ্ঠান',
  });

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      title: '',
      date: '15 Jan 2026',
      time: '10:00 - 14:00',
      location: 'বিদ্যালয় প্রাঙ্গণ',
      description: '',
      category: 'অনুষ্ঠান',
    });
    setModalOpen(true);
  };

  const openEditModal = (item: EventItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      date: item.date,
      time: item.time,
      location: item.location,
      description: item.description,
      category: item.category || 'অনুষ্ঠান',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingItem) {
      updateEvent(editingItem.id, form);
    } else {
      addEvent(form);
    }

    setModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ইভেন্ট ব্যবস্থাপনা</h1>
          <p className="text-xs text-gray-500">বিদ্যালয়ের সকল অনুষ্ঠান ও ইভেন্টের সময়সূচি</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ইভেন্ট যোগ করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((evt) => (
          <div key={evt.id} className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  {evt.category || 'ইভেন্ট'}
                </span>
                <span className="text-xs text-gray-400 font-mono">{evt.date}</span>
              </div>
              <h4 className="font-bold text-base text-gray-900 mb-2">{evt.title}</h4>
              <p className="text-xs text-gray-500 mb-4 line-clamp-3">{evt.description}</p>
              <div className="space-y-1 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{evt.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{evt.location}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => openEditModal(evt)}
                className="p-1.5 rounded-md hover:bg-gray-100 text-emerald-700 transition cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`আপনি কি "${evt.title}" মুছে ফেলতে চান?`)) {
                    deleteEvent(evt.id);
                  }
                }}
                className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingItem ? 'ইভেন্ট সম্পাদনা' : 'নতুন ইভেন্ট'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">ইভেন্টের নাম *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">তারিখ *</label>
                  <input
                    type="text"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">সময়</label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">স্থান</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">বিবরণ</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#15803d] hover:bg-[#166534] text-white font-semibold rounded-lg transition cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

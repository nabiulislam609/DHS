import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Plus, Edit2, Trash2, X, Newspaper, Calendar } from 'lucide-react';
import { NewsItem } from '../../types';

export const ManageNews: React.FC = () => {
  const { news, addNews, updateNews, deleteNews } = useSchool();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: 'একাডেমিক',
    date: '',
    summary: '',
    content: '',
    imageUrl: '',
    featured: false,
  });

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      title: '',
      category: 'একাডেমিক',
      date: '22 Sep 2026',
      summary: '',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
      featured: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: NewsItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      category: item.category,
      date: item.date,
      summary: item.summary,
      content: item.content || item.summary,
      imageUrl: item.imageUrl || '',
      featured: !!item.featured,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editingItem) {
      updateNews(editingItem.id, form);
    } else {
      addNews(form);
    }

    setModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">সংবাদ ব্যবস্থাপনা</h1>
          <p className="text-xs text-gray-500">বিদ্যালয়ের সকল সংবাদ ও প্রেস রিলিজ</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সংবাদ যোগ করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {news.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden flex flex-col justify-between">
            {item.imageUrl && (
              <div className="h-44 w-full overflow-hidden relative">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  {item.category}
                </span>
                {item.featured && (
                  <span className="absolute top-3 right-3 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    ফিচার্ড
                  </span>
                )}
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-gray-400 font-mono block mb-1">{item.date}</span>
                <h4 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2">{item.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-3">{item.summary}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-emerald-700 transition cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`আপনি কি এই সংবাদটি মুছে ফেলতে চান?`)) {
                      deleteNews(item.id);
                    }
                  }}
                  className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingItem ? 'সংবাদ সম্পাদনা' : 'নতুন সংবাদ'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">সংবাদের শিরোনাম *</label>
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
                  <label className="block font-bold text-gray-700 mb-1">ক্যাটাগরি</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">তারিখ</label>
                  <input
                    type="text"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ছবির URL</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">সংক্ষেপ (সারমর্ম) *</label>
                <textarea
                  rows={2}
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">পূর্ণ সংবাদ বক্তব্য</label>
                <textarea
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredNews"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <label htmlFor="featuredNews" className="text-gray-700 font-medium cursor-pointer">
                  হোমপেজে প্রধান সংবাদ (Featured) হিসেবে দেখান
                </label>
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

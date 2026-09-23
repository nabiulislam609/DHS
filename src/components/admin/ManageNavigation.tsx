import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { NavigationItem } from '../../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  RotateCcw,
  Compass,
  Sparkles,
  Link,
  HelpCircle,
} from 'lucide-react';

export const ManageNavigation: React.FC = () => {
  const {
    navigationItems,
    addNavigationItem,
    updateNavigationItem,
    deleteNavigationItem,
    toggleNavigationItemVisible,
    moveNavigationItem,
    resetNavigationItems,
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);

  const [form, setForm] = useState({
    label: '',
    url: '',
    iconName: '—',
    order: 0,
    visible: true,
  });

  // Sorted items by their order
  const sortedItems = [...navigationItems].sort((a, b) => a.order - b.order);

  // Filtered by search query if any
  const filteredItems = sortedItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Visible items for live preview
  const visiblePreviewItems = sortedItems.filter(
    (item) =>
      item.visible &&
      item.url !== '#teachers' &&
      item.url !== '#staff' &&
      item.label !== 'শিক্ষক' &&
      !item.label.includes('কর্মচারী')
  );

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      label: '',
      url: '#',
      iconName: '—',
      order: navigationItems.length,
      visible: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: NavigationItem) => {
    setEditingItem(item);
    setForm({
      label: item.label,
      url: item.url,
      iconName: item.iconName || '—',
      order: item.order,
      visible: item.visible,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label.trim()) return;

    if (editingItem) {
      updateNavigationItem(editingItem.id, form);
    } else {
      addNavigationItem(form);
    }
    setModalOpen(false);
  };

  const handleReset = () => {
    if (
      window.confirm(
        'আপনি কি নিশ্চিত যে সমস্ত মেনু ডিফল্ট ক্রমে এবং অবস্থায় ফিরিয়ে আনতে চান?'
      )
    ) {
      resetNavigationItems();
    }
  };

  // Preset links helper for convenience
  const presetLinks = [
    { label: 'হোম', url: '#home' },
    { label: 'পরিচিতি', url: '#about' },
    { label: 'নোটিশ', url: '#notices' },
    { label: 'ফলাফল', url: '/results' },
    { label: 'সংবাদ', url: '#news' },
    { label: 'ইভেন্ট', url: '#events' },
    { label: 'একাডেমিক', url: '#programs' },
    { label: 'গ্যালারি', url: '#gallery' },
    { label: 'যোগাযোগ', url: '#contact' },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              নেভিগেশন মেনু নিয়ন্ত্রণ
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {navigationItems.length} টি মেনু
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ওয়েবসাইটের হেডার মেনু ইচ্ছামতো দেখান/লুকান (Show/Hide) এবং আগে-পিছে ক্রম পরিবর্তন (Re-order) করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
            title="ডিফল্ট অবস্থায় ফিরিয়ে আনুন"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ডিফল্ট রিসেট</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন মেনু যোগ করুন</span>
          </button>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-850 to-emerald-950 rounded-2xl p-4 sm:p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-300" />
            <h3 className="text-xs sm:text-sm font-bold tracking-wide">
              লাইভ প্রিভিউ: ওয়েবসাইটে মেনু যে ক্রমে দৃশ্যমান হচ্ছে
            </h3>
          </div>
          <span className="text-[11px] text-emerald-200 bg-emerald-800/80 px-2.5 py-0.5 rounded-full border border-emerald-700/60 self-start sm:self-auto">
            দৃশ্যমান: {visiblePreviewItems.length} টি
          </span>
        </div>

        {/* Horizontal Mini-Navbar Preview */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/15 overflow-x-auto scrollbar-none flex items-center gap-2">
          {visiblePreviewItems.map((item, index) => (
            <div
              key={item.id}
              className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-2xs border border-white/10"
            >
              <span className="text-[10px] text-amber-300 font-mono font-bold">
                {index + 1}.
              </span>
              <span>{item.label}</span>
              {item.label === 'পরিচিতি' && (
                <span className="text-[9px] bg-emerald-700/80 px-1 py-0.2 rounded text-emerald-100">
                  ড্রপডাউন
                </span>
              )}
            </div>
          ))}

          {visiblePreviewItems.length === 0 && (
            <span className="text-xs text-emerald-200 py-1 italic">
              কোনো মেনু বর্তমানে দৃশ্যমান নেই। নিচে থেকে দৃশ্যমান করুন।
            </span>
          )}
        </div>
      </div>

      {/* Instruction Tip */}
      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>সহজ নির্দেশনা:</strong> মেনুর পজিশন বা স্থান আগে-পিছে নিতে টেবিলে থাকা <strong>“↑ উপরে”</strong> এবং <strong>“↓ নিচে”</strong> বাটনে ক্লিক করুন। যেকোনো মেনু সাময়িকভাবে লুকানোর জন্য <strong>“স্ট্যাটাস”</strong> টগল সুইচে ক্লিক করলেই সঙ্গে সঙ্গে মূল ওয়েবসাইট আপডেট হয়ে যাবে।
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="মেনু বা লিঙ্ক দিয়ে খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
        />
      </div>

      {/* Navigation Re-order & Toggle Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-[#fcfaf7] text-gray-700 font-bold uppercase text-[11px] border-b border-gray-200/80">
              <tr>
                <th className="py-3.5 px-4 w-14 text-center">ক্রম</th>
                <th className="py-3.5 px-4 w-32 text-center">পজিশন পরিবর্তন</th>
                <th className="py-3.5 px-4">মেনুর নাম</th>
                <th className="py-3.5 px-4">লিঙ্ক / সেকশন</th>
                <th className="py-3.5 px-4 w-40 text-center">প্রদর্শন (Show/Hide)</th>
                <th className="py-3.5 px-4 text-right w-24">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item, index) => {
                const isFirst = index === 0;
                const isLast = index === filteredItems.length - 1;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50/70 transition ${
                      !item.visible ? 'bg-gray-50/50 opacity-75' : ''
                    }`}
                  >
                    {/* Order Index */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold text-xs">
                        {item.order + 1}
                      </span>
                    </td>

                    {/* Move Up / Down Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5 shadow-2xs">
                        <button
                          type="button"
                          disabled={isFirst}
                          onClick={() => moveNavigationItem(item.id, 'up')}
                          className={`p-1.5 rounded-md transition cursor-pointer ${
                            isFirst
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-emerald-600 hover:text-white'
                          }`}
                          title="উপরে নিন (আগে দেখান)"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] text-gray-300">|</span>
                        <button
                          type="button"
                          disabled={isLast}
                          onClick={() => moveNavigationItem(item.id, 'down')}
                          className={`p-1.5 rounded-md transition cursor-pointer ${
                            isLast
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-emerald-600 hover:text-white'
                          }`}
                          title="নিচে নিন (পরে দেখান)"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Menu Label */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">
                          {item.label}
                        </span>
                        {item.label === 'পরিচিতি' && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium border border-emerald-200">
                            সাবমেনু ড্রপডাউন
                          </span>
                        )}
                        {item.label === 'ফলাফল' && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium border border-amber-200">
                            অনলাইন ফলাফল
                          </span>
                        )}
                      </div>
                    </td>

                    {/* URL */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 inline-flex items-center gap-1 border border-gray-200/60">
                        <Link className="w-3 h-3 text-gray-400" />
                        {item.url}
                      </span>
                    </td>

                    {/* Show / Hide Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => toggleNavigationItemVisible(item.id)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                            item.visible ? 'bg-emerald-700' : 'bg-gray-300'
                          }`}
                          title={item.visible ? 'লুকান' : 'প্রদর্শন করুন'}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                              item.visible ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>

                        <span
                          className={`text-xs font-semibold inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                            item.visible
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}
                        >
                          {item.visible ? (
                            <>
                              <Eye className="w-3 h-3 text-emerald-600" />
                              <span>দৃশ্যমান</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 text-gray-400" />
                              <span>লুকানো</span>
                            </>
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-emerald-700 transition cursor-pointer"
                          title="সম্পাদনা করুন"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `আপনি কি "${item.label}" মেনুটি সম্পূর্ণ মুছে ফেলতে চান?`
                              )
                            ) {
                              deleteNavigationItem(item.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    কোনো মেনু পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {editingItem ? 'মেনু সম্পাদনা করুন' : 'নতুন মেনু আইটেম যুক্ত করুন'}
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              মেনুর নাম, লিঙ্ক ও প্রদর্শন নির্ধারণ করুন
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  মেনুর নাম (লেবেল) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: নোটিশ, ফলাফল, গ্যালারি"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  লিঙ্ক / সেকশন URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: #notices, /results, #contact"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />

                {/* Preset suggestions */}
                <div className="mt-2">
                  <span className="text-[10px] text-gray-400 font-medium block mb-1">
                    কুইক প্রি-সেট লিঙ্ক নির্বাচন করুন:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {presetLinks.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            label: form.label || preset.label,
                            url: preset.url,
                          })
                        }
                        className="text-[10px] bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-800 px-2 py-0.5 rounded cursor-pointer transition border border-gray-200"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    পজিশন ক্রম
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="modal-visible-check"
                    checked={form.visible}
                    onChange={(e) =>
                      setForm({ ...form, visible: e.target.checked })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 cursor-pointer"
                  />
                  <label
                    htmlFor="modal-visible-check"
                    className="text-xs font-semibold text-gray-700 cursor-pointer"
                  >
                    ওয়েবসাইটে দৃশ্যমান
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {editingItem ? 'আপডেট করুন' : 'যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

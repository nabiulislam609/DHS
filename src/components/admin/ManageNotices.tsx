import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Pin,
  Tag,
  Calendar,
  Upload,
  FileText,
  Image as ImageIcon,
  Paperclip,
} from 'lucide-react';
import { Notice } from '../../types';
import { processNoticeFile } from '../../utils/imageUpload';

export const ManageNotices: React.FC = () => {
  const { notices, addNotice, updateNotice, deleteNotice, togglePinNotice } = useSchool();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    title: '',
    code: '',
    category: 'জরুরি' as Notice['category'],
    date: '',
    content: '',
    pinned: false,
    attachmentUrl: '' as string | undefined,
    attachmentType: undefined as 'image' | 'pdf' | undefined,
    attachmentName: '' as string | undefined,
    attachmentSize: '' as string | undefined,
  });

  const openAddModal = () => {
    setEditingNotice(null);
    setUploadError(null);
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateFormatted = `${String(today.getDate()).padStart(2, '0')} ${months[today.getMonth()]} ${today.getFullYear()}`;

    setForm({
      title: '',
      code: `${100 + notices.length + 1}`,
      category: 'জরুরি',
      date: dateFormatted,
      content: '',
      pinned: false,
      attachmentUrl: undefined,
      attachmentType: undefined,
      attachmentName: undefined,
      attachmentSize: undefined,
    });
    setModalOpen(true);
  };

  const openEditModal = (n: Notice) => {
    setEditingNotice(n);
    setUploadError(null);
    setForm({
      title: n.title,
      code: n.code || '',
      category: n.category,
      date: n.date,
      content: n.content,
      pinned: !!n.pinned,
      attachmentUrl: n.attachmentUrl,
      attachmentType: n.attachmentType,
      attachmentName: n.attachmentName,
      attachmentSize: n.attachmentSize,
    });
    setModalOpen(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadError(null);
      setIsProcessingFile(true);
      const res = await processNoticeFile(file);
      setForm((prev) => ({
        ...prev,
        attachmentUrl: res.dataUrl,
        attachmentType: res.type,
        attachmentName: res.name,
        attachmentSize: res.size,
      }));
    } catch (err: any) {
      setUploadError(err.message || 'ফাইলটি আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setIsProcessingFile(false);
      e.target.value = '';
    }
  };

  const handleRemoveAttachment = () => {
    setForm((prev) => ({
      ...prev,
      attachmentUrl: undefined,
      attachmentType: undefined,
      attachmentName: undefined,
      attachmentSize: undefined,
    }));
    setUploadError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const noticePayload = {
      title: form.title.trim(),
      code: form.code.trim(),
      category: form.category,
      date: form.date.trim(),
      content: form.content.trim(),
      pinned: form.pinned,
      attachmentUrl: form.attachmentUrl,
      attachmentType: form.attachmentType,
      attachmentName: form.attachmentName,
      attachmentSize: form.attachmentSize,
    };

    if (editingNotice) {
      updateNotice(editingNotice.id, noticePayload);
    } else {
      addNotice(noticePayload);
    }

    setModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">নোটিশ ব্যবস্থাপনা</h1>
          <p className="text-xs text-gray-500">বিদ্যালয়ের সকল নোটিশ প্রকাশ, ছবি/পিডিএফ সংযুক্তি ও পরিচালনা</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন নোটিশ তৈরি করুন</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="divide-y divide-gray-100">
          {notices.map((n) => (
            <div key={n.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/60 transition">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded">
                    {n.category}
                  </span>
                  {n.code && (
                    <span className="text-xs font-mono text-gray-400">
                      কোড: {n.code}
                    </span>
                  )}
                  {n.pinned && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Pin className="w-3 h-3 fill-amber-500" />
                      পিন্ড
                    </span>
                  )}
                  {n.attachmentUrl && (
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${
                        n.attachmentType === 'pdf'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {n.attachmentType === 'pdf' ? (
                        <>
                          <FileText className="w-3 h-3 text-rose-600" />
                          <span>PDF সংযুক্ত</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3 h-3 text-blue-600" />
                          <span>ছবি সংযুক্ত</span>
                        </>
                      )}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">• {n.date}</span>
                </div>

                <h3 className="text-sm font-bold text-gray-900">{n.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{n.content}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => togglePinNotice(n.id)}
                  className={`p-2 rounded-lg text-xs font-medium border transition cursor-pointer flex items-center gap-1 ${
                    n.pinned
                      ? 'bg-amber-50 border-amber-200 text-amber-800'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}
                  title={n.pinned ? 'পিন মুক্ত করুন' : 'হোমপেজে পিন করুন'}
                >
                  <Pin className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{n.pinned ? 'আনপিন' : 'পিন'}</span>
                </button>

                <button
                  onClick={() => openEditModal(n)}
                  className="p-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                  title="সম্পাদনা করুন"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`আপনি কি "${n.title}" মুছে ফেলতে চান?`)) {
                      deleteNotice(n.id);
                    }
                  }}
                  className="p-2 rounded-lg text-xs font-medium border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingNotice ? 'নোটিশ সম্পাদনা করুন' : 'নতুন নোটিশ তৈরি করুন'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-gray-700 mb-1">নোটিশের শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ২০২৪ শিক্ষাবর্ষে ভর্তি বিজ্ঞপ্তি"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">কোড (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    placeholder="101"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="জরুরি">জরুরি</option>
                    <option value="ভর্তি">ভর্তি</option>
                    <option value="পরীক্ষা">পরীক্ষা</option>
                    <option value="ক্রীড়া">ক্রীড়া</option>
                    <option value="সাধারণ">সাধারণ</option>
                    <option value="অনুষ্ঠান">অনুষ্ঠান</option>
                    <option value="গুরুত্বপূর্ণ">গুরুত্বপূর্ণ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">তারিখ</label>
                  <input
                    type="text"
                    placeholder="যেমন: 22 Sep 2026"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">নোটিশের বিবরণ / বিষয়বস্তু *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="নোটিশের বিস্তারিত বক্তব্য..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 resize-none"
                />
              </div>

              {/* Photo or PDF Attachment Section */}
              <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-700 flex items-center gap-1.5 text-xs">
                    <Paperclip className="w-3.5 h-3.5 text-emerald-700" />
                    <span>ছবি অথবা পিডিএফ ফাইল সংযুক্তি (ডিভাইস থেকে)</span>
                  </label>
                  <span className="text-[10px] text-gray-500">ছবি বা PDF (সর্বোচ্চ ৮MB)</span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,application/pdf,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {!form.attachmentUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-emerald-500 rounded-xl p-4 text-center bg-white cursor-pointer transition hover:bg-emerald-50/30 group"
                  >
                    <div className="flex items-center justify-center gap-3 text-gray-400 group-hover:text-emerald-700 mb-1.5">
                      <ImageIcon className="w-5 h-5" />
                      <span className="text-gray-300">|</span>
                      <FileText className="w-5 h-5 text-rose-500" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700 group-hover:text-emerald-800">
                      ডিভাইস থেকে ছবি বা পিডিএফ নির্বাচন করতে ক্লিক করুন
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      JPG, PNG, WebP অথবা PDF ডকুমেন্ট আপলোড করা যাবে
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {form.attachmentType === 'image' ? (
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-100 flex items-center justify-center">
                          <img
                            src={form.attachmentUrl}
                            alt="Attachment preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-rose-50 border border-rose-200 flex flex-col items-center justify-center shrink-0 text-rose-700">
                          <FileText className="w-6 h-6 mb-0.5 text-rose-600" />
                          <span className="text-[9px] font-bold">PDF</span>
                        </div>
                      )}

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              form.attachmentType === 'image'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {form.attachmentType === 'image' ? 'ছবি সংযুক্ত' : 'পিডিএফ ডকুমেন্ট'}
                          </span>
                          {form.attachmentSize && (
                            <span className="text-[10px] text-gray-400 font-mono">
                              {form.attachmentSize}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {form.attachmentName || (form.attachmentType === 'image' ? 'সংযুক্ত ছবি' : 'সংযুক্ত পিডিএফ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition cursor-pointer border border-emerald-200"
                      >
                        পরিবর্তন করুন
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer border border-rose-200"
                      >
                        মুছে ফেলুন
                      </button>
                    </div>
                  </div>
                )}

                {isProcessingFile && (
                  <p className="text-[11px] text-emerald-700 font-medium animate-pulse">
                    ফাইল প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
                  </p>
                )}
                {uploadError && (
                  <p className="text-[11px] text-rose-600 font-medium">{uploadError}</p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinnedCheck"
                  checked={form.pinned}
                  onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="pinnedCheck" className="text-gray-700 font-medium cursor-pointer">
                  হোমপেজে প্রধান পিন করা নোটিশ হিসেবে প্রদর্শন করুন
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

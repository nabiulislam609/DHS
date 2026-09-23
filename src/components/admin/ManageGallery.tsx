import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { GalleryAlbum } from '../../types';

export const ManageGallery: React.FC = () => {
  const { galleryAlbums, addGalleryAlbum, deleteGalleryAlbum, addImageToAlbum } = useSchool();
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');

  const [albumForm, setAlbumForm] = useState({
    title: '',
    category: 'campus',
    imageUrl: '',
    itemCountText: '১ টি ছবি',
  });

  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumForm.title.trim()) return;

    addGalleryAlbum({
      title: albumForm.title,
      category: albumForm.category,
      imageUrl: albumForm.imageUrl || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80',
      itemCountText: '১ টি ছবি',
      images: [albumForm.imageUrl || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80'],
    });

    setAlbumModalOpen(false);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim() || !selectedAlbumId) return;

    addImageToAlbum(selectedAlbumId, newPhotoUrl.trim());
    setNewPhotoUrl('');
    setPhotoModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">গ্যালারি ব্যবস্থাপনা</h1>
          <p className="text-xs text-gray-500">বিদ্যালয়ের সকল ফটো অ্যালবাম ও ছবি ব্যবস্থাপনা</p>
        </div>
        <button
          onClick={() => setAlbumModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অ্যালবাম তৈরি করুন</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryAlbums.map((alb) => (
          <div key={alb.id} className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden flex flex-col justify-between group">
            <div className="h-44 relative overflow-hidden">
              <img src={alb.imageUrl} alt={alb.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute top-2 right-2 bg-black/60 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {alb.images?.length || 1} টি ছবি
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {alb.category}
                </span>
                <h4 className="font-bold text-sm text-gray-900 mt-1">{alb.title}</h4>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-3">
                <button
                  onClick={() => {
                    setSelectedAlbumId(alb.id);
                    setPhotoModalOpen(true);
                  }}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ছবি যোগ করুন</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`আপনি কি "${alb.title}" অ্যালবামটি মুছে ফেলতে চান?`)) {
                      deleteGalleryAlbum(alb.id);
                    }
                  }}
                  className="p-1 rounded text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Album Modal */}
      {albumModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setAlbumModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">নতুন অ্যালবাম তৈরি করুন</h3>

            <form onSubmit={handleCreateAlbum} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">অ্যালবামের নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: বার্ষিক পুরস্কার বিতরণী"
                  value={albumForm.title}
                  onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ক্যাটাগরি</label>
                <select
                  value={albumForm.category}
                  onChange={(e) => setAlbumForm({ ...albumForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="campus">Campus</option>
                  <option value="classroom">Classroom</option>
                  <option value="sports">Sports</option>
                  <option value="cultural">Cultural</option>
                  <option value="science">Science</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">কভার ছবির URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={albumForm.imageUrl}
                  onChange={(e) => setAlbumForm({ ...albumForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAlbumModalOpen(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#15803d] hover:bg-[#166534] text-white font-semibold rounded-lg transition cursor-pointer"
                >
                  অ্যালবাম তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setPhotoModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-gray-900 mb-3">অ্যালবামে নতুন ছবি যোগ করুন</h3>

            <form onSubmit={handleAddPhoto} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">ছবির লিঙ্ক (Image URL) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(false)}
                  className="px-3 py-1.5 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#15803d] hover:bg-[#166534] text-white font-semibold rounded-lg transition cursor-pointer"
                >
                  ছবি যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

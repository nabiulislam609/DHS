import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Plus, Trash2, X, Image as ImageIcon, Upload } from 'lucide-react';
import { compressImageFile } from '../../utils/imageUpload';

export const ManageGallery: React.FC = () => {
  const { galleryAlbums, addGalleryAlbum, deleteGalleryAlbum, addImageToAlbum } = useSchool();
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const albumFileRef = useRef<HTMLInputElement | null>(null);
  const photoFileRef = useRef<HTMLInputElement | null>(null);

  const [albumForm, setAlbumForm] = useState({
    title: '',
    category: 'campus',
    imageUrl: '',
    itemCountText: '১ টি ছবি',
  });

  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const handleAlbumFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const base64 = await compressImageFile(file, 1000, 700, 0.82);
      setAlbumForm((prev) => ({ ...prev, imageUrl: base64 }));
    } catch (err: any) {
      alert(err.message || 'ছবি আপলোড করতে ব্যর্থ হয়েছে');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handlePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const base64 = await compressImageFile(file, 1000, 700, 0.82);
      setNewPhotoUrl(base64);
    } catch (err: any) {
      alert(err.message || 'ছবি আপলোড করতে ব্যর্থ হয়েছে');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

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
          onClick={() => {
            setAlbumForm({
              title: '',
              category: 'campus',
              imageUrl: '',
              itemCountText: '১ টি ছবি',
            });
            setAlbumModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অ্যালবাম তৈরি করুন</span>
        </button>
      </div>

      {/* Album Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {galleryAlbums.map((album) => (
          <div
            key={album.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs group"
          >
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img
                src={album.imageUrl}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (confirm(`আপনি কি "${album.title}" অ্যালবামটি মুছে ফেলতে চান?`)) {
                      deleteGalleryAlbum(album.id);
                    }
                  }}
                  className="bg-black/60 hover:bg-rose-600 text-white p-1.5 rounded-lg backdrop-blur-xs transition cursor-pointer"
                  title="অ্যালবাম মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded uppercase font-semibold">
                {album.category}
              </span>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-sm">{album.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {album.images ? `${album.images.length} টি ছবি` : album.itemCountText}
              </p>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedAlbumId(album.id);
                    setNewPhotoUrl('');
                    setPhotoModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ছবি যোগ করুন</span>
                </button>
                <span className="text-[11px] text-gray-400">ID: {album.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Album Modal */}
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

            <form onSubmit={handleCreateAlbum} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">অ্যালবামের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৫"
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

              {/* Photo Upload for Album Cover */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-700 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                    <span>কভার ছবি</span>
                  </label>
                  <input
                    type="file"
                    ref={albumFileRef}
                    accept="image/*"
                    onChange={handleAlbumFile}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => albumFileRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-1 bg-[#15803d] text-white px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>ডিভাইস থেকে ফটো নির্বাচন</span>
                  </button>
                </div>

                {albumForm.imageUrl && (
                  <div className="relative h-28 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={albumForm.imageUrl}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <input
                  type="text"
                  placeholder="বা সরাসরি ছবির URL দিন"
                  value={albumForm.imageUrl}
                  onChange={(e) => setAlbumForm({ ...albumForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono focus:outline-hidden focus:border-emerald-600"
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
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-700">ছবি নির্বাচন</label>
                  <input
                    type="file"
                    ref={photoFileRef}
                    accept="image/*"
                    onChange={handlePhotoFile}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => photoFileRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-1 bg-[#15803d] text-white px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>ডিভাইস থেকে আপলোড</span>
                  </button>
                </div>

                {newPhotoUrl && (
                  <div className="relative h-28 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={newPhotoUrl}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <input
                  type="text"
                  placeholder="বা ছবির URL দিন"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono focus:outline-hidden focus:border-emerald-600"
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

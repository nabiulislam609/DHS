import React, { useState, useRef } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Plus,
  Trash2,
  Edit2,
  X,
  Upload,
  Camera,
  Image as ImageIcon,
  CheckCircle,
  Briefcase,
  Users,
} from 'lucide-react';
import { Staff } from '../../types';
import { compressImageFile } from '../../utils/imageUpload';

export const ManageStaff: React.FC = () => {
  const { staff, addStaff, updateStaff, deleteStaff } = useSchool();

  // Add form state
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');
  const [newStaffDept, setNewStaffDept] = useState('প্রশাসন');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffImage, setNewStaffImage] = useState<string | undefined>(undefined);
  const [addUploadError, setAddUploadError] = useState<string | null>(null);
  const addFileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit modal state
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    designation: '',
    department: '',
    phone: '',
    email: '',
    image: undefined as string | undefined,
  });
  const [editUploadError, setEditUploadError] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  // Success alert
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Image upload for Add form
  const handleAddImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setAddUploadError(null);
      const dataUrl = await compressImageFile(file, 400, 400, 0.85);
      setNewStaffImage(dataUrl);
    } catch (err: any) {
      setAddUploadError(err.message || 'ছবি আপলোড করতে ব্যর্থ হয়েছে');
    } finally {
      e.target.value = '';
    }
  };

  // Image upload for Edit form
  const handleEditImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setEditUploadError(null);
      const dataUrl = await compressImageFile(file, 400, 400, 0.85);
      setEditForm((prev) => ({ ...prev, image: dataUrl }));
    } catch (err: any) {
      setEditUploadError(err.message || 'ছবি আপলোড করতে ব্যর্থ হয়েছে');
    } finally {
      e.target.value = '';
    }
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newStaffRole.trim()) return;

    addStaff({
      name: newStaffName.trim(),
      designation: newStaffRole.trim(),
      department: newStaffDept.trim() || 'প্রশাসন',
      phone: newStaffPhone.trim() || '+8801700000000',
      email: newStaffEmail.trim() || 'staff@dadrahs.edu.bd',
      initial: newStaffName.trim().charAt(0),
      image: newStaffImage,
    });

    setNewStaffName('');
    setNewStaffRole('');
    setNewStaffDept('প্রশাসন');
    setNewStaffPhone('');
    setNewStaffEmail('');
    setNewStaffImage(undefined);
    setAddUploadError(null);
    showNotification('নতুন কর্মচারী সফলভাবে যুক্ত করা হয়েছে');
  };

  const openEditModal = (s: Staff) => {
    setEditingStaff(s);
    setEditUploadError(null);
    setEditForm({
      name: s.name,
      designation: s.designation || s.role || '',
      department: s.department || 'প্রশাসন',
      phone: s.phone || '',
      email: s.email || '',
      image: s.image,
    });
  };

  const handleUpdateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff || !editForm.name.trim()) return;

    updateStaff(editingStaff.id, {
      name: editForm.name.trim(),
      designation: editForm.designation.trim(),
      department: editForm.department.trim(),
      phone: editForm.phone.trim(),
      email: editForm.email.trim(),
      initial: editForm.name.trim().charAt(0),
      image: editForm.image,
    });

    setEditingStaff(null);
    showNotification('কর্মচারীর তথ্য সফলভাবে আপডেট করা হয়েছে');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">কর্মচারী ব্যবস্থাপনা</h1>
          <p className="text-xs text-gray-500">বিদ্যালয়ের অফিস, ল্যাব ও নিরাপত্তা সহকর্মীদের তালিকা</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>মোট কর্মচারী: {staff.length} জন</span>
          </span>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-xs font-semibold shadow-xs animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Add Staff form with Device Photo Upload */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>নতুন কর্মচারী যুক্ত করুন</span>
          </h3>
        </div>

        <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
          {/* Photo upload from device box */}
          <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200">
            <label className="block font-bold text-gray-700 mb-2 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-emerald-700" />
              <span>কর্মচারীর ছবি (ডিভাইস থেকে যুক্ত করুন)</span>
            </label>

            <div className="flex items-center gap-4">
              {/* Photo Preview Circle */}
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 overflow-hidden bg-white flex items-center justify-center shrink-0 relative shadow-2xs">
                {newStaffImage ? (
                  <img src={newStaffImage} alt="Staff Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-gray-400 p-1">
                    <ImageIcon className="w-5 h-5 mx-auto mb-0.5 text-gray-300" />
                    <span className="text-[8px] block">ছবি নেই</span>
                  </div>
                )}
              </div>

              {/* Upload actions */}
              <div className="space-y-1.5 flex-1">
                <input
                  type="file"
                  ref={addFileInputRef}
                  accept="image/*"
                  onChange={handleAddImageChange}
                  className="hidden"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{newStaffImage ? 'ছবি পরিবর্তন করুন' : 'ডিভাইস থেকে ছবি আপলোড'}</span>
                  </button>

                  {newStaffImage && (
                    <button
                      type="button"
                      onClick={() => setNewStaffImage(undefined)}
                      className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition cursor-pointer border border-rose-200"
                    >
                      ছবি মুছুন
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-gray-500">JPG, PNG বা WebP ফরম্যাট (স্বয়ংক্রিয় রিসাইজ ও অপ্টিমাইজ হবে)</p>
                {addUploadError && (
                  <p className="text-[11px] text-rose-600 font-medium">{addUploadError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-gray-600 mb-1">কর্মচারীর নাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: মোঃ রমিজ উদ্দিন"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">পদবী *</label>
              <input
                type="text"
                required
                placeholder="যেমন: প্রধান সহকারী"
                value={newStaffRole}
                onChange={(e) => setNewStaffRole(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">শাখা / বিভাগ</label>
              <input
                type="text"
                placeholder="যেমন: প্রশাসন / হিসাব / ল্যাব"
                value={newStaffDept}
                onChange={(e) => setNewStaffDept(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-600 mb-1">মোবাইল নম্বর</label>
              <input
                type="text"
                placeholder="+88017..."
                value={newStaffPhone}
                onChange={(e) => setNewStaffPhone(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="bg-[#15803d] hover:bg-[#166534] text-white px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>যোগ করুন</span>
            </button>
          </div>
        </form>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 uppercase font-bold text-[11px] border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">ছবি</th>
                <th className="py-3.5 px-4">নাম</th>
                <th className="py-3.5 px-4">পদবী</th>
                <th className="py-3.5 px-4">শাখা / বিভাগ</th>
                <th className="py-3.5 px-4">মোবাইল নম্বর</th>
                <th className="py-3.5 px-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3 px-4">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-emerald-800 text-xs shrink-0 shadow-2xs">
                      {s.image ? (
                        <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{s.initial || s.name.charAt(0)}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">{s.name}</td>
                  <td className="py-3 px-4 text-emerald-800 font-semibold">{s.designation || s.role}</td>
                  <td className="py-3 px-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">
                      {s.department || 'প্রশাসন'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-500">{s.phone}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-emerald-700 transition cursor-pointer"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${s.name}" কে তালিকা থেকে মুছে ফেলতে চান?`)) {
                            deleteStaff(s.id);
                          }
                        }}
                        className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingStaff(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              কর্মচারীর তথ্য ও ছবি সম্পাদনা
            </h3>

            <form onSubmit={handleUpdateStaff} className="space-y-4 text-xs">
              {/* Device Photo Upload in Modal */}
              <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200">
                <label className="block font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-700" />
                  <span>কর্মচারীর ছবি (ডিভাইস থেকে যুক্ত বা পরিবর্তন করুন)</span>
                </label>

                <div className="flex items-center gap-4">
                  {/* Photo Preview Circle */}
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 overflow-hidden bg-white flex items-center justify-center shrink-0 relative shadow-2xs">
                    {editForm.image ? (
                      <img src={editForm.image} alt="Staff Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400 p-1">
                        <ImageIcon className="w-6 h-6 mx-auto mb-0.5 text-gray-300" />
                        <span className="text-[9px] block">ছবি নেই</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Actions */}
                  <div className="space-y-1.5 flex-1">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{editForm.image ? 'ছবি পরিবর্তন করুন' : 'ডিভাইস থেকে ছবি আপলোড'}</span>
                      </button>

                      {editForm.image && (
                        <button
                          type="button"
                          onClick={() => setEditForm((prev) => ({ ...prev, image: undefined }))}
                          className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition cursor-pointer border border-rose-200"
                        >
                          ছবি মুছুন
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500">JPG, PNG বা WebP ফরম্যাট (স্বয়ংক্রিয় রিসাইজ ও অপ্টিমাইজ হবে)</p>
                    {editUploadError && (
                      <p className="text-[11px] text-rose-600 font-medium">{editUploadError}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">কর্মচারীর নাম *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">পদবী *</label>
                  <input
                    type="text"
                    required
                    value={editForm.designation}
                    onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">শাখা / বিভাগ</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">ইমেইল</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
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

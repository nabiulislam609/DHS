import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { X, CheckCircle, GraduationCap } from 'lucide-react';

export const AdmissionModal: React.FC = () => {
  const { isAdmissionModalOpen, setIsAdmissionModalOpen, submitAdmission } = useSchool();

  const [formData, setFormData] = useState({
    applicantName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: 'ছাত্র' as 'ছাত্র' | 'ছাত্রী',
    applyingClass: '৬ষ্ঠ শ্রেণি',
    previousSchool: '',
    gpaOrGrade: '',
    phone: '',
    email: '',
    presentAddress: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isAdmissionModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.phone) return;

    submitAdmission(formData);
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setIsAdmissionModalOpen(false);
    setFormData({
      applicantName: '',
      fatherName: '',
      motherName: '',
      dateOfBirth: '',
      gender: 'ছাত্র',
      applyingClass: '৬ষ্ঠ শ্রেণি',
      previousSchool: '',
      gpaOrGrade: '',
      phone: '',
      email: '',
      presentAddress: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">ভর্তি আবেদন সফল হয়েছে!</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              আপনার আবেদনটি বিদ্যালয় কর্তৃপক্ষের কাছে প্রেরিত হয়েছে। বিদ্যালয়ের অ্যাডমিন প্যানেলে আবেদনটি সংরক্ষিত হয়েছে এবং সংশ্লিষ্ট শাখা থেকে মোবাইল নম্বরে যোগাযোগ করা হবে।
            </p>
            <div className="pt-4">
              <button
                onClick={handleClose}
                className="bg-[#15803d] hover:bg-[#166534] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">অনলাইন ভর্তি আবেদন ফর্ম</h3>
                <p className="text-xs text-gray-500">দাদরা উচ্চ বিদ্যালয়ে ২০২৪-২০২৫ শিক্ষাবর্ষে ভর্তির আবেদন</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">শিক্ষার্থীর পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="নাম লিখুন"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">আবেদনের শ্রেণি *</label>
                  <select
                    value={formData.applyingClass}
                    onChange={(e) => setFormData({ ...formData, applyingClass: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 bg-gray-50"
                  >
                    <option value="৬ষ্ঠ শ্রেণি">৬ষ্ঠ শ্রেণি</option>
                    <option value="৭ম শ্রেণি">৭ম শ্রেণি</option>
                    <option value="৮ম শ্রেণি">৮ম শ্রেণি</option>
                    <option value="৯ম শ্রেণি (বিজ্ঞান)">৯ম শ্রেণি (বিজ্ঞান)</option>
                    <option value="৯ম শ্রেণি (মানবিক)">৯ম শ্রেণি (মানবিক)</option>
                    <option value="৯ম শ্রেণি (ব্যবসায় শিক্ষা)">৯ম শ্রেণি (ব্যবসায় শিক্ষা)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">পিতার নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="পিতার নাম"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">মাতার নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="মাতার নাম"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">জন্ম তারিখ</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">লিঙ্গ</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 bg-gray-50"
                  >
                    <option value="ছাত্র">ছাত্র</option>
                    <option value="ছাত্রী">ছাত্রী</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">যোগাযোগের ফোন *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+880..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 bg-gray-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">পূর্ববর্তী শিক্ষাপ্রতিষ্ঠানের নাম</label>
                  <input
                    type="text"
                    placeholder="পূর্বে কোন স্কুলে পড়তেন"
                    value={formData.previousSchool}
                    onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">পূর্বের জিপিএ বা গ্রেড</label>
                  <input
                    type="text"
                    placeholder="যেমন: ৫.০০ বা A+"
                    value={formData.gpaOrGrade}
                    onChange={(e) => setFormData({ ...formData, gpaOrGrade: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">বর্তমান ঠিকানা</label>
                <textarea
                  rows={2}
                  placeholder="গ্রাম/রোড, ডাকঘর, উপজেলা, জেলা"
                  value={formData.presentAddress}
                  onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 bg-gray-50 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#15803d] hover:bg-[#166534] text-white font-semibold rounded-lg shadow-xs transition cursor-pointer"
                >
                  আবেদন জমা দিন
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

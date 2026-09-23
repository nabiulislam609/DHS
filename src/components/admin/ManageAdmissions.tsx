import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { Inbox, CheckCircle, XCircle, Trash2, Eye, X, Phone, User, Calendar, MapPin } from 'lucide-react';
import { AdmissionApplication } from '../../types';

export const ManageAdmissions: React.FC = () => {
  const { admissions, updateAdmissionStatus, deleteAdmission } = useSchool();
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);

  const getStatusBadge = (status: AdmissionApplication['status']) => {
    switch (status) {
      case 'অনুমোদিত':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'বাতিল':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ভর্তি আবেদন ব্যবস্থাপনা</h1>
          <p className="text-xs text-gray-500">
            ওয়েবসাইট থেকে অনলাইনে জমা হওয়া সকল ছাত্র-ছাত্রীর ভর্তি আবেদন তালিকা
          </p>
        </div>
        <div className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-100">
          মোট আবেদন: {admissions.length} টি
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {admissions.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            <Inbox className="w-10 h-10 mx-auto mb-2 text-gray-300" />
            <p>এখনো কোনো নতুন ভর্তি আবেদন জমা হয়নি</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50/80 text-gray-700 font-bold uppercase tracking-wider text-[11px] border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4">শিক্ষার্থীর নাম</th>
                  <th className="py-3.5 px-4">শ্রেণি ও লিঙ্গ</th>
                  <th className="py-3.5 px-4">অভিভাবকের নাম</th>
                  <th className="py-3.5 px-4">যোগাযোগ ফোন</th>
                  <th className="py-3.5 px-4">আবেদনের তারিখ</th>
                  <th className="py-3.5 px-4">স্ট্যাটাস</th>
                  <th className="py-3.5 px-4 text-right">পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admissions.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {app.applicantName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        {app.applyingClass}
                      </span>
                      <span className="text-gray-400 text-[11px] block mt-0.5">{app.gender}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>পিতা: {app.fatherName}</div>
                      <div className="text-gray-400 text-[11px]">মাতা: {app.motherName}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">{app.phone}</td>
                    <td className="py-3 px-4 text-gray-400">{app.appliedDate}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                          title="বিস্তারিত দেখুন"
                        >
                          <Eye className="w-4 h-4 text-emerald-700" />
                        </button>
                        <button
                          onClick={() => updateAdmissionStatus(app.id, 'অনুমোদিত')}
                          className="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-700 transition cursor-pointer"
                          title="অনুমোদন করুন"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateAdmissionStatus(app.id, 'বাতিল')}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                          title="বাতিল করুন"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`আপনি কি "${app.applicantName}" এর আবেদনটি মুছে ফেলতে চান?`)) {
                              deleteAdmission(app.id);
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition cursor-pointer"
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
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(selectedApp.status)}`}>
                {selectedApp.status}
              </span>
              <span className="text-xs text-gray-400">• আবেদন আইডি: {selectedApp.id}</span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedApp.applicantName}</h3>

            <div className="bg-gray-50 p-4 rounded-xl space-y-2.5 text-xs text-gray-700 border border-gray-100 mb-6">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-1.5">
                <span className="text-gray-500 font-semibold">আবেদনের শ্রেণি:</span>
                <span className="font-bold text-emerald-800">{selectedApp.applyingClass}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-1.5">
                <span className="text-gray-500 font-semibold">লিঙ্গ:</span>
                <span>{selectedApp.gender}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-1.5">
                <span className="text-gray-500 font-semibold">পিতার নাম:</span>
                <span>{selectedApp.fatherName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-1.5">
                <span className="text-gray-500 font-semibold">মাতার নাম:</span>
                <span>{selectedApp.motherName}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-1.5">
                <span className="text-gray-500 font-semibold">জন্ম তারিখ:</span>
                <span>{selectedApp.dateOfBirth || 'প্রযোজ্য নয়'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-1.5">
                <span className="text-gray-500 font-semibold">মোবাইল নম্বর:</span>
                <span className="font-mono font-bold text-gray-900">{selectedApp.phone}</span>
              </div>
              {selectedApp.previousSchool && (
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-1.5">
                  <span className="text-gray-500 font-semibold">পূর্ববর্তী স্কুল:</span>
                  <span>{selectedApp.previousSchool}</span>
                </div>
              )}
              {selectedApp.gpaOrGrade && (
                <div className="flex items-center justify-between border-b border-gray-200/60 pb-1.5">
                  <span className="text-gray-500 font-semibold">পূর্বের রেজাল্ট/জিপিএ:</span>
                  <span>{selectedApp.gpaOrGrade}</span>
                </div>
              )}
              {selectedApp.presentAddress && (
                <div className="pt-1">
                  <span className="text-gray-500 font-semibold block mb-0.5">বর্তমান ঠিকানা:</span>
                  <p className="text-gray-800">{selectedApp.presentAddress}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    updateAdmissionStatus(selectedApp.id, 'অনুমোদিত');
                    setSelectedApp({ ...selectedApp, status: 'অনুমোদিত' });
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs cursor-pointer"
                >
                  অনুমোদন দিন
                </button>
                <button
                  onClick={() => {
                    updateAdmissionStatus(selectedApp.id, 'বাতিল');
                    setSelectedApp({ ...selectedApp, status: 'বাতিল' });
                  }}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs cursor-pointer"
                >
                  বাতিল করুন
                </button>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-1.5 text-xs text-gray-600 font-semibold hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

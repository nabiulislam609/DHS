import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Users,
  Award,
  Upload,
  Image as ImageIcon,
  Camera,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { Student } from '../../types';
import { compressImageFile } from '../../utils/imageUpload';
import {
  CLASS_OPTIONS,
  GROUP_OPTIONS,
  isClassWithGroups,
  getSubjectsForClassAndGroup,
  getElectivesForClassAndGroup,
  ALL_CURRICULUM_SUBJECT_OPTIONS,
} from '../../data/curriculumSubjects';

export const ManageStudents: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useSchool();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStu, setEditingStu] = useState<Student | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showSubjectsList, setShowSubjectsList] = useState(true);
  const [customSubjectInput, setCustomSubjectInput] = useState('');
  const [selectedPresetToAdd, setSelectedPresetToAdd] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    name: '',
    roll: '',
    class: '১০ম শ্রেণি',
    section: 'A',
    group: 'বিজ্ঞান',
    guardianPhone: '',
    image: '' as string | undefined,
    subjects: [] as string[],
  });

  // Keep subjects in sync with class and group selection
  const isClass910 = isClassWithGroups(form.class);
  const currentElectives = getElectivesForClassAndGroup(form.class, form.group);

  const handleClassChange = (selectedClass: string) => {
    const hasGroups = isClassWithGroups(selectedClass);
    const newGroup = hasGroups
      ? form.group && form.group !== 'সাধারণ'
        ? form.group
        : 'বিজ্ঞান'
      : 'সাধারণ';
    const newSubjects = getSubjectsForClassAndGroup(selectedClass, newGroup);

    setForm((prev) => ({
      ...prev,
      class: selectedClass,
      group: newGroup,
      subjects: newSubjects,
    }));
  };

  const handleGroupChange = (selectedGroup: string) => {
    const newSubjects = getSubjectsForClassAndGroup(form.class, selectedGroup);
    setForm((prev) => ({
      ...prev,
      group: selectedGroup,
      subjects: newSubjects,
    }));
  };

  // Add subject to student
  const handleAddSubject = (subjectName: string) => {
    const cleanName = subjectName.trim();
    if (!cleanName) return;

    if (form.subjects.includes(cleanName)) {
      alert(`"${cleanName}" বিষয়টি ইতিমধ্যে তালিকায় অন্তর্ভুক্ত রয়েছে।`);
      return;
    }

    setForm((prev) => ({
      ...prev,
      subjects: [...prev.subjects, cleanName],
    }));
    setCustomSubjectInput('');
    setSelectedPresetToAdd('');
  };

  // Remove subject from student
  const handleRemoveSubject = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Quick switch or toggle elective subject
  const handleSelectElective = (electiveName: string) => {
    // If student already has this elective, do nothing or prompt
    if (form.subjects.includes(electiveName)) {
      return;
    }

    // Check if student has another elective from currentElectives pool
    const otherElectiveIndex = form.subjects.findIndex((sub) =>
      currentElectives.includes(sub)
    );

    if (otherElectiveIndex >= 0) {
      // Replace existing elective
      const nextSubjects = [...form.subjects];
      nextSubjects[otherElectiveIndex] = electiveName;
      setForm((prev) => ({ ...prev, subjects: nextSubjects }));
    } else {
      // Append elective
      setForm((prev) => ({ ...prev, subjects: [...prev.subjects, electiveName] }));
    }
  };

  // Reset subjects to default curriculum
  const handleResetSubjects = () => {
    const defaultSubs = getSubjectsForClassAndGroup(form.class, form.group);
    setForm((prev) => ({ ...prev, subjects: defaultSubs }));
  };

  const openAddModal = () => {
    setEditingStu(null);
    setUploadError(null);
    setShowSubjectsList(true);
    setCustomSubjectInput('');
    setSelectedPresetToAdd('');
    const initialClass = '১০ম শ্রেণি';
    const initialGroup = 'বিজ্ঞান';
    const initialSubjects = getSubjectsForClassAndGroup(initialClass, initialGroup);

    setForm({
      name: '',
      roll: `${students.length + 1}`,
      class: initialClass,
      section: 'A',
      group: initialGroup,
      guardianPhone: '+8801700000000',
      image: undefined,
      subjects: initialSubjects,
    });
    setModalOpen(true);
  };

  const openEditModal = (s: Student) => {
    setEditingStu(s);
    setUploadError(null);
    setShowSubjectsList(true);
    setCustomSubjectInput('');
    setSelectedPresetToAdd('');
    const sClass = s.class || s.studentClass || '১০ম শ্রেণি';
    const hasGroups = isClassWithGroups(sClass);
    const sGroup = hasGroups ? s.group || 'বিজ্ঞান' : 'সাধারণ';
    const sSubjects =
      s.subjects && s.subjects.length > 0
        ? s.subjects
        : getSubjectsForClassAndGroup(sClass, sGroup);

    setForm({
      name: s.name,
      roll: s.roll,
      class: sClass,
      section: s.section,
      group: sGroup,
      guardianPhone: s.guardianPhone || s.phone || '',
      image: s.image,
      subjects: sSubjects,
    });
    setModalOpen(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadError(null);
      const dataUrl = await compressImageFile(file, 400, 400, 0.85);
      setForm((prev) => ({ ...prev, image: dataUrl }));
    } catch (err: any) {
      setUploadError(err.message || 'ছবি আপলোড করতে ব্যর্থ হয়েছে');
    } finally {
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const assignedSubjects =
      form.subjects && form.subjects.length > 0
        ? form.subjects
        : getSubjectsForClassAndGroup(form.class, form.group);

    const studentPayload: Omit<Student, 'id'> = {
      name: form.name.trim(),
      roll: form.roll.trim(),
      studentClass: form.class,
      section: form.section,
      guardianName: 'অভিভাবক',
      phone: form.guardianPhone || '+8801700000000',
      class: form.class,
      group: isClass910 ? form.group : 'সাধারণ',
      subjects: assignedSubjects,
      guardianPhone: form.guardianPhone,
      image: form.image,
    };

    if (editingStu) {
      updateStudent(editingStu.id, studentPayload);
    } else {
      addStudent(studentPayload);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">শিক্ষার্থী ব্যবস্থাপনা</h1>
          <p className="text-xs text-gray-500">
            বিদ্যালয়ের রেজিস্টার্ড শিক্ষার্থীদের ডাটাবেস ও বিষয় বিন্যাস
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন শিক্ষার্থী যুক্ত করুন</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50/80 text-gray-700 font-bold uppercase tracking-wider text-[11px] border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">ছবি</th>
                <th className="py-3.5 px-4">রোল</th>
                <th className="py-3.5 px-4">শিক্ষার্থীর নাম</th>
                <th className="py-3.5 px-4">শ্রেণি ও শাখা</th>
                <th className="py-3.5 px-4">বিভাগ (Group)</th>
                <th className="py-3.5 px-4">নির্ধারিত বিষয়</th>
                <th className="py-3.5 px-4">অভিভাবক ফোন</th>
                <th className="py-3.5 px-4 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((s) => {
                const sClass = s.class || s.studentClass;
                const hasGrp = isClassWithGroups(sClass);
                const displayGroup = hasGrp ? s.group || 'বিজ্ঞান' : 'সাধারণ';
                const subjectList =
                  s.subjects && s.subjects.length > 0
                    ? s.subjects
                    : getSubjectsForClassAndGroup(sClass, displayGroup);

                return (
                  <tr key={s.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-emerald-800 text-xs shrink-0 shadow-2xs">
                        {s.image ? (
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{s.name.charAt(0)}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">{s.roll}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">{s.name}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">
                        {sClass} ({s.section})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          displayGroup === 'বিজ্ঞান'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : displayGroup === 'মানবিক'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : displayGroup === 'ব্যবসায় শিক্ষা'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {displayGroup}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 bg-emerald-50/70 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                        <BookOpen className="w-3 h-3 text-emerald-600" />
                        <span>{subjectList.length} টি বিষয়</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-500">{s.guardianPhone || s.phone}</td>
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
                            if (confirm(`আপনি কি "${s.name}" এর তথ্য মুছে ফেলতে চান?`)) {
                              deleteStudent(s.id);
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingStu ? 'শিক্ষার্থীর তথ্য সম্পাদনা' : 'নতুন শিক্ষার্থী যুক্ত করুন'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Device Photo Upload Area */}
              <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200">
                <label className="block font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-700" />
                  <span>শিক্ষার্থীর ছবি (ডিভাইস থেকে যুক্ত করুন)</span>
                </label>

                <div className="flex items-center gap-4">
                  {/* Photo Preview */}
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 overflow-hidden bg-white flex items-center justify-center shrink-0 relative shadow-2xs group">
                    {form.image ? (
                      <img src={form.image} alt="Student Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-gray-400 p-1">
                        <ImageIcon className="w-6 h-6 mx-auto mb-0.5 text-gray-300" />
                        <span className="text-[9px] block">ছবি নেই</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{form.image ? 'ছবি পরিবর্তন করুন' : 'ডিভাইস থেকে আপলোড'}</span>
                      </button>

                      {form.image && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition cursor-pointer border border-rose-200"
                        >
                          ছবি মুছুন
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500">
                      JPG, PNG বা WebP ফরম্যাট (স্বয়ংক্রিয়ভাবে অপ্টিমাইজ হবে)
                    </p>
                    {uploadError && (
                      <p className="text-[11px] text-rose-600 font-medium">{uploadError}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">শিক্ষার্থীর নাম *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: তানভীর হাসান"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">রোল নম্বর *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: ১০১"
                    value={form.roll}
                    onChange={(e) => setForm({ ...form, roll: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    শ্রেণি * <span className="text-emerald-700 font-normal">(সিলেক্ট করুন)</span>
                  </label>
                  <select
                    value={form.class}
                    onChange={(e) => handleClassChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 font-semibold text-gray-800"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">শাখা</label>
                  <input
                    type="text"
                    placeholder="যেমন: A বা ক"
                    value={form.section}
                    onChange={(e) => setForm({ ...form, section: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    বিভাগ {isClass910 ? '*' : '(৬ষ্ঠ-৮ম এর জন্য সাধারণ)'}
                  </label>
                  {isClass910 ? (
                    <select
                      value={form.group}
                      onChange={(e) => handleGroupChange(e.target.value)}
                      className="w-full px-3 py-2 bg-emerald-50/50 border border-emerald-200 rounded-lg focus:outline-hidden focus:border-emerald-600 font-semibold text-emerald-900"
                    >
                      {GROUP_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g} বিভাগ
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value="সাধারণ পাঠ্যক্রম"
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed font-medium"
                    />
                  )}
                </div>
              </div>

              {/* Automatic Subjects Preview and Management Section */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-3.5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <span>
                      {form.class} {isClass910 ? `(${form.group} বিভাগ)` : ''} এর নির্ধারিত বিষয়সমূহ:
                    </span>
                    <span className="bg-emerald-700 text-white text-[11px] px-2 py-0.5 rounded-full font-mono font-bold">
                      {form.subjects.length} টি বিষয়
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetSubjects}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold transition cursor-pointer shadow-2xs"
                      title="সিলেবাস অনুযায়ী বিষয়গুলো রিসেট করুন"
                    >
                      <RefreshCw className="w-3 h-3 text-emerald-600" />
                      <span>রিসেট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowSubjectsList(!showSubjectsList)}
                      className="text-emerald-700 hover:text-emerald-900 text-[11px] font-bold inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{showSubjectsList ? 'লুকান' : 'তালিকা দেখুন'}</span>
                      {showSubjectsList ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Elective / 4th subject selector */}
                {currentElectives.length > 0 && (
                  <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-200">
                    <span className="block text-[11px] font-bold text-emerald-950 mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ঐচ্ছিক বিষয় দ্রুত নির্বাচন (ক্লিক করে অদলবদল করুন):</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentElectives.map((ele) => {
                        const isSelected = form.subjects.includes(ele);
                        return (
                          <button
                            key={ele}
                            type="button"
                            onClick={() => handleSelectElective(ele)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-700 text-white shadow-xs'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
                            }`}
                          >
                            {isSelected ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            )}
                            <span>{ele}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add subject toolbar */}
                <div className="flex flex-col sm:flex-row gap-2 items-center bg-white/70 p-2 rounded-xl border border-emerald-200">
                  <select
                    value={selectedPresetToAdd}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedPresetToAdd(val);
                      if (val && val !== '__custom__') {
                        handleAddSubject(val);
                      }
                    }}
                    className="w-full sm:w-1/2 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-semibold text-gray-800"
                  >
                    <option value="">-- নতুন বিষয় নির্বাচন করে যোগ করুন --</option>
                    {ALL_CURRICULUM_SUBJECT_OPTIONS.filter((s) => !form.subjects.includes(s)).map((sub) => (
                      <option key={sub} value={sub}>
                        ➕ {sub}
                      </option>
                    ))}
                    <option value="__custom__">✍️ কাস্টম বিষয় (নিজে লিখুন)...</option>
                  </select>

                  {selectedPresetToAdd === '__custom__' && (
                    <div className="flex items-center gap-1.5 w-full sm:w-1/2">
                      <input
                        type="text"
                        placeholder="যেমন: গার্হস্থ্য বিজ্ঞান..."
                        value={customSubjectInput}
                        onChange={(e) => setCustomSubjectInput(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddSubject(customSubjectInput)}
                        disabled={!customSubjectInput.trim()}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold shrink-0 transition cursor-pointer"
                      >
                        যোগ করুন
                      </button>
                    </div>
                  )}
                </div>

                {/* Interactive Subject List with Remove Capability */}
                {showSubjectsList && (
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                    {form.subjects.map((sub, idx) => {
                      const isEle = currentElectives.includes(sub);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white border border-emerald-100 text-gray-800 text-xs hover:border-emerald-300 transition group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-mono flex items-center justify-center shrink-0 font-bold border border-emerald-200">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-gray-800">{sub}</span>
                            {isEle && (
                              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                                ঐচ্ছিক বিষয়
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveSubject(idx)}
                            className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                            title={`"${sub}" বিষয়টি বাদ দিন`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">অভিভাবকের মোবাইল নম্বর</label>
                <input
                  type="tel"
                  placeholder="+88017..."
                  value={form.guardianPhone}
                  onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 font-mono"
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

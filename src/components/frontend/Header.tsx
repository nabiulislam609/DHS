import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import {
  Phone,
  Mail,
  Clock,
  LogIn,
  GraduationCap,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { siteSettings, setViewMode, setIsAdmissionModalOpen } = useSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [academicDropdownOpen, setAcademicDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full bg-white shadow-xs border-b border-gray-100 sticky top-0 z-40">
      {/* Top Bar with Deep Green Background */}
      <div className="bg-[#0f5338] text-white text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left Contact Info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 hover:text-emerald-200 transition">
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>{siteSettings.phone1}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 hover:text-emerald-200 transition">
              <Mail className="w-3.5 h-3.5 text-emerald-300" />
              <span>{siteSettings.email}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-emerald-100">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              <span>{siteSettings.officeHours}</span>
            </div>
          </div>

          {/* Right Social & Admin Panel Switcher */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 text-emerald-200">
              <a href="#social" className="hover:text-white transition">Facebook</a>
              <span>•</span>
              <a href="#social" className="hover:text-white transition">YouTube</a>
              <span>•</span>
              <a href="#social" className="hover:text-white transition">Instagram</a>
            </div>

            {/* Admin Login / Panel Button matching the screenshot */}
            <button
              onClick={() => setViewMode('backend')}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded text-xs font-medium text-emerald-50 transition border border-white/20 hover:border-white/40 cursor-pointer"
              title="অ্যাডমিন প্যানেল এ প্রবেশ করুন"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
          <div className="w-12 h-12 rounded-full bg-amber-400 border-2 border-emerald-800 flex items-center justify-center shadow-xs text-emerald-950 font-bold">
            <GraduationCap className="w-7 h-7 text-emerald-900" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-emerald-900 leading-tight">
              {siteSettings.schoolNameBangla}
            </h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide">
              {siteSettings.schoolNameEnglish}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-gray-700">
          <button onClick={() => scrollToSection('hero')} className="hover:text-emerald-700 transition cursor-pointer">
            হোম
          </button>
          <button onClick={() => scrollToSection('about')} className="hover:text-emerald-700 transition cursor-pointer">
            পরিচিতি
          </button>
          <button onClick={() => scrollToSection('teachers')} className="hover:text-emerald-700 transition cursor-pointer">
            শিক্ষক
          </button>
          <button onClick={() => scrollToSection('notices')} className="hover:text-emerald-700 transition cursor-pointer">
            নোটিশ
          </button>
          <button onClick={() => scrollToSection('news')} className="hover:text-emerald-700 transition cursor-pointer">
            সংবাদ
          </button>
          <button onClick={() => scrollToSection('events')} className="hover:text-emerald-700 transition cursor-pointer">
            ইভেন্ট
          </button>

          {/* Academic Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAcademicDropdownOpen(!academicDropdownOpen)}
              className="flex items-center gap-1 hover:text-emerald-700 transition cursor-pointer"
            >
              <span>একাডেমিক</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {academicDropdownOpen && (
              <div
                className="absolute top-full mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50"
                onMouseLeave={() => setAcademicDropdownOpen(false)}
              >
                <button
                  onClick={() => { scrollToSection('programs'); setAcademicDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-gray-700 text-xs"
                >
                  পাঠ্যক্রম ও সিলেবাস
                </button>
                <button
                  onClick={() => { scrollToSection('stats'); setAcademicDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-gray-700 text-xs"
                >
                  পরীক্ষার ফলাফল
                </button>
              </div>
            )}
          </div>

          <button onClick={() => scrollToSection('gallery')} className="hover:text-emerald-700 transition cursor-pointer">
            গ্যালারি
          </button>

          {/* More Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className="flex items-center gap-1 hover:text-emerald-700 transition cursor-pointer"
            >
              <span>আরও</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {moreDropdownOpen && (
              <div
                className="absolute top-full mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50"
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                <button
                  onClick={() => { scrollToSection('leadership'); setMoreDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-gray-700 text-xs"
                >
                  নেতৃত্বের বার্তা
                </button>
                <button
                  onClick={() => { scrollToSection('achievements'); setMoreDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-gray-700 text-xs"
                >
                  আমাদের অর্জন
                </button>
                <button
                  onClick={() => { scrollToSection('contact'); setMoreDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-gray-700 text-xs"
                >
                  যোগাযোগ
                </button>
              </div>
            )}
          </div>

          {/* Admission Apply Button */}
          <button
            onClick={() => setIsAdmissionModalOpen(true)}
            className="bg-[#15803d] hover:bg-[#166534] text-white px-4 py-2 rounded-md font-semibold shadow-xs hover:shadow transition cursor-pointer text-sm"
          >
            ভর্তি আবেদন
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            onClick={() => setIsAdmissionModalOpen(true)}
            className="bg-[#15803d] text-white px-3 py-1.5 rounded text-xs font-semibold"
          >
            ভর্তি আবেদন
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:text-emerald-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3 text-sm font-medium text-gray-800 shadow-md">
          <button
            onClick={() => scrollToSection('hero')}
            className="block w-full text-left py-1 hover:text-emerald-700"
          >
            হোম
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="block w-full text-left py-1 hover:text-emerald-700"
          >
            পরিচিতি
          </button>
          <button
            onClick={() => scrollToSection('teachers')}
            className="block w-full text-left py-1 hover:text-emerald-700"
          >
            শিক্ষক
          </button>
          <button
            onClick={() => scrollToSection('notices')}
            className="block w-full text-left py-1 hover:text-emerald-700"
          >
            নোটিশ
          </button>
          <button
            onClick={() => scrollToSection('news')}
            className="block w-full text-left py-1 hover:text-emerald-700"
          >
            সংবাদ
          </button>
          <button
            onClick={() => scrollToSection('events')}
            className="block w-full text-left py-1 hover:text-emerald-700"
          >
            ইভেন্ট
          </button>
          <button
            onClick={() => scrollToSection('programs')}
            className="block w-full text-left py-1 hover:text-emerald-700"
          >
            একাডেমিক প্রোগ্রাম
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="block w-full text-left py-1 hover:text-emerald-700"
          >
            গ্যালারি
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="block w-full text-left py-1 hover:text-emerald-700"
          >
            যোগাযোগ
          </button>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setViewMode('backend');
              }}
              className="flex items-center gap-2 text-emerald-800 font-semibold"
            >
              <LogIn className="w-4 h-4" />
              <span>অ্যাডমিন ড্যাশবোর্ডে যান</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

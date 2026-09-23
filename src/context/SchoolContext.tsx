import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Teacher,
  Staff,
  Student,
  Notice,
  LeadershipMessage,
  AcademicProgram,
  NewsItem,
  EventItem,
  AchievementItem,
  GalleryAlbum,
  AdmissionApplication,
  ContactMessage,
  SiteSettings,
  ActivityLog,
} from '../types';
import {
  initialSiteSettings,
  initialTeachers,
  initialStaff,
  initialStudents,
  initialNotices,
  initialLeadership,
  initialAcademicPrograms,
  initialNews,
  initialEvents,
  initialAchievements,
  initialGalleryAlbums,
  initialMessages,
  initialAdmissions,
  initialActivities,
} from '../data/initialData';

export type ViewMode = 'frontend' | 'backend';
export type AdminTab =
  | 'dashboard'
  | 'settings'
  | 'sections'
  | 'hero'
  | 'navigation'
  | 'static'
  | 'teachers'
  | 'staff'
  | 'students'
  | 'leadership'
  | 'notices'
  | 'news'
  | 'events'
  | 'achievements'
  | 'gallery'
  | 'programs'
  | 'statistics'
  | 'performance'
  | 'admissions'
  | 'messages';

interface SchoolContextType {
  // View states
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  isAdmissionModalOpen: boolean;
  setIsAdmissionModalOpen: (open: boolean) => void;

  // Data states
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  teachers: Teacher[];
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  staff: Staff[];
  addStaff: (staffMember: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staffMember: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (id: string, notice: Partial<Notice>) => void;
  deleteNotice: (id: string) => void;
  togglePinNotice: (id: string) => void;

  leadership: LeadershipMessage[];
  updateLeadership: (id: string, updated: Partial<LeadershipMessage>) => void;

  academicPrograms: AcademicProgram[];
  addProgram: (program: Omit<AcademicProgram, 'id'>) => void;
  updateProgram: (id: string, program: Partial<AcademicProgram>) => void;
  deleteProgram: (id: string) => void;

  news: NewsItem[];
  addNews: (newsItem: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: string, newsItem: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;

  events: EventItem[];
  addEvent: (event: Omit<EventItem, 'id'>) => void;
  updateEvent: (id: string, event: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;

  achievements: AchievementItem[];
  addAchievement: (achievement: Omit<AchievementItem, 'id'>) => void;
  updateAchievement: (id: string, achievement: Partial<AchievementItem>) => void;
  deleteAchievement: (id: string) => void;

  galleryAlbums: GalleryAlbum[];
  addGalleryAlbum: (album: Omit<GalleryAlbum, 'id'>) => void;
  updateGalleryAlbum: (id: string, album: Partial<GalleryAlbum>) => void;
  deleteGalleryAlbum: (id: string) => void;
  addImageToAlbum: (albumId: string, imageUrl: string) => void;

  admissions: AdmissionApplication[];
  submitAdmission: (application: Omit<AdmissionApplication, 'id' | 'appliedDate' | 'status'>) => void;
  updateAdmissionStatus: (id: string, status: AdmissionApplication['status']) => void;
  deleteAdmission: (id: string) => void;

  messages: ContactMessage[];
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => void;
  markMessageRead: (id: string, read: boolean) => void;
  deleteMessage: (id: string) => void;

  activities: ActivityLog[];
  logActivity: (action: string, type: ActivityLog['type']) => void;
  clearActivities: () => void;

  // Quick stats
  unreadMessageCount: number;
  totalGalleryPhotos: number;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('frontend');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);

  // Load from localStorage or fallback to initial
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('dhs_site_settings');
    return saved ? JSON.parse(saved) : initialSiteSettings;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('dhs_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('dhs_staff');
    return saved ? JSON.parse(saved) : initialStaff;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('dhs_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('dhs_notices');
    return saved ? JSON.parse(saved) : initialNotices;
  });

  const [leadership, setLeadership] = useState<LeadershipMessage[]>(() => {
    const saved = localStorage.getItem('dhs_leadership');
    return saved ? JSON.parse(saved) : initialLeadership;
  });

  const [academicPrograms, setAcademicPrograms] = useState<AcademicProgram[]>(() => {
    const saved = localStorage.getItem('dhs_programs');
    return saved ? JSON.parse(saved) : initialAcademicPrograms;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('dhs_news');
    return saved ? JSON.parse(saved) : initialNews;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('dhs_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [achievements, setAchievements] = useState<AchievementItem[]>(() => {
    const saved = localStorage.getItem('dhs_achievements');
    return saved ? JSON.parse(saved) : initialAchievements;
  });

  const [galleryAlbums, setGalleryAlbums] = useState<GalleryAlbum[]>(() => {
    const saved = localStorage.getItem('dhs_gallery');
    return saved ? JSON.parse(saved) : initialGalleryAlbums;
  });

  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(() => {
    const saved = localStorage.getItem('dhs_admissions');
    return saved ? JSON.parse(saved) : initialAdmissions;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('dhs_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('dhs_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('dhs_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('dhs_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('dhs_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('dhs_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('dhs_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('dhs_leadership', JSON.stringify(leadership));
  }, [leadership]);

  useEffect(() => {
    localStorage.setItem('dhs_programs', JSON.stringify(academicPrograms));
  }, [academicPrograms]);

  useEffect(() => {
    localStorage.setItem('dhs_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('dhs_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('dhs_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('dhs_gallery', JSON.stringify(galleryAlbums));
  }, [galleryAlbums]);

  useEffect(() => {
    localStorage.setItem('dhs_admissions', JSON.stringify(admissions));
  }, [admissions]);

  useEffect(() => {
    localStorage.setItem('dhs_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('dhs_activities', JSON.stringify(activities));
  }, [activities]);

  const logActivity = (action: string, type: ActivityLog['type']) => {
    const newAct: ActivityLog = {
      id: 'act-' + Date.now(),
      action,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      type,
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 49)]);
  };

  const clearActivities = () => {
    setActivities([]);
  };

  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...settings }));
    logActivity('ওয়েবসাইটের সাধারণ সেটিংস আপডেট করা হয়েছে', 'setting');
  };

  // Teachers CRUD
  const addTeacher = (item: Omit<Teacher, 'id'>) => {
    const id = 't-' + Date.now();
    const newT: Teacher = { id, ...item };
    setTeachers((prev) => [...prev, newT]);
    logActivity(`নতুন শিক্ষক "${newT.name}" যোগ করা হয়েছে`, 'teacher');
  };

  const updateTeacher = (id: string, item: Partial<Teacher>) => {
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, ...item } : t)));
    logActivity(`শিক্ষকের তথ্য আপডেট করা হয়েছে`, 'teacher');
  };

  const deleteTeacher = (id: string) => {
    const target = teachers.find((t) => t.id === id);
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    logActivity(`শিক্ষক "${target?.name || ''}" মুছে ফেলা হয়েছে`, 'teacher');
  };

  // Staff CRUD
  const addStaff = (item: Omit<Staff, 'id'>) => {
    const id = 's-' + Date.now();
    const newS: Staff = { id, ...item };
    setStaff((prev) => [...prev, newS]);
    logActivity(`নতুন কর্মচারী "${newS.name}" যোগ করা হয়েছে`, 'setting');
  };

  const updateStaff = (id: string, item: Partial<Staff>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...item } : s)));
    logActivity(`কর্মচারীর তথ্য আপডেট করা হয়েছে`, 'setting');
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    logActivity(`কর্মচারী মুছে ফেলা হয়েছে`, 'setting');
  };

  // Students CRUD
  const addStudent = (item: Omit<Student, 'id'>) => {
    const id = 'stu-' + Date.now();
    const newStu: Student = { id, ...item };
    setStudents((prev) => [...prev, newStu]);
    logActivity(`শিক্ষার্থী "${newStu.name}" তালিকাভুক্ত করা হয়েছে`, 'setting');
  };

  const updateStudent = (id: string, item: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...item } : s)));
    logActivity(`শিক্ষার্থীর তথ্য আপডেট করা হয়েছে`, 'setting');
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    logActivity(`শিক্ষার্থীর তথ্য মুছে ফেলা হয়েছে`, 'setting');
  };

  // Notices CRUD
  const addNotice = (item: Omit<Notice, 'id'>) => {
    const id = 'not-' + Date.now();
    const newN: Notice = { id, ...item };
    setNotices((prev) => [newN, ...prev]);
    logActivity(`নতুন নোটিশ "${newN.title}" প্রকাশ করা হয়েছে`, 'notice');
  };

  const updateNotice = (id: string, item: Partial<Notice>) => {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, ...item } : n)));
    logActivity(`নোটিশ আপডেট করা হয়েছে`, 'notice');
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    logActivity(`একটি নোটিশ মুছে ফেলা হয়েছে`, 'notice');
  };

  const togglePinNotice = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // Leadership
  const updateLeadership = (id: string, updated: Partial<LeadershipMessage>) => {
    setLeadership((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)));
    logActivity('নেতৃত্বের বার্তা হালনাগাদ করা হয়েছে', 'setting');
  };

  // Academic Programs
  const addProgram = (item: Omit<AcademicProgram, 'id'>) => {
    const id = 'prog-' + Date.now();
    setAcademicPrograms((prev) => [...prev, { id, ...item }]);
    logActivity(`নতুন একাডেমিক প্রোগ্রাম "${item.title}" যুক্ত করা হয়েছে`, 'setting');
  };

  const updateProgram = (id: string, item: Partial<AcademicProgram>) => {
    setAcademicPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, ...item } : p)));
    logActivity(`একাডেমিক প্রোগ্রাম আপডেট করা হয়েছে`, 'setting');
  };

  const deleteProgram = (id: string) => {
    setAcademicPrograms((prev) => prev.filter((p) => p.id !== id));
    logActivity(`একাডেমিক প্রোগ্রাম মুছে ফেলা হয়েছে`, 'setting');
  };

  // News CRUD
  const addNews = (item: Omit<NewsItem, 'id'>) => {
    const id = 'news-' + Date.now();
    setNews((prev) => [{ id, ...item }, ...prev]);
    logActivity(`নতুন সংবাদ "${item.title}" প্রকাশিত হয়েছে`, 'notice');
  };

  const updateNews = (id: string, item: Partial<NewsItem>) => {
    setNews((prev) => prev.map((n) => (n.id === id ? { ...n, ...item } : n)));
    logActivity(`সংবাদ আপডেট করা হয়েছে`, 'notice');
  };

  const deleteNews = (id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
    logActivity(`সংবাদ মুছে ফেলা হয়েছে`, 'notice');
  };

  // Events CRUD
  const addEvent = (item: Omit<EventItem, 'id'>) => {
    const id = 'evt-' + Date.now();
    setEvents((prev) => [...prev, { id, ...item }]);
    logActivity(`নতুন ইভেন্ট "${item.title}" ক্যালেন্ডারে যুক্ত হয়েছে`, 'event');
  };

  const updateEvent = (id: string, item: Partial<EventItem>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...item } : e)));
    logActivity(`ইভেন্টের বিবরণ আপডেট করা হয়েছে`, 'event');
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    logActivity(`ইভেন্ট বাতিল/মুছে ফেলা হয়েছে`, 'event');
  };

  // Achievements CRUD
  const addAchievement = (item: Omit<AchievementItem, 'id'>) => {
    const id = 'ach-' + Date.now();
    setAchievements((prev) => [...prev, { id, ...item }]);
    logActivity(`নতুন অর্জন "${item.title}" সংরক্ষিত হয়েছে`, 'setting');
  };

  const updateAchievement = (id: string, item: Partial<AchievementItem>) => {
    setAchievements((prev) => prev.map((a) => (a.id === id ? { ...a, ...item } : a)));
    logActivity(`অর্জনের তথ্য আপডেট করা হয়েছে`, 'setting');
  };

  const deleteAchievement = (id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    logActivity(`অর্জন তালিকা থেকে মুছে ফেলা হয়েছে`, 'setting');
  };

  // Gallery
  const addGalleryAlbum = (item: Omit<GalleryAlbum, 'id'>) => {
    const id = 'gal-' + Date.now();
    setGalleryAlbums((prev) => [...prev, { id, ...item }]);
    logActivity(`নতুন গ্যালারি অ্যালবাম "${item.title}" যোগ করা হয়েছে`, 'setting');
  };

  const updateGalleryAlbum = (id: string, item: Partial<GalleryAlbum>) => {
    setGalleryAlbums((prev) => prev.map((g) => (g.id === id ? { ...g, ...item } : g)));
    logActivity(`গ্যালারি অ্যালবাম আপডেট করা হয়েছে`, 'setting');
  };

  const deleteGalleryAlbum = (id: string) => {
    setGalleryAlbums((prev) => prev.filter((g) => g.id !== id));
    logActivity(`গ্যালারি অ্যালবাম মুছে ফেলা হয়েছে`, 'setting');
  };

  const addImageToAlbum = (albumId: string, imageUrl: string) => {
    setGalleryAlbums((prev) =>
      prev.map((alb) => {
        if (alb.id === albumId) {
          const updatedImgs = [...(alb.images || []), imageUrl];
          return {
            ...alb,
            images: updatedImgs,
            itemCountText: `${updatedImgs.length} টি ছবি`,
          };
        }
        return alb;
      })
    );
    logActivity(`অ্যালবামে নতুন ছবি যোগ করা হয়েছে`, 'setting');
  };

  // Admissions
  const submitAdmission = (application: Omit<AdmissionApplication, 'id' | 'appliedDate' | 'status'>) => {
    const id = 'adm-' + Date.now();
    const dateStr = new Date().toISOString().split('T')[0];
    const newApp: AdmissionApplication = {
      id,
      ...application,
      appliedDate: dateStr,
      status: 'অপেক্ষমাণ',
    };
    setAdmissions((prev) => [newApp, ...prev]);
    logActivity(`নতুন ভর্তি আবেদন জমা হয়েছে: "${newApp.applicantName}" (${newApp.applyingClass})`, 'admission');
  };

  const updateAdmissionStatus = (id: string, status: AdmissionApplication['status']) => {
    setAdmissions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    logActivity(`ভর্তি আবেদনের স্ট্যাটাস পরিবর্তন: ${status}`, 'admission');
  };

  const deleteAdmission = (id: string) => {
    setAdmissions((prev) => prev.filter((a) => a.id !== id));
    logActivity(`ভর্তি আবেদন তালিকা থেকে সরানো হয়েছে`, 'admission');
  };

  // Messages
  const submitContactMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
    const id = 'msg-' + Date.now();
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: ContactMessage = {
      id,
      ...msg,
      date: dateStr,
      read: false,
    };
    setMessages((prev) => [newMsg, ...prev]);
    logActivity(`ওয়েবসাইট থেকে বার্তা পেয়েছেন: ${newMsg.name}`, 'message');
  };

  const markMessageRead = (id: string, read: boolean) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)));
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    logActivity(`বার্তা মুছে ফেলা হয়েছে`, 'message');
  };

  const unreadMessageCount = messages.filter((m) => !m.read).length;
  const totalGalleryPhotos = galleryAlbums.reduce(
    (acc, alb) => acc + (alb.images ? alb.images.length : 1),
    0
  );

  return (
    <SchoolContext.Provider
      value={{
        viewMode,
        setViewMode,
        adminTab,
        setAdminTab,
        isAdmissionModalOpen,
        setIsAdmissionModalOpen,
        siteSettings,
        updateSiteSettings,
        teachers,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        staff,
        addStaff,
        updateStaff,
        deleteStaff,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        notices,
        addNotice,
        updateNotice,
        deleteNotice,
        togglePinNotice,
        leadership,
        updateLeadership,
        academicPrograms,
        addProgram,
        updateProgram,
        deleteProgram,
        news,
        addNews,
        updateNews,
        deleteNews,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        achievements,
        addAchievement,
        updateAchievement,
        deleteAchievement,
        galleryAlbums,
        addGalleryAlbum,
        updateGalleryAlbum,
        deleteGalleryAlbum,
        addImageToAlbum,
        admissions,
        submitAdmission,
        updateAdmissionStatus,
        deleteAdmission,
        messages,
        submitContactMessage,
        markMessageRead,
        deleteMessage,
        activities,
        logActivity,
        clearActivities,
        unreadMessageCount,
        totalGalleryPhotos,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};

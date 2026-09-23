export interface Teacher {
  id: string;
  name: string;
  designation: string;
  subject: string;
  email: string;
  phone: string;
  initial: string;
  order?: number;
}

export interface Staff {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email?: string;
  initial?: string;
  role?: string;
}

export interface Student {
  id: string;
  roll: string;
  name: string;
  studentClass: string;
  section: string;
  guardianName: string;
  phone: string;
  class?: string;
  group?: string;
  guardianPhone?: string;
}

export interface Notice {
  id: string;
  code?: string;
  title: string;
  category: 'জরুরি' | 'সাধারণ' | 'পরীক্ষা' | 'ক্রীড়া' | 'অনুষ্ঠান' | 'ভর্তি' | 'গুরুত্বপূর্ণ';
  date: string; // e.g. "22 Sep 2026"
  pinned: boolean;
  content: string;
  downloadUrl?: string;
}

export interface LeadershipMessage {
  id: string;
  name: string;
  role: string;
  credentials: string;
  message: string;
  initial: string;
  type: 'principal' | 'president';
}

export interface AcademicProgram {
  id: string;
  title: string;
  level: string; // e.g. "শ্রেণি: ৬ষ্ঠ-৮ম"
  description: string;
  subjects: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime?: string;
  summary: string;
  content: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category?: string;
}

export interface AchievementItem {
  id: string;
  category: string;
  year: string;
  title: string;
  subtitle: string;
  authorOrTeam?: string;
  iconType: 'academic' | 'olympiad' | 'sports' | 'scholarship' | 'tech' | string;
}

export interface GalleryAlbum {
  id: string;
  category: 'campus' | 'classroom' | 'sports' | 'cultural' | 'science' | string;
  title: string;
  itemCountText: string;
  imageUrl: string;
  images?: string[];
}

export interface AdmissionApplication {
  id: string;
  applicantName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: 'ছাত্র' | 'ছাত্রী';
  applyingClass: string;
  previousSchool: string;
  gpaOrGrade: string;
  phone: string;
  email?: string;
  presentAddress: string;
  appliedDate: string;
  status: 'অপেক্ষমাণ' | 'অনুমোদিত' | 'বাতিল';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface SiteSettings {
  schoolNameBangla: string;
  schoolNameEnglish: string;
  motto: string;
  establishedYear: string;
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  officeHours: string;
  totalStudents: string;
  totalTeachers: string;
  passRate: string;
  gpa5Count: string;
  totalClassrooms: string;
  totalAwards: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  type: 'notice' | 'admission' | 'message' | 'teacher' | 'event' | 'setting';
}

/**
 * Database & Models Layer
 * Models relational schema for Users, Students, Teachers, Classes, Admissions, and Exam Results.
 * Supports server-side pagination, filtering, soft-delete, and transactions.
 */
import bcrypt from 'bcryptjs';

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  avatar?: string;
  is_active: boolean;
  created_at: string;
}

export interface Student {
  id: string;
  student_id: string; // e.g. STU-2026-1001
  user_id?: string;
  name: string;
  father_name: string;
  mother_name: string;
  class_name: string; // e.g. "Class 6", "Class 9", "১০ম শ্রেণি"
  section: string; // "A", "B", "পদ্মা", "মেঘনা"
  group: 'বিজ্ঞান' | 'মানবিক' | 'ব্যবসায় শিক্ষা' | 'সাধারণ';
  roll_number: number;
  gender: 'ছাত্র' | 'ছাত্রী';
  phone: string;
  email: string;
  date_of_birth: string;
  gpa_or_grade: string;
  address: string;
  admission_date: string;
  is_active: boolean; // Soft delete flag
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  teacher_id: string; // e.g. TCH-2026-01
  user_id?: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  assigned_classes: string[];
  assigned_subjects: string[];
  is_active: boolean;
  created_at: string;
}

export interface Admission {
  id: string; // e.g. ADM-2026-9021
  applicant_name: string;
  applying_class: string;
  group: string;
  section: string;
  additional_subject?: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  gender: 'ছাত্র' | 'ছাত্রী';
  phone: string;
  email: string;
  previous_school: string;
  gpa_or_grade: string;
  present_address: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  student_id?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface SubjectMarks {
  subject_name: string;
  full_marks: number;
  obtained_marks: number;
  highest_marks: number;
  grade: string;
  grade_point: number;
}

export interface ExamResult {
  id: string;
  student_id: string;
  student_name: string;
  class_name: string;
  roll_number: number;
  section: string;
  group: string;
  exam_name: 'অর্ধ-বার্ষিক পরীক্ষা' | 'বার্ষিক পরীক্ষা' | 'প্রাক-নির্বাচনী' | 'নির্বাচনী পরীক্ষা';
  year: number;
  subjects: SubjectMarks[];
  total_marks: number;
  gpa: number;
  letter_grade: string;
  status: 'PASSED' | 'FAILED';
  published: boolean;
  published_at?: string;
  teacher_id?: string;
  created_at: string;
  updated_at: string;
}

class Database {
  public users: User[] = [];
  public students: Student[] = [];
  public teachers: Teacher[] = [];
  public admissions: Admission[] = [];
  public results: ExamResult[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Generate secure password hashes
    const adminPassHash = bcrypt.hashSync('admin123', 10);
    const teacherPassHash = bcrypt.hashSync('teacher123', 10);
    const studentPassHash = bcrypt.hashSync('student123', 10);

    // 1. Initial Users
    this.users = [
      {
        id: 'usr-admin-1',
        username: 'admin',
        email: 'admin@dadraschool.edu.bd',
        passwordHash: adminPassHash,
        role: 'ADMIN',
        name: 'প্রধান শিক্ষক ও সিস্টেম অ্যাডমিন',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        is_active: true,
        created_at: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'usr-teacher-1',
        username: 'teacher.rahman',
        email: 'rahman@dadraschool.edu.bd',
        passwordHash: teacherPassHash,
        role: 'TEACHER',
        name: 'মোঃ খলিলুর রহমান',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        is_active: true,
        created_at: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'usr-student-1',
        username: 'stu.tanvir',
        email: 'tanvir@student.dadraschool.edu.bd',
        passwordHash: studentPassHash,
        role: 'STUDENT',
        name: 'তানভীর আহমেদ',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
        is_active: true,
        created_at: '2026-01-01T00:00:00.000Z',
      },
    ];

    // 2. Initial Teachers
    this.teachers = [
      {
        id: 'tch-1',
        teacher_id: 'TCH-2026-01',
        user_id: 'usr-teacher-1',
        name: 'মোঃ খলিলুর রহমান',
        designation: 'সহকারী প্রধান শিক্ষক (বিজ্ঞান)',
        department: 'Science & Mathematics',
        phone: '01712-345678',
        email: 'rahman@dadraschool.edu.bd',
        assigned_classes: ['১০ম শ্রেণি', '৯ম শ্রেণি'],
        assigned_subjects: ['পদার্থবিজ্ঞান (Physics)', 'উচ্চতর গণিত', 'সাধারণ গণিত'],
        is_active: true,
        created_at: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'tch-2',
        teacher_id: 'TCH-2026-02',
        name: 'মোছাঃ ফাতেমা খাতুন',
        designation: 'জ্যেষ্ঠ শিক্ষক (ইংরেজি)',
        department: 'Language & Humanities',
        phone: '01723-456789',
        email: 'fatema@dadraschool.edu.bd',
        assigned_classes: ['৮ম শ্রেণি', '৯ম শ্রেণি'],
        assigned_subjects: ['ইংরেজি ১ম পত্র', 'ইংরেজি ২য় পত্র'],
        is_active: true,
        created_at: '2026-01-01T00:00:00.000Z',
      },
    ];

    // 3. Initial Students
    this.students = [
      {
        id: 'std-1',
        student_id: 'STU-2026-1001',
        user_id: 'usr-student-1',
        name: 'তানভীর আহমেদ',
        father_name: 'মোঃ রফিকুল ইসলাম',
        mother_name: 'নাছিমা বেগম',
        class_name: '১০ম শ্রেণি',
        section: 'ক (পদ্মা)',
        group: 'বিজ্ঞান',
        roll_number: 1,
        gender: 'ছাত্র',
        phone: '01711-223344',
        email: 'tanvir@student.dadraschool.edu.bd',
        date_of_birth: '2010-04-12',
        gpa_or_grade: '5.00',
        address: 'গ্রাম: দাদরা, ডাকঘর: দাদরা, জয়পুরহাট',
        admission_date: '2024-01-10',
        is_active: true,
        created_at: '2024-01-10T10:00:00.000Z',
        updated_at: '2026-01-10T10:00:00.000Z',
      },
      {
        id: 'std-2',
        student_id: 'STU-2026-1002',
        name: 'সাদিয়া আক্তার',
        father_name: 'মোঃ আব্দুল মান্নান',
        mother_name: 'শাহিনা বেগম',
        class_name: '১০ম শ্রেণি',
        section: 'ক (পদ্মা)',
        group: 'বিজ্ঞান',
        roll_number: 2,
        gender: 'ছাত্রী',
        phone: '01711-556677',
        email: 'sadia@student.dadraschool.edu.bd',
        date_of_birth: '2010-07-21',
        gpa_or_grade: '4.89',
        address: 'দাদরা বাজার, সদর, জয়পুরহাট',
        admission_date: '2024-01-10',
        is_active: true,
        created_at: '2024-01-10T10:00:00.000Z',
        updated_at: '2026-01-10T10:00:00.000Z',
      },
      {
        id: 'std-3',
        student_id: 'STU-2026-1003',
        name: 'মেহেদী হাসান শুভ',
        father_name: 'আবু বক্কর সিদ্দিক',
        mother_name: 'আমেনা খাতুন',
        class_name: '১০ম শ্রেণি',
        section: 'খ (মেঘনা)',
        group: 'ব্যবসায় শিক্ষা',
        roll_number: 3,
        gender: 'ছাত্র',
        phone: '01812-334455',
        email: 'mehedi@student.dadraschool.edu.bd',
        date_of_birth: '2010-09-15',
        gpa_or_grade: '4.67',
        address: 'চকবরকত, জয়পুরহাট',
        admission_date: '2024-01-12',
        is_active: true,
        created_at: '2024-01-12T10:00:00.000Z',
        updated_at: '2026-01-10T10:00:00.000Z',
      },
      {
        id: 'std-4',
        student_id: 'STU-2026-1004',
        name: 'নুসরাত জাহান মিম',
        father_name: 'মোঃ জাহাঙ্গীর আলম',
        mother_name: 'মোরশেদা পারভীন',
        class_name: '৯ম শ্রেণি',
        section: 'ক (গোমতী)',
        group: 'বিজ্ঞান',
        roll_number: 1,
        gender: 'ছাত্রী',
        phone: '01911-778899',
        email: 'mim@student.dadraschool.edu.bd',
        date_of_birth: '2011-03-05',
        gpa_or_grade: '5.00',
        address: 'পূর্ব দাদরা, জয়পুরহাট',
        admission_date: '2025-01-10',
        is_active: true,
        created_at: '2025-01-10T10:00:00.000Z',
        updated_at: '2026-01-10T10:00:00.000Z',
      },
      {
        id: 'std-5',
        student_id: 'STU-2026-1005',
        name: 'আরিফুল ইসলাম',
        father_name: 'মোঃ শফিকুল ইসলাম',
        mother_name: 'জাহানারা বেগম',
        class_name: '৮ম শ্রেণি',
        section: 'ক',
        group: 'সাধারণ',
        roll_number: 5,
        gender: 'ছাত্র',
        phone: '01712-998877',
        email: 'ariful@student.dadraschool.edu.bd',
        date_of_birth: '2012-08-19',
        gpa_or_grade: '4.50',
        address: 'দাদরা মধ্যপাড়া, জয়পুরহাট',
        admission_date: '2026-01-05',
        is_active: false, // Soft deleted sample
        created_at: '2026-01-05T10:00:00.000Z',
        updated_at: '2026-02-01T10:00:00.000Z',
      },
    ];

    // 4. Initial Admissions (Digital Admission workflow)
    this.admissions = [
      {
        id: 'ADM-2026-9021',
        applicant_name: 'রাকিবুল হাসান শান্ত',
        applying_class: '৬ষ্ঠ শ্রেণি',
        group: 'সাধারণ',
        section: 'ক',
        father_name: 'মোঃ এনামুল হক',
        mother_name: 'নাজমা বেগম',
        date_of_birth: '2014-05-10',
        gender: 'ছাত্র',
        phone: '01715-998811',
        email: 'rakibul@gmail.com',
        previous_school: 'দাদরা সরকারি প্রাথমিক বিদ্যালয়',
        gpa_or_grade: '5.00',
        present_address: 'উত্তর দাদরা, জয়পুরহাট',
        status: 'PENDING',
        created_at: '2026-02-15T09:30:00.000Z',
      },
      {
        id: 'ADM-2026-9022',
        applicant_name: 'মাহিয়া তাসনিম',
        applying_class: '৯ম শ্রেণি',
        group: 'বিজ্ঞান',
        section: 'ক',
        additional_subject: 'উচ্চতর গণিত',
        father_name: 'মোঃ মাহবুব হোসেন',
        mother_name: 'তাসলিমা খাতুন',
        date_of_birth: '2011-11-20',
        gender: 'ছাত্রী',
        phone: '01718-223388',
        email: 'mahiya@gmail.com',
        previous_school: 'জয়পুরহাট মডেল স্কুল',
        gpa_or_grade: '4.95',
        present_address: 'দাদরা নতুন পাড়া',
        status: 'PENDING',
        created_at: '2026-02-18T14:15:00.000Z',
      },
      {
        id: 'ADM-2026-9019',
        applicant_name: 'তানভীর আহমেদ',
        applying_class: '১০ম শ্রেণি',
        group: 'বিজ্ঞান',
        section: 'ক (পদ্মা)',
        father_name: 'মোঃ রফিকুল ইসলাম',
        mother_name: 'নাছিমা বেগম',
        date_of_birth: '2010-04-12',
        gender: 'ছাত্র',
        phone: '01711-223344',
        email: 'tanvir@student.dadraschool.edu.bd',
        previous_school: 'দাদরা উচ্চ বিদ্যালয়',
        gpa_or_grade: '5.00',
        present_address: 'দাদরা, জয়পুরহাট',
        status: 'APPROVED',
        student_id: 'STU-2026-1001',
        reviewed_by: 'usr-admin-1',
        reviewed_at: '2026-01-10T10:00:00.000Z',
        created_at: '2026-01-08T11:00:00.000Z',
      },
    ];

    // 5. Initial Exam Results (for high-traffic caching demo)
    this.results = [
      {
        id: 'res-10-1-final',
        student_id: 'STU-2026-1001',
        student_name: 'তানভীর আহমেদ',
        class_name: '১০ম শ্রেণি',
        roll_number: 1,
        section: 'ক (পদ্মা)',
        group: 'বিজ্ঞান',
        exam_name: 'বার্ষিক পরীক্ষা',
        year: 2026,
        subjects: [
          { subject_name: 'বাংলা ১ম পত্র', full_marks: 100, obtained_marks: 88, highest_marks: 92, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'বাংলা ২য় পত্র', full_marks: 100, obtained_marks: 85, highest_marks: 89, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'ইংরেজি ১ম পত্র', full_marks: 100, obtained_marks: 84, highest_marks: 90, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'ইংরেজি ২য় পত্র', full_marks: 100, obtained_marks: 82, highest_marks: 87, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'সাধারণ গণিত', full_marks: 100, obtained_marks: 98, highest_marks: 98, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'পদার্থবিজ্ঞান', full_marks: 100, obtained_marks: 94, highest_marks: 95, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'রসায়ন', full_marks: 100, obtained_marks: 91, highest_marks: 93, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'জীববিজ্ঞান', full_marks: 100, obtained_marks: 89, highest_marks: 91, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'উচ্চতর গণিত (৪র্থ)', full_marks: 100, obtained_marks: 96, highest_marks: 96, grade: 'A+', grade_point: 5.0 },
        ],
        total_marks: 807,
        gpa: 5.0,
        letter_grade: 'A+',
        status: 'PASSED',
        published: true,
        published_at: '2026-01-20T12:00:00.000Z',
        teacher_id: 'tch-1',
        created_at: '2026-01-20T10:00:00.000Z',
        updated_at: '2026-01-20T12:00:00.000Z',
      },
      {
        id: 'res-10-2-final',
        student_id: 'STU-2026-1002',
        student_name: 'সাদিয়া আক্তার',
        class_name: '১০ম শ্রেণি',
        roll_number: 2,
        section: 'ক (পদ্মা)',
        group: 'বিজ্ঞান',
        exam_name: 'বার্ষিক পরীক্ষা',
        year: 2026,
        subjects: [
          { subject_name: 'বাংলা ১ম পত্র', full_marks: 100, obtained_marks: 80, highest_marks: 92, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'বাংলা ২য় পত্র', full_marks: 100, obtained_marks: 78, highest_marks: 89, grade: 'A', grade_point: 4.0 },
          { subject_name: 'ইংরেজি ১ম পত্র', full_marks: 100, obtained_marks: 82, highest_marks: 90, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'ইংরেজি ২য় পত্র', full_marks: 100, obtained_marks: 85, highest_marks: 87, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'সাধারণ গণিত', full_marks: 100, obtained_marks: 92, highest_marks: 98, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'পদার্থবিজ্ঞান', full_marks: 100, obtained_marks: 86, highest_marks: 95, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'রসায়ন', full_marks: 100, obtained_marks: 88, highest_marks: 93, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'জীববিজ্ঞান', full_marks: 100, obtained_marks: 84, highest_marks: 91, grade: 'A+', grade_point: 5.0 },
          { subject_name: 'উচ্চতর গণিত (৪র্থ)', full_marks: 100, obtained_marks: 90, highest_marks: 96, grade: 'A+', grade_point: 5.0 },
        ],
        total_marks: 765,
        gpa: 4.89,
        letter_grade: 'A',
        status: 'PASSED',
        published: true,
        published_at: '2026-01-20T12:00:00.000Z',
        teacher_id: 'tch-1',
        created_at: '2026-01-20T10:00:00.000Z',
        updated_at: '2026-01-20T12:00:00.000Z',
      },
    ];
  }
}

export const db = new Database();

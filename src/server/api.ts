/**
 * RESTful API Routes for School Management System
 * Implements RBAC, Digital Admission Workflow, High-Traffic Redis Result Engine,
 * Server-Side Paginated Student Data, and Soft-Deletes.
 */
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, Student, User, ExamResult } from './db.js';
import { redisCache } from './redis.js';
import { backgroundQueue } from './queue.js';
import { authenticateToken, requireRole, generateToken, AuthenticatedRequest } from './auth.js';

export const apiRouter = Router();

// ==========================================
// 1. AUTHENTICATION & PROFILE ENDPOINTS
// ==========================================

/**
 * POST /api/v1/auth/login
 * Public login endpoint for ADMIN, TEACHER, STUDENT
 */
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Bad Request', message: 'Username and password are required.' });
    return;
  }

  // Find user by username or email or student_id
  const user = db.users.find(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase() ||
      u.email.toLowerCase() === username.toLowerCase()
  );

  if (!user || !user.is_active) {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials or inactive account.' });
    return;
  }

  const isValidPassword = bcrypt.compareSync(password, user.passwordHash);
  if (!isValidPassword) {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid username or password.' });
    return;
  }

  const tokenPayload = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  const token = generateToken(tokenPayload);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
});

/**
 * GET /api/v1/auth/me
 * Protected: Get current user profile
 */
apiRouter.get('/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.find((u) => u.id === req.user?.id);
  if (!user) {
    res.status(404).json({ error: 'Not Found', message: 'User not found.' });
    return;
  }

  let extraProfile = {};
  if (user.role === 'STUDENT') {
    extraProfile = db.students.find((s) => s.user_id === user.id) || {};
  } else if (user.role === 'TEACHER') {
    extraProfile = db.teachers.find((t) => t.user_id === user.id) || {};
  }

  res.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      is_active: user.is_active,
    },
    profile: extraProfile,
  });
});

// ==========================================
// 2. DIGITAL ADMISSION WORKFLOW
// ==========================================

/**
 * POST /api/v1/admissions
 * Public admission form submission (creates status: PENDING)
 */
apiRouter.post('/admissions', (req: Request, res: Response) => {
  const body = req.body;

  if (!body.applicant_name || !body.applying_class || !body.phone) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Applicant name, applying class, and phone number are required.',
    });
    return;
  }

  const newId = `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newAdmission = {
    id: newId,
    applicant_name: body.applicant_name,
    applying_class: body.applying_class,
    group: body.group || 'সাধারণ',
    section: body.section || '',
    additional_subject: body.additional_subject || '',
    father_name: body.father_name || '',
    mother_name: body.mother_name || '',
    date_of_birth: body.date_of_birth || '',
    gender: body.gender || 'ছাত্র',
    phone: body.phone,
    email: body.email || '',
    previous_school: body.previous_school || '',
    gpa_or_grade: body.gpa_or_grade || '',
    present_address: body.present_address || '',
    status: 'PENDING' as const, // Rule: status starts at PENDING
    created_at: new Date().toISOString(),
  };

  db.admissions.unshift(newAdmission);

  res.status(201).json({
    message: 'Admission application submitted successfully.',
    admission: newAdmission,
    tracking_id: newAdmission.id,
  });
});

/**
 * GET /api/v1/admissions
 * Admin only: List admission applications with status filter and pagination
 */
apiRouter.get('/admissions', authenticateToken, requireRole('ADMIN'), (req: Request, res: Response) => {
  const status = (req.query.status as string) || 'ALL';
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(req.query.limit as string) || 10));

  let list = db.admissions;
  if (status !== 'ALL') {
    list = list.filter((a) => a.status === status);
  }

  const total = list.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = list.slice(offset, offset + limit);

  res.json({
    data: paginated,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  });
});

/**
 * POST /api/v1/admissions/:id/approve
 * Admin only: Approve pending admission:
 *  a. Generate unique student_id (e.g. STU-2026-XXXX)
 *  b. Create a User account with default password (student123)
 *  c. Change status to ACTIVE (and create Student record)
 */
apiRouter.post('/admissions/:id/approve', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const admission = db.admissions.find((a) => a.id === id);

  if (!admission) {
    res.status(404).json({ error: 'Not Found', message: 'Admission application not found.' });
    return;
  }

  if (admission.status === 'APPROVED') {
    res.status(400).json({ error: 'Bad Request', message: 'Application is already approved.' });
    return;
  }

  // 1. Generate unique student_id (STU-2026-XXXX)
  const serial = 1000 + db.students.length + 1;
  const generatedStudentId = `STU-2026-${serial}`;

  // 2. Create User account with default password
  const defaultPassword = 'student123';
  const passwordHash = bcrypt.hashSync(defaultPassword, 10);
  const username = `stu.${admission.applicant_name.toLowerCase().replace(/[^a-z0-9]/g, '') || serial}`;
  
  const newUser: User = {
    id: `usr-student-${Date.now()}`,
    username,
    email: admission.email || `${generatedStudentId.toLowerCase()}@student.dadraschool.edu.bd`,
    passwordHash,
    role: 'STUDENT',
    name: admission.applicant_name,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    is_active: true,
    created_at: new Date().toISOString(),
  };

  db.users.push(newUser);

  // 3. Create active Student record
  const maxRollInClass = db.students
    .filter((s) => s.class_name === admission.applying_class)
    .reduce((max, s) => Math.max(max, s.roll_number), 0);

  const newStudent: Student = {
    id: `std-${Date.now()}`,
    student_id: generatedStudentId,
    user_id: newUser.id,
    name: admission.applicant_name,
    father_name: admission.father_name,
    mother_name: admission.mother_name,
    class_name: admission.applying_class,
    section: admission.section || 'ক',
    group: (admission.group as any) || 'সাধারণ',
    roll_number: maxRollInClass + 1,
    gender: admission.gender,
    phone: admission.phone,
    email: newUser.email,
    date_of_birth: admission.date_of_birth,
    gpa_or_grade: admission.gpa_or_grade,
    address: admission.present_address,
    admission_date: new Date().toISOString().split('T')[0],
    is_active: true, // ACTIVE status
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.students.push(newStudent);

  // 4. Update admission status to APPROVED
  admission.status = 'APPROVED';
  admission.student_id = generatedStudentId;
  admission.reviewed_by = req.user?.id;
  admission.reviewed_at = new Date().toISOString();

  // 5. Trigger async SMS/Notification job in background queue
  await backgroundQueue.addJob('SEND_ADMISSION_SMS', {
    applicantName: admission.applicant_name,
    phone: admission.phone,
    studentId: generatedStudentId,
    defaultPassword,
  });

  res.json({
    message: 'Application approved successfully! Student account and profile created.',
    student: newStudent,
    account: {
      username: newUser.username,
      defaultPassword,
      student_id: generatedStudentId,
    },
    admission,
  });
});

/**
 * POST /api/v1/admissions/:id/reject
 * Admin only: Reject admission
 */
apiRouter.post('/admissions/:id/reject', authenticateToken, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const admission = db.admissions.find((a) => a.id === id);

  if (!admission) {
    res.status(404).json({ error: 'Not Found', message: 'Admission application not found.' });
    return;
  }

  admission.status = 'REJECTED';
  admission.reviewed_by = req.user?.id;
  admission.reviewed_at = new Date().toISOString();
  admission.rejection_reason = reason || 'യോഗ্যতা শর্তাবলী পূরণ হয়নি';

  res.json({ message: 'Application rejected.', admission });
});

// ==========================================
// 3. STUDENT DATA TABLE (PAGINATED & SOFT DELETE)
// ==========================================

/**
 * GET /api/v1/students
 * Server-side paginated, filterable, and searchable student data table
 */
apiRouter.get('/students', authenticateToken, requireRole('ADMIN', 'TEACHER'), (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10));
  const search = ((req.query.search as string) || '').trim().toLowerCase();
  const className = (req.query.class_name as string) || 'ALL';
  const group = (req.query.group as string) || 'ALL';
  const statusFilter = (req.query.status as string) || 'ALL'; // 'ALL', 'ACTIVE', 'INACTIVE'

  let list = db.students;

  // Filter by Active status (Supports soft delete viewing)
  if (statusFilter === 'ACTIVE') {
    list = list.filter((s) => s.is_active === true);
  } else if (statusFilter === 'INACTIVE') {
    list = list.filter((s) => s.is_active === false);
  }

  // Filter by Class
  if (className !== 'ALL') {
    list = list.filter((s) => s.class_name === className);
  }

  // Filter by Group
  if (group !== 'ALL') {
    list = list.filter((s) => s.group === group);
  }

  // Search by name, student_id, roll, or phone
  if (search) {
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.student_id.toLowerCase().includes(search) ||
        String(s.roll_number).includes(search) ||
        s.phone.includes(search)
    );
  }

  const total = list.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginated = list.slice(offset, offset + limit);

  res.json({
    data: paginated,
    meta: {
      total,
      page,
      limit,
      totalPages,
      activeCount: db.students.filter((s) => s.is_active).length,
      inactiveCount: db.students.filter((s) => !s.is_active).length,
    },
  });
});

/**
 * PATCH /api/v1/students/:id/toggle-active
 * Soft Delete: Toggle is_active flag instead of permanently deleting student records
 */
apiRouter.patch('/students/:id/toggle-active', authenticateToken, requireRole('ADMIN'), (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const student = db.students.find((s) => s.id === id || s.student_id === id);

  if (!student) {
    res.status(404).json({ error: 'Not Found', message: 'Student record not found.' });
    return;
  }

  // Toggle soft delete state
  student.is_active = !student.is_active;
  student.updated_at = new Date().toISOString();

  // Also reflect in associated User account
  if (student.user_id) {
    const user = db.users.find((u) => u.id === student.user_id);
    if (user) {
      user.is_active = student.is_active;
    }
  }

  res.json({
    message: student.is_active
      ? `Student ${student.name} restored to ACTIVE status.`
      : `Student ${student.name} soft-deleted (status set to INACTIVE).`,
    student,
  });
});

// ==========================================
// 4. HIGH-TRAFFIC RESULT PROCESSING & REDIS CACHING
// ==========================================

/**
 * GET /api/v1/results/query
 * High-Traffic student result endpoint:
 * Checks Redis cache FIRST. Falls back to database only on cache miss.
 * Emits X-Cache header and detailed performance telemetry.
 */
apiRouter.get('/results/query', (req: Request, res: Response) => {
  const roll = parseInt(req.query.roll as string);
  const className = (req.query.class_name as string) || '';
  const examName = (req.query.exam_name as string) || '';
  const year = parseInt(req.query.year as string) || 2026;

  if (isNaN(roll) || !className) {
    res.status(400).json({ error: 'Bad Request', message: 'Roll number and class name are required.' });
    return;
  }

  const cacheKey = `result:q:${encodeURIComponent(className)}:${roll}:${encodeURIComponent(examName)}:${year}`;

  // 1. Check Redis Cache
  const cached = redisCache.get<ExamResult>(cacheKey);

  if (cached.hit && cached.data) {
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('X-Response-Time', `${cached.latencyMs}ms`);
    res.json({
      source: 'REDIS_CACHE',
      cacheHit: true,
      latencyMs: cached.latencyMs,
      data: cached.data,
      message: 'Result retrieved from high-speed in-memory Redis cache.',
    });
    return;
  }

  // 2. Cache Miss: Query Database
  const startDb = performance.now();
  const result = db.results.find(
    (r) =>
      r.roll_number === roll &&
      r.class_name === className &&
      (examName ? r.exam_name === examName : true) &&
      r.year === year &&
      r.published === true
  );

  const dbLatencyMs = Number((performance.now() - startDb).toFixed(2));

  if (!result) {
    res.setHeader('X-Cache', 'MISS');
    res.status(404).json({
      source: 'DATABASE',
      cacheHit: false,
      latencyMs: dbLatencyMs,
      message: 'No published result found for the specified roll, class, and exam.',
    });
    return;
  }

  // 3. Populate Redis Cache for subsequent high-traffic reads (TTL 5 minutes)
  redisCache.set(cacheKey, result, 300);

  res.setHeader('X-Cache', 'MISS');
  res.setHeader('X-Response-Time', `${dbLatencyMs}ms`);
  res.json({
    source: 'DATABASE',
    cacheHit: false,
    latencyMs: dbLatencyMs,
    data: result,
    message: 'Result retrieved from PostgreSQL database and cached into Redis.',
  });
});

/**
 * POST /api/v1/results/publish
 * Teacher / Admin View: Input and publish marks.
 * Updates Database and proactively warms the Redis cache!
 */
apiRouter.post('/api/v1/results/publish', authenticateToken, requireRole('TEACHER', 'ADMIN'), (req: AuthenticatedRequest, res: Response) => {
  const { student_id, class_name, roll_number, exam_name, year, subjects, section, group } = req.body;

  if (!student_id || !class_name || !roll_number || !subjects || !Array.isArray(subjects)) {
    res.status(400).json({ error: 'Validation Error', message: 'Missing required result fields or invalid subjects array.' });
    return;
  }

  // Compute total marks, GPA, and Letter Grade
  let totalMarks = 0;
  let totalPoints = 0;
  let hasFailed = false;

  const processedSubjects = subjects.map((sub: any) => {
    const marks = Number(sub.obtained_marks) || 0;
    totalMarks += marks;

    let grade = 'F';
    let point = 0;
    if (marks >= 80) { grade = 'A+'; point = 5.0; }
    else if (marks >= 70) { grade = 'A'; point = 4.0; }
    else if (marks >= 60) { grade = 'A-'; point = 3.5; }
    else if (marks >= 50) { grade = 'B'; point = 3.0; }
    else if (marks >= 40) { grade = 'C'; point = 2.0; }
    else if (marks >= 33) { grade = 'D'; point = 1.0; }
    else { grade = 'F'; point = 0.0; hasFailed = true; }

    totalPoints += point;

    return {
      subject_name: sub.subject_name,
      full_marks: sub.full_marks || 100,
      obtained_marks: marks,
      highest_marks: sub.highest_marks || 95,
      grade,
      grade_point: point,
    };
  });

  const subjectCount = processedSubjects.length || 1;
  const rawGpa = totalPoints / subjectCount;
  const gpa = hasFailed ? 0.0 : Number(rawGpa.toFixed(2));
  
  let letterGrade = 'F';
  if (!hasFailed) {
    if (gpa >= 5.0) letterGrade = 'A+';
    else if (gpa >= 4.0) letterGrade = 'A';
    else if (gpa >= 3.5) letterGrade = 'A-';
    else if (gpa >= 3.0) letterGrade = 'B';
    else if (gpa >= 2.0) letterGrade = 'C';
    else letterGrade = 'D';
  }

  const student = db.students.find((s) => s.student_id === student_id);

  const existingIndex = db.results.findIndex(
    (r) => r.student_id === student_id && r.exam_name === exam_name && r.year === (year || 2026)
  );

  const newResult: ExamResult = {
    id: existingIndex >= 0 ? db.results[existingIndex].id : `res-${Date.now()}`,
    student_id,
    student_name: student ? student.name : req.body.student_name || 'শিক্ষার্থী',
    class_name,
    roll_number: Number(roll_number),
    section: section || student?.section || 'ক',
    group: group || student?.group || 'সাধারণ',
    exam_name: exam_name || 'বার্ষিক পরীক্ষা',
    year: year || 2026,
    subjects: processedSubjects,
    total_marks: totalMarks,
    gpa,
    letter_grade: letterGrade,
    status: hasFailed ? 'FAILED' : 'PASSED',
    published: true,
    published_at: new Date().toISOString(),
    teacher_id: req.user?.id,
    created_at: existingIndex >= 0 ? db.results[existingIndex].created_at : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    db.results[existingIndex] = newResult;
  } else {
    db.results.push(newResult);
  }

  // WARM REDIS CACHE IMMEDIATELY for high traffic
  const cacheKey = `result:q:${encodeURIComponent(class_name)}:${newResult.roll_number}:${encodeURIComponent(newResult.exam_name)}:${newResult.year}`;
  redisCache.set(cacheKey, newResult, 300);

  res.status(201).json({
    message: 'Result published and warmed into Redis cache successfully.',
    result: newResult,
    cacheKey,
  });
});

/**
 * GET /api/v1/results/cache-stats
 * Real-time Redis metrics
 */
apiRouter.get('/results/cache-stats', (req: Request, res: Response) => {
  res.json({
    stats: redisCache.getStats(),
    activeKeys: redisCache.getKeys(),
  });
});

/**
 * POST /api/v1/results/cache-clear
 * Admin cache flush
 */
apiRouter.post('/results/cache-clear', authenticateToken, requireRole('ADMIN'), (req: Request, res: Response) => {
  redisCache.flush();
  res.json({ message: 'Redis cache flushed successfully.', stats: redisCache.getStats() });
});

// ==========================================
// 5. ANALYTICS & DASHBOARD METRICS
// ==========================================

apiRouter.get('/analytics', authenticateToken, requireRole('ADMIN'), (req: Request, res: Response) => {
  const activeStudents = db.students.filter((s) => s.is_active);
  const pendingAdmissions = db.admissions.filter((a) => a.status === 'PENDING');
  const cacheStats = redisCache.getStats();

  res.json({
    overview: {
      totalStudents: db.students.length,
      activeStudents: activeStudents.length,
      inactiveStudents: db.students.length - activeStudents.length,
      totalTeachers: db.teachers.length,
      pendingAdmissions: pendingAdmissions.length,
      publishedResultsCount: db.results.filter((r) => r.published).length,
    },
    cacheStats,
    recentAdmissions: db.admissions.slice(0, 5),
    recentJobs: backgroundQueue.getJobs().slice(0, 5),
  });
});

// Teachers list endpoint
apiRouter.get('/teachers', (req: Request, res: Response) => {
  res.json({ data: db.teachers });
});

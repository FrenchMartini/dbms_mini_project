-- Database Normalization and Heavy Operations Analysis
-- For MERN Student Course Registration System

-- ============================================
-- NORMALIZED DATABASE SCHEMA
-- ============================================

-- Current Schema Analysis:
-- 1. Student Model has embedded enrolledCourses array
-- 2. Course Model has embedded enrolledStudents array
-- 3. No separate Enrollment table

-- PROPOSED NORMALIZED SCHEMA:

-- 1. STUDENTS TABLE (Already exists)
-- Normalized with proper indexing
CREATE INDEX idx_student_studentNumber ON students(studentNumber);
CREATE INDEX idx_student_email ON students(email);
CREATE INDEX idx_student_role ON students(role);

-- 2. COURSES TABLE (Already exists)
-- Normalized with proper indexing
CREATE INDEX idx_course_courseCode ON courses(courseCode);
CREATE INDEX idx_course_capacity ON courses(capacity);
CREATE INDEX idx_course_semester ON courses(semester);

-- 3. ENROLLMENTS TABLE (Should be created for normalization)
-- This separates enrollment data from student and course tables
-- Follows 3NF (Third Normal Form)

-- Hypothetical Mongoose Schema for Enrollments:
/*
const enrollmentSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        index: true
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['enrolled', 'dropped', 'completed'],
        default: 'enrolled'
    },
    grade: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Compound index for unique enrollment
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
*/

-- ============================================
-- DATABASE HEAVY OPERATIONS IDENTIFIED
-- ============================================

-- HEAVY OPERATION #1: Enrolling/Dropping Students
-- Current: Uses embedded arrays in both Student and Course documents
-- Issue: Requires updating two documents for each enrollment
-- Operations:
--   - course.enrolledStudents.push(studentId)
--   - student.enrolledCourses.push(courseId)
--   - Two document updates
-- Performance Impact: MEDIUM (MongoDB handles this but could be optimized)

-- HEAVY OPERATION #2: Getting All Students with Enrolled Courses
-- Current: Uses .populate('enrolledCourses')
-- Issue: Requires join-like operation, can be slow with many students
-- Performance Impact: HIGH (N+1 query problem potential)
-- File: app/controllers/student.server.controller.js

-- HEAVY OPERATION #3: Getting Course Enrollment Status
-- Current: Course.find().populate('enrolledStudents')
-- Issue: Loading all students for each course
-- Performance Impact: HIGH
-- File: app/controllers/enrollment.server.controller.js (getCourseStatus)

-- HEAVY OPERATION #4: Enrollment Statistics
-- Current: Using aggregation with $size operator
-- Operations:
--   - Course.aggregate([ $group, $project ])
--   - Calculating totals on every request
-- Performance Impact: MEDIUM
-- File: app/models/course.server.model.js (getEnrollmentStats)

-- ============================================
-- OPTIMIZATION RECOMMENDATIONS
-- ============================================

-- 1. ADD CACHING for enrollment statistics
--    Cache computed stats for 5-10 minutes
--    Use Redis or in-memory cache

-- 2. ADD DENORMALIZED FIELDS for performance
--    Keep enrollmentCount in Course document (already done with virtual)
--    Keep totalCredits in Student document (already done)

-- 3. ADD COMPOUND INDEXES
CREATE INDEX idx_enrolled ON courses(enrolledStudents);
CREATE INDEX idx_student_enrolled ON students(enrolledCourses);

-- 4. USE PAGINATION for large datasets
--    Instead of loading all students/courses at once
--    Implement cursor-based pagination

-- 5. IMPLEMENT ENROLLMENT SEPARATE COLLECTION
--    Reduces coupling between Student and Course collections
--    Better for analytics and reporting
--    Allows additional enrollment metadata (dates, grades, etc.)

-- ============================================
-- QUERY OPTIMIZATION EXAMPLES
-- ============================================

-- CURRENT (Can be slow):
db.students.find({})
  .populate('enrolledCourses')

-- OPTIMIZED (Better performance):
db.students.find({}, {
  fields: { 
    firstName: 1, 
    lastName: 1, 
    studentNumber: 1,
    enrolledCourses: 1 
  }
})
.populate('enrolledCourses', 'courseCode courseName instructor') // Select only needed fields

-- CURRENT HEAVY OPERATION:
db.courses.find()
  .populate('enrolledStudents')

-- OPTIMIZED:
db.courses.find({}, {
  fields: {
    courseCode: 1,
    courseName: 1,
    capacity: 1,
    enrolledStudents: { $slice: 10 } // Limit populated array
  }
})

-- ============================================
-- NORMALIZATION NOTES
-- ============================================

-- Current Schema Status:
-- ✅ Student collection is normalized (1NF, 2NF)
-- ✅ Course collection is normalized (1NF, 2NF)
-- ⚠️ EnrolledCourses/EnrolledStudents are embedded (acceptable in NoSQL)
-- ⚠️ Not fully normalized to 3NF due to embedded arrays

-- NoSQL Best Practice:
-- Embedded arrays (enrolledCourses, enrolledStudents) are acceptable
-- MongoDB is designed to handle embedded documents efficiently
-- Normalization rules differ from relational databases

-- If Moving to Full Normalization:
-- 1. Create separate Enrollments collection
-- 2. Remove enrolledCourses from Student model
-- 3. Remove enrolledStudents from Course model
-- 4. Update all controllers to use Enrollments collection
-- 5. Add foreign key constraints (references)

-- ============================================
-- INDEXING STRATEGY
-- ============================================

-- Existing Indexes (Good):
-- students: email (unique), studentNumber (unique)
-- courses: courseCode (unique)

-- Recommended Additional Indexes:
CREATE INDEX idx_course_students ON courses(enrolledStudents);
CREATE INDEX idx_student_courses ON students(enrolledCourses);
CREATE INDEX idx_course_semester_capacity ON courses(semester, capacity);
CREATE INDEX idx_student_credits ON students(totalCredits);

-- ============================================
-- PERFORMANCE METRICS TO MONITOR
-- ============================================

-- 1. Enrollment Query Time
-- 2. Student List with Courses Load Time
-- 3. Course Enrollment Status Query Time
-- 4. Statistics Aggregation Time
-- 5. Population Query Time

-- Monitor using: MongoDB Atlas or Mongoose debug mode


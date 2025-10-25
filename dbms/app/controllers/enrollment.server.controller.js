const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const Student = mongoose.model('Student');

function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return "Unknown server error";
    }
}

// Enroll student in a course with real-time updates
exports.enrollStudent = function(req, res) {
    const { courseCode, studentNumber } = req.body;
    const io = req.app.get('io');

    // Find course and student
    Promise.all([
        Course.findOne({ courseCode: courseCode }),
        Student.findOne({ studentNumber: studentNumber })
    ])
    .then(([course, student]) => {
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if course is full
        if (course.enrolledStudents.length >= course.capacity) {
            return res.status(400).json({ 
                message: 'Course is full', 
                availableSeats: 0,
                enrollmentCount: course.enrolledStudents.length,
                capacity: course.capacity
            });
        }

        // Check if student is already enrolled
        if (course.isStudentEnrolled(student._id)) {
            return res.status(400).json({ message: 'Student is already enrolled in this course' });
        }

        // Check if student has reached maximum credits (optional limit)
        const maxCredits = 18; // Maximum credits per semester
        if (student.totalCredits + course.credits > maxCredits) {
            return res.status(400).json({ 
                message: `Student cannot enroll. Would exceed maximum credits (${maxCredits})`,
                currentCredits: student.totalCredits,
                courseCredits: course.credits
            });
        }

        // Enroll student
        course.enrollStudent(student._id);
        student.enrollInCourse(course._id);
        student.totalCredits += course.credits;

        return Promise.all([course.save(), student.save()]);
    })
    .then(([course, student]) => {
        // Emit real-time update
        const enrollmentData = {
            courseCode: course.courseCode,
            courseName: course.courseName,
            enrollmentCount: course.enrolledStudents.length,
            capacity: course.capacity,
            availableSeats: course.availableSeats,
            enrollmentPercentage: course.enrollmentPercentage,
            status: course.status,
            studentName: student.fullName,
            studentNumber: student.studentNumber,
            action: 'enrolled'
        };

        // Emit to all connected clients
        io.emit('enrollment-changed', enrollmentData);
        // Emit to specific course room
        io.to(`course-${course.courseCode}`).emit('course-updated', enrollmentData);

        res.status(200).json({
            message: 'Student enrolled successfully',
            course: course,
            student: student,
            enrollmentData: enrollmentData
        });
    })
    .catch(err => {
        console.error('Enrollment error:', err);
        res.status(500).json({ message: getErrorMessage(err) });
    });
};

// Drop student from a course with real-time updates
exports.dropStudent = function(req, res) {
    const { courseCode, studentNumber } = req.body;
    const io = req.app.get('io');

    Promise.all([
        Course.findOne({ courseCode: courseCode }),
        Student.findOne({ studentNumber: studentNumber })
    ])
    .then(([course, student]) => {
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if student is enrolled
        if (!course.isStudentEnrolled(student._id)) {
            return res.status(400).json({ message: 'Student is not enrolled in this course' });
        }

        // Drop student
        course.dropStudent(student._id);
        student.dropCourse(course._id);
        student.totalCredits -= course.credits;

        return Promise.all([course.save(), student.save()]);
    })
    .then(([course, student]) => {
        // Emit real-time update
        const enrollmentData = {
            courseCode: course.courseCode,
            courseName: course.courseName,
            enrollmentCount: course.enrolledStudents.length,
            capacity: course.capacity,
            availableSeats: course.availableSeats,
            enrollmentPercentage: course.enrollmentPercentage,
            status: course.status,
            studentName: student.fullName,
            studentNumber: student.studentNumber,
            action: 'dropped'
        };

        // Emit to all connected clients
        io.emit('enrollment-changed', enrollmentData);
        // Emit to specific course room
        io.to(`course-${course.courseCode}`).emit('course-updated', enrollmentData);

        res.status(200).json({
            message: 'Student dropped successfully',
            course: course,
            student: student,
            enrollmentData: enrollmentData
        });
    })
    .catch(err => {
        console.error('Drop error:', err);
        res.status(500).json({ message: getErrorMessage(err) });
    });
};

// Get course enrollment status
exports.getCourseStatus = function(req, res) {
    const courseCode = req.params.courseCode;

    Course.findOne({ courseCode: courseCode })
        .populate('enrolledStudents', 'firstName lastName studentNumber email')
        .exec((err, course) => {
            if (err) {
                return res.status(400).json({ message: getErrorMessage(err) });
            }
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            res.status(200).json({
                courseCode: course.courseCode,
                courseName: course.courseName,
                enrollmentCount: course.enrolledStudents.length,
                capacity: course.capacity,
                availableSeats: course.availableSeats,
                enrollmentPercentage: course.enrollmentPercentage,
                status: course.status,
                enrolledStudents: course.enrolledStudents,
                instructor: course.instructor,
                credits: course.credits,
                schedule: course.schedule
            });
        });
};

// Get all available courses
exports.getAvailableCourses = function(req, res) {
    Course.findAvailableCourses()
        .populate('enrolledStudents', 'firstName lastName studentNumber')
        .exec((err, courses) => {
            if (err) {
                return res.status(400).json({ message: getErrorMessage(err) });
            }

            const availableCourses = courses.map(course => ({
                _id: course._id,
                courseCode: course.courseCode,
                courseName: course.courseName,
                section: course.section,
                semester: course.semester,
                capacity: course.capacity,
                enrollmentCount: course.enrolledStudents.length,
                availableSeats: course.availableSeats,
                enrollmentPercentage: course.enrollmentPercentage,
                status: course.status,
                instructor: course.instructor,
                credits: course.credits,
                schedule: course.schedule,
                description: course.description
            }));

            res.status(200).json(availableCourses);
        });
};

// Get enrollment statistics
exports.getEnrollmentStats = function(req, res) {
    Course.getEnrollmentStats()
        .then(stats => {
            res.status(200).json(stats[0] || {
                totalCourses: 0,
                totalCapacity: 0,
                totalEnrolled: 0,
                averageEnrollment: 0
            });
        })
        .catch(err => {
            res.status(500).json({ message: getErrorMessage(err) });
        });
};

// Get student's enrolled courses
exports.getStudentCourses = function(req, res) {
    const studentNumber = req.params.studentNumber;

    Student.findOne({ studentNumber: studentNumber })
        .populate('enrolledCourses')
        .exec((err, student) => {
            if (err) {
                return res.status(400).json({ message: getErrorMessage(err) });
            }
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            res.status(200).json({
                student: {
                    firstName: student.firstName,
                    lastName: student.lastName,
                    studentNumber: student.studentNumber,
                    totalCredits: student.totalCredits,
                    academicYear: student.academicYear,
                    gpa: student.gpa
                },
                enrolledCourses: student.enrolledCourses
            });
        });
};

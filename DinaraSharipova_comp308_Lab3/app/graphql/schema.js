const { gql } = require('apollo-server-express');
const mongoose = require('mongoose');
// Ensure models are registered before accessing them
require('../models/course.server.model');
require('../models/student.server.model');
const Course = mongoose.model('Course');
const Student = mongoose.model('Student');

// GraphQL Schema Definition
const typeDefs = gql`
    type Course {
        _id: ID!
        courseCode: String!
        courseName: String!
        section: String!
        semester: String!
        capacity: Int!
        enrolledStudents: [Student!]!
        instructor: String!
        credits: Int!
        schedule: Schedule
        prerequisites: [String!]!
        description: String
        isActive: Boolean!
        enrollmentCount: Int!
        availableSeats: Int!
        enrollmentPercentage: Int!
        status: String!
        createdAt: String!
        updatedAt: String!
    }

    type Schedule {
        days: [String!]!
        time: TimeSlot
        room: String
    }

    type TimeSlot {
        start: String
        end: String
    }

    type Student {
        _id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
        email: String
        studentNumber: Int!
        program: String!
        city: String!
        address: String!
        phone: String!
        enrolledCourses: [Course!]!
        academicYear: String!
        gpa: Float!
        totalCredits: Int!
        isActive: Boolean!
        createdAt: String!
        updatedAt: String!
    }

    type EnrollmentStats {
        totalCourses: Int!
        totalCapacity: Int!
        totalEnrolled: Int!
        averageEnrollment: Float!
    }

    type StudentStats {
        academicYear: String!
        count: Int!
        averageGPA: Float!
        averageCredits: Float!
    }

    type CourseAnalytics {
        courseCode: String!
        courseName: String!
        enrollmentTrend: [EnrollmentData!]!
        studentDemographics: [StudentDemographic!]!
    }

    type EnrollmentData {
        date: String!
        enrollmentCount: Int!
        capacity: Int!
    }

    type StudentDemographic {
        academicYear: String!
        count: Int!
        percentage: Float!
    }

    type Query {
        # Course queries
        courses: [Course!]!
        course(courseCode: String!): Course
        availableCourses: [Course!]!
        coursesByInstructor(instructor: String!): [Course!]!
        coursesBySemester(semester: String!): [Course!]!
        
        # Student queries
        students: [Student!]!
        student(studentNumber: Int!): Student
        studentsByAcademicYear(academicYear: String!): [Student!]!
        studentsByProgram(program: String!): [Student!]!
        
        # Enrollment queries
        enrollmentStats: EnrollmentStats!
        studentStats: [StudentStats!]!
        courseAnalytics(courseCode: String!): CourseAnalytics
        
        # Advanced queries
        searchCourses(searchTerm: String!): [Course!]!
        coursesWithAvailableSeats: [Course!]!
        studentsWithHighGPA(minGPA: Float!): [Student!]!
        coursesByCreditsRange(minCredits: Int!, maxCredits: Int!): [Course!]!
    }

    type Mutation {
        # Course mutations
        createCourse(input: CourseInput!): Course!
        updateCourse(courseCode: String!, input: CourseUpdateInput!): Course!
        deleteCourse(courseCode: String!): Boolean!
        
        # Student mutations
        createStudent(input: StudentInput!): Student!
        updateStudent(studentNumber: Int!, input: StudentUpdateInput!): Student!
        deleteStudent(studentNumber: Int!): Boolean!
        
        # Enrollment mutations
        enrollStudent(courseCode: String!, studentNumber: Int!): EnrollmentResult!
        dropStudent(courseCode: String!, studentNumber: Int!): EnrollmentResult!
    }

    type EnrollmentResult {
        success: Boolean!
        message: String!
        course: Course
        student: Student
        enrollmentData: EnrollmentData
    }

    input CourseInput {
        courseCode: String!
        courseName: String!
        section: String!
        semester: String!
        capacity: Int!
        instructor: String!
        credits: Int!
        schedule: ScheduleInput
        prerequisites: [String!]
        description: String
    }

    input ScheduleInput {
        days: [String!]!
        time: TimeSlotInput
        room: String
    }

    input TimeSlotInput {
        start: String
        end: String
    }

    input CourseUpdateInput {
        courseName: String
        section: String
        semester: String
        capacity: Int
        instructor: String
        credits: Int
        schedule: ScheduleInput
        prerequisites: [String!]
        description: String
        isActive: Boolean
    }

    input StudentInput {
        firstName: String!
        lastName: String!
        email: String
        studentNumber: Int!
        password: String!
        program: String!
        city: String!
        address: String!
        phone: String!
        academicYear: String
        gpa: Float
    }

    input StudentUpdateInput {
        firstName: String
        lastName: String
        email: String
        password: String
        program: String
        city: String
        address: String
        phone: String
        academicYear: String
        gpa: Float
        totalCredits: Int
        isActive: Boolean
    }
`;

// GraphQL Resolvers
const resolvers = {
    Query: {
        // Course queries
        courses: async () => {
            return await Course.find().populate('enrolledStudents');
        },
        
        course: async (_, { courseCode }) => {
            return await Course.findOne({ courseCode }).populate('enrolledStudents');
        },
        
        availableCourses: async () => {
            return await Course.findAvailableCourses().populate('enrolledStudents');
        },
        
        coursesByInstructor: async (_, { instructor }) => {
            return await Course.find({ instructor }).populate('enrolledStudents');
        },
        
        coursesBySemester: async (_, { semester }) => {
            return await Course.find({ semester }).populate('enrolledStudents');
        },
        
        // Student queries
        students: async () => {
            return await Student.find().populate('enrolledCourses');
        },
        
        student: async (_, { studentNumber }) => {
            return await Student.findOne({ studentNumber }).populate('enrolledCourses');
        },
        
        studentsByAcademicYear: async (_, { academicYear }) => {
            return await Student.findByAcademicYear(academicYear).populate('enrolledCourses');
        },
        
        studentsByProgram: async (_, { program }) => {
            return await Student.find({ program }).populate('enrolledCourses');
        },
        
        // Enrollment queries
        enrollmentStats: async () => {
            const stats = await Course.getEnrollmentStats();
            return stats[0] || {
                totalCourses: 0,
                totalCapacity: 0,
                totalEnrolled: 0,
                averageEnrollment: 0
            };
        },
        
        studentStats: async () => {
            return await Student.getStudentStats();
        },
        
        courseAnalytics: async (_, { courseCode }) => {
            const course = await Course.findOne({ courseCode }).populate('enrolledStudents');
            if (!course) return null;
            
            // Calculate student demographics
            const demographics = {};
            course.enrolledStudents.forEach(student => {
                demographics[student.academicYear] = (demographics[student.academicYear] || 0) + 1;
            });
            
            const totalStudents = course.enrolledStudents.length;
            const studentDemographics = Object.entries(demographics).map(([year, count]) => ({
                academicYear: year,
                count,
                percentage: totalStudents > 0 ? (count / totalStudents) * 100 : 0
            }));
            
            return {
                courseCode: course.courseCode,
                courseName: course.courseName,
                enrollmentTrend: [], // Could be populated with historical data
                studentDemographics
            };
        },
        
        // Advanced queries
        searchCourses: async (_, { searchTerm }) => {
            const regex = new RegExp(searchTerm, 'i');
            return await Course.find({
                $or: [
                    { courseName: regex },
                    { courseCode: regex },
                    { instructor: regex },
                    { description: regex }
                ]
            }).populate('enrolledStudents');
        },
        
        coursesWithAvailableSeats: async () => {
            return await Course.find({
                $expr: { $lt: [{ $size: "$enrolledStudents" }, "$capacity"] }
            }).populate('enrolledStudents');
        },
        
        studentsWithHighGPA: async (_, { minGPA }) => {
            return await Student.find({ gpa: { $gte: minGPA } }).populate('enrolledCourses');
        },
        
        coursesByCreditsRange: async (_, { minCredits, maxCredits }) => {
            return await Course.find({
                credits: { $gte: minCredits, $lte: maxCredits }
            }).populate('enrolledStudents');
        }
    },
    
    Mutation: {
        // Course mutations
        createCourse: async (_, { input }) => {
            const course = new Course(input);
            return await course.save();
        },
        
        updateCourse: async (_, { courseCode, input }) => {
            return await Course.findOneAndUpdate(
                { courseCode },
                input,
                { new: true }
            ).populate('enrolledStudents');
        },
        
        deleteCourse: async (_, { courseCode }) => {
            const result = await Course.findOneAndDelete({ courseCode });
            return !!result;
        },
        
        // Student mutations
        createStudent: async (_, { input }) => {
            const student = new Student(input);
            return await student.save();
        },
        
        updateStudent: async (_, { studentNumber, input }) => {
            return await Student.findOneAndUpdate(
                { studentNumber },
                input,
                { new: true }
            ).populate('enrolledCourses');
        },
        
        deleteStudent: async (_, { studentNumber }) => {
            const result = await Student.findOneAndDelete({ studentNumber });
            return !!result;
        },
        
        // Enrollment mutations
        enrollStudent: async (_, { courseCode, studentNumber }) => {
            const course = await Course.findOne({ courseCode });
            const student = await Student.findOne({ studentNumber });
            
            if (!course || !student) {
                return {
                    success: false,
                    message: 'Course or student not found'
                };
            }
            
            if (course.enrolledStudents.length >= course.capacity) {
                return {
                    success: false,
                    message: 'Course is full'
                };
            }
            
            if (course.isStudentEnrolled(student._id)) {
                return {
                    success: false,
                    message: 'Student is already enrolled'
                };
            }
            
            course.enrollStudent(student._id);
            student.enrollInCourse(course._id);
            student.totalCredits += course.credits;
            
            await Promise.all([course.save(), student.save()]);
            
            return {
                success: true,
                message: 'Student enrolled successfully',
                course: await Course.findById(course._id).populate('enrolledStudents'),
                student: await Student.findById(student._id).populate('enrolledCourses'),
                enrollmentData: {
                    date: new Date().toISOString(),
                    enrollmentCount: course.enrolledStudents.length,
                    capacity: course.capacity
                }
            };
        },
        
        dropStudent: async (_, { courseCode, studentNumber }) => {
            const course = await Course.findOne({ courseCode });
            const student = await Student.findOne({ studentNumber });
            
            if (!course || !student) {
                return {
                    success: false,
                    message: 'Course or student not found'
                };
            }
            
            if (!course.isStudentEnrolled(student._id)) {
                return {
                    success: false,
                    message: 'Student is not enrolled in this course'
                };
            }
            
            course.dropStudent(student._id);
            student.dropCourse(course._id);
            student.totalCredits -= course.credits;
            
            await Promise.all([course.save(), student.save()]);
            
            return {
                success: true,
                message: 'Student dropped successfully',
                course: await Course.findById(course._id).populate('enrolledStudents'),
                student: await Student.findById(student._id).populate('enrolledCourses'),
                enrollmentData: {
                    date: new Date().toISOString(),
                    enrollmentCount: course.enrolledStudents.length,
                    capacity: course.capacity
                }
            };
        }
    }
};

module.exports = { typeDefs, resolvers };

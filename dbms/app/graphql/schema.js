const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Student {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
    email: String!
    studentNumber: String!
    address: String
    city: String
    phone: String
    program: String
    gpa: Float
    totalCredits: Int!
    academicYear: String
    enrolledCourses: [Course]
    createdAt: String
    updatedAt: String
  }

  type Course {
    id: ID!
    courseCode: String!
    courseName: String!
    description: String
    instructor: String!
    credits: Int!
    capacity: Int!
    section: String
    semester: String
    schedule: Schedule
    enrolledStudents: [Student]
    enrollmentCount: Int!
    availableSeats: Int!
    enrollmentPercentage: Int!
    status: String!
    createdAt: String
    updatedAt: String
  }

  type Schedule {
    day: String
    startTime: String
    endTime: String
  }

  type AuthResponse {
    token: String!
    student: Student!
  }

  type Query {
    students: [Student]
    student(id: ID!): Student
    courses: [Course]
    course(id: ID!): Course
    courseByCode(courseCode: String!): Course
    availableCourses: [Course]
    studentCourses(studentNumber: String!): [Course]
    me: Student
  }

  type EnrollmentResult {
    success: Boolean!
    message: String!
    courseCode: String!
    courseName: String!
    enrollmentCount: Int!
    capacity: Int!
    availableSeats: Int!
    status: String!
  }

  type BulkEnrollmentResult {
    studentNumber: String!
    studentName: String!
    totalEnrolled: Int!
    totalCredits: Int!
    results: [EnrollmentResult!]!
    errors: [String!]!
  }

  type Mutation {
    createStudent(
      firstName: String!
      lastName: String!
      email: String!
      studentNumber: String!
      password: String!
      address: String
      city: String
      phone: String
      program: String
    ): Student!

    updateStudent(
      id: ID!
      firstName: String
      lastName: String
      email: String
      address: String
      city: String
      phone: String
      program: String
    ): Student!

    deleteStudent(id: ID!): String!

    createCourse(
      courseCode: String!
      courseName: String!
      instructor: String!
      credits: Int!
      capacity: Int!
      section: String
      semester: String
      description: String
    ): Course!

    updateCourse(
      id: ID!
      courseName: String
      instructor: String
      capacity: Int
      description: String
    ): Course!

    deleteCourse(id: ID!): String!

    enrollStudent(
      studentNumber: String!
      courseCode: String!
    ): String!

    enrollMultipleCourses(
      studentNumber: String!
      courseCodes: [String!]!
    ): BulkEnrollmentResult!

    dropCourse(
      studentNumber: String!
      courseCode: String!
    ): String!

    authenticate(
      studentNumber: String!
      password: String!
    ): AuthResponse!

    logout: String!
  }
`;

const resolvers = {
  Query: {
    students: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Student = mongoose.model('Student');
      return await Student.find().populate('enrolledCourses');
    },

    student: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Student = mongoose.model('Student');
      return await Student.findById(args.id).populate('enrolledCourses');
    },

    courses: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Course = mongoose.model('Course');
      return await Course.find().populate('enrolledStudents');
    },

    course: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Course = mongoose.model('Course');
      return await Course.findById(args.id).populate('enrolledStudents');
    },

    courseByCode: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Course = mongoose.model('Course');
      return await Course.findOne({ courseCode: args.courseCode }).populate('enrolledStudents');
    },

    availableCourses: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Course = mongoose.model('Course');
      return await Course.find().populate('enrolledStudents');
    },

    studentCourses: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Student = mongoose.model('Student');
      const student = await Student.findOne({ studentNumber: args.studentNumber }).populate('enrolledCourses');
      return student ? student.enrolledCourses : [];
    }
  },

  Mutation: {
    createStudent: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Student = mongoose.model('Student');
      const student = new Student(args);
      return await student.save();
    },

    updateStudent: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Student = mongoose.model('Student');
      return await Student.findByIdAndUpdate(args.id, args, { new: true });
    },

    deleteStudent: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Student = mongoose.model('Student');
      await Student.findByIdAndRemove(args.id);
      return 'Student deleted successfully';
    },

    createCourse: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Course = mongoose.model('Course');
      const course = new Course(args);
      return await course.save();
    },

    updateCourse: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Course = mongoose.model('Course');
      return await Course.findByIdAndUpdate(args.id, args, { new: true });
    },

    deleteCourse: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Course = mongoose.model('Course');
      await Course.findByIdAndRemove(args.id);
      return 'Course deleted successfully';
    },

    enrollStudent: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Student = mongoose.model('Student');
      const Course = mongoose.model('Course');
      
      const student = await Student.findOne({ studentNumber: args.studentNumber });
      const course = await Course.findOne({ courseCode: args.courseCode });
      
      if (!student || !course) {
        throw new Error('Student or Course not found');
      }

      // Check if already enrolled
      if (course.enrolledStudents.includes(student._id)) {
        throw new Error('Student is already enrolled in this course');
      }

      // Check if course is full
      if (course.enrolledStudents.length >= course.capacity) {
        throw new Error('Course is full');
      }

      course.enrollStudent(student._id);
      student.enrollInCourse(course._id);
      student.totalCredits += course.credits;

      await course.save();
      await student.save();

      return 'Enrollment successful';
    },

    enrollMultipleCourses: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Student = mongoose.model('Student');
      const Course = mongoose.model('Course');
      
      // Get Socket.IO instance from socket manager
      const socketManager = require('../../socket-manager');
      const io = socketManager.getSocketIO();
      
      const student = await Student.findOne({ studentNumber: args.studentNumber });
      
      if (!student) {
        throw new Error('Student not found');
      }

      const results = [];
      const errors = [];
      let totalEnrolled = 0;
      let totalCredits = 0;

      // Process each course enrollment
      for (const courseCode of args.courseCodes) {
        try {
          const course = await Course.findOne({ courseCode });
          
          if (!course) {
            errors.push(`Course ${courseCode} not found`);
            continue;
          }

          // Check if already enrolled
          if (course.enrolledStudents.includes(student._id)) {
            errors.push(`Already enrolled in ${courseCode}`);
            continue;
          }

          // Check if course is full
          if (course.enrolledStudents.length >= course.capacity) {
            errors.push(`Course ${courseCode} is full`);
            continue;
          }

          // Enroll student
          course.enrollStudent(student._id);
          student.enrollInCourse(course._id);
          student.totalCredits += course.credits;

          await course.save();
          await student.save();

          // Re-fetch course to get updated virtual properties
          const updatedCourse = await Course.findOne({ courseCode });
          
          results.push({
            success: true,
            message: `Successfully enrolled in ${courseCode}`,
            courseCode: course.courseCode,
            courseName: course.courseName,
            enrollmentCount: updatedCourse.enrolledStudents ? updatedCourse.enrolledStudents.length : 0,
            capacity: course.capacity,
            availableSeats: updatedCourse.availableSeats,
            status: updatedCourse.status
          });

          totalEnrolled++;
          totalCredits += course.credits;

          // Emit real-time update via WebSocket
          if (io) {
            const enrollmentData = {
              courseCode: course.courseCode,
              courseName: course.courseName,
              enrollmentCount: updatedCourse.enrolledStudents ? updatedCourse.enrolledStudents.length : 0,
              capacity: course.capacity,
              availableSeats: updatedCourse.availableSeats,
              enrollmentPercentage: updatedCourse.enrollmentPercentage,
              status: updatedCourse.status,
              studentName: student.fullName,
              studentNumber: student.studentNumber,
              action: 'enrolled'
            };

            io.emit('enrollment-changed', enrollmentData);
            io.to(`course-${course.courseCode}`).emit('course-updated', enrollmentData);
          } else {
            console.log('Socket.IO not available for real-time updates');
          }

        } catch (error) {
          errors.push(`Error enrolling in ${courseCode}: ${error.message}`);
        }
      }

      return {
        studentNumber: student.studentNumber,
        studentName: student.fullName,
        totalEnrolled,
        totalCredits,
        results,
        errors
      };
    },

    dropCourse: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Student = mongoose.model('Student');
      const Course = mongoose.model('Course');
      
      const student = await Student.findOne({ studentNumber: args.studentNumber });
      const course = await Course.findOne({ courseCode: args.courseCode });
      
      if (!student || !course) {
        throw new Error('Student or Course not found');
      }

      if (!course.enrolledStudents.includes(student._id)) {
        throw new Error('Student is not enrolled in this course');
      }

      course.dropStudent(student._id);
      student.dropCourse(course._id);
      student.totalCredits -= course.credits;

      await course.save();
      await student.save();

      return 'Drop successful';
    }
  }
};

module.exports = { typeDefs, resolvers };

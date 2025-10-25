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
      studentId: ID!
      courseId: ID!
    ): String!

    dropCourse(
      studentId: ID!
      courseId: ID!
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
      
      const student = await Student.findById(args.studentId);
      const course = await Course.findById(args.courseId);
      
      if (!student || !course) {
        throw new Error('Student or Course not found');
      }

      course.enrollStudent(student._id);
      student.enrollInCourse(course._id);
      student.totalCredits += course.credits;

      await course.save();
      await student.save();

      return 'Enrollment successful';
    },

    dropCourse: async (parent, args, context) => {
      const mongoose = require('mongoose');
      const Student = mongoose.model('Student');
      const Course = mongoose.model('Course');
      
      const student = await Student.findById(args.studentId);
      const course = await Course.findById(args.courseId);
      
      if (!student || !course) {
        throw new Error('Student or Course not found');
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

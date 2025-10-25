const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// Define the Student schema
const studentSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /.+\@.+\..+/
    },
    studentNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        set: hashPassword
    },
    address: String,
    city: String,
    phone: String,
    program: String,
    gpa: {
        type: Number,
        default: 0,
        min: 0,
        max: 4
    },
    totalCredits: {
        type: Number,
        default: 0
    },
    academicYear: {
        type: String,
        default: '2024-2025'
    },
    enrolledCourses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
function hashPassword(password) {
    if (password && password.length > 0) {
        return bcrypt.hashSync(password, 10);
    }
    return password;
}

// Instance method to compare passwords
studentSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// Instance method to check if enrolled in a course
studentSchema.methods.isEnrolledInCourse = function(courseId) {
    return this.enrolledCourses.includes(courseId);
};

// Instance method to enroll in a course
studentSchema.methods.enrollInCourse = function(courseId) {
    if (!this.enrolledCourses.includes(courseId)) {
        this.enrolledCourses.push(courseId);
    }
};

// Instance method to drop a course
studentSchema.methods.dropCourse = function(courseId) {
    const index = this.enrolledCourses.indexOf(courseId);
    if (index > -1) {
        this.enrolledCourses.splice(index, 1);
    }
};

// Virtual field for fullName
studentSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
});

// Ensure virtual fields are serialized when converting to JSON
studentSchema.set('toJSON', {
    virtuals: true
});

// Pre-save middleware to update timestamp
studentSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Create the Student model
mongoose.model('Student', studentSchema);

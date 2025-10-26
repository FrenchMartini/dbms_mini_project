const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Course schema
const courseSchema = new Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    courseName: {
        type: String,
        required: true
    },
    description: String,
    instructor: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    section: {
        type: String,
        default: '001'
    },
    semester: {
        type: String,
        default: 'Fall 2024'
    },
    schedule: {
        day: String,
        startTime: String,
        endTime: String
    },
    enrolledStudents: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
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

// Virtual property for available seats
courseSchema.virtual('availableSeats').get(function() {
    const enrolledCount = this.enrolledStudents ? this.enrolledStudents.length : 0;
    return this.capacity - enrolledCount;
});

// Virtual property for enrollment percentage
courseSchema.virtual('enrollmentPercentage').get(function() {
    const enrolledCount = this.enrolledStudents ? this.enrolledStudents.length : 0;
    return Math.round((enrolledCount / this.capacity) * 100);
});

// Virtual property for course status
courseSchema.virtual('status').get(function() {
    const percentage = this.enrollmentPercentage;
    if (percentage >= 100) {
        return 'Full';
    } else if (percentage >= 80) {
        return 'Almost Full';
    } else {
        return 'Available';
    }
});

// Enable virtuals in JSON and Object output
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

// Instance method to enroll a student
courseSchema.methods.enrollStudent = function(studentId) {
    if (!this.enrolledStudents.includes(studentId)) {
        this.enrolledStudents.push(studentId);
    }
};

// Instance method to drop a student
courseSchema.methods.dropStudent = function(studentId) {
    const index = this.enrolledStudents.indexOf(studentId);
    if (index > -1) {
        this.enrolledStudents.splice(index, 1);
    }
};

// Instance method to check if student is enrolled
courseSchema.methods.isStudentEnrolled = function(studentId) {
    return this.enrolledStudents.includes(studentId);
};

// Static method to find available courses
courseSchema.statics.findAvailableCourses = function() {
    return this.find();
};

// Static method to get enrollment statistics
courseSchema.statics.getEnrollmentStats = function() {
    return this.aggregate([
        {
            $group: {
                _id: null,
                totalCourses: { $sum: 1 },
                totalCapacity: { $sum: '$capacity' },
                totalEnrolled: { $sum: { $size: '$enrolledStudents' } }
            }
        },
        {
            $project: {
                _id: 0,
                totalCourses: 1,
                totalCapacity: 1,
                totalEnrolled: 1,
                averageEnrollment: {
                    $cond: [
                        { $eq: ['$totalCourses', 0] },
                        0,
                        { $round: [{ $divide: ['$totalEnrolled', '$totalCourses'] }, 2] }
                    ]
                }
            }
        }
    ]);
};

// Pre-save middleware
courseSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Create the Course model
mongoose.model('Course', courseSchema);

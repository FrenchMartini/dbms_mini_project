const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
    courseCode: {
        type: String,
        required: 'Course code is mandatory',
        unique: true
    },
    courseName: {
        type: String,
        required: 'Course Name is mandatory',
        default: '',
        trim: true
    },
    section: {
        type: String, 
        default: '',
        required: 'Section is mandatory',
        trim: true
    },
    semester: {
        type: String, 
        required: 'Semester is mandatory',
        default: '',
        trim: true
    },
    capacity: {
        type: Number,
        required: 'Course capacity is mandatory',
        min: [1, 'Capacity must be at least 1'],
        default: 30
    },
    enrolledStudents: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    instructor: {
        type: String,
        required: 'Instructor is mandatory',
        trim: true
    },
    credits: {
        type: Number,
        required: 'Credits are mandatory',
        min: [1, 'Credits must be at least 1'],
        max: [6, 'Credits cannot exceed 6'],
        default: 3
    },
    schedule: {
        days: [{
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }],
        time: {
            start: String,
            end: String
        },
        room: String
    },
    prerequisites: [String],
    description: {
        type: String,
        maxlength: 500
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for enrollment count
CourseSchema.virtual('enrollmentCount').get(function() {
    return this.enrolledStudents.length;
});

// Virtual for available seats
CourseSchema.virtual('availableSeats').get(function() {
    return this.capacity - this.enrolledStudents.length;
});

// Virtual for enrollment percentage
CourseSchema.virtual('enrollmentPercentage').get(function() {
    return Math.round((this.enrolledStudents.length / this.capacity) * 100);
});

// Virtual for course status
CourseSchema.virtual('status').get(function() {
    if (this.enrolledStudents.length >= this.capacity) {
        return 'Full';
    } else if (this.enrolledStudents.length >= this.capacity * 0.8) {
        return 'Almost Full';
    } else {
        return 'Available';
    }
});

// Instance method to check if student is enrolled
CourseSchema.methods.isStudentEnrolled = function(studentId) {
    return this.enrolledStudents.includes(studentId);
};

// Instance method to enroll student
CourseSchema.methods.enrollStudent = function(studentId) {
    if (!this.isStudentEnrolled(studentId) && this.enrolledStudents.length < this.capacity) {
        this.enrolledStudents.push(studentId);
        return true;
    }
    return false;
};

// Instance method to drop student
CourseSchema.methods.dropStudent = function(studentId) {
    const index = this.enrolledStudents.indexOf(studentId);
    if (index > -1) {
        this.enrolledStudents.splice(index, 1);
        return true;
    }
    return false;
};

// Static method to find courses by availability
CourseSchema.statics.findAvailableCourses = function() {
    return this.find({
        isActive: true,
        $expr: { $lt: [{ $size: "$enrolledStudents" }, "$capacity"] }
    });
};

// Static method to find courses by student
CourseSchema.statics.findCoursesByStudent = function(studentId) {
    return this.find({ enrolledStudents: studentId });
};

// Static method to get enrollment statistics
CourseSchema.statics.getEnrollmentStats = function() {
    return this.aggregate([
        {
            $group: {
                _id: null,
                totalCourses: { $sum: 1 },
                totalCapacity: { $sum: "$capacity" },
                totalEnrolled: { $sum: { $size: "$enrolledStudents" } },
                averageEnrollment: { $avg: { $size: "$enrolledStudents" } }
            }
        }
    ]);
};

// Indexes for better performance
CourseSchema.index({ courseCode: 1 });
CourseSchema.index({ enrolledStudents: 1 });
CourseSchema.index({ isActive: 1 });
CourseSchema.index({ semester: 1, isActive: 1 });
CourseSchema.index({ instructor: 1 });

mongoose.model('Course', CourseSchema);

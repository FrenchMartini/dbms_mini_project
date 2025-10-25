// Load the module dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
//Define a schema
const Schema = mongoose.Schema;
//
// Define a new 'UserSchema'
var StudentSchema = new Schema({
    firstName: {
		type: String,
		max: 50,
		required: 'First Name is mandatory'
	},
	lastName: {
		type: String,
		max: 50,
		required: 'Last Name is mandatory'
	},
	email: {
		type: String,
		max:50,
		// Validate the email format
		match: [/.+\@.+\..+/, "Please fill a valid email address"]
	},
	studentNumber: {
		type: Number,
		unique: true,
		required: 'Student Number is mandatory',
	},
	password: {
		type: String,
		validate: [
			(password) => password && password.length > 6,
			'Password should be longer'
		]
	},
	program:{
		type: String,
		max:50,
		required: 'program is mandatory'
	},
	city:{
		type: String,
		max:30,
		required: 'City is mandatory'
	},
	address:{
		type: String,
		max:100,
		required: 'Address is mandatory'
	},
	
	phone:{
		type: String,
		max:15,
		required: 'Phone Number is required'
	},
	enrolledCourses: [{
		type: Schema.Types.ObjectId,
		ref: 'Course'
	}],
	academicYear: {
		type: String,
		enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'],
		default: 'Freshman'
	},
	gpa: {
		type: Number,
		min: 0,
		max: 4.0,
		default: 0
	},
	totalCredits: {
		type: Number,
		default: 0
	},
	isActive: {
		type: Boolean,
		default: true
	}
});

// Set the 'fullname' virtual property
StudentSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
	const splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

// Use a pre-save middleware to hash the password
// before saving it into database
StudentSchema.pre('save', function(next){
	//hash the password before saving it
	this.password = bcrypt.hashSync(this.password, saltRounds);
	next();
});

// Create an instance method for authenticating user
StudentSchema.methods.authenticate = function(password) {
	//compare the hashed password of the database 
	//with the hashed version of the password the user enters
	return this.password === bcrypt.hashSync(password, saltRounds);
};

// Instance method to check if student is enrolled in a course
StudentSchema.methods.isEnrolledInCourse = function(courseId) {
	return this.enrolledCourses.includes(courseId);
};

// Instance method to enroll in a course
StudentSchema.methods.enrollInCourse = function(courseId) {
	if (!this.isEnrolledInCourse(courseId)) {
		this.enrolledCourses.push(courseId);
		return true;
	}
	return false;
};

// Instance method to drop a course
StudentSchema.methods.dropCourse = function(courseId) {
	const index = this.enrolledCourses.indexOf(courseId);
	if (index > -1) {
		this.enrolledCourses.splice(index, 1);
		return true;
	}
	return false;
};

// Instance method to get total enrolled credits
StudentSchema.methods.getTotalCredits = function() {
	return this.enrolledCourses.reduce((total, course) => {
		return total + (course.credits || 0);
	}, 0);
};

// Static method to find students by academic year
StudentSchema.statics.findByAcademicYear = function(year) {
	return this.find({ academicYear: year, isActive: true });
};

// Static method to get student statistics
StudentSchema.statics.getStudentStats = function() {
	return this.aggregate([
		{
			$group: {
				_id: '$academicYear',
				count: { $sum: 1 },
				averageGPA: { $avg: '$gpa' },
				averageCredits: { $avg: '$totalCredits' }
			}
		}
	]);
};


// Configure the 'UserSchema' to use getters and virtuals when transforming to JSON
StudentSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

// Indexes for better performance
StudentSchema.index({ studentNumber: 1 });
StudentSchema.index({ email: 1 });
StudentSchema.index({ enrolledCourses: 1 });
StudentSchema.index({ academicYear: 1 });
StudentSchema.index({ isActive: 1 });

// Create the 'User' model out of the 'UserSchema'
mongoose.model('Student', StudentSchema);
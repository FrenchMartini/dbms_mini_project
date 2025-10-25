const enrollmentController = require('../controllers/enrollment.server.controller');

module.exports = function(app) {
    // Enrollment routes
    app.post('/api/enrollment/enroll', enrollmentController.enrollStudent);
    app.post('/api/enrollment/drop', enrollmentController.dropStudent);
    app.get('/api/enrollment/course-status/:courseCode', enrollmentController.getCourseStatus);
    app.get('/api/enrollment/available-courses', enrollmentController.getAvailableCourses);
    app.get('/api/enrollment/enrollment-stats', enrollmentController.getEnrollmentStats);
    app.get('/api/enrollment/student-courses/:studentNumber', enrollmentController.getStudentCourses);
};

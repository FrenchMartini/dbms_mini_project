module.exports = function(app) {
    const enrollment = require('../../app/controllers/enrollment.server.controller');
    
    app.post('/api/enrollment/enroll', enrollment.enrollStudent);
    app.post('/api/enrollment/drop', enrollment.dropStudent);
    app.get('/api/enrollment/course-status/:courseCode', enrollment.getCourseStatus);
    app.get('/api/enrollment/available-courses', enrollment.getAvailableCourses);
    app.get('/api/enrollment/enrollment-stats', enrollment.getEnrollmentStats);
    app.get('/api/enrollment/student-courses/:studentNumber', enrollment.getStudentCourses);
};

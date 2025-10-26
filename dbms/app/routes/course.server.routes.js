module.exports = function(app) {
    const courses = require('../../app/controllers/course.server.controller');
    
    app.get('/courses', courses.list);
    app.post('/courses', courses.create);
    
    // Route for getting course by ID (MongoDB ObjectId)
    app.get('/courses/byId/:courseId', courses.readById);
    
    app.route('/courses/:courseCode')
        .get(courses.read)
        .put(courses.update)
        .delete(courses.delete);

    app.param('courseCode', courses.courseByCode);
};

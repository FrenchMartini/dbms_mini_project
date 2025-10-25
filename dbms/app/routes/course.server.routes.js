module.exports = function(app) {
    const courses = require('../../app/controllers/course.server.controller');
    
    app.get('/courses', courses.list);
    app.post('/courses', courses.create);
    
    app.route('/courses/:courseCode')
        .get(courses.read)
        .put(courses.update)
        .delete(courses.delete);

    app.param('courseCode', courses.courseByCode);
};

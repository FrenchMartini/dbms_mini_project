module.exports = function(app) {
    const students = require('../../app/controllers/student.server.controller');
    
    app.get("/students", students.list);
    app.post('/', students.create);
    
    app.route('/students/:studentNumber')
        .get(students.read)
        .put(students.updateStudent)
        .delete(students.deleteStudent);

    app.param('studentNumber', students.userByID);
    app.post('/signin', students.authenticate);
    app.get('/signout', students.signout);
    app.get('/read_cookie', students.isSignedIn);
    app.get('/welcome', students.welcome);
};

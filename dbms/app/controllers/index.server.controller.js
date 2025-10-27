exports.render = function(req, res) {
    res.status(200).render('index', {
        title: 'Course Management System'
    });
};

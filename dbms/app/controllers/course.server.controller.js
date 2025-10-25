const mongoose = require('mongoose');
const Course = mongoose.model('Course');

function getErrorMessage(err) {
    return err.message || "Error";
}

exports.list = function(req, res) {
    Course.find().populate('enrolledStudents').exec((err, courses) => {
        if (err) return res.status(400).json({ message: getErrorMessage(err) });
        res.status(200).json(courses);
    });
};

exports.create = function(req, res) {
    const course = new Course(req.body);
    course.save((err) => {
        if (err) return res.status(400).json({ message: getErrorMessage(err) });
        res.status(201).json({ message: 'Created', course });
    });
};

exports.read = function(req, res) {
    res.status(200).json(req.course);
};

exports.update = function(req, res) {
    const course = req.course;
    course.courseName = req.body.courseName || course.courseName;
    course.instructor = req.body.instructor || course.instructor;
    course.capacity = req.body.capacity || course.capacity;
    course.description = req.body.description || course.description;

    course.save((err) => {
        if (err) return res.status(400).json({ message: getErrorMessage(err) });
        res.status(200).json({ message: 'Updated', course });
    });
};

exports.delete = function(req, res) {
    req.course.deleteOne((err) => {
        if (err) return res.status(400).json({ message: getErrorMessage(err) });
        res.status(200).json({ message: 'Deleted' });
    });
};

exports.courseByCode = function(req, res, next, id) {
    Course.findOne({ courseCode: id }).populate('enrolledStudents').exec((err, course) => {
        if (err) return next(err);
        if (!course) return res.status(404).json({ message: 'Not found' });
        req.course = course;
        next();
    });
};

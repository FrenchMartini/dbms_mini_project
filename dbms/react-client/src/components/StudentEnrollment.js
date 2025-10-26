import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';

function StudentEnrollment(props) {
    const studentNumber = props.screen;
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchCourses();
        fetchEnrolledCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setRefreshing(true);
            const response = await axios.get('http://localhost:5001/api/enrollment/available-courses');
            setCourses(response.data);
            setShowLoading(false);
            setRefreshing(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setMessage({ text: 'Failed to load courses', type: 'danger' });
            setShowLoading(false);
            setRefreshing(false);
        }
    };

    const fetchEnrolledCourses = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/enrollment/student-courses/${studentNumber}`);
            setEnrolledCourses(response.data.enrolledCourses || []);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
        }
    };

    const enrollInCourse = async (courseCode) => {
        if (!studentNumber) {
            setMessage({ text: 'Student number not found', type: 'danger' });
            return;
        }

        try {
            setMessage({ text: '', type: '' });
            const response = await axios.post('http://localhost:5001/api/enrollment/enroll', {
                courseCode: courseCode,
                studentNumber: studentNumber
            });

            setMessage({ text: response.data.message || 'Enrolled successfully!', type: 'success' });
            
            // Refresh data after enrollment
            setTimeout(() => {
                fetchCourses();
                fetchEnrolledCourses();
                setMessage({ text: '', type: '' });
            }, 1500);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to enroll in course';
            setMessage({ text: errorMessage, type: 'danger' });
            console.error('Enrollment error:', error);
        }
    };

    const dropCourse = async (courseCode) => {
        if (!studentNumber) {
            setMessage({ text: 'Student number not found', type: 'danger' });
            return;
        }

        try {
            setMessage({ text: '', type: '' });
            const response = await axios.post('http://localhost:5001/api/enrollment/drop', {
                courseCode: courseCode,
                studentNumber: studentNumber
            });

            setMessage({ text: response.data.message || 'Dropped successfully!', type: 'success' });
            
            // Refresh data after drop
            setTimeout(() => {
                fetchCourses();
                fetchEnrolledCourses();
                setMessage({ text: '', type: '' });
            }, 1500);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to drop course';
            setMessage({ text: errorMessage, type: 'danger' });
            console.error('Drop error:', error);
        }
    };

    const isEnrolled = (courseId) => {
        return enrolledCourses.some(course => course._id === courseId);
    };

    const isFull = (course) => {
        return course.enrollmentCount >= course.capacity;
    };

    const getStatusBadge = (course) => {
        if (isEnrolled(course._id)) {
            return <span className="badge bg-success">Enrolled</span>;
        } else if (isFull(course)) {
            return <span className="badge bg-danger">Full</span>;
        } else {
            return <span className="badge bg-warning">Available</span>;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Full': return 'text-danger';
            case 'Almost Full': return 'text-warning';
            case 'Available': return 'text-success';
            default: return 'text-secondary';
        }
    };

    return (
        <div>
            <div className="header">
                <div className="mask">
                    <div className="d-flex justify-content-center align-items-center h-100">
                        <div className="text-white" style={{fontSize: '1.4rem', fontWeight: '600', textAlign: 'center'}}>
                            Enroll in Courses - Student: {studentNumber}
                        </div>
                    </div>
                </div>
            </div>

            <div className="margin-class">
                {showLoading && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                )}

                {message.text && (
                    <Alert variant={message.type} className="mb-3">
                        {message.text}
                    </Alert>
                )}

                <div className="row">
                    <div className="col-md-6">
                        <Card>
                            <Card.Header>
                                <h5>Available Courses</h5>
                                <Button variant="link" size="sm" onClick={fetchCourses} disabled={refreshing}>
                                    {refreshing ? 'Refreshing...' : 'Refresh'}
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {courses.length === 0 ? (
                                    <p className="text-muted">No courses available</p>
                                ) : (
                                    <ListGroup variant="flush">
                                        {courses.map((course) => (
                                            <ListGroup.Item key={course._id}>
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="flex-grow-1">
                                                        <h6>{course.courseCode} - {course.courseName}</h6>
                                                        <p className="mb-1">
                                                            <small>Instructor: {course.instructor}</small><br/>
                                                            <small>Credits: {course.credits}</small><br/>
                                                            <small>Schedule: {course.schedule?.day} {course.schedule?.startTime}-{course.schedule?.endTime}</small>
                                                        </p>
                                                        <p className="mb-2">
                                                            Enrollment: {course.enrollmentCount}/{course.capacity}
                                                            <span className="ms-2">
                                                                <small className={getStatusColor(course.status)}>({course.status})</small>
                                                            </span>
                                                        </p>
                                                        <div className="progress" style={{ height: '8px' }}>
                                                            <div 
                                                                className="progress-bar"
                                                                style={{
                                                                    width: `${course.enrollmentPercentage}%`,
                                                                    backgroundColor: course.enrollmentPercentage >= 100 ? '#dc3545' :
                                                                                    course.enrollmentPercentage >= 80 ? '#ffc107' : '#28a745'
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    <div className="ms-3">
                                                        {getStatusBadge(course)}
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    {isEnrolled(course._id) ? (
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm"
                                                            onClick={() => dropCourse(course.courseCode)}
                                                        >
                                                            Drop Course
                                                        </Button>
                                                    ) : isFull(course) ? (
                                                        <Button variant="secondary" size="sm" disabled>
                                                            Full
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            variant="primary" 
                                                            size="sm"
                                                            onClick={() => enrollInCourse(course.courseCode)}
                                                        >
                                                            Enroll
                                                        </Button>
                                                    )}
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </Card.Body>
                        </Card>
                    </div>

                    <div className="col-md-6">
                        <Card>
                            <Card.Header>
                                <h5>Your Enrolled Courses</h5>
                            </Card.Header>
                            <Card.Body>
                                {enrolledCourses.length === 0 ? (
                                    <p className="text-muted">You are not enrolled in any courses yet</p>
                                ) : (
                                    <ListGroup variant="flush">
                                        {enrolledCourses.map((course) => (
                                            <ListGroup.Item key={course._id}>
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <h6>{course.courseCode} - {course.courseName}</h6>
                                                        <p className="mb-1">
                                                            <small>Instructor: {course.instructor}</small><br/>
                                                            <small>Credits: {course.credits}</small><br/>
                                                            <small>Schedule: {course.schedule?.day} {course.schedule?.startTime}-{course.schedule?.endTime}</small>
                                                        </p>
                                                        <span className="badge bg-success">Enrolled</span>
                                                    </div>
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm"
                                                        onClick={() => dropCourse(course.courseCode)}
                                                    >
                                                        Drop
                                                    </Button>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </div>

                <Button className="mt-3" variant="secondary" onClick={() => props.setScreen(props.screen)}>
                    Go Back
                </Button>
            </div>
        </div>
    );
}

export default StudentEnrollment;



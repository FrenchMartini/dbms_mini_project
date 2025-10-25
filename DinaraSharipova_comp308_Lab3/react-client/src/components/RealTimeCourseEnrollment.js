import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const RealTimeCourseEnrollment = () => {
    const [socket, setSocket] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [studentNumber, setStudentNumber] = useState('');
    const [enrollmentMessage, setEnrollmentMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Initialize Socket.IO connection
        const newSocket = io('http://localhost:5001', {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });
        setSocket(newSocket);

        // Socket event listeners
        newSocket.on('connect', () => {
            console.log('Connected to server on port 5001');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });

        newSocket.on('enrollment-changed', (data) => {
            console.log('Enrollment changed:', data);
            setEnrollmentMessage(`${data.studentName} ${data.action} in ${data.courseName}`);
            
            // Update courses list
            fetchCourses();
        });

        newSocket.on('course-updated', (data) => {
            console.log('Course updated:', data);
            setCourses(prevCourses => 
                prevCourses.map(course => 
                    course.courseCode === data.courseCode 
                        ? { ...course, ...data }
                        : course
                )
            );
        });

        // Fetch initial courses
        fetchCourses();

        return () => {
            newSocket.close();
        };
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/enrollment/available-courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const joinCourseRoom = (courseCode) => {
        if (socket) {
            socket.emit('join-course-room', courseCode);
            setSelectedCourse(courseCode);
        }
    };

    const leaveCourseRoom = (courseCode) => {
        if (socket) {
            socket.emit('leave-course-room', courseCode);
            setSelectedCourse(null);
        }
    };

    const enrollStudent = async () => {
        if (!selectedCourse || !studentNumber) {
            alert('Please select a course and enter student number');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/api/enrollment/enroll', {
                courseCode: selectedCourse,
                studentNumber: studentNumber
            });

            if (response.data.message) {
                setEnrollmentMessage(response.data.message);
                // Refresh courses after successful enrollment
                setTimeout(() => fetchCourses(), 500);
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            setEnrollmentMessage(error.response?.data?.message || 'Enrollment failed');
        }
    };

    const dropStudent = async () => {
        if (!selectedCourse || !studentNumber) {
            alert('Please select a course and enter student number');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/api/enrollment/drop', {
                courseCode: selectedCourse,
                studentNumber: studentNumber
            });

            if (response.data.message) {
                setEnrollmentMessage(response.data.message);
                // Refresh courses after successful drop
                setTimeout(() => fetchCourses(), 500);
            }
        } catch (error) {
            console.error('Drop error:', error);
            setEnrollmentMessage(error.response?.data?.message || 'Drop failed');
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
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8">
                    <h2>Real-Time Course Enrollment</h2>
                    
                    {/* Connection Status */}
                    <div className={`alert ${isConnected ? 'alert-success' : 'alert-danger'}`}>
                        Socket Status: {isConnected ? 'Connected' : 'Disconnected'}
                    </div>

                    {/* Enrollment Message */}
                    {enrollmentMessage && (
                        <div className="alert alert-info">
                            {enrollmentMessage}
                        </div>
                    )}

                    {/* Student Input */}
                    <div className="form-group mb-3">
                        <label htmlFor="studentNumber">Student Number:</label>
                        <input
                            type="number"
                            className="form-control"
                            id="studentNumber"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            placeholder="Enter student number"
                        />
                    </div>

                    {/* Course Selection */}
                    <div className="form-group mb-3">
                        <label htmlFor="courseSelect">Select Course:</label>
                        <select
                            className="form-control"
                            id="courseSelect"
                            value={selectedCourse || ''}
                            onChange={(e) => {
                                if (selectedCourse) {
                                    leaveCourseRoom(selectedCourse);
                                }
                                if (e.target.value) {
                                    joinCourseRoom(e.target.value);
                                }
                            }}
                        >
                            <option value="">Select a course</option>
                            {courses.map(course => (
                                <option key={course._id} value={course.courseCode}>
                                    {course.courseCode} - {course.courseName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="mb-3">
                        <button 
                            className="btn btn-success me-2" 
                            onClick={enrollStudent}
                            disabled={!selectedCourse || !studentNumber}
                        >
                            Enroll Student
                        </button>
                        <button 
                            className="btn btn-danger" 
                            onClick={dropStudent}
                            disabled={!selectedCourse || !studentNumber}
                        >
                            Drop Student
                        </button>
                    </div>

                    {/* Courses List */}
                    <h3>Available Courses</h3>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Course Name</th>
                                    <th>Instructor</th>
                                    <th>Credits</th>
                                    <th>Enrollment</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course._id}>
                                        <td>{course.courseCode}</td>
                                        <td>{course.courseName}</td>
                                        <td>{course.instructor}</td>
                                        <td>{course.credits}</td>
                                        <td>
                                            {course.enrollmentCount}/{course.capacity}
                                            <div className="progress mt-1" style={{ height: '5px' }}>
                                                <div 
                                                    className="progress-bar" 
                                                    style={{ 
                                                        width: `${course.enrollmentPercentage}%`,
                                                        backgroundColor: course.enrollmentPercentage >= 100 ? '#dc3545' : 
                                                                        course.enrollmentPercentage >= 80 ? '#ffc107' : '#28a745'
                                                    }}
                                                ></div>
                                            </div>
                                        </td>
                                        <td className={getStatusColor(course.status)}>
                                            {course.status}
                                        </td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${selectedCourse === course.courseCode ? 'btn-warning' : 'btn-primary'}`}
                                                onClick={() => {
                                                    if (selectedCourse === course.courseCode) {
                                                        leaveCourseRoom(course.courseCode);
                                                    } else {
                                                        if (selectedCourse) {
                                                            leaveCourseRoom(selectedCourse);
                                                        }
                                                        joinCourseRoom(course.courseCode);
                                                    }
                                                }}
                                            >
                                                {selectedCourse === course.courseCode ? 'Leave Room' : 'Join Room'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-md-4">
                    <h3>Course Details</h3>
                    {selectedCourse && (
                        <div className="card">
                            <div className="card-body">
                                {(() => {
                                    const course = courses.find(c => c.courseCode === selectedCourse);
                                    return course ? (
                                        <>
                                            <h5 className="card-title">{course.courseCode} - {course.courseName}</h5>
                                            <p className="card-text">
                                                <strong>Instructor:</strong> {course.instructor}<br/>
                                                <strong>Credits:</strong> {course.credits}<br/>
                                                <strong>Section:</strong> {course.section}<br/>
                                                <strong>Semester:</strong> {course.semester}
                                            </p>
                                            <div className="mb-2">
                                                <strong>Enrollment:</strong> {course.enrollmentCount}/{course.capacity}
                                                <div className="progress mt-1">
                                                    <div 
                                                        className="progress-bar" 
                                                        style={{ 
                                                            width: `${course.enrollmentPercentage}%`,
                                                            backgroundColor: course.enrollmentPercentage >= 100 ? '#dc3545' : 
                                                                            course.enrollmentPercentage >= 80 ? '#ffc107' : '#28a745'
                                                        }}
                                                    >
                                                        {course.enrollmentPercentage}%
                                                    </div>
                                                </div>
                                            </div>
                                            <p className={`card-text ${getStatusColor(course.status)}`}>
                                                <strong>Status:</strong> {course.status}
                                            </p>
                                            {course.description && (
                                                <p className="card-text">
                                                    <strong>Description:</strong> {course.description}
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p>Course not found</p>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RealTimeCourseEnrollment;

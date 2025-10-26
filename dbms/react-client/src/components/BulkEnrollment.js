import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Table, Badge, Alert, Spinner } from 'react-bootstrap';

const BulkEnrollment = () => {
    const [enrollmentData, setEnrollmentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchBulkEnrollmentData();
    }, []);

    const fetchBulkEnrollmentData = async () => {
        try {
            setLoading(true);
            
            // Fetch students with their enrolled courses
            const studentsResponse = await axios.get('http://localhost:5001/students');
            const students = studentsResponse.data;

            // Fetch all courses with enrollment info
            const coursesResponse = await axios.get('http://localhost:5001/api/enrollment/available-courses');
            const courses = coursesResponse.data;

            // Calculate statistics
            const totalStudents = students.length;
            const totalCourses = courses.length;
            const totalEnrollments = students.reduce((sum, s) => sum + (s.enrolledCourses?.length || 0), 0);
            const averageCoursesPerStudent = totalStudents > 0 ? (totalEnrollments / totalStudents).toFixed(2) : 0;

            // Find students with enrollment issues
            const studentsOverLimit = students.filter(s => s.totalCredits > 18);
            const studentsWithConflicts = [];

            // Check for schedule conflicts
            students.forEach(student => {
                if (student.enrolledCourses && student.enrolledCourses.length > 1) {
                    const schedules = student.enrolledCourses.map(c => c.schedule?.day);
                    const hasConflicts = schedules.some((day, idx) => 
                        schedules.indexOf(day) !== idx && day !== undefined
                    );
                    if (hasConflicts) {
                        studentsWithConflicts.push({
                            student: student,
                            conflictCount: schedules.filter(d => d !== undefined).length
                        });
                    }
                }
            });

            setStats({
                totalStudents,
                totalCourses,
                totalEnrollments,
                averageCoursesPerStudent,
                studentsOverLimit: studentsOverLimit.length,
                studentsWithConflicts: studentsWithConflicts.length
            });

            // Prepare display data
            const enrollmentInfo = students.map(student => ({
                studentNumber: student.studentNumber,
                name: `${student.firstName} ${student.lastName}`,
                enrolledCount: student.enrolledCourses?.length || 0,
                totalCredits: student.totalCredits || 0,
                courses: student.enrolledCourses?.map(c => c.courseCode).join(', ') || 'None',
                program: student.program,
                hasIssues: student.totalCredits > 18
            }));

            setEnrollmentData(enrollmentInfo);
        } catch (err) {
            setError('Failed to fetch enrollment data: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const getCreditStatusColor = (credits) => {
        if (credits === 0) return 'secondary';
        if (credits <= 12) return 'success';
        if (credits <= 18) return 'warning';
        return 'danger';
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>📊 Bulk Enrollment Analytics</h2>

            {/* Statistics Cards */}
            {stats && (
                <div className="row mb-4">
                    <div className="col-md-3">
                        <Card className="text-center">
                            <Card.Body>
                                <h5>Total Students</h5>
                                <h2 className="text-primary">{stats.totalStudents}</h2>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-3">
                        <Card className="text-center">
                            <Card.Body>
                                <h5>Total Courses</h5>
                                <h2 className="text-info">{stats.totalCourses}</h2>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-3">
                        <Card className="text-center">
                            <Card.Body>
                                <h5>Total Enrollments</h5>
                                <h2 className="text-success">{stats.totalEnrollments}</h2>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-md-3">
                        <Card className="text-center">
                            <Card.Body>
                                <h5>Avg per Student</h5>
                                <h2 className="text-warning">{stats.averageCoursesPerStudent}</h2>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            )}

            {/* Alerts */}
            {stats && stats.studentsOverLimit > 0 && (
                <Alert variant="danger" className="mb-4">
                    ⚠️ {stats.studentsOverLimit} student(s) exceeding 18 credit limit!
                </Alert>
            )}

            {stats && stats.studentsWithConflicts > 0 && (
                <Alert variant="warning" className="mb-4">
                    ⚠️ {stats.studentsWithConflicts} student(s) have potential schedule conflicts!
                </Alert>
            )}

            {/* Enrollment Table */}
            <Card>
                <Card.Header>
                    <h5>Student Enrollment Overview</h5>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th>Student #</th>
                                    <th>Name</th>
                                    <th>Program</th>
                                    <th>Courses</th>
                                    <th>Credits</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrollmentData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.studentNumber}</td>
                                        <td>{item.name}</td>
                                        <td>{item.program}</td>
                                        <td>{item.courses || 'None'}</td>
                                        <td>
                                            <Badge bg={getCreditStatusColor(item.totalCredits)}>
                                                {item.totalCredits}
                                            </Badge>
                                        </td>
                                        <td>
                                            {item.hasIssues && <Badge bg="danger">⚠️ Over Limit</Badge>}
                                            {!item.hasIssues && <Badge bg="success">✓ Good</Badge>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default BulkEnrollment;


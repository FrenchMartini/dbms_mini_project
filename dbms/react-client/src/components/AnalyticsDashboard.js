import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnalyticsDashboard = () => {
    const [enrollmentStats, setEnrollmentStats] = useState(null);
    const [studentStats, setStudentStats] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            
            // Fetch enrollment statistics
            const enrollmentResponse = await axios.get('http://localhost:5001/api/enrollment/enrollment-stats');
            setEnrollmentStats(enrollmentResponse.data);

            // Fetch courses with enrollment data
            const coursesResponse = await axios.get('http://localhost:5001/api/enrollment/available-courses');
            setCourses(Array.isArray(coursesResponse.data) ? coursesResponse.data : []);

            // For now, we'll skip the GraphQL student stats query since it's not implemented
            // You can implement this later if needed
            setStudentStats([]);

        } catch (err) {
            console.error('Analytics error details:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch analytics data';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getEnrollmentPercentage = (enrolled, capacity) => {
        return capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Full': return '#dc3545';
            case 'Almost Full': return '#ffc107';
            case 'Available': return '#28a745';
            default: return '#6c757d';
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2>Analytics Dashboard</h2>
            
            {/* Enrollment Statistics Cards */}
            {enrollmentStats && (
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="card text-white bg-primary">
                            <div className="card-body">
                                <h5 className="card-title">Total Courses</h5>
                                <h2>{enrollmentStats.totalCourses}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-success">
                            <div className="card-body">
                                <h5 className="card-title">Total Capacity</h5>
                                <h2>{enrollmentStats.totalCapacity}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-info">
                            <div className="card-body">
                                <h5 className="card-title">Total Enrolled</h5>
                                <h2>{enrollmentStats.totalEnrolled}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-warning">
                            <div className="card-body">
                                <h5 className="card-title">Avg Enrollment</h5>
                                <h2>{enrollmentStats.averageEnrollment?.toFixed(1) || 0}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Status Breakdown */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Enrollment Overview</h5>
                        </div>
                        <div className="card-body">
                            {courses.length > 0 ? (
                                <div className="row text-center">
                                    <div className="col-md-4">
                                        <h3>{courses.filter(c => c.status === 'Full').length}</h3>
                                        <small className="text-muted">Full Courses</small>
                                    </div>
                                    <div className="col-md-4">
                                        <h3>{courses.filter(c => c.status === 'Almost Full').length}</h3>
                                        <small className="text-muted">Almost Full</small>
                                    </div>
                                    <div className="col-md-4">
                                        <h3>{courses.filter(c => c.status === 'Available').length}</h3>
                                        <small className="text-muted">Available</small>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted">No courses data available</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Enrollment Distribution</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Status</th>
                                            <th>Count</th>
                                            <th>Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            const statusCounts = courses.reduce((acc, course) => {
                                                acc[course.status] = (acc[course.status] || 0) + 1;
                                                return acc;
                                            }, {});
                                            
                                            return Object.entries(statusCounts).map(([status, count]) => (
                                                <tr key={status}>
                                                    <td>
                                                        <span 
                                                            className="badge" 
                                                            style={{ backgroundColor: getStatusColor(status) }}
                                                        >
                                                            {status}
                                                        </span>
                                                    </td>
                                                    <td>{count}</td>
                                                    <td>{((count / courses.length) * 100).toFixed(1)}%</td>
                                                </tr>
                                            ));
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Enrollment Chart */}
            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h5>Course Enrollment Overview</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Course Code</th>
                                            <th>Course Name</th>
                                            <th>Instructor</th>
                                            <th>Credits</th>
                                            <th>Enrollment</th>
                                            <th>Status</th>
                                            <th>Progress</th>
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
                                                </td>
                                                <td>
                                                    <span 
                                                        className="badge" 
                                                        style={{ backgroundColor: getStatusColor(course.status) }}
                                                    >
                                                        {course.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="progress" style={{ height: '20px' }}>
                                                        <div 
                                                            className="progress-bar" 
                                                            style={{ 
                                                                width: `${course.enrollmentPercentage}%`,
                                                                backgroundColor: getStatusColor(course.status)
                                                            }}
                                                        >
                                                            {course.enrollmentPercentage}%
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Analytics */}
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Top Enrolled Courses</h5>
                        </div>
                        <div className="card-body">
                            <div className="list-group">
                                {courses
                                    .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
                                    .slice(0, 5)
                                    .map(course => (
                                        <div key={course._id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{course.courseCode}</strong> - {course.courseName}
                                                <br />
                                                <small className="text-muted">{course.instructor}</small>
                                            </div>
                                            <span className="badge bg-primary rounded-pill">
                                                {course.enrollmentCount}/{course.capacity}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h5>Courses by Credits</h5>
                        </div>
                        <div className="card-body">
                            <div className="list-group">
                                {Object.entries(courses
                                    .reduce((acc, course) => {
                                        const credits = course.credits;
                                        acc[credits] = (acc[credits] || 0) + 1;
                                        return acc;
                                    }, {}))
                                    .map(([credits, count]) => (
                                        <div key={credits} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>{credits} Credits</span>
                                            <span className="badge bg-secondary rounded-pill">{count} courses</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Refresh Button */}
            <div className="text-center mt-4">
                <button 
                    className="btn btn-primary" 
                    onClick={fetchAnalytics}
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : 'Refresh Analytics'}
                </button>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;

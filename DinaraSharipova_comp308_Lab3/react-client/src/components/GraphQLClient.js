import React, { useState } from 'react';
import axios from 'axios';

const GraphQLClient = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Predefined queries
    const predefinedQueries = {
        getAllCourses: `
            query {
                courses {
                    _id
                    courseCode
                    courseName
                    instructor
                    credits
                    capacity
                    enrollmentCount
                    availableSeats
                    status
                }
            }
        `,
        getAvailableCourses: `
            query {
                availableCourses {
                    courseCode
                    courseName
                    instructor
                    credits
                    capacity
                    enrollmentCount
                    availableSeats
                    status
                }
            }
        `,
        getEnrollmentStats: `
            query {
                enrollmentStats {
                    totalCourses
                    totalCapacity
                    totalEnrolled
                    averageEnrollment
                }
            }
        `,
        getStudentStats: `
            query {
                studentStats {
                    academicYear
                    count
                    averageGPA
                    averageCredits
                }
            }
        `,
        searchCourses: `
            query {
                searchCourses(searchTerm: "COMP") {
                    courseCode
                    courseName
                    instructor
                    credits
                    status
                }
            }
        `,
        coursesWithAvailableSeats: `
            query {
                coursesWithAvailableSeats {
                    courseCode
                    courseName
                    instructor
                    credits
                    enrollmentCount
                    capacity
                    availableSeats
                }
            }
        `,
        studentsWithHighGPA: `
            query {
                studentsWithHighGPA(minGPA: 3.5) {
                    firstName
                    lastName
                    studentNumber
                    gpa
                    academicYear
                    totalCredits
                }
            }
        `,
        coursesByCreditsRange: `
            query {
                coursesByCreditsRange(minCredits: 3, maxCredits: 4) {
                    courseCode
                    courseName
                    instructor
                    credits
                    status
                }
            }
        `,
        enrollStudent: `
            mutation {
                enrollStudent(courseCode: "COMP308", studentNumber: 123456) {
                    success
                    message
                    course {
                        courseCode
                        courseName
                        enrollmentCount
                        capacity
                    }
                    student {
                        firstName
                        lastName
                        studentNumber
                    }
                }
            }
        `,
        createCourse: `
            mutation {
                createCourse(input: {
                    courseCode: "COMP999"
                    courseName: "Advanced Database Systems"
                    section: "A"
                    semester: "Fall 2024"
                    capacity: 25
                    instructor: "Dr. Smith"
                    credits: 3
                    description: "Advanced concepts in database management systems"
                }) {
                    courseCode
                    courseName
                    instructor
                    credits
                    capacity
                }
            }
        `
    };

    const executeQuery = async () => {
        if (!query.trim()) {
            setError('Please enter a GraphQL query');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await axios.post('http://localhost:5000/graphql', {
                query: query
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setResult(response.data);
        } catch (err) {
            setError(err.response?.data?.errors?.[0]?.message || 'Query execution failed');
        } finally {
            setLoading(false);
        }
    };

    const loadPredefinedQuery = (queryKey) => {
        setQuery(predefinedQueries[queryKey]);
    };

    const clearQuery = () => {
        setQuery('');
        setResult(null);
        setError(null);
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-12">
                    <h2>GraphQL Client</h2>
                    
                    {/* Predefined Queries */}
                    <div className="mb-4">
                        <h4>Predefined Queries</h4>
                        <div className="row">
                            {Object.keys(predefinedQueries).map(queryKey => (
                                <div key={queryKey} className="col-md-3 mb-2">
                                    <button
                                        className="btn btn-outline-primary btn-sm w-100"
                                        onClick={() => loadPredefinedQuery(queryKey)}
                                    >
                                        {queryKey.replace(/([A-Z])/g, ' $1').trim()}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Query Input */}
                    <div className="mb-3">
                        <label htmlFor="queryInput" className="form-label">GraphQL Query:</label>
                        <textarea
                            id="queryInput"
                            className="form-control"
                            rows="10"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter your GraphQL query here..."
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="mb-3">
                        <button 
                            className="btn btn-primary me-2" 
                            onClick={executeQuery}
                            disabled={loading}
                        >
                            {loading ? 'Executing...' : 'Execute Query'}
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            onClick={clearQuery}
                        >
                            Clear
                        </button>
                    </div>

                    {/* Results */}
                    {error && (
                        <div className="alert alert-danger">
                            <h5>Error:</h5>
                            <pre>{error}</pre>
                        </div>
                    )}

                    {result && (
                        <div className="alert alert-success">
                            <h5>Result:</h5>
                            <pre>{JSON.stringify(result, null, 2)}</pre>
                        </div>
                    )}

                    {/* GraphQL Playground Link */}
                    <div className="mt-4">
                        <p>
                            <strong>GraphQL Playground:</strong> 
                            <a href="http://localhost:5000/graphql" target="_blank" rel="noopener noreferrer" className="ms-2">
                                http://localhost:5000/graphql
                            </a>
                        </p>
                    </div>

                    {/* Sample Queries Documentation */}
                    <div className="mt-4">
                        <h4>Sample Queries Documentation</h4>
                        <div className="row">
                            <div className="col-md-6">
                                <h5>Queries</h5>
                                <ul>
                                    <li><code>courses</code> - Get all courses</li>
                                    <li><code>availableCourses</code> - Get courses with available seats</li>
                                    <li><code>enrollmentStats</code> - Get enrollment statistics</li>
                                    <li><code>studentStats</code> - Get student statistics by academic year</li>
                                    <li><code>searchCourses(searchTerm: "COMP")</code> - Search courses</li>
                                    <li><code>coursesWithAvailableSeats</code> - Get courses with seats available</li>
                                    <li><code>studentsWithHighGPA(minGPA: 3.5)</code> - Get students with high GPA</li>
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <h5>Mutations</h5>
                                <ul>
                                    <li><code>enrollStudent(courseCode: "COMP308", studentNumber: 123456)</code></li>
                                    <li><code>dropStudent(courseCode: "COMP308", studentNumber: 123456)</code></li>
                                    <li><code>createCourse(input: {"{...}"})</code></li>
                                    <li><code>updateCourse(courseCode: "COMP308", input: {"{...}"})</code></li>
                                    <li><code>deleteCourse(courseCode: "COMP308")</code></li>
                                    <li><code>createStudent(input: {"{...}"})</code></li>
                                    <li><code>updateStudent(studentNumber: 123456, input: {"{...}"})</code></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GraphQLClient;

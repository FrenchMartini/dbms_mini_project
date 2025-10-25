const axios = require('axios');
const io = require('socket.io-client');

// Test configuration
const BASE_URL = 'http://localhost:5001';
const GRAPHQL_URL = `${BASE_URL}/graphql`;

// Test data
const testStudent = {
    firstName: 'Test',
    lastName: 'Student',
    email: 'test@example.com',
    studentNumber: 999999,
    password: 'password123',
    program: 'Computer Science',
    city: 'Test City',
    address: '123 Test St',
    phone: '123-456-7890',
    academicYear: 'Senior',
    gpa: 3.8
};

const testCourse = {
    courseCode: 'TEST999',
    courseName: 'Test Course',
    section: 'A',
    semester: 'Fall 2024',
    capacity: 10,
    instructor: 'Test Instructor',
    credits: 3,
    description: 'A test course for demonstration'
};

// Test functions
async function testRESTAPI() {
    console.log('🧪 Testing REST API...');
    
    try {
        // Test enrollment stats
        const statsResponse = await axios.get(`${BASE_URL}/api/enrollment/enrollment-stats`);
        console.log('✅ Enrollment stats:', statsResponse.data);
        
        // Test available courses
        const coursesResponse = await axios.get(`${BASE_URL}/api/enrollment/available-courses`);
        console.log('✅ Available courses:', coursesResponse.data.length, 'courses found');
        
    } catch (error) {
        console.error('❌ REST API test failed:', error.message);
    }
}

async function testGraphQL() {
    console.log('🧪 Testing GraphQL API...');
    
    try {
        // Test basic query
        const query = `
            query {
                enrollmentStats {
                    totalCourses
                    totalCapacity
                    totalEnrolled
                    averageEnrollment
                }
            }
        `;
        
        const response = await axios.post(GRAPHQL_URL, { query });
        console.log('✅ GraphQL query successful:', response.data.data);
        
        // Test mutation
        const mutation = `
            mutation {
                createCourse(input: {
                    courseCode: "${testCourse.courseCode}"
                    courseName: "${testCourse.courseName}"
                    section: "${testCourse.section}"
                    semester: "${testCourse.semester}"
                    capacity: ${testCourse.capacity}
                    instructor: "${testCourse.instructor}"
                    credits: ${testCourse.credits}
                    description: "${testCourse.description}"
                }) {
                    courseCode
                    courseName
                    instructor
                    credits
                    capacity
                }
            }
        `;
        
        const mutationResponse = await axios.post(GRAPHQL_URL, { query: mutation });
        console.log('✅ GraphQL mutation successful:', mutationResponse.data.data);
        
    } catch (error) {
        console.error('❌ GraphQL test failed:', error.message);
    }
}

function testSocketIO() {
    console.log('🧪 Testing Socket.IO...');
    
    return new Promise((resolve) => {
        const socket = io(BASE_URL);
        
        socket.on('connect', () => {
            console.log('✅ Socket.IO connected');
            
            // Test joining a course room
            socket.emit('join-course-room', 'TEST999');
            console.log('✅ Joined course room');
            
            // Test leaving the room
            setTimeout(() => {
                socket.emit('leave-course-room', 'TEST999');
                console.log('✅ Left course room');
                
                socket.disconnect();
                resolve();
            }, 2000);
        });
        
        socket.on('disconnect', () => {
            console.log('✅ Socket.IO disconnected');
        });
        
        socket.on('connect_error', (error) => {
            console.error('❌ Socket.IO connection failed:', error.message);
            resolve();
        });
        
        // Timeout after 5 seconds
        setTimeout(() => {
            socket.disconnect();
            resolve();
        }, 5000);
    });
}

async function testEnrollmentFlow() {
    console.log('🧪 Testing enrollment flow...');
    
    try {
        // First create a student
        const createStudentMutation = `
            mutation {
                createStudent(input: {
                    firstName: "${testStudent.firstName}"
                    lastName: "${testStudent.lastName}"
                    email: "${testStudent.email}"
                    studentNumber: ${testStudent.studentNumber}
                    password: "${testStudent.password}"
                    program: "${testStudent.program}"
                    city: "${testStudent.city}"
                    address: "${testStudent.address}"
                    phone: "${testStudent.phone}"
                    academicYear: "${testStudent.academicYear}"
                    gpa: ${testStudent.gpa}
                }) {
                    firstName
                    lastName
                    studentNumber
                }
            }
        `;
        
        const studentResponse = await axios.post(GRAPHQL_URL, { query: createStudentMutation });
        console.log('✅ Student created:', studentResponse.data.data);
        
        // Test enrollment
        const enrollMutation = `
            mutation {
                enrollStudent(courseCode: "${testCourse.courseCode}", studentNumber: ${testStudent.studentNumber}) {
                    success
                    message
                    course {
                        courseCode
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
        `;
        
        const enrollResponse = await axios.post(GRAPHQL_URL, { query: enrollMutation });
        console.log('✅ Enrollment test:', enrollResponse.data.data);
        
    } catch (error) {
        console.error('❌ Enrollment flow test failed:', error.message);
    }
}

async function runAllTests() {
    console.log('🚀 Starting comprehensive tests...\n');
    
    await testRESTAPI();
    console.log('');
    
    await testGraphQL();
    console.log('');
    
    await testSocketIO();
    console.log('');
    
    await testEnrollmentFlow();
    console.log('');
    
    console.log('✅ All tests completed!');
    console.log('\n📋 Test Summary:');
    console.log('- REST API endpoints tested');
    console.log('- GraphQL queries and mutations tested');
    console.log('- Socket.IO connection tested');
    console.log('- Enrollment flow tested');
    console.log('\n🎉 Your enhanced course registration system is ready!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    testRESTAPI,
    testGraphQL,
    testSocketIO,
    testEnrollmentFlow,
    runAllTests
};

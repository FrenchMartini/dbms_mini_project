const axios = require('axios');

async function testMultiEnrollment() {
    console.log('🧪 Testing GraphQL Multi-Course Enrollment...\n');

    const mutation = `
        mutation {
            enrollMultipleCourses(
                studentNumber: "1001"
                courseCodes: ["COMP308", "COMP304", "COMP306"]
            ) {
                studentNumber
                studentName
                totalEnrolled
                totalCredits
                results {
                    success
                    message
                    courseCode
                    courseName
                    enrollmentCount
                    capacity
                    availableSeats
                    status
                }
                errors
            }
        }
    `;

    try {
        console.log('📤 Sending GraphQL mutation...');
        const response = await axios.post('http://localhost:5001/graphql', {
            query: mutation
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ GraphQL Response:');
        console.log(JSON.stringify(response.data, null, 2));

        if (response.data.errors) {
            console.log('\n❌ Errors found:');
            response.data.errors.forEach(error => {
                console.log(`- ${error.message}`);
            });
        }

        if (response.data.data) {
            const result = response.data.data.enrollMultipleCourses;
            console.log('\n📊 Enrollment Summary:');
            console.log(`Student: ${result.studentName} (${result.studentNumber})`);
            console.log(`Total Enrolled: ${result.totalEnrolled}`);
            console.log(`Total Credits: ${result.totalCredits}`);
            
            if (result.results.length > 0) {
                console.log('\n✅ Successful Enrollments:');
                result.results.forEach(course => {
                    console.log(`- ${course.courseCode}: ${course.courseName}`);
                    console.log(`  Status: ${course.status} (${course.enrollmentCount}/${course.capacity})`);
                });
            }

            if (result.errors.length > 0) {
                console.log('\n⚠️  Errors:');
                result.errors.forEach(error => {
                    console.log(`- ${error}`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response?.data) {
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run the test
testMultiEnrollment();

const mongoose = require('mongoose');
const config = require('./config/config');

// Load models
require('./app/models/student.server.model');
require('./app/models/course.server.model');

const Student = mongoose.model('Student');
const Course = mongoose.model('Course');

// Sample students
const students = [
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@student.edu',
        studentNumber: '1001',
        password: 'student123',
        address: '123 Main St',
        city: 'Toronto',
        phone: '416-123-4567',
        program: 'Computer Science',
        gpa: 3.5,
        academicYear: '2024-2025',
        totalCredits: 0
    },
    {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@student.edu',
        studentNumber: '1002',
        password: 'student123',
        address: '456 Oak Ave',
        city: 'Montreal',
        phone: '514-987-6543',
        program: 'Business Administration',
        gpa: 3.8,
        academicYear: '2024-2025',
        totalCredits: 0
    },
    {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@student.edu',
        studentNumber: '1003',
        password: 'student123',
        address: '789 Pine Rd',
        city: 'Vancouver',
        phone: '604-555-1234',
        program: 'Engineering',
        gpa: 3.2,
        academicYear: '2024-2025',
        totalCredits: 0
    },
    {
        firstName: 'Emily',
        lastName: 'Brown',
        email: 'emily.brown@student.edu',
        studentNumber: '1004',
        password: 'student123',
        address: '321 Elm St',
        city: 'Calgary',
        phone: '403-555-5678',
        program: 'Arts',
        gpa: 3.7,
        academicYear: '2024-2025',
        totalCredits: 0
    },
    {
        firstName: 'David',
        lastName: 'Wilson',
        email: 'david.wilson@student.edu',
        studentNumber: '1005',
        password: 'student123',
        address: '654 Maple Dr',
        city: 'Ottawa',
        phone: '613-555-9012',
        program: 'Science',
        gpa: 3.6,
        academicYear: '2024-2025',
        totalCredits: 0
    },
    {
        firstName: 'Sarah',
        lastName: 'Davis',
        email: 'sarah.davis@student.edu',
        studentNumber: '1006',
        password: 'student123',
        address: '987 Cedar Ln',
        city: 'Halifax',
        phone: '902-555-3456',
        program: 'Medicine',
        gpa: 3.9,
        academicYear: '2024-2025',
        totalCredits: 0
    },
    // Admin user
    {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@academic.edu',
        studentNumber: 'admin',
        password: 'admin123',
        address: 'Admin Building',
        city: 'Campus',
        phone: '000-000-0000',
        program: 'Administration',
        role: 'admin',
        gpa: 0,
        academicYear: '2024-2025',
        totalCredits: 0
    }
];

// Sample courses
const courses = [
    {
        courseCode: 'ENGL101',
        courseName: 'English Basics',
        description: 'Foundational English language and literature',
        instructor: 'Dr. Sarah Johnson',
        credits: 3,
        capacity: 30,
        section: '001',
        semester: 'Fall 2024',
        schedule: {
            day: 'Monday, Wednesday, Friday',
            startTime: '09:00',
            endTime: '09:50'
        }
    },
    {
        courseCode: 'BSN101',
        courseName: 'Business Basics',
        description: 'Introduction to business principles and management',
        instructor: 'Prof. Michael Chen',
        credits: 3,
        capacity: 25,
        section: '001',
        semester: 'Fall 2024',
        schedule: {
            day: 'Tuesday, Thursday',
            startTime: '10:30',
            endTime: '12:00'
        }
    },
    {
        courseCode: 'COMP229',
        courseName: 'Web Application Development',
        description: 'Building modern web applications using full-stack technologies',
        instructor: 'Dr. David Kim',
        credits: 4,
        capacity: 35,
        section: '001',
        semester: 'Fall 2024',
        schedule: {
            day: 'Monday, Wednesday',
            startTime: '14:00',
            endTime: '15:30'
        }
    },
    {
        courseCode: 'COMP253',
        courseName: 'Assets for Game Developers',
        description: 'Creating and managing game assets for game development',
        instructor: 'Prof. Emily Rodriguez',
        credits: 3,
        capacity: 20,
        section: '001',
        semester: 'Fall 2024',
        schedule: {
            day: 'Tuesday, Thursday',
            startTime: '13:00',
            endTime: '14:30'
        }
    },
    {
        courseCode: 'ADCS702',
        courseName: 'Introduction to Creative Strategy',
        description: 'Fundamentals of creative strategy in advertising',
        instructor: 'Dr. James Wilson',
        credits: 3,
        capacity: 30,
        section: '001',
        semester: 'Fall 2024',
        schedule: {
            day: 'Monday, Wednesday',
            startTime: '11:00',
            endTime: '12:30'
        }
    },
    {
        courseCode: 'ADCS723',
        courseName: 'The Digital Ecosystem',
        description: 'Understanding digital media and marketing ecosystem',
        instructor: 'Prof. Lisa Anderson',
        credits: 3,
        capacity: 28,
        section: '001',
        semester: 'Fall 2024',
        schedule: {
            day: 'Tuesday, Thursday',
            startTime: '15:00',
            endTime: '16:30'
        }
    },
    {
        courseCode: 'MATH201',
        courseName: 'Calculus I',
        description: 'Limits, derivatives, and applications',
        instructor: 'Dr. Robert Brown',
        credits: 4,
        capacity: 40,
        section: '001',
        semester: 'Fall 2024',
        schedule: {
            day: 'Monday, Wednesday, Friday',
            startTime: '10:00',
            endTime: '11:50'
        }
    },
    {
        courseCode: 'PHYS101',
        courseName: 'Physics Fundamentals',
        description: 'Mechanics, waves, and basic physics principles',
        instructor: 'Dr. Maria Garcia',
        credits: 4,
        capacity: 35,
        section: '001',
        semester: 'Fall 2024',
        schedule: {
            day: 'Tuesday, Thursday',
            startTime: '09:00',
            endTime: '11:30'
        }
    },
    {
        courseCode: 'CHEM101',
        courseName: 'Chemistry Basics',
        description: 'Atomic structure, bonding, and reactions',
        instructor: 'Dr. Thomas Lee',
        credits: 4,
        capacity: 30,
        section: '001',
        semester: 'Fall 2024',
        schedule: {
            day: 'Monday, Wednesday',
            startTime: '13:00',
            endTime: '15:00'
        }
    },
    {
        courseCode: 'COMP101',
        courseName: 'Introduction to Programming',
        description: 'Learn programming fundamentals with Python',
        instructor: 'Dr. Jennifer Martinez',
        credits: 3,
        capacity: 40,
        section: '001',
        semester: 'Fall 2024',
        schedule: {
            day: 'Tuesday, Thursday',
            startTime: '11:00',
            endTime: '12:30'
        }
    }
];

async function seedDatabase() {
    console.log('🌱 Starting to seed database...\n');
    
    try {
        // Connect to MongoDB
        await mongoose.connect(config.db, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });
        console.log('✅ Connected to MongoDB\n');
        
        // Clear existing data
        await Student.deleteMany({});
        await Course.deleteMany({});
        console.log('🗑️  Cleared existing data\n');
        
        // Add students
        console.log('👥 Adding students...');
        let addedStudents = 0;
        for (const studentData of students) {
            try {
                const student = new Student(studentData);
                await student.save();
                console.log(`  ✅ Added student: ${studentData.studentNumber} - ${studentData.firstName} ${studentData.lastName}`);
                addedStudents++;
            } catch (err) {
                console.error(`  ❌ Failed to add ${studentData.studentNumber}:`, err.message);
            }
        }
        console.log(`✨ Added ${addedStudents} students\n`);
        
        // Add courses
        console.log('📚 Adding courses...');
        let addedCourses = 0;
        for (const courseData of courses) {
            try {
                const course = new Course(courseData);
                await course.save();
                console.log(`  ✅ Added course: ${courseData.courseCode} - ${courseData.courseName}`);
                addedCourses++;
            } catch (err) {
                console.error(`  ❌ Failed to add ${courseData.courseCode}:`, err.message);
            }
        }
        console.log(`✨ Added ${addedCourses} courses\n`);
        
        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('   👨‍🎓 Student Login:');
        console.log('      Username: 1001');
        console.log('      Password: student123');
        console.log('\n   👨‍💼 Admin Login:');
        console.log('      Username: admin');
        console.log('      Password: admin123');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    }
}

// Run the seed function
seedDatabase();


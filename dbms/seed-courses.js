const mongoose = require('mongoose');
const config = require('./config/config');

// Load models
require('./app/models/course.server.model');

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

async function seedCourses() {
    console.log('🌱 Starting to seed courses...');
    
    try {
        // Connect to MongoDB
        await mongoose.connect(config.db, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });
        console.log('✅ Connected to MongoDB');
        
        const Course = mongoose.model('Course');
        
        // Check if courses already exist
        const existingCourses = await Course.find();
        
        if (existingCourses.length > 0) {
            console.log(`⚠️  Found ${existingCourses.length} existing courses in database.`);
            console.log('💡 If you want to add these courses, delete existing ones first.');
            console.log('✅ Seed script completed.');
            process.exit(0);
        }
        
        // Add courses
        let added = 0;
        for (const courseData of courses) {
            try {
                const course = new Course(courseData);
                await course.save();
                console.log(`✅ Added course: ${courseData.courseCode} - ${courseData.courseName}`);
                added++;
            } catch (err) {
                console.error(`❌ Failed to add ${courseData.courseCode}:`, err.message);
            }
        }
        
        console.log(`\n✨ Successfully added ${added} courses to the database!`);
        console.log('🎉 Seed script completed successfully.');
        
    } catch (error) {
        console.error('❌ Error seeding courses:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

// Run the seed function
seedCourses();


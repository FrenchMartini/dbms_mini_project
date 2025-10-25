# Enhanced Course Registration System with Real-Time Updates and GraphQL

## Overview
This is an enhanced MERN stack course registration system with real-time updates using Socket.IO, GraphQL API, and advanced database operations. The system provides live enrollment tracking, seat availability monitoring, and comprehensive analytics.

## 🚀 New Features

### 1. Real-Time Updates with Socket.IO
- **Live Enrollment Tracking**: See enrollment changes in real-time across all connected clients
- **Seat Availability Monitoring**: Instant updates when courses reach capacity
- **Course Room System**: Join specific course rooms to receive targeted updates
- **Connection Status**: Visual indicators for Socket.IO connection status

### 2. GraphQL API Integration
- **Comprehensive Schema**: Complete GraphQL schema for students and courses
- **Advanced Queries**: Complex queries for analytics and reporting
- **Mutations**: Full CRUD operations for courses and students
- **Real-time Subscriptions**: Live data updates through GraphQL subscriptions
- **GraphQL Playground**: Interactive query interface at `/graphql`

### 3. Enhanced Database Models

#### Course Model Enhancements:
- **Capacity Management**: Track course capacity and enrollment limits
- **Enrollment Tracking**: Array of enrolled student references
- **Schedule Information**: Days, times, and room assignments
- **Prerequisites**: Course prerequisite tracking
- **Status Indicators**: Real-time status (Available, Almost Full, Full)
- **Virtual Fields**: Enrollment count, available seats, enrollment percentage

#### Student Model Enhancements:
- **Academic Information**: Academic year, GPA, total credits
- **Enrolled Courses**: Array of course references
- **Advanced Methods**: Enrollment validation, credit calculation
- **Statistics**: Academic year distribution and performance metrics

### 4. Advanced Database Operations
- **Aggregation Pipelines**: Complex analytics queries
- **Indexes**: Optimized database performance
- **Virtual Fields**: Computed properties for real-time calculations
- **Static Methods**: Utility functions for data analysis
- **Instance Methods**: Object-level operations

### 5. Analytics Dashboard
- **Enrollment Statistics**: Total courses, capacity, enrollment metrics
- **Student Demographics**: Distribution by academic year
- **Course Analytics**: Enrollment trends and status distribution
- **Performance Metrics**: GPA and credit hour analysis
- **Visual Charts**: Progress bars and status indicators

## 🛠️ Technical Stack

### Backend:
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **Apollo Server** for GraphQL API
- **JWT** for authentication
- **bcrypt** for password hashing

### Frontend:
- **React.js** with React Router
- **Socket.IO Client** for real-time updates
- **Axios** for HTTP requests
- **Bootstrap** for UI components
- **GraphQL Client** integration

## 📁 Project Structure

```
├── app/
│   ├── controllers/
│   │   ├── enrollment.server.controller.js    # New: Real-time enrollment logic
│   │   ├── course.server.controller.js         # Enhanced: Course management
│   │   └── student.server.controller.js        # Enhanced: Student management
│   ├── models/
│   │   ├── course.server.model.js              # Enhanced: Capacity & enrollment tracking
│   │   └── student.server.model.js             # Enhanced: Academic info & courses
│   ├── routes/
│   │   └── enrollment.server.routes.js         # New: Enrollment API routes
│   └── graphql/
│       └── schema.js                           # New: GraphQL schema & resolvers
├── react-client/
│   └── src/
│       └── components/
│           ├── RealTimeCourseEnrollment.js     # New: Real-time enrollment UI
│           ├── GraphQLClient.js                # New: GraphQL query interface
│           └── AnalyticsDashboard.js            # New: Analytics & reporting
├── config/
│   └── express.js                              # Enhanced: GraphQL integration
└── server.js                                   # Enhanced: Socket.IO setup
```

## 🔧 Installation & Setup

### Prerequisites:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup:
```bash
# Install dependencies
npm install

# Start the server
npm start
```

### Frontend Setup:
```bash
# Navigate to React client
cd react-client

# Install dependencies
npm install

# Start the React app
npm start
```

## 🌐 API Endpoints

### REST API Endpoints:
- `POST /api/enrollment/enroll` - Enroll student in course
- `POST /api/enrollment/drop` - Drop student from course
- `GET /api/enrollment/course-status/:courseCode` - Get course enrollment status
- `GET /api/enrollment/available-courses` - Get courses with available seats
- `GET /api/enrollment/enrollment-stats` - Get enrollment statistics
- `GET /api/enrollment/student-courses/:studentNumber` - Get student's courses

### GraphQL Endpoint:
- `POST /graphql` - GraphQL API endpoint
- `GET /graphql` - GraphQL Playground interface

## 🔌 Socket.IO Events

### Client to Server:
- `join-course-room` - Join a specific course room
- `leave-course-room` - Leave a course room
- `enrollment-update` - Send enrollment update
- `capacity-update` - Send capacity update

### Server to Client:
- `enrollment-changed` - Broadcast enrollment changes
- `course-updated` - Update course information
- `capacity-changed` - Notify capacity changes

## 📊 GraphQL Queries

### Sample Queries:
```graphql
# Get all available courses
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

# Get enrollment statistics
query {
  enrollmentStats {
    totalCourses
    totalCapacity
    totalEnrolled
    averageEnrollment
  }
}

# Search courses
query {
  searchCourses(searchTerm: "COMP") {
    courseCode
    courseName
    instructor
    credits
    status
  }
}

# Get students with high GPA
query {
  studentsWithHighGPA(minGPA: 3.5) {
    firstName
    lastName
    studentNumber
    gpa
    academicYear
  }
}
```

### Sample Mutations:
```graphql
# Enroll student
mutation {
  enrollStudent(courseCode: "COMP308", studentNumber: 123456) {
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

# Create new course
mutation {
  createCourse(input: {
    courseCode: "COMP999"
    courseName: "Advanced Database Systems"
    section: "A"
    semester: "Fall 2024"
    capacity: 25
    instructor: "Dr. Smith"
    credits: 3
  }) {
    courseCode
    courseName
    instructor
    credits
    capacity
  }
}
```

## 🎯 Key Features

### Real-Time Enrollment System:
1. **Live Updates**: See enrollment changes instantly across all clients
2. **Capacity Monitoring**: Automatic notifications when courses reach capacity
3. **Room-Based Updates**: Join specific course rooms for targeted notifications
4. **Status Indicators**: Visual status (Available, Almost Full, Full)

### Advanced Database Operations:
1. **Aggregation Queries**: Complex analytics and reporting
2. **Virtual Fields**: Computed properties for real-time calculations
3. **Indexes**: Optimized database performance
4. **Static Methods**: Utility functions for data analysis

### GraphQL Integration:
1. **Comprehensive Schema**: Complete data model representation
2. **Advanced Queries**: Complex data retrieval operations
3. **Mutations**: Full CRUD operations
4. **Playground Interface**: Interactive query testing

### Analytics Dashboard:
1. **Enrollment Statistics**: Comprehensive enrollment metrics
2. **Student Demographics**: Academic year distribution
3. **Course Analytics**: Enrollment trends and patterns
4. **Performance Metrics**: GPA and credit hour analysis

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Secure error messages

## 📈 Performance Optimizations

- **Database Indexes**: Optimized query performance
- **Virtual Fields**: Efficient computed properties
- **Connection Pooling**: Optimized database connections
- **Caching**: Strategic data caching
- **Aggregation Pipelines**: Efficient data processing

## 🧪 Testing

### Manual Testing:
1. **Real-Time Updates**: Test Socket.IO connections and updates
2. **GraphQL Queries**: Test various GraphQL operations
3. **Enrollment Flow**: Test enrollment and drop operations
4. **Analytics**: Verify dashboard data accuracy

### Test Scenarios:
- Multiple clients enrolling in the same course
- Course capacity reached scenarios
- GraphQL query performance
- Real-time update propagation

## 🚀 Future Enhancements

1. **WebSocket Subscriptions**: GraphQL subscriptions for real-time data
2. **Advanced Analytics**: Machine learning insights
3. **Mobile App**: React Native mobile application
4. **Microservices**: Service-oriented architecture
5. **Caching Layer**: Redis for improved performance
6. **API Rate Limiting**: Enhanced security measures

## 📝 Usage Examples

### Real-Time Enrollment:
1. Open multiple browser tabs/windows
2. Navigate to Real-Time Enrollment page
3. Select a course and enter student number
4. Enroll/drop students and observe live updates

### GraphQL Queries:
1. Navigate to GraphQL Client page
2. Use predefined queries or create custom ones
3. Execute queries and view results
4. Test mutations for data modification

### Analytics Dashboard:
1. Navigate to Analytics Dashboard
2. View comprehensive enrollment statistics
3. Analyze student demographics
4. Monitor course enrollment trends

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Dinara Sharipova
- Rohan Juneja
- Enhanced by AI Assistant

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

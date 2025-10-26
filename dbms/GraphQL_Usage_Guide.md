# GraphQL Usage Guide

## 🎯 Overview
Your system has a GraphQL endpoint at `http://localhost:5001/graphql` for flexible data queries.

## 📚 Table of Contents
1. [What is GraphQL?](#what-is-graphql)
2. [How to Use the GraphQL Playground](#how-to-use-the-graphql-playground)
3. [Available Queries](#available-queries)
4. [Available Mutations](#available-mutations)
5. [Real-World Applications](#real-world-applications)
6. [Example Use Cases](#example-use-cases)

---

## What is GraphQL?
GraphQL is a query language that lets clients request exactly the data they need:
- **Single endpoint** for all data operations
- **Request only what you need** - reduces over/under fetching
- **Type-safe** with a strong schema
- **Developer-friendly** with tooling like GraphQL Playground

---

## How to Use the GraphQL Playground

### Access the Playground
1. Start your server: `npm start`
2. Go to: `http://localhost:5001/graphql`
3. You'll see the interactive GraphQL Playground

### Basic Query Example
```graphql
query {
  students {
    firstName
    lastName
    studentNumber
    totalCredits
  }
}
```

### Basic Mutation Example
```graphql
mutation {
  enrollStudent(
    studentId: "student_id_here"
    courseId: "course_id_here"
  )
}
```

---

## Available Queries

### 1. Get All Students
```graphql
query {
  students {
    _id
    firstName
    lastName
    email
    studentNumber
    program
    totalCredits
    enrolledCourses {
      courseCode
      courseName
      instructor
      credits
    }
  }
}
```

### 2. Get Single Student by ID
```graphql
query {
  student(id: "student_id_here") {
    firstName
    lastName
    email
    enrolledCourses {
      courseCode
      courseName
    }
  }
}
```

### 3. Get All Courses
```graphql
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
    enrolledStudents {
      firstName
      lastName
      studentNumber
    }
  }
}
```

### 4. Get Single Course
```graphql
query {
  course(id: "course_id_here") {
    courseCode
    courseName
    instructor
    capacity
    enrollmentCount
    enrolledStudents {
      firstName
      lastName
    }
  }
}
```

### 5. Get Course by Course Code
```graphql
query {
  courseByCode(courseCode: "COMP229") {
    courseCode
    courseName
    capacity
    enrollmentCount
  }
}
```

### 6. Get Available Courses
```graphql
query {
  availableCourses {
    courseCode
    courseName
    status
    availableSeats
    enrollmentCount
    capacity
  }
}
```

### 7. Get Student's Enrolled Courses
```graphql
query {
  studentCourses(studentNumber: "1001") {
    courseCode
    courseName
    instructor
    credits
    schedule {
      day
      startTime
      endTime
    }
  }
}
```

---

## Available Mutations

### 1. Create Student
```graphql
mutation {
  createStudent(
    firstName: "John"
    lastName: "Doe"
    email: "john@example.com"
    studentNumber: "1007"
    password: "password123"
    program: "Computer Science"
    city: "Toronto"
  ) {
    _id
    firstName
    studentNumber
  }
}
```

### 2. Update Student
```graphql
mutation {
  updateStudent(
    id: "student_id_here"
    firstName: "Jane"
    lastName: "Smith"
  ) {
    firstName
    lastName
  }
}
```

### 3. Delete Student
```graphql
mutation {
  deleteStudent(id: "student_id_here")
}
```

### 4. Create Course
```graphql
mutation {
  createCourse(
    courseCode: "COMP300"
    courseName: "Data Structures"
    instructor: "Dr. Smith"
    credits: 3
    capacity: 30
    section: "001"
    semester: "Fall 2024"
  ) {
    _id
    courseCode
    courseName
  }
}
```

### 5. Update Course
```graphql
mutation {
  updateCourse(
    id: "course_id_here"
    capacity: 35
  ) {
    courseCode
    capacity
  }
}
```

### 6. Delete Course
```graphql
mutation {
  deleteCourse(id: "course_id_here")
}
```

### 7. Enroll Student in Course
```graphql
mutation {
  enrollStudent(
    studentNumber: "1001"
    courseCode: "COMP229"
  )
}
```
**Note:** Now uses `studentNumber` and `courseCode` instead of IDs for easier use!

### 8. Drop Course
```graphql
mutation {
  dropCourse(
    studentNumber: "1001"
    courseCode: "COMP229"
  )
}
```
**Note:** Now uses `studentNumber` and `courseCode` instead of IDs!

---

## Real-World Applications

### 1. **Mobile App Development**
Build iOS/Android apps that fetch exactly the data they need:
```graphql
query GetStudentDashboard($studentNumber: String!) {
  studentCourses(studentNumber: $studentNumber) {
    courseCode
    courseName
    credits
    schedule {
      day
      startTime
      endTime
    }
  }
}
```
**Benefits:**
- Single API call gets all dashboard data
- Reduces network requests
- Faster load times on mobile

### 2. **Admin Dashboard**
Get comprehensive analytics in one query:
```graphql
query GetAnalytics {
  courses {
    courseCode
    enrollmentCount
    capacity
    availableSeats
    status
  }
  students {
    firstName
    lastName
    totalCredits
    enrolledCourses {
      courseCode
    }
  }
}
```

### 3. **Reporting & Analytics**
Generate custom reports with specific data:
```graphql
query EnrollmentReport {
  courses {
    courseCode
    courseName
    instructor
    enrollmentCount
    capacity
    enrolledStudents {
      firstName
      lastName
      program
    }
  }
}
```

### 4. **Third-Party Integrations**
Allow external systems to integrate with your API:
- External scheduling apps
- Parent/guardian portals
- Faculty management systems
- Analytics platforms

### 5. **Real-time Data Needs**
Combine with WebSockets for live updates:
```graphql
subscription {
  enrollmentUpdates {
    courseCode
    courseName
    enrollmentCount
    status
  }
}
```
(Note: Subscription support would need to be added)

---

## Example Use Cases

### Use Case 1: Student Portal Mobile App
**Scenario:** Student wants to see their schedule and course info

```graphql
query MySchedule($studentNumber: String!) {
  studentCourses(studentNumber: $studentNumber) {
    courseCode
    courseName
    instructor
    credits
    schedule {
      day
      startTime
      endTime
    }
  }
}
```

### Use Case 2: Admin Course Management
**Scenario:** Admin needs to see which courses are nearly full

```graphql
query FullCourses {
  courses {
    courseCode
    courseName
    enrollmentCount
    capacity
    status
    availableSeats
  }
}
```
Then filter on client side for status: "Almost Full"

### Use Case 3: Enrollment Pre-checks
**Scenario:** Before enrolling, check if student can add another course

```graphql
query CanEnroll($studentNumber: String!, $courseId: ID!) {
  studentCourses(studentNumber: $studentNumber) {
    credits
  }
  course(id: $courseId) {
    credits
    availableSeats
    enrollmentCount
  }
}
```
Calculate total credits and check available seats

### Use Case 4: Bulk Operations
**Scenario:** Export all student enrollment data for analytics

```graphql
query AllEnrollments {
  students {
    firstName
    lastName
    studentNumber
    totalCredits
    enrolledCourses {
      courseCode
      credits
    }
  }
}
```

---

## Best Practices

### 1. **Request Only What You Need**
❌ **Bad:** Querying all fields when you only need a few
```graphql
query {
  students {
    _id
    firstName
    lastName
    email
    studentNumber
    address
    city
    phone
    # ... all fields
  }
}
```

✅ **Good:** Only request what you need
```graphql
query {
  students {
    firstName
    lastName
    enrolledCourses {
      courseCode
    }
  }
}
```

### 2. **Use Fragments for Reusability**
```graphql
fragment CourseInfo on Course {
  courseCode
  courseName
  instructor
  credits
}

query {
  courses {
    ...CourseInfo
    enrolledStudents {
      firstName
    }
  }
}
```

### 3. **Use Variables for Dynamic Queries**
```graphql
query GetStudent($studentNumber: String!) {
  studentCourses(studentNumber: $studentNumber) {
    courseCode
    courseName
  }
}
```
Variables: `{ "studentNumber": "1001" }`

---

## Troubleshooting

### Error: "Cannot query field"
- Check the schema for available fields
- Visit the GraphQL Playground to see the schema

### Error: "Cast to ObjectId failed"
- **FIXED!** The `enrollStudent` and `dropCourse` mutations now use `studentNumber` and `courseCode` instead of IDs
- Use string values like `"1001"` for studentNumber and `"COMP229"` for courseCode

### Error: "Unknown argument"
- Check the mutation/query signature
- Use GraphQL Playground's auto-complete

### Performance Issues
- Use pagination for large datasets
- Request only needed fields
- Use indexes on database side

---

## Integration Example (JavaScript)

```javascript
const query = `
  query GetStudent($studentNumber: String!) {
    studentCourses(studentNumber: $studentNumber) {
      courseCode
      courseName
      instructor
    }
  }
`;

const response = await fetch('http://localhost:5001/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query,
    variables: { studentNumber: '1001' }
  })
});

const data = await response.json();
console.log(data.data.studentCourses);
```

---

## Summary

✅ GraphQL provides flexible data querying
✅ Single endpoint for all operations
✅ Type-safe with IntelliSense support
✅ Efficient - get exactly what you need
✅ Perfect for mobile apps, dashboards, and integrations

Access it now at: `http://localhost:5001/graphql`


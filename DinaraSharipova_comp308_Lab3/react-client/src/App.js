import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
//
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './App.css';

import CreateUser from './components/CreateStudent';
import Login from './components/Login';
import ShowStudent from './components/ShowStudent';
import ShowCourse from './components/ShowCourse';
import ListOfStudents from './components/ListOfStudents';
import ListOfCourses from './components/ListOfCourses';
import StudentsEnrolledInCourse from './components/StudentsEnrolledInCourse';
import AddCourse from './components/AddCourse';
import CoursesOfStudent from './components/CoursesOfStudent';
import UpdateStudent from './components/UpdateStudent'; 

import UpdateCourse from './components/UpdateCourse';
import RealTimeCourseEnrollment from './components/RealTimeCourseEnrollment';
import GraphQLClient from './components/GraphQLClient';
import AnalyticsDashboard from './components/AnalyticsDashboard';


function App(props) {
  return (
    <Router>
      <Navbar bg="dark" expand="lg" className="navbar">
        <Navbar.Brand href="/login">📚 Academic Hub</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/login" className="nav-link">Home</Nav.Link>
            <Nav.Link href="/listOfStudents" className="nav-link">All Students</Nav.Link>
            <Nav.Link href="/listOfCourses" className="nav-link">All Courses</Nav.Link>
            <Nav.Link href="/realTimeEnrollment" className="nav-link">Enrollment</Nav.Link>
            <Nav.Link href="/graphql" className="nav-link">GraphQL</Nav.Link>
            <Nav.Link href="/analytics" className="nav-link">Analytics</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
      <div>
        <Route render={()=> <CreateUser />}path="/create"/>
        <Route render ={()=> < Login />} path="/login" />
        <Route render ={()=> < ListOfStudents />} path="/listOfStudents" />
        <Route render ={()=> < ListOfCourses />} path="/listOfCourses" />
        <Route render ={()=> <AddCourse/>}path="/addCourse"/>
        <Route render ={()=> < StudentsEnrolledInCourse />} path="/StudentsEnrolledInCourse/:courseCode" />
        <Route render ={()=> < CoursesOfStudent />} path="/CoursesOfStudent/:studentId" />
        <Route render ={()=> < UpdateStudent />} path="/updateStudent/:studentNumber" />
        <Route render ={()=> < ShowStudent />} path="/showStudent" />
        <Route render ={()=> < ShowCourse />} path="/showCourse/:courseId" />
        <Route render ={()=> < UpdateCourse />} path="/updateCourse/:courseId" />
        <Route render ={()=> < RealTimeCourseEnrollment />} path="/realTimeEnrollment" />
        <Route render ={()=> < GraphQLClient />} path="/graphql" />
        <Route render ={()=> < AnalyticsDashboard />} path="/analytics" />
      </div>
    </Router>
  );
}

export default App;

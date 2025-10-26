import React, { useState, useEffect } from "react";
//
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import ShowStudent from "./ShowStudent";
import Jumbotron  from "react-bootstrap/Jumbotron";
import Spinner from "react-bootstrap/Spinner";
import AddCourse from "./AddCourse";
import StudentEnrollment from "./StudentEnrollment";
import AdminDashboard from "./AdminDashboard";
import CoursesOfStudent from "./CoursesOfStudent";
import { Button, ButtonGroup } from "react-bootstrap";
import { withRouter } from 'react-router-dom';

//
function View(props) {
  const { screen, setScreen } = props;
  const {student,setStudent} = props;
  const [data, setData] = useState();  
  const [course, setCourse] = useState("");
  const [userRole, setUserRole] = useState(props.student?.role || 'student');
    
  const deleteCookie = async () => {
    console.log("Signout function called");
    
    try {
      // Call the signout endpoint
      console.log("Calling signout endpoint...");
      const response = await axios.get("/signout", {
        withCredentials: true // Include cookies in the request
      });
      console.log("Signout response:", response.data);
      
      // Clear local state
      console.log("Clearing local state...");
      setStudent(null);
      setCourse("");
      
      // Clear localStorage
      console.log("Clearing localStorage...");
      localStorage.removeItem('userRole');
      localStorage.clear(); // Clear all localStorage data
      
      // Redirect to auth screen
      console.log("Setting screen to auth...");
      setScreen("auth");
      
      console.log("Signout successful, reloading page...");
      // Reload page to ensure clean state and update navbar
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (e) {
      console.error("Signout error:", e);
      console.error("Error details:", e.response?.data);
      
      // Even if there's an error, still clear local data and redirect
      console.log("Error occurred, but still clearing data and redirecting...");
      localStorage.removeItem('userRole');
      localStorage.clear();
      setStudent(null);
      setCourse("");
      setScreen("auth");
      
      // Still reload to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };
  const verifyCookie = async () => {
    try {
      const res = await axios.get("/welcome");
      console.log(res.data);
      setData(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const listCourses = (id) => {
    setCourse("n");
  };

  const addCourse = () => {
    setCourse("y");
  };
  
  const showDetail = () => {
    setCourse('myProfile');
  };

  const showAnalytics = () => {
    setCourse('analytics');
  };

  // Check if user is admin
  const isAdmin = userRole === 'admin';

  return (
    
    <div className="App">
      {/* Render Admin Dashboard if user is admin */}
      {isAdmin ? (
        <AdminDashboard screen={screen} setScreen={setScreen} student={student} />
      ) : (
        <>
          {course === "y" ? (
            <StudentEnrollment screen={screen} setScreen={setScreen} />
          ) : course === "n" ? (
            <CoursesOfStudent screen={screen} setScreen={setScreen} />
          ) : course === "myProfile" ? (
            <ShowStudent screen={screen} setScreen={setScreen}/>
          ) : course === "analytics" ? (
            <div>
              <div className="minimal-header">
                <div className="container-fluid px-4">
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center">
                      <Button variant="link" className="text-light me-3" onClick={() => setCourse("")}>
                        <i className="fas fa-arrow-left"></i> Back
                      </Button>
                      <i className="fas fa-chart-bar me-2 header-icon-small"></i>
                      <span className="header-title-small">Analytics Dashboard</span>
                    </div>
                    <span className="badge badge-primary px-2 py-1">
                      <i className="fas fa-user"></i> {screen}
                    </span>
                  </div>
                </div>
              </div>
              <div className="container py-4">
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-body text-center">
                        <h4><i className="fas fa-chart-line"></i> Analytics Dashboard</h4>
                        <p>View your academic progress, enrollment statistics, and performance metrics.</p>
                        <p className="text-muted">This feature will show detailed analytics about your courses and academic journey.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            
            <div className="student-dashboard">
              {/* Header Section - Minimal */}
              <div className="minimal-header">
                <div className="container-fluid px-4">
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-graduation-cap me-2 header-icon-small"></i>
                      <span className="header-title-small">Academic Hub</span>
                    </div>
                    <span className="badge badge-primary px-2 py-1">
                      <i className="fas fa-user"></i> {screen}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dashboard Cards Section */}
              <div className="dashboard-content">
                <div className="container-fluid py-3">
                  <div className="row justify-content-center">
                    <div className="col-lg-8">
                      <h5 className="section-title-small mb-4">
                        <i className="fas fa-th-large"></i> Dashboard
                      </h5>
                      
                      <div className="row">
                        <div className="col-md-6 col-lg-3 mb-3">
                          <Button 
                            variant="outline-primary" 
                            className="action-card-btn-small w-100 p-0" 
                            onClick={addCourse}
                          >
                            <div className="action-card-content-small">
                              <div className="action-card-header-small">
                                <i className="fas fa-plus-circle"></i>
                              </div>
                              <div className="action-card-body-small">
                                <h6>Enroll in Course</h6>
                                <small>Register for courses</small>
                              </div>
                            </div>
                          </Button>
                        </div>
                        
                        <div className="col-md-6 col-lg-3 mb-3">
                          <Button 
                            variant="outline-primary" 
                            className="action-card-btn-small w-100 p-0" 
                            onClick={() => listCourses(screen)}
                          >
                            <div className="action-card-content-small">
                              <div className="action-card-header-small">
                                <i className="fas fa-book-open"></i>
                              </div>
                              <div className="action-card-body-small">
                                <h6>My Courses</h6>
                                <small>View enrolled courses</small>
                              </div>
                            </div>
                          </Button>
                        </div>
                        
                        <div className="col-md-6 col-lg-3 mb-3">
                          <Button 
                            variant="outline-primary" 
                            className="action-card-btn-small w-100 p-0" 
                            onClick={showDetail}
                          >
                            <div className="action-card-content-small">
                              <div className="action-card-header-small">
                                <i className="fas fa-user-edit"></i>
                              </div>
                              <div className="action-card-body-small">
                                <h6>My Profile</h6>
                                <small>Update information</small>
                              </div>
                            </div>
                          </Button>
                        </div>
                        
                        <div className="col-md-6 col-lg-3 mb-3">
                          <Button 
                            variant="outline-info" 
                            className="action-card-btn-small w-100 p-0" 
                            onClick={showAnalytics}
                          >
                            <div className="action-card-content-small">
                              <div className="action-card-header-small">
                                <i className="fas fa-chart-bar"></i>
                              </div>
                              <div className="action-card-body-small">
                                <h6>Analytics</h6>
                                <small>View progress</small>
                              </div>
                            </div>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="row mt-3">
                        <div className="col-12 text-center">
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={deleteCookie}
                          >
                            <i className="fas fa-sign-out-alt me-2"></i>Sign Out
                          </Button>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
           
          )}
        </>
      )}
    </div>
  );
}

export default View;

import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

function AdminDashboard(props) {
  const { screen, setScreen, student } = props;

  const deleteCookie = async () => {
    try {
      const axios = require('axios');
      await axios.get("http://localhost:5001/signout");
      setScreen("auth");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="App">
      <div>
        <div className="header">
          <div className="mask">
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="text-white" style={{fontSize: '1.4rem', fontWeight: '600', textAlign: 'center'}}>
                <h2 className="mb-2" style={{fontSize: '1.6rem'}}>Welcome to Admin Panel</h2>
                <p className="mb-0" style={{fontSize: '1rem'}}>Logged in as: {screen}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="margin-class container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <Card>
              <Card.Body className="text-center">
                <h3>Analytics</h3>
                <p>View enrollment statistics and analytics</p>
                <Button variant="primary" href="/analytics" className="w-100">
                  View Analytics
                </Button>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-4 mb-4">
            <Card>
              <Card.Body className="text-center">
                <h3>All Students</h3>
                <p>Manage and view all registered students</p>
                <Button variant="primary" href="/listOfStudents" className="w-100">
                  View Students
                </Button>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-4 mb-4">
            <Card>
              <Card.Body className="text-center">
                <h3>All Courses</h3>
                <p>Manage and view all available courses</p>
                <Button variant="primary" href="/listOfCourses" className="w-100">
                  View Courses
                </Button>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-4 mb-4">
            <Card>
              <Card.Body className="text-center">
                <h3>➕ Add Course</h3>
                <p>Create new courses in the system</p>
                <Button variant="success" href="/addCourse" className="w-100">
                  Add Course
                </Button>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-4 mb-4">
            <Card>
              <Card.Body className="text-center">
                <h3>Real-Time Enrollment</h3>
                <p>Monitor real-time course enrollment</p>
                <Button variant="info" href="/realTimeEnrollment" className="w-100">
                  Real-Time View
                </Button>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-4 mb-4">
            <Card>
              <Card.Body className="text-center">
                <h3>GraphQL</h3>
                <p>Access GraphQL playground</p>
                <Button variant="warning" href="/graphql" className="w-100">
                  GraphQL Client
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>

        <div className="text-center mt-4">
          <Button variant="danger" onClick={deleteCookie}>
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;


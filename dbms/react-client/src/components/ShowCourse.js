import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { withRouter } from 'react-router-dom';

function ShowCourse(props) {
  const [data, setData] = useState({});
  const [showLoading, setShowLoading] = useState(true);
  const courseId = props.match.params.courseId;
  const apiUrl = `http://localhost:5001/courses/byId/${courseId}`;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setShowLoading(true);
        console.log('Fetching course with ID:', courseId);
        
        // Try new endpoint for fetching by ID
        const result = await axios.get(apiUrl);
        
        if (result.data) {
          console.log('Course data received:', result.data);
          setData(result.data);
        } else {
          console.error('No course data received');
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setShowLoading(false);
      }
    };

    fetchData();
  }, [courseId, apiUrl]);

  const updateCourse = (id) => {
    props.history.push({
      pathname: '/updateCourse/' + id
    });
  };

  const deleteCourse = (id) => {
    setShowLoading(true);
    console.log("deleting course by id: ", id)
    const course = { 
        courseCode: data.courseCode, 
        courseName: data.courseName, 
        section: data.section, 
        semester: data.semester };
  
    axios.delete(apiUrl, course)
      .then((result) => {
        setShowLoading(false);
        props.history.push('/login')
      }).catch((error) => setShowLoading(false));
  };

  return (
    <div>
      {showLoading ? (
        <div style={{textAlign: 'center', padding: '40px'}}>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <div className="header">
            <div className="mask">
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="text-white" style={{fontSize: '1.4rem', fontWeight: '600', textAlign: 'center'}}>
                  Course Details: {data.courseName || 'Loading...'}
                </div>
              </div>
            </div>
          </div>
          <div className="container mt-4">
            <Card className="shadow">
              <Card.Body>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="mb-3 text-primary">Course Information</h5>
                    <p><strong>Course Name:</strong> <span>{data.courseName || 'N/A'}</span></p>
                    <p><strong>Course Code:</strong> <span>{data.courseCode || 'N/A'}</span></p>
                    <p><strong>Section:</strong> <span>{data.section || 'N/A'}</span></p>
                    <p><strong>Semester:</strong> <span>{data.semester || 'N/A'}</span></p>
                    <p><strong>Instructor:</strong> <span>{data.instructor || 'N/A'}</span></p>
                    <p><strong>Credits:</strong> <span>{data.credits || 'N/A'}</span></p>
                  </div>
                  <div className="col-md-6">
                    <h5 className="mb-3 text-primary">Enrollment Information</h5>
                    <p><strong>Capacity:</strong> <span>{data.capacity || 'N/A'}</span></p>
                    <p><strong>Enrolled:</strong> <span>{data.enrolledStudents ? data.enrolledStudents.length : 0}</span></p>
                    <p><strong>Available Seats:</strong> <span>{data.availableSeats || (data.capacity && data.enrolledStudents ? data.capacity - data.enrolledStudents.length : 'N/A')}</span></p>
                    <p><strong>Status:</strong> <span>{data.status || 'N/A'}</span></p>
                    {data.schedule && (
                      <p><strong>Schedule:</strong> {data.schedule.day} {data.schedule.startTime}-{data.schedule.endTime}</p>
                    )}
                  </div>
                </div>
                {data.description && (
                  <div className="mt-3">
                    <h6 className="text-primary">Description</h6>
                    <p>{data.description}</p>
                  </div>
                )}
                <div className="text-center mt-4">
                  <Button type="button" variant="primary" onClick={() => { updateCourse(data._id) }} className="me-2">Edit Course</Button>
                  <Button type="button" variant="danger" onClick={() => { deleteCourse(data._id) }} className="me-2">Delete Course</Button>
                  <Button variant="secondary" onClick={() => window.history.back()}>Go Back</Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default withRouter(ShowCourse);

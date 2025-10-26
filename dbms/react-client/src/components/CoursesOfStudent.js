import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { withRouter } from 'react-router-dom';
import Login from './Login';

function List(props) {
  const studentNumber = props.screen;
  const [data, setData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [listError, setListError] = useState(false);
  const apiUrl = "http://localhost:5001/api/enrollment/student-courses/"+studentNumber;

  useEffect(() => {
    const fetchData = async () => {
      axios.get(apiUrl)
        .then(result => {
          if(result.data.screen !== 'auth')
          {
            
            console.log('data in if:', result.data )
            setData(result.data);
            setShowLoading(false);
          }
        }).catch((error) => {
          console.log('error in fetchData:', error)
          setListError(true)
        });
      };  
    fetchData();
  }, []);

  const showDetail = (courseId) => {
    props.history.push({
      pathname: '/showCourse/' + courseId
    });
    
  }
  return (
    <div>
        
      { data.enrolledCourses && data.enrolledCourses.length !== 0
        ? <div>
          {showLoading && <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner> }
          
          <div className="header">
            <div className="mask">
              <div className="d-flex justify-content-between align-items-center h-100" style={{padding: '0 2rem'}}>
                <Button variant="link" className="text-light" onClick={() => window.history.back()} style={{fontSize: '1rem', textDecoration: 'none'}}>
                  <i className="fas fa-arrow-left me-2"></i> Back
                </Button>
                <div className="text-white" style={{fontSize: '1.4rem', fontWeight: '600', textAlign: 'center'}}>My Courses</div>
                <div style={{width: '80px'}}></div>
              </div>
            </div>
          </div>

          <div className="container mt-4">
            <div className="row">
              {data.enrolledCourses.map((item, idx) => (
                <div className="col-md-6 col-lg-4 mb-4" key={idx}>
                  <div className="card course-card" onClick={() => { showDetail(item._id) }} 
                       style={{cursor: 'pointer', transition: 'all 0.3s ease', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'}}>
                    <div className="card-header" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '0.5rem 0.5rem 0 0'}}>
                      <h5 className="card-title mb-0" style={{fontSize: '1.1rem', fontWeight: '600'}}>
                        <i className="fas fa-book me-2"></i>
                        {item.courseCode}
                      </h5>
                    </div>
                    <div className="card-body" style={{padding: '1.5rem'}}>
                      <h6 className="course-name mb-3" style={{color: '#2c3e50', fontWeight: '600', fontSize: '1rem'}}>
                        {item.courseName}
                      </h6>
                      <div className="course-details">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-users me-2" style={{color: '#3498db', width: '16px'}}></i>
                          <small style={{color: '#666'}}>Section: <strong>{item.section}</strong></small>
                        </div>
                        {item.credits && (
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-credit-card me-2" style={{color: '#e74c3c', width: '16px'}}></i>
                            <small style={{color: '#666'}}>Credits: <strong>{item.credits}</strong></small>
                          </div>
                        )}
                        {item.instructor && (
                          <div className="d-flex align-items-center">
                            <i className="fas fa-chalkboard-teacher me-2" style={{color: '#f39c12', width: '16px'}}></i>
                            <small style={{color: '#666'}}>Instructor: <strong>{item.instructor}</strong></small>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="card-footer" style={{background: '#f8f9fa', border: 'none', padding: '0.75rem 1.5rem'}}>
                      <small className="text-muted d-flex align-items-center justify-content-center">
                        <i className="fas fa-mouse-pointer me-1"></i>
                        Click to view details
                      </small>
                    </div>
                  </div>
                </div>
              ))}
              {data.enrolledCourses.length === 0 && (
                <div className="col-12 text-center mt-5">
                  <div className="empty-state" style={{padding: '3rem', color: '#6c757d'}}>
                    <i className="fas fa-graduation-cap" style={{fontSize: '3rem', marginBottom: '1rem', opacity: '0.5'}}></i>
                    <h5>No Courses Enrolled</h5>
                    <p>You haven't enrolled in any courses yet.</p>
                    <Button variant="primary" href="/enroll" className="mt-3">
                      <i className="fas fa-plus me-2"></i>Enroll in Courses
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        : <Login />
      }
    </div>

  );
}

export default withRouter(List);

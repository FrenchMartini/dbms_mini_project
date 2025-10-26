import React, { useState, useEffect } from 'react';
//import ReactDOM from 'react-dom';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
//
import View from './View'
//
function App(props) {
  //state variable for the screen, admin or user
  const [screen, setScreen] = useState('auth');
  const [student,setStudent] = useState([]);
  //store input field data, user name and password
  const [studentNumber, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState('');
  const apiUrl = "http://localhost:5001/signin";
  //send studentNumber and password to the server
  // for initial authentication
  const auth = async () => {
    console.log('calling auth')
    console.log(studentNumber)
    try {
      if(studentNumber==null||password==null||studentNumber==''||password==''){
        setError('Please fill in all fields');
        return;
      }
      setError('');
      //make a get request to /authenticate end-point on the server
      const loginData = { auth: { studentNumber, password } }
      //call api with credentials to allow cookies
      const res = await axios.post(apiUrl, loginData, {
        withCredentials: true
      });
      console.log('Full response:', res)
      console.log(res.data.screen)
      //process the response
      console.log('Response data:', res.data);
      console.log('Screen value:', res.data.screen);
      console.log('Screen is undefined?', res.data.screen === undefined);
      
      if (res.data.screen !== undefined && res.data.screen !== null && res.data.screen !== '') {
        console.log('Setting screen to:', res.data.screen);
        console.log('Setting student to:', res.data.student);
        console.log('User role:', res.data.role);
        setScreen(res.data.screen);
        setStudent(res.data.student);
        
        // Store user role in localStorage
        const userRole = res.data.role || 'student';
        localStorage.setItem('userRole', userRole);
        console.log('Login successful! Screen:', res.data.screen, 'Role:', userRole);
        
        // Force page reload to update navbar
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        console.log('Login response missing screen or is empty');
        setError(res.data.message || 'Login failed - no screen data returned');
      }
    } catch (e) { //print the error
      console.error('Login error caught!');
      console.error('Error response status:', e.response?.status);
      console.error('Error response data:', e.response?.data);
      console.error('Error message:', e.message);
      console.log('Full error object:', e);
      
      const errorMessage = e.response?.data?.message || e.response?.data?.error || e.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    }
  
  };
  
  //check if the user already logged-in
  const readCookie = async () => {
    try {
      console.log('--- in readCookie function ---');

      //call with credentials to allow cookies
      const res = await axios.get('http://localhost:5001/read_cookie', {
        withCredentials: true
      });
      console.log('Cookie check response:', res.data)
      if (res.data.screen !== undefined) {
        setScreen(res.data.screen);
        console.log(res.data.screen)
      }
    } catch (e) {
      console.log('Cookie check error:', e.message);
      setScreen('auth');
      console.log(e);
    }
  };
  //runs the first time the view is rendered
  //to check if user is signed in
  useEffect(() => {
    readCookie();
  }, []); //only the first render
  
  // Debug: log when screen changes
  useEffect(() => {
    console.log('Screen state changed to:', screen);
  }, [screen]);
  
  //
  return (
    <div className="App container">
      {screen === 'auth' 
        ? <div className="col-md-6 offset-md-3 LoginWrapper fade-in">
            <div className="card shadow" style={{maxWidth: '500px'}}>
              <div className="card-body">
                <h2 className="card-title text-center mb-4">🎓 Welcome Back</h2>
                <p className="text-center text-muted mb-4">Academic Hub Management System</p>
                
                {error && (
                  <div className="alert alert-danger mb-4">
                    ⚠️ {error}
                  </div>
                )}

                <Form.Group className="mb-4">
                  <Form.Label>Student Number</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter your student number"
                    onChange={e => setUsername(e.target.value)} 
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Enter your password"
                    onChange={e => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button 
                  className="w-100 mb-3" 
                  variant="primary" 
                  onClick={auth}
                  style={{fontWeight: '600', padding: '12px'}}
                >
                  🔐 Login
                </Button>

                <div className="text-center">
                  <p className="note_para" style={{marginBottom: 0}}>
                    Don't have an account? <a href="/create" style={{color: '#a29bfe'}}>Register here</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        : <View screen={screen} setScreen={setScreen} student={student} setStudent={setStudent} />
      }
    </div>
  );
}

export default App;


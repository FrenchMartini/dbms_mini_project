import React, { useState, useEffect } from "react";
import axios from "axios";
import ListGroup from "react-bootstrap/ListGroup";
import Spinner from "react-bootstrap/Spinner";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { withRouter } from "react-router-dom";
import Login from "./Login";

function ListOfStudents(props) {
  const [data, setData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [listError, setListError] = useState(false);
  const apiUrl = "http://localhost:5000/students";

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get(apiUrl)
        .then((result) => {
          console.log("result.data:", result.data);
          //check if the user has logged in
          if (result.data.screen !== "auth") {
            console.log("data in if:", result.data);
            setData(result.data);
            setShowLoading(false);
          }
        })
        .catch((error) => {
          console.log("error in fetchData:", error);
          setListError(true);
        });
    };
    fetchData();
  }, []);

  const showDetail = (studentNumber) => {
    props.history.push({
      pathname: "/showStudent/" + studentNumber,
    });
  };

  return (
    <div>
      {data.length !== 0 ? (
        <div className="fade-in">
          {showLoading && (
            <div style={{textAlign: 'center', padding: '40px'}}>
              <Spinner animation="border" role="status" style={{color: '#6c5ce7'}}>
                <span className="sr-only">Loading...</span>
              </Spinner>
              <p className="text-muted mt-3">Loading students...</p>
            </div>
          )}
          <div className="header">
            <div className="mask">
              <div style={{textAlign: 'center'}}>
                <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>👥 All Students</h1>
                <p style={{fontSize: '1.1rem', color: '#a29bfe'}}>Comprehensive student directory</p>
              </div>
            </div>
          </div>
        
          <Container>
            <ListGroup className="wrapperList">
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <ListGroup.Item
                    key={idx}
                    className="list-group-item slide-in"
                    style={{
                      animationDelay: `${idx * 0.05}s`,
                      cursor: 'pointer',
                      marginBottom: '12px'
                    }}
                    onClick={() => showDetail(item.studentNumber)}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <div style={{fontSize: '1.1rem', fontWeight: '600', color: '#a29bfe'}}>
                          {item.firstName} {item.lastName}
                        </div>
                        <div style={{fontSize: '0.9rem', color: '#b0b0b0', marginTop: '5px'}}>
                          <span style={{marginRight: '15px'}}>🆔 ID: <strong>{item.studentNumber}</strong></span>
                          <span style={{marginRight: '15px'}}>📍 {item.city}</span>
                          <span>📚 Program: <strong>{item.program}</strong></span>
                        </div>
                      </div>
                      <div style={{fontSize: '1.5rem', opacity: 0.5}}>→</div>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <div style={{textAlign: 'center', padding: '40px', color: '#b0b0b0'}}>
                  No students found
                </div>
              )}
            </ListGroup>
          </Container>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}
//
export default withRouter(ListOfStudents);

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/allQuizzesPageStyles.css';
import { useNavigate } from 'react-router-dom';


const AllQuizzesPage = () => {

    const BACKENDURL = process.env.BACKEND_URL || 'http://172.31.21.192:3001/api';
    const userID = localStorage.getItem('userID');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const [quizzes, setQuizzes] = useState([]);
    const [username, setUsername] = useState();

    localStorage.setItem('username', username);

    useEffect (() => {
      if(!token){
        navigate('/login');
      }
    }, []);

    useEffect(() => {
        const fetchAllQuizzes = async () => {
          console.log("useerIDDD", userID);
          try {
            const response = await axios.get(`${BACKENDURL}/getAttemptedQuizzes/${userID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if(response.status === 200){
              setQuizzes(response.data.attemptedQuizzes);
              setUsername(response.data.username);
              localStorage.setItem('username', username);
              console.log(response.data);
            }
            else{
              console.log("server side failure---Attempted Quizzes");
            }
          } catch (error) {
            console.error('Error fetching quiz:', error);
          }
        };
    
        fetchAllQuizzes();
      }, []);

    const handleDashboardClick = () => {
        navigate('/dashboardPage'); 
    }

    const handleView = async (quiz) => {
      navigate(`/results-page/${quiz.attemptID}`);
    };
  

    const handleDelete = async (quizID) => {
      try {
        console.log(quizID);
        const response = await axios.delete(`${BACKENDURL}/deleteAttemptedQuiz/${quizID}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (response.status === 200) {
          setQuizzes(quizzes.filter(quiz => quiz._id !== quizID));
          console.log('Attempted Quiz Deleted');
          navigate(0);
        } else {
          console.log('Failed to delete the quiz');
        }
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }

    return (
      <div className="all-attempted-quizzes">
        <h2>All Attempted Quizzes</h2>
        <button class="dashboard-btn" onClick={()=> handleDashboardClick()}>Go to Dashboard</button>
        {quizzes.length > 0 ? (
          <table className="quiz-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Score</th>
                <th>Total Time Taken</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, index) => (
                <tr key={index}>
                  <td>{username}</td>
                  <td>{quiz.score}</td>
                  <td>{quiz.totalTimeTaken} seconds</td>
                  <td>
                    <button className="view" onClick={()=> handleView(quiz)}>view</button>
                    <button classNam="delete" onClick={()=>handleDelete(quiz.attemptID)}>delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No quizzes attempted yet.</p>
        )}
    </div>
    );


};

export default AllQuizzesPage; 
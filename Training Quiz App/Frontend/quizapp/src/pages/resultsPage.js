import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/resultsPageStyles.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Navbar from '../components/nav';
import { resetQuizState } from '../redux/actions/quizActions';

const ResultsPage = () => {
  const BACKENDURL = process.env.BACKEND_URL || 'http://172.31.21.192:3001/api';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {AttemptID} = useParams();
  const results = useSelector((state) => state.quiz.results);
  const [resultData, setResultsData] = useState();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const userID = localStorage.getItem('userID');


  useEffect (() => {
    if(!token){
      navigate('/login');
    }
    else if(AttemptID){
      fetchQuiz(AttemptID);
    }
    else if(results){
      console.log('results---', results);
      setResultsData(results);
    }
  }, []);

  const fetchQuiz = async (AttemptID) => {
    try{
      console.log(AttemptID);
      const response = await axios.get(`${BACKENDURL}/getAttemptedQuiz/${AttemptID}`,{
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });

      if(response.status === 200){
        const resp = response.data.resultData;
        setResultsData(resp);
      }
      else {
        console.error('Error fetching quiz:', response);
      }

    } catch(error){
      alert('Failed to fetch results.');
      console.error('Error fetching results:', error);
    }
  };
  const saveResults = async () => {
    console.log(results);
    
    try {
        const response = await axios.post(`${BACKENDURL}/saveQuiz`, 
        {
          "userID": resultData.userID, 
          "quizID": resultData.quizID, 
          "answers": resultData.answers, 
          "questionTimes": resultData.questionTimes, 
          "totalTimeTaken": resultData.totalTimeTaken, 
          "score": resultData.score,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

    if (response.status === 201) {
        console.log(response);
        console.log('Quiz saved successfully');
        alert('Results Saved.');
        dispatch(resetQuizState());
        navigate('/dashboardPage');
      } else {
        console.error('Error saving quiz:', response);
      }
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Failed to save results.');
    }
  };

  useEffect (() =>  {
    if (!results && !AttemptID) {
      navigate('/dashboardPage');
    }
  }, []);

  if (!results && !AttemptID) {
    return <p>No results to display</p>
  }
  return (
    <>
    <Navbar/>
    <div className="results">
        <div class="savediv">
            <h2>Quiz Results</h2>
            <button class="save" onClick={saveResults}>Save Results</button>
        </div>
      <div className="result-item">
        <h3>Respondent</h3>
        <p>{userID} {username}</p>
      </div>
      <div className="result-item">
        <h3>Summary</h3>
        <p>Thank you for taking the test!</p>
      </div>
      <div className="result-item">
        <h3>Result</h3>
        <p>Score: {(resultData?.score/5)*100}%</p>
      </div>
      <div className="result-item">
        <h3>Timer</h3>
        <p>Total Time: {formatTime(resultData?.totalTimeTaken)}</p>
        <ul>
          {resultData?.questionTimes.map((time, index) => (
            <li key={index}>Question {index + 1} Time: {formatTime(time)}</li>
          ))}
        </ul>
      </div>
      <button class="dashboard-btn" onClick={() => {dispatch(resetQuizState()); navigate('/dashboardPage')}}>Back to Dashboard</button>
    </div>
    </>
  );
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export default ResultsPage;

import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboardPageStyles.css'
import Navbar from '../components/nav'; 
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import axios from 'axios';
import { setCurrentQuiz } from '../redux/actions/quizActions';

const DashboardPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');


  useEffect (() => {
      if(!token){
        navigate('/login');
      }
  }, []);
  const handleGetQuiz = async ()  => {
      const BACKENDURL = process.env.BACKEND_URL || 'http://172.31.21.192:3001/api';
      try {
        const response = await axios.get(`${BACKENDURL}/getQuiz`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(response.data);
        dispatch(setCurrentQuiz(response.data));
        console.log(response.data);
        navigate('/quiz');
      } catch (error) {
          console.log(error);
      }
  };  
    
  const handleGetAllQuizzes = () => {
    navigate('/all-quizzes');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    navigate('/login');

  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      lastName: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
    }),
    onSubmit: (values) => {
      handleGetQuiz();
    },
  });

  return (
    <div className="dashboard">

      <Navbar/>
         
      <div className="dashboard-container">
        <main className="dashboard-main">
          <button className='logout' onClick={() => handleLogout()}>Logout</button>   
          <button class="viewQuizzes" onClick={handleGetAllQuizzes}>View All Quizzes</button> 
            <section class ="example"><h2>Example Reasoning Test</h2></section>
            <section className="test-info">
              <div className="instructions">
                <h3>INSTRUCTIONS</h3>
                <p>Hello!</p>
                <p>This test consists of 6 questions. The time to solve one question is 2 minutes.</p>
                <p>Make sure you have enough time and then start the test.</p>
                <p>Good luck!</p>
              </div>
              <div class="thirdcombo">
                <div className="honest-respondent">
                  <h3>HONEST RESPONDENT TECHNOLOGY</h3>
                  <p><strong>Focus on your test only!</strong></p>
                  <p>The test is secured with <strong>Honest Respondent Technology</strong>. Don't click outside the test tab area. Every browser tab movement is recorded.</p>
                  <p>We recommend disabling background programs, chats and system notifications before the test, as they can trigger a test block.</p>
                </div>
                <div className="test-start-form">
                  <h3>TEST START FORM</h3>
                  <p>Start the test</p>
                  <p>Fill in the form before starting the test.</p>
                  <form onSubmit={formik.handleSubmit}>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.firstName}
                  />
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <div className="error">{formik.errors.firstName}</div>
                  ) : null}
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lastName}
                  />
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <div className="error">{formik.errors.lastName}</div>
                  ) : null}
                  <button type="submit">Start test</button>
                </form>
                </div>
              </div>
            </section>
        </main>
        <footer className="dashboard-footer">
          Powered by <strong>testportal</strong>
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;

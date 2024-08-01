import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/quizPageStyles.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import NavBar from '../components/nav';
import { setQuizResults, resetQuizState } from '../redux/actions/quizActions';

const QuizPage = () => {
  const BACKENDURL = process.env.BACKEND_URL || 'http://172.31.21.192:3001/api';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [questionTimes, setQuestionTimes] = useState([]);
  const [questionCountdown, setQuestionCountdown] = useState(0);
  const [questionCounter, setQuestionCounter] = useState(0);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0); // Total time in seconds
  const [errors, setErrors] = useState(null);
  const [renderTrigger, setRenderTrigger] = useState(0);


  const userID = localStorage.getItem('userID');
  const token = localStorage.getItem('token');
  const quiz = useSelector((state) => state.quiz.currentQuiz);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    if (!quiz) {
      navigate('/dashboardPage');
    }
  });

  useEffect(() => {
    if (quiz) {
      const currentQuestion = quiz.Questions[currentQuestionIndex];
      setQuestionCountdown(currentQuestion?.allowedTime || 0); //setting timer
      setQuestionCounter(0);
    }
  }, [currentQuestionIndex, quiz]);

  const forceRender = () => {
    let updatedTimes = [];
    setQuestionTimes((prevTimes) => {
      const updatedTimes = [...prevTimes];
      updatedTimes[currentQuestionIndex] = questionCounter;
      return updatedTimes;
    });

    console.log("updated times: ",updatedTimes);
  }

  const handleSubmitQuiz = async (values,updatedTimes) => {
    if (!quiz) return; // Ensure quiz is not null

    const quizID = quiz._id;
    const answerArray = quiz?.Questions?.map((question) => values[question._id]);

  
    try {
      const response = await axios.post(`${BACKENDURL}/submitQuiz`,
        {
          "userID": userID,
          "quizID": quizID,
          "answers": answerArray,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const recvdScore = response.data;

        setScore(response.data);

        const resultData = {
          "userID": userID,
          "quizID": quizID,
          "answers": answerArray,
          "questionTimes": questionTimes,
          "totalTimeTaken": totalTimeTaken,
          "score": response.data
        };
        console.log('questionTimes---',updatedTimes);
        console.log('resultData---',resultData);
        dispatch(setQuizResults(resultData));
        navigate('/results-page');
      } else {
        console.error('Error submitting quiz:', response);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
    }
  }

  // Create validation schema only if quiz is available
  const validationSchema = quiz ? Yup.object().shape(
    quiz.Questions.reduce((acc, question) => {
      acc[question._id] = Yup.string()
        .oneOf(question.options, 'Invalid option') // Ensure the value is one of the available options
        .required('Select an option'); // Make sure the field is required
      return acc;
    }, {})
  ) : Yup.object();

  // Effect to handle automatic submission when all questions are answered
  useEffect(() => {
    if (quiz) {
      const allAnswered = quiz.Questions.every((question) => {
        return Boolean(document.querySelector(`input[name="${question._id}"]:checked`));
      });

      if (allAnswered) {
        // Automatically submit the form
        handleSubmitQuiz();
        document.forms[0].dispatchEvent(new Event('submit', { cancelable: true }));
      }
    }
  }, [quiz, currentQuestionIndex, handleSubmitQuiz]);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuestionCountdown((prev) => {   
        if (prev > 0) {
          return prev - 1;
        } else {
          if (currentQuestionIndex < quiz?.Questions.length) {
            setQuestionTimes((prevTimes) => {
              const updatedTimes = [...prevTimes];
              updatedTimes[currentQuestionIndex] = questionCounter;
              return updatedTimes;
            });
            setTotalTimeTaken((prevTotal) => prevTotal + questionCounter);
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setQuestionCounter(0);
            return quiz?.Questions[currentQuestionIndex + 1]?.allowedTime || 0;
          } else {
            // Store the time for the last question and automatically submit the quiz
            setQuestionTimes((prevTimes) => {
              const updatedTimes = [...prevTimes];
              updatedTimes[currentQuestionIndex] = questionCounter;
              return updatedTimes;
            });
            setTotalTimeTaken((prevTotal) => prevTotal + questionCounter);
            handleSubmitQuiz(document.forms[0]?.values);
            clearInterval(interval);
            return 0;
          }
        }
      });
      setQuestionCounter((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestionIndex, quiz, questionCounter, questionTimes]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSubmitAnswer = (quiz, values) => {
    if (values[quiz.Questions[currentQuestionIndex]._id] !== '') {
      setErrors('');
      // if(currentQuestionIndex === 0)
      // {
      //   setCurrentQuestionIndex(() => {
      //     const updatedTimes = []; 
      //     updatedTimes[0] = questionCounter;
      //     return updatedTimes;
      //   })
      // }
      // else 

      let updatedTimes = [];
      updatedTimes = [...questionTimes];
      updatedTimes[currentQuestionIndex] = questionCounter;
      questionTimesHelper(updatedTimes);
      setTotalTimeTaken((prevTotal) => prevTotal + questionCounter);
      if (currentQuestionIndex < quiz.Questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setQuestionCounter(0);
      } else {
        console.log('ddd')
        handleSubmitQuiz(values,updatedTimes);
      }
    } else {
      setErrors('Select an option');
    }
    console.log('questionsTimes', questionTimes);
  };
    const questionTimesHelper=(updatedTimes)=>{
    setQuestionTimes(updatedTimes);
    }

  return (
    <div>
      <NavBar />
      <div className="quiz">
        <Formik
          initialValues={quiz?.Questions.reduce((acc, question) => {
            acc[question._id] = '';
            return acc;
          }, {})}
          validationSchema={validationSchema}
          onSubmit={handleSubmitQuiz}
        >
          {({ values }) => (
            <Form>
              <div>
                {quiz?.Questions.length > 0 && (
                  <div className="question">
                    <div className="countdown">
                      Time left: {formatTime(questionCountdown)}
                    </div>
                    <h4>{quiz?.Questions[currentQuestionIndex]?.questionText}</h4>
                    {quiz?.Questions[currentQuestionIndex]?.options.map((option, idx) => (
                      <div key={idx} className="option">
                        <Field
                          type="radio"
                          id={`q${currentQuestionIndex}o${idx}`}
                          name={quiz?.Questions[currentQuestionIndex]._id}
                          value={option}
                        />
                        <label htmlFor={`q${currentQuestionIndex}o${idx}`}>{option}</label>
                        <ErrorMessage name={quiz?.Questions[currentQuestionIndex]._id} component="div" className="error" />
                      </div>
                    ))}
                  </div>
                )}
                {errors && <p className="error-message">{errors}</p>}
                <button
                  className="submitbtn" type="button"
                  onClick={() => handleSubmitAnswer(quiz, values)}
                >
                  Submit Answer
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default QuizPage;

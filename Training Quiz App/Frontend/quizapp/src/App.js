import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import SignupPage from './pages/signupPage';
import DashboardPage from './pages/dashboardPage';
import QuizPage from './pages/quizPage';
import AllQuizzesPage from './pages/allQuizzesPage';
import ResultsPage from './pages/resultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/dashboardPage" element={<DashboardPage/>}/>
        <Route path="/quiz" element={<QuizPage/>} />
        <Route path="/all-quizzes" element={<AllQuizzesPage/>}/>
        <Route path="/results-page" element={<ResultsPage/>}/>
        <Route path="/results-page/:AttemptID" element={<ResultsPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;

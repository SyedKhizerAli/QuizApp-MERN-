const express = require ('express');
const router = express.Router();
const QuizController = require('../Controllers/Quiz');
const {validateToken} = require('../Middlewares/AuthMiddleware');
const { valid } = require('joi');
const Quiz = require('../Models/Quiz');

router.get('/getQuiz', validateToken, QuizController.getQuiz);
router.post('/submitQuiz', validateToken, QuizController.submitQuiz); 
router.get('/getAttemptedQuizzes/:userID', validateToken, QuizController.getAttemptedQuizzes); 
router.get('/getAttemptedQuiz/:attemptID', validateToken, QuizController.getAttemptedQuiz);
router.post('/saveQuiz', validateToken, QuizController.saveQuiz);
router.delete('/deleteAttemptedQuiz/:attemptID', validateToken, QuizController.deleteAttemptedQuiz);

module.exports = router;

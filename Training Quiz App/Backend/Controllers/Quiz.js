const Quiz = require ('../Models/Quiz');
const Question = require ('../Models/Question');
const User = require('../Models/User');
const AttemptedQuiz = require('../Models/AttemptedQuizes');
const { json } = require('express');

exports.getQuiz = async (req, res) => {
    console.log('get quiz');
    try{
        const randomQuiz = await Quiz.aggregate([{$sample: {size:1}}]);
        console.log(randomQuiz[0]);
        if(!randomQuiz)
        {
            res.status(404).console.log('Error: Quiz not found');
        }

        const questions = await Promise.all(randomQuiz[0].Questions.map(async (questionID) => {
            const question = await Question.findById(questionID);
            if(question){
                return ({
                _id: question._id,
                questionText: question.questionText,
                options: question.options,
                allowedTime: question.allowedTime
            })}
            else{
                console.log('question not found', questionID);
            }
        }))

        
        res.status(200).json({
            _id:randomQuiz[0]._id,
            Questions : questions
        })
    }
    catch(error){
        console.log('error in fetching quizqqqqq');
        res.status(500).json({error: 'error in fetching quiz'});
    }
}

exports.submitQuiz = async (req, res) => {
    const {userID, quizID, answers} = req.body;
    console.log(req.body);

    try{
        const quiz = await Quiz.findById(quizID).populate('Questions');
        console.log('quiz',quiz);
        if(!quiz){
            res.status(404).json({error: 'quiz not found'});
        }

        let score = 0;

        quiz.Questions.forEach((question, index) => {
            if(question.correctOption === answers[index]){
                score++;
            }
        })
        console.log(score);
        
        res.status(201).json(score);
    }
    catch(error){
        console.log('error----',error)
        res.status(500).json({error: 'error submitting quiz'})
    }
}

exports.getAttemptedQuizzes = async (req, res) => {

    const userID = req.params.userID;
    console.log(userID);
    try{
        const attemptedQuizzesLocal = await AttemptedQuiz.find({userID: userID}).populate('questions.questionId');
        const user = await User.findById(userID);
        console.log('----', attemptedQuizzesLocal, user);

        if (attemptedQuizzesLocal.length === 0) {
            return res.status(404).json({ error: 'User has not attempted any quizzes' });
        }   
        const attemptedQuizzes = attemptedQuizzesLocal.map(quiz => ({
            attemptID: quiz._id,
            quizID: quiz.quizID,
            score: quiz.score,
            totalTimeTaken: quiz.totalTimeTaken
          }));

          console.log('attemptedQuizzesGlobal----', attemptedQuizzes);

        res.status(200).json({"username": user.username, attemptedQuizzes});
    }
    catch(error){
        res.status(404).json({error: 'Attempted Quiz Not Found'});
    }
}

exports.getAttemptedQuiz = async (req, res) => {
    const attemptID = req.params.attemptID;
    console.log(attemptID);

    try{
        const attemptedQuiz = await AttemptedQuiz.findById(attemptID); 
        console.log('Attempted Quiz----', attemptedQuiz);

        if(attemptedQuiz){
            const questionTimes = attemptedQuiz.questions.map(q => q.timeTaken ?? 0);
            const resultData = {
                userID: attemptedQuiz.userID,
                quizID: attemptedQuiz.quizID,
                answers: attemptedQuiz.questions.map(q => q.userAnswer),
                questionTimes: questionTimes,
                totalTimeTaken: attemptedQuiz.totalTimeTaken ?? 0,
                score: attemptedQuiz.score
            };
            res.status(200).json({resultData});
        }
        else{
            res.status(404).json({error : 'Quiz not found'});
        }

    } catch (error){
        res.status(404).json({error: 'Attempted Quiz Not Found'});
    }
}

exports.saveQuiz = async (req, res) => {
    try{
        console.log("backend--", req.body);
        const {userID, quizID, answers, questionTimes, totalTimeTaken, score } = req.body;
        console.log("infoooo", userID, quizID, answers, questionTimes, totalTimeTaken, score);
        const quiz = await Quiz.findById(quizID);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        console.log("quiz---", quiz);
        const questionsData = quiz.Questions.map((question, index) => ({
            questionId: question._id,
            userAnswer: answers[index],
            timeTaken: questionTimes[index]
        }));

        console.log("questionData----", questionsData);

        const attempt = new AttemptedQuiz({
            userID: userID,
            quizID: quizID,
            score: score,
            questions: questionsData,
            totalTimeTaken: totalTimeTaken
        });

        const respAQ = await attempt.save();
        console.log(respAQ);
        res.status(201).json(respAQ);
    }
    catch(error){
        console.log('error----',error)
        res.status(500).json({error: 'error saving quiz'})
    }
}

exports.deleteAttemptedQuiz = async (req, res) => {
    const attemptID  = req.params.attemptID;
    try {
        const deletedQuiz = await AttemptedQuiz.findByIdAndDelete(attemptID);
        console.log('deletedQuiz---', deletedQuiz);

        if (!deletedQuiz) {
            return res.status(404).json({ message: 'Quiz attempt not found' });
        }

        res.status(200).json({ message: 'Quiz attempt deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz attempt:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
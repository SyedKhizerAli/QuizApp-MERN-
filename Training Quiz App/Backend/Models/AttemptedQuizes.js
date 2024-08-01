const mongoose = require('../Mongoose').mongoose;
const user = require('./User');
const quiz = require('./Quiz');

const AttemptedQuizSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    quizID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },

    score: {
        type: Number,
        required: true
    },

    questions: 
    [{
        questionId: { type: String, required: true },
        userAnswer: { type: String, required: true },
        timeTaken: { type: Number, required: false } // Time in seconds
    }],

    totalTimeTaken: { type: Number, required: true }
})

const AttemptedQuiz = mongoose.model('AttemptedQuiz', AttemptedQuizSchema);
module.exports = AttemptedQuiz;
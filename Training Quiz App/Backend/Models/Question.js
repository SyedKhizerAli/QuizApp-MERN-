const mongoose = require('../Mongoose').mongoose;

const QuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctOption:{
        type: String,
        required: true
    },
    allowedTime: {
        type: Number, 
        required: true
    }
})

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;
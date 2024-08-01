const mongoose = require('../Mongoose').mongoose;

const QuizSchema = new mongoose.Schema({

    Questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Question',
        Required: true
    }]
})

const Quiz = mongoose.model('Quiz', QuizSchema);
module.exports = Quiz;
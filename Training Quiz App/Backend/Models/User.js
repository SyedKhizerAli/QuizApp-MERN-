const { array } = require('joi');
const {AttemptedQuizSchema} =  require('./AttemptedQuizes');
const mongoose = require('../Mongoose').mongoose;


const userSchema = new mongoose.Schema({

    username:{
        type: String,
        required: true
    },
    password:{ 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: false
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User;
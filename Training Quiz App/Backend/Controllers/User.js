const User = require('../Models/User')
const AttemptedQuiz = require('../Models/AttemptedQuizes') 
const Quiz = require('../Models/Quiz');
const bcrypt = require('bcrypt');
const Question = require('../Models/Question');

exports.SignUp = async (req, res, next) =>
{
    console.log('signup');
    const {username, password, email, age} = req.body;
    try{
        const salt = await bcrypt.genSalt(1);
        const hashedPass = await bcrypt.hash(password, salt);

        const hashedUser = new User({
            username, password: hashedPass, email, age
        })

        const resp = await hashedUser.save();
        console.log("resp----",resp)
        req.user = resp;
        console.log('signup passed');
        next();
    }
    catch (error){
        console.log('Error:', error);
        res.status(400).send({error: error.message});
    }
}

exports.Login = async (req, res, next) =>
{
    console.log('login');

    const {email, password} = req.body;
    console.log(req.body);
    try{
        const _user = await User.findOne({email});
        if(!_user)
        {
            return res.status(400).json({error: 'User not found'});
        }
        const PasswordCheck = await bcrypt.compare(password, _user.password);
        if(!PasswordCheck)
        {
            return  res.status(400).json({error: 'Password Incorrect'});
        }
        else{
            req.user = _user;
            console.log('login passed');
            next();
        }
    } 
    catch(error){
        console.log('Login error', error);
        res.status(500).json({error: 'Server Login Error'});
    }
    
}
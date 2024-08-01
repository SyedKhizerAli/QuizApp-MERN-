const Joi = require('joi')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const express = require('express');


const validateSignUp = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().required(),
        age: Joi.number()
    });

    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).json({error: error.message});
    }
    next();
}

const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });

    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).json({error: error.message});
    }
    console.log('validatelogin passed');
    next();
}

const generateToken = (req, res, next) => {
    const user = req.user;
    console.log(user);
    const token = jwt.sign(
        {id: user.id, email: user.email}, process.env.JWT_SECRET_KEY, {expiresIn: '1000h'}
    );
    console.log('generateToken passed');

    res.status(200).json({token, userID: user.id});
    next();
}

module.exports = {validateSignUp, validateLogin, generateToken};
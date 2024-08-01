const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../Models/User');

const validateToken = (req, res, next) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(token);
    if(!token){
        return res.status(401).json({error: 'No token'});
    }

    try{
        const decrypt = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = User.findById(decrypt.id);
        
        if(!user){
            return res.status(401).json({error: 'invalid token'})
        }
        req.user = user;
        next();
    }
    catch(error){
        return res.status(401).json({error: 'middleware token error'});
    }
}

module.exports = {validateToken};
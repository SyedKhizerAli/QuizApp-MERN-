// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import quizReducer from './quizReducer'; 

export default combineReducers({
  user: userReducer,
  quiz: quizReducer,
});

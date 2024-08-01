import {SET_QUIZ_RESULTS, SET_CURRENT_QUIZ, RESET_QUIZ_STATE} from './types';

export const setQuizResults = (results) => ({
    type: SET_QUIZ_RESULTS,
    payload: results,
});

export const setCurrentQuiz = (quiz) => ({
    type: SET_CURRENT_QUIZ,
    payload: quiz,
});
  
  export const resetQuizState = () => ({
    type: RESET_QUIZ_STATE,
});
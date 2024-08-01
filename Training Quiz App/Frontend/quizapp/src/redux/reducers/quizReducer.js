import { SET_QUIZ_RESULTS, SET_CURRENT_QUIZ, RESET_QUIZ_STATE } from '../actions/types';

const initialState = {
    results: null,
  };

const quizReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_QUIZ_RESULTS:
        return {
            ...state,
            results: action.payload,
        };

        case SET_CURRENT_QUIZ:
        return {
            ...state,
            currentQuiz: action.payload,
        };
        case RESET_QUIZ_STATE:
        return initialState;

        default:
        return state;
    }
};
  
export default quizReducer;
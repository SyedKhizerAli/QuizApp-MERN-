import { SET_USER, LOGOUT_USER } from '../actions/types';

const initialState = {
  userID: null,
  token: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        userID: action.payload.userID,
        token: action.payload.token,
      };
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;

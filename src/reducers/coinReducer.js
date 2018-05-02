import * as actionTypes from '../actions/actionTypes';

function coinReducer(state = {coinData: {}}, action){
  switch(action.type){
    case actionTypes.SET_COIN: {
      return {...state, coinData: action.coinData};
    }

    default:
      return {...state};
  }
}

export default coinReducer;
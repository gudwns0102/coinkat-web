import * as actionTypes from '../actions/actionTypes';

function navReducer(state = {nav: null}, action){
  switch(action.type){
    case actionTypes.SET_NAV: {
      return {...state, nav: action.nav};
    }

    default:
      return {...state};
  }
}

export default navReducer;
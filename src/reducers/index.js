import { combineReducers } from 'redux';
import coinReducer from './coinReducer';
import navReducer from './navReducer';

const reducers = combineReducers({
  coinReducer,
  navReducer
})

export default reducers;
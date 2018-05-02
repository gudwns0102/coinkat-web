import * as actionTypes from './actionTypes';

function getAvatar(){
  return {
    type: actionTypes.GET_AVATAR
  }
}

function setAvatar(coinName){
  return {
    type: actionTypes.SET_AVATAR,
    coinName,
  }
}

function getCoin(){
  return {
    type: actionTypes.GET_COIN,
  }
}

function setCoin(coinData){
  return {
    type: actionTypes.SET_COIN,
    coinData,
  }
}

function setNav(nav){
  return {
    type: actionTypes.SET_NAV,
    nav,
  }
}

export {
  getAvatar,
  setAvatar,
  getCoin,
  setCoin,
  setNav
}
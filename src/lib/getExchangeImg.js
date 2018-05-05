function getExchangeImg(exchange){
  var table = {
    bithumb: require('../assets/images/exchange/bithumb-logo.png'),
    coinone: require('../assets/images/exchange/coinone-logo.png'),
    upbit: require('../assets/images/exchange/upbit-logo.png'),
  }

  return table[exchange];
}

export default getExchangeImg;
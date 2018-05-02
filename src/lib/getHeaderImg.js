const getHeaderImage = (name) => {

  var name2img = {
       'BTC': require('../assets/images/coin/BTC.png'),
       'ETH': require('../assets/images/coin/ETH.png'),
       'XRP': require('../assets/images/coin/XRP.png'),    
       'QTUM':require('../assets/images/coin/QTUM.png'),
       'BTG': require('../assets/images/coin/BTG.png'),
       'EOS': require('../assets/images/coin/EOS.png'),
       'XMR': require('../assets/images/coin/XMR.png'),
       'ZEC': require('../assets/images/coin/ZEC.png'),
       'DASH':require('../assets/images/coin/DASH.png'),
       'LTC': require('../assets/images/coin/LTC.png'),
       'BCH': require('../assets/images/coin/BCH.png'),      
       'ETC': require('../assets/images/coin/ETC.png'),              
       'IOTA':require('../assets/images/coin/IOTA.png'),      
       'ICX': require('../assets/images/coin/ICX.png'),     
       'VEN': require('../assets/images/coin/VEN.png'),     
       'TRX': require('../assets/images/coin/TRX.png'),    
       'ELF': require('../assets/images/coin/ELF.png'),      
       'MITH':require('../assets/images/coin/MITH.png'),    
       'OMG': require('../assets/images/coin/OMG.png'),
       'MCO': require('../assets/images/coin/MCO.png'),
       'KNC': require('../assets/images/coin/KNC.png'),
  }
 
  return name2img[name];
}

export default getHeaderImage
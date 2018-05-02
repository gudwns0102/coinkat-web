const translate2Origin = (name) => {

  var short2Origin = {
       'BTC': 'Bitcoin',
       'ETH': 'Ethereum',
       'XRP': 'Ripple',
       'QTUM': 'Quantum',
       'BTG': 'Bitcoin Gold',
       'EOS': 'Eos',
       'XMR': 'Monero',
       'ZEC': 'Zcash',
       'DASH': 'Dash', 
       'LTC': 'Litecoin',
       'BCH': 'Bitcoin Cash',
       'ETC': 'Ethereum Classic',
       'IOTA': 'Iota',
       'ICX': 'Icon',
       'VEN': 'VeChain',
       'TRX': 'Tron',
       'ELF': 'Aelf',
       'MITH': 'Mithril',
       'OMG': 'OmiseGO',
       'MCO': 'Monaco',
  }
 
  return short2Origin[name];
}

export default translate2Origin
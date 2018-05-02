export default function classifyNews(article){
  const dic = [
    'bitcoin','blockchain','blockchains','btc','coin','coins','crypto','cryptocurrencies','cryptocurrency','currency','ethereum','financial','mining','mobile','btc','bitcoin','eth','ethereum','xrp','ripple','qtum','quantum','btg','bitcoingold','eos','eos','xmr','monero','zec','zcash','dash','dash','ltc','litecoin','bch','bitcoincash','etc','ethereumclassic','iota','iota','icx','icx','ven','vechain','trx','tron','elf','aelf','mith','mithril','omg','omisego','mco','monaco','transaction','hardfork','decentral'
  ]
  
  const UPPER_EPSILON = 0.95;

  var hypo_x;
  var features = {};
  var network = require('./network'); // Neural Network Function
  var target = (article.title + " " + (article.description || '')).toLocaleLowerCase().replace(/[^\w\s]/g, '').replace(/[\s]+|\n/g, ' ').trim().split(' ');
  
  for(var i in dic)
    features[i] = 0; // Initialize features
  
  for(var j in target){
    var word = target[j];
    if(dic.includes(word)){
      features[dic.indexOf(word)] = 1; // If the article includes keyword, marking it as 1 in features
    }
  }

  hypo_x = network(features)[0]; // Network Run 

  console.log('H(x): ', hypo_x); // Check the result in console

  return hypo_x > UPPER_EPSILON; // If the h(x) is larger than upper boundary, it returns 1
}

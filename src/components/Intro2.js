import React from 'react'
import Coincard from './Coincard';
import Parse from 'parse';
import Slider from 'react-slick';

class Intro2 extends React.Component {
  constructor(props){
    super(props);

    const { style, coinData } = this.props;
    const Push = Parse.Object.extend("Push");
    
    var exchange = 'bithumb';
    var exchangeData = coinData[exchange];

    this.entries = Object.keys(exchangeData).map(name => {
      var push;
      var data = exchangeData[name];
      if (Math.round(Math.random()) % 2 === 0){
        push = new Push({
          exchange,
          name,
          upPrice: data.currentPrice * (Math.random()*(1.5 - 1.1) + 1.1),
          downPrice: data.currentPrice * (Math.random()*(0.9 - 0.5) + 0.5),
        })
      } else {
        push = null
      }
      console.log(data);
      
      return (  
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', margin: 20}}>
          <Coincard data={{exchange, name, data}} push={push} onClick={() => null}/>
        </div>
      );
    })
  }


  render(){
    const { style, coinData } = this.props;
    var exchange = 'bithumb';
    var exchangeData = coinData[exchange];
    
    const Push = Parse.Object.extend("Push");

    /*
    var entries = Object.keys(exchangeData).map(name => {
      var data = exchangeData[name];
      if (Math.round(Math.random()) % 2 === 0){
        var push = new Push({
          exchange,
          name,
          upPrice: data.currentPrice * (Math.random()*(1.5 - 1.1) + 1.1),
          downPrice: data.currentPrice * (Math.random()*(0.9 - 0.5) + 0.5),
        })
      } else {
        var push = null
      }
      
      return (  
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', margin: 20}}>
          <Coincard data={{exchange, name, data}} push={push} onClick={() => null}/>
        </div>
      );
    })*/

    var option = {
      dots: false,
      infinite: true,
      speed: 500,
      autoplay:true,
      autoplaySpeed: 2500,
      slidesToShow: 4,
      slidesToScroll: 3
    }
    
    return (
      <div style={{...styles.container, ...style}}>
        <div style={styles.content}>
          <span style={{fontSize: 30, fontWeight: 'bold'}}>CoinKat</span> give you a customizable board<br/><br/>
          <span>This web displays information about Cryptocurrency</span>
        </div>
        <div style={styles.cards}>
          <Slider {...option}>
            {this.entries}
          </Slider>
        </div>
      </div>
    ) 
  }
}

const styles = {
  container: {
    display:'flex', 
    alignItems:'center',
    fontFamily: 'Raleway',
    backgroundColor:'red,'
  },

  content: {
    flex: 1,
    paddingTop: 50,
    paddingLeft: 30,
  },

  cards: {
    width: '60%',
    height: '100%',
    marginTop: 200,
  },
}

export default Intro2
import React from 'react'
import { Coincard } from '../../components';
import Parse from 'parse';
import Slider from 'react-slick';
import './HomeSection1.css';

class HomeSection1 extends React.Component {
  constructor(props){
    super(props);

    const { coinData } = this.props;
    const Push = Parse.Object.extend("Push");
    
    var exchange = 'upbit';
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
      
      return (
        <div className="card">
          <Coincard data={{exchange, name, data}} push={push} onClick={() => null}/>
        </div>
      );
    })

    this.state = {
      bucketSize: 5
    }
  }

  handleResize = (e) => {
    /*var slider = document.getElementsByClassName('slick-slider')[0];
    var card = document.getElementsByClassName('card')[0];
    var slider_width = slider.clientWidth;
    var card_width = 200;

    var num = Math.max(Math.ceil(slider_width/card_width) - 2, 3);

    this.setState({bucketSize: num});*/
  }

  componentDidMount(){
    //this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.handleResize);
  }


  render(){
    const { style } = this.props;

    var option = {
      dots: false,
      infinite: true,
      speed: 500,
      autoplay:true,
      autoplaySpeed: 2500,
      slidesToShow: this.state.bucketSize,
      slidesToScroll: 3
    }
    
    return (
      <div style={{...styles.container, ...style}}>
        <div style={styles.content}>
          <span style={{fontSize: '2.5vw', fontWeight: 'bold', fontFamily: 'Archivo Black'}}>CoinKat</span> gives you a customizable board!<br/><br/>
          <span>This web displays information about Cryptocurrency</span>
        </div>
        <div id="home-cards" style={styles.cards}>
          {this.entries}
        </div>
      </div>
    ) 
  }
}

const styles = {
  container: {
    position: 'relative',
    width:'100%',
    height:'100vh',
    display:'flex', 
    flexDirection:'column',
    fontFamily: 'Raleway',
    overflow:'hidden',
  },

  content: {
    width:'80%',
    paddingTop: 50,
    paddingLeft: 30,
  },

  cards: {
    display:'flex',
    marginTop: '10%',
    width: '1000%',
  },
}

export default HomeSection1;
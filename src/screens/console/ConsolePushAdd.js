import React from 'react'

import { withRouter } from 'react-router';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { getHeaderImg, getExchangeImg, translate2Origin, toLocaleString, parseDelta } from '../../lib';
import axios from 'axios';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import FontAwesome from 'react-fontawesome';
import { Motion, spring } from 'react-motion';
import Parse from 'parse';
import * as Components from '../../components';
import Paper from 'material-ui/Paper';

const DEFAULT_DELTA = 5;
const MAX_DELTA = 15;

const RED = '#C62828'
const BLUE = '#283593'

class CoinEntry extends React.Component{
  
  constructor(props){
    super(props);

    this.state = {
      isMouseOver: false,
    }
  }
  render(){
    const { name, style } = this.props;
    const { isMouseOver  } = this.state;

    return (
      <Paper 
        style={{...style, cursor: 'pointer'}} 
        zDepth={isMouseOver ? 4 : 2} 
        onClick={this.props.onClick}
        onMouseOver={() => this.setState({isMouseOver: true})}
        onMouseLeave={() => this.setState({isMouseOver: false})}>
        <img src={getHeaderImg(name)} alt={name} style={{width: '15%', marginTop: '2%'}} />
        <span style={{fontWeight:'bold'}}>{translate2Origin(name)}</span>
        <span style={{fontSize: 15, color:'gray'}}>{name}</span>
      </Paper>
    );
  }
}

class ConsolePushAdd extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      exchange: 'bithumb',
      name: null,
      currentPrice: null,
      coin2Exchange: null,

      upPrice: null,
      downPrice: null,

      upPercent: null,
      downPercent: null,
      
      showUpPrice: true,
      showDownPrice: true,

      queryText: '',
    }
  }

  handleCoinClick = (exchange, name) => {
    const { coinData } = this.props;
    var { currentPrice, openPrice } = coinData[exchange][name];
    
    var upPrice = parseInt(currentPrice * (1 + DEFAULT_DELTA/100));
    var downPrice = parseInt(currentPrice * (1 - DEFAULT_DELTA/100));

    this.setState({exchange, name, currentPrice, upPrice, downPrice, upPercent: DEFAULT_DELTA+'%', downPercent: -DEFAULT_DELTA+'%'});
  }

  getPercent = (price) => {
    var { currentPrice } = this.state;
    var delta = price - currentPrice;

    return parseFloat((delta/currentPrice * 100).toFixed(2)) + '%';
  }

  getPrice = (percent) => {
    var { currentPrice } = this.state;
    
    return parseInt((1 + parseFloat(percent)/100)*currentPrice);
  }

  handlePrice = (e, type) => {
    var parsePrice = parseInt(e.target.value.replace(/,/g,'')) || 0;
    var percent = this.getPercent(parsePrice);

    console.log(parsePrice, percent);
    if(type === 'up'){
      this.setState({upPrice: parsePrice, upPercent: percent})
    } else {
      this.setState({downPrice: parsePrice, downPercent: percent})
    }
  }

  handlePercent = (e, type) => {
    console.log(e.target.value);
    var temp = e.target.value.replace(/[^0-9.]/g, '');
    console.log('temp: ', temp);
    temp[0] === '.' ? temp = '0' + temp : null;
    console.log('0temp', temp);
    var parse = temp.split(/[.]+/i);
    var parsePercent = 
      !parse[0] ? 0 : 
        parse[1] ? parseInt(parse[0].substr(0,2)) + '.' + parse[1].substr(0,2) : 
          temp[temp.length - 1] === '.' ? parseInt(parse[0].substr(0,2)) + '.' : parseInt(parse[0].substr(0,2));

    if(type === 'down'){
      parsePercent = '-'+parsePercent+'%';
    } else {
      parsePercent = parsePercent+'%';
    }

    var price = this.getPrice(parsePercent);

    if(type === 'up'){
      this.setState({upPrice: price, upPercent: parsePercent})
    } else {
      this.setState({downPrice: price, downPercent: parsePercent})
    }  
  }

  handleSubmit = () => {
    var { exchange, name, upPrice, downPrice, upPercent, downPercent } = this.state;
    if(parseFloat(upPercent) > MAX_DELTA || parseFloat(upPercent) < -MAX_DELTA){
      console.log('NOT ACCEPTED')
      return ;
    } 

    var Push = Parse.Object.extend("Push");
    var push = new Push({
      parent: Parse.User.current(),
      exchange,
      name,
      upPrice,
      downPrice,
    })

    push.save({
      success: push => this.props.history.push('/console/push'),
      error: (push, err) => alert("Network Error Occurred...")
    });
  }

  filterData = (data) => {
    var result = {};
    var queryText = this.state.queryText.toLowerCase()
    
    if(queryText === ''){
      return data;
    }

    for(var name in data){
      var origin = translate2Origin(name) || '';
      if(name.toLowerCase().includes(queryText) || origin.toLowerCase().includes(queryText)){
        result[name] = data[name];
      }
    }

    return result;
  }

  async componentDidMount(){
    const { data } = await axios.get("https://api.coinkat.tk/reverseAll");
    this.setState({coin2Exchange: data});
    this.handleCoinClick('bithumb','XRP');
    this.setState({isLoading: false})
  }

  render(){
    const { shrink, coinData } = this.props;
    const { isLoading, exchange, name, currentPrice, upPrice, downPrice, coin2Exchange, showUpPrice, showDownPrice, upPercent, downPercent } = this.state;
    if(!coin2Exchange || isLoading) return <span></span>

    const { margin, percent, delta } = parseDelta(coinData[exchange][name].currentPrice, coinData[exchange][name].openPrice);

    const upPriceForm = (
      <Motion style={{rotateX: spring(showUpPrice ? 0 : 180)}}>
      {value => 
        <div style={{width:'100%', display:'flex', alignItems:'center', marginTop: 30}}>
          <span style={{fontSize: '1.8vw', marginRight: '3%', ...styles.textRed}}>OVER</span>
          {value.rotateX < 90 ? 
            <div style={{transform: `rotateX(${value.rotateX}deg)`}}>
              <input 
                value={toLocaleString(upPrice)} 
                onChange={e => this.handlePrice(e, 'up')} 
                style={{border: 0, outline: 0, ...styles.textRed, width: '50%', textAlign:'center', borderBottom: '1px dashed black', fontSize: '2.0vw'}}/>
              <span style={{fontSize: '1.8vw', color: '#AAAAAA', marginLeft: 10}}>{upPercent}</span>
            </div> 
          : 
            <div style={{transform: `rotateX(${value.rotateX + 180}deg)`}}>
              <input 
                value={upPercent} 
                onChange={e => this.handlePercent(e, 'up')} 
                style={{...styles.textRed, border: 0, outline: 0, width: '35%', textAlign:'center', borderBottom: '1px dashed black', fontSize: '2.0vw'}}/>
              <span style={{fontSize: '1.8vw', color: '#AAAAAA', marginLeft: 10}}>{toLocaleString(upPrice)}</span>
            </div> 
          }
          <FlatButton icon={<FontAwesome name="fas fa-retweet" />} style={{width: 50}} onClick={() => this.setState({showUpPrice: !showUpPrice})}/>
        </div>
      }
      </Motion>  
    );
    const downPriceForm = (
      <Motion style={{rotateX: spring(showDownPrice ? 0 : 180)}}>
      {value => 
        <div style={{width:'100%', display:'flex', alignItems:'center', marginTop: 30}}>
          <span style={{fontSize: '1.8vw', marginRight: '3%', ...styles.textBlue}}>BELOW</span>
          {value.rotateX < 90 ? 
            <div style={{transform: `rotateX(${value.rotateX}deg)`}}>
              <input 
                value={toLocaleString(downPrice)} 
                onChange={e => this.handlePrice(e, 'down')} 
                style={{...styles.textBlue, border: 0, outline: 0, width: '50%', textAlign:'center', borderBottom: '1px dashed black', fontSize: '2.0vw'}}/>
              <span style={{fontSize: '1.8vw', color: '#AAAAAA', marginLeft: 10}}>{downPercent}</span>
            </div> 
          : 
            <div style={{transform: `rotateX(${value.rotateX + 180}deg)`}}>
              <input 
                value={downPercent} 
                onChange={e => this.handlePercent(e, 'down')} 
                style={{...styles.textBlue, border: 0, outline: 0, width: '35%', textAlign:'center', borderBottom: '1px dashed black', fontSize: '2.0vw'}}/>
              <span style={{fontSize: '1.8vw', color: '#AAAAAA', marginLeft: 10}}>{toLocaleString(downPrice)}</span>
            </div> 
          }
          <FlatButton icon={<FontAwesome name="fas fa-retweet" />} style={{width: 50}} onClick={() => this.setState({showDownPrice: !showDownPrice})}/>
        </div>
      }
      </Motion> 
    );

    const controllBox = (
      <div
        style={{
          ...styles.controllBox, 
          width: shrink ? '100%' : '35vw',
          height: shrink ? 200 : '100%',
        }}>
        <div style={{height: '20vh', width:'100%', display:'flex', flexDirection:'row', marginBottom:20}}>
          <div style={{height:'100%', width:'30%', display:'flex', flexDirection:'column', justifyContent:'center',}}>
            <img src={getHeaderImg(name)} style={{width: '60%'}} />
            <span style={{fontSize: '1.6vw'}}>{translate2Origin(name)}</span>
            <span style={{fotnSize: '1.4vw', color:'gray'}}>{name}</span>
          </div>
          <div id="box" style={{width:'100%', display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
            {
              coin2Exchange[name].map(entry => {
                return (
                  <FlatButton style={{flex: 1, height: '100%'}} onClick={() => this.handleCoinClick(entry, name)}>
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <img src={getExchangeImg(entry)} style={{width:'6vmin', opacity: entry === exchange ? 1 : .3}}/>
                    </div>
                  </FlatButton>
                )
              })
            }
          </div>
        </div>
        <span style={{fontSize: '1.4vw', color: margin > 0 ? RED : BLUE}}>{toLocaleString(coinData[exchange][name].currentPrice)} 원</span>
        <span style={{fontSize: '1vw', color: margin > 0 ? RED : BLUE}}>{delta}</span>
        <div style={{flex: 1, width:'100%', paddingTop: '10vh', display:'flex', flexDirection:'column'}}>
          <span style={{fontSize: '2.4vw', display:'flex', fontFamily: 'Raleway', fontWeight:'100'}}>I Wanna get Message</span>
          <div style={{fontSize: '2.8vw', display:'flex', alignItems:'center', fontFamily:'Raleway'}}>
            <span style={{fontSize: '2.4vw'}}>If the price of</span>
            <img src={getHeaderImg(name)} style={{height:'3.5vmin', marginLeft: 10, marginRight: 10}} />
            <span>is</span>
          </div>
          {upPriceForm}
          {downPriceForm}
        </div>
        <div style={{height: 80, display:'flex', alignItems:'center', justifyContent:'flex-end', marginRight: 15}}>
          <FlatButton label="reset" primary onClick={() => this.handleCoinClick(exchange, name)}/>
          <FlatButton label="submit" secondary onClick={this.handleSubmit}/>
        </div>
      </div>
    );

    const width = window.innerWidth*0.60;

    const entries = Object.keys(this.filterData(coin2Exchange)).map(coin => 
      <CoinEntry 
        key={coin} 
        name={coin} 
        style={{
          display:'flex',
          position:'relative',
          flexDirection:'column',
          width: shrink ? '28vw' : width < 880 ? (width-100)/3 : width < 1100 ? (width-100)/4 : (width-100)/5,
          height: 125,
          alignItems:'center',
          justifyContent:'center',
          fontFamily:'Raleway',
          cursor: 'pointer',
          margin: 10,
        }} 
        onClick={() => this.handleCoinClick(coin2Exchange[coin][0], coin)}/>
    );

    const coinSelectBox = (
      <div style={{...styles.coinSelectBox, marginLeft: 10, marginRight: 10, justifySelf:'center', display:'flex', alignItems:'center', flexDirection:'column', flex: 1, overflowX:'hidden', backgroundImage: `url(${require('../../assets/images/autumn.jpg')})`, backgroundSize:'cover', backgroundPosition:'center'}}>
        <div id='wrapper' style={{display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap', justifySelf:'center'}}>
          {entries}
        </div>
      </div>
    )

    return(
      <div style={{height: '100%', display:'flex', flexDirection: shrink ? 'column' : 'row', fontFamily:'Roboto', overflowX: 'hidden'}}>
        {controllBox}
        {coinSelectBox}
      </div>
    );
  }
}

const styles = {
  controllBox: {
    display:'flex',
    flexDirection:'column',
    marginLeft:'2%'
  },

  coinSelectBox: {
    display:'flex',
    alignItems:'center',
    justifyContent:'center,'
  },

  textRed: {
    color: '#C62828'
  },

  textBlue: {
    color: '#3F51B5'
  },
}

const mapStateToProps = (state) => {
  return {
    coinData: state.coinReducer.coinData,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCoin: coinData => dispatch(actions.setCoin(coinData)),
    setNav: nav => dispatch(actions.setNav(nav))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConsolePushAdd))
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

import { 
  Price,
  ControllBox, 
  CoinSelectBox,
  CBHeader,
  CBBody,
  CBForm,
  FormWrapper, 
  FormDescriptor, 
  Form, 
  Translation } from './components';

const DEFAULT_DELTA = 5;
const MAX_DELTA = 15;

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
    
    var upPrice = parseInt(currentPrice * (1 + DEFAULT_DELTA/100), 10);
    var downPrice = parseInt(currentPrice * (1 - DEFAULT_DELTA/100), 10);

    this.setState({exchange, name, currentPrice, upPrice, downPrice, upPercent: DEFAULT_DELTA+'%', downPercent: -DEFAULT_DELTA+'%'});
  }

  getPercent = (price) => {
    var { currentPrice } = this.state;
    var delta = price - currentPrice;

    return parseFloat((delta/currentPrice * 100).toFixed(2)) + '%';
  }

  getPrice = (percent) => {
    var { currentPrice } = this.state;
    
    return parseInt((1 + parseFloat(percent)/100)*currentPrice, 10);
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

  componentDidMount(){
    const { state } = this.props.location;
    const exchange = state ? state.exchange : 'bithumb';
    const name = state ? state.name : 'BTC';
    axios.get("https://api.coinkat.tk/reverseAll")
    .then(response => {
      this.setState({coin2Exchange: response.data});
      this.handleCoinClick(exchange, name);
      this.setState({isLoading: false})
    })
  }

  render(){
    const { shrink, coinData } = this.props;
    const { isLoading, exchange, name, currentPrice, upPrice, downPrice, coin2Exchange, showUpPrice, showDownPrice, upPercent, downPercent } = this.state;
    if(!coin2Exchange || isLoading) return <span></span>

    const { margin, percent, delta } = parseDelta(coinData[exchange][name].currentPrice, coinData[exchange][name].openPrice);

    const upPriceForm = (
      <Motion style={{rotateX: spring(showUpPrice ? 0 : 180)}}>
      {value => 
        <FormWrapper>
          <FormDescriptor red>OVER</FormDescriptor>
          {value.rotateX < 90 ? 
            <div style={{flex: 1, transform: `rotateX(${value.rotateX}deg)`}}>
              <Form red price value={toLocaleString(upPrice)} onChange={e => this.handlePrice(e, 'up')}/>
              <Translation >{upPercent}</Translation>
            </div> 
          : 
            <div style={{flex: 1,transform: `rotateX(${value.rotateX + 180}deg)`}}>
              <Form red percent value={upPercent} onChange={e => this.handlePercent(e, 'up')} style={{width: '30%'}}/>
              <Translation >{toLocaleString(upPrice)} 원</Translation>
            </div> 
          }
          <FlatButton icon={<FontAwesome name="fas fa-retweet" />} style={{minWidth: 0, width: shrink ? 40 : 80}} onClick={() => this.setState({showUpPrice: !showUpPrice})}/>
        </FormWrapper>
      }
      </Motion>  
    );
    const downPriceForm = (
      <Motion style={{rotateX: spring(showDownPrice ? 0 : 180)}}>
      {value => 
        <FormWrapper>
          <FormDescriptor blue>BELOW</FormDescriptor>
          {value.rotateX < 90 ? 
            <div style={{flex: 1, transform: `rotateX(${value.rotateX}deg)`}}>
              <Form blue price value={toLocaleString(downPrice)} onChange={e => this.handlePrice(e, 'down')}/>
              <Translation>{downPercent}</Translation>
            </div> 
          : 
            <div style={{flex: 1, transform: `rotateX(${value.rotateX + 180}deg)`}}>
              <Form blue percent value={downPercent} onChange={e => this.handlePercent(e, 'down')} style={{width: '30%'}}/>
              <Translation>{toLocaleString(downPrice)} 원</Translation>
            </div>
          }
          <FlatButton icon={<FontAwesome name="fas fa-retweet" />} style={{minWidth: 0, width: shrink ? 40 : 80}} onClick={() => this.setState({showDownPrice: !showDownPrice})}/>
        </FormWrapper>
      }
      </Motion> 
    );

    const controllBox = (
      <ControllBox shrink={shrink}>
        <CBHeader>
          <div style={{height:'100%', width:'30%', display:'flex', flexDirection:'column', justifyContent:'center',}}>
            <div style={{width:'60%', display:'flex', alignItems:'center'}}>
              <img src={getHeaderImg(name)} style={{width:'7vmin', minWidth: 30}} />
            </div>
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
        </CBHeader>
        <CBBody>
          <Price red={margin>0} blue={margin<0} fontSize={shrink ? '2rem' : '2rem'}>
            {toLocaleString(coinData[exchange][name].currentPrice)} 원<br/>
            <span style={{fontSize: '1.5rem'}}>{delta}</span>
          </Price>
          {!shrink &&
            <div style={{flex: 1, width:'100%', paddingTop: '10vh', display:'flex', flexDirection:'column', justifyContent:'flex-end', marginBottom: 20}}>
              <span style={{fontSize: '2.4vw', display:'flex', fontFamily: 'Raleway', fontWeight:'100'}}>I Wanna get Message</span>
              <div style={{fontSize: '2.8vw', display:'flex', alignItems:'center', fontFamily:'Raleway'}}>
                <span style={{fontSize: '2.4vw'}}>If the price of</span>
                <img src={getHeaderImg(name)} style={{height:'3.5vmin', marginLeft: 10, marginRight: 10}} />
                <span>is</span>
              </div>
            </div>
          }
        </CBBody>
        <div style={{marginBottom: 20,}}>{upPriceForm}</div>
        <div>{downPriceForm}</div>
        <div style={{height: 80, display:'flex', alignItems:'center', justifyContent:'flex-end', marginRight: 15}}>
          <FlatButton label="reset" primary onClick={() => this.handleCoinClick(exchange, name)}/>
          <FlatButton label="submit" secondary onClick={this.handleSubmit}/>
        </div>
      </ControllBox>
    );

    const shrinkControllBox = (
      <ControllBox shrink={true}>
        <div style={{width:'100%', display:'flex', alignItems:'center', marginTop: 10, marginLeft: 10}}>
          <div style={{display:'flex', marginRight: 10, alignItems:'center'}}>
            <img src={getHeaderImg(name)} style={{width:'7vmin', minWidth: 30}} />
          </div>
          <span style={{fotnSize: '1.4vw', color:'gray', marginRight: 10}}>{name}</span>
          <Price red={margin>0} blue={margin<0} fontSize='14px'>
            {toLocaleString(coinData[exchange][name].currentPrice)} 원<br/>
            <span style={{fontSize: 12}}>{delta}</span>
          </Price>
        </div>
        <div id="box" style={{width:'100%', height: 50, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
          {
            coin2Exchange[name].map(entry => {
              return (
                <FlatButton style={{minWidth: 0, flex: 1, height: '100%'}} onClick={() => this.handleCoinClick(entry, name)}>
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <img src={getExchangeImg(entry)} style={{width:'6vmin', opacity: entry === exchange ? 1 : .3}}/>
                  </div>
                </FlatButton>
              )
            })
          }
        </div>
        <div style={{width:'90%', display:'flex', justifyContent:'center', flexDirection:'column'}}>
          {upPriceForm}
          {downPriceForm}
        </div>
      </ControllBox>
    )

    console.log(this.filterData(coin2Exchange));

    const width = window.innerWidth*0.60;
    const coinCards = Object.keys(this.filterData(coin2Exchange)).map(coin => {
      return {
        name: coin,
        onClick: () => this.handleCoinClick(coin2Exchange[coin][0], coin)
      }
    })

    const coinBoard = (
      <Components.CoinBoard cards={coinCards} width={width} price={false}/>
    )

    const coinSelectBox = (
      <CoinSelectBox>
        <div id='wrapper' style={{height: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap', justifySelf:'center'}}>
          {coinBoard}
        </div>
      </CoinSelectBox>
    )

    return(
      <div style={{height: '100%', display:'flex', flexDirection: shrink ? 'column' : 'row', fontFamily:'Roboto', overflowX: 'hidden'}}>
        {shrink ? shrinkControllBox : controllBox}
        {coinSelectBox}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    coinData: state.coinReducer.coinData,
  };
}

export default withRouter(connect(mapStateToProps, null)(ConsolePushAdd))
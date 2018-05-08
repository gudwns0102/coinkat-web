import React from 'react'

import Paper from 'material-ui/Paper';
import { withRouter } from 'react-router';
import { getHeaderImg, translate2Origin, toLocaleString, parseDelta } from '../../lib';

import * as actions from '../../actions';
import { connect } from 'react-redux';

import Parse from 'parse';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import { Motion, spring } from 'react-motion';

import FontAwesome from 'react-fontawesome';

class CoinBoardDetail extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      isLoadingPush: true,
      push: null,
      progressEnter: false,
      mouseX: 0,
    }
  }

  async componentDidMount(){
    const { exchange, name } = this.props.match.params;
    const user = Parse.User.current();
    const query = new Parse.Query(Parse.Object.extend("Push"));
    query.equalTo("parent", user);
    query.equalTo("exchange", exchange);
    query.equalTo("name", name);
    const push = await query.first();

    this.setState({isLoadingPush: false, push});
    console.log(push);
  }

  render(){
    const { isLoadingPush, push } = this.state;
    const { history, match, coinData } = this.props;
    const { exchange, name } = match.params;
    var { currentPrice, openPrice } = coinData[exchange][name];
    currentPrice = Number(currentPrice);
    openPrice = Number(openPrice);
    
    const { margin, percent, delta } = parseDelta(currentPrice, openPrice);
    const textStyle = margin > 0 ? styles.textColorRed : margin < 0 ? styles.textColorBlue : {}; 

    const progressBar = () => {
      if(isLoadingPush){ 
        return <CircularProgress />
      } else if (!push){
        console.log(push);
        return <RaisedButton label="Regist New Push" style={{width:'100%', color:'white'}} labelStyle={{color:'white', fontFamily:'Raleway'}} backgroundColor='#4DB6AC'/>
      } else {
        var upPrice = push.get("upPrice");
        var downPrice = push.get("downPrice");
        var range = upPrice - downPrice;
        var currentPercent = parseFloat(((currentPrice - downPrice)/range*100).toFixed(2));
        var popup = (
          this.state.progressEnter &&
          <Paper zDepth={2} style={{display:'flex', flexDirection:'column', padding: 20, position: 'absolute', top: 40, left: this.state.mouseX, fontFamily:'Raleway', fontSize: 13}}>
            <span>Lower bound: <span style={{fontWeight: 'bold'}}>{toLocaleString(downPrice)} 원</span></span>
            <span>Upper bound: <span style={{fontWeight: 'bold'}}>{toLocaleString(upPrice)} 원</span></span>
            <span>Currnet Price(%): <span style={{fontWeight: 'bold'}}>{currentPercent}%</span></span>
          </Paper>
        )

        return [<FontAwesome name='fal fa-bell' style={{color:'black'}} size={35} style={{marginRight: 20}}/>, popup, 
          <Motion defaultStyle={{x: 0}} style={{x: spring(currentPercent)}}>
            {value => 
              <svg style={{flex: 1, height:60}}> 
                <line x1="0" x2={`${value.x}%`} y1="30" y2="30" stroke="#7C4DFF" stroke-width="5" />
                <line x1={`${value.x}%`} x2="100%" y1="30" y2="30" stroke="#e6e6fa" stroke-width="5" />
              </svg>
            }
          </Motion>]
      }
    }; 

    return(
      <div style={styles.container}>
        <Paper 
          style={{width:'95%', height: '90%'}}
          zDepth={5}>
          <div style={styles.header}>
            <div style={{flex: 1, display: 'flex', alignItems:'center'}}>
              <Motion defaultStyle={{rotateY: 0}} style={{rotateY: spring(360)}}>
                {value => <img src={getHeaderImg(name)} alt={name} style={{...styles.logo, transform: `rotateY(${value.rotateY}deg)`}} />}
              </Motion>
              <span style={styles.originName}>{translate2Origin(name)}</span>
              <span style={styles.name}>{name}</span>
              <div style={styles.priceWrapper}>
                <span style={{...styles.price, ...textStyle}}>{toLocaleString(currentPrice)} 원</span>
                <span style={{...styles.delta, ...textStyle}}>{delta}</span>
              </div>
            </div>
            <div style={styles.progressWrapper} 
              className="progress-section" 
              onMouseEnter={e => this.setState({progressEnter: true})}
              onMouseMove={e => this.setState({mouseX: e.pageX-e.currentTarget.offsetLeft})}
              onMouseLeave={e => this.setState({progressEnter: false})}>
              {progressBar()}
            </div>
          </div>
          <div style={styles.content}>
          </div>
        </Paper>        
      </div>
    );
  }
}

const styles = {
  container:{
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    height:'100%',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  },

  header: {
    display:'flex',
    alignItems:'center',
    fontFamily:'Raleway',
    paddingTop: 20,
    paddingLeft: 10,    
  },

  logo: {
    width: 50,
  },

  originName: {
    fontSize: 18,
    marginLeft: 10,
  },

  name: {
    fontSize: 15,
    color: 'gray',
    marginLeft: 8,
  },

  priceWrapper: {
    flex: 1,
    display:'flex',
    alignItems:'center',
    justifyContent:'flex-end',
    marginLeft: 20,
    fontFamily: 'Quicksand'
  },

  progressWrapper: {
    position:'relative',
    flex: 1,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    marginLeft: 20, marginRight: 20,

  },


  price: {
    fontSize: 25,
  },

  delta: {},
  
  textColorRed: {
    color: '#C62828'
  },

  textColorBlue: {
    color: '#3949AB'
  },

  content: {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    flex: 1,
  }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CoinBoardDetail));
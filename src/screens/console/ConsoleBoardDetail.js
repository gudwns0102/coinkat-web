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
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  flex-direction: column;

  padding-left: calc(10px + 1vw);
  padding-right: calc(10px + 1vw);
  padding-top: calc(10px + 1vh);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  backgronud-color: yellow;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  align-itmes: center;
`

const Profile = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
`

const Price = styled.div`
  display: flex;
  flex: ${props => props.shrink ? 1 : null};
  font-size: calc(12px + 1.0vw);
  margin-left: calc(10px + 0.6vw);
  color: ${props => props.red ? '#C62828' : props.blue ? '#283593' : 'black'};
`

const Push = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  height: 80px;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
`

class CoinBoardDetail extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      isLoadingPush: true,
      push: null,
      progressEnter: false,
      mouseX: 0,
      mouseY: 0,
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
  }

  render(){
    const { isLoadingPush, push } = this.state;
    const { history, match, coinData, shrink } = this.props;
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
        return (
          <RaisedButton 
            label="Regist New Push" 
            style={{width:'60%', color:'white'}} 
            labelStyle={{color:'white', fontFamily:'Raleway', fontSize: 'calc(6px + 0.6vw)'}} 
            backgroundColor='#4DB6AC'
            onClick={() => history.push({pathname: `/console/push/add`, state: {exchange, name}})}/>
        )
      } else {
        var upPrice = push.get("upPrice");
        var downPrice = push.get("downPrice");
        var range = upPrice - downPrice;
        var currentPercent = parseFloat(((currentPrice - downPrice)/range*100).toFixed(2));
        var popup = (
          this.state.progressEnter &&
          <Paper zDepth={2} style={{width: 220, height: 100, display:'flex', flexDirection:'column', padding: 20, position: 'absolute', top: 'calc(5px + 50%)', left: this.state.mouseX, fontFamily:'Raleway', fontSize: 13, alignItems:'center', justifyContent:'center'}}>
            <span>Lower bound: <span style={{fontWeight: 'bold'}}>{toLocaleString(downPrice)} 원</span></span>
            <span>Upper bound: <span style={{fontWeight: 'bold'}}>{toLocaleString(upPrice)} 원</span></span>
            <span>Currnet Price(%): <span style={{fontWeight: 'bold'}}>{currentPercent}%</span></span>
          </Paper>
        )

        return [popup, 
          <Motion defaultStyle={{x: 0}} style={{x: spring(currentPercent)}}>
            {value => 
              <svg style={{width: '100%', height:60}}> 
                <defs>
                  <linearGradient id="e" x1="0%" y1="0" x2={`100%`} y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color={`${value.x < 50 ? '#283593' : '#FFEBEE'}`} />
                    <stop offset="100%" stop-color={`${value.x < 50 ? '#E8EAF6' : '#C62828'}`} />
                  </linearGradient>
                </defs>
                <line x1="0" x2={`${value.x}%`} y1="30" y2="30" stroke="url(#e)" stroke-width="10" />
                <line x1={`${value.x}%`} x2="100%" y1="30" y2="30" stroke="#e6e6fa" stroke-width="10" />
              </svg>
            }
          </Motion>]
      }
    };

    return (
      <Container>
        <Header>
          <Profile>
            <Motion defaultStyle={{rotateY: 0}} style={{rotateY: spring(360)}}>
              {value => <img src={getHeaderImg(name)} alt={name} style={{...styles.logo, transform: `rotateY(${value.rotateY}deg)`}} />}
            </Motion>
            <span style={{marginLeft: 'calc(10px + 0.6vw)'}}>
              <span style={{fontSize: 'calc(12px + 1.0vw)'}}>{translate2Origin(name)}</span><br/>
              <span style={{fontSize: 'calc(10px + 0.6vw)', color: 'gray'}}>{name}</span>
            </span>
          </Profile>
          <Price shrink={shrink} red={margin>0} blue={margin<0}>
            <span>{toLocaleString(currentPrice)} 원 {shrink && <br/>}
            <span style={{fontSize: 'calc(8px + 0.7vw)'}}>{delta}</span></span>  
          </Price>
          {!shrink &&
            <Push 
              onMouseEnter={e => this.setState({progressEnter: true})}
              onMouseMove={e => this.setState({mouseX: Math.min(e.currentTarget.clientWidth - 220, e.pageX-e.currentTarget.offsetLeft)})}
              onMouseLeave={e => this.setState({progressEnter: false})}>
              {progressBar()}
            </Push>
          }
        </Header>
        {shrink && 
          <Push
            onMouseEnter={e => this.setState({progressEnter: true})}
            onMouseMove={e => this.setState({mouseX: Math.min(e.currentTarget.clientWidth - 220, e.pageX-e.currentTarget.offsetLeft)})}
            onMouseLeave={e => this.setState({progressEnter: false})}>
            {progressBar()}
          </Push>
        }
      </Container>
    )
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
    flex: 1,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
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
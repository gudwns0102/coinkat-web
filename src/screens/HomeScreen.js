import React from 'react'
import Parse from 'parse';
import RaisedButton from 'material-ui/RaisedButton';
import * as Components from '../components';
import { Motion, spring } from 'react-motion';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'

class HomeScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      user: null,
      isYoffsetZero: true,
    }
  }

  handleScroll = (e) => {
    var { isYoffsetZero } = this.state;
    var Yoffset = window.scrollY;

    if(isYoffsetZero === true && Yoffset > 0){
      this.setState({isYoffsetZero: false})
    } else if(isYoffsetZero === false && Yoffset == 0){
      this.setState({isYoffsetZero: true})
    }
  }

  async componentWillMount(){
    const user = await Parse.User.current();
    this.setState({user});
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.handleScroll);
  }

  render(){
    const { user, isYoffsetZero } = this.state;

    const headerButtons = user ? (
      <div>
        <span style={{fontFamily:'Raleway', color:'white', marginRight: 10}}>Welcome, {user.get("name")}!</span>
        <RaisedButton label="Go to console" primary={true} onClick={() => this.props.history.push('/console')}/>
      </div> 
    ) : <RaisedButton label="Sign in" primary={true} style={{marginRight: 10}} onClick={() => this.props.history.push('/login')}/>;


    const stickyHeader = {
      position:'fixed',
      top: 0,
      width:'100%', 
      height: 80, 
      display:'flex', 
      alignItems:'center', 
      boxShadow: '0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28)', 
      zIndex: 1000,
    }

    return (
      <div style={styles.container} onscroll={console.log}>
        <div style={styles.header}>
          <Motion style={{rgb: spring(isYoffsetZero ? 0 : 255), opacity: spring(isYoffsetZero ? .5 : 1)}}>
            {value => 
              <div style={isYoffsetZero ? {...styles.headerBar, backgroundColor: `rgba(${value.rgb},${value.rgb},${value.rgb},${value.opacity})`} : {...stickyHeader, backgroundColor: `rgba(${value.rgb},${value.rgb},${value.rgb},${value.opacity})`}} >
                <a href="/">
                <img src={isYoffsetZero ? require('../assets/images/logo-white.png') : require('../assets/images/logo.png')} alt='Logo' style={styles.headerLogo}/>
                </a>
                <div style={styles.headerButtons}>
                  {headerButtons}
                </div>
              </div>
            }
          </Motion>
          <div style={styles.headerContent}>
            <p style={styles.headerContentBody}>
              <span style={{fontSize: 60}}>CoinKat</span> is practice of React.js
            </p>
            <p style={styles.headerContentSmallBody}>
              It has been a long time to meet you, CoinKat!<br/>
              Happy to see you again on Web Platform,<br/>
              I've gotten along with React-Native!<br/>
              Now, I can handle html tags as much as salt on my shelf.<br/>
            </p>
          </div>
        </div>
        <Components.Intro1 coinData={this.props.coinData} style={{width:'100%', height: 600, display:'flex', alignItems:'center'}}/>
        <Components.Intro2 coinData={this.props.coinData} style={{width:'100%', height: 600, display:'flex', alignItems:'center'}}/>
        <Components.Intro3 style={{width:'100%', height: 600, display:'flex', alignItems:'center'}} scrollY={this.state.scrollY}/>
        <Components.Footer />
      </div>
    ) 
  }
}

const styles = {
  container: {
    width:'100%',
    height:'100%',
    fontFamily: 'Quicksand',
  },

  header: {
    width:'100%',
    height: 600,
    backgroundImage: `url(${require('../assets/images/header1.jpg')})`,
    backgroundColor: 'rgba(255,255,255,0.3)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'lighten',
  },

  headerBar: {
    width:'100%', 
    height: 80, 
    display:'flex', 
    alignItems:'center', 
  },

  headerLogo: {
    width: 100,
    height: 100,
  },

  headerButtons: {
    display:'flex', 
    flex: 1, 
    justifyContent:'flex-end', 
    marginRight: 20
  },

  headerContent: {
    paddingTop: 50,
    paddingLeft: 30,
    color:'white',
  },

  headerContentBody: {
    fontSize: 25,
  },

  headerContentSmallBody: {
    fontSize: 18,
    fontWeight:'100',
    lineHeight: 2,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeScreen))
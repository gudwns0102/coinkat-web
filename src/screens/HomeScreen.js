import React from 'react'
import * as Components from '../components';

import { connect } from 'react-redux';
import * as actions from '../actions';

import { withRouter } from 'react-router'
//import Slider from "react-slick";
import RaisedButton from 'material-ui/RaisedButton';

import Parse from 'parse';
class HomeScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      user: null
    }
  }

  async componentWillMount(){
    const user = await Parse.User.current();
    this.setState({user});
  }

  render(){
    const { user } = this.state;

    const headerButtons = user ? 
      <div>Welcome {user.get("name")} <RaisedButton label="Go to console" primary={true} onClick={() => this.props.history.push('/console')}/></div> : 
      <RaisedButton label="Sign in" primary={true} style={{marginRight: 10}} onClick={() => this.props.history.push('/login')}/>;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.headerBar}>
            <a href="/">
            <img src={require('../assets/images/logo-white.png')} alt='Logo' style={styles.headerLogo}/>
            </a>
            <div style={styles.headerButtons}>
              {headerButtons}
            </div>
          </div>
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
        <Components.Intro2 style={{width:'100%', height: 600, display:'flex', alignItems:'center'}}/>
        <Components.Intro3 style={{width:'100%', height: 600, display:'flex', alignItems:'center'}}/>

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
    backgroundColor:'rgba(0,0,0,0.5)'
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
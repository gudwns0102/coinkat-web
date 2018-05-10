import React from 'react'
import { Motion, spring } from 'react-motion';
import FlatButton from 'material-ui/FlatButton';
import Parse from 'parse';
import { withRouter } from 'react-router';
import { Coincard } from '../../components';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import AnimatedNumber from 'react-animated-number';
import axios from 'axios';
import { toLocaleString } from '../../lib';
import './HomeHeader.css';

const STICKY_HEADER_OFFSET_Y = 80

class HomeHeader extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      user: null,
      sticky: false,
      rotating: 0,
      index: 0,

      exchanges: 0,
      coins: 0,
      pushes: 0,
    }

    this.names = ['js', 'react', 'aws-ec2', 'redux']

    setInterval(() => {
      var { index, rotating } = this.state;
      if(rotating === 0){
        this.setState({rotating: rotating + 180, index: (index+1)%4});
      } else {
        this.setState({rotating: rotating + 180})
      }
    }, 2000);
  }

  handleStickyHeader = (e) => {
    const { sticky } = this.state,
      y_offset = window.scrollY;
    
    if(y_offset > STICKY_HEADER_OFFSET_Y && !sticky){
      this.setState({sticky: true})
    } else if (y_offset < STICKY_HEADER_OFFSET_Y && sticky){
      this.setState({sticky: false})
    }
  }

  componentDidMount(){
    var user = Parse.User.current();
    this.setState({user});
    console.log(user);
    window.addEventListener('scroll', this.handleStickyHeader);
    
    var coinData = this.props.coinData;
    this.setState({exchanges: Object.keys(coinData).length});

    axios.get("https://api.coinkat.tk/reverseAll")
    .then(response => {
      this.setState({coins: Object.keys(response.data).length})
    })

    this.setState({pushes: 1000});
  }

  render(){
    const { history, coinData } = this.props;
    const { user, sticky, rotating, index } = this.state;
    const navBarAuthButton = !user ? (
      <div style={styles.navBarAuthButton}>
        <FlatButton 
          label="Sign in"
          labelStyle={{height: '100%', color: 'white'}}
          backgroundColor={sticky ? '#303F9F' : 'transparent'}
          style={{marginRight: '2vh'}}
          onClick={() => history.push('/login')}/>
        <FlatButton
          label="Sign up"
          labelStyle={{height: '100%', color: 'white'}}
          backgroundColor={sticky ? '#C2185B' : 'transparent'}
          style={{marginRight: '2vh'}}
          onClick={() => history.push('/login')}/>
      </div>
    ) : (
      <div style={styles.navBarAuthButton}>
        <FlatButton
          label={<span>GO To <span style={{fontWeight:'bold'}}>Console</span></span>}
          labelStyle={{height: '100%', color: 'white'}}
          backgroundColor={sticky ? '#C2185B' : 'transparent'}
          onClick={() => history.push('/console/board')}
          style={{marginRight: '2vh'}} />
      </div>
    ) 

    const navBar = (
      <Motion style={{rgb: spring(sticky ? 255 : 0), opacity: spring(sticky ? 1 : 0.3)}}>
      {value => 
        <div 
          style={{
            ...styles.navBar, 
            backgroundColor: `rgba(${value.rgb},${value.rgb},${value.rgb},${value.opacity}`, 
            position: sticky ? 'fixed' : 'absolute',
            boxShadow: '0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28)', 
          }}>
          <a href="/">
            <img 
              src={sticky ? require('../../assets/images/logo.png') : require('../../assets/images/logo-white.png')}
              style={styles.navLogo}
              alt='logo'/>
          </a>
          {navBarAuthButton}
        </div>
      }
      </Motion>
    )

    const logoAndReact = (
      <Motion style={{rotateY: rotating === 0 ? 0 : spring(rotating)}}>
      {value => {
        if(value.rotateY === 360){
          this.setState({rotating: 0});
        }

        return (
          <div style={{width: '10vh', height: '10vh', display:'flex', alignItems:'center', transform: `rotateY(${value.rotateY}deg)`}}>
            {Math.round(value.rotateY/180) % 2 === 0 ? 
              <img src={require('../../assets/images/logo-white.png')} style={{width:'100%'}} alt='logo'/> :
              <img src={require(`../../assets/images/${this.names[index]}.png`)} style={{width:'100%', transform: `rotateY(180deg)`}} alt='react' />
            }
          </div>
        )
      }}
      </Motion>
    )

    const exchangeSection = (
     
        <div style={{height: '100%', position:'relative', display:'flex', flexDirection:'column', alignItems:'center', }}>
          <span style={styles.sectionName}>
            EXCHANGES
          </span>
          <div style={{flex: 1, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize: '5vw'}}>{this.state.exchanges}</div>
        </div>
    );

    const coinSection = (
        <div style={{height: '100%', position:'relative', display:'flex', flexDirection:'column', alignItems:'center'}}>
          <span style={styles.sectionName}>
            # OF COINS
          </span>
          <div style={{flex: 1, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize: '5vw'}}>{this.state.coins}</div>          
        </div>
     
    );

    const pushSection = (
        <div style={{height: '100%', position:'relative', display:'flex', flexDirection:'column', alignItems:'center', }}>
          <span style={styles.sectionName}>
            HELP PEOPLE
          </span>
          <div style={{flex: 1, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize: '3vw'}}>{toLocaleString(this.state.pushes)}</div>          
        </div>
    );

    return(
      <div style={styles.container}>
        {navBar}
        <div style={{position:'absolute', top:'15vh', left: '8vh', display:'flex', alignItems:'center'}}>
          {logoAndReact}
          <span style={{marginLeft: '2vh', color:'white', fontFamily:'Raleway', fontSize: 35}}>Coinkat is powered <br/>by <span style={{fontFamily: 'Archivo Black'}}>React.js!</span></span>
        </div>
        <div style={styles.sectionWrapper}>
          <div className="exchange-section" style={{flex: 1, height:'100%'}}>
            {exchangeSection}
          </div>
          <div className="coin-section" style={{flex: 1, height:'100%'}}>
            {coinSection}
          </div>
          <div className="push-section" style={{flex: 1, height:'100%'}}>
            {pushSection}
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    position:'relative',
    display:'flex',
    flexDirection:'column',
    height: '100vh',
    backgroundImage: `url(${require('../../assets/images/homeheader.jpg')})`,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundBlendMode: 'lighten',
    backgroundAttachment:'fixed',
  },

  navBar: {
    display:'flex',
    flexDirection:'row',
    width:'100%',
    height: 70,
    alignItems:'center',
    top: 0,
    zIndex: 100,
  },


  navLogo: {
    marginLeft: 20,
    height:  60,
    marginTop: 5,
  },

  navBarAuthButton: {
    flex: 1, 
    display:'flex', 
    justifyContent:'flex-end'
  },

  logo: {
    width: 150,
  },

  sectionWrapper: {
    paddingTop: '50vh', 
    display:'flex', 
    alignItems:'center', 
    justifyContent:'space-around', 
    flex: 1
  },

  sectionName: {
    fontFamily:'Archivo Black',
    marginTop:'10%', 
    width:'60%', 
    borderLeft: '3px solid orange', 
    borderRight: '3px solid orange', 
    textAlign:'center',
    color: 'white', 
    fontSize: '2vw'
  },
}


const mapStateToProps = (state) => {
  return {
    coinData: state.coinReducer.coinData,
  };
}

export default withRouter(connect(mapStateToProps, null)(HomeHeader));
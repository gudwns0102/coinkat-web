import React from 'react'
import { Motion, spring } from 'react-motion';

class HomeSection2 extends React.Component {
  
  constructor(props){
    super(props);

    this.state = {
      letterMove: false,
      notiAppear: false,
    }
  }

  componentDidMount(){
    
    this.setState({letterMove: true}); // At t = 0
    setTimeout(() => {
      this.setState({letterMove: false, notiAppear: true}); // At t = 3000
      setTimeout(() => {
        this.setState({notiAppear: false});
      },1000);
    }, 1000);

    this.temp = setInterval(() => {
      this.setState({letterMove: true}); // At t = 0
      setTimeout(() => {
        this.setState({letterMove: false, notiAppear: true}); // At t = 3000
        setTimeout(() => {
          this.setState({notiAppear: false});
        },1000);
      }, 1000);
    }, 4000);
  }

  componentWillUnmount(){
    clearInterval(this.temp);
  }

  render(){
    const option = {
      stiffness: 180,
      damping: 50,
    }

    const letter = () => {
      const { letterMove } = this.state;
      if(letterMove){
        return (
          <Motion defaultStyle={{x: 30, opacity: 1}} style={{x: spring(50), opacity: spring(0, option)}}>
            {value => 
              <img src={require('../../assets/images/letter.png')} style={{position:'absolute', opacity: value.opacity, left: `${value.x}%`, top:'50%', height: 100, zIndex: 100}}/>
            }
          </Motion>
        )
      } else {
        return null
      }
    }

    const noti = (style) => {
      const { notiAppear } = this.state;
      return (
        <Motion style={{opacity: spring(notiAppear ? 1 : 0), marginBottom: spring(notiAppear ? 50 : 0), width: spring(notiAppear ? 80 : 0)}}>
          {value => 
            <img 
              src={require('../../assets/images/bell.png')} 
              style={{position:'absolute', opacity: value.opacity, marginBottom: value.marginBottom, width: value.width, ...style}} />
          }
        </Motion>
      );
    }

    return(
      <div style={{...styles.container, ...this.props.style,}}>
        <div style={styles.description}>
          <span><span style={{fontSize: '2.5vw', fontFamily:'Archivo Black'}}>CoinKat</span> is price-sensitive</span>
          <p>
            The price of CryptoCurrency changes every seconds<br/>
            CoinKat sends you a push notification if the price is out of range<br/>
          </p>
        </div>
        <div style={styles.imageWrapper}>
          <img src={require('../../assets/images/server.png')} alt='Intro3' style={{width:'30%'}}/>
          {letter()}
          <div style={{height:'100%', flex: 1, display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'space-around', marginRight:'10%'}}>
            <div style={{flex: 1, position:'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <img src={require('../../assets/images/web.png')} style={{height: 120}} />
              {noti({position: 'absolute', top: '25%', right: '-10%', zIndex: 50})}
            </div>
            <div style={{flex: 1, position:'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <img src={require('../../assets/images/mobile.png')} style={{height: 120}} />
              {noti({position: 'absolute', top: '25%', right: '-10%', zIndex: 50})}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container:{
    height:'100vh',
    display:'flex',
    alignItems:'center',
    fontFamily: 'Raleway',
  },

  description: {
    flex: 1,
    paddingLeft: '6%', 
  },

  imageWrapper: {
    position:'relative',
    width: '60%',
    display:'flex',
    alignItems:'center',
    height:'100%',
  }
}

export default HomeSection2;
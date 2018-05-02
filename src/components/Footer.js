import React from 'react'

class Footer extends React.Component {
  render(){
    return(
      <div style={{backgroundColor:'#393750', display:'flex', alignItems:'center', width:'100%', height: 300}}>
        <div style={{width: 500, height: 200, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <img src={require('../assets/images/logo-white.png')} style={{flex: 1, height: 200}} alt='Logo'/>
          <p style={{flex: 1.6, height: 200, paddingTop: 50, fontFamily: 'Raleway', fontSize: 15, color:'rgb(134,132,143)'}}>
            Try CoinKat to make your time. Everything you can imagine is implemented in our website. 
          </p>
        </div>
      </div>
    );
  }
}


export default Footer;
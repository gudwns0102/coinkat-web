import React from 'react'

class Intro3 extends React.Component {
  render(){
    return(
      <div style={{...styles.container, ...this.props.style,}}>
        <div style={styles.description}>
          <span><span style={{fontSize: 30, fontWeight:'bold'}}>CoinKat</span> is price-sensitive</span>
          <p>
            The price of CryptoCurrency changes every seconds<br/>
            CoinKat sends you a push notification if the price is out of range<br/>
          </p>
        </div>
        <div style={styles.imageWrapper}>
          <img src={require('../assets/images/intro3.jpg')} alt='Intro3' style={{width:'inherit', height: '100%'}} />
        </div>
      </div>
    );
  }
}

const styles = {
  container:{
    display:'flex',
    alignItems:'center',
    fontFamily: 'Raleway',
  },

  description: {
    flex: 1,
    paddingTop: 50,
    paddingLeft: 30, 
  },

  imageWrapper: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
    height:'100%',
  }
}

export default Intro3;
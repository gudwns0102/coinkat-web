import React from 'react'

class Header1 extends React.Component {
  render(){
    const style = this.props.style;
    return (
      <div style={{...styles.header, ...style}}>
        <div style={styles.headerContent}>
          <p style={styles.headerContentBody}>CoinKat is practice of React.js</p>
          <p style={styles.headerContentSmallBody}>
            It has been a long time to meet you, CoinKat!<br/>
            Happy to see you again on Web Platform,<br/>
            I've gotten along with React-Native!<br/>
            Now, I can handle html tags as much as salt on my shelf.<br/>
          </p>
        </div>
      </div>
    ) 
  }
}

const styles = {
  header: {
    display:'flex',
    flexDirection:'column',
    fontFamily: 'Raleway',
    backgroundImage: `url(${require('../assets/images/header1.jpg')})`,
    backgroundColor: 'rgba(255,255,255,0.3)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'lighten',
  },

  headerContent: {
    paddingTop: 50,
    paddingLeft: 30,
    opacity: 1,
  },

  headerContentTitle: {
    fontSize: 50,
    color: 'white',
    fontFamily: 'Quicksand',
    fontWeight: 'bold',
  },

  headerContentBody: {
    fontSize: 25,
    color: 'white',
  },

  headerContentSmallBody: {
    fontSize: 18,
    color: 'white',
    fontWeight:'100'
  }
}

export default Header1
import React from 'react'
import * as Components from '../components';

const Intro1 = ({style, coinData}) => {
  
  return (
    <div style={{...styles.container, ...style}}>
      <div style={styles.content}>
        <span><span style={{fontSize: 30, fontWeight: 'bold'}}>CoinKat</span> is Cryptocurrency App</span>
        <p>
          This web displays information about Cryptocurrency
        </p>
      </div>
      {coinData ? <Components.Board data={coinData} style={{width:'57%', height: 550, marginRight: 30, zIndex: 2}}/> : null}
    </div>
    ) 
}

const styles = {
  container: {
    display:'flex', 
    alignItems:'center',
    fontFamily: 'Raleway',
  },

  content: {
    flex: 1,
    paddingTop: 50,
    paddingLeft: 30,
  },
}

export default Intro1
import React from 'react'

const Intro2 = ({style, coinData}) => {
  return (
    <div style={{...styles.container, ...style}}>
      <div style={styles.content}>
        <span><span style={{fontSize: 30, fontWeight: 'bold'}}>CoinKat</span> give you a customizable board</span>
        <p>
          This web displays information about Cryptocurrency<br /> 
        </p>
      </div>
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

export default Intro2
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


  render(){
    return (
      <div style={styles.container}>
      </div>
    )
  }
}

const styles = {
  container: {
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    position:'relative',
    width:'100vw',
    height: '120vh',
    backgroundImage: `url(${require('../../assets/images/homesection.jpg')}`,
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'rgba(60,60,0,0.6)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'lighten',
    backgroundAttachment:'fixed',
  },
}

export default HomeSection2;
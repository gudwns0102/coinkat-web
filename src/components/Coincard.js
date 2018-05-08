import React from 'react'
import Paper from 'material-ui/Paper';
import { getHeaderImg, toLocaleString, translate2Origin } from '../lib';
import {Motion, spring} from 'react-motion';
import FontAwesome from 'react-fontawesome';

import { parseDelta } from '../lib';

class Coincard extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      isMouseOver: false,
    }
  }

  render(){
    var { data, style, onClick, push } = this.props;
    var { name, exchange, data } = data;
    
    var { currentPrice, openPrice } = data;

    currentPrice = Number(currentPrice);
    openPrice = Number(openPrice);
    
    const { margin, percent, delta } = parseDelta(currentPrice, openPrice);
    const textStyle = margin > 0 ? styles.textColorRed : margin < 0 ? styles.textColorBlue : {}; 

    const progress = () => {
      if(!push){
        return null;
      } else {
        var upPrice = push.get("upPrice");
        var downPrice = push.get("downPrice");
        var range = upPrice - downPrice;
        var currentPercent = parseFloat(((currentPrice - downPrice)/range*100).toFixed(2));
        return [<FontAwesome name="far fa-bell" color='gray' size={30} style={{marginRight: 10}}/>, (
          <Motion defaultStyle={{x: 0}} style={{x: spring(currentPercent)}}>
            {value => 
              <svg style={{flex: 1, height:'100%'}}>
                <line x1="0" x2={`${value.x}%`} y1="50%" y2="50%" stroke="#7C4DFF" stroke-width="5" />
                <line x1={`${value.x}%`} x2="100%" y1="50%" y2="50%" stroke="#e6e6fa" stroke-width="5" />
              </svg>
            }
          </Motion>
        )];
      }
    }

    return (
      <Paper
        className={exchange+'-'+name}
        style={{...styles.container,  ...style, }} 
        zDepth={this.state.isMouseOver ? 4 : 2} 
        onClick={() => onClick(name)} 
        onMouseOver={() => this.setState({isMouseOver: true})} 
        onMouseLeave={() => this.setState({isMouseOver: false})}
        draggable={true}>
        <img src={getHeaderImg(name)} style={{width: '15%', marginTop: '12%'}} />
        <span  style={styles.origin}>{translate2Origin(name)}</span>
        <span  style={styles.name}>{name}</span>
        <span  style={{...styles.price, ...textStyle}}>{toLocaleString(currentPrice)} ￦</span>
        <span  style={{...styles.delta, ...textStyle}}>{delta}</span>
        <div  style={styles.progressWrapper}>
          {progress()}
        </div>
      </Paper>
    )
  }
}

const styles = {
  container:{
    display:'flex',
    position:'relative',
    flexDirection:'column',
    width: 200,
    height: 320,
    alignItems:'center',
    backgroundColor:'white',
    fontFamily:'Raleway',
    margin: 15,
    cursor: 'pointer'
  },

  origin: {
    fontWeight: 'bold',
    marginTop: '2%'
  },

  name: {
    fontSize: 15,
    color: 'gray'
  },

  price: {
    marginTop: '30%',
    fontSize: 20,
  },

  delta: {
    marginTop: '5%',
    fontSize: 15,
  },

  exchange: {
    display:'flex',
    flex: 1,
    alignItems:'flex-end',
    paddingBottom: 10,
    position: 'relative',
  },

  progressWrapper: {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    flex: 1,
    width:'75%',
  },

  pushProgress: {
    width: '80%',
  },

  textColorRed: {
    color: '#C62828'
  },

  textColorBlue: {
    color: '#3949AB'
  },
}

export default Coincard;

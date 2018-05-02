import React from 'react'
import Paper from 'material-ui/Paper';
import { getHeaderImg, toLocaleString, translate2Origin } from '../lib';
import {Motion, spring} from 'react-motion';
import { Chart } from 'react-google-charts'

class Coincard extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      isMouseOver: false,
    }
  }

  render(){
    var { data, style, onClick } = this.props;
    var { name, exchange, data } = data;
    
    var { currentPrice, openPrice } = data;

    currentPrice = Number(currentPrice);
    openPrice = Number(openPrice);
    
    const margin = currentPrice - openPrice;
    const percent = Number((margin/openPrice*100).toFixed(2));
    const delta = margin > 0 ? `+${toLocaleString(margin)} (+${percent}%) ▲ ` : margin === 0 ? '0(0%)' : `${toLocaleString(margin)}(${percent}%) ▼ `;
    const textStyle = margin > 0 ? styles.textColorRed : margin < 0 ? styles.textColorBlue : {}; 

    return (
      <Paper 
        style={{...styles.container,  ...style, }} 
        zDepth={this.state.isMouseOver ? 4 : 2} 
        onClick={() => onClick(name)} 
        onMouseOver={() => this.setState({isMouseOver: true})} 
        onMouseLeave={() => this.setState({isMouseOver: false})}>
        <img src={getHeaderImg(name)} style={{width: '15%', marginTop: '12%'}} />
        <span style={styles.origin}>{translate2Origin(name)}</span>
        <span style={styles.name}>{name}</span>
        <span style={{...styles.price, ...textStyle}}>{toLocaleString(currentPrice)} ￦</span>
        <span style={{...styles.delta, ...textStyle}}>{delta}</span>
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

  textColorRed: {
    color: '#C62828'
  },

  textColorBlue: {
    color: '#3949AB'
  },
}

export default Coincard;

/*
<Chart
      style={{position: 'absolute', top:'50%', width: 30}}
        id='Hello'
          chartType="LineChart"
          data={[['time', 'price'], [0, 100], [1, 80], [2, 90], [3, 100], [4, 110], [5, 90]]}
          options={{
            smoothLine: true,
            vAxis: {
              gridlines: {
                color: 'transparent'
              },
              baselineColor: 'transparent',
              textPosition: 'none'
            },
            hAxis: {
              gridlines: {
                color: 'transparent'
              },
              baselineColor: 'transparent',
              textPosition: 'none'
            }
          }}
          graph_id="ScatterChart"
          width="100%"
          height="400px"
          legend_toggle
        />
*/
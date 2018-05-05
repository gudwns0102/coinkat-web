import React from 'react'

import Paper from 'material-ui/Paper';
import { Motion, spring } from 'react-motion';
import { withRouter } from 'react-router';
import { getHeaderImg, translate2Origin, toLocaleString } from '../../lib';
import { timeParse } from "d3-time-format";
import { tsvParse, csvParse } from 'd3-dsv';
import axios from 'axios';

import * as actions from '../../actions';
import { connect } from 'react-redux';

import ConsoleChart from './ConsoleChart';
import { TypeChooser } from "react-stockcharts/lib/helper";

import Chart from './Chart';
import { getData } from './utils';

class CoinBoardDetail extends React.Component {

  constructor(props){
    super(props);

  }

  componentDidMount() {
		getData().then(data => {
			this.setState({ data })
		})
	}


  render(){
    if(this.state == null){
      return <div>Loading...</div>
    }

    const { history, match, coinData } = this.props;
    const { exchange, name } = match.params;
    var { currentPrice, openPrice } = coinData[exchange][name];
    currentPrice = Number(currentPrice);
    openPrice = Number(openPrice);
    
    const margin = currentPrice - openPrice;
    const percent = Number((margin/openPrice*100).toFixed(2));
    const delta = margin > 0 ? `+${toLocaleString(margin)} (+${percent}%) ▲ ` : margin === 0 ? '0(0%)' : `${toLocaleString(margin)}(${percent}%) ▼ `;
    const textStyle = margin > 0 ? styles.textColorRed : margin < 0 ? styles.textColorBlue : {}; 

    console.log(this.state.data);

    return(
      <div style={styles.container}>
        <Paper 
          style={{width:'95%', height: '90%'}}
          zDepth={5}>
          <div style={styles.header}>
            <Motion defaultStyle={{rotateY: 0}} style={{rotateY: spring(360)}}>
              {value => <img src={getHeaderImg(name)} alt={name} style={{...styles.logo, transform: `rotateY(${value.rotateY}deg)`}} />}
            </Motion>
            <span style={styles.originName}>{translate2Origin(name)}</span>
            <span style={styles.name}>{name}</span>
            <div style={styles.priceWrapper}>
              <span style={{...styles.price, ...textStyle}}>{toLocaleString(currentPrice)} 원</span>
              <span style={{...styles.delta, ...textStyle}}>{delta}</span>
            </div>
          </div>
          <div style={styles.content}>
          <Chart type='svg' data={this.state.data} />
          </div>
        </Paper>        
      </div>
    );
  }
}

const styles = {
  container:{
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    height:'100%',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  },

  header: {
    display:'flex',
    alignItems:'center',
    fontFamily:'Raleway',
    paddingTop: 20,
    paddingLeft: 10,    
  },

  logo: {
    width: 50,
  },

  originName: {
    fontSize: 18,
    marginLeft: 10,
  },

  name: {
    fontSize: 15,
    color: 'gray',
    marginLeft: 8,
  },

  priceWrapper: {
    display:'flex',
    flex: 1,
    alignItems:'center',
    justifyContent:'flex-end',
    marginRight: 20,
    fontFamily: 'Quicksand'
  },

  price: {
    fontSize: 25,
  },

  delta: {},
  
  textColorRed: {
    color: '#C62828'
  },

  textColorBlue: {
    color: '#3949AB'
  },

  content: {
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    width:'100%',
    flex: 1,
  }
}

const mapStateToProps = (state) => {
  return {
    coinData: state.coinReducer.coinData,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setCoin: coinData => dispatch(actions.setCoin(coinData)),
    setNav: nav => dispatch(actions.setNav(nav))
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CoinBoardDetail));
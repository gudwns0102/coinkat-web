import React from 'react'
import Paper from 'material-ui/Paper';
import { getHeaderImg, toLocaleString, translate2Origin } from '../lib';
import {Motion, spring} from 'react-motion';
import FontAwesome from 'react-fontawesome';
import { parseDelta } from '../lib';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Header = styled.div`
  display: flex;
  flex: ${props => !props.price ? 1 : null};
  flex-direction: column;
  align-items: center;
  justify-content: ${props => !props.price ? 'center' : null};
  width: 100%;
  margin-top: ${props => props.price ? '12%' : 0};
`;

const Price = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  color: ${props => props.red ? '#C62828' : props.blue ? '#3949AB' : 'black'};
`;

const Push = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  width: 75%;
`;

class Coincard extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      isMouseOver: false,
    }
  }

  render(){
    const { name, exchange, data, style, onClick, push, price } = this.props;

    const header_section = (
      <Header>
        <img src={getHeaderImg(name)} style={{width: '15%'}} />
        <span style={styles.origin}>{translate2Origin(name)}</span>
        <span style={styles.name}>{name}</span>
      </Header>
    );

    const price_section = () => {
      
      if(!price || !data){
        return null;
      }

      let { currentPrice, openPrice } = data;
      currentPrice = Number(currentPrice);
      openPrice = Number(openPrice);
      const { margin, percent, delta } = parseDelta(currentPrice, openPrice);

      return (
        <Price red={margin>0} blue={margin<0}>
          <span style={{...styles.price}}>{toLocaleString(currentPrice)} ￦</span>
          <span style={{...styles.delta}}>{delta}</span>
        </Price>
      )
    }
    
    const push_section = () => {
      
      if(!price || !data){
        return null;
      } else if (!push){
        return <Push></Push>
      }
      
      let { currentPrice } = data;
      currentPrice = Number(currentPrice);
      const upPrice = push.get("upPrice");
      const downPrice = push.get("downPrice");
      const range = upPrice - downPrice;
      const currentPercent = parseFloat(((currentPrice - downPrice)/range*100).toFixed(2));

      return (
        <Push> 
          <FontAwesome name="far fa-bell" color='gray' size={30} style={{marginRight: 10}}/>
          <Motion defaultStyle={{x: 0}} style={{x: spring(currentPercent)}}>
            {value => 
              <svg style={{flex: 1, height: '100%'}}>
                <line x1="0" x2={`${value.x}%`} y1="50%" y2="50%" stroke="#7C4DFF" stroke-width="5" />
                <line x1={`${value.x}%`} x2="100%" y1="50%" y2="50%" stroke="#e6e6fa" stroke-width="5" />
              </svg>
            }
          </Motion>
        </Push>
      );
    }

    return (
      <Paper
        id={exchange+'-'+name}
        style={{...styles.container,  ...style, }} 
        zDepth={this.state.isMouseOver ? 4 : 2} 
        onClick={() => onClick(name)} 
        onMouseOver={() => this.setState({isMouseOver: true})} 
        onMouseLeave={() => this.setState({isMouseOver: false})}
        draggable={true}>
        {header_section}
        {price_section()}
        {push_section()}
      </Paper>
    )
  }
}

Coincard.propTypes = {
  exchange: PropTypes.string,
  name: PropTypes.string.isRequired,
  data: PropTypes.object,
  style: PropTypes.object,
  onClick: PropTypes.func,
  push: PropTypes.object,
  price: PropTypes.bool,
}

const styles = {
  container:{
    display:'flex',
    position:'relative',
    flexDirection:'column',
    height: 320,
    alignItems:'center',
    backgroundColor:'white',
    fontFamily:'Roboto',
    cursor: 'pointer',
    minWidth: 60,
    minHeight: 60*1.6,
  },

  origin: {
    fontSize: 'calc(8px + 0.65vw)',
    marginTop: '2%'
  },

  name: {
    fontSize: 'calc(6px + 0.4vw)',
    color: 'gray'
  },

  price: {
    marginTop: '15%',
    fontSize: 'calc(12px + 0.4vw)',
  },

  delta: {
    marginTop: '5%',
    fontSize: 'calc(10px + 0.4vw)',
  },
}

export default Coincard;

import React from 'react'
import { getHeaderImg, toLocaleString, translate2Origin } from '../lib';
import {Motion, spring} from 'react-motion';
import FontAwesome from 'react-fontawesome';
import FlatButton from 'material-ui/FlatButton';

class PushRow extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      isMouseOver: false,
    }
  }

  render(){
    var { exchange, name, upPrice, downPrice, createdAt, onClick, remove, pushId, style } = this.props;
    var { isMouseOver } = this.state;
    console.log(pushId);
    return (
      <div
        style={{...styles.container,  ...style, }} 
        zDepth={this.state.isMouseOver ? 2 : 2} 
        onMouseOver={() => this.setState({isMouseOver: true})} 
        onMouseLeave={() => this.setState({isMouseOver: false})}>
        <div style={{flex: 1, height:'100%', display:'flex', alignItems:'center'}}>
          <Motion style={{rotateY: isMouseOver ? spring(360) : 0}}>
          {value => 
            <img 
              src={getHeaderImg(name)}
              style={{height: '60%', cursor:'pointer', transform: `rotateY(${value.rotateY}deg)`}} 
              onClick={() => onClick(exchange, name)}
              alt={name}/>
          }
          </Motion>
          <span style={styles.name} onClick={() => onClick(exchange, name)}>{translate2Origin(name)}</span>
        </div>
        <span style={styles.price}>{toLocaleString(downPrice)} 원 ~ {toLocaleString(upPrice)} 원</span>
        <span style={styles.date}>{createdAt.toLocaleString()}</span>
        <FlatButton
          style={styles.trash}
          backgroundColor='#C62828'
          hoverColor="#EF5350"
          icon={<FontAwesome name="fas fa-trash" style={{color: 'white'}} size={30} />}
          onClick={() => remove(pushId)}
        />
      </div>
    )
  }
}

const styles = {
  container: {
    height: 80,
    display:'flex',
    alignItems:'center',
    fontFamily:'Quicksand',
    marginLeft: 10,
    marginRight: 10,
  },

  name: {
    flex: 1, 
    fontWeight:'bold', 
    marginLeft: 10,
    cursor:'pointer',
  },

  price: {
    flex: 1, 
    display:'flex', 
    justifyContent:'center',
  },

  date: {
    width:'15%', 
    display:'flex'
  },

  trash: {
    width:'5%'
  }
}

export default PushRow;

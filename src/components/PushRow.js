import React from 'react'
import Paper from 'material-ui/Paper';
import { getHeaderImg, toLocaleString, translate2Origin } from '../lib';
import {Motion, spring} from 'react-motion';

class PushRow extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      isMouseOver: false,
    }
  }

  render(){
    var { exchange, name, upPrice, downPrice, createdAt, onClick, style } = this.props;
    
    return (
      <div
        style={{...styles.container,  ...style, }} 
        zDepth={this.state.isMouseOver ? 2 : 2} 
        onMouseOver={() => this.setState({isMouseOver: true})} 
        onMouseLeave={() => this.setState({isMouseOver: false})}
        onClick={() => onClick(exchange, name)}>
        <img src={getHeaderImg(name)} style={{height: '60%'}} alt={name}/>
        <span style={{fontWeight:'bold', marginLeft: 10}}>{translate2Origin(name)}</span>
        <span style={{flex: 1, display:'flex', justifyContent:'center'}}>{toLocaleString(downPrice)} 원 ~ {toLocaleString(upPrice)} 원</span>
        <span style={{display:'flex'}}>{createdAt.toLocaleString()}</span>
      </div>
    )
  }
}

const styles = {
  container: {
    height: 80,
    display:'flex',
    alignItems:'center',
    fontFamily:'Raleway',
    marginLeft: 10,
    marginRight: 10,
  }
}

export default PushRow;

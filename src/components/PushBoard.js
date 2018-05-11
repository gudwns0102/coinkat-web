import React from 'react'
import Paper from 'material-ui/Paper';
import PushRow from './PushRow';
import FlatButton from 'material-ui/FlatButton';
import { getHeaderImg, translate2Origin } from '../lib';
import { Motion, spring } from 'react-motion';
import { RaisedButton } from 'material-ui';
import FontAwesome from 'react-fontawesome';

const COL_HEIGHT = '6vh'

class PushBoard extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      pushes: this.props.pushes,
      rotation: this.props.pushes.map(push => false),
      cryptoOrder: undefined,
      createdAt: undefined,
    }
  }

  handleRemove = (key) => {
    console.log(key);
    var { pushes } = this.state;
    var index = pushes.findIndex(push => push.id === key);
    
    if(index === -1){
      return ;
    }

    var push = pushes[index];

    push.destroy({
      success: push => {
        pushes.splice(index, 1);
        this.setState({pushes});
      },
      error: (push, err) => {
        alert("Network error occured!")
      }
    })
  }

  handleOnMouseOver = (index) => {
    var { rotation } = this.state;
    rotation[index] = true;
    this.setState({rotation});
  } 

  handleOnMouseLeave = (index) => {
    var { rotation } = this.state;
    rotation[index] = false;
    this.setState({rotation});
  }

  onHeaderClick = (header) => {
  }

  render(){
    const { style, onClick } = this.props;
    const { pushes } = this.state;

    var crypto_col = [
      <FlatButton label="COIN" style={{...styles.crypto}} labelStyle={{fontSize: 'calc(8px + 0.5vw)'}}/>
    ];

    var price_col = [
      <FlatButton label="PRICE" style={{...styles.price}} labelStyle={{fontSize: 'calc(8px + 0.5vw)'}}/>
    ]

    var created_col = [
      <FlatButton label="CREATED" style={{...styles.created}} labelStyle={{fontSize: 'calc(8px + 0.5vw)'}} />
    ]

    var trash_col = [
      <div style={{...styles.trash}}></div>
    ]

    var pushRows = pushes.map((push, index) => {
      var exchange = push.get("exchange");
      var name = push.get("name");
      var upPrice = push.get("upPrice");
      var downPrice = push.get("downPrice");
      var createdAt = push.createdAt;
      var objectId = push.id;

      crypto_col.push(
        <div 
          onMouseOver={() => this.handleOnMouseOver(index)} 
          onMouseLeave={() => this.handleOnMouseLeave(index)}
          style={{...styles.crypto, display:'flex', alignItems:'center'}}>
          <div style={{width: '30%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Motion style={{rotateY: this.state.rotation[index] ? spring(360) : 0}}>
              {value =>              
                <img src={getHeaderImg(name)} style={{width:'calc(6px + 3vmin)', transform: `rotateY(${value.rotateY}deg)`}}/>
              }
            </Motion>
          </div>
          <span style={{fontFamily:'Roboto', fontSize: 'calc(10px + 0.6vw)'}}>{translate2Origin(name)}</span>
        </div>
      );

      price_col.push(
        <div style={{...styles.price, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <span style={{fontSize: '1.6vmin'}}><span>{downPrice}원</span> ~ <span>{upPrice}원</span></span>
        </div>
      )

      created_col.push(
        <div style={{...styles.created, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <span style={{fontSize: '1.6vmin', width:'100%', textAlign:'center'}}>{createdAt.toLocaleString()}</span>
        </div>
      )

      trash_col.push(
        <div style={{...styles.trash, display:'flex', justifyContent:'space-around', alignItems:'center'}}>
          <RaisedButton
            style={{width:'40%'}} 
            icon={<FontAwesome name="fas fa-recycle" />}
            primary
          />
          <RaisedButton
            style={{width:'40%'}} 
            icon={<FontAwesome name="far fa-trash" />}
            secondary
            onClick={() => this.handleRemove(objectId)}
          />
        </div>
      )

      return ( 
        <PushRow 
          exchange={exchange} 
          name={name} 
          upPrice={upPrice} 
          downPrice={downPrice} 
          createdAt={createdAt} 
          onClick={onClick} 
          pushId={objectId}
          key={index}
          remove={this.handleRemove}/>
      );
    })

    return (
      <Paper zDepth={2} style={{...styles.container, ...style}}>
        <div style={{display:'flex', flexDirection:'column', flex: 0.8}}>
          {crypto_col}
        </div>
        <div style={{display:'flex', flexDirection:'column', flex: 2}}>
          {price_col}
        </div>
        <div style={{display:'flex', flexDirection:'column', flex: 1}}>
          {created_col}
        </div>
        <div style={{display:'flex', flexDirection:'column', flex: 1}}>
          {trash_col}
        </div>
      </Paper>
    )

    return (
      <Paper
        zDepth={2}
        style={{...styles.container, ...style}}>
        <div style={styles.header}>
          <FlatButton label="CRYPTOCURRENCY" style={{flex: 1, textAlign:'center', fontWeight:'bold'}}/>
          <FlatButton label="Target Price" style={{flex: 1, textAlign:'center', fontWeight:'bold'}}/>
          <FlatButton label="Created Time" style={{flex: 1, textAlign:'center', fontWeight:'bold'}}/>
          <span style={{width:'5%', height:'100%'}}></span>
        </div>
        {pushRows}
      </Paper>
    )
  }
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display:'flex',

  },

  header: {
    display:'flex',
    height: 40, 
    alignItems:'center', 
    borderBottom:'0.5px solid gray', 
    fontFamily:'Quicksand',
    marginLeft: 10,
    marginRight: 10,
  },

  crypto: {
    flex: 0.8,
    height: COL_HEIGHT,
  },

  price: {
    flex: 2,
    height: COL_HEIGHT
  },

  created: {
    flex: 1,
    height: COL_HEIGHT
  },

  trash: {
    flex: 1,
    height: COL_HEIGHT
  }

}

export default PushBoard;

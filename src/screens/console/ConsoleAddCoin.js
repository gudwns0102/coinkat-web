import React from 'react';

import * as Components from '../../components';

import * as actions from '../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import axios from 'axios';
import Paper from 'material-ui/Paper';

import Parse from 'parse';

import { getExchangeImg, getHeaderImg, toLocaleString, translate2Origin } from '../../lib';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

class CoinEntry extends React.Component{
  
  constructor(props){
    super(props);

    this.state = {
      isMouseOver: false,
    }
  }
  render(){
    const { name, style } = this.props;
    const { isMouseOver  } = this.state;

    return (
      <Paper 
        style={{...style, cursor: 'pointer'}} 
        zDepth={this.state.isMouseOver ? 4 : 2} 
        onClick={this.props.onClick}
        onMouseOver={() => this.setState({isMouseOver: true})}
        onMouseLeave={() => this.setState({isMouseOver: false})}>
        <img src={getHeaderImg(name)} style={{width: '15%', marginTop: '12%'}} />
        <span>{translate2Origin(name)}</span>
        <span>{name}</span>
      </Paper>
    );
  }
}

class ConsoleAddCoin extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      isLoadingData: true,
      coin2exchange: null,
      dialogOpen: false,
      selectedCoin: null,
    }
  }

  handleOpen = (name) => {
    this.setState({dialogOpen: true, selectedCoin: name});
  };

  handleClose = () => {
    this.setState({dialogOpen: false, selectedCoin: null});
  };

  handleAdd = (exchange, name) => {
    const { history } = this.props;
    const user = Parse.User.current();
    const boardData = user.get("board");
    var index = boardData.findIndex(entry => entry.exchange == exchange && entry.name == name)
    if(index == -1){
      boardData.push({exchange, name});
      user.set("board", boardData);
      user.save()
      .then(result => {
        console.log('success');
        history.push('/console/board');
      })
      .catch(err => {
        console.log(err);
      })
    } else {
      console.log('already existed')
    }
  }

  async componentDidMount(){
    var { data } = await axios.get('https://13.125.101.187:3000/reverseAll');
    
    this.setState({isLoadingData: false, coin2exchange: data})
  }

  render(){
    const { isLoadingData, coin2exchange, dialogOpen, selectedCoin } = this.state;

    if(isLoadingData){
      return (
        <div>Loading...</div>
      );
    }

    var exchangeList = selectedCoin ? coin2exchange[selectedCoin] : [];
    var exchangeButtons = exchangeList.map(exchange => 
      <FlatButton
        onClick={() => this.handleAdd(exchange, selectedCoin)}
        style={{flex: 1, height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
        <div><img src={getExchangeImg(exchange)} style={{width:'30%'}}/></div>
        <span>{exchange.toUpperCase()}</span>
      </FlatButton>
    )

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];

    const dialog = (
      <Dialog
        actions={actions}
        open={dialogOpen}>
        <div style={{height: 500, display:'flex'}}>
          {exchangeButtons}
        </div>
      </Dialog>
    );

    const entries = Object.keys(coin2exchange).map(coin => 
      <CoinEntry 
        key={coin} 
        name={coin} 
        style={styles.entryStyle} 
        onClick={() => this.handleOpen(coin)}/>
    )

    return(
      <div style={styles.container}>
        {entries}
        {dialog}
      </div>
    );
  }
}

const styles = {
  container:{
    display:'flex',
    flexWrap: 'wrap', 
  },

  entryStyle: {
    display:'flex',
    position:'relative',
    flexDirection:'column',
    width: 200,
    height: 320,
    alignItems:'center',
    justifyContent:'center',
    fontFamily:'Raleway',
    margin: 15,
    cursor: 'pointer'
  },

  radioButton: {
    marginTop: 16,
    width:'100%',
    height: 50,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConsoleAddCoin))

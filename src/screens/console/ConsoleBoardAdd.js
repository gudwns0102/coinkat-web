import React from 'react';

import * as actions from '../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import axios from 'axios';
import Paper from 'material-ui/Paper';

import Parse from 'parse';

import { getExchangeImg, getHeaderImg, translate2Origin } from '../../lib';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';

import TextField from 'material-ui/TextField';

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
        zDepth={isMouseOver ? 4 : 2} 
        onClick={this.props.onClick}
        onMouseOver={() => this.setState({isMouseOver: true})}
        onMouseLeave={() => this.setState({isMouseOver: false})}>
        <img src={getHeaderImg(name)} alt={name} style={{width: '15%', marginTop: '2%'}} />
        <span style={{fontWeight:'bold'}}>{translate2Origin(name)}</span>
        <span style={{fontSize: 15, color:'gray'}}>{name}</span>
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
      queryText: '',
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
    const query = new Parse.Query(Parse.Object.extend("Board"));
    query.equalTo("parent", user);
    query.first({
      success: board => {
        var boardData = board.get("data");
        var index = boardData.findIndex(entry => entry.exchange === exchange && entry.name === name)
        if(index === -1){
          boardData.push({exchange, name});
          board.set("data", boardData);
          board.save(null , {
            success: board => history.push('/console/board'),
            error: (board, err) => history.push('/console/board'),
          })
        } else {
          alert('already existed');
          this.handleClose();
        }      
      },
      error: (obj, err) => alert("Failed..."),
    })
  }

  filterData = (data) => {
    var result = {};
    var queryText = this.state.queryText.toLowerCase()
    
    if(queryText === ''){
      return data;
    }

    for(var name in data){
      var origin = translate2Origin(name) || '';
      if(name.toLowerCase().includes(queryText) || origin.toLowerCase().includes(queryText)){
        result[name] = data[name];
      }
    }

    return result;
  }

  async componentDidMount(){
    var { data } = await axios.get('https://api.coinkat.tk/reverseAll');
    this.setState({isLoadingData: false, coin2exchange: data});
    
  }

  render(){
    const { isLoadingData, coin2exchange, dialogOpen, selectedCoin } = this.state;

    if(isLoadingData){
      return (
        <div style={{...styles.container, alignItems:'center', justifyContent:'center'}}>
          <CircularProgress />
        </div>
      );
    }

    const queryField = (
      <div style={{width:'100%', }}>
        <TextField
          floatingLabelText='Find Your Coin'
          floatingLabelFixed={true}
          value={this.state.queryText}
          onChange={(e, queryText) => this.setState({queryText})}
          style={{width: 200, margin: 15}}/>
      </div>
    );

    const entries = Object.keys(this.filterData(coin2exchange)).map(coin => 
      <CoinEntry 
        key={coin} 
        name={coin} 
        style={styles.entryStyle} 
        onClick={() => this.handleOpen(coin)}/>
    );

    var exchangeList = selectedCoin ? coin2exchange[selectedCoin] : [];
    var exchangeButtons = exchangeList.map(exchange => 
      <FlatButton
        onClick={() => this.handleAdd(exchange, selectedCoin)}
        style={{flex: 1, height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
        <div><img src={getExchangeImg(exchange)} alt={exchange} style={{width:'30%'}}/></div>
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

    return(
      <div style={styles.container}>
        {queryField}
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
    justifyContent:'space-around'
  },

  entryStyle: {
    display:'flex',
    position:'relative',
    flexDirection:'column',
    width: 200,
    height: 125,
    alignItems:'center',
    justifyContent:'center',
    fontFamily:'Raleway',
    margin: 15,
    cursor: 'pointer'
  },
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

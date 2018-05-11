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
import { Coincard } from '../../components';
import styled from 'styled-components';
import { CoinBoard } from '../../components';

const Container = styled.div`
  width: 100%;
  display: flex;
  padding-top: 10px;
  background-image: url(${require('../../assets/images/board.png')}), linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0)); 
  background-size: cover; 
  background-position: center;
  background-blend-mode: lighten;
  overflow-x: hidden;
`

const BoardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

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
    this.setState({coin2exchange: data});
  }

  render(){
    const { coin2exchange, dialogOpen, selectedCoin } = this.state;

    if(!coin2exchange){
      return <div></div>
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

    const consoleContent = document.getElementById('console-content');
    const width = consoleContent ? consoleContent.clientWidth : document.getElementById('console-content')

    const coinCards = Object.keys(this.filterData(coin2exchange)).map(coin => {
      return {
        name: coin,
        onClick: () => this.handleOpen(coin),
      }
    });

    const coinBoard = (
      <CoinBoard cards={coinCards} width={width} price={false} />
    )

    return(
      <div style={{height:'100%', display: 'flex'}}>
        <Container>
          <BoardWrapper>
            {queryField}
            {coinBoard}
            {dialog}
          </BoardWrapper>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    coinData: state.coinReducer.coinData,
  };
}

export default withRouter(connect(mapStateToProps, null)(ConsoleAddCoin))

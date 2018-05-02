import React from 'react'
import * as Components from '../../components';
import { Chart } from 'react-google-charts'; 

import * as actions from '../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Parse from 'parse';

class ConsoleBoard extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoadingData: true,
      boardData: null
    }
  }

  componentDidMount(){
    const user = Parse.User.current();
    const boardData = user.get("board");

    this.setState({isLoadingData: false, boardData});
  }

  render(){
    const { history, match, coinData } = this.props;
    const { isLoadingData, boardData } = this.state;

    if(isLoadingData){
      return <div>Loading...</div>
    }

    const entries = boardData.map(entry => {
      const { exchange, name } = entry;
      const data = {
        exchange,
        name,
        data: coinData[exchange][name]
      }
      return (
        <Components.Coincard data={data} style={styles.card} onClick={(name) => history.push(`${match.url}/${name}`)}/>
      )
    })

    const data = {
      name: 'BTC',
      exchange: 'coinone',
      data: {
        currentPrice: 10188000,
        openPrice: 10010000,
      }
    }
    
    return(
      <div id='console-board' style={styles.container}>
        {entries}
      </div>
    );
  }
}

const styles = {
  container:{
    display:'flex',
    flexWrap: 'wrap', 
  },

  card: {
    width:200,
    height: 320,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConsoleBoard))
import React from 'react'
import * as Components from '../../components';
import { Chart } from 'react-google-charts'; 

import * as actions from '../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Parse from 'parse';
import arrayMove from 'array-move';

import Paper from 'material-ui/Paper';

import FontAwesome from 'react-fontawesome';
import { Motion,spring } from 'react-motion';

class ConsoleBoard extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoadingData: true,
      board: null,
      boardData: null,
      pushMap: null,
      dragItemIndex: null,
      willDeleted: false,
    }
  }

  async componentDidMount(){
    const pushMap = {}

    const user = Parse.User.current();

    const Board = Parse.Object.extend("Board");
    const Push = Parse.Object.extend("Push")
    
    const boardQuery = new Parse.Query(Board);
    const pushQuery = new Parse.Query(Push);
    
    pushQuery.equalTo("parent", user);
    boardQuery.equalTo("parent", user);
    
    var board = await boardQuery.first();
    var pushes = await pushQuery.find();

    pushes.map(push => {
      var exchange = push.get("exchange");
      var name = push.get("name");
      var key = exchange + "-" + name;
      pushMap[key] = push;
    })

    if(!board){
      const new_board = new Board({parent: user, data: [{exchange: 'bithumb', name: 'BTC'}]});
      new_board.save(null, {
        success: board => this.setState({isLoadingData: false, board, pushMap}),
        error: (board, err) => alert('Failed to creating your board... Please press F5'),
      })
    } else {
      this.setState({isLoadingData: false, board, pushMap})
    }
  
    window.addEventListener('dragstart', this.handleDragStart)
    window.addEventListener('dragenter', this.handleDrag)
    window.addEventListener('dragend', this.handleDragEnd)
  }

  componentWillUnmount(){
    
    window.removeEventListener('dragstart', this.handleDragStart)
    window.removeEventListener('dragenter', this.handleDrag)
    window.removeEventListener('dragend', this.handleDragEnd)
  }

  handleDragStart = e => {
    const boardData = this.state.board.get("data");
    var id = e.target.className.split('-');
    var exchange = id[0];
    var name = id[1];

    var index = boardData.findIndex(entry => entry.exchange === exchange && entry.name === name);
    this.setState({dragItemIndex: index, boardData});
  }

  handleDrag = e => {
    var { board, dragItemIndex } = this.state;
    var parent = e.target.closest('[class]');

    if(parent){
      var className = parent.className;
      console.log(className);
      if(className.includes('trash-button')){
        return this.setState({willDeleted: true});
      } else {
        var boardData = board.get("data");
        var exchange = className.split('-')[0];
        var name = className.split('-')[1];
        var index = boardData.findIndex(entry => entry.exchange === exchange && entry.name === name);
        
        boardData = arrayMove(boardData, dragItemIndex, index);
        board.set("data", boardData);
        this.setState({dragItemIndex: index, board, willDeleted: false});
      }
    } else {
      this.setState({willDeleted: false});
    }
  }

  handleDragEnd = (e) => {
    var { board } = this.state;
    var boardData = board.get("data");

    if(this.state.willDeleted){
      boardData.splice(this.state.dragItemIndex, 1);
    }

    board.set("data", boardData);
    board.save(null, {  
      success: board => this.setState({board, dragItemIndex: null, willDeleted: false, boardData: null}),
      error: (board, err) => alert("Your board change is not applied in server..."), 
    });
  }

  render(){
    const { history, match, coinData } = this.props;
    const { isLoadingData, board, pushMap } = this.state;

    if(isLoadingData){
      return <div>Loading...</div>
    }

    var boardData = board.get("data");

    const entries = boardData.map(entry => {
      const { exchange, name } = entry;
      const data = {
        exchange,
        name,
        data: coinData[exchange][name]
      }
      return (
        <Components.Coincard data={data} style={styles.card} push={pushMap[exchange+"-"+name]} onClick={name => history.push(`${match.url}/${exchange}/${name}`)}/>
      )
    })

    const springOption = {stiffness: 180, damping: 17}
    const trash = (
      <Motion 
        style={{
          opacity: spring(this.state.dragItemIndex != null ? 1 : 0, springOption), 
          active: spring(this.state.willDeleted ? 1 : 0, springOption),
          radius: spring(this.state.willDeleted ? 35: 25, springOption),
        }}>
        {value => 
          <Paper 
            className='trash-button' zDepth={5} style={{position: 'fixed', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 10000, bottom : 30, right: 30, width: value.radius*2, height: value.radius*2, borderRadius: value.radius, opacity: value.opacity, backgroundColor: `rgba(244, 67, 54, ${value.active})`}}>
            <FontAwesome className='trash-button' name='trash' size={25} />
          </Paper>
        }
      </Motion>
    )
    
    return(
      <div style={styles.container}>
        {entries}
        {trash}
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
import React from 'react'
import * as Components from '../../components';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Parse from 'parse';
import arrayMove from 'array-move';
import Paper from 'material-ui/Paper';
import FontAwesome from 'react-fontawesome';
import { Motion,spring } from 'react-motion';
import styled from 'styled-components';
import { CoinBoard } from '../../components';

const Container = styled.div`
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
    var id = e.target.id.split('-');
    var exchange = id[0];
    var name = id[1];

    var index = boardData.findIndex(entry => entry.exchange === exchange && entry.name === name);
    this.setState({dragItemIndex: index, boardData});
  }

  handleDrag = e => {
    var { board, dragItemIndex } = this.state;
    var parent = e.target.closest('[id]');
    
    if(parent){
      var className = parent.id;
      /*if(className.includes('trash-button')){
        return this.setState({willDeleted: true});
      } else {*/
        
        var boardData = board.get("data");
        var exchange = className.split('-')[0];
        var name = className.split('-')[1];
        var index = boardData.findIndex(entry => entry.exchange === exchange && entry.name === name);
        
        if(index === -1){
          this.setState({willDeleted: false});
          return ;
        }
        
        boardData = arrayMove(boardData, dragItemIndex, index);
        board.set("data", boardData);
        this.setState({dragItemIndex: index, board, willDeleted: false});
      //}
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
    const { history, match, coinData, shrink } = this.props;
    const { isLoadingData, board, pushMap } = this.state;

    if(isLoadingData){
      return <div>Loading...</div>
    }

    const boardData = board.get("data");
    const width = document.getElementById('console-content').clientWidth;
    const card_count = parseInt(width/220, 10);
    const card_width = width < 660 ? (width-80)/3 : (width-20*card_count-20)/card_count;
    const style = {
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10 ,
      width: card_width,
      height: card_width*1.6
    }

    const coinCards = [];

    const entries = boardData.map(entry => {
      const { exchange, name } = entry;
      coinCards.push({
        exchange,
        name,
        data: coinData[exchange][name],
        price: true,
        push: pushMap[exchange+"-"+name],
        onClick: name => history.push(`${match.url}/${exchange}/${name}`)
      })

      return (
        <Components.Coincard
          exchange={exchange}
          name={name}
          data={coinData[exchange][name]} 
          style={style} 
          price
          push={pushMap[exchange+"-"+name]}
          onClick={name => history.push(`${match.url}/${exchange}/${name}`)}/>
      )
    })

    const coinBoard =(
      <CoinBoard style={style} width={width} cards={coinCards} price/>
    )

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
            id="trash-button" className='trash-button' zDepth={5} style={{position: 'fixed', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 10000, bottom : 30, right: 30, width: value.radius*2, height: value.radius*2, borderRadius: value.radius, opacity: value.opacity, backgroundColor: `rgba(244, 67, 54, ${value.active})`}}>
            <FontAwesome className='trash-button' name='trash' size={25} />
          </Paper>
        }
      </Motion>
    )

    return(
      <div style={{height: '100%', display:'flex'}}>
        <Container>
          {coinBoard}
          {trash}
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

export default withRouter(connect(mapStateToProps, null)(ConsoleBoard))
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
      boardData: null,
      dragItemIndex: null,
      willDeleted: false,
    }
  }

  componentDidMount(){
    const user = Parse.User.current();
    const boardData = user.get("board");

    this.setState({isLoadingData: false, boardData});

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
    const { boardData } = this.state;
    var id = e.target.className.split('-');
    var exchange = id[0];
    var name = id[1];

    var index = boardData.findIndex(entry => entry.exchange === exchange && entry.name === name);
    this.setState({dragItemIndex: index});
  }

  handleDrag = e => {
    console.log(e.target.className)
    if(e.target.className.includes('trash-button')){
      console.log(e);
      this.setState({willDeleted: true})
      return;
    } else {
      this.setState({willDeleted: false})
    }

    var { boardData, dragItemIndex } = this.state;
    var id = e.target.className.split('-');
    var exchange = id[0];
    var name = id[1];
    var index = boardData.findIndex(entry => entry.exchange === exchange && entry.name === name);
    
    if(index === -1){

      return;
    }

    boardData = arrayMove(boardData, dragItemIndex, index);
    this.setState({dragItemIndex: index, boardData});
  }

  handleDragEnd = (e) => {
    var { boardData } = this.state;
    var user = Parse.User.current();
    if(this.state.willDeleted){
      boardData.splice(this.state.dragItemIndex, 1);
    }
    user.set("board", boardData);
    user.save();
    this.setState({boardData, dragItemIndex: null, willDeleted: false})
  }

  render(){
    const { history, match, coinData } = this.props;
    const { isLoadingData, boardData } = this.state;

    if(isLoadingData){
      return <div>Loading...</div>
    }

    const entries = (boardData || []).map(entry => {
      const { exchange, name } = entry;
      const data = {
        exchange,
        name,
        data: coinData[exchange][name]
      }
      return (
        <Components.Coincard data={data} style={styles.card} onClick={(name) => history.push(`${match.url}/${exchange}/${name}`)}/>
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
            className='trash-button' zDepth={5} style={{position: 'fixed', display:'flex', alignItems:'center', justifyContent:'center', zIndex: 10000, bottom : 30, right: 30, width: value.radius*2, height: value.radius*2, borderRadius: value.radius, opacity: value.opacity, backgroundColor: `rgba(244, 67, 54, ${value.active})`}}
            onDrop={() => console.log('hi')}>
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
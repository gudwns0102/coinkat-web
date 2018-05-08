import React from 'react'
import Paper from 'material-ui/Paper';
import { getHeaderImg, toLocaleString, translate2Origin } from '../lib';
import PushRow from './PushRow';

class PushBoard extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      pushes: this.props.pushes,
    }
  }

  render(){
    const { style, onClick } = this.props;
    const { pushes } = this.state;

    var pushRows = pushes.map(push => {
      var exchange = push.get("exchange");
      var name = push.get("name");
      var upPrice = push.get("upPrice");
      var downPrice = push.get("downPrice");
      var createdAt = push.createdAt;

      return <PushRow exchange={exchange} name={name} upPrice={upPrice} downPrice={downPrice} createdAt={createdAt} onClick={onClick}/>
    })

    return (
      <Paper
        zDepth={2}
        style={{...styles.container, ...style}}
      >
        {pushRows}
      </Paper>
    )
  }
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
  }
}

export default PushBoard;

import React from 'react'

import FlatButton from 'material-ui/FlatButton';
import { withRouter, Route, Link } from 'react-router'; 
import * as Components from '../../components';
import FontAwesome from 'react-fontawesome';

class ConsoleMenu extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      boardSelected: false,
      pushSelected: false,
    }
  }

  handleMenuClick = (parentMenu) => {
    var val = this.state[parentMenu];
    var temp = {};
    temp[parentMenu] = !val;
    this.setState(temp);
  }

  render(){
    const { history, match, style } = this.props;
    const { boardSelected, pushSelected } = this.state;

    const boardSubMenu = [
      <Components.MenuChild title='MY BOARD' style={styles.menuItem} onClick={() => history.push(`${match.url}/board`)}/>,
      <Components.MenuChild title='ADD NEW COIN' style={styles.menuItem} onClick={() => history.push(`${match.url}/board/add`)}/>
    ]
    
    const pushSubMenu = [
      <Components.MenuChild title='MY Push' style={styles.menuItem} onClick={() => history.push(`${match.url}/push`)}/>
    ]

    return(
      <div style={{...styles.menuBar, ...style}}>
        <Components.MenuParent title='BOARD' style={styles.menuItem} onClick={() => this.handleMenuClick('boardSelected')}/>
        {boardSelected ? boardSubMenu : null}      
        <Components.MenuParent title='PUSH' style={styles.menuItem} onClick={() => this.handleMenuClick('pushSelected')}/>
        {pushSelected ? pushSubMenu : null}
      </div>
    );
  }
}

const styles = {
  container:{
    width:'100%',
    flex: 1,
  }
}

export default withRouter(ConsoleMenu)
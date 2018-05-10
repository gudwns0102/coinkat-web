import React from 'react'

import FlatButton from 'material-ui/FlatButton';
import { withRouter, Route, Link } from 'react-router'; 
import * as Components from '../../components';
import FontAwesome from 'react-fontawesome';

const MIN_MENU_WIDTH = 140;

class ConsoleMenu extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      boardSelected: false,
      pushSelected: false,
      optionSelected: false,
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
    const { boardSelected, pushSelected, optionSelected } = this.state;
    
    const boardSubMenu = [
      <Components.MenuChild
        title={<span style={{fontSize: '0.8vw'}}>MY BOARD</span>}
        icon={<FontAwesome style={{marginLeft: '6%', marginRight: '6%', fontSize: '1.2vw'}} name='fas fa-th' color='white'/>} 
        style={styles.menuItem} 
        onClick={() => history.push(`${match.url}/board`)}/>,
      <Components.MenuChild
        title={<span style={{fontSize: '0.8vw'}}>ADD NEW COIN</span>}
        icon={<FontAwesome style={{marginLeft: '6%', marginRight: '6%', fontSize: '1.2vw'}} name='fas fa-plus-circle' color='white'/>} 
        style={styles.menuItem} 
        onClick={() => history.push(`${match.url}/board/add`)}/>,
    ]
    
    const pushSubMenu = [
      <Components.MenuChild
        title={<span style={{fontSize: '0.8vw'}}>MY PUSHES</span>}
        icon={<FontAwesome style={{marginLeft: '6%', marginRight: '6%', fontSize: '1.2vw'}} name='fas fa-bell' color='white'/>} 
        style={styles.menuItem} 
        onClick={() => history.push(`${match.url}/push`)}/>,
      <Components.MenuChild
        title={<span style={{fontSize: '0.8vw'}}>REGISTER NEW PUSH</span>}
        icon={<FontAwesome style={{marginLeft: '6%', marginRight: '6%', fontSize: '1.2vw'}} name='fas fa-plus-circle' color='white'/>} 
        style={styles.menuItem} 
        onClick={() => history.push(`${match.url}/push/add`)}/>,
    ]

    const optionMenu = []

    return(
      <div id="menu-bar" style={{...styles.menuBar, ...style}}>
        <Components.MenuParent title='BOARD' style={styles.menuItem} onClick={() => this.handleMenuClick('boardSelected')}/>
        {boardSelected ? boardSubMenu : null}      
        <Components.MenuParent title='PUSH' style={styles.menuItem} onClick={() => this.handleMenuClick('pushSelected')}/>
        {pushSelected ? pushSubMenu : null}
        <Components.MenuParent title='OPTION' style={styles.menuItem} onClick={() => this.handleMenuClick('optionSelected')}/>
        {optionSelected ? optionMenu : null}
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
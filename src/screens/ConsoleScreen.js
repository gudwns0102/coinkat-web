import React from 'react'

import Parse from 'parse';
import FlatButton from 'material-ui/FlatButton';
import { withRouter, Route, Link } from 'react-router'; 
import * as Components from '../components';
import * as Screens from './';
import * as Consoles from './console';
import FontAwesome from 'react-fontawesome';

class ConsoleScreen extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoadingData: true,
    }
  }

  async componentDidMount(){
    const user = await Parse.User.current(); 
    if(!user){
      this.props.history.replace('/login');
    } else {
      this.setState({isLoadingData: false});
    }
  }

  render(){
    const { history, match } = this.props;
    const { isLoadingData } = this.state;

    if(isLoadingData){
      return <div>Check your ID</div>
    }

    return(
      <div style={styles.container}>
        <Consoles.ConsoleMenu style={styles.menuSection}/>
        <div style={styles.content}>
          <Route exact path={`${match.url}/board`} component={Consoles.ConsoleBoard}/>
          <Route exact path={`${match.url}/board/add`} component={Consoles.ConsoleAddCoin} />
          <Route exact path={`${match.url}/push`} component={Consoles.ConsolePush}/>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display:'flex',
    height: '100%',
  },

  menuSection: {
    display: 'flex',
    flex: 1,
    flexDirection:'column',
    backgroundColor: '#393750',
  },


  content: {
    flex: 5,
    overflow:'scroll',
  }
}

export default withRouter(ConsoleScreen);
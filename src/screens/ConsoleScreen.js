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
      <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column'}}>
        <Consoles.ConsoleHeader />
        <div style={styles.container}>
          <Consoles.ConsoleMenu style={styles.menuSection}/>
          <div style={styles.content}>
            <Route exact path={`${match.url}/board`} component={Consoles.ConsoleBoard}/>
            <Route exact path={`${match.url}/board/add`} component={Consoles.ConsoleBoardAdd} />
            <Route exact path={`${match.url}/board/:exchange/:name`} component={Consoles.ConsoleBoardDetail} />
            <Route exact path={`${match.url}/push`} component={Consoles.ConsolePush}/>
            <Route exact path={`${match.url}/push/add`} component={Consoles.ConsolePushAdd}/>
          </div>
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
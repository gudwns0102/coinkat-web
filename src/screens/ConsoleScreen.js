import React from 'react'

import Parse from 'parse';
import FlatButton from 'material-ui/FlatButton';
import { withRouter, Route, Link } from 'react-router'; 
import * as Components from '../components';
import * as Screens from './';
import * as Consoles from './console';
import FontAwesome from 'react-fontawesome';

const MIN_WINDOW_WIDTH = 800;

class ConsoleScreen extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      isLoadingData: true,
      shrinkLayout: false,
    }
  }

  handleResize = (e) => {
    var { shrinkLayout } = this.state;
    var width = window.innerWidth;
    if(width < MIN_WINDOW_WIDTH && !shrinkLayout){
      this.setState({shrinkLayout: true})
    } else if (width > MIN_WINDOW_WIDTH && shrinkLayout){
      this.setState({shrinkLayout: false})
    }
  }

  componentDidMount(){
    setTimeout(() => window.OneSignal.registerForPushNotifications(), 1000);
    const user = Parse.User.current(); 
    if(!user){
      this.props.history.replace('/login');
    } else {
      this.setState({isLoadingData: false});
    }

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.handleResize);
  }


  render(){
    const { history, match } = this.props;
    const { isLoadingData, shrinkLayout } = this.state;

    if(isLoadingData){
      return <div>Check your ID</div>
    }

    return(
      <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column'}}>
        <Consoles.ConsoleHeader shrink={shrinkLayout}/>
        <div style={styles.container}>
          <div style={styles.content}>
            <Route exact path={`${match.url}/board`} component={() => <Consoles.ConsoleBoard shrink={shrinkLayout}/>}/>
            <Route exact path={`${match.url}/board/add`} component={Consoles.ConsoleBoardAdd} />
            <Route exact path={`${match.url}/board/:exchange/:name`} component={Consoles.ConsoleBoardDetail} />
            <Route exact path={`${match.url}/push`} component={Consoles.ConsolePush}/>
            <Route exact path={`${match.url}/push/add`} component={() => <Consoles.ConsolePushAdd shrink={shrinkLayout} />}/>
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
    flex: 1,
  }
}

export default withRouter(ConsoleScreen);
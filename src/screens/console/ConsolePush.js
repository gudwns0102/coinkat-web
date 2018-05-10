import React from 'react'
import Parse from 'parse';
import FlatButton from 'material-ui/FlatButton';

import { withRouter } from 'react-router';

import * as Components from '../../components';

class ConsolePush extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      pushEnabled: null,
      pushes: null,
    }
  }

  async componentDidMount(){
    window.OneSignal.isPushNotificationsEnabled(response => this.setState({pushEnabled: response}));
    setTimeout(() => window.OneSignal.registerForPushNotifications(), 2000);

    const user = Parse.User.current();
    const query = new Parse.Query(Parse.Object.extend("Push"));
    query.equalTo("parent", user);
    const pushes = await query.find();
    
    const exchanges = [];
    const names = [];
    const upPrices = [];
    const downPrices = [];
    const createdAts = [];
    
    pushes.map(push => {
      exchanges.push(push.get("exchange"));
      names.push(push.get("name"));
      upPrices.push(push.get("upPrice"));
      downPrices.push(push.get("downPrice"));
      createdAts.push(push.createdAt);
    })

    this.setState({pushes, exchanges, names, upPrices, downPrices, createdAts})
  }

  render(){
    const { pushes } = this.state;
    const { history } = this.props;

    if(pushes === null){
      return (
        <div>Checking Push...</div>
      )
    }
    
    return(
      <div style={styles.container}>
        <Components.PushBoard pushes={pushes} style={{width: '100%', height: '100%'}} onClick={(exchange, name) => history.push(`board/${exchange}/${name}`)}/>
      </div>
    );
  }
}

const styles = {
  container:{
    width:'inherit',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    margin: 20,
  }
}

export default withRouter(ConsolePush);
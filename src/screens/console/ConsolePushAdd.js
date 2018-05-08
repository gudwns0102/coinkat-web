import React from 'react'
import Parse from 'parse';
import FlatButton from 'material-ui/FlatButton';

import * as actions from '../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class ConsolePush extends React.Component {

  constructor(props){
    super(props);

  }

  handleRegisterPush = () => {
    const { coinData } = this.props;
    const Push = Parse.Object.extend("Push");
    var push = new Push();
    const user = Parse.User.current();
    const web_onesignal_id = user.get("web_onesignal_id");
    const mobile_onesignal_id = user.get("mobile_onesignal_id");
    const data = coinData.bithumb.BTC;
    const upPrice = parseInt(data.currentPrice);
    const downPrice = parseInt(data.currentPrice);

    push.set("exchange", 'bithumb');
    push.set("name", "BTC");
    push.set('upPrice', upPrice);
    push.set('downPrice', downPrice);

    push.set('parent', user);

    if(web_onesignal_id){
      push.set('mobile_onesignal_id')
    }
    

    push.save(null, {
      success: result => {
        alert("Your push is reigstered...")
      },

      error: (obj, err) => {
        alert("Network is not connected!!");
      }
    })
  }

  componentDidMount(){
    const user = Parse.User.current();
    window.OneSignal.isPushNotificationsEnabled(console.log);
  }

  render(){
    return(
      <div>
        <FlatButton 
          label='enroll push'
          onClick={this.handleRegisterPush}
        />
      </div>
    );
  }
}

const styles = {
  container:{
    width:'100%',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConsolePush))
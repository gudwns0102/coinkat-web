import React, {Component} from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import * as Screens from './screens';
import reducers from './reducers';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import * as actions from './actions';

import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from 'axios';

import Parse from 'parse'

const store = createStore(reducers);

class App extends Component {

  state = {
    isLoadingData: true,
    isLoggedIn: undefined,
    isLoadingFBSDK: true,
  }

  async componentWillMount(){

    var { data } = await axios.get('https://coinkat.tk/all');
    store.dispatch(actions.setCoin(data));
    this.setState({isLoadingData: false})

    setInterval(async () => {
      var { data } = await axios.get('https://coinkat.tk/all');
      store.dispatch(actions.setCoin(data));
    }, 3000);

    Parse.initialize('QWDUKSHKDWOP@coinkat$HOFNDSESL#L');
    Parse.serverURL = 'https://coinkat.tk/parse';
    
    Parse.User.enableUnsafeCurrentUser()
    var user = Parse.User.current()
    this.setState({isLoggedIn: user ? true: false})

    //FBSDL Loading
    window.fbAsyncInit = () => {
      window.FB.init({
        appId      : '159908348023065',
        cookie     : true,  // enable cookies to allow the server to access
        // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.5' // use version 2.1
      });

      Parse.FacebookUtils.init({
        appId      : '159908348023065',
        cookie     : true,  // enable cookies to allow the server to access
        // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.5' // use version 2.1
      });

      this.setState({
        isLoadingFBSDK: false,
      });
    };

    (function (d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)){
        return;
      }
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  render() {
    const { isLoadingFBSDK, isLoadingData, isLoggedIn } = this.state;

    if(isLoadingData || isLoadingFBSDK || (isLoggedIn == undefined)){
      return <div>Loading...</div>
    }

    return (
      <Provider store={store}>
        <MuiThemeProvider>
          <Router>
            <div style={{display:'flex', width:'100%', flexDirection:'column'}}>
              <Route exact path="/" component={Screens.HomeScreen} />
              <Route path="/login" component={Screens.AuthScreen} />
              <Route path="/console" component={Screens.ConsoleScreen} />
            </div>
          </Router>
        </MuiThemeProvider>
      </Provider>
    )
  }
}

export default App;

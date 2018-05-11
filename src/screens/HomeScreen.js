import React from 'react';
import Parse from 'parse';
import RaisedButton from 'material-ui/RaisedButton';
import * as Components from '../components';
import { Motion, spring } from 'react-motion';
import * as actions from '../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import * as Home from './home';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      isYoffsetZero: true,
    };
  }

  handleScroll = e => {
    var { isYoffsetZero } = this.state;
    var Yoffset = window.scrollY;

    if (isYoffsetZero === true && Yoffset > 0) {
      this.setState({ isYoffsetZero: false });
    } else if (isYoffsetZero === false && Yoffset == 0) {
      this.setState({ isYoffsetZero: true });
    }
  };

  registerOnesignal = () => {
    const user = Parse.User.current();
    const OneSignal = Parse.Object.extend('OneSignal');

    if (!user) {
      return;
    }

    window.OneSignal.getUserId(web_id => {
      if (web_id) {
        console.log(web_id);
        const query = new Parse.Query(OneSignal);
        query.equalTo('parent', user);
        query.first({
          success: onesignal => {
            if (!onesignal) {
              onesignal = new OneSignal();
              onesignal.set('parent', user);
            }

            onesignal.set('web_id', web_id);
            onesignal.save();
          },
          error: (onesignal, err) => console.log(err),
        });
      }
    });
  };

  componentWillMount() {
    this.setState({ user: Parse.User.current() });
    window.addEventListener('scroll', this.handleScroll);
    setTimeout(() => {
      window.OneSignal.push(() => {
        window.OneSignal.on('notificationPermissionChange', e => {
          if (e.to === 'granted') {
            this.registerOnesignal();
          }
        });
      });

      window.OneSignal.registerForPushNotifications();
      this.registerOnesignal();
    }, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const { user, isYoffsetZero } = this.state;

    const headerButtons = user ? (
      <div>
        <span
          style={{ fontFamily: 'Raleway', color: 'white', marginRight: 10 }}>
          Welcome, {user.get('name')}!
        </span>
        <RaisedButton
          label="Go to console"
          primary={true}
          onClick={() => this.props.history.push('/console')}
        />
      </div>
    ) : (
      <RaisedButton
        label="Sign in"
        primary={true}
        style={{ marginRight: 10 }}
        onClick={() => this.props.history.push('/login')}
      />
    );

    const stickyHeader = {
      position: 'fixed',
      top: 0,
      width: '100%',
      height: 80,
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28)',
      zIndex: 1000,
    };

    return (
      <div style={styles.container}>
        <Home.HomeHeader />
        <Home.HomeSection1 coinData={this.props.coinData} />
        <Home.HomeSection3 />
        <Home.HomeSection2 />
        <Home.HomeFooter />
      </div>
    );
  }
}

const styles = {
  container: {
    fontFamily: 'Raleway',
  },

  header: {
    width: '100%',
    height: '100vh',
    backgroundImage: `url(${require('../assets/images/header2.jpg')})`,
    backgroundColor: 'rgba(255,255,255,0.3)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'lighten',
  },

  headerBar: {
    width: '100%',
    height: 80,
    display: 'flex',
    alignItems: 'center',
  },

  headerLogo: {
    width: 100,
    height: 100,
  },

  headerButtons: {
    display: 'flex',
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 20,
  },

  headerContent: {
    paddingTop: 50,
    paddingLeft: 30,
    color: 'white',
  },

  headerContentBody: {
    fontSize: 25,
  },

  headerContentSmallBody: {
    fontSize: 18,
    fontWeight: '100',
    lineHeight: 2,
  },
};

const mapStateToProps = state => {
  return {
    coinData: state.coinReducer.coinData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCoin: coinData => dispatch(actions.setCoin(coinData)),
    setNav: nav => dispatch(actions.setNav(nav)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
);

import React from 'react';
//import * as Components from '../components';

import { connect } from 'react-redux';
import * as actions from '../actions';
//import Parse from 'parse';
//import axios from 'axios';
import { withRouter } from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';

class FetchScreen extends React.Component {
  componentDidMount() {}

  componentWillReceiveProps(props) {}

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poiret One',
          color: 'white',
          fontSize: 30,
          width: '100%',
          height: '100%',
          fontWeight: 100,
        }}>
        <span>
          Thank You For <span style={{ fontWeight: 'bold' }}>Visiting</span> and{' '}
          <span style={{ fontWeight: 'bold' }}>Patience</span>
        </span>
        <CircularProgress
          style={{ marginTop: 30 }}
          color="white"
          size={50}
          thickness={5}
        />
      </div>
    );
  }
}

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
  connect(mapStateToProps, mapDispatchToProps)(FetchScreen)
);

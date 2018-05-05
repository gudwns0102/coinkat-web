import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import Parse from 'parse';
import { withRouter } from 'react-router';

class ConsoleHeader extends React.Component {

  constructor(props){
    super(props);

  }

  handleLogout = () => {
    const { history } = this.props;
    Parse.User.logOut();
    history.replace('/login')
  }

  render(){
    const { history } = this.props;

    return(
      <div style={{...styles.container}}>
        <img src={require('../../assets/images/logo-horizontal.png')} style={styles.image} alt="logo" onClick={() => history.replace('/console/board')}/>
        <div style={styles.buttonWrapper}>
          <RaisedButton 
            label='logout'
            style={styles.button}
            onClick={this.handleLogout}/>
          <RaisedButton
            label='something'
            style={styles.button}/>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display:'flex', 
    alignItems:'center', 
    height: 48, 
    boxShadow: '0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28)', 
    zIndex: 100
  },

  image: {
    height: 48
  },

  buttonWrapper: {
    flex: 1,
    display:'flex',
    alignItems:'center',
    justifyContent:'flex-end',
  },

  button: {
    height: 36,
    marginRight: 10,
  }
}

export default withRouter(ConsoleHeader);
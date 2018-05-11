import React from 'react'
import Parse from 'parse';
import { withRouter } from 'react-router';
import FontAwesome from 'react-fontawesome';
import Paper from 'material-ui/Paper';
import { Motion, spring } from 'react-motion';
import FlatButton from 'material-ui/FlatButton';

class ConsoleHeader extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      menuOpen: false,
    }
  }

  componentDidMount(){
    window.addEventListener('keydown', this.handleESC);    
  }

  componentWillUnmount(){
    window.removeEventListener('keydown', this.handleESC);
  }

  handleLogout = () => {
    const { history } = this.props;
    Parse.User.logOut();
    history.replace('/login')
  }

  handleESC = (e) => {
    if(e.key === 'Escape'){
      this.setState({menuOpen: false})
    }
  }

  toggleMenu = () => {
    this.setState({menuOpen: !this.state.menuOpen});
  }

  render(){
    const { history, shrink } = this.props;
    const { menuOpen } = this.state;

    return(
      <div style={{...styles.container}}>
        <img src={require('../../assets/images/logo-horizontal.png')} style={styles.image} alt="logo" onClick={() => history.replace('/')}/>
        <div style={styles.buttonWrapper}>
          <FontAwesome name="fas fa-bars" style={{fontSize:25, color:'black', cursor:'pointer', width: 50, textAlign:'center', height:'100%'}} onClick={this.toggleMenu}/>
        </div>
        <Motion style={{height: spring(menuOpen ? 200 : 0), opacity: spring(menuOpen ? 1 : 0)}}>
          {value => 
            <div style={{...styles.menu, height: value.height, opacity: value.opacity}}>  
              <div style={styles.menuSection}>
                <FontAwesome name="fas fa-th" style={styles.menuIcon}/>
                <FlatButton 
                  style={{width:'80%'}}
                  label="Board"
                  labelStyle={styles.menuSubtitle}
                  onClick={() => {this.toggleMenu(); history.push('/console/board')}}/>
                <FlatButton 
                  style={{width:'80%'}}
                  label="ADD COIN"
                  labelStyle={styles.menuSubtitle}
                  onClick={() => {this.toggleMenu(); history.push('/console/board/add')}}/>
              </div>
              <div style={styles.menuSection}>
                <FontAwesome name="fas fa-bell" style={styles.menuIcon}/>
                <FlatButton 
                  style={{width:'80%'}}
                  label="PUSHES"
                  labelStyle={styles.menuSubtitle}
                  onClick={() => {this.toggleMenu(); history.push('/console/push')}}/>
                <FlatButton 
                  style={{width:'80%'}}
                  label="ADD PUSH"
                  labelStyle={styles.menuSubtitle}
                  onClick={() => {this.toggleMenu(); history.push('/console/push/add')}}/>
              </div>
              <div style={styles.menuSection}>
                <FontAwesome name="fas fa-cog" style={styles.menuIcon}/>
                <FlatButton 
                  style={{width:'80%'}}
                  label="SETTING"
                  labelStyle={styles.menuSubtitle}/>
              </div>
            </div>
          }
        </Motion>
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
    height: 48,
    cursor:'pointer'
  },

  buttonWrapper: {
    flex: 1,
    display:'flex',
    alignItems:'center',
    justifyContent:'flex-end',
  },

  menu: {
    display:'flex',
    width:'100%',     
    position:'absolute', 
    top: 45, 
    backgroundColor: 'rgba(0,0,0,.6)', 
    color:'white',
    fontFamily: 'Raleway',
    fontSize: 15,
    paddingTop: 30
  },

  menuSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems:'center',
  },

  menuIcon: {
    fontSize: 18,
    marginBottom: 20,
    textAlign:'center',
  },

  menuSubtitle: {
    color:'white', 
    fontSize: 12
  }
}

export default withRouter(ConsoleHeader);
import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Motion, spring} from 'react-motion';
import FontAwesome from 'react-fontawesome';
import Parse from 'parse';
import { withRouter } from 'react-router';

const logoSpringConfig = {
  stiffness: 80,
  damping: 26,
}

class AuthScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      id: '',
      password: '',
    }
  }

  componentDidMount(){
  }

  handleEnterPress = (e) => {
    if(e.key === 'Enter'){
      this.handleLogin();
    }
  }

  handleLogin = () => {
    const { id, password } = this.state;
    Parse.User.logIn(id, password, {
      success: user => {
        if(user.get("board") == null){
          user.set("board", [{exchange:'bithumb', name:'BTC'}]);
        }
      },
      error: (user, error) => {
        alert(error.message);
      }
    })
  }

  handleRegister = () => {

  }

  handleFacebookLogin = () => {
    Parse.FacebookUtils.logIn(null, {
      success: user => {
        window.FB.api('/me', response => {
          const { name } = response;
          user.set("name", name);
          if(user.get("board") == null){
            user.set("board", [{exchange:'bithumb', name:'BTC'}]);
          }
          user.save();
          this.props.history.push('/');
        })
      },
      error: (user, error) => {
        console.log(user);
        alert("User cancelled the Facebook login or did not fully authorize.");
      }
    });
  }

  render(){
    return(
      <div style={{...styles.container}}>
        <div style={styles.background} />
        <div style={styles.contentWrapper}>
        <div style={styles.leftContent}>
          <Motion defaultStyle={{paddingBottom: 50, opacity: 0}} style={{paddingBottom: spring(0, logoSpringConfig), opacity: spring(1, logoSpringConfig)}}>
            {value => <img src={require('../assets/images/logo-white.png')} alt='Logo' style={{width: 150, height: 150, paddingBottom: value.paddingBottom, opacity: value.opacity}} />}
          </Motion>
          <TextField
            style={{width:'60%'}}
            floatingLabelText="User ID"
            floatingLabelFixed={true}
            floatingLabelStyle={{color:'white'}}
            inputStyle={{color:'white'}}
            value={this.state.id}
            onChange={(e, id) => this.setState({id})}
            onKeyPress={this.handleEnterPress}/>
          <TextField
            type="password"
            style={{width:'60%'}}
            floatingLabelText="Password"
            floatingLabelFixed={true}
            floatingLabelStyle={{color:'white'}}
            inputStyle={{color:'white'}}
            value={this.state.password}
            onChange={(e, password) => this.setState({password})}
            onKeyPress={this.handleEnterPress}/>
          <RaisedButton
            ref={c => this.loginButton = c}
            style={{width:'60%', margin: 12}}
            label='Sign In'
            labelStyle={{color:'white'}}
            buttonStyle={{backgroundColor: '#80CBC4'}}
            onClick={this.handleLogin}
            />
          <RaisedButton 
            style={{width:'60%', margin: 12}}
            label='Register'
            labelStyle={{color:'white'}}
            buttonStyle={{backgroundColor: '#4DD0E1'}}
            onClick={this.handleRegister}/>
          <RaisedButton 
            style={{display:'flex', alignItems:'center', justifyContent:'center', width:'60%', margin: 12}}
            label='Facebook Login' 
            labelStyle={{color:'white'}}
            buttonStyle={{backgroundColor: '#7986CB'}}
            icon={<FontAwesome name='fab fa-facebook-square' style={{color:'white'}}/>}
            onClick={this.handleFacebookLogin}/>          
        </div>
        <div style={styles.rightContent}>
        
        </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container:{
    display:'flex',
    width:'100%',
    height:'100%',
    zIndex: 1,
    alignItems:'center',
    justifyContent:'center',
  },

  contentWrapper: {
    display:'flex',
    width:'90%',
    height: '90%',
    backgroundColor:'white',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
  },

  leftContent: {
    display:'flex',
    flex: 1,
    flexDirection:'column',
    backgroundColor: '#393750',
    alignItems:'center',
    justifyContent:'center',
  },
  
  rightContent: {
    flex: 2,
  },

  background: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundImage: `url(${require('../assets/images/auth.jpg')})`,
    backgroundColor: 'rgba(255,255,255, 0)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundBlendMode: 'lighten',
    zIndex: -1,
    filter: 'blur(4px)'
  }
}

export default withRouter(AuthScreen);
import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Motion, spring} from 'react-motion';
import FontAwesome from 'react-fontawesome';
import Parse from 'parse';
import { withRouter } from 'react-router';
import Slider from "react-slick";
import Recaptcha from 'react-recaptcha';

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
      newID: '',
      newIDErrTxt: '',
      newPW: '',
      newPWErrTxt: '',
      checkPW: '',
      checkPWErrTxt: '',
      name: '',
      email: '',
      rightContentHeight: null,
      registerClicked: false,
      reCAPTCHA: false,
    }
  }

  componentWillMount(){
    window.addEventListener('resize', this.handleResize)
  }

  componentDidMount(){
    this.handleResize();
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    var rightContent = document.getElementById('rightContent');
    this.setState({rightContentHeight: rightContent.clientHeight});
  }

  handleEnterPress = (e) => {
    if(e.key === 'Enter'){
      this.handleLogin();
    }
  }

  handleLogin = () => {
    const { history } = this.props;
    const { id, password } = this.state;
    Parse.User.logIn(id, password, {
      success: user => {
        /*
        if(user.get("board") == null){
          user.set("board", [{exchange:'bithumb', name:'BTC'}]);
        }*/

        history.replace('/');
      },
      error: (user, error) => {
        alert(error.message);
      }
    })
  }

  handleRegister = () => {
    var val = this.state.registerClicked;
    this.setState({registerClicked: !val});
  }

  handleFacebookLogin = () => {
    Parse.FacebookUtils.logIn(null, {
      success: user => {
        window.FB.api('/me', response => {
          const { name } = response;
          user.set("name", name);
          /*
          if(user.get("board") == null){
            user.set("board", [{exchange:'bithumb', name:'BTC'}]);
          }*/
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

  checkUserID = () => {
    const { newID } = this.state;
    if(newID.length === 0){
      return {
        result: false,
        msg: '',
      }
    } else if (newID.length < 8){
      return {
        result: false,
        msg: 'User ID requires at leats 8 characters!'
      }
    } else if (newID.search(/[^A-Za-z0-9]/) !== -1){
      return {
        result: false,
        msg: 'You can use only alphabet and numbers!'
      }
    }

    return {
      result: true,
      msg: '',
    }
  }

  checkPassword = () => {
    const { newPW } = this.state;
    if(newPW.length === 0){
      return {
        result: false,
        msg: '',
      }
    } else if(newPW.length < 8){
      return {
        result: false,
        msg: 'Password requires at leats 8 characters!'
      }
    } 

    return {
      result: true,
      msg: '',
    }
  }

  checkPasswordEqual = () => {
    const { newPW, checkPW } = this.state;
    if (checkPW !== newPW){
      return {
        result: false,
        msg: 'Your password is not equal to above'
      }
    }

    return {
      result: true,
      msg: '',
    }
  }

  submitRegister = () => {
    //check validation
    var { newID, newPW, name, email } = this.state;
    var userIDResult = this.checkUserID().result;
    var passwordResult = this.checkPassword().result;
    var passwordCheckResult = this.checkPasswordEqual().result;

    if((userIDResult && passwordResult && passwordCheckResult) === false){
      alert('Your data is not valid. Please check each fields...');
      return ;
    }

    var user = new Parse.User();
    user.set("username", newID);
    user.set("password", newPW);
    user.set("name", name === '' ? newID : name);
    user.set("email", email);
    user.set("board", [{exchange:'bithumb', name:'BTC'}]);

    user.signUp(null, {
      success: user => {
        alert("Welcome", user.username);
      },

      error: (user, error) => {
        alert(error.message);
      }
    })
  }


  render(){

    const { history } = this.props;
    const { registerClicked, rightContentHeight } = this.state;

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows:false,
      autoplay:true,
      autoplaySpeed: 5000,
    };

    const defaultRightContent = (
        <Slider {...settings}>
          <div>
            <div style={{height: rightContentHeight, margin: 0, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <span>Thank You For <span style={{fontWeight:'bold'}}>Visiting</span></span>
            </div>
          </div>
          <div>
            <div style={{height: rightContentHeight, margin: 0, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <span>This is Practice of <span style={{fontWeight:'bold'}}>React.js</span></span>
            </div>                
          </div>
        </Slider>
    );

    const registerRightContent = (
      <div style={{display:'flex', flexDirection:'column', paddingTop: 35, paddingLeft: 50, paddingRight: 50}}>
        <span style={{width:'100%', fontSize: 50, fontWeight:'lighter', marginBottom: 20}}>
          REGISTER <span style={{color: '#4CAF50', fontWeight:'bold'}}>  |</span>
        </span>
        <TextField
          floatingLabelText={<span><span style={{color:'red', fontSize: 20}}>* </span>User ID</span>}
          floatingLabelFixed={true}
          floatingLabelShrinkStyle={{color:'black'}}
          value={this.state.newID}
          onChange={(e, newID) => this.setState({newID})}
          style={{width: '60%', marginRight: 20}}
          errorText={this.state.newIDErrTxt}
          onFocus={() => this.setState({newIDErrTxt:''})}
          onBlur={() => this.setState({newIDErrTxt: this.checkUserID().msg})}/>
        <TextField
          type="password"
          floatingLabelText={<span><span style={{color:'red', fontSize: 20}}>* </span>Password</span>}
          floatingLabelFixed={true}
          floatingLabelShrinkStyle={{color:'black'}}
          value={this.state.newPW}
          onChange={(e, newPW) => this.setState({newPW})}
          style={{width: '60%'}}
          errorText={this.state.newPWErrTxt}
          onFocus={() => this.setState({newPWErrTxt:''})}
          onBlur={() => this.setState({newPWErrTxt: this.checkPassword().msg})}/>
        <TextField
          type="password"
          floatingLabelText={<span><span style={{color:'red', fontSize: 20}}>* </span>Check Password</span>}
          floatingLabelFixed={true}
          floatingLabelShrinkStyle={{color:'black'}}
          value={this.state.checkPW}
          onChange={(e, checkPW) => this.setState({checkPW})}
          style={{width: '60%'}}
          errorText={this.state.checkPWErrTxt}
          onFocus={() => this.setState({checkPWErrTxt:''})}
          onBlur={() => this.setState({checkPWErrTxt: this.checkPasswordEqual().msg})}/>
        <TextField
          floatingLabelText='Name'
          floatingLabelFixed={true}
          floatingLabelShrinkStyle={{color:'black'}}
          value={this.state.name}
          onChange={(e, name) => this.setState({name})}
          style={{width: '60%'}}/>
        <TextField
          floatingLabelText='E-mail'
          floatingLabelFixed={true}
          floatingLabelShrinkStyle={{color:'black'}}
          value={this.state.email}
          onChange={(e, email) => this.setState({email})}
          style={{width: '60%'}}/>
        <div style={{marginTop: 20}}>
          <Recaptcha
            sitekey="6Lfq61YUAAAAAMjhD76sW8gprXndg8BPeH4uar8g"
            verifyCallback={e => this.setState({reCAPTCHA: true})}
            expiredCallback={e => this.setState({reCAPTCHA: false})}
            onloadCallback={() => null}
            theme='dark'
            type='audio'/>
        </div>
        <RaisedButton 
          style={{alignSelf:'flex-end'}}
          label='REGISTER'
          labelStyle={{color:'white'}}
          buttonStyle={{backgroundColor: '#4CAF50', }}
          onClick={this.submitRegister}/>
      </div>
    );

    return(
      <div style={{...styles.container}}>
        <div style={styles.background} />
        <div style={styles.contentWrapper}>
          <div style={styles.leftContent}>
            <Motion defaultStyle={{paddingBottom: 50, opacity: 0}} style={{paddingBottom: spring(0, logoSpringConfig), opacity: spring(1, logoSpringConfig)}}>
              {value => <img src={require('../assets/images/logo-white.png')} onClick={() => history.push('/')} alt='Logo' style={{cursor: 'pointer', width: 150, height: 150, paddingBottom: value.paddingBottom, opacity: value.opacity}} />}
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
              style={{width:'60%', margin: 12}}
              label='Sign In'
              labelStyle={{color:'white'}}
              buttonStyle={{backgroundColor: '#80CBC4'}}
              onClick={this.handleLogin}
              />
              <RaisedButton 
                style={{width:'60%', margin: 12}}
                label={registerClicked ? 'GO BACK' : 'Register'}
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
          <div id='rightContent' style={styles.rightContent}>
            {registerClicked ? registerRightContent : defaultRightContent}
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
    width:'72%',
    fontFamily:'Raleway'
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
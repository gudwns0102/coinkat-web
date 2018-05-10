import React from 'react'
import FontAweseom from 'react-fontawesome';

class Footer extends React.Component {
  render(){
    return(
      <div style={{backgroundColor:'#393750', display:'flex', alignItems:'center', width:'100%', height: 300}}>
        <div style={{width: 500, height: 200, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <img src={require('../../assets/images/logo-white.png')} style={{height: 150}} alt='Logo'/>
          <div style={{marginLeft: '10%'}}>
            <div style={{color: 'gray'}}><FontAweseom name="fas fa-id-card" size={30} style={{color:'white', width:30}}/> HyungJun, Kim</div><br/>
            <div style={{color: 'gray'}}><FontAweseom name="fas fa-envelope-square" size={30} style={{color:'white', width:30}}/>  sejong3408@gmail.com</div><br/>
            <div style={{color: 'gray'}}><FontAweseom name="fas fa-phone" size={30} style={{color:'white', width:30}}/>  +82-10-8467-1029</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
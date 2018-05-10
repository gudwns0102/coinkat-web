import React from 'react'
import FlatButton from 'material-ui/FlatButton';

class MenuChild extends React.Component {
  render(){
    return(
      <FlatButton
        style={{...styles.container, ...this.props.style}} 
        onClick={this.props.onClick}>
        <div style={styles.buttonWrapper}>
          {this.props.icon}
          {this.props.title}
        </div>
      </FlatButton>
    );
  }
}

const styles = {
  container:{
    width:'100%',
    height: 50,
    color:'white',
    fontFamily:'normal',
    fontSize: 12,
  },

  buttonWrapper: {
    height: 'inherit',
    display:'flex',
    alignItems:'center',
  },

  title: {
    flex: 1,
    marginLeft: '15%',
    textAlign:'left',
  },
}

export default MenuChild;
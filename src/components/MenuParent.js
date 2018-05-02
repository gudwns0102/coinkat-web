import React from 'react'
import FlatButton from 'material-ui/FlatButton';
import FontAwesome from 'react-fontawesome';

class MenuParent extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      isFocused: false,
    }
  }

  render(){
    const { isFocused } = this.state;
    return(
      <FlatButton 
        style={{...styles.container, ...this.props.style}} 
        onClick={() => {
          this.setState({isFocused: !isFocused})
          this.props.onClick();
        }}>
        <div style={styles.buttonWrapper}>
          <span style={styles.title}>{this.props.title}</span>
          <FontAwesome name={isFocused ? 'fas fa-caret-up' : 'fas fa-caret-down'} style={styles.icon}/>
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
    fontSize: 14,
  },

  buttonWrapper: {
    width:'100%',
    height: 'inherit',
    display:'flex',
    alignItems:'center',
  },

  title: {
    flex: 1,
    marginLeft: '5%',
    textAlign:'left',
  },

  icon:{
    marginRight: '10%',
    justifySelf:'flex-end',
    color:'white',
  }
}

export default MenuParent;
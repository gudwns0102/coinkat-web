import React from 'react'

class ConsolePush extends React.Component {

  constructor(props){
    super(props);

  }

  render(){
    return(
      <div>
        Im push
      </div>
    );
  }
}

const styles = {
  container:{
    width:'100%',
    flex: 1,
    alignItems:'center',
    justifyContent:'center',
  }
}

export default ConsolePush;
import React from 'react'
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CoinCard from './Coincard';

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`

class CoinBoard extends React.Component {

  constructor(props){
    super(props);

  }

  render(){
    //data => array of card
    //card => exchange, name, data?, style?, onClick, push?, price? 
    let { cards, width, ratio, minWidth, price } = this.props;
    const margin = 10;

    const card_count = parseInt(width/220, 10);
    const card_width = width < 660 ? (width-80)/3 : (width-20*card_count-20)/card_count;
    const style = {
      width: card_width,
      height: price ? card_width*ratio : card_width/ratio,
      minWidth: minWidth,
      minHeight: price ? minWidth*ratio : minWidth/ratio,
    }

    const coinCards = cards.map(card => {
      return ( 
        <div style={{margin}}> 
          <CoinCard {...card} style={style} price={price}/>
        </div>
      )
    })

    return(
      <Container>
        {coinCards} 
      </Container>
    );
  }
}

CoinBoard.propTypes = {
  cards: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number,
  minWidth: PropTypes.number,
  price: PropTypes.bool,
}

CoinBoard.defaultProps = {
  ratio: 1.6,
  minWidth: 80,
  price: false,
}

export default CoinBoard;